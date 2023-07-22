import { ellipsis as typographicEllipsis } from "./typography";

export function truncateAddress(
  address: string,
  padding = 6,
  { ellipsis } = { ellipsis: typographicEllipsis }
) {
  const leadingPadding = address.startsWith("0x") ? 2 + padding : padding;
  return `${address.slice(0, leadingPadding)}${ellipsis}${address.slice(
    0 - padding
  )}`;
}
