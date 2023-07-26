import { useQuery } from "@tanstack/react-query";
import React from "react";
import { verifyVersion } from "src/shared/requests/verify-version";

export function VersionCheck() {
  const { data } = useQuery({
    queryKey: ["verifyVersion"],
    queryFn: () => verifyVersion(),
    suspense: false,
    useErrorBoundary: false, // ignore errors for this request
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  if (data?.isLatest === false) {
    return (
      <div style={{ padding: "4px 12px", textAlign: "end" }}>
        <a
          href="https://github.com/3-Degens-labs/chainstalker/releases/latest"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--negative-500)" }}
        >
          {data.statusMessage || "New version is available"}
        </a>
      </div>
    );
  } else if (data?.statusMessage) {
    return (
      <div
        style={{
          padding: "4px 12px",
          textAlign: "end",
          color: "var(--notice-500)",
        }}
      >
        {data.statusMessage}
      </div>
    );
  }
  return null;
}
