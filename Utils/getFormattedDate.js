export default function getFormattedDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1 and pad with '0' if needed
  const day = String(date.getDate()).padStart(2, '0'); // Pad with '0' if needed

  return `${year}-${month}-${day}`;
}
