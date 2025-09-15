<template>
  <q-card class="shadow-1 radius-20">
    <q-expansion-item class="shadow-1 overflow-hidden radius-20" :label="$t('projectComponents.qAndA.title')"
      header-class="bg-white text-black" v-model="expandedQAndA">
      <q-spinner-oval v-if="getLoadingFundingQuestions" color="primary" size="2em"
        class="q-my-lg full-width text-center" />
      <q-card-section v-else class="q-pt-none">
        <div v-if="localQuestions && localQuestions.length > 0">
          <q-list>
            <q-item v-for="(question, index) in localQuestions" :key="index" class="q-mb-sm q-pa-none">
              <q-item-section>
                <div class="row items-baseline q-col-gutter-y-sm">
                  <div class="col-12 col-md-4">
                    <p class="font-16 no-margin">
                      {{ question.text }}
                    </p>
                    <!-- Show funding source if available -->
                    <div v-if="question.fundingTitle" class="text-caption text-primary q-mt-xs">
                      <q-chip size="md" color="primary" text-color="white" dense>
                        {{ question.fundingTitle }}
                      </q-chip>
                    </div>
                  </div>
                  <div class="col-12 col-md-8">
                    <q-input outlined dense class="no-shadow input-radius-6" v-model="question.answer">
                      <template v-slot:append>
                        <q-btn flat round color="negative" icon="delete" size="md" @click="deleteQuestion(index)"
                          :aria-label="$t('delete')">
                          <q-tooltip>{{ $t('delete') }}</q-tooltip>
                        </q-btn>
                      </template>
                    </q-input>
                  </div>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <div v-else>
          <p class="text-grey">{{ $t('projectComponents.qAndA.noQuestions') }}</p>
        </div>
      </q-card-section>
    </q-expansion-item>
  </q-card>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: "ProjectQAndA",
  props: {
    currentTab: {
      type: String,
      default: null,
      required: true
    },
    createdProjectId: {
      type: Number,
      default: null
    },
    projectData: {
      type: Object,
      default: () => ({})
    },
  },
  data() {
    return {
      expandedQAndA: this.currentTab === "qAndA", // Expand by default if currentTab is 'qAndA'
      localQuestions: [],
      resetSteps: [
        { name: 'project', title: 'Project Description', icon: 'description', done: true },
        { name: 'fundingCheck', title: 'Funding Check', icon: 'monetization_on', done: true },
        { name: 'qAndA', title: 'Open Questions', icon: 'help_outline', done: true },
        { name: 'aptitude', title: 'Aptitude', icon: 'check_circle', done: false },
        { name: 'decision', title: 'Basic decision', icon: 'gavel', done: false }
      ]
    };
  },
  watch: {
    currentTab(newTab) {
      // Expand the section if the current tab is 'qAndA'
      this.expandedQAndA = newTab === "qAndA";
    },
    'projectData.questions': {
      immediate: true,
      handler(newQuestions) {
        this.initializeQuestions();
      }
    },
    getFundingQuestions: {
      immediate: true,
      handler() {
        this.initializeQuestions();
      }
    },
    getFundingQuestionsMap: {
      immediate: true,
      handler() {
        this.initializeQuestions();
      }
    },
    allFundingQuestions: {
      handler() {
        if (!this.projectData.questions || this.projectData.questions.length === 0) {
          this.initializeQuestions();
        }
      }
    }
  },
  computed: {
    ...mapGetters('ai', ['getFundingQuestions', 'getFundingQuestionsMap', 'getLoadingFundingQuestions']),
    // Get all selected fundings from project data
    selectedFundings() {
      if (!this.projectData || !this.projectData.fundingMatches) {
        return [];
      }
      return this.projectData.fundingMatches.filter(funding => funding.selected && !funding.isFehlanzeige);
    },
    // Combine questions from all selected fundings
    allFundingQuestions() {
      const questionsMap = this.getFundingQuestionsMap;
      const allQuestions = [];

      // For each selected funding, get its questions
      this.selectedFundings.forEach(funding => {
        const fundingQuestions = questionsMap[funding._id] || [];
        // Add funding info to questions to track their source
        fundingQuestions.forEach(question => {
          allQuestions.push({
            text: question,
            fundingId: funding._id,
            fundingTitle: funding.title,
            answer: ''
          });
        });
      });

      return allQuestions;
    },
  },
  methods: {
    // Delete question at the specified index
    deleteQuestion(index) {
      this.localQuestions.splice(index, 1);
    },
    // Initialize questions from projectData or from all funding questions
    initializeQuestions() {
      if (this.projectData.questions && this.projectData.questions.length > 0) {
        // If project data questions exist, use those
        this.localQuestions = JSON.parse(JSON.stringify(this.projectData.questions));
      } else if (this.allFundingQuestions && this.allFundingQuestions.length > 0) {
        // Use combined questions from all selected fundings
        this.localQuestions = this.allFundingQuestions;
      } else if (this.getFundingQuestions && this.getFundingQuestions.length > 0) {
        // Fallback to old implementation for backward compatibility
        this.localQuestions = this.getFundingQuestions.map(question => ({
          text: question,
          answer: ''
        }));
      } else {
        this.localQuestions = [];
      }
    },

    // Get updated steps with qAndA marked as done
    getUpdatedSteps() {
      // Use existing steps from projectData if available, otherwise use default steps
      const currentSteps = this.projectData.fundingCheckSteps || this.resetSteps;

      return currentSteps.map(step => {
        if (step.name === 'qAndA') {
          // Mark qAndA as done when submitting
          return { ...step, done: true };
        }
        // Keep all other steps as they are
        return { ...step };
      });
    },

    async submitQAndA() {
      await this.$store.dispatch('project/simpleUpdateProjectIdea', {
        data: {
          id: this.createdProjectId,
          questions: this.localQuestions,
          fundingCheckSteps: this.getUpdatedSteps()
        }
      });
      // Emit the Q&A data to the parent component
      this.$emit('q-and-a-submitted', this.localQuestions);
    }
  }
}
</script>

<style lang="scss" scoped></style>
