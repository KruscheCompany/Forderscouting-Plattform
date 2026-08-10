import { boot } from "quasar/wrappers";

function isPageVisible() {
  return document.visibilityState === "visible" && document.hasFocus();
}

export default boot(({ store }) => {
  const update = () => store.dispatch("notifications/setPageVisible", isPageVisible());
  document.addEventListener("visibilitychange", update);
  window.addEventListener("focus", update);
  window.addEventListener("blur", update);
  update();
});
