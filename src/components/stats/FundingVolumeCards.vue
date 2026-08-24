<template>
  <section class="funding-volume">
    <div class="section-heading">
      <h2 class="section-title">{{ $t("Statistics.marketing.funding.title") }}</h2>
      <div class="section-hint">
        {{ $t("Statistics.marketing.funding.subtitle", { total: projectTotal }) }}
      </div>
    </div>
    <div class="volume-grid">
      <div class="volume-card volume-card--primary">
        <div class="volume-label volume-label--light">{{ $t("Statistics.marketing.funding.total") }}</div>
        <div class="volume-value volume-value--light">{{ formatEurMillions(funding.totalInvestment) }}</div>
        <div class="volume-note volume-note--light">{{ $t("Statistics.marketing.funding.totalNote") }}</div>
      </div>
      <div class="volume-card">
        <div class="volume-label">{{ $t("Statistics.marketing.funding.requested") }}</div>
        <div class="volume-value">{{ formatEurMillions(funding.requestedFunding) }}</div>
        <div class="volume-note">{{ requestedShare }} {{ $t("Statistics.marketing.funding.requestedNote") }}</div>
      </div>
      <div class="volume-card volume-card--secured">
        <div class="row items-center q-gutter-xs">
          <div class="volume-label">{{ $t("Statistics.marketing.funding.secured") }}</div>
          <div class="status-pill">{{ $t("Statistics.marketing.funnel.grantNotice") }}</div>
        </div>
        <div class="volume-value">{{ formatEurMillions(funding.securedFunding) }}</div>
        <div class="secured-bar-track">
          <div class="secured-bar-fill" :style="{ width: securedShare + '%' }"></div>
        </div>
        <div class="volume-note">{{ securedShare.toFixed(1) }}% {{ $t("Statistics.marketing.funding.securedNote") }}</div>
      </div>
    </div>
  </section>
</template>

<script>
import euroFormatter from "src/mixins/euroFormatter";

export default {
  name: "FundingVolumeCards",
  mixins: [euroFormatter],
  props: {
    funding: {
      type: Object,
      required: true,
    },
    projectTotal: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    requestedShare() {
      const pct = this.pct(this.funding.requestedFunding, this.funding.totalInvestment);
      return pct.toFixed(0) + " %";
    },
    securedShare() {
      return this.pct(this.funding.securedFunding, this.funding.requestedFunding);
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
.funding-volume
  display: flex
  flex-direction: column
  gap: 14px

.section-heading
  display: flex
  align-items: baseline
  gap: 12px
  flex-wrap: wrap

.section-title
  margin: 0
  font-family: Georgia, serif
  font-size: 20px
  font-weight: 700
  color: #1b2a78

.section-hint
  font-size: 12.5px
  color: #7c86ae

.volume-grid
  display: grid
  grid-template-columns: 1.25fr 1fr 1fr
  gap: 16px

  @media (max-width: 900px)
    grid-template-columns: 1fr

.volume-card
  background: #fff
  border-radius: 16px
  padding: 24px 26px
  box-shadow: 0 10px 26px rgba(27, 42, 120, .07)
  color: #1b2a78

  &--primary
    background: #1b2a78
    color: #fff
    padding: 26px 28px

  &--secured
    border: 1.5px solid #1b2a78

.volume-label
  font-size: 11.5px
  font-weight: 700
  letter-spacing: .1em
  text-transform: uppercase
  color: #7c86ae

  &--light
    color: rgba(255, 255, 255, .6)

.volume-value
  font-family: Georgia, serif
  font-size: 44px
  font-weight: 700
  line-height: 1.05
  margin-top: 12px

  &--light
    font-size: 54px
    line-height: 1.02

.volume-note
  font-size: 13px
  color: #6b74a0
  margin-top: 8px
  line-height: 1.5

  &--light
    color: rgba(255, 255, 255, .72)

.status-pill
  font-size: 11px
  font-weight: 700
  background: #f2ec4a
  color: #1b2a78
  border-radius: 5px
  padding: 2px 6px

.secured-bar-track
  height: 8px
  border-radius: 4px
  background: #eef1fa
  overflow: hidden
  margin-top: 12px

.secured-bar-fill
  height: 100%
  background: #f2ec4a
  border-radius: 4px
</style>
