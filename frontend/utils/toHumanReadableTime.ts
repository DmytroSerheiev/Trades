/**
 * Converts a Unix timestamp to a formatted date and time string.
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted date and time string (YYYY-MM-DD HH:mm:ss)
 */

export function timestampToDateTime(timestamp: string | number | Date) {
  const date = new Date(timestamp); // Create a new Date object using the provided timestamp
  const year = date.getFullYear(); // Get the full year (e.g., 2024)

  // Get (month, day, hours,minutes & second)respectively and pad with a leading zero if necessary
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // Combine the extracted parts into a single formatted string
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
