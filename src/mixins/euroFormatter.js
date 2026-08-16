// Shared "€X.X M" abbreviated-millions formatter for stats dashboard KPI cards
// (FundingVolumeCards.vue, SuccessStories.vue) - distinct from the full-precision
// formatCurrency() used for itemized amounts elsewhere in the app.
export default {
  methods: {
    formatEurMillions(value) {
      const millions = (value || 0) / 1000000;
      return "€" + millions.toFixed(1) + " M";
    },
  },
};
