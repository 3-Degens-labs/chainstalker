import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchStats } from "src/shared/requests/fetchStats";
import { normalizeAddress } from "src/shared/normalizeAddress";
import { AvatarIcon } from "./AvatarIcon";

export function WalletAvatar({
  address,
  size,
  borderRadius = 6,
}: {
  address: string;
  size: number;
  borderRadius?: number;
}) {
  const normalizedAddress = normalizeAddress(address);
  const { data, isLoading } = useQuery({
    queryKey: ["fetchStats", normalizedAddress],
    queryFn: () => fetchStats(normalizedAddress),
  });
  const src =
    data?.profile.profiles[0]?.nft?.metadata?.content.image_url ||
    data?.profile.profiles[0]?.nft?.metadata?.content.image_preview_url;

  if (isLoading) {
    return <div style={{ width: size, height: size }} />;
  }

  return (
    <AvatarIcon
      address={address}
      size={size}
      src={src}
      borderRadius={borderRadius}
    />
  );
}
