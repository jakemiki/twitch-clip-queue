export const getUrlFromMessage = (message: string) => {
  const urlStart = message.indexOf('http');
  if (urlStart >= 0) {
    const urlEnd = message.indexOf(' ', urlStart);
    const url = message.slice(urlStart, urlEnd > 0 ? urlEnd : undefined);
    return url;
  }

  return undefined;
};
