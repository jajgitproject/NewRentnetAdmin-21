/** Canonical allowed upload extensions for admin file/image uploaders. */
export const UPLOAD_ACCEPT = '.pdf,.jpeg,.jpg,.png';
export const UPLOAD_ALLOWED_HINT = 'Allowed: .pdf, .jpeg, .jpg, .png';
export const UPLOAD_ALLOWED_EXTENSIONS = ['.pdf', '.jpeg', '.jpg', '.png'];

export const EXCEL_UPLOAD_ACCEPT = '.xlsx';
export const EXCEL_UPLOAD_ALLOWED_HINT = 'Allowed: .xlsx';

export const PDF_UPLOAD_ACCEPT = '.pdf';
export const PDF_UPLOAD_ALLOWED_HINT = 'Allowed: .pdf';

export function isAllowedUploadFileName(
  fileName: string,
  allowed: string[] = UPLOAD_ALLOWED_EXTENSIONS
): boolean {
  if (!fileName || typeof fileName !== 'string') {
    return false;
  }
  const lower = fileName.toLowerCase();
  const dot = lower.lastIndexOf('.');
  if (dot < 0) {
    return false;
  }
  const ext = lower.substring(dot);
  return allowed.indexOf(ext) >= 0;
}
