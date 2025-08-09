const formatToCurrency = (currencyNumber: string | number) => {
  const numericValue =
    typeof currencyNumber === "string"
      ? parseFloat(currencyNumber)
      : currencyNumber;

  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
  }).format(numericValue);
};

export { formatToCurrency };
