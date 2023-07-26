import ky from "ky";
import { version } from "../packageVersion";

async function getReferenceVersion() {
  return ky("https://3degens.club/version").json<{ value: string }>();
}

export async function verifyVersion() {
  const { value: referenceVersion } = await getReferenceVersion();
  return { isLatest: referenceVersion === version };
}
