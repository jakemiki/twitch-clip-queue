const u = (window as any).umami;

export function umami(value: string, type = 'custom') {
  u?.trackEvent(value, type);
}
