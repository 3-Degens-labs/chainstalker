import { addCard } from "./Card";
import { documentReady } from "./document-ready";

function visitTextNodes(node: Element, cb: (node: Node) => boolean) {
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
  let found = false;
  while (walker.nextNode() && !found) {
    found = cb(walker.currentNode);
  }
}

// function isReplacementMatch(textNode: Node, regex: RegExp) {
//   const { textContent } = textNode;
//   return textContent && regex.test(textContent);
// }

function augmentAddress(textNode: Node) {
  const id = crypto.randomUUID();
  const span = document.createElement("span");
  // span.dataset.augmentCard = id;
  span.textContent = textNode.textContent;
  const match = span.textContent?.match(/\b(\w+\.eth)\b/gi);
  const addrName = match?.[0] || "unparsed";
  span.style.backgroundColor = "magenta";
  span.dataset.augmentIgnore = "ignore";
  span.setAttribute('id', id);
  (textNode as Element).replaceWith(span);
  addCard({ name: addrName, id });
}

function parseAddresses(node: Node = document.body) {
  if (node instanceof Element) {
    const candidates: Node[] = [];
    visitTextNodes(node, (textNode) => {
      const { textContent, parentElement } = textNode;

      if (
        parentElement?.dataset.augmentIgnore !== "ignore" &&
        textContent &&
        /\b\w+\.eth\b/gi.test(textContent)
      ) {
        candidates.push(textNode);
      }
      return false;
    });

    candidates.forEach((candidate) => {
      augmentAddress(candidate);
    });
  }
}

function observeDOM(node: ParentNode = document.body) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        parseAddresses(node);
      });
    });
  });
  observer.observe(node, { subtree: true, childList: true });
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
