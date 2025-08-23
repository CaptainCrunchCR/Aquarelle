import Big from "big.js";

/**
 * Formats a number or string as CRC currency string using accounting style.
 * @param currencyNumber - number or string number representation
 * @returns number formatted as CRC currency string
 */
const formatToCRCCurrency = (currencyNumber: string | number) => {
  const numericValue =
    typeof currencyNumber === "string"
      ? parseFloat(currencyNumber)
      : currencyNumber;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "CRC",
    currencyDisplay: "code",
    useGrouping: "always",
    currencySign: "accounting",
  }).format(numericValue);
};

/**
 * Converts the first alphabetic character in a string to uppercase.
 * @param str String to be formatted
 * @returns new string modified; original string reminds unchanged.
 */
const capitalizeString = (str: string): string => {
  if (str.length === 0) return "";

  return "" + str[0].toUpperCase() + str.slice(1);
};

/**
 * Creates a new array of type Big
 * @param values - collection of numbers in a string representation
 * @returns new array parsed
 */
const parseFromStringCollectionToBig = (values: Array<string>): Big[] =>
  values.map((value) => Big(value));

export {
  formatToCRCCurrency,
  capitalizeString,
  parseFromStringCollectionToBig,
};
