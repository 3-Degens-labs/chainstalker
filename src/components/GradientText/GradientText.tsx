import React from "react";

export function GradientText({
  backgroundImage = "linear-gradient(to left, rgb(116, 58, 213), rgb(213, 58, 157))",
  ...props
}: React.PropsWithChildren<{ backgroundImage?: string }>) {
  return (
    <span
      style={{
        color: "transparent",
        backgroundImage,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
      }}
      {...props}
    />
  );
}
