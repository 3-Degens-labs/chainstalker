import { addCard, removeCard } from "./Card";
import { documentReady } from "./document-ready";

function visitTextNodes(node: Element, cb: (node: Node) => boolean) {
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
  let found = false;
  while (walker.nextNode() && !found) {
    found = cb(walker.currentNode);
  }
}

const domainPattern = /\b((\w|\.)+\.(eth|lens))\b/i;
const addressPattern = /\b(0x[a-fA-F0-9]{40})\b/;

function augmentAddress(textNode: Node, { update = false } = {}) {
  const id = crypto.randomUUID();
  const match =
    textNode.textContent?.match(domainPattern) ||
    textNode.textContent?.match(addressPattern);
  const addrName = match?.[0] || "unparsed";
  if (update) {
    const { parentElement } = textNode;
    if (parentElement?.id) {
      removeCard({ id: parentElement.id });
      parentElement.style.borderColor = "transparent";
      parentElement.style.borderImageSource = "";
      parentElement.dataset.augmentText = textNode.textContent?.trim() || "";
    }
    if (!match) {
      return;
    }
  }
  const span = update ? textNode.parentElement : document.createElement("span");
  if (!span) {
    return;
  }
  span.style.borderBottom = "3px solid";
  span.style.borderImageSlice = "1";
  span.style.borderImageSource = "linear-gradient(to left, #743ad5, #d53a9d)";

  span.setAttribute("id", id);
  if (!update) {
    textNode.parentElement?.insertBefore(span, textNode);
    span.appendChild(textNode);
  }
  span.dataset.augmentText = textNode.textContent?.trim() || "";
  addCard({ name: addrName, id });
}

function parseAddresses(node: Node = document.body) {
  if (node instanceof Element) {
    const candidates: Node[] = [];
    const updatedCandidates: Node[] = [];
    visitTextNodes(node, (textNode) => {
      const { textContent, parentElement } = textNode;

      if (parentElement?.dataset.augmentText) {
        if (parentElement?.dataset.augmentText !== textContent?.trim()) {
          updatedCandidates.push(textNode);
        }
      }
      if (
        parentElement?.dataset.augmentIgnore !== "ignore" &&
        textContent &&
        (addressPattern.test(textContent) || domainPattern.test(textContent))
      ) {
        if (parentElement?.dataset.augmentText === undefined) {
          candidates.push(textNode);
        }
      }
      return false;
    });

    candidates.forEach((candidate) => {
      augmentAddress(candidate);
    });
    updatedCandidates.forEach((candidate) => {
      augmentAddress(candidate, { update: true });
    });
  }
}

function observeDOM(node: ParentNode = document.body) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        parseAddresses(node);
      });
      if (mutation.type === "characterData") {
        if (mutation.target.parentElement) {
          parseAddresses(mutation.target.parentElement);
        }
      }
    });
  });
  observer.observe(node, {
    subtree: true,
    childList: true,
    characterData: true,
  });
  parseAddresses(); // leading invokation
  return () => observer.disconnect();
}

async function startObserving() {
  await documentReady();
  const unlisteners: Array<() => void> = [observeDOM(document.body)];
  return () => unlisteners.forEach((l) => l());
}

class PageObserver {
  private unlisten: null | (() => void) = null;
  private isStarting = false;
  private observe: () => Promise<() => void>;
  isObserving = false;

  constructor({ observe }: { observe: () => Promise<() => void> }) {
    this.observe = observe;
  }
  async start() {
    if (this.isObserving || this.isStarting) {
      return;
    }
    this.isStarting = true;
    this.unlisten = await this.observe();
    this.isStarting = false;
    this.isObserving = true;
  }

  stop() {
    this.unlisten?.();
    this.isObserving = false;
    this.unlisten = null;
  }
}

export const pageObserver = new PageObserver({ observe: startObserving });
