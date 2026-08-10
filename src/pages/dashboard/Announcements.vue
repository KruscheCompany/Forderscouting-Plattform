<template>
  <q-page class="q-mt-lg q-pb-xl" :class="$q.screen.lt.md ? 'q-mx-md' : 'q-mx-xl'">
    <h5 class="q-my-none q-mb-md">{{ $t("systemRibbon.publishTitle") }}</h5>

    <div class="row items-center q-gutter-sm q-mb-md">
      <q-badge v-if="activeRibbon" rounded color="positive" class="q-px-sm q-py-xs">
        ● {{ $t("systemRibbon.liveLabel") }}
      </q-badge>
      <q-badge v-else rounded color="grey-5" class="q-px-sm q-py-xs">
        ○ {{ $t("systemRibbon.noneLive") }}
      </q-badge>
      <span v-if="activeRibbon" class="font-14 textColor">{{ activeRibbon.message }}</span>
      <q-btn v-if="activeRibbon" flat dense no-caps color="negative" class="text-weight-600"
        :label="$t('systemRibbon.unpublishBtn')" @click="unpublish" />
    </div>

    <RibbonBar class="radius-10 overflow-hidden q-mb-lg" :message="message" :link-label="linkLabel"
      :link-url="safeDraftLinkUrl" muted :animated="false" />

    <q-card class="bg-white radius-20 shadow-1 q-pa-lg">
      <q-input v-model="message" type="textarea" outlined class="no-shadow input-radius-6 q-mb-md"
        :label="$t('systemRibbon.messageLabel')" />
      <q-input v-model="linkLabel" outlined class="no-shadow input-radius-6 q-mb-md"
        :label="$t('systemRibbon.linkLabelLabel')" />
      <q-input v-model="linkUrl" outlined class="no-shadow input-radius-6 q-mb-md"
        :label="$t('systemRibbon.linkUrlLabel')" />

      <q-btn :label="$t('systemRibbon.publishBtn')" color="blue" unelevated no-caps class="radius-6 text-weight-600"
        :disable="!message" @click="publish" />
    </q-card>
  </q-page>
</template>

<script>
import RibbonBar from "components/notifications/RibbonBar.vue";

export default {
  name: "announcements",
  components: { RibbonBar },
  data() {
    return {
      message: "",
      linkLabel: "",
      linkUrl: ""
    };
  },
  computed: {
    activeRibbon() {
      return this.$store.getters["notifications/activeRibbon"];
    },
    safeDraftLinkUrl() {
      if (!this.linkUrl) return null;
      try {
        const parsed = new URL(this.linkUrl, window.location.origin);
        return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.href : null;
      } catch (e) {
        return null;
      }
    }
  },
  methods: {
    async publish() {
      await this.$store.dispatch("notifications/publishRibbon", {
        message: this.message,
        linkLabel: this.linkLabel || null,
        linkUrl: this.linkUrl || null
      });
      this.message = "";
      this.linkLabel = "";
      this.linkUrl = "";
      this.$store.dispatch("notifications/fetchActiveRibbon");
    },
    async unpublish() {
      await this.$store.dispatch("notifications/unpublishRibbon", this.activeRibbon.id);
    }
  },
  mounted() {
    this.$store.dispatch("notifications/fetchActiveRibbon");
  }
};
</script>
