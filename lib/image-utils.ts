/**
 * Convierte URLs de enlace compartido de servicios como Google Drive, Dropbox, Imgur, etc.
 * a URLs directas de imagen compatibles con etiquetas <img> y CSS background-image.
 */
export function formatImageUrl(url?: string): string {
  if (!url) return "";
  const trimmed = url.trim();

  // 1. Google Drive: Extraer FILE_ID de distintos formatos de enlace
  // Formato /file/d/{FILE_ID} o /d/{FILE_ID}
  const drivePathMatch = trimmed.match(/\/(?:file\/d|d)\/([a-zA-Z0-9_-]+)/);
  if (drivePathMatch && drivePathMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${drivePathMatch[1]}`;
  }

  // Formato con parámetro id: open?id={FILE_ID}, uc?id={FILE_ID}, thumbnail?id={FILE_ID}
  const isGoogleDomain =
    trimmed.includes("google.com") || trimmed.includes("googleusercontent.com");
  const driveIdMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);

  if (isGoogleDomain && driveIdMatch && driveIdMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveIdMatch[1]}`;
  }

  // 2. Dropbox: cambiar enlace de vista pública por CDN directo
  if (trimmed.includes("dropbox.com")) {
    return trimmed
      .replace("www.dropbox.com", "dl.dropboxusercontent.com")
      .replace(/[?&]dl=0/, "?raw=1")
      .replace(/[?&]dl=1/, "?raw=1");
  }

  // 3. Imgur: convertir enlaces de página a imagen directa
  if (trimmed.includes("imgur.com") && !trimmed.includes("i.imgur.com")) {
    const imgurMatch = trimmed.match(/imgur\.com\/(?:a\/)?([a-zA-Z0-9]+)/);
    if (imgurMatch && imgurMatch[1]) {
      return `https://i.imgur.com/${imgurMatch[1]}.png`;
    }
  }

  return trimmed;
}

