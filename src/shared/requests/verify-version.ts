import ky from "ky";
import { version } from "../packageVersion";

async function getReferenceVersion() {
  return ky("https://3degens.club/version").json<{
    value: string;
    statusMessage: null | string;
  }>();
}

export async function verifyVersion() {
  const { value: referenceVersion, statusMessage } =
    await getReferenceVersion();
  return { isLatest: referenceVersion === version, statusMessage };
}
