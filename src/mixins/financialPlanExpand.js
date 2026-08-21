// Shared row-expand logic (financial-detail panel) for the project-dashboard
// tables (Table.vue, PriorityTable.vue, ArchivedTable.vue). Components using
// this mixin can override `resolveProject(row)` when the table row does not
// carry the project fields directly (e.g. PriorityTable's row is
// `{ project, prioritizedBy, ... }`).
export default {
  data() {
    return {
      expandedRows: {},
      financialPlans: {},
    };
  },
  methods: {
    resolveProject(row) {
      return row;
    },
    isExpanded(row) {
      const project = this.resolveProject(row);
      return !!project && !!this.expandedRows[project.id];
    },
    getFinancialPlan(row) {
      const project = this.resolveProject(row);
      if (!project) return null;
      return this.financialPlans[project.id] || project.financialPlan || null;
    },
    async toggleExpand(row) {
      const project = this.resolveProject(row);
      if (!project) return;
      const rowId = project.id;

      if (this.expandedRows[rowId]) {
        this.$set(this.expandedRows, rowId, false);
        return;
      }

      try {
        const validationResult = await this.$store.dispatch("project/validateApplicationAccess", rowId);

        if (validationResult.accessGranted) {
          if (validationResult.financialPlan) {
            this.$set(this.financialPlans, rowId, validationResult.financialPlan);
            this.$store.commit("project/setFinancialPlan", validationResult.financialPlan);
          }
          this.$set(this.expandedRows, rowId, true);
        } else {
          this.$store.dispatch("notifications/pushToast", { kind: "negative", title: this.$t("ProjectDashboard.accessDenied") });
          this.$set(this.expandedRows, rowId, false);
        }
      } catch (error) {
        console.error("Error validating access for financial data:", error);
        this.$store.dispatch("notifications/pushToast", { kind: "negative", title: this.$t("ProjectDashboard.accessError") });
        this.$set(this.expandedRows, rowId, false);
      }
    },
  },
};
