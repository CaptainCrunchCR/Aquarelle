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

export { formatToCurrency };
