import memoizeOne from "memoize-one";
import { lookupAddress, resolveDomain } from "../requests/account-resolving";

function isAddress(value: string) {
  return value.startsWith("0x");
}

async function getAccountData(value: string) {
  if (isAddress(value)) {
    const { domain } = await lookupAddress(value);
    return { address: value, domain };
  } else {
    const address = await resolveDomain(value);
    return { address, domain: value };
  }
}

export const getAccountDataMemoized = memoizeOne(getAccountData);
