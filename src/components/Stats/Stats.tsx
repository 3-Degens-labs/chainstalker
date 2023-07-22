import { useQuery } from "@tanstack/react-query";
import React from "react";
import { VStack } from "structure-kit";
import { GradientText } from "../GradientText";
import { fetchStats } from "src/shared/requests/fetchStats";

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
    <VStack gap={24}>
      <div style={{ display: "flex", gap: 24 }}>
        <Stat
          name="Tx Score"
          detail={data.totalTransactionsLast7DaysFromOwner}
        />
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
              : new Intl.RelativeTimeFormat("en").format(
                  daysSinceLastTx,
                  "days"
                )
          }
        />
      </div>
      <div style={{ display: "flex", gap: 24 }}>
        {data.hasWorldCoin ? (
          <img
            style={{ display: "block", width: 64, height: 64 }}
            src="https://static-assets.lenster.xyz/images/badges/worldcoin.png"
          />
        ) : null}
        {data.poapInfo?.lastOffline?.imageUrl ? (
          <img
            style={{ display: "block", width: 64, height: 64 }}
            src={data.poapInfo.lastOffline.imageUrl}
          />
        ) : null}
        {data.poapInfo?.lastOnline?.imageUrl ? (
          <img
            style={{ display: "block", width: 64, height: 64 }}
            src={data.poapInfo.lastOnline.imageUrl}
          />
        ) : null}
      </div>
    </VStack>
  );
}
