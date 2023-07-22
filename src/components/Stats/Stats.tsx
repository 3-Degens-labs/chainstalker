import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import React from "react";
import { VStack } from "structure-kit";
import { GradientText } from "../GradientText";

interface Response {
  hasWorldCoind: boolean;
  hasNotDumbTransaction: boolean;

  chainIDsWithActivity: number[];
  lastPoap: null | {
    address: string;
    tokenId: string;
    blockchain: string;
    name: string;
    descripton: string;
    imageUrl: string;
    animationUrl: string;
    previewLink: string;
    traits: Array<{
      trait_type: string;
      value: string;
    }>;
    owner: string[];
    created: string;
  };
  totalTransactionHappenedOverLast7DaysTotal: number;
  totalTransactionsLast7DaysFromOwner: number;
  latestOutboundTransactionDate: string;
}

function fetchStats(address: string) {
  return ky(`https://3degens.club/check/${address}`).json<Response>();
}

function Stat({
  name,
  detail,
}: {
  name: React.ReactNode;
  detail: React.ReactNode;
}) {
  return (
    <VStack gap={4}>
      <div style={{ color: "var(--neutral-500)" }}>{name}</div>
      <div>{detail}</div>
    </VStack>
  );
}

export function Stats({ address }: { address: string }) {
  const { data } = useQuery({
    queryKey: ["fetchStats", address],
    queryFn: () => fetchStats(address),
  });
  if (!data) {
    return null;
  }
  const daysSinceLastTx = Math.floor(
    (new Date(data.latestOutboundTransactionDate).valueOf() - Date.now()) /
      (1000 * 60 * 60 * 24)
  );
  return (
    <div style={{ display: "flex", gap: 24 }}>
      <Stat name="Tx Score" detail={data.totalTransactionsLast7DaysFromOwner} />
      <Stat
        name="Using DeFi"
        detail={
          data.hasNotDumbTransaction ? (
            <GradientText>
              <strong>Yes</strong>
            </GradientText>
          ) : (
            <span>No</span>
          )
        }
      />
      <Stat
        name="Last TX"
        detail={
          daysSinceLastTx === 0
            ? "Today"
            : new Intl.RelativeTimeFormat("en").format(daysSinceLastTx, "days")
        }
      />
    </div>
  );
}
