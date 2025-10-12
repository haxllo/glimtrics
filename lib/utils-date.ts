/**
 * Utility functions for date formatting in export filenames
 */

/**
 * Get current date in YYYY-MM-DD format
 * Example: "2025-10-12"
 */
export function getCurrentDateForFilename(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get current date and time in YYYY-MM-DD-HHmm format
 * Example: "2025-10-12-1430" (2:30 PM)
 */
export function getCurrentDateTimeForFilename(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}-${hours}${minutes}`;
}

/**
 * Get human-readable date format
 * Example: "Oct-12-2025"
 */
export function getHumanDateForFilename(): string {
  const now = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[now.getMonth()];
  const day = now.getDate();
  const year = now.getFullYear();
  return `${month}-${day}-${year}`;
}

/**
 * Sanitize filename - remove invalid characters
 */
export function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-z0-9_-]/gi, '-') // Replace invalid chars with hyphen
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .toLowerCase();
}
