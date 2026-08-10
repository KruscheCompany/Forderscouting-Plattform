import Vue from "vue";
import { boot } from "quasar/wrappers";
import io from "socket.io-client";
import { i18n } from "boot/i18n";

let socket = null;

function showBrowserNotification(payload, router) {
  if (typeof Notification === "undefined" || Notification.permission !== "granted") {
    return;
  }
  const type = payload && payload.type;
  const key = `notificationsUser.push.${type}`;
  if (!type || !i18n.te(key)) return;

  const title = i18n.t("notificationsUser.push.title");
  const options = { body: i18n.t(key), tag: "amt-viol-notification" };

  try {
    const notification = new Notification(title, options);
    notification.onclick = () => {
      window.focus();
      router.push({ path: "/user/notifications" }).catch(() => {});
      notification.close();
    };
  } catch (error) {
    // Browsers controlled by a service worker (e.g. Android Chrome/Firefox with
    // the PWA build) throw "Illegal constructor" on `new Notification()` and
    // require going through the service worker registration instead.
    if (navigator.serviceWorker && navigator.serviceWorker.ready) {
      navigator.serviceWorker.ready.then((registration) => registration.showNotification(title, options));
    }
  }
}

function connect(store, router, token) {
  if (socket) socket.disconnect();
  socket = io(process.env.VUE_APP_MAIN_URL, {
    auth: { token }
  });

  socket.on("connect", () => {
    store.dispatch("notifications/maybeAskPermission");
  });

  socket.on("notification", (payload) => {
    store.dispatch("notifications/onLiveNotification", payload);
    showBrowserNotification(payload, router);
  });

  socket.on("systemRibbon", (ribbon) => {
    store.commit("notifications/setActiveRibbon", ribbon);
  });

  Vue.prototype.$socket = socket;
}

function disconnect() {
  if (socket) {
    socket.disconnect();
    socket = null;
    Vue.prototype.$socket = null;
  }
}

export default boot(({ store, router }) => {
  const getJwt = () =>
    store.state.userCenter.user && store.state.userCenter.user.jwt;

  const jwt = getJwt();
  if (jwt) connect(store, router, jwt);

  store.watch(getJwt, (newJwt) => {
    if (newJwt) connect(store, router, newJwt);
    else disconnect();
  });
});
