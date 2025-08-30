<template>
  <div>
    <!-- Project General Information -->
    <ProjectGeneralInfo ref="generalInfoRef" :current-tab="currentTab" :form-data="form"
      @update:form-data="updateGeneralInfo" />

    <!-- Project Content Details -->
    <ProjectContentDetails ref="contentDetailsRef" class="q-my-md" :current-tab="currentTab" :form-data="form"
      @update:form-data="updateContentDetails" />

    <!-- Warning Dialog for Starting Condition Changes -->
    <StartingConditionWarningDialog :modelValue="showWarningDialog" :loading="isLoading"
      @confirm="proceedWithSubmission" @cancel="cancelSubmission" />
  </div>
</template>

<script>
import ProjectGeneralInfo from 'src/components/projects/create/ProjectGeneralInfo.vue';
import ProjectContentDetails from 'src/components/projects/create/ProjectContentDetails.vue';
import StartingConditionWarningDialog from 'src/components/dialogs/StartingConditionWarningDialog.vue';
import { scroll } from "quasar";

const { getScrollTarget, setScrollPosition } = scroll;

export default {
  name: "ProjectDescriptionCreate",
  emits: ['project-created'],
  components: {
    ProjectGeneralInfo,
    ProjectContentDetails,
    StartingConditionWarningDialog
  },
  props: {
    currentTab: {
      type: String,
      default: "project"
    }
  },
  data() {
    return {
      isLoading: false,
      editing: true,
      showWarningDialog: false,
      originalStartingCondition: "", // Store original value for comparison
      // Combined form data structure
      form: {
        title: "",
        visibility: "",
        info: {
          location: "",
        },
        details: {
          startingCondition: "",
          content: "",
          goals: "",
          valuesAndBenefits: "",
          investive: true,
          timeline: "",
          uploadsDescription: "",
        },
        financialPlan: {
          description: "",
          costAndFinance: [
            { title: "Gesamtinvestition", value: "" },
            { title: "Fördermittel", value: "" },
            { title: "Eigenmittel", value: "" },
            { title: "Fremdmittel", value: "" }
          ]
        },
        editors: [],
        categories: [],
        tags: [],
        links: [],
        media: null,
        files: null,
      },
      resetSteps: [
        { name: 'project', title: 'Project Description', icon: 'description', done: true },
        { name: 'fundingCheck', title: 'Funding Check', icon: 'monetization_on', done: false },
        { name: 'qAndA', title: 'Open Questions', icon: 'help_outline', done: false },
        { name: 'aptitude', title: 'Aptitude', icon: 'check_circle', done: false },
        { name: 'decision', title: 'Basic decision', icon: 'gavel', done: false }
      ]
    };
  },
  computed: {
    project() {
      return this.$store.getters["project/getProject"];
    },
    userDetails() {
      return (
        this.$store.state.userCenter.user && this.$store.state.userCenter.user.userDetails
      );
    },
    user() {
      return this.$store.state.userCenter.user.user;
    },
  },
  methods: {
    updateGeneralInfo(data) {
      this.form = { ...this.form, ...data };
    },
    updateContentDetails(data) {
      const investive = JSON.parse(JSON.stringify(this.form.details.investive));
      this.form = { ...this.form, ...data };
      this.form.details.investive = investive;
    },
    async getGeneralInfoData() {
      // Get the current localForm data from ProjectGeneralInfo component
      if (this.$refs.generalInfoRef && typeof this.$refs.generalInfoRef.getCurrentFormData === 'function') {
        return this.$refs.generalInfoRef.getCurrentFormData();
      }
      return {};
    },
    async getContentDetailsData() {
      // Get the current form data from ProjectContentDetails component
      if (this.$refs.contentDetailsRef && typeof this.$refs.contentDetailsRef.getCurrentFormData === 'function') {
        return await this.$refs.contentDetailsRef.getCurrentFormData();
      }
      return {};
    },
    async validateForm() {
      const [generalInfoValid, contentDetailsValid] = await Promise.all([
        this.$refs.generalInfoRef.validateForm(),
        this.$refs.contentDetailsRef.validateForm()
      ]);

      if (!generalInfoValid) {
        this.scrollToInvalidElement(this.$refs.generalInfoRef);
      } else if (!contentDetailsValid) {
        this.scrollToInvalidElement(this.$refs.contentDetailsRef);
      }

      return generalInfoValid && contentDetailsValid;
    },
    scrollToInvalidElement(ref) {
      const el = ref.$el;
      const target = getScrollTarget(el);
      const offset = el.offsetTop - 100;
      const duration = 500;
      setScrollPosition(target, offset, duration);
    },
    async checkOptionalParameters() {
      if (!this.project) {
        // Clean up any deprecated fields that might exist
        const deprecatedFields = ['plannedStart', 'plannedEnd', 'fundingGuideline', 'checklists', 'municipality', 'estimatedCosts'];
        deprecatedFields.forEach(field => {
          if (this.form.hasOwnProperty(field)) {
            delete this.form[field];
          }
        });

        const deprecatedInfoFields = ['contactName', 'phone', 'email', 'streetNo', 'postalCode'];
        deprecatedInfoFields.forEach(field => {
          if (this.form.info && this.form.info.hasOwnProperty(field)) {
            delete this.form.info[field];
          }
        });

        const deprecatedDetailsFields = ['partner', 'status'];
        deprecatedDetailsFields.forEach(field => {
          if (this.form.details && this.form.details.hasOwnProperty(field)) {
            delete this.form.details[field];
          }
        });
      }
    },
    async submitProject(steps) {
      this.isLoading = true;

      try {
        // Get the latest data from child components before validation/submission
        const generalInfoData = await this.getGeneralInfoData();
        const contentDetailsData = await this.getContentDetailsData();

        // Merge the latest data from child components
        this.form = {
          ...this.form,
          ...generalInfoData,
          ...contentDetailsData,
          fundingCheckSteps: steps
        };
        this.form.details.investive = JSON.parse(JSON.stringify(generalInfoData.details.investive));

        // Check if we're editing and starting condition has changed
        if (this.editing && this.hasStartingConditionChanged(contentDetailsData)) {
          this.showWarningDialog = true;
          this.isLoading = false;
          return; // Exit early, will continue in proceedWithSubmission
        }

        // Continue with normal submission
        await this.performSubmission();

      } catch (error) {
        this.handleSubmissionError(error);
      }
    },

    hasStartingConditionChanged(contentDetailsData) {
      const currentStartingCondition = contentDetailsData?.details?.startingCondition || "";
      return this.originalStartingCondition !== currentStartingCondition;
    },

    async proceedWithSubmission() {
      try {
        this.isLoading = true;
        this.showWarningDialog = false;

        // Re-merge the data
        this.form = {
          ...this.form,
          fundingMatches: null,
          questions: null,
          fundingCheckSteps: this.getResetSteps(),
          reset: true
        };
        this.form.details.investive = JSON.parse(JSON.stringify(this.form.details.investive));

        await this.performSubmission();
      } catch (error) {
        this.handleSubmissionError(error);
      }
    },

    // Get reset steps - only reset fundingCheck and qAndA, preserve other steps
    getResetSteps() {
      // Use existing steps from project if available, otherwise use default steps
      const currentSteps = this.project?.fundingCheckSteps || this.resetSteps;

      return currentSteps.map(step => {
        if (step.name === 'fundingCheck') {
          // Reset fundingCheck step
          return { ...step, done: false };
        } else if (step.name === 'qAndA') {
          // Reset qAndA step
          return { ...step, done: false };
        }
        // Keep all other steps (aptitude, decision) as they are
        return { ...step };
      });
    },

    cancelSubmission() {
      this.isLoading = false;
      this.showWarningDialog = false;
    },

    async performSubmission() {
      // Validate both forms
      const isValid = await this.validateForm();

      if (isValid) {
        // All validations passed, prepare data for submission
        await this.checkOptionalParameters();

        const projectData = {
          ...this.form,
          published: true,
          info: {
            ...this.form.info,
            contactName: this.userDetails.fullName,
            phone: this.userDetails.phone,
            email: this.user.email,
            streetNo: this.userDetails.streetNo,
            postalCode: this.userDetails.postalCode,
          },
          municipality: {
            id: this.userDetails.municipality && this.userDetails.municipality.id,
          },
          owner: {
            id: this.user && this.user.id,
          },
        };

        // Submit to store
        let res;
        if (this.editing) {
          res = await this.$store.dispatch("project/editProjectIdea", {
            id: this.project.id,
            projectData
          });
        } else {
          res = await this.$store.dispatch("project/createNewProjectIdea", {
            projectData,
          });
        }
        const projectId = res.data.id;

        // Check if the response indicates success
        if (res && res.data && projectId) {
          // Handle success (redirect, show notification, etc.)
          this.$q.notify({
            color: 'positive',
            message: this.$t('Project successfully created'),
            icon: 'check'
          });

          // Emit event to parent with project data
          this.$emit('project-created', {
            id: projectId,
            projectData: projectData,
            hasStartingConditionChanged: this.form.reset
          });

        } else if (this.editing) {
          // For editing, success might not return data but still be successful
          this.$q.notify({
            color: 'positive',
            message: this.$t('Project successfully updated'),
            icon: 'check'
          });

          // Emit event to parent with project data
          this.$emit('project-created', {
            id: projectId,
            projectData: projectData,
            hasStartingConditionChanged: this.form.reset
          });
        } else {
          // Unexpected response format
          throw new Error('Unexpected response from server');
        }


      } else {
        // Validation failed, scroll to first invalid element
        if (this.$refs.generalInfoRef && !await this.$refs.generalInfoRef.validateForm()) {
          this.scrollToInvalidElement(this.$refs.generalInfoRef);
        } else if (this.$refs.contentDetailsRef && !await this.$refs.contentDetailsRef.validateForm()) {
          this.scrollToInvalidElement(this.$refs.contentDetailsRef);
        }

        // Show notification about validation errors
        this.$q.notify({
          color: 'negative',
          message: this.$t('Please fix the highlighted errors before submitting'),
          icon: 'error'
        });
      }

      this.isLoading = false;
    },

    handleSubmissionError(error) {
      console.error('Error submitting project:', error);

      // Handle different types of errors
      let errorMessage = this.$t('Error creating project');

      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (status === 400) {
          errorMessage = data.message || this.$t('Invalid project data. Please check your inputs.');
        } else if (status === 401) {
          errorMessage = this.$t('You are not authorized to create projects.');
        } else if (status === 403) {
          errorMessage = this.$t('You do not have permission to create projects.');
        } else if (status === 422) {
          errorMessage = data.message || this.$t('Validation failed. Please check your inputs.');
        } else if (status >= 500) {
          errorMessage = this.$t('Server error. Please try again later.');
        } else {
          errorMessage = data.message || this.$t('Error creating project');
        }
      } else if (error.request) {
        errorMessage = this.$t('Network error. Please check your connection.');
      } else {
        errorMessage = error.message || this.$t('Error creating project');
      }

      this.$q.notify({
        color: 'negative',
        message: errorMessage,
        icon: 'error'
      });

      this.isLoading = false;
    },

    async setData() {
      if (this.project) {
        this.editing = true;
        // Store original starting condition for comparison
        this.originalStartingCondition = this.project?.details?.startingCondition || "";

        this.form = {
          ...this.form,
          ...JSON.parse(
            JSON.stringify({
              ...this.project,
            })
          ),
        };
        this.$refs.generalInfoRef.setData(this.form);
        this.$refs.contentDetailsRef.setData(this.form);
      } else {
        // New project mode
        this.editing = false;
        this.originalStartingCondition = "";
      }
    },
  },
  mounted() {
    this.setData();
  },
  beforeDestroy() {
    this.$q.loading.hide();
  },
};
</script>

<style lang="scss" scoped>
.text-block {
  white-space: pre-line;
}

.disabledClass {
  .q-field__inner .q-field__control input {
    color: black;
    opacity: 1 !important;
  }

  .q-field__inner .q-field__control:before {
    border-color: $primary;
  }
}

.toggleGap {
  gap: 15px;

  >button {
    border-radius: 10px !important;
    border: 1px solid $yellow;
  }
}
</style>
