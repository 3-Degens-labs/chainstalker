import { JsonRpcProvider } from "ethers";
import { ALCHEMY_API_KEY } from "src/env/config";

const nodeUrl = `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;

export async function ensLookup(address: string): Promise<string | null> {
  const provider = new JsonRpcProvider(nodeUrl);
  return provider.lookupAddress(address);
}

export async function ensResolve(domain: string): Promise<string | null> {
  const provider = new JsonRpcProvider(nodeUrl);
  return provider.resolveName(domain);
}
