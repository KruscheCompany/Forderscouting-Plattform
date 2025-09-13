<template>
  <q-card class="shadow-1 radius-20">
    <q-expansion-item class="shadow-1 overflow-hidden radius-20" :label="$t('projectComponents.fundingCheck.title')"
      header-class="bg-white text-black" v-model="expandedFundingCheck">

      <div class="row q-col-gutter-sm q-pa-md">
        <div class="col-12 col-sm-6 col-md-3 col-lg-2" v-for="(funding, index) in fundingMatches" :key="index">
          <div class="funding-card shadow-0 radius-20 q-pl-md q-pt-sm q-pb-md q-pr-sm cursor-pointer transition-all"
            :class="{ 'selected': selectedCard === index }" @click="toggleCard(index)" @mouseenter="hoveredCard = index"
            @mouseleave="hoveredCard = null">

            <!-- Card content with flex layout -->
            <div class="card-content">
              <!-- Top row with index and link button -->
              <div class="row items-center justify-between q-mb-sm">
                <div class="col">
                  <div class="row items-center">
                    <div class="funding-index text-weight-bold text-primary q-mr-sm">
                      {{ index + 1 }}
                    </div>
                    <div class="funding-score text-weight-bold"
                      :class="{ 'text-white': selectedCard === index, 'text-primary': selectedCard !== index }">
                      <q-icon name="star" size="16px" class="q-mr-xs"
                        :color="selectedCard === index ? 'white' : 'amber'" />
                      {{ (funding.score * 100).toFixed(2) }}%
                    </div>
                  </div>
                </div>
                <q-btn flat dense round size="lg" icon="mdi-arrow-top-right-thin-circle-outline"
                  :color="selectedCard === index ? 'white' : 'black'" @click.stop="openFundingLink(funding.external_id)"
                  class="funding-link-btn" :disabled="!funding.external_id" />
              </div>

              <!-- Spacer to push title to bottom -->
              <div class="flex-spacer"></div>

              <!-- Title at bottom -->
              <div class="funding-title font-16 text-weight-medium q-mb-md">
                {{ funding.title }}
              </div>
            </div>
          </div>
        </div>

        <!-- Refresh Card -->
        <div class="col-12 col-sm-6 col-md-3 col-lg-2">
          <div class="refresh-card shadow-0 radius-20 q-pl-md q-pt-sm q-pb-md q-pr-sm cursor-pointer transition-all"
            :class="{ 'selected': selectedCard === 'refresh', 'loading': isRefreshing }"
            @click="refreshFundingMatches()">

            <div class="card-content">
              <!-- Top row with icon -->
              <div class="row items-center justify-between q-mb-sm">
                <div class="refresh-icon">
                  <q-icon :name="isRefreshing ? 'hourglass_empty' : 'refresh'" size="sm"
                    :class="{ 'rotating': isRefreshing }" />
                </div>
              </div>

              <!-- Spacer to push title to bottom -->
              <div class="flex-spacer"></div>

              <!-- Title at bottom -->
              <div class="funding-title font-16 text-weight-medium q-mb-md">
                {{ isRefreshing ? $t('projectComponents.fundingCheck.refreshing') :
                  $t('projectComponents.fundingCheck.refresh') }}
              </div>
            </div>
          </div>
        </div>

        <!-- Fehlanzeige Card -->
        <div class="col-12 col-sm-6 col-md-3 col-lg-2">
          <div class="fehlanzeige-card shadow-0 radius-20 q-pl-md q-pt-sm q-pb-md q-pr-sm cursor-pointer transition-all"
            :class="{ 'selected': selectedCard === 'fehlanzeige' }" @click="toggleCard('fehlanzeige')">

            <div class="card-content">
              <!-- Top row with icon -->
              <div class="row items-center justify-between q-mb-sm">
                <div class="fehlanzeige-icon">
                  <q-icon name="close" size="sm" />
                </div>
              </div>

              <!-- Spacer to push title to bottom -->
              <div class="flex-spacer"></div>

              <!-- Title at bottom -->
              <div class="funding-title font-16 text-weight-medium q-mb-md">
                {{ $t('projectComponents.fundingCheck.fehlanzeige') }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Funding Comparison Section Component -->
      <FundingComparisonSection :selectedCard="selectedCard" :projectData="projectData" />

      <!-- Warning Dialog for Starting Condition Changes -->
      <StartingConditionWarningDialog :modelValue="showWarningDialog" :loading="isLoading"
        @confirm="proceedWithSubmission" @cancel="cancelSubmission" />

    </q-expansion-item>
  </q-card>
</template>

<script>
import { mapGetters } from 'vuex';
import StartingConditionWarningDialog from 'src/components/dialogs/StartingConditionWarningDialog.vue';
import FundingComparisonSection from 'src/components/projects/create/FundingComparisonSection.vue';
import { disable } from 'darkreader';

export default {
  name: "ProjectFundingCheckCreate",
  components: {
    StartingConditionWarningDialog,
    FundingComparisonSection
  },
  props: {
    currentTab: {
      type: String,
      default: ''
    },
    projectData: {
      type: Object,
      default: () => ({})
    },
    createdProjectId: {
      type: Number,
      default: null
    }
  },
  emits: ['funding-submitted', 'previous-step', 'next-step'],
  data() {
    return {
      expandedFundingCheck: this.currentTab === 'fundingCheck',
      selectedCard: null,
      selectedFunding: null,
      hoveredCard: null,
      isRefreshing: false,
      isSubmitting: false,
      showWarningDialog: false,
      isLoading: false,
      pendingFundingData: null, // Store data to submit after warning confirmation
      resetSteps: [
        { name: 'project', title: 'Project Description', icon: 'description', done: true },
        { name: 'fundingCheck', title: 'Funding Check', icon: 'monetization_on', done: true },
        { name: 'qAndA', title: 'Open Questions', icon: 'help_outline', done: false },
        { name: 'aptitude', title: 'Aptitude', icon: 'check_circle', done: false },
        { name: 'decision', title: 'Basic decision', icon: 'gavel', done: false }
      ]
    };
  },
  computed: {
    ...mapGetters('ai', ['getFundingMatches', 'getLoadingFundingMatches']),
    fundingMatches() {
      return !!this.projectData.fundingMatches && this.projectData.fundingMatches.length > 0 ? this.projectData.fundingMatches.filter(funding => !funding.isFehlanzeige) : this.getFundingMatches;
    },
    isLoadingMatches() {
      return this.getLoadingFundingMatches || false;
    },
    // Computed property to get the originally selected funding index
    originalSelectedFundingIndex() {
      if (!this.projectData.fundingMatches || this.projectData.fundingMatches.length === 0) {
        return null;
      }
      const selectedFundingIndex = this.projectData.fundingMatches.findIndex(funding => funding.selected && !funding.isFehlanzeige);
      const isFehlanzeige = this.projectData.fundingMatches.some(funding => funding.selected && funding.isFehlanzeige);
      return selectedFundingIndex !== -1 ? selectedFundingIndex : isFehlanzeige ? 'fehlanzeige' : null;
    },
    // Check if user has changed their funding selection
    hasFundingSelectionChanged() {
      const originalIndex = this.originalSelectedFundingIndex;

      // If no original selection exists, this is a first-time selection (not a change)
      if (originalIndex === null) {
        return false;
      }

      // If original selection exists, check if current selection is different
      return this.selectedCard !== originalIndex;
    },
    // Check if this is a first-time funding selection
    isFirstTimeFundingSelection() {
      const originalIndex = this.originalSelectedFundingIndex;
      return originalIndex === null && this.selectedCard !== null;
    },
    funding() {
      return this.$store.state.funding.funding;
    }
  },
  watch: {
    currentTab(newTab) {
      this.expandedFundingCheck = newTab === "fundingCheck";
    },
    // Watch for changes in originalSelectedFundingIndex to set initial selection
    originalSelectedFundingIndex: {
      immediate: true,
      handler(newIndex) {
        if (newIndex !== null && this.selectedCard === null) {
          this.selectedCard = newIndex;
        }
      }
    }
  },
  methods: {
    toggleExpansion() {
      this.expanded = !this.expanded;
    },
    openFundingLink(id) {
      if (
        !!id &&
        id !== (!!this.$route.params && Number(this.$route.params.id))
      ) {
        // this.$router.push({ path: `/user/newFunding/${id}` });
        this.$router.push({ path: `/user/newFunding/361` });
      }
    },
    async refreshFundingMatches() {
      if (this.isRefreshing) return; // Prevent multiple simultaneous requests

      // Check if there are existing funding matches that would be reset
      const hasExistingMatches = this.projectData.fundingMatches && this.projectData.fundingMatches.length > 0;

      if (hasExistingMatches) {
        // Show warning dialog before proceeding
        this.showWarningDialog = true;
        return;
      }

      // If no existing matches, proceed directly
      await this.performRefresh();
    },

    async performRefresh() {
      this.isRefreshing = true;
      this.isLoading = true;
      this.selectedCard = 'refresh';

      try {
        // Check if projectData has the required data
        if (!this.projectData?.details?.startingCondition) {
          this.$q.notify({
            color: 'negative',
            message: this.$t('projectComponents.fundingCheck.noProjectData'),
            icon: 'warning'
          });
          return;
        }

        await this.$store.dispatch('ai/matchFunding', {
          projectData: this.projectData.details.startingCondition
        });

        this.$q.notify({
          color: 'positive',
          message: this.$t('projectComponents.fundingCheck.successRefresh'),
          icon: 'check'
        });

      } catch (error) {
        console.error('Error refreshing funding matches:', error);
        this.$q.notify({
          color: 'negative',
          message: this.$t('projectComponents.fundingCheck.errorRefresh'),
          icon: 'error'
        });
      } finally {
        this.isRefreshing = false;
        this.isLoading = false;
        this.selectedCard = null;
      }
    },

    proceedWithSubmission() {
      this.showWarningDialog = false;
      if (this.pendingFundingData) {
        this.performFundingUpdate(this.pendingFundingData, true); // true indicates nullify questions
        this.pendingFundingData = null;
      } else {
        this.performRefresh();
      }
    },

    cancelSubmission() {
      this.showWarningDialog = false;
      this.isLoading = false;
      this.pendingFundingData = null;
    },

    async performFundingUpdate(fundingMatchesWithSelection, nullifyQuestions = false) {
      try {
        const updateData = {
          id: this.createdProjectId,
          fundingMatches: fundingMatchesWithSelection,
          fundingCheckSteps: this.getUpdatedSteps(nullifyQuestions)
        };

        // Nullify questions if user proceeded after warning
        if (nullifyQuestions) {
          updateData.questions = null;
        }

        // Call editProjectIdea to add funding matches to the project
        const response = await this.$store.dispatch('project/simpleUpdateProjectIdea', {
          data: updateData
        });

        // Emit success event
        this.$emit('funding-submitted', {
          fundingMatches: fundingMatchesWithSelection,
          noneSelected: this.selectedCard === 'fehlanzeige'
        });

      } catch (error) {
        console.error('Error saving funding selection:', error);
        this.$emit('funding-selection-error', {
          message: this.$t('projectComponents.fundingCheck.errorSaving'),
          error
        });
      }
    },

    // Get updated steps based on current state and whether questions are being nullified
    getUpdatedSteps(nullifyQuestions = false) {
      // Use existing steps from projectData if available, otherwise use default steps
      const currentSteps = this.projectData.fundingCheckSteps || this.resetSteps;

      return currentSteps.map(step => {
        if (step.name === 'fundingCheck') {
          // Always mark fundingCheck as done when submitting
          return { ...step, done: true };
        } else if (step.name === 'qAndA' && this.selectedCard === 'fehlanzeige') {
          return { ...step, done: false, skip: true };
        } else if (step.name === 'qAndA' && nullifyQuestions) {
          // Reset qAndA step when nullifying questions
          return { ...step, done: false };
        } else if (step.name === 'qAndA') {
          return { ...step, skip: false };
        }
        // Keep all other steps as they are
        return { ...step };
      });
    },
    async toggleCard(index) {
      // Special handling for Fehlanzeige card
      if (index === 'fehlanzeige') {
        this.selectedCard = this.selectedCard === 'fehlanzeige' ? null : 'fehlanzeige';
        return;
      }

      // For regular funding cards, toggle selection
      const wasSelected = this.selectedCard === index;
      this.selectedCard = wasSelected ? null : index;

      // If a card is being selected (not deselected), fetch specific funding data
      if (!wasSelected && typeof index === 'number') {
        await this.$store.dispatch('funding/resetSelectedFunding');
        // For now, use hardcoded ID 361. Later will use funding.external_id
        // const fundingId = 361; // Later replace with:
        const fundingId = this.fundingMatches[index].external_id;

        console.log('Fetching specific funding data for ID:', fundingId);

        // Call the store action to get specific funding data
        await this.$store.dispatch('funding/getSpecificFunding', { id: fundingId })
        this.selectedFunding = this.funding;
      }
    },
    // Get funding matches with selection status property
    getFundingMatchesWithSelection() {
      const matches = this.fundingMatches || [];

      // Add selected property to all funding matches
      return matches.map((funding, index) => ({
        ...funding,
        selected: this.selectedCard === index
      }));
    },
    async submitFundingCheck() {
      this.isSubmitting = true;

      try {
        let fundingMatchesWithSelection = this.getFundingMatchesWithSelection();

        // Validate that either a funding match is selected OR fehlanzeige is selected
        const hasSelection = fundingMatchesWithSelection.some(funding => funding.selected) || this.selectedCard === 'fehlanzeige';

        if (!hasSelection) {
          this.$q.notify({
            color: 'negative',
            message: this.$t('projectComponents.fundingCheck.pleaseSelect'),
            icon: 'warning'
          });
          return;
        }

        // If fehlanzeige is selected, add it as a special object to the funding matches array
        if (this.selectedCard === 'fehlanzeige') {
          const fehlanzeigeFunding = {
            _id: 'fehlanzeige',
            title: this.$t('projectComponents.fundingCheck.fehlanzeige'),
            score: 0,
            selected: true,
            isFehlanzeige: true
          };
          fundingMatchesWithSelection.push(fehlanzeigeFunding);
        }

        // Check if funding selection has changed and show warning
        if (this.hasFundingSelectionChanged) {
          this.pendingFundingData = fundingMatchesWithSelection;
          this.showWarningDialog = true;
          return;
        }

        // If first-time selection, call API to save without warning
        if (this.isFirstTimeFundingSelection) {
          await this.performFundingUpdate(fundingMatchesWithSelection);
          return;
        }

        // If no changes and not first-time, just emit without API call
        this.$emit('funding-submitted', {
          fundingMatches: fundingMatchesWithSelection,
          noChange: true,
          noneSelected: this.selectedCard === 'fehlanzeige'
        });

      } catch (error) {
        console.error('Error saving funding selection:', error);
        this.$emit('funding-selection-error', {
          message: this.$t('projectComponents.fundingCheck.errorSaving'),
          error
        });
      } finally {
        this.isSubmitting = false;
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.funding-card {
  background: #f5f5f5;
  min-height: 160px;
  max-height: 160px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  .card-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 148px; // Account for padding
  }

  .flex-spacer {
    flex: 1;
  }

  &:hover {
    border-color: #1976d2;
    transform: translateY(-2px);
  }

  &.selected {
    background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
    border: 0;
    box-shadow: none;
    color: white;

    .funding-index {
      background: white
    }

    .funding-title {
      color: white;
    }

    .funding-score {
      color: white;
    }

    .funding-preview {
      color: rgba(255, 255, 255, 0.8);
    }

    .q-icon {
      color: rgba(255, 255, 255, 0.8);
    }
  }
}

.funding-index {
  font-size: 1.2em;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(25, 118, 210, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: $blue;
}

.funding-score {
  display: flex;
  align-items: center;
  font-size: 0.9em;

  .q-icon {
    margin-top: -2px;
  }
}

.funding-link-btn {
  opacity: 0.7;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
}

.funding-title {
  font-size: 14px;
  line-height: 1.3;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.funding-preview {
  font-size: 12px;
}

.expanded-content {
  border-left: 4px solid #1976d2;
  margin-left: 8px;
}

.transition-all {
  transition: all 0.3s ease;
}

// Refresh Card Styles
.refresh-card {
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  border: 2px dashed #4caf50;
  opacity: 0.9;
  min-height: 160px;
  max-height: 160px;
  overflow: hidden;

  .card-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 148px; // Account for padding - same as funding cards
  }

  .flex-spacer {
    flex: 1;
  }

  .refresh-icon {
    font-size: 1.2em;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: rgba(76, 175, 80, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #4caf50;

    .rotating {
      animation: spin 2s linear infinite;
    }
  }

  &:hover {
    border-color: #388e3c;
    transform: translateY(-2px);
    opacity: 1;
  }

  &.selected {
    background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
    border: 2px solid #4caf50;
    color: white;

    .refresh-icon {
      background: white;
      color: #4caf50;
    }
  }

  &.loading {
    background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
    border: 2px solid #4caf50;
    color: white;
    cursor: not-allowed;

    .refresh-icon {
      background: white;
      color: #4caf50;
    }

    &:hover {
      transform: none;
    }
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

// Fehlanzeige Card Styles
.fehlanzeige-card {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  border: 2px dashed #ff9800;
  opacity: 0.9;
  min-height: 160px;
  max-height: 160px;
  overflow: hidden;

  .card-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 148px; // Account for padding - same as funding cards
  }

  .flex-spacer {
    flex: 1;
  }

  .fehlanzeige-icon {
    font-size: 1.2em;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: rgba(255, 152, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ff9800;
  }

  &:hover {
    border-color: #f57c00;
    transform: translateY(-2px);
    opacity: 1;
  }

  &.selected {
    background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
    border: 2px solid #ff9800;
    color: white;

    .fehlanzeige-icon {
      background: white;
      color: #ff9800;
    }
  }
}

// Responsive adjustments
@media (max-width: 1023px) {
  .funding-card {
    min-height: 140px;
  }

  .refresh-card {
    min-height: 140px;
    max-height: 140px;
  }

  .fehlanzeige-card {
    min-height: 140px;
    max-height: 140px;
  }
}

@media (max-width: 767px) {
  .funding-card {
    min-height: 120px;
  }

  .funding-title {
    font-size: 13px;
    min-height: 35px;
  }

  .refresh-card {
    min-height: 120px;
    max-height: 120px;
  }

  .fehlanzeige-card {
    min-height: 120px;
    max-height: 120px;
  }
}
</style>
