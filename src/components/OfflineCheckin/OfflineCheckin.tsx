import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useMemo } from "react";
import { normalizeAddress } from "src/shared/normalizeAddress";
import { fetchStats } from "src/shared/requests/fetchStats";

export function OfflineCheckin({ address }: { address: string }) {
  const normalizedAddress = normalizeAddress(address);
  const { data: stats } = useQuery({
    queryKey: ["fetchStats", normalizedAddress],
    queryFn: () => fetchStats(normalizedAddress),
  });
  if (!stats) {
    return null;
  }
  const location = useMemo(() => {
    const traits = stats.poapInfo?.lastOffline?.traits;
    const location: { country: string | null; city: string | null } = {
      country: null,
      city: null,
    };
    if (traits) {
      for (const trait of traits) {
        if (trait.trait_type === "city") {
          location.city = trait.value;
        }
        if (trait.trait_type === "country") {
          location.country = trait.value;
        }
      }
    }
    return location;
  }, [stats]);
  if (!stats.poapInfo?.lastOffline) {
    return null;
  }
  if (location.country) {
    return (
      <div
        style={{ fontSize: 14 }}
        title={`${stats.poapInfo.lastOffline.name}\n\n${stats.poapInfo.lastOffline.description}`}
      >
        📍{" "}
        <span style={{ color: "var(--neutral-500)" }}>Last POAP Check-in:</span>{" "}
        {[location.country, location.city].join(", ")}
      </div>
    );
  }
}
