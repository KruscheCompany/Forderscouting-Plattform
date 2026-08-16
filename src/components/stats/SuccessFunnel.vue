<template>
  <section class="funnel-section shadow-1">
    <div class="row items-start q-gutter-md" style="flex-wrap: wrap">
      <div>
        <h2 class="section-title">{{ $t("Statistics.marketing.funnel.title") }}</h2>
        <div class="section-hint">{{ $t("Statistics.marketing.funnel.subtitle") }}</div>
      </div>
      <div class="rate-card q-ml-auto">
        <div>
          <div class="rate-label">{{ $t("Statistics.marketing.funnel.rateLabel") }}</div>
          <div class="rate-value">{{ successRate.toFixed(1) }} %</div>
        </div>
        <div class="rate-formula">{{ successFormula }}</div>
      </div>
    </div>

    <div class="funnel-bar">
      <div
        v-for="s in stages"
        :key="s.key"
        class="funnel-bar-segment"
        :style="{ width: pct(s.value, totalFunnel) + '%', background: s.color }"
      ></div>
    </div>

    <div class="funnel-cards">
      <div
        v-for="s in stages"
        :key="s.key"
        class="funnel-card"
        :class="{ 'funnel-card--highlight': s.key === 'grantNotice' }"
      >
        <div class="row items-center q-gutter-xs">
          <span class="funnel-dot" :style="{ background: s.color }"></span>
          <div class="funnel-card-label">{{ s.label }}</div>
        </div>
        <div class="row items-baseline q-gutter-sm q-mt-xs">
          <div class="funnel-card-value">{{ s.value }}</div>
          <div class="funnel-card-share">{{ pct(s.value, totalFunnel).toFixed(0) }} %</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "SuccessFunnel",
  props: {
    funnel: {
      type: Object,
      required: true,
    },
  },
  computed: {
    stages() {
      return [
        {
          key: "inProgress",
          label: this.$t("Statistics.marketing.funnel.inProgress"),
          value: this.funnel.inProgress || 0,
          color: "#c3cdee",
        },
        {
          key: "sentToFunding",
          label: this.$t("Statistics.marketing.funnel.sentToFunding"),
          value: this.funnel.sentToFunding || 0,
          color: "#6b7fd7",
        },
        {
          key: "grantNotice",
          label: this.$t("Statistics.marketing.funnel.grantNotice"),
          value: this.funnel.grantNotice || 0,
          color: "#1b2a78",
        },
        {
          key: "rejectionNotice",
          label: this.$t("Statistics.marketing.funnel.rejectionNotice"),
          value: this.funnel.rejectionNotice || 0,
          color: "#c9a0a0",
        },
      ];
    },
    totalFunnel() {
      return this.stages.reduce((sum, s) => sum + s.value, 0);
    },
    decided() {
      return (this.funnel.sentToFunding || 0) + (this.funnel.grantNotice || 0) + (this.funnel.rejectionNotice || 0);
    },
    successRate() {
      return this.pct(this.funnel.grantNotice || 0, this.decided);
    },
    successFormula() {
      return (
        this.$t("Statistics.marketing.funnel.grantNotice") +
        " ÷ (" +
        this.$t("Statistics.marketing.funnel.sentToFunding") +
        " + " +
        this.$t("Statistics.marketing.funnel.grantNotice") +
        " + " +
        this.$t("Statistics.marketing.funnel.rejectionNotice") +
        ") = " +
        (this.funnel.grantNotice || 0) +
        " ÷ " +
        this.decided
      );
    },
  },
  methods: {
    pct(a, b) {
      return b ? (a / b) * 100 : 0;
    },
  },
};
</script>

<style lang="sass" scoped>
.funnel-section
  background: #fff
  border-radius: 14px
  padding: 26px 28px
  display: flex
  flex-direction: column
  gap: 22px

.section-title
  margin: 0
  font-family: Georgia, serif
  font-size: 19px
  font-weight: 700
  color: #1b2a78

.section-hint
  font-size: 13px
  color: #6b74a0
  margin-top: 5px

.rate-card
  display: flex
  align-items: center
  gap: 22px
  background: #f7f9fe
  border: 1px solid #e9edf9
  border-radius: 12px
  padding: 14px 22px

.rate-label
  font-size: 11.5px
  color: #7c86ae

.rate-value
  font-family: Georgia, serif
  font-size: 34px
  font-weight: 700
  line-height: 1.1
  color: #1b2a78

.rate-formula
  font-size: 12.5px
  color: #6b74a0
  line-height: 1.5
  max-width: 210px

.funnel-bar
  display: flex
  height: 26px
  border-radius: 8px
  overflow: hidden
  background: #eef1fa

.funnel-bar-segment
  height: 100%

.funnel-cards
  display: grid
  grid-template-columns: repeat(4, 1fr)
  gap: 14px

  @media (max-width: 900px)
    grid-template-columns: repeat(2, 1fr)

.funnel-card
  background: #fbfcff
  border: 1px solid #e9edf9
  border-radius: 12px
  padding: 16px 18px

  &--highlight
    background: #f7f9fe
    border: 1.5px solid #1b2a78

.funnel-dot
  width: 11px
  height: 11px
  border-radius: 3px
  flex: 0 0 11px

.funnel-card-label
  font-size: 13px
  font-weight: 700
  color: #1b2a78

.funnel-card-value
  font-family: Georgia, serif
  font-size: 30px
  font-weight: 700
  color: #1b2a78

.funnel-card-share
  font-size: 12.5px
  color: #7c86ae

.funnel-card-status
  font-size: 11.5px
  color: #8791b8
  margin-top: 4px
  font-family: "SFMono-Regular", Menlo, monospace
</style>
