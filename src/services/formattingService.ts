const formatToCurrency = (currencyNumber: string | number) => {
  const numericValue =
    typeof currencyNumber === "string"
      ? parseFloat(currencyNumber)
      : currencyNumber;

  let formattedValue = new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    currencyDisplay: "code",
    useGrouping: "always",
  }).format(numericValue);

  // Replace spaces with commas (thousands) and commas with periods (decimals) in one go
  formattedValue = formattedValue
    .replace(/(\d)\s(\d)/g, "$1,$2")
    .replace(/,(\d{2})$/, ".$1");

  return formattedValue;
};

/**
 * Converts the first alphabetic character in a string to uppercase.
 * @param str String to be formatted
 * @returns A new string modified; original string reminds unchanged.
 */
const capitalizeString = (str: string): string => {
  if (str.length === 0) return "";

  return "" + str[0].toUpperCase() + str.slice(1);
};

export { formatToCurrency, capitalizeString };
