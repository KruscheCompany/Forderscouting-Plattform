<template>
  <RibbonBar
    v-if="visible"
    :message="ribbon.message"
    :link-label="ribbon.linkLabel"
    :link-url="safeLinkUrl"
  >
    <div
      class="nb-ribbon__close"
      role="button"
      :aria-label="$t('systemRibbon.close')"
      :title="$t('systemRibbon.close')"
      @click="dismiss"
    >
      <img class="nb-ribbon__close-logo" src="/AMTVIOEL-Projektkompass-Bildmarke-RGB.png" alt="" />
    </div>
  </RibbonBar>
</template>

<script>
import RibbonBar from "./RibbonBar.vue";

const DISMISSED_KEY = "dismissedSystemRibbonId";

export default {
  name: "SystemRibbon",
  components: { RibbonBar },
  data() {
    return { dismissedId: localStorage.getItem(DISMISSED_KEY) };
  },
  computed: {
    ribbon() {
      return this.$store.getters["notifications/activeRibbon"];
    },
    visible() {
      return !!this.ribbon && String(this.ribbon.id) !== this.dismissedId;
    },
    safeLinkUrl() {
      const url = this.ribbon && this.ribbon.linkUrl;
      if (!url) return null;
      try {
        const parsed = new URL(url, window.location.origin);
        return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.href : null;
      } catch (e) {
        return null;
      }
    }
  },
  methods: {
    dismiss() {
      localStorage.setItem(DISMISSED_KEY, String(this.ribbon.id));
      this.dismissedId = String(this.ribbon.id);
    }
  },
  mounted() {
    this.$store.dispatch("notifications/fetchActiveRibbon");
  }
};
</script>

<style scoped>
.nb-ribbon__close {
  width: 72px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-left: 1px solid rgba(255, 255, 255, 0.16);
  animation: nbSeed 340ms cubic-bezier(0.2, 1.5, 0.4, 1) both;
}

.nb-ribbon__close-logo {
  height: 26px;
  width: auto;
}

@keyframes nbSeed {
  0% { opacity: 0; transform: translateY(-18px) scale(0.55); }
  60% { opacity: 1; }
  100% { opacity: 1; transform: none; }
}

@media (prefers-reduced-motion: reduce) {
  .nb-ribbon__close {
    animation: none !important;
  }
}
</style>
