<template>
  <section class="ai-banner">
    <div>
      <div class="ai-badge"><span>✦</span>{{ $t("Statistics.marketing.ai.badge") }}</div>
      <h2 class="ai-title">{{ $t("Statistics.marketing.ai.title") }}</h2>
      <div class="ai-summary">
        {{ $t("Statistics.marketing.ai.summary", { rate: acceptanceRatePct, hours: hoursSaved }) }}
      </div>
    </div>
    <div class="ai-stats">
      <div v-for="(s, i) in stats" :key="s.label" class="ai-stat-card" :class="{ 'ai-stat-card--accent': i === 4 }">
        <div class="ai-stat-label">{{ s.label }}</div>
        <div class="ai-stat-value">{{ s.value }}</div>
        <div class="ai-stat-sub">{{ s.sub }}</div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "AiEfficiencyBanner",
  props: {
    aiSuggestions: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    accepted() {
      return this.aiSuggestions.accepted || 0;
    },
    ignored() {
      return this.aiSuggestions.ignored || 0;
    },
    acceptanceRatePct() {
      const decided = this.accepted + this.ignored;
      return decided ? ((this.accepted / decided) * 100).toFixed(1) : "0.0";
    },
    hoursSaved() {
      return Math.round((this.accepted * 25) / 60);
    },
    stats() {
      const ai = this.aiSuggestions || {};
      const formatRate = (rate) => (rate == null ? "-" : Math.round(rate * 100) + " %");
      return [
        {
          label: this.$t("Statistics.aiSuggestions.total"),
          value: (ai.total || 0).toLocaleString("de-DE"),
          sub: this.$t("Statistics.marketing.ai.subTotal"),
        },
        {
          label: this.$t("Statistics.aiSuggestions.notified"),
          value: (ai.notified || 0).toLocaleString("de-DE"),
          sub: this.$t("Statistics.marketing.ai.subNotified"),
        },
        {
          label: this.$t("Statistics.aiSuggestions.accepted"),
          value: this.accepted,
          sub: this.$t("Statistics.marketing.ai.subAccepted"),
        },
        {
          label: this.$t("Statistics.aiSuggestions.ignored"),
          value: this.ignored,
          sub: this.$t("Statistics.marketing.ai.subIgnored"),
        },
        {
          label: this.$t("Statistics.aiSuggestions.acceptanceRate"),
          value: formatRate(ai.acceptanceRate),
          sub: this.$t("Statistics.marketing.ai.subRate"),
        },
      ];
    },
  },
};
</script>

<style lang="sass" scoped>
.ai-banner
  background: #1b2a78
  border-radius: 14px
  padding: 26px 28px
  color: #fff
  display: grid
  grid-template-columns: 300px 1fr
  gap: 28px
  align-items: center

  @media (max-width: 900px)
    grid-template-columns: 1fr

.ai-badge
  display: inline-flex
  align-items: center
  gap: 7px
  font-size: 12px
  font-weight: 700
  color: #1b2a78
  background: #f2ec4a
  border-radius: 6px
  padding: 4px 9px

.ai-title
  margin: 12px 0 0
  font-family: Georgia, serif
  font-size: 21px
  font-weight: 700

.ai-summary
  font-size: 13px
  color: rgba(255, 255, 255, .72)
  margin-top: 8px
  line-height: 1.55

.ai-stats
  display: grid
  grid-template-columns: repeat(5, 1fr)
  gap: 14px

  @media (max-width: 900px)
    grid-template-columns: repeat(2, 1fr)

.ai-stat-card
  background: rgba(255, 255, 255, .08)
  color: #fff
  border-radius: 11px
  padding: 14px 16px

  &--accent
    background: #f2ec4a
    color: #1b2a78

.ai-stat-label
  font-size: 11.5px
  color: rgba(255, 255, 255, .62)

.ai-stat-card--accent .ai-stat-label
  color: rgba(27, 42, 120, .7)

.ai-stat-value
  font-family: Georgia, serif
  font-size: 28px
  font-weight: 700
  margin-top: 6px

.ai-stat-sub
  font-size: 11.5px
  color: rgba(255, 255, 255, .55)
  margin-top: 3px

.ai-stat-card--accent .ai-stat-sub
  color: rgba(27, 42, 120, .55)
</style>
