import React from "react";
import ky from "ky";
import { HStack, VStack } from "structure-kit";
import { getAccountDataMemoized } from "src/shared/account-resolving/account-data";
import { useQuery } from "react-query";

interface AddressPortfolio {
  links: { self: string };
  data: { attributes: { total: { positions: number } } };
}
export function Profile({ account }: { account: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["getAccountDataMemoized", account],
    queryFn: () => getAccountDataMemoized(account),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  const portfolioQuery = useQuery({
    queryKey: ["addressPortfolio", data?.address],
    queryFn: () =>
      ky(
        `https://frontend-tools-hackathon-zerion-api-proxy-mzkrvfnv6a-ue.a.run.app/zerion-api/v1/wallets/${data?.address}/portfolio`
      ).json<AddressPortfolio>(),
    enabled: Boolean(data?.address),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  console.log(portfolioQuery.data);
  if (isLoading || !data) {
    return null;
  }
  const { domain, address } = data;
  if (!address) {
    throw new Error(`address resolution failed: ${account}`);
  }
  return (
    <HStack gap={8} style={{ display: "flex" }}>
      <div style={{ width: 64, height: 64, display: "block" }}>
        <img
          src="http://via.placeholder.com/64x64"
          alt=""
          style={{
            borderRadius: 8,
            width: "100%",
            height: "100%",
            display: "block",
          }}
        />
      </div>

      <VStack gap={4}>
        <div data-augment-ignore="ignore">{domain}</div>
        <div data-augment-ignore="ignore">{address}</div>
        <div data-augment-ignore="ignore">
          {portfolioQuery.data?.data.attributes.total.positions}
        </div>
      </VStack>
    </HStack>
  );
}
