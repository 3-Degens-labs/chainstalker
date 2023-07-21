import memoizeOne from "memoize-one";
import { lookupAddressName, resolveDomain } from "./name-service";

function isAddress(value: string) {
  return value.startsWith("0x");
}

async function getAccountData(value: string) {
  if (isAddress(value)) {
    const domain = await lookupAddressName(value);
    return { address: value, domain };
  } else {
    console.log("is domain");
    const address = await resolveDomain(value);
    console.log("resolved", address);
    return { address, domain: value };
  }
}

export const getAccountDataMemoized = memoizeOne(getAccountData);
