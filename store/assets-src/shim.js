// Ersatz für die Extension-API, damit die echten Skripte in den Grafik-Seiten laufen.
(() => {
  const params = new URLSearchParams(location.search);
  const store = {
    enabled: true,
    monthlySalary: 3000,
    hoursPerWeek: 40,
    showOriginal: params.has('original') || document.documentElement.dataset.original === 'true',
  };
  window.browser = {
    storage: {
      local: {
        get: async (defaults) => ({ ...(typeof defaults === 'object' ? defaults : {}), ...store }),
        set: async (obj) => Object.assign(store, obj),
      },
      onChanged: { addListener() {} },
    },
  };
})();
