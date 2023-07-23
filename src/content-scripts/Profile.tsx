import React from "react";
import ky from "ky";
import { HStack, VStack } from "structure-kit";
import { useQuery } from "@tanstack/react-query";
import { WalletAvatar } from "src/components/WalletAvatar";
import { truncateAddress } from "src/shared/truncateAddress";
import { NeutralDecimals } from "src/components/NeutralDecimals";
import { currencyFormatter } from "src/components/units/currency-format";
import { normalizeAddress } from "src/shared/normalizeAddress";

interface AddressPortfolio {
  links: { self: string };
  data: { attributes: { total: { positions: number } } };
}

function fetchAddressPortfolio(address: string) {
  return ky(
    `https://frontend-tools-hackathon-zerion-api-proxy-mzkrvfnv6a-ue.a.run.app/zerion-api/v1/wallets/${address}/portfolio`
  ).json<AddressPortfolio>();
}

export function Profile({
  address,
  domain,
}: {
  address: string;
  domain: string | null;
}) {
  const normalizedAddr = normalizeAddress(address);
  const portfolioQuery = useQuery({
    queryKey: ["addressPortfolio", normalizedAddr],
    queryFn: () => fetchAddressPortfolio(normalizedAddr),
    enabled: Boolean(address),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  return (
    <HStack gap={8} style={{ display: "flex" }}>
      <WalletAvatar size={64} address={address} />

      <VStack gap={4}>
        <div style={{ lineHeight: 1.2 }} title={address}>
          <a
            data-augment-ignore="ignore"
            style={{ color: "var(--primary)" }}
            href={`https://app.zerion.io/${address}/overview`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {domain || truncateAddress(address)}
          </a>
        </div>
        <div data-augment-ignore="ignore">
          <span style={{ fontSize: 36, lineHeight: 1 }}>
            <NeutralDecimals
              parts={currencyFormatter.formatToParts(
                portfolioQuery.data?.data.attributes.total.positions || 0
              )}
            />
          </span>
        </div>
      </VStack>
    </HStack>
  );
}
