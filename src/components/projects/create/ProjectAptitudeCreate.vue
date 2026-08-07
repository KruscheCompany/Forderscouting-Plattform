<template>
  <q-card class="shadow-1 radius-20">
    <q-expansion-item class="shadow-1 overflow-hidden radius-20" :label="$t('projectComponents.aptitude.title')"
      header-class="bg-white text-black" v-model="expandedAptitude">
      <q-card-section>
        <div>
          <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
            {{ $t('projectComponents.aptitude.description') }}
          </h4>
          <q-input outlined type="textarea" rows="10" class="no-shadow input-radius-6" v-model="aptitude"
            @blur="saveAptitude" />
          <div class="row items-center q-gutter-xs q-mt-xs font-13 text-blue-grey-6" style="min-height: 20px;">
            <q-spinner v-if="saveState === 'saving'" size="16px" color="blue-grey-6" />
            <q-icon v-else-if="saveState === 'saved'" name="check_circle" color="positive" size="16px" />
            <span v-if="saveState === 'saving'">{{ $t('projectComponents.aptitude.saving') }}</span>
            <span v-else-if="saveState === 'saved'">{{ $t('projectComponents.aptitude.saved') }}</span>
          </div>
          <div class="q-mt-md">
            <VorpruefungTicketCard type="finanzen" :project-id="createdProjectId"
              :ticket="ticketByType('finanzen')" :recipient-email="recipientEmail('finanzen')"
              @ticket-created="loadTickets" />
            <VorpruefungTicketCard type="personal" :project-id="createdProjectId"
              :ticket="ticketByType('personal')" :recipient-email="recipientEmail('personal')"
              @ticket-created="loadTickets" />
            <VorpruefungTicketCard type="foerdermittelgeber" :project-id="createdProjectId"
              :ticket="ticketByType('foerdermittelgeber')" :recipient-email="recipientEmail('foerdermittelgeber')"
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
  },
  beforeDestroy() {
    clearTimeout(this.saveStateTimeout);
  },
  methods: {
    ticketByType(type) {
      return this.vorpruefungTickets.find(t => t.type === type) || null;
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
      if (type === "foerdermittelgeber") return this.projectData.fundingGuideline?.[0]?.info?.email || null;
      return null;
    },
    async loadTickets() {
      this.vorpruefungTickets = await this.$store.dispatch("project/fetchVorpruefungTickets", {
        projectId: this.createdProjectId
      });
      const allGreen = ["finanzen", "personal", "foerdermittelgeber"].every(type => {
        const t = this.ticketByType(type);
        return t && t.status === "positiv";
      });
      this.$emit("tickets-updated", allGreen);
    },
    // Get updated steps with aptitude marked as done
    getUpdatedSteps() {
      // Use existing steps from projectData if available, otherwise use default steps
      const currentSteps = this.projectData.fundingCheckSteps || this.resetSteps;

      return currentSteps.map(step => {
        if (step.name === 'aptitude') {
          // Mark aptitude as done when submitting
          return { ...step, done: true };
        }
        // Keep all other steps as they are
        return { ...step };
      });
    },

    async submitAptitude() {
      const allGreen = ["finanzen", "personal", "foerdermittelgeber"].every(type => {
        const t = this.ticketByType(type);
        return t && t.status === "positiv";
      });
      if (!allGreen) {
        this.$q.notify({
          type: "warning",
          message: this.$t("projectComponents.aptitude.vorpruefung.gateBlocked")
        });
        return;
      }

      await this.$store.dispatch('project/simpleUpdateProjectIdea', {
        data: {
          id: this.createdProjectId,
          details: {
            id: this.projectData.details.id,
            aptitude: this.aptitude
          },
          fundingCheckSteps: this.getUpdatedSteps()
        }
      });
      this.$emit("aptitude-submitted", this.aptitude);
    }
  }
}
</script>

<style lang="scss" scoped></style>
