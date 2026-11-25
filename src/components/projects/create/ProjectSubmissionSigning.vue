<template>
  <div>
    <q-card class="shadow-1 radius-20">
      <q-expansion-item class="shadow-1 overflow-hidden radius-20"
        :label="$t('projectComponents.submissionSigning.title')" header-class="bg-white text-black"
        v-model="expandedSubmissionSigning">
        <q-card-section class="q-pt-none">

          <div class="status-steps q-mt-md">
            <div class="status-step">
              <div class="status-step__rail">
                <div class="status-step__badge status-step__badge--on">1</div>
                <div class="status-step__line" :class="{ 'status-step__line--on': unlocked }"></div>
              </div>
              <div class="status-step__body">
                <div class="status-step__head">
                  <div>
                    <h3 :id="`${idPrefix}-application`" class="status-step__title">
                      {{ $t('projectComponents.submissionSigning.applicationStep') }}
                    </h3>
                    <p class="status-step__hint">{{ $t('projectComponents.submissionSigning.applicationStepHint') }}</p>
                  </div>
                </div>
                <div role="radiogroup" :aria-labelledby="`${idPrefix}-application`" class="status-grid">
                  <label v-for="option in applicationOptions" :key="option.value" class="status-tile"
                    :class="{ 'status-tile--on': applicationStatus === option.value }">
                    <input type="radio" class="status-tile__input" :name="`${idPrefix}-application`"
                      :value="option.value" :checked="applicationStatus === option.value"
                      @change="selectApplicationStatus(option.value)">
                    <span class="status-tile__top">
                      <span class="status-tile__icon"><q-icon :name="option.icon" size="20px" /></span>
                      <span class="status-tile__indicator"><q-icon name="check" size="12px" /></span>
                    </span>
                    <span class="status-tile__text">
                      <span class="status-tile__label">{{ $t(option.label) }}</span>
                      <span class="status-tile__description">{{ $t(option.description) }}</span>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div class="status-step">
              <div class="status-step__rail">
                <div class="status-step__badge" :class="{ 'status-step__badge--on': unlocked }">2</div>
              </div>
              <div class="status-step__body">
                <div class="status-step__head">
                  <div>
                    <h3 :id="`${idPrefix}-project`" class="status-step__title">
                      {{ $t('projectComponents.submissionSigning.projectStep') }}
                    </h3>
                    <p class="status-step__hint">
                      {{ unlocked
                        ? $t('projectComponents.submissionSigning.projectStepHint')
                        : $t('projectComponents.submissionSigning.projectStepLockedHint') }}
                    </p>
                  </div>
                  <span class="status-pill" :class="unlocked ? 'status-pill--open' : 'status-pill--locked'">
                    <q-icon :name="unlocked ? 'lock_open' : 'lock'" size="14px" />
                    {{ unlocked ? $t('projectComponents.submissionSigning.unlocked') : $t('projectComponents.submissionSigning.locked') }}
                  </span>
                </div>
                <div role="radiogroup" :aria-labelledby="`${idPrefix}-project`" class="status-grid">
                  <label v-for="option in projectOptions" :key="option.value" class="status-tile"
                    :class="{ 'status-tile--on': projectStatus === option.value, 'status-tile--locked': !unlocked }">
                    <input type="radio" class="status-tile__input" :name="`${idPrefix}-project`"
                      :value="option.value" :checked="projectStatus === option.value" :disabled="!unlocked"
                      @change="projectStatus = option.value">
                    <span class="status-tile__top">
                      <span class="status-tile__icon"><q-icon :name="option.icon" size="20px" /></span>
                      <span class="status-tile__indicator"><q-icon name="check" size="12px" /></span>
                    </span>
                    <span class="status-tile__text">
                      <span class="status-tile__label">{{ $t(option.label) }}</span>
                      <span class="status-tile__description">{{ $t(option.description) }}</span>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div class="status-summary">
              <div class="status-summary__items" aria-live="polite">
                <span class="status-summary__caption">{{ $t('projectComponents.submissionSigning.selected') }}</span>
                <span>{{ $t('projectComponents.submissionSigning.application') }}:
                  <strong>{{ summaryLabel(applicationStatus) }}</strong></span>
                <span>{{ $t('projectComponents.submissionSigning.project') }}:
                  <strong>{{ unlocked ? summaryLabel(projectStatus) : $t('projectComponents.submissionSigning.locked') }}</strong></span>
              </div>
              <q-btn v-if="hasChanges" flat no-caps color="primary" :label="$t('projectComponents.submissionSigning.reset')"
                @click="resetSelection" />
            </div>
          </div>
        </q-card-section>
      </q-expansion-item>
    </q-card>


  </div>
</template>

<script>
import { PROJECT_STATUS_META, APPLICATION_STATUSES, FOLLOW_UP_STATUSES } from "src/mixins/projectStatusLabels";

const optionsFor = statuses => statuses.map(value => ({ value, ...PROJECT_STATUS_META[value] }));

export default {
  name: "ProjectSubmissionSigning",
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
      expandedSubmissionSigning: this.currentTab === "submissionSigning",
      ...this.statusSelectionFrom(this.projectData),
      resetSteps: [
        { name: 'guidelineContentCheck', title: 'Guideline Check (Content)', icon: 'mdi-clipboard-check', done: true },
        { name: 'projectDocumentsCoordination', title: 'Project Documents Coordination', icon: 'mdi-file-document-multiple', done: true },
        { name: 'applicationDecision', title: 'Application Decision', icon: 'mdi-gavel', done: true },
        { name: 'submissionSigning', title: 'Submission & Signing', icon: 'mdi-file-sign', done: false }
      ],
      tabs: [
        {
          done: false,
          name: "aiFundingCheck",
          title: "AI funding check"
        },
        {
          done: false,
          name: "projectDevelopment",
          title: "Project development"
        },
        {
          done: false,
          name: "application",
          title: "application"
        }
      ]
    };
  },
  computed: {
    idPrefix() {
      return `submission-status-${this.createdProjectId}`;
    },
    applicationOptions() {
      return optionsFor(APPLICATION_STATUSES);
    },
    projectOptions() {
      return optionsFor(FOLLOW_UP_STATUSES);
    },
    unlocked() {
      return this.applicationStatus !== null;
    },
    hasChanges() {
      const saved = this.statusSelectionFrom(this.projectData);
      return this.applicationStatus !== saved.applicationStatus || this.projectStatus !== saved.projectStatus;
    }
  },
  watch: {
    currentTab(newTab) {
      // Expand the section if the current tab is 'submissionSigning'
      this.expandedSubmissionSigning = newTab === "submissionSigning";
    }
  },
  methods: {
    statusSelectionFrom({ status, projectStatus }) {
      return {
        applicationStatus: status || null,
        projectStatus: projectStatus || null
      };
    },

    selectApplicationStatus(value) {
      this.applicationStatus = value;
    },

    resetSelection() {
      Object.assign(this, this.statusSelectionFrom(this.projectData));
    },

    summaryLabel(status) {
      return status ? this.$t(PROJECT_STATUS_META[status].label) : this.$t("projectComponents.submissionSigning.notSelected");
    },

    // Get updated steps with submissionSigning marked based on status
    getUpdatedSteps() {
      // Use existing steps from projectData if available, otherwise use default steps
      const currentSteps = this.projectData.projectApplicationSteps || this.resetSteps;

      return currentSteps.map(step => {
        if (step.name === 'submissionSigning') {
          // Mark submissionSigning as done only if status is not null
          return { ...step, done: this.applicationStatus !== null };
        }
        // Keep all other steps as they are
        return { ...step };
      });
    },

    // Get updated tabs with application marked based on status
    getUpdatedTabs() {
      // Use existing tabs from projectData if available, otherwise use default tabs
      const currentTabs = this.projectData.applicationProcessSteps || this.tabs;

      return currentTabs.map(tab => {
        if (tab.name === 'application') {
          // Mark application tab as done only if status is not null
          return { ...tab, done: this.applicationStatus !== null };
        }
        // Keep all other tabs as they are
        return { ...tab };
      });
    },

    async submitSubmissionSigning() {
      if (this.applicationStatus === null) {
        this.$store.dispatch("notifications/pushToast", { kind: "warning", title: this.$t('projectComponents.submissionSigning.noSelectionError') });
        return;
      }

      try {
        // Get the updated steps and tabs
        const updatedSteps = this.getUpdatedSteps();
        const updatedTabs = this.getUpdatedTabs();

        // Update the local state first
        await this.$store.dispatch('project/updateLocalProjectState', {
          data: {
            status: this.applicationStatus,
            projectStatus: this.projectStatus,
            projectApplicationSteps: updatedSteps,
            applicationProcessSteps: updatedTabs
          }
        });

        // Then persist to the backend
        await this.$store.dispatch('project/simpleUpdateProjectIdea', {
          data: {
            id: this.createdProjectId,
            status: this.applicationStatus,
            projectStatus: this.projectStatus,
            projectApplicationSteps: updatedSteps,
            applicationProcessSteps: updatedTabs
          }
        });

        this.$emit("submissionSigning-submitted", this.applicationStatus);

        this.$store.dispatch("notifications/pushToast", { kind: "positive", title: this.$t('projectComponents.submissionSigning.successMessage') });
      } catch (error) {
        console.error('Error submitting submission signing:', error);
        this.$store.dispatch("notifications/pushToast", { kind: "negative", title: this.$t('projectComponents.submissionSigning.errorMessage') });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.status-steps {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.status-step {
  display: flex;
  gap: 20px;

  &__rail {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 32px;
    flex-shrink: 0;
  }

  &__badge {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    background: #eef1f6;
    color: #364056;
    transition: background-color 0.22s ease, color 0.22s ease;

    &--on {
      background: $primary;
      color: #fff;
    }
  }

  &__line {
    width: 2px;
    flex-grow: 1;
    margin: 8px 0 -20px;
    border-radius: 2px;
    background: #cdd5e1;
    transition: background-color 0.4s ease;

    &--on {
      background: $primary;
    }
  }

  &__body {
    flex-grow: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    min-height: 32px;
  }

  &__title {
    margin: 0;
    font-size: 17px;
    font-weight: 600;
    line-height: 1.3;
  }

  &__hint {
    margin: 2px 0 0;
    font-size: 14px;
    line-height: 1.5;
    color: #4d5970;
  }
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 999px;
  padding: 5px 12px 5px 10px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
  white-space: nowrap;

  &--locked {
    background: #eef1f6;
    color: #364056;
  }

  &--open {
    background: rgba($primary, 0.08);
    color: $primary;
  }
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.status-tile {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 124px;
  padding: 16px;
  border: 1.5px solid #cdd5e1;
  border-radius: 10px;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.14s ease, background-color 0.14s ease, box-shadow 0.14s ease;

  &:not(&--locked):not(&--on):hover {
    border-color: #9aa6b8;
    background: #f6f8fb;
  }

  &:focus-within {
    border-color: $primary;
    box-shadow: 0 0 0 3px rgba($primary, 0.25);
  }

  &--on {
    border-color: $primary;
    background: rgba($primary, 0.06);
  }

  &--locked {
    border-style: dashed;
    background: #f6f8fb;
    color: #4d5970;
    cursor: not-allowed;
  }

  &__input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    opacity: 0;
    cursor: inherit;
  }

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #eef1f6;
    color: #364056;
    transition: background-color 0.22s ease, color 0.22s ease;
  }

  &--on &__icon {
    background: $primary;
    color: #fff;
  }

  &--locked &__icon {
    color: #6b7892;
  }

  &__indicator {
    width: 22px;
    height: 22px;
    box-sizing: border-box;
    border: 1.5px solid #6b7892;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    transition: background-color 0.14s ease, border-color 0.14s ease;

    .q-icon {
      opacity: 0;
      transition: opacity 0.14s ease;
    }
  }

  &--on &__indicator {
    background: $primary;
    border-color: $primary;

    .q-icon {
      opacity: 1;
    }
  }

  &--locked &__indicator {
    border-color: #cdd5e1;
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__label {
    font-weight: 700;
    font-size: 15px;
    line-height: 1.3;
  }

  &__description {
    font-size: 13px;
    line-height: 1.45;
    color: #4d5970;
  }
}

.status-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 8px 8px 8px 20px;
  min-height: 44px;
  border: 1px solid #e2e7ef;
  border-radius: 10px;
  background: #f6f8fb;
  font-size: 14px;
  color: #4d5970;

  &__items {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px 24px;
  }

  &__caption {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  strong {
    color: #0a1124;
  }
}

body.body--dark {
  .status-step__badge,
  .status-pill--locked,
  .status-tile__icon {
    background: rgba(255, 255, 255, 0.1);
    color: #e2e7ef;
  }

  .status-step__badge--on,
  .status-tile--on .status-tile__icon {
    background: #fff;
    color: $primary;
  }

  .status-pill--open {
    background: rgba(255, 255, 255, 0.16);
    color: #fff;
  }

  .status-step__hint,
  .status-tile__description,
  .status-summary {
    color: #b6c0d1;
  }

  .status-step__line {
    background: rgba(255, 255, 255, 0.2);
  }

  .status-step__line--on {
    background: #fff;
  }

  .status-tile {
    background: transparent;
    border-color: rgba(255, 255, 255, 0.25);

    &--on {
      border-color: #fff;
      background: rgba(255, 255, 255, 0.08);
    }

    &--locked {
      background: rgba(255, 255, 255, 0.04);
    }

    &:focus-within {
      border-color: #fff;
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
    }
  }

  .status-tile--on .status-tile__indicator {
    background: #fff;
    border-color: #fff;
    color: $primary;
  }

  .status-summary {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.15);

    strong {
      color: #fff;
    }
  }
}

@media (max-width: 599px) {
  .status-grid {
    grid-template-columns: 1fr;
  }

  .status-step__head,
  .status-summary {
    flex-wrap: wrap;
  }
}
</style>
