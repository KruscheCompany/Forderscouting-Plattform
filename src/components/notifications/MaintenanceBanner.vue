<template>
  <RibbonBar v-if="visible" :label="$t('maintenanceBanner.label')" :message="displayMessage">
    <div
      class="nb-ribbon__close"
      role="button"
      :aria-label="$t('maintenanceBanner.close')"
      :title="$t('maintenanceBanner.close')"
      @click="dismiss"
    >
      <q-icon name="close" color="white" size="20px" />
    </div>
  </RibbonBar>
</template>

<script>
import { date } from "quasar";
import { mapState } from "vuex";
import RibbonBar from "./RibbonBar.vue";

const DISMISSED_KEY = "dismissedMaintenanceScheduledStart";

export default {
  name: "MaintenanceBanner",
  components: { RibbonBar },
  data() {
    return { dismissedScheduledStart: sessionStorage.getItem(DISMISSED_KEY) };
  },
  computed: {
    ...mapState("general", {
      enabled: (state) => state.maintenanceEnabled,
      message: (state) => state.maintenanceMessage,
      scheduledStart: (state) => state.maintenanceScheduledStart
    }),
    visible() {
      return (
        !this.enabled &&
        !!this.scheduledStart &&
        this.scheduledStart !== this.dismissedScheduledStart
      );
    },
    displayMessage() {
      const formattedDate = date.formatDate(new Date(this.scheduledStart), "DD.MM.YYYY, HH:mm");
      return this.$t("maintenanceBanner.message", { date: formattedDate, message: this.message });
    }
  },
  methods: {
    dismiss() {
      sessionStorage.setItem(DISMISSED_KEY, this.scheduledStart);
      this.dismissedScheduledStart = this.scheduledStart;
    }
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
}
</style>
