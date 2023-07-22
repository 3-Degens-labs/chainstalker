import { pageObserver } from "./page-mutation";
pageObserver.start();

window.addEventListener("custom:1", () => {
  console.log("stopping");
  pageObserver.stop();
});
// Object.assign(window, { pageObserver });
