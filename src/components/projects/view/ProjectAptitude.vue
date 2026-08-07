<template>
  <q-card class="shadow-1 radius-20">
    <q-expansion-item class="shadow-1 overflow-hidden radius-20" :label="$t('projectComponents.aptitude.title')"
      header-class="bg-white text-black" v-model="expandedAptitude">
      <q-card-section>
        <q-banner rounded class="bg-grey-3 font-16">
          <p class="q-my-sm text-block" v-html="text"></p>
        </q-banner>
        <div class="q-mt-md">
          <div v-for="type in ['finanzen', 'personal', 'foerdermittelgeber']" :key="type" class="q-mb-sm">
            <div class="row items-center q-py-xs">
              <q-icon name="mdi-circle" :color="statusColor(type)" size="14px" class="q-mr-sm" />
              <div class="col font-14">{{ $t(`projectComponents.aptitude.vorpruefung.${type}`) }}</div>
              <div v-if="ticketByType(type)" class="font-14 text-blue-grey-7">
                {{ ticketByType(type).sentAt ? new Date(ticketByType(type).sentAt).toLocaleDateString('de-DE') : '' }}
              </div>
            </div>
            <div v-if="ticketByType(type) && ticketByType(type).reviewerContact" class="font-14 text-blue-grey-7 q-pl-lg">
              {{ $t('projectComponents.aptitude.vorpruefung.recipientEmail') }}: {{ ticketByType(type).reviewerContact }}
            </div>
            <div v-if="ticketByType(type) && ticketByType(type).answeredAt" class="font-14 q-pl-lg">
              <div>{{ statusLabel(type) }}</div>
              <div v-if="ticketByType(type).wantsPhoneCall">{{ $t('projectComponents.aptitude.vorpruefung.wantsPhoneCall') }}</div>
              <div v-if="ticketByType(type).wantsOnsiteMeeting">{{ $t('projectComponents.aptitude.vorpruefung.wantsOnsiteMeeting') }}</div>
              <div class="q-mt-xs">{{ ticketByType(type).responseText }}</div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-expansion-item>
  </q-card>
</template>

<script>
export default {
  name: "ProjectAptitude",
  props: {
    project: {
      type: Object,
      required: true
    },
    currentTab: {
      type: String,
      default: null,
      required: true
    }
  },
  data() {
    return {
      expandedAptitude: this.currentTab === "aptitude",
      vorpruefungTickets: []
    };
  },
  watch: {
    currentTab(newTab) {
      // Expand the section if the current tab is 'aptitude'
      this.expandedAptitude = newTab === "aptitude";
    }
  },
  computed: {
    // Get the text for the aptitude section
    text() {
      return this.project.details.aptitude || this.$t('projectComponents.aptitude.noRecommendation');
    }
  },
  methods: {
    ticketByType(type) {
      return this.vorpruefungTickets.find(t => t.type === type) || null;
    },
    statusColor(type) {
      const t = this.ticketByType(type);
      if (!t || !t.answeredAt) return t ? "orange" : "grey-5";
      return t.status === "positiv" ? "green" : "red";
    },
    statusLabel(type) {
      const t = this.ticketByType(type);
      if (!t) return "";
      if (t.status === "positiv") return this.$t("projectComponents.aptitude.vorpruefung.statusPositiv");
      if (t.status === "negativ") return this.$t("projectComponents.aptitude.vorpruefung.statusNegativ");
      return this.$t("projectComponents.aptitude.vorpruefung.statusRuecksprache");
    }
  },
  mounted() {
    this.$store.dispatch("project/fetchVorpruefungTickets", { projectId: this.project.id })
      .then(tickets => { this.vorpruefungTickets = tickets; });
  }
}
</script>

<style lang="scss" scoped></style>
