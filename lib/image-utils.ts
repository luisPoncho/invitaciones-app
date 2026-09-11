/**
 * Convierte URLs de enlace compartido de servicios como Google Drive o Dropbox
 * a URLs directas de imagen compatibles con etiquetas <img> y CSS background-image.
 */
export function formatImageUrl(url?: string): string {
  if (!url) return "";
  const trimmed = url.trim();

  // 1. Google Drive: https://drive.google.com/file/d/{FILE_ID}/view?usp=sharing
  const driveFileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveFileMatch && driveFileMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveFileMatch[1]}`;
  }

  // 2. Google Drive con parámetro id: https://drive.google.com/open?id={FILE_ID} o uc?id=...
  const driveIdMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (trimmed.includes("drive.google.com") && driveIdMatch && driveIdMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveIdMatch[1]}`;
  }

  // 3. Dropbox: cambiar enlace de vista por enlace directo
  if (trimmed.includes("dropbox.com")) {
    return trimmed
      .replace("?dl=0", "?raw=1")
      .replace("www.dropbox.com", "dl.dropboxusercontent.com");
  }

  return trimmed;
}
