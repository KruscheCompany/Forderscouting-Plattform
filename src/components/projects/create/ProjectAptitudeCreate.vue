<template>
  <q-card class="shadow-1 radius-20">
    <q-expansion-item class="shadow-1 overflow-hidden radius-20" :label="$t('projectComponents.aptitude.title')"
      header-class="bg-white text-black" v-model="expandedAptitude">
      <q-card-section>
        <div>
          <div class="row items-center q-gutter-xs q-mt-xs font-13 text-blue-grey-6">
            <q-spinner v-if="saveState === 'saving'" size="16px" color="blue-grey-6" />
            <q-icon v-else-if="saveState === 'saved'" name="check_circle" color="positive" size="16px" />
            <span v-if="saveState === 'saving'">{{ $t('projectComponents.aptitude.saving') }}</span>
            <span v-else-if="saveState === 'saved'">{{ $t('projectComponents.aptitude.saved') }}</span>
          </div>
          <div class="q-mt-md">
            <VorpruefungTicketCard type="finanzen" :project-id="createdProjectId" :tickets="ticketsByType('finanzen')"
              :recipient-email="recipientEmail('finanzen')" @ticket-created="loadTickets" />
            <VorpruefungTicketCard type="personal" :project-id="createdProjectId" :tickets="ticketsByType('personal')"
              :recipient-email="recipientEmail('personal')" @ticket-created="loadTickets" />
            <VorpruefungTicketCard type="foerdermittelgeber" :project-id="createdProjectId"
              :tickets="ticketsByType('foerdermittelgeber')" :recipient-email="recipientEmail('foerdermittelgeber')"
              @ticket-created="loadTickets" />
          </div>
        </div>
      </q-card-section>
    </q-expansion-item>
  </q-card>
</template>

<script>
import VorpruefungTicketCard from "src/components/projects/create/VorpruefungTicketCard.vue";

export default {
  name: "ProjectAptitude",
  components: {
    VorpruefungTicketCard
  },
  props: {
    projectData: {
      type: Object,
      required: true
    },
    currentTab: {
      type: String,
      default: null,
      required: true
    },
    createdProjectId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      expandedAptitude: this.currentTab === "aptitude",
      aptitude: this.projectData.details.aptitude || "",
      savedAptitude: this.projectData.details.aptitude || "",
      saveState: null,
      saveStateTimeout: null,
      vorpruefungTickets: [],
      fundingProviderEmail: null,
      resetSteps: [
        { name: 'project', title: 'Project Description', icon: 'description', done: true },
        { name: 'fundingCheck', title: 'Funding Check', icon: 'monetization_on', done: true },
        { name: 'qAndA', title: 'Open Questions', icon: 'help_outline', done: true },
        { name: 'aptitude', title: 'Aptitude', icon: 'check_circle', done: true },
        { name: 'decision', title: 'Basic decision', icon: 'gavel', done: false }
      ]
    };
  },
  watch: {
    currentTab(newTab) {
      // Expand the section if the current tab is 'aptitude'
      this.expandedAptitude = newTab === "aptitude";
    }
  },
  mounted() {
    this.loadTickets();
    this.resolveFundingProviderEmail();
  },
  beforeDestroy() {
    clearTimeout(this.saveStateTimeout);
  },
  methods: {
    liveTicketByType(type) {
      return this.vorpruefungTickets.find(t => t.type === type && !t.supersededAt) || null;
    },
    ticketsByType(type) {
      return this.vorpruefungTickets
        .filter(t => t.type === type)
        .sort((a, b) => b.id - a.id);
    },
    allReviewsPositive() {
      return ["finanzen", "personal", "foerdermittelgeber"].every(type => {
        const ticket = this.liveTicketByType(type);
        return !!ticket && ticket.status === "positiv";
      });
    },
    async saveAptitude() {
      if (this.aptitude === this.savedAptitude) return;
      clearTimeout(this.saveStateTimeout);
      this.saveState = 'saving';
      await this.$store.dispatch('project/simpleUpdateProjectIdea', {
        data: {
          id: this.createdProjectId,
          details: {
            id: this.projectData.details.id,
            aptitude: this.aptitude
          }
        }
      });
      this.savedAptitude = this.aptitude;
      this.saveState = 'saved';
      this.saveStateTimeout = setTimeout(() => {
        this.saveState = null;
      }, 3000);
    },
    recipientEmail(type) {
      if (type === "finanzen") return this.projectData.municipality?.financeContactEmail || null;
      if (type === "personal") return this.projectData.municipality?.personnelContactEmail || null;
      if (type === "foerdermittelgeber") return this.fundingProviderEmail;
      return null;
    },
    async resolveFundingProviderEmail() {
      const selectedFunding = (this.projectData.fundingMatches || [])
        .find(funding => funding.selected && !funding.isFehlanzeige);
      if (!selectedFunding?.external_id) {
        this.fundingProviderEmail = null;
        return;
      }
      await this.$store.dispatch("funding/resetSelectedFunding");
      await this.$store.dispatch("funding/getSpecificFunding", { id: selectedFunding.external_id });
      this.fundingProviderEmail = this.$store.state.funding.funding?.info?.email || null;
    },
    async loadTickets() {
      this.vorpruefungTickets = await this.$store.dispatch("project/fetchVorpruefungTickets", {
        projectId: this.createdProjectId
      });
      this.$emit("tickets-updated", this.allReviewsPositive());
    },
    getUpdatedSteps(allPositive) {
      const currentSteps = this.projectData.fundingCheckSteps || this.resetSteps;

      return currentSteps.map(step => {
        if (step.name === 'aptitude') {
          return { ...step, done: allPositive, inProgress: !allPositive };
        }
        return { ...step };
      });
    },

    async submitAptitude() {
      const allPositive = this.allReviewsPositive();

      const result = await this.$store.dispatch('project/simpleUpdateProjectIdea', {
        data: {
          id: this.createdProjectId,
          details: {
            id: this.projectData.details.id,
            aptitude: this.aptitude
          },
          fundingCheckSteps: this.getUpdatedSteps(allPositive)
        }
      });
      if (result === false) return;

      this.savedAptitude = this.aptitude;

      this.$store.dispatch("notifications/pushToast", {
        kind: "positive",
        title: this.$t("projectComponents.aptitude.vorpruefung.saveSuccess")
      });

      if (!allPositive) {
        this.$store.dispatch("notifications/pushToast", {
          kind: "warning",
          title: this.$t("projectComponents.aptitude.vorpruefung.gateBlocked")
        });
        return;
      }

      this.$emit("aptitude-submitted", this.aptitude);
    }
  }
}
</script>

<style lang="scss" scoped></style>
