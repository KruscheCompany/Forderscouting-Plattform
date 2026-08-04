<template>
  <q-card class="shadow-1 radius-20">
    <q-expansion-item class="shadow-1 overflow-hidden radius-20" :label="$t('projectComponents.aptitude.title')"
      header-class="bg-white text-black" v-model="expandedAptitude">
      <q-card-section>
        <q-banner rounded class="bg-grey-3 font-16">
          <p class="q-my-sm text-block" v-html="text"></p>
        </q-banner>
        <div class="q-mt-md">
          <div v-for="type in ['finanzen', 'personal', 'foerdermittelgeber']" :key="type"
            class="row items-center q-py-xs">
            <q-icon name="mdi-circle" :color="statusColor(type)" size="14px" class="q-mr-sm" />
            <div class="col font-14">{{ $t(`projectComponents.aptitude.vorpruefung.${type}`) }}</div>
            <div v-if="ticketByType(type)" class="font-14 text-blue-grey-7">
              {{ ticketByType(type).sentAt ? new Date(ticketByType(type).sentAt).toLocaleDateString('de-DE') : '' }}
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
    }
  },
  mounted() {
    this.$store.dispatch("project/fetchVorpruefungTickets", { projectId: this.project.id })
      .then(tickets => { this.vorpruefungTickets = tickets; });
  }
}
</script>

<style lang="scss" scoped></style>
