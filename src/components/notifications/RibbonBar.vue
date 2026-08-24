<template>
  <div class="nb-ribbon" :class="{ 'nb-ribbon--muted': muted, 'nb-ribbon--static': !animated }">
    <div class="nb-ribbon__content">
      <div class="nb-ribbon__dot" />
      <div class="nb-ribbon__label">{{ label || $t("systemRibbon.label") }}</div>
      <div class="nb-ribbon__divider" />
      <div class="nb-ribbon__message">{{ displayMessage }}</div>
      <a v-if="linkUrl" class="nb-ribbon__link" :href="linkUrl" target="_blank" rel="noopener">{{ linkLabel ||
        $t('systemRibbon.linkDefaultLabel') }}</a>
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  name: "RibbonBar",
  props: {
    label: { type: String, default: null },
    message: { type: String, default: "" },
    linkLabel: { type: String, default: null },
    linkUrl: { type: String, default: null },
    muted: { type: Boolean, default: false },
    animated: { type: Boolean, default: true }
  },
  computed: {
    displayMessage() {
      return this.message || (this.muted ? this.$t("systemRibbon.previewPlaceholder") : "");
    }
  }
};
</script>

<style scoped>
.nb-ribbon {
  position: relative;
  width: 100%;
  min-height: 60px;
  background: #000055;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  animation: nbExpandFull 620ms cubic-bezier(0.16, 1, 0.3, 1) 240ms both;
  overflow: hidden;
}

.nb-ribbon--muted,
.nb-ribbon--static {
  animation: none;
}

.nb-ribbon--muted .nb-ribbon__content,
.nb-ribbon--static .nb-ribbon__content {
  animation: none;
}

.nb-ribbon--muted .nb-ribbon__dot,
.nb-ribbon--static .nb-ribbon__dot {
  animation: none;
}

.nb-ribbon__content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 24px;
  animation: nbContent 340ms ease 580ms both;
}

.nb-ribbon__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f2ec4a;
  color: #f2ec4a;
  flex-shrink: 0;
  animation: nbDot 2.4s ease-out infinite;
}

.nb-ribbon__label {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.62);
}

.nb-ribbon__divider {
  width: 1px;
  height: 18px;
  background: rgba(255, 255, 255, 0.22);
}

.nb-ribbon__message {
  flex: 0 1 auto;
  min-width: 0;
  font-size: 13.5px;
  color: #fff;
}

.nb-ribbon__link {
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 700;
  color: #f2ec4a;
  text-decoration: none;
  white-space: nowrap;
}

.nb-ribbon__link:hover {
  text-decoration: underline;
}

@keyframes nbExpandFull {
  from {
    width: 72px;
  }

  to {
    width: 100%;
  }
}

@keyframes nbContent {
  from {
    opacity: 0;
    transform: translateX(14px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes nbDot {
  0% {
    box-shadow: 0 0 0 0 currentColor;
    opacity: 0.9;
  }

  70% {
    box-shadow: 0 0 0 8px transparent;
  }

  100% {
    box-shadow: 0 0 0 0 transparent;
    opacity: 0.9;
  }
}

@media (prefers-reduced-motion: reduce) {

  .nb-ribbon,
  .nb-ribbon__content {
    animation: nbFade 150ms linear both !important;
  }

  .nb-ribbon__dot {
    animation: none !important;
  }
}

@keyframes nbFade {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
