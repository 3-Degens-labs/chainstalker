import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { documentReady } from "./document-ready";

interface Props {
  id: string;
  name: string;
}

function Card({ name, id }: Props) {
  const [style, setDisplay] = useState({ display: "none", top: 0, left: 0 });
  useEffect(() => {
    const addressElement = document.getElementById(id);
    if (!addressElement) {
      return;
    }
    const handleMouseEnter = () => {
      const { height, y, x } = addressElement.getBoundingClientRect();
      const { scrollLeft, scrollTop } = document.documentElement;
      setDisplay({
        display: "block",
        top: scrollTop + y + height + 12,
        left: scrollLeft + x,
      });
    };
    const handleMouseLeave = () => {
      setDisplay({ display: "none", left: 0, top: 0 });
    };
    addressElement?.addEventListener("mouseenter", handleMouseEnter);
    addressElement?.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      addressElement?.removeEventListener("mouseenter", handleMouseEnter);
      addressElement?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);
  return (
    <div
      style={{
        display: style.display,
        top: style.top,
        left: style.left,
        padding: 20,
        border: "2px solid",
        position: "absolute",
        zIndex: 1,
        backgroundColor: "white",
      }}
    >
      <span data-augment-ignore="ignore">{name}</span>: $3123
    </div>
  );
}

let cardsElement: HTMLElement | null = null;

async function prepare() {
  await documentReady();
  cardsElement = document.createElement("div");
  cardsElement.dataset.intent = "cards-root";
  document.body.appendChild(cardsElement);
}

prepare();

export function addCard(props: Props) {
  const card = document.createElement("div");
  cardsElement?.appendChild(card);
  createRoot(card).render(<Card {...props} />);
}
