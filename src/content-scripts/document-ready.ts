export const documentReady = () =>
  new Promise<void>((resolve) => {
    if (document.body) {
      resolve();
    } else {
      document.addEventListener("DOMContentLoaded", () => resolve());
    }
  });
