<template>
  <div class="reach-card shadow-1">
    <div>
      <h2 class="section-title">{{ $t("Statistics.marketing.regional.title") }}</h2>
      <div class="section-hint">{{ $t("Statistics.marketing.regional.subtitle") }}</div>
    </div>
    <div class="reach-summary">
      <div>
        <div class="reach-count">{{ regional.activeMunicipalities }} / {{ regional.totalMunicipalities }}</div>
        <div class="reach-count-label">{{ $t("Statistics.marketing.regional.active") }}</div>
      </div>
      <div class="reach-coverage">
        <div class="row items-baseline q-gutter-sm">
          <div class="coverage-value">{{ coverage.toFixed(0) }} %</div>
          <div class="coverage-label">{{ $t("Statistics.marketing.regional.coverage") }}</div>
        </div>
        <div class="coverage-bar-track">
          <div class="coverage-bar-fill" :style="{ width: coverage + '%' }"></div>
        </div>
        <div class="coverage-gap">
          {{ $t("Statistics.marketing.regional.gap", { count: gap }) }}
        </div>
      </div>
    </div>
    <div class="leaderboard">
      <div class="leaderboard-heading">{{ $t("Statistics.marketing.regional.leaderboard") }}</div>
      <div v-for="(m, i) in regional.leaderboard" :key="i" class="leaderboard-row">
        <div class="row items-baseline q-gutter-sm">
          <div class="leaderboard-name">{{ m.title }}</div>
          <div class="leaderboard-count q-ml-auto">{{ m.count }}</div>
        </div>
        <div class="leaderboard-bar-track">
          <div
            class="leaderboard-bar-fill"
            :style="{ width: pct(m.count, maxCount) + '%', background: i === 0 ? '#1b2a78' : '#6b7fd7' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RegionalReach",
  props: {
    regional: {
      type: Object,
      required: true,
    },
  },
  computed: {
    coverage() {
      return this.regional.totalMunicipalities
        ? (this.regional.activeMunicipalities / this.regional.totalMunicipalities) * 100
        : 0;
    },
    gap() {
      return Math.max(0, this.regional.totalMunicipalities - this.regional.activeMunicipalities);
    },
    maxCount() {
      return this.regional.leaderboard && this.regional.leaderboard[0] ? this.regional.leaderboard[0].count : 1;
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
.reach-card
  background: #fff
  border-radius: 14px
  padding: 26px 28px
  display: flex
  flex-direction: column
  gap: 20px

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

.reach-summary
  display: flex
  align-items: center
  gap: 20px
  background: #f7f9fe
  border: 1px solid #e9edf9
  border-radius: 12px
  padding: 18px 20px
  flex-wrap: wrap

.reach-count
  font-family: Georgia, serif
  font-size: 38px
  font-weight: 700
  line-height: 1
  color: #1b2a78

.reach-count-label
  font-size: 12.5px
  color: #6b74a0
  margin-top: 5px

.reach-coverage
  flex: 1
  min-width: 160px
  display: flex
  flex-direction: column
  gap: 8px

.coverage-value
  font-size: 20px
  font-weight: 700
  color: #1b2a78

.coverage-label
  font-size: 12.5px
  color: #7c86ae

.coverage-bar-track
  height: 8px
  border-radius: 4px
  background: #e4e9f7
  overflow: hidden

.coverage-bar-fill
  height: 100%
  background: #1b2a78
  border-radius: 4px

.coverage-gap
  font-size: 12px
  color: #8791b8

.leaderboard
  display: flex
  flex-direction: column
  gap: 11px

.leaderboard-heading
  font-size: 11px
  font-weight: 700
  letter-spacing: .09em
  text-transform: uppercase
  color: #7c86ae

.leaderboard-row
  display: flex
  flex-direction: column
  gap: 6px

.leaderboard-name
  font-size: 13px
  font-weight: 600
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap
  color: #1b2a78

.leaderboard-bar-track
  height: 10px
  border-radius: 5px
  background: #f2f4fc
  overflow: hidden

.leaderboard-bar-fill
  height: 100%
  border-radius: 5px

.leaderboard-count
  font-size: 13px
  font-weight: 700
  color: #1b2a78
</style>
