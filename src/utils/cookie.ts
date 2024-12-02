export const getCookieAsJson = (): Record<string, string> => {
  return document.cookie
    .split(';')
    .map((cookie) => cookie.trim().split('='))
    .reduce(
      (acc, [key, value]) => {
        if (key && value) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, string>
    );
};

export const handleCookieOnRedirect = () => {
  const cookie = getCookieAsJson();
  if (Object.entries(cookie).length > 0) {
    const at = cookie['access_token'];
    if (at) {
      sessionStorage.setItem('Authorization', at);
    }
  }
};
