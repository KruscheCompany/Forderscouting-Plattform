<template>
  <q-card class="shadow-1 radius-20">
    <q-expansion-item class="shadow-1 overflow-hidden radius-20" :label="$t('projectComponents.qAndA.title')"
      header-class="bg-white text-black" v-model="expandedQAndA">
      <q-card-section class="q-pt-none">
        <div v-if="questions && questions.length > 0">
          <q-list>
            <q-item v-for="(question, index) in questions" :key="index" class="q-mb-sm q-pa-none">
              <q-item-section>
                <div class="row items-baseline">
                  <div class="col-12 col-md-4">
                    <p class="font-16 no-margin">
                      {{ question.text }}
                    </p>
                  </div>
                  <div class="col-12 col-md-8">
                    <q-input outlined dense class="no-shadow input-radius-6" v-model="question.answer" />
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
  },
  computed: {
    ...mapGetters('ai', ['getFundingQuestions']),
    questions() {
      if (!!this.projectData.questions && this.projectData.questions.length > 0) {
        // If projectId is present, use the projectData to set questions
        return this.projectData.questions || [];
      } else {
        return this.getFundingQuestions.map(question => ({
          text: question,
          answer: ''
        }));
      }
    }
  },
  methods: {
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
          questions: this.questions,
          fundingCheckSteps: this.getUpdatedSteps()
        }
      });
      // Emit the Q&A data to the parent component
      this.$emit('q-and-a-submitted', this.questions);
    }
  }
}
</script>

<style lang="scss" scoped></style>
