import React from "react";
import { BlockieImg } from "src/components/BlockieImg";

export function AvatarIcon({
  address,
  size,
  src,
  borderRadius,
}: {
  address: string;
  size: number;
  src?: string | null;
  borderRadius: number;
}) {
  return (
    <div style={{ position: "relative" }}>
      <div>
        {src ? (
          <img
            src={src}
            alt=""
            style={{
              display: "block",
              width: size,
              height: size,
              borderRadius,
            }}
          />
        ) : (
          <BlockieImg
            address={address}
            size={size}
            borderRadius={borderRadius}
          />
        )}
      </div>
    </div>
  );
}
