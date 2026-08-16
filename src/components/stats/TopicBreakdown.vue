<template>
  <div class="topics-card shadow-1">
    <div class="row items-start q-gutter-sm" style="flex-wrap: wrap">
      <div>
        <h2 class="section-title">{{ $t("Statistics.marketing.topics.title") }}</h2>
        <div class="section-hint">{{ $t("Statistics.marketing.topics.subtitle") }}</div>
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
    </div>
    <div v-if="activeList.length" class="topics-list">
      <div v-for="(t, i) in activeList" :key="i" class="topic-row">
        <div class="row items-baseline q-gutter-sm">
          <div class="topic-name">{{ t.title }}</div>
          <div class="topic-count q-ml-auto">{{ t.count }}</div>
          <div class="topic-share">{{ pct(t.count, totalCount).toFixed(0) }} %</div>
        </div>
        <div class="topic-bar-track">
          <div
            class="topic-bar-fill"
            :style="{ width: pct(t.count, maxCount) + '%', background: i < 3 ? '#1b2a78' : '#9aa9df' }"
          ></div>
        </div>
      </div>
    </div>
    <div v-else class="topics-empty">{{ $t("Statistics.marketing.topics.empty") }}</div>
  </div>
</template>

<script>
export default {
  name: "TopicBreakdown",
  props: {
    categories: {
      type: Array,
      default: () => [],
    },
    tags: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      mode: "categories",
    };
  },
  computed: {
    modeOptions() {
      return [
        { id: "categories", label: this.$t("Statistics.marketing.topics.modeCategories") },
        { id: "tags", label: this.$t("Statistics.marketing.topics.modeTags") },
      ];
    },
    activeList() {
      return this.mode === "tags" ? this.tags : this.categories;
    },
    totalCount() {
      return this.activeList.reduce((sum, t) => sum + t.count, 0);
    },
    maxCount() {
      return this.activeList[0] ? this.activeList[0].count : 1;
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
.topics-card
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

.topics-list
  display: flex
  flex-direction: column
  gap: 13px

.topics-empty
  font-size: 13.5px
  color: #9aa3c6

.topic-row
  display: flex
  flex-direction: column
  gap: 6px

.topic-name
  font-weight: 600
  font-size: 13px
  color: #1b2a78

.topic-count
  font-weight: 700
  font-size: 13px
  color: #1b2a78

.topic-share
  color: #8791b8
  font-size: 12px
  width: 44px
  text-align: right

.topic-bar-track
  height: 10px
  border-radius: 5px
  background: #f2f4fc
  overflow: hidden

.topic-bar-fill
  height: 100%
  border-radius: 5px
</style>
