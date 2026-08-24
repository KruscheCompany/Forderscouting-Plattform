<template>
  <div class="nb-toast-stack">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="nb-toast"
      :class="{ 'nb-toast--exiting': toast.exiting }"
    >
      <div class="nb-toast__content" @click="view(toast)">
        <div class="nb-toast__row">
          <div class="nb-toast__dot" :style="{ background: kindColor(toast.kind), color: kindColor(toast.kind) }" />
          <div class="nb-toast__label">{{ kindLabel(toast.kind) }}</div>
        </div>
        <div class="nb-toast__title">{{ toast.title }}</div>
        <div v-if="toast.message" class="nb-toast__message">{{ toast.message }}</div>
      </div>
      <div
        class="nb-toast__seed"
        role="button"
        :aria-label="$t('systemRibbon.close')"
        @click.stop="dismiss(toast.id)"
      >
        <img class="nb-toast__logo" src="/AMTVIOEL-Projektkompass-Bildmarke-RGB.png" alt="" />
        <div class="nb-toast__close-label">{{ $t("systemRibbon.close") }}</div>
      </div>
      <div class="nb-toast__bar" :style="{ background: kindColor(toast.kind) }" />
    </div>
  </div>
</template>

<script>
const KIND_COLORS = {
  info: "#000055",
  warn: "#e4462b",
  ask: "#000055",
  positive: "#2e7d32",
  negative: "#e4462b",
  warning: "#c77c00"
};
const ROUTABLE_KINDS = ["info", "warn"];

export default {
  name: "NotificationToastStack",
  computed: {
    toasts() {
      return this.$store.getters["notifications/toasts"];
    }
  },
  methods: {
    kindColor(kind) {
      return KIND_COLORS[kind] || KIND_COLORS.info;
    },
    kindLabel(kind) {
      return this.$t(`notificationsUser.push.kind.${kind}`);
    },
    dismiss(id) {
      this.$store.dispatch("notifications/dismissToast", id);
    },
    view(toast) {
      this.dismiss(toast.id);
      if (toast.kind === "ask") {
        if (typeof Notification !== "undefined") Notification.requestPermission();
        return;
      }
      if (ROUTABLE_KINDS.includes(toast.kind)) {
        this.$router.push({ path: "/user/notifications" }).catch(() => {});
      }
    }
  }
};
</script>

<style>
.nb-toast-stack {
  position: fixed;
  top: 88px;
  right: 24px;
  z-index: 6000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

.nb-toast {
  position: relative;
  width: 420px;
  height: 104px;
  border-radius: 14px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 16px 38px rgba(27, 42, 120, 0.22);
  animation: nbExpand420 620ms cubic-bezier(0.16, 1, 0.3, 1) 240ms both;
}

.nb-toast--exiting {
  animation: nbOut 300ms cubic-bezier(0.4, 0, 1, 1) both;
}

.nb-toast__content {
  position: absolute;
  top: 0;
  right: 104px;
  width: 316px;
  height: 104px;
  padding: 17px 20px 22px;
  box-sizing: border-box;
  cursor: pointer;
  animation: nbContent 340ms ease 580ms both;
}

.nb-toast--exiting .nb-toast__content {
  animation: none;
}

.nb-toast__seed {
  position: absolute;
  top: 0;
  right: 0;
  width: 104px;
  height: 104px;
  background: #1b2a78;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  animation: nbSeed 340ms cubic-bezier(0.2, 1.5, 0.4, 1) both;
}

.nb-toast--exiting .nb-toast__seed {
  animation: none;
}

.nb-toast__logo {
  height: 30px;
  width: auto;
}

.nb-toast__close-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
}

.nb-toast__row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nb-toast__dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  animation: nbDot 2.4s ease-out infinite;
}

.nb-toast__label {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #8791b8;
}

.nb-toast__title {
  font-size: 14.5px;
  font-weight: 700;
  color: #1b2a78;
  margin-top: 7px;
}

.nb-toast__message {
  font-size: 12.5px;
  line-height: 1.45;
  color: #6b74a0;
  margin-top: 3px;
}

.nb-toast__bar {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 3px;
  width: 100%;
  transform-origin: left;
  animation: nbBar 6s linear 580ms both;
}

.nb-toast--exiting .nb-toast__bar {
  animation: none;
}

.nb-toast:hover .nb-toast__bar {
  animation-play-state: paused;
}

@keyframes nbExpand420 {
  from { width: 104px; }
  to { width: 420px; }
}

@keyframes nbSeed {
  0% { opacity: 0; transform: translateY(-18px) scale(0.55); }
  60% { opacity: 1; }
  100% { opacity: 1; transform: none; }
}

@keyframes nbContent {
  from { opacity: 0; transform: translateX(14px); }
  to { opacity: 1; transform: none; }
}

@keyframes nbDot {
  0% { box-shadow: 0 0 0 0 currentColor; opacity: 0.9; }
  70% { box-shadow: 0 0 0 8px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; opacity: 0.9; }
}

@keyframes nbOut {
  from { opacity: 1; transform: none; }
  to { opacity: 0; transform: translateX(28px) scale(0.97); }
}

@keyframes nbBar {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}

@media (prefers-reduced-motion: reduce) {
  .nb-toast,
  .nb-toast__content,
  .nb-toast--exiting,
  .nb-toast__seed {
    animation: nbFade 150ms linear both !important;
  }
  .nb-toast__bar,
  .nb-toast__dot {
    animation: none !important;
  }
}

@keyframes nbFade {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
