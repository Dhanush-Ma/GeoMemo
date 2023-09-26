export default function getFormattedDateWithDay(inputDateString) {
  const inputDate = new Date(inputDateString);

  // Define options for formatting the date
  const options = {weekday: 'short', month: 'short', day: 'numeric'};

  // Create the formatted date string
  const formattedDate = inputDate.toLocaleDateString('en-US', options);

  return formattedDate;
}