const getApiBaseUrl = () => {
  const host = window.location.hostname;

  if (host === 'localhost') return import.meta.env.VITE_LOCAL_API_URL;
  if (host === 'test.codemonster.site') return import.meta.env.VITE_TEST_URL;
  if (host === 'codemonster.site') return import.meta.env.VITE_BASE_URL;

  return 'https://api.codemonster.site';
};

export const API_BASE_URL = getApiBaseUrl();