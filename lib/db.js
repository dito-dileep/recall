(function () {
  const DB_NAME = "recall-local-db";
  const DB_VERSION = 2;
  const SESSION_STORE = "sessions";
  const REVIEW_CARD_STORE = "reviewCards";

  let dbPromise;

  function ensureStore(db, storeName, keyPath, indexes = [], upgradeTransaction = null) {
    let store;
    if (!db.objectStoreNames.contains(storeName)) {
      store = db.createObjectStore(storeName, { keyPath });
    } else if (upgradeTransaction) {
      store = upgradeTransaction.objectStore(storeName);
    }

    if (!store) {
      return;
    }

    for (const index of indexes) {
      if (!store.indexNames.contains(index.name)) {
        store.createIndex(index.name, index.keyPath);
      }
    }
  }

  function openDb() {
    if (dbPromise) {
      return dbPromise;
    }

    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        const upgradeTransaction = request.transaction;
        ensureStore(db, SESSION_STORE, "id", [
          { name: "capturedAt", keyPath: "capturedAt" },
          { name: "hostname", keyPath: "hostname" }
        ], upgradeTransaction);
        ensureStore(db, REVIEW_CARD_STORE, "id", [
          { name: "nextDueAt", keyPath: "nextDueAt" },
          { name: "lastSeenAt", keyPath: "lastSeenAt" }
        ], upgradeTransaction);
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return dbPromise;
  }

  async function withStore(storeName, mode, callback) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, mode);
      const store = transaction.objectStore(storeName);
      const value = callback(store);

      transaction.oncomplete = () => resolve(value);
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  }

  async function saveSession(session) {
    return withStore(SESSION_STORE, "readwrite", (store) => {
      store.put(session);
    });
  }

  async function saveSessions(sessions) {
    return withStore(SESSION_STORE, "readwrite", (store) => {
      for (const session of sessions) {
        store.put(session);
      }
    });
  }

  async function deleteSession(sessionId) {
    return withStore(SESSION_STORE, "readwrite", (store) => {
      store.delete(sessionId);
    });
  }

  async function saveReviewCard(reviewCard) {
    return withStore(REVIEW_CARD_STORE, "readwrite", (store) => {
      store.put(reviewCard);
    });
  }

  async function saveReviewCards(reviewCards) {
    return withStore(REVIEW_CARD_STORE, "readwrite", (store) => {
      for (const reviewCard of reviewCards) {
        store.put(reviewCard);
      }
    });
  }

  async function getAllSessions() {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(SESSION_STORE, "readonly");
      const store = transaction.objectStore(SESSION_STORE);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async function getAllReviewCards() {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(REVIEW_CARD_STORE, "readonly");
      const store = transaction.objectStore(REVIEW_CARD_STORE);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async function clearSessions() {
    return withStore(SESSION_STORE, "readwrite", (store) => {
      store.clear();
    });
  }

  async function clearReviewCards() {
    return withStore(REVIEW_CARD_STORE, "readwrite", (store) => {
      store.clear();
    });
  }

  async function getStats() {
    const sessions = await getAllSessions();
    const topics = new Set();
    const sources = new Set();

    for (const session of sessions) {
      sources.add(session.hostname);
      for (const topic of session.topics || []) {
        topics.add(topic);
      }
    }

    const latest = sessions.sort((left, right) => right.capturedAt - left.capturedAt)[0];

    return {
      sessionCount: sessions.length,
      topicCount: topics.size,
      sourceCount: sources.size,
      lastCapturedAt: latest ? latest.capturedAt : null
    };
  }

  globalThis.RecallDB = {
    clearReviewCards,
    clearSessions,
    deleteSession,
    getAllReviewCards,
    getAllSessions,
    getStats,
    saveReviewCard,
    saveReviewCards,
    saveSession,
    saveSessions
  };
})();
