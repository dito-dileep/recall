const PASSPORT_PRINT_STORAGE_KEY = "passportPrintModel";
const passportRoot = document.getElementById("passport-root");
const toolbarCopy = document.getElementById("toolbar-copy");
const printPassportButton = document.getElementById("print-passport");
const closePassportButton = document.getElementById("close-passport");

async function loadPassport() {
  const stored = await chrome.storage.local.get({ [PASSPORT_PRINT_STORAGE_KEY]: null });
  const model = stored[PASSPORT_PRINT_STORAGE_KEY];

  if (!model) {
    passportRoot.innerHTML = `
      <section class="passport-sheet">
        <div class="panel">
          <h2>No passport loaded yet</h2>
          <p>Open the Recall dashboard and click <strong>Printable passport</strong> to generate a fresh print view.</p>
        </div>
      </section>
    `;
    return;
  }

  toolbarCopy.textContent = `Generated ${RecallShared.formatDateTime(model.generatedAt || Date.now())}. Use your browser's print dialog to save a clean PDF.`;
  passportRoot.innerHTML = RecallShared.buildPassportMarkup(model);
}

printPassportButton.addEventListener("click", () => {
  window.print();
});

closePassportButton.addEventListener("click", () => {
  window.close();
});

loadPassport();
