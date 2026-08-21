// Shared filter-option lists for the project-dashboard tables
// (Table.vue, PriorityTable.vue, ArchivedTable.vue) so the option
// text/values stay identical across all three.
export default {
  computed: {
    statusOptions() {
      return [
        { value: "sentToFunding", title: this.$t('projectComponents.submissionSigning.sentToFunding') },
        { value: "grantNotice", title: this.$t('Zuwendungsbescheid') },
        { value: "rejectionNotice", title: this.$t('Ablehnungsbescheid') },
        { value: "inProgress", title: this.$t('In Bearbeitung') },
      ];
    },
    investiveOptions() {
      return [
        { value: true, title: this.$t('Investive') },
        { value: false, title: this.$t('Non-Investive') },
      ];
    },
    applicationStepOptions() {
      return [
        { value: "aiFundingCheck", title: this.$t('aiFundingCheck') },
        { value: "projectDevelopment", title: this.$t('projectDevelopment') },
        { value: "application", title: this.$t('application') },
      ];
    },
    stepBadgeStyle() {
      const maxLen = Math.max(...this.applicationStepOptions.map(o => (o.title || '').length));
      return { minWidth: (maxLen * 7.5 + 40) + 'px', justifyContent: 'center' };
    },
    statusBadgeStyle() {
      const maxLen = Math.max(...this.statusOptions.map(o => (o.title || '').length));
      return { minWidth: (maxLen * 7.5 + 40) + 'px', justifyContent: 'center' };
    },
  },
};
