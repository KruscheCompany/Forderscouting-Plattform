<template>
  <section class="growth-chart shadow-1">
    <div class="row items-start q-gutter-md" style="flex-wrap: wrap">
      <div>
        <h2 class="chart-title">{{ $t("Statistics.marketing.growth.title") }}</h2>
        <div class="chart-subtitle">{{ $t("Statistics.marketing.growth.subtitle") }}</div>
      </div>
      <div class="segmented q-ml-auto">
        <div
          v-for="m in modeOptions"
          :key="m.id"
          class="segment"
          :class="{ 'segment--on': mode === m.id }"
          @click="mode = m.id"
        >
          {{ m.label }}
        </div>
      </div>
      <div class="segmented">
        <div
          v-for="r in rangeOptions"
          :key="r.id"
          class="segment"
          :class="{ 'segment--on': range === r.id }"
          @click="range = r.id; hoverIndex = -1"
        >
          {{ r.label }}
        </div>
      </div>
    </div>

    <div class="chart-body">
      <div class="chart-plot">
        <div class="chart-axis">
          <div v-for="(a, i) in axisTicks" :key="i">{{ a }}</div>
        </div>
        <div class="chart-canvas-wrap">
          <div class="chart-canvas">
            <div class="chart-gridlines">
              <div v-for="(a, i) in axisTicks" :key="i" class="gridline"></div>
            </div>
            <svg viewBox="0 0 1000 272" preserveAspectRatio="none" class="chart-svg">
              <path
                v-for="l in lines"
                :key="l.label"
                :d="l.path"
                fill="none"
                :stroke="l.color"
                stroke-width="2.5"
                stroke-linejoin="round"
                stroke-linecap="round"
                vector-effect="non-scaling-stroke"
              ></path>
            </svg>
            <div v-if="hasHover" class="chart-guide" :style="{ left: hoverPct + '%' }"></div>
            <div
              v-for="(d, i) in hoverDots"
              :key="i"
              class="chart-dot"
              :style="{ left: hoverPct + '%', top: d.topPct + '%', borderColor: d.color }"
            ></div>
            <div v-if="hasHover" class="chart-tooltip" :style="tooltipStyle">
              <div class="tooltip-month">{{ months[hoverIndex] }}</div>
              <div v-for="t in tipRows" :key="t.label" class="tooltip-row">
                <span class="tooltip-dot" :style="{ background: t.color }"></span>
                <span class="tooltip-label">{{ t.label }}</span>
                <span class="tooltip-value">{{ t.value }}</span>
              </div>
            </div>
            <div class="chart-hotspots">
              <div
                v-for="(m, i) in months"
                :key="i"
                class="hotspot"
                :style="{ left: xPct(i) + '%', width: hotspotWidthPct + '%' }"
                @mouseenter="hoverIndex = i"
                @mouseleave="hoverIndex = -1"
              ></div>
            </div>
          </div>
          <div class="chart-xlabels">
            <div
              v-for="(m, i) in months"
              :key="i"
              class="xlabel"
              :class="{ 'xlabel--on': hoverIndex === i }"
              :style="{ left: xPct(i) + '%' }"
            >
              {{ m }}
            </div>
          </div>
          <div class="chart-legend">
            <div v-for="l in lines" :key="l.label" class="legend-item">
              <span class="legend-swatch" :style="{ background: l.color }"></span>{{ l.label }}
            </div>
          </div>
        </div>
      </div>

      <div class="readout-panel">
        <div class="readout-heading">{{ $t("Statistics.marketing.growth.readoutHeading", { months: span }) }}</div>
        <div v-for="r in readout" :key="r.label" class="readout-item">
          <div class="readout-label">{{ r.label }}</div>
          <div class="readout-value">{{ r.value }}</div>
        </div>
        <div class="readout-note">{{ $t("Statistics.marketing.growth.readoutNote") }}</div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "GrowthChart",
  props: {
    growth: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      mode: "cum",
      range: "12m",
      hoverIndex: -1,
    };
  },
  computed: {
    modeOptions() {
      return [
        { id: "new", label: this.$t("Statistics.marketing.growth.modeNew") },
        { id: "cum", label: this.$t("Statistics.marketing.growth.modeCum") },
      ];
    },
    rangeOptions() {
      return [
        { id: "6m", label: this.$t("Statistics.marketing.growth.range6m") },
        { id: "12m", label: this.$t("Statistics.marketing.growth.range12m") },
      ];
    },
    span() {
      return this.range === "6m" ? 6 : 12;
    },
    seriesDefs() {
      return [
        { key: "projects", label: this.$t("Statistics.marketing.growth.seriesProjects"), color: "#1b2a78" },
        { key: "fundings", label: this.$t("Statistics.marketing.growth.seriesFundings"), color: "#6b7fd7" },
        { key: "users", label: this.$t("Statistics.marketing.growth.seriesUsers"), color: "#c98a1f" },
      ];
    },
    months() {
      const all = (this.growth && this.growth.months) || [];
      return all.slice(all.length - this.span);
    },
    series() {
      return this.seriesDefs.map((def) => {
        const s = (this.growth && this.growth[def.key]) || { news: [], cum: [] };
        const start = s.cum.length - this.span;
        const cum = s.cum.slice(start);
        const news = s.news.slice(start);
        return {
          ...def,
          cum,
          news,
          values: this.mode === "cum" ? cum : news,
        };
      });
    },
    maxValue() {
      const all = this.series.flatMap((s) => s.values);
      return Math.max(1, ...all) * 1.12;
    },
    lines() {
      const n = this.months.length;
      return this.series.map((s) => ({
        label: s.label,
        color: s.color,
        path: s.values
          .map((v, i) => (i ? "L" : "M") + this.xPos(i, n).toFixed(1) + "," + this.yPos(v).toFixed(1))
          .join(" "),
      }));
    },
    axisTicks() {
      const ticks = 5;
      return Array.from({ length: ticks }, (_, i) =>
        Math.round((this.maxValue * (ticks - 1 - i)) / (ticks - 1)).toLocaleString("de-DE")
      );
    },
    hasHover() {
      return this.hoverIndex >= 0 && this.hoverIndex < this.months.length;
    },
    hoverPct() {
      return this.hasHover ? this.xPct(this.hoverIndex) : 0;
    },
    hotspotWidthPct() {
      return 100 / Math.max(1, this.months.length - 1);
    },
    hoverDots() {
      if (!this.hasHover) return [];
      return this.series.map((s) => ({
        color: s.color,
        topPct: (this.yPos(s.values[this.hoverIndex]) / 272) * 100,
      }));
    },
    tipRows() {
      if (!this.hasHover) return [];
      return this.series.map((s) => ({
        label: s.label,
        color: s.color,
        value:
          this.mode === "cum"
            ? s.cum[this.hoverIndex].toLocaleString("de-DE")
            : "+" + s.news[this.hoverIndex].toLocaleString("de-DE"),
      }));
    },
    tooltipStyle() {
      return {
        left: this.hoverPct + "%",
        transform: this.hoverPct > 62 ? "translateX(calc(-100% - 16px))" : "translateX(16px)",
      };
    },
    readout() {
      const sumNews = (key) => {
        const s = this.series.find((x) => x.key === key);
        return s ? s.news.reduce((a, b) => a + b, 0) : 0;
      };
      const newProjects = sumNews("projects");
      const newUsers = sumNews("users");
      const newFundings = sumNews("fundings");
      return [
        { label: this.$t("Statistics.marketing.growth.readoutNewProjects"), value: "+" + newProjects },
        { label: this.$t("Statistics.marketing.growth.readoutNewUsers"), value: "+" + newUsers },
        { label: this.$t("Statistics.marketing.growth.readoutNewFundings"), value: "+" + newFundings },
        {
          label: this.$t("Statistics.marketing.growth.readoutAvgProjects"),
          value: "+" + (newProjects / this.span).toFixed(1),
        },
      ];
    },
  },
  methods: {
    xPos(i, n) {
      return n === 1 ? 500 : (i / (n - 1)) * 1000;
    },
    xPct(i) {
      const n = this.months.length;
      return n === 1 ? 50 : (i / (n - 1)) * 100;
    },
    yPos(v) {
      return 272 - (v / this.maxValue) * 272;
    },
  },
};
</script>

<style lang="sass" scoped>
.growth-chart
  background: #fff
  border-radius: 14px
  padding: 26px 28px 22px
  display: flex
  flex-direction: column
  gap: 22px

.chart-title
  margin: 0
  font-family: Georgia, serif
  font-size: 19px
  font-weight: 700
  color: #1b2a78

.chart-subtitle
  font-size: 13px
  color: #6b74a0
  margin-top: 5px

.segmented
  display: flex
  align-items: center
  gap: 4px
  padding: 4px
  background: #f4f6fd
  border-radius: 9px

.segment
  height: 32px
  padding: 0 14px
  border-radius: 7px
  display: flex
  align-items: center
  font-size: 13px
  font-weight: 600
  cursor: pointer
  color: #6b74a0

  &--on
    background: #fff
    color: #1b2a78
    font-weight: 700
    box-shadow: 0 1px 3px rgba(27, 42, 120, .16)

.chart-body
  display: grid
  grid-template-columns: 1fr 262px
  gap: 28px
  align-items: stretch

  @media (max-width: 900px)
    grid-template-columns: 1fr

.chart-plot
  display: flex
  gap: 14px

.chart-axis
  display: flex
  flex-direction: column
  justify-content: space-between
  height: 272px
  font-size: 11.5px
  color: #9aa3c6
  text-align: right

.chart-canvas-wrap
  flex: 1
  min-width: 0

.chart-canvas
  position: relative
  height: 272px

.chart-gridlines
  position: absolute
  inset: 0
  display: flex
  flex-direction: column
  justify-content: space-between

.gridline
  height: 1px
  background: #eef1fa

.chart-svg
  position: absolute
  inset: 0
  width: 100%
  height: 100%
  overflow: visible

.chart-guide
  position: absolute
  top: 0
  bottom: 0
  width: 1.5px
  background: rgba(27, 42, 120, .22)
  transform: translateX(-50%)

.chart-dot
  position: absolute
  width: 11px
  height: 11px
  border-radius: 50%
  background: #fff
  border: 3px solid
  transform: translate(-50%, -50%)
  box-sizing: border-box

.chart-tooltip
  position: absolute
  top: 6px
  background: #1b2a78
  color: #fff
  border-radius: 10px
  padding: 12px 14px
  box-shadow: 0 12px 28px rgba(20, 31, 92, .3)
  z-index: 6
  min-width: 188px
  pointer-events: none

.tooltip-month
  font-family: Georgia, serif
  font-size: 14px
  font-weight: 700
  margin-bottom: 7px

.tooltip-row
  display: flex
  align-items: center
  gap: 8px
  font-size: 12.5px
  white-space: nowrap

.tooltip-dot
  width: 10px
  height: 10px
  border-radius: 3px
  flex: 0 0 10px

.tooltip-label
  color: rgba(255, 255, 255, .7)

.tooltip-value
  margin-left: auto
  font-weight: 700
  padding-left: 14px

.chart-hotspots
  position: absolute
  inset: 0

.hotspot
  position: absolute
  top: 0
  bottom: 0
  transform: translateX(-50%)

.chart-xlabels
  position: relative
  height: 22px
  margin-top: 8px

.xlabel
  position: absolute
  transform: translateX(-50%)
  font-size: 11.5px
  color: #8791b8

  &--on
    color: #1b2a78
    font-weight: 700

.chart-legend
  display: flex
  align-items: center
  gap: 20px
  margin-top: 8px
  font-size: 12.5px
  color: #6b74a0
  flex-wrap: wrap

.legend-item
  display: flex
  align-items: center
  gap: 8px

.legend-swatch
  width: 18px
  height: 3px
  border-radius: 2px
  display: inline-block

.readout-panel
  background: #f7f9fe
  border: 1px solid #e9edf9
  border-radius: 12px
  padding: 20px
  display: flex
  flex-direction: column
  gap: 16px

.readout-heading
  font-size: 11px
  font-weight: 700
  letter-spacing: .09em
  text-transform: uppercase
  color: #7c86ae

.readout-item
  display: flex
  flex-direction: column
  gap: 3px

.readout-label
  font-size: 12.5px
  color: #6b74a0

.readout-value
  font-family: Georgia, serif
  font-size: 21px
  font-weight: 700
  color: #1b2a78

.readout-note
  margin-top: auto
  padding-top: 14px
  border-top: 1px solid #e4e9f7
  font-size: 12.5px
  color: #6b74a0
  line-height: 1.5
</style>
