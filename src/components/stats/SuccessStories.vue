<template>
  <section class="stories-section">
    <div class="section-heading">
      <h2 class="section-title">{{ $t("Statistics.marketing.stories.title") }}</h2>
      <div class="section-hint">{{ $t("Statistics.marketing.stories.subtitle") }}</div>
    </div>
    <div v-if="stories.length" class="stories-grid">
      <div v-for="(s, i) in stories" :key="i" class="story-card shadow-1">
        <div class="row items-center q-gutter-xs">
          <div class="story-rank">{{ String(i + 1).padStart(2, "0") }}</div>
          <div class="story-pill">{{ $t("Statistics.marketing.stories.granted") }}</div>
        </div>
        <div class="story-title">{{ s.title }}</div>
        <div class="story-place">{{ s.municipality }}</div>
        <div class="story-footer">
          <div class="story-amount">{{ formatEurMillions(s.amount) }}</div>
          <div class="story-meta">{{ $t("Statistics.marketing.stories.amountLabel") }} · {{ s.category }}</div>
        </div>
      </div>
    </div>
    <div v-else class="stories-empty">{{ $t("Statistics.marketing.stories.empty") }}</div>
  </section>
</template>

<script>
import euroFormatter from "src/mixins/euroFormatter";

export default {
  name: "SuccessStories",
  mixins: [euroFormatter],
  props: {
    stories: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="sass" scoped>
.stories-section
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

.stories-grid
  display: grid
  grid-template-columns: repeat(5, 1fr)
  gap: 16px

  @media (max-width: 1200px)
    grid-template-columns: repeat(3, 1fr)

  @media (max-width: 700px)
    grid-template-columns: 1fr

.story-card
  background: #fff
  border-radius: 14px
  padding: 20px 20px 18px
  display: flex
  flex-direction: column
  gap: 12px

.story-rank
  font-family: Georgia, serif
  font-size: 13px
  font-weight: 700
  color: #9aa3c6

.story-pill
  font-size: 11px
  font-weight: 700
  letter-spacing: .05em
  text-transform: uppercase
  color: #1c6f52
  background: #e6f4ee
  border-radius: 5px
  padding: 3px 7px

.story-title
  font-size: 15px
  font-weight: 700
  line-height: 1.35
  color: #1b2a78

.story-place
  font-size: 12.5px
  color: #6b74a0

.story-footer
  margin-top: auto
  padding-top: 12px
  border-top: 1px solid #eef1fa

.story-amount
  font-family: Georgia, serif
  font-size: 26px
  font-weight: 700
  color: #1b2a78

.story-meta
  font-size: 11.5px
  color: #8791b8
  margin-top: 3px

.stories-empty
  font-size: 13.5px
  color: #9aa3c6
  padding: 20px
  background: #fff
  border-radius: 14px
</style>
