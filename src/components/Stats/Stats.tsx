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

function calculateAge(dateString: string) {
  const date = new Date(dateString);
  const today = new Date();

  if (!date || isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }

  let age = today.getFullYear() - date.getFullYear();
  const ageMonth = today.getMonth() - date.getMonth();
  const ageDay = today.getDate() - date.getDate();

  if (ageMonth < 0 || (ageMonth === 0 && ageDay < 0)) {
    age--;
  }

  let remainingDays;
  if (ageMonth >= 0 && ageDay >= 0) {
    remainingDays = Math.floor(
      (today.valueOf() -
        new Date(
          today.getFullYear(),
          date.getMonth(),
          date.getDate()
        ).valueOf()) /
        (1000 * 60 * 60 * 24)
    );
  } else {
    remainingDays = Math.floor(
      (today.valueOf() -
        new Date(
          today.getFullYear() - 1,
          date.getMonth(),
          date.getDate()
        ).valueOf()) /
        (1000 * 60 * 60 * 24)
    );
  }

  return {
    years: age,
    days: remainingDays,
  };
}

function dateToAgeString(dateString: string) {
  const { years, days } = calculateAge(dateString);
  if (years === 0) {
    return `${days} ${days === 1 ? "day" : "days"}`;
  } else {
    return `${years} ${years === 1 ? "year" : "years"}`;
  }
}

export function Stats({ address }: { address: string }) {
  const { data } = useQuery({
    queryKey: ["fetchStats", address],
    queryFn: () => fetchStats(address),
  });
  if (!data) {
    return null;
  }
  const daysSinceLastTx =
    data.latestOutboundTransactionDate != null
      ? Math.floor(
          (new Date(data.latestOutboundTransactionDate).valueOf() -
            Date.now()) /
            (1000 * 60 * 60 * 24)
        )
      : null;
  return (
    <VStack gap={24}>
      <div style={{ display: "flex", gap: 24 }}>
        {data.totalTransactionsLast7DaysFromOwner == null ? null : (
          <Stat
            name="Tx Score"
            detail={data.totalTransactionsLast7DaysFromOwner}
          />
        )}
        <Stat
          name="DeFi Pro"
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
        {daysSinceLastTx == null ? null : (
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
        )}
        {data.earliestTransaction == null ? null : (
          <Stat
            name="Crypto Age"
            detail={dateToAgeString(data.earliestTransaction.date)}
          />
        )}
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
