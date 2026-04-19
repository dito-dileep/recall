const fs = require("fs");
const path = require("path");
const JSZip = require("jszip");

const W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
const R_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
const REL_NS = "http://schemas.openxmlformats.org/package/2006/relationships";
const CONTENT_TYPES_NS = "http://schemas.openxmlformats.org/package/2006/content-types";

function usage() {
  console.error("Usage: node tools/md_to_docx.js [--max-image-width-in=5.2] <input.md> <output.docx>");
  process.exit(1);
}

let maxImageWidthIn = 6.3;
const positionalArgs = [];

for (let index = 2; index < process.argv.length; index += 1) {
  const arg = process.argv[index];
  if (arg.startsWith("--max-image-width-in=")) {
    const value = Number(arg.split("=")[1]);
    if (!Number.isFinite(value) || value <= 0) {
      console.error(`Invalid value for --max-image-width-in: ${arg}`);
      process.exit(1);
    }
    maxImageWidthIn = value;
    continue;
  }
  positionalArgs.push(arg);
}

if (positionalArgs.length < 2) {
  usage();
}

const inputPath = path.resolve(positionalArgs[0]);
const outputPath = path.resolve(positionalArgs[1]);
const markdownDir = path.dirname(inputPath);

if (!fs.existsSync(inputPath)) {
  console.error(`Input file not found: ${inputPath}`);
  process.exit(1);
}

function xmlEscape(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function preserveText(value) {
  return `<w:t xml:space="preserve">${xmlEscape(value)}</w:t>`;
}

function makeRun(text, options = {}) {
  const props = [];
  if (options.bold) {
    props.push("<w:b/>");
  }
  if (options.code) {
    props.push(
      '<w:rFonts w:ascii="Consolas" w:hAnsi="Consolas" w:cs="Consolas"/>',
      '<w:shd w:val="clear" w:fill="EDEDED"/>'
    );
  }
  if (options.italic) {
    props.push("<w:i/>");
  }
  const rPr = props.length ? `<w:rPr>${props.join("")}</w:rPr>` : "";
  return `<w:r>${rPr}${preserveText(text)}</w:r>`;
}

function parseInline(text) {
  const runs = [];
  let cursor = 0;

  while (cursor < text.length) {
    const boldAt = text.indexOf("**", cursor);
    const codeAt = text.indexOf("`", cursor);
    let nextAt = -1;
    let token = null;

    if (boldAt !== -1 && (codeAt === -1 || boldAt < codeAt)) {
      nextAt = boldAt;
      token = "bold";
    } else if (codeAt !== -1) {
      nextAt = codeAt;
      token = "code";
    }

    if (nextAt === -1) {
      runs.push(makeRun(text.slice(cursor)));
      break;
    }

    if (nextAt > cursor) {
      runs.push(makeRun(text.slice(cursor, nextAt)));
    }

    if (token === "bold") {
      const end = text.indexOf("**", nextAt + 2);
      if (end === -1) {
        runs.push(makeRun(text.slice(nextAt)));
        break;
      }
      runs.push(makeRun(text.slice(nextAt + 2, end), { bold: true }));
      cursor = end + 2;
      continue;
    }

    const end = text.indexOf("`", nextAt + 1);
    if (end === -1) {
      runs.push(makeRun(text.slice(nextAt)));
      break;
    }
    runs.push(makeRun(text.slice(nextAt + 1, end), { code: true }));
    cursor = end + 1;
  }

  return runs.join("");
}

function paragraphXml(text, options = {}) {
  const pPr = [];
  if (options.styleId) {
    pPr.push(`<w:pStyle w:val="${options.styleId}"/>`);
  }
  if (options.align) {
    pPr.push(`<w:jc w:val="${options.align}"/>`);
  }
  if (options.indentLeft || options.hanging) {
    const attrs = [];
    if (options.indentLeft) {
      attrs.push(`w:left="${options.indentLeft}"`);
    }
    if (options.hanging) {
      attrs.push(`w:hanging="${options.hanging}"`);
    }
    pPr.push(`<w:ind ${attrs.join(" ")}/>`);
  }
  if (options.keepNext) {
    pPr.push("<w:keepNext/>");
  }

  const pPrXml = pPr.length ? `<w:pPr>${pPr.join("")}</w:pPr>` : "";
  const runsXml = parseInline(text);
  return `<w:p>${pPrXml}${runsXml}</w:p>`;
}

function parseTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isSeparatorRow(cells) {
  return cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function startsSpecial(line) {
  return (
    /^#{1,6}\s+/.test(line) ||
    /^!\[.*\]\(.*\)$/.test(line) ||
    /^\|/.test(line) ||
    /^\d+\.\s+/.test(line) ||
    /^-\s+/.test(line)
  );
}

function parseMarkdown(content) {
  const lines = content.split(/\r?\n/);
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      i += 1;
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      blocks.push({
        type: "heading",
        level: headingMatch[1].length,
        text: headingMatch[2].trim(),
      });
      i += 1;
      continue;
    }

    const imageMatch = line.match(/^!\[(.*)\]\((.*)\)$/);
    if (imageMatch) {
      blocks.push({
        type: "image",
        alt: imageMatch[1].trim(),
        src: imageMatch[2].trim(),
      });
      i += 1;
      continue;
    }

    if (line.startsWith("|")) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i].trim());
        i += 1;
      }
      const rows = tableLines.map(parseTableRow);
      const filteredRows = rows.filter((cells, index) => index !== 1 || !isSeparatorRow(cells));
      blocks.push({ type: "table", rows: filteredRows });
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length) {
        const itemLine = lines[i].trim();
        const match = itemLine.match(/^(\d+)\.\s+(.*)$/);
        if (!match) {
          break;
        }
        items.push(match[2]);
        i += 1;
      }
      blocks.push({ type: "numbered_list", items });
      continue;
    }

    if (/^-\s+/.test(line)) {
      const items = [];
      while (i < lines.length) {
        const itemLine = lines[i].trim();
        const match = itemLine.match(/^-\s+(.*)$/);
        if (!match) {
          break;
        }
        items.push(match[1]);
        i += 1;
      }
      blocks.push({ type: "bullet_list", items });
      continue;
    }

    const paragraphLines = [line];
    i += 1;
    while (i < lines.length) {
      const nextLine = lines[i].trim();
      if (!nextLine || startsSpecial(nextLine)) {
        break;
      }
      paragraphLines.push(nextLine);
      i += 1;
    }
    blocks.push({ type: "paragraph", text: paragraphLines.join(" ") });
  }

  return blocks;
}

function getImageInfo(filePath) {
  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".png" && buffer.length >= 24) {
    return {
      extension: "png",
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20),
      data: buffer,
    };
  }

  if ((ext === ".jpg" || ext === ".jpeg") && buffer.length >= 4) {
    let offset = 2;
    while (offset < buffer.length) {
      if (buffer[offset] !== 0xff) {
        offset += 1;
        continue;
      }
      const marker = buffer[offset + 1];
      const size = buffer.readUInt16BE(offset + 2);
      if (
        marker >= 0xc0 &&
        marker <= 0xc3 &&
        size >= 7
      ) {
        return {
          extension: ext === ".jpg" ? "jpg" : "jpeg",
          width: buffer.readUInt16BE(offset + 7),
          height: buffer.readUInt16BE(offset + 5),
          data: buffer,
        };
      }
      offset += 2 + size;
    }
  }

  return {
    extension: ext.replace(".", "") || "png",
    width: 1200,
    height: 800,
    data: buffer,
  };
}

function imageDrawingXml(relId, imageIndex, widthPx, heightPx, maxWidthInches) {
  const maxWidthEmu = maxWidthInches * 914400;
  const baseCx = widthPx * 9525;
  const baseCy = heightPx * 9525;
  const scale = baseCx > maxWidthEmu ? maxWidthEmu / baseCx : 1;
  const cx = Math.round(baseCx * scale);
  const cy = Math.round(baseCy * scale);

  return (
    '<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:drawing>' +
    `<wp:inline distT="0" distB="0" distL="0" distR="0" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing">` +
    `<wp:extent cx="${cx}" cy="${cy}"/>` +
    '<wp:effectExtent l="0" t="0" r="0" b="0"/>' +
    `<wp:docPr id="${imageIndex}" name="Picture ${imageIndex}"/>` +
    '<wp:cNvGraphicFramePr><a:graphicFrameLocks noChangeAspect="1" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"/></wp:cNvGraphicFramePr>' +
    '<a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">' +
    '<a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">' +
    '<pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">' +
    '<pic:nvPicPr>' +
    `<pic:cNvPr id="${imageIndex}" name="Picture ${imageIndex}"/>` +
    "<pic:cNvPicPr/>" +
    "</pic:nvPicPr>" +
    '<pic:blipFill>' +
    `<a:blip r:embed="${relId}"/>` +
    "<a:stretch><a:fillRect/></a:stretch>" +
    "</pic:blipFill>" +
    '<pic:spPr>' +
    `<a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm>` +
    '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom>' +
    "</pic:spPr>" +
    "</pic:pic>" +
    "</a:graphicData>" +
    "</a:graphic>" +
    "</wp:inline>" +
    "</w:drawing></w:r></w:p>"
  );
}

function tableXml(rows) {
  if (!rows.length) {
    return "";
  }

  const cols = rows[0].length;
  const tableWidth = 9000;
  const colWidth = Math.floor(tableWidth / Math.max(cols, 1));
  const grid = Array.from({ length: cols }, () => `<w:gridCol w:w="${colWidth}"/>`).join("");

  const rowXml = rows
    .map((row, rowIndex) => {
      const cells = row
        .map((cell) => {
          const cellRuns = parseInline(cell);
          const headerProps =
            rowIndex === 0
              ? "<w:pPr><w:spacing w:after=\"80\"/></w:pPr><w:r><w:rPr><w:b/></w:rPr><w:t xml:space=\"preserve\"></w:t></w:r>"
              : "";
          const headerContent =
            rowIndex === 0
              ? `<w:p><w:pPr><w:spacing w:after="80"/></w:pPr>${makeRun(cell, { bold: true })}</w:p>`
              : `<w:p>${cellRuns}</w:p>`;

          return (
            `<w:tc><w:tcPr><w:tcW w:w="${colWidth}" w:type="dxa"/></w:tcPr>` +
            headerContent +
            "</w:tc>"
          );
        })
        .join("");
      return `<w:tr>${cells}</w:tr>`;
    })
    .join("");

  return (
    '<w:tbl>' +
    '<w:tblPr>' +
    '<w:tblStyle w:val="TableGrid"/>' +
    '<w:tblW w:w="0" w:type="auto"/>' +
    '<w:tblLook w:val="04A0" w:firstRow="1" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:noHBand="0" w:noVBand="1"/>' +
    "</w:tblPr>" +
    `<w:tblGrid>${grid}</w:tblGrid>` +
    rowXml +
    "</w:tbl>"
  );
}

function buildStylesXml() {
  return (
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<w:styles xmlns:w="${W_NS}">` +
    "<w:docDefaults>" +
    "<w:rPrDefault><w:rPr>" +
    '<w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>' +
    '<w:sz w:val="22"/><w:szCs w:val="22"/>' +
    "</w:rPr></w:rPrDefault>" +
    '<w:pPrDefault><w:pPr><w:spacing w:after="160" w:line="300" w:lineRule="auto"/></w:pPr></w:pPrDefault>' +
    "</w:docDefaults>" +
    '<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>' +
    '<w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:after="260"/></w:pPr><w:rPr><w:b/><w:sz w:val="34"/><w:szCs w:val="34"/><w:color w:val="203040"/></w:rPr></w:style>' +
    '<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:before="160" w:after="120"/></w:pPr><w:rPr><w:b/><w:sz w:val="28"/><w:szCs w:val="28"/><w:color w:val="203040"/></w:rPr></w:style>' +
    '<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:before="140" w:after="100"/></w:pPr><w:rPr><w:b/><w:sz w:val="24"/><w:szCs w:val="24"/><w:color w:val="203040"/></w:rPr></w:style>' +
    '<w:style w:type="paragraph" w:styleId="Heading3"><w:name w:val="heading 3"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:before="120" w:after="80"/></w:pPr><w:rPr><w:b/><w:sz w:val="22"/><w:szCs w:val="22"/><w:color w:val="203040"/></w:rPr></w:style>' +
    '<w:style w:type="table" w:styleId="TableGrid"><w:name w:val="Table Grid"/><w:tblPr><w:tblBorders><w:top w:val="single" w:sz="8" w:space="0" w:color="B7C1CC"/><w:left w:val="single" w:sz="8" w:space="0" w:color="B7C1CC"/><w:bottom w:val="single" w:sz="8" w:space="0" w:color="B7C1CC"/><w:right w:val="single" w:sz="8" w:space="0" w:color="B7C1CC"/><w:insideH w:val="single" w:sz="8" w:space="0" w:color="D5DCE3"/><w:insideV w:val="single" w:sz="8" w:space="0" w:color="D5DCE3"/></w:tblBorders></w:tblPr></w:style>' +
    "</w:styles>"
  );
}

function buildContentTypes(imageExtensions) {
  const imageDefaults = Array.from(new Set(imageExtensions))
    .map((ext) => `<Default Extension="${xmlEscape(ext)}" ContentType="image/${ext === "jpg" ? "jpeg" : ext}"/>`)
    .join("");

  return (
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<Types xmlns="${CONTENT_TYPES_NS}">` +
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
    '<Default Extension="xml" ContentType="application/xml"/>' +
    imageDefaults +
    '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
    '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>' +
    '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>' +
    '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>' +
    "</Types>"
  );
}

function buildRootRels() {
  return (
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<Relationships xmlns="${REL_NS}">` +
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
    '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>' +
    '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>' +
    "</Relationships>"
  );
}

function buildDocPropsCore(title) {
  const now = new Date().toISOString();
  return (
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
    `<dc:title>${xmlEscape(title)}</dc:title>` +
    "<dc:creator>Codex</dc:creator>" +
    "<cp:lastModifiedBy>Codex</cp:lastModifiedBy>" +
    `<dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created>` +
    `<dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified>` +
    "</cp:coreProperties>"
  );
}

function buildDocPropsApp() {
  return (
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">' +
    "<Application>Codex</Application>" +
    "</Properties>"
  );
}

async function main() {
  const markdown = fs.readFileSync(inputPath, "utf8");
  const blocks = parseMarkdown(markdown);
  const zip = new JSZip();
  const docParts = [];
  const rels = [
    {
      id: "rId1",
      type: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles",
      target: "styles.xml",
    },
  ];
  const imageExtensions = [];

  let nextRelId = 2;
  let imageCount = 1;

  for (const block of blocks) {
    if (block.type === "heading") {
      const styleId =
        block.level === 1
          ? "Title"
          : block.level === 2
            ? "Heading1"
            : block.level === 3
              ? "Heading2"
              : "Heading3";
      docParts.push(paragraphXml(block.text, { styleId, keepNext: block.level <= 3 }));
      continue;
    }

    if (block.type === "paragraph") {
      docParts.push(paragraphXml(block.text));
      continue;
    }

    if (block.type === "bullet_list") {
      for (const item of block.items) {
        docParts.push(paragraphXml(`${String.fromCharCode(8226)} ${item}`, { indentLeft: 720, hanging: 360 }));
      }
      continue;
    }

    if (block.type === "numbered_list") {
      block.items.forEach((item, index) => {
        docParts.push(paragraphXml(`${index + 1}. ${item}`, { indentLeft: 720, hanging: 360 }));
      });
      continue;
    }

    if (block.type === "table") {
      docParts.push(tableXml(block.rows));
      continue;
    }

    if (block.type === "image") {
      const sourcePath = path.resolve(markdownDir, block.src);
      if (!fs.existsSync(sourcePath)) {
        docParts.push(paragraphXml(`[Missing image: ${block.src}]`));
        continue;
      }

      const info = getImageInfo(sourcePath);
      const relId = `rId${nextRelId}`;
      const mediaName = `image${imageCount}.${info.extension}`;
      imageExtensions.push(info.extension);
      rels.push({
        id: relId,
        type: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image",
        target: `media/${mediaName}`,
      });
      zip.file(`word/media/${mediaName}`, info.data);
      docParts.push(imageDrawingXml(relId, imageCount, info.width, info.height, maxImageWidthIn));
      nextRelId += 1;
      imageCount += 1;
    }
  }

  const documentXml =
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<w:document xmlns:w="${W_NS}" xmlns:r="${R_NS}" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">` +
    "<w:body>" +
    docParts.join("") +
    '<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1080" w:bottom="1440" w:left="1080" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr>' +
    "</w:body></w:document>";

  const documentRels =
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<Relationships xmlns="${REL_NS}">` +
    rels
      .map(
        (rel) =>
          `<Relationship Id="${rel.id}" Type="${rel.type}" Target="${xmlEscape(rel.target)}"/>`
      )
      .join("") +
    "</Relationships>";

  zip.file("[Content_Types].xml", buildContentTypes(imageExtensions));
  zip.file("_rels/.rels", buildRootRels());
  zip.file("docProps/core.xml", buildDocPropsCore(path.basename(inputPath, path.extname(inputPath))));
  zip.file("docProps/app.xml", buildDocPropsApp());
  zip.file("word/document.xml", documentXml);
  zip.file("word/styles.xml", buildStylesXml());
  zip.file("word/_rels/document.xml.rels", documentRels);

  const outputBuffer = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  fs.writeFileSync(outputPath, outputBuffer);
  console.log(`Wrote ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
