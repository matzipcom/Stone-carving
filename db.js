/* 돌 보관함 공용 저장소 (IndexedDB) */
const DB_NAME = 'stone-carving';
const STORE = 'stones';

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tx(db, mode) {
  return db.transaction(STORE, mode).objectStore(STORE);
}

function wrap(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/* 저장(새 작품) 또는 덮어쓰기(id 포함 시). 저장된 id 반환 */
export async function saveStone(record) {
  const db = await openDB();
  return wrap(tx(db, 'readwrite').put(record));
}

export async function listStones() {
  const db = await openDB();
  const all = await wrap(tx(db, 'readonly').getAll());
  return all.sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function getStone(id) {
  const db = await openDB();
  return wrap(tx(db, 'readonly').get(id));
}

export async function deleteStone(id) {
  const db = await openDB();
  return wrap(tx(db, 'readwrite').delete(id));
}
