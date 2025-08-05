// Polyfills for server-side rendering
if (typeof window === 'undefined') {
  // Mock indexedDB for server-side rendering
  global.indexedDB = {
    open: () => ({
      onsuccess: null,
      onerror: null,
      result: {
        transaction: () => ({
          objectStore: () => ({
            get: () => ({ onsuccess: null, onerror: null }),
            put: () => ({ onsuccess: null, onerror: null }),
            delete: () => ({ onsuccess: null, onerror: null }),
          }),
        }),
      },
    }),
  } as any;

  global.IDBKeyRange = {
    bound: () => ({}),
    only: () => ({}),
    lowerBound: () => ({}),
    upperBound: () => ({}),
  } as any;

  // Mock other browser APIs that might be needed
  global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
  } as any;

  global.sessionStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
  } as any;
}