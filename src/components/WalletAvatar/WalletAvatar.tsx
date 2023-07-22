import React from "react";
import { useQuery } from "@tanstack/react-query";
import { normalizeAddress } from "src/shared/normalizeAddress";
import { SOCIAL_API_URL } from "src/env/config";
import { AvatarIcon } from "./AvatarIcon";
import type {
  WalletProfilesResponse,
  WalletProfile,
  WalletProfileNFT,
} from "./types";

async function fetchWalletProfile(
  address: string
): Promise<WalletProfile | undefined> {
  const url = new URL("/api/v1/profiles", SOCIAL_API_URL);
  url.searchParams.append("address", normalizeAddress(address));
  const response = await fetch(url);
  const { profiles } =
    (await response.json()) as unknown as WalletProfilesResponse;
  return profiles?.[0];
}

async function fetchWalletNFT(
  address: string
): Promise<WalletProfileNFT | null> {
  const profile = await fetchWalletProfile(address).then((result) => {
    return result;
  });
  return profile?.nft || null;
}

export function WalletAvatar({
  address,
  size,
  borderRadius = 6,
}: {
  address: string;
  size: number;
  borderRadius?: number;
}) {
  const { data: nft, isLoading } = useQuery({
    queryKey: ["fetchWalletNFT", address],
    queryFn: () => fetchWalletNFT(address),
    suspense: false,
    useErrorBoundary: false,
    retry: 0,
  });

  if (isLoading) {
    return <div style={{ width: size, height: size }} />;
  }
  console.log({ nft });

  return (
    <AvatarIcon
      address={address}
      size={size}
      src={nft?.preview.url}
      borderRadius={borderRadius}
    />
  );
}
