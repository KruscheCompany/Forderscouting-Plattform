// Shared status/step-label + badge-color logic for project tables
// (PriorityTable.vue, Table.vue) so the two stop drifting from each other.
export const PROJECT_STATUS_META = {
  sentToFunding: { label: "projectComponents.submissionSigning.sentToFunding", description: "projectComponents.submissionSigning.sentToFundingBody", color: "blue", icon: "mdi-send-clock" },
  grantNotice: { label: "Zuwendungsbescheid", description: "projectComponents.submissionSigning.grantNoticeDescription", color: "green", icon: "check" },
  rejectionNotice: { label: "Ablehnungsbescheid", description: "projectComponents.submissionSigning.rejectionNoticeDescription", color: "red", icon: "clear" },
  inImplementation: { label: "projectComponents.submissionSigning.inImplementation", description: "projectComponents.submissionSigning.inImplementationDescription", color: "teal", icon: "mdi-hammer-wrench" },
  completed: { label: "projectComponents.submissionSigning.completed", description: "projectComponents.submissionSigning.completedDescription", color: "blue-grey-8", icon: "mdi-flag-checkered" },
  stoppedOrPostponed: { label: "projectComponents.submissionSigning.stoppedOrPostponed", description: "projectComponents.submissionSigning.stoppedOrPostponedDescription", color: "orange-9", icon: "mdi-pause-circle-outline" },
};

export const APPLICATION_STATUSES = ["sentToFunding", "grantNotice", "rejectionNotice"];

export const FOLLOW_UP_STATUSES = ["inImplementation", "completed", "stoppedOrPostponed"];

export default {
  methods: {
    getLastCompletedStepColor(applicationProcessSteps) {
      if (!applicationProcessSteps || !Array.isArray(applicationProcessSteps) || applicationProcessSteps.length === 0) {
        return "primary";
      }
      const completedSteps = applicationProcessSteps.filter((step) => step.done);
      if (completedSteps.length === 0) return "primary";
      const lastCompletedStep = completedSteps[completedSteps.length - 1];
      switch (lastCompletedStep.name) {
        case "aiFundingCheck":
          return "primary";
        case "projectDevelopment":
          return "blue-2";
        case "application":
          return "blue-1";
        default:
          return "primary";
      }
    },
    getLastCompletedStep(applicationProcessSteps) {
      if (!applicationProcessSteps || !Array.isArray(applicationProcessSteps) || applicationProcessSteps.length === 0) {
        return this.$t("aiFundingCheck");
      }
      const completedSteps = applicationProcessSteps.filter((step) => step.done);
      if (completedSteps.length === 0) return this.$t("aiFundingCheck");
      const lastCompletedStep = completedSteps[completedSteps.length - 1];
      const translationKey = `${lastCompletedStep.name}`;
      return this.$te(translationKey) ? this.$t(translationKey) : (lastCompletedStep.title || this.$t("aiFundingCheck"));
    },
    getLastCompletedStepValue(applicationProcessSteps) {
      if (!applicationProcessSteps || !Array.isArray(applicationProcessSteps) || applicationProcessSteps.length === 0) {
        return "aiFundingCheck";
      }
      const completedSteps = applicationProcessSteps.filter((step) => step.done);
      if (completedSteps.length === 0) return "aiFundingCheck";
      return completedSteps[completedSteps.length - 1].name;
    },
    getLastCompletedStepTextColor(applicationProcessSteps) {
      if (!applicationProcessSteps || !Array.isArray(applicationProcessSteps) || applicationProcessSteps.length === 0) {
        return "white";
      }
      const completedSteps = applicationProcessSteps.filter((step) => step.done);
      if (completedSteps.length === 0) return "white";
      const lastCompletedStep = completedSteps[completedSteps.length - 1];
      switch (lastCompletedStep.name) {
        case "aiFundingCheck":
          return "white";
        case "projectDevelopment":
          return "black";
        case "application":
          return "black";
        default:
          return "white";
      }
    },
    getStatusText(status) {
      const meta = PROJECT_STATUS_META[status];
      return meta ? this.$t(meta.label) : this.$t("In Bearbeitung");
    },
    getStatusColor(status) {
      const meta = PROJECT_STATUS_META[status];
      return meta ? meta.color : "yellow";
    },
    getDisplayStatus(project) {
      return project.projectStatus || project.status || null;
    },
    getStatusLabel(project) {
      return this.getStatusText(this.getDisplayStatus(project));
    },
    getStatusIcon(status) {
      const meta = PROJECT_STATUS_META[status];
      return meta ? meta.icon : "help_outline";
    },
  },
};
