<template>
  <q-card class="shadow-1 radius-20">
    <q-expansion-item class="shadow-1 overflow-hidden radius-20" :label="$t('projectComponents.financingCheck.title')"
      header-class="bg-white text-black" v-model="expandedFinancingCheck">
      <q-card-section class="q-pt-none">
        <div class="row">
          <div class="col-8 q-pr-sm">
            <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
              {{ $t('projectComponents.contentDetails.financingOverview') }}
            </h4>
            <q-input outlined type="textarea" rows="14" class="no-shadow input-radius-6"
              :placeholder="$t('newProjectIdeaForm.financialPlan')" v-model="financialPlan.description" />
          </div>
          <div class="col-4">
            <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
              {{ $t('projectComponents.contentDetails.financialPlanTitle') }}
            </h4>
            <q-input v-for="(plan, index) in financialPlan.costAndFinance" :key="index" outlined
              class="no-shadow input-radius-6 q-mb-md" :label="plan.title" v-model="plan.value" v-money="money"
              suffix="€" />
          </div>
        </div>
      </q-card-section>
    </q-expansion-item>
  </q-card>
</template>

<script>
import { VMoney } from "v-money";
export default {
  name: "ProjectFinancingCheck",
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
  directives: {
    money: VMoney
  },
  data() {
    return {
      expandedFinancingCheck: this.currentTab === "financingCheck",
      financialPlan: this.projectData.financialPlan || {
        description: "",
        costAndFinance: [
          { title: this.$t('ProjectDashboard.totalInvestment'), value: "" },
          { title: this.$t('ProjectDashboard.grants'), value: "" },
          { title: this.$t('ProjectDashboard.ownFunds'), value: "" },
          { title: this.$t('ProjectDashboard.thirdPartyFunds'), value: "" }
        ]
      },
      resetSteps: [
        { name: 'guidelineContentCheck', title: 'Guideline Check (Content)', icon: 'mdi-clipboard-check', done: false },
        { name: 'guidelineFormCheck', title: 'Guideline Check (Formalities)', icon: 'mdi-format-list-checks', done: false },
        { name: 'financingCheck', title: 'Financing Check', icon: 'mdi-cash-check', done: false },
        { name: 'projectDocumentsCoordination', title: 'Project Documents Coordination', icon: 'mdi-file-document-multiple', done: false },
        { name: 'applicationDecision', title: 'Application Decision', icon: 'mdi-gavel', done: false },
        { name: 'submissionSigning', title: 'Submission & Signing', icon: 'mdi-file-sign', done: false }
      ],
      money: {
        thousands: ".",
        decimal: ",",
        suffix: "",
        precision: 2,
        masked: false
      },
    };
  },
  watch: {
    currentTab(newTab) {
      // Expand the section if the current tab is 'financingCheck'
      this.expandedFinancingCheck = newTab === "financingCheck";
    }
  },
  methods: {
    // Get updated steps with financingCheck marked as done
    getUpdatedSteps() {
      // Use existing steps from projectData if available, otherwise use default steps
      const currentSteps = this.projectData.projectApplicationSteps || this.resetSteps;

      return currentSteps.map(step => {
        if (step.name === 'financingCheck') {
          // Mark financingCheck as done when submitting
          return { ...step, done: true };
        }
        // Keep all other steps as they are
        return { ...step };
      });
    },

    async submitFinancingCheck() {
      await this.$store.dispatch('project/simpleUpdateProjectIdea', {
        data: {
          id: this.createdProjectId,
          financialPlan: this.financialPlan,
          projectApplicationSteps: this.getUpdatedSteps()
        }
      });
      this.$emit("financingCheck-submitted");
    }
  }
}
</script>

<style lang="scss" scoped></style>
