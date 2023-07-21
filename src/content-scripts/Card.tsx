import React from "react";
import { createRoot } from "react-dom/client";
import { documentReady } from "./document-ready";

interface Props {
  id: string;
  name: string;
}

function Card({ name }: Props) {
  return (
    <div style={{ padding: 20, border: "2px solid" }}>
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
