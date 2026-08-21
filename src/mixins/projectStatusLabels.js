// Shared status/step-label + badge-color logic for project tables
// (PriorityTable.vue, Table.vue) so the two stop drifting from each other.
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
      if (status === "sentToFunding") {
        return this.$t("projectComponents.submissionSigning.sentToFunding");
      } else if (status === "grantNotice") {
        return this.$t("Zuwendungsbescheid");
      } else if (status === "rejectionNotice") {
        return this.$t("Ablehnungsbescheid");
      } else {
        return this.$t("In Bearbeitung");
      }
    },
    getStatusColor(status) {
      if (status === "grantNotice") {
        return "green";
      } else if (status === "rejectionNotice") {
        return "red";
      } else if (status === "sentToFunding") {
        return "blue";
      } else {
        return "yellow";
      }
    },
  },
};
