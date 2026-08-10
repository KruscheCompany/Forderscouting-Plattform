import { api } from "boot/axios";
import { i18n } from "boot/i18n";

const TOAST_AUTO_DISMISS_MS = 6000;
const TOAST_EXIT_MS = 300;

export async function fetchNotificationsCount(context) {
  try {
    const response = await api.get("/api/user/notification");
    const data = (response && response.data) || {};
    const count = ["fundingComments", "fundingExpirey", "guest", "requests"].reduce(
      (total, key) => total + (Array.isArray(data[key]) ? data[key].length : 0),
      0
    );
    context.commit("setNotificationsCount", count);
  } catch (error) {
    context.commit("setNotificationsCount", 0);
  }
}

const TOAST_KIND_BY_NOTIFICATION_TYPE = {
  guest: "info",
  fundingComments: "info",
  requests: "info",
  fundingExpirey: "warn"
};

export async function onLiveNotification(context, payload) {
  context.dispatch("fetchNotificationsCount");

  const type = payload && payload.type;
  const key = `notificationsUser.push.${type}`;
  if (!type || !i18n.te(key)) return;

  context.dispatch("pushToast", {
    kind: TOAST_KIND_BY_NOTIFICATION_TYPE[type] || "info",
    title: i18n.t("notificationsUser.push.title"),
    message: i18n.t(key)
  });
}

export function pushToast(context, { kind, title, message }) {
  const id = Date.now() + Math.random();
  context.commit("addToast", { id, kind, title, message, exiting: false, timerArmed: false });
  if (context.state.pageVisible) {
    context.dispatch("armToastTimer", id);
  }
}

export function armToastTimer(context, id) {
  context.commit("markToastTimerArmed", id);
  setTimeout(() => context.dispatch("dismissToast", id), TOAST_AUTO_DISMISS_MS);
}

export function setPageVisible(context, visible) {
  context.commit("setPageVisible", visible);
  if (visible) {
    context.state.toasts.filter(t => !t.timerArmed).forEach(t => context.dispatch("armToastTimer", t.id));
  }
}

export function dismissToast(context, id) {
  context.commit("markToastExiting", id);
  setTimeout(() => context.commit("removeToast", id), TOAST_EXIT_MS);
}

export function maybeAskPermission(context) {
  if (typeof Notification === "undefined" || Notification.permission !== "default") {
    return;
  }
  context.dispatch("pushToast", {
    kind: "ask",
    title: i18n.t("notificationsUser.permissionAsk.title"),
    message: i18n.t("notificationsUser.permissionAsk.message")
  });
}

export async function fetchActiveRibbon(context) {
  try {
    const response = await api.get("/api/system-ribbon/active");
    context.commit("setActiveRibbon", response.data || null);
  } catch (error) {
    context.commit("setActiveRibbon", null);
  }
}

export async function publishRibbon(context, { message, linkLabel, linkUrl }) {
  try {
    await api.post("/api/system-ribbons", { data: { message, linkLabel, linkUrl } });
    context.dispatch("pushToast", { kind: "positive", title: i18n.t("systemRibbon.publishedSuccess") });
  } catch (error) {
    context.dispatch("pushToast", { kind: "negative", title: error.response.data.error.message });
  }
}

export async function unpublishRibbon(context, id) {
  try {
    await api.put(`/api/system-ribbons/${id}`, { data: { active: false } });
    context.commit("setActiveRibbon", null);
    context.dispatch("pushToast", { kind: "positive", title: i18n.t("systemRibbon.unpublishedSuccess") });
  } catch (error) {
    context.dispatch("pushToast", { kind: "negative", title: error.response.data.error.message });
  }
}
