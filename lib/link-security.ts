const OWNED_ROOT_DOMAIN = "dieseelenplanerin.de";

const TRAILING_URL_PUNCTUATION = /[),.!?;:'"\]}]+$/;

/**
 * Removes punctuation that is commonly attached to a URL at the end of a sentence.
 */
export function normalizeExternalUrl(value: string): string {
  return value.trim().replace(TRAILING_URL_PUNCTUATION, "");
}

/**
 * Only HTTPS links on dieseelenplanerin.de or one of its subdomains are trusted.
 * Lookalike domains such as dieseelenplanerin.de.evil.example are rejected.
 */
export function isOwnedSeelenplanerinUrl(value: string): boolean {
  const normalized = normalizeExternalUrl(value);

  try {
    const parsed = new URL(normalized);
    const hostname = parsed.hostname.toLowerCase();

    return (
      parsed.protocol === "https:" &&
      (hostname === OWNED_ROOT_DOMAIN || hostname.endsWith(`.${OWNED_ROOT_DOMAIN}`))
    );
  } catch {
    return false;
  }
}

export function getOwnedSeelenplanerinUrl(value: string): string | null {
  const normalized = normalizeExternalUrl(value);
  return isOwnedSeelenplanerinUrl(normalized) ? normalized : null;
}

export function findFirstOwnedSeelenplanerinUrl(text: string): string | null {
  const urls = text.match(/https?:\/\/[^\s]+/g) ?? [];

  for (const url of urls) {
    const ownedUrl = getOwnedSeelenplanerinUrl(url);
    if (ownedUrl) return ownedUrl;
  }

  return null;
}
