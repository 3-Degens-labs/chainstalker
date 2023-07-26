import ky from "ky";
import { normalizeAddress } from "../normalizeAddress";

interface ResolveResponse {
  address: string;
}

export async function resolveDomain(domain: string) {
  const { address } = await ky(
    `https://3degens.club/v1.0/resolve/${domain}`,
  ).json<ResolveResponse>();
  return address;
}

interface ReverseResolveResponse {
  domain: string;
  domains: string[];
}

export async function lookupAddress(address: string) {
  const normalizedAddress = normalizeAddress(address);
  try {
    return await ky(
      `https://3degens.club/v1.0/reverse-resolve/${normalizedAddress}`,
    ).json<ReverseResolveResponse>();
  } catch (e) {
    return { domain: null, domains: null };
  }
}
