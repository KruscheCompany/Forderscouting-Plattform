<template>
  <q-page class="q-my-lg" :class="$q.screen.gt.sm ? 'q-mx-xl' : 'q-mx-sm'">
    <div class="column q-gutter-lg">
      <div v-if="marketingData && marketingData.funding">
        <FundingVolumeCards :funding="marketingData.funding" :project-total="marketingData.projectTotal" />
      </div>

      <GrowthChart v-if="marketingData && marketingData.growth" :growth="marketingData.growth" />

      <SuccessFunnel v-if="marketingData && marketingData.funnel" :funnel="marketingData.funnel" />

      <div v-if="marketingData && (marketingData.regional || marketingData.topics || marketingData.tags)" class="row q-col-gutter-md">
        <div class="col-12 col-md-6 q-pl-none" v-if="marketingData.regional">
          <RegionalReach :regional="marketingData.regional" />
        </div>
        <div class="col-12 col-md-6" v-if="marketingData.topics || marketingData.tags">
          <TopicBreakdown :categories="marketingData.topics" :tags="marketingData.tags" />
        </div>
      </div>

      <SuccessStories v-if="marketingData && marketingData.stories" :stories="marketingData.stories" />

      <AiEfficiencyBanner :ai-suggestions="statsData.aiSuggestions" />

      <div class="details-section shadow-1">
        <div class="details-toggle" @click="detailsOpen = !detailsOpen">
          <q-icon :name="detailsOpen ? 'mdi-chevron-down' : 'mdi-chevron-right'" size="20px" color="primary" />
          <div>
            <div class="details-title">{{ $t("Statistics.marketing.details.title") }}</div>
            <div class="details-subtitle">{{ $t("Statistics.marketing.details.subtitle") }}</div>
          </div>
          <div class="details-toggle-label q-ml-auto">
            {{ detailsOpen ? $t("Statistics.marketing.details.hide") : $t("Statistics.marketing.details.show") }}
          </div>
        </div>

        <q-slide-transition>
          <div v-show="detailsOpen" class="details-body">
            <div class="row q-col-gutter-md">
              <div class="col-6 col-md-3" v-for="(stat, index) in statistics" :key="index">
                <div class="shadow-2 radius-20 q-pa-md" style="height: 130px; border: 1px solid rgb(233, 237, 249);">
                  <p class="font-14 text-blue-grey-10 q-mt-xs q-mb-none">{{ stat.title }}</p>
                  <p class="font-24 text-weight-bold text-blue q-mb-sm">{{ stat.value }}</p>
                </div>
              </div>
            </div>
            <StatsTable @stats="(val) => (statsData = val)" />
          </div>
        </q-slide-transition>
      </div>
    </div>
  </q-page>
</template>

<script>
import StatsTable from "components/stats/StatsTable.vue";
import FundingVolumeCards from "components/stats/FundingVolumeCards.vue";
import GrowthChart from "components/stats/GrowthChart.vue";
import SuccessFunnel from "components/stats/SuccessFunnel.vue";
import RegionalReach from "components/stats/RegionalReach.vue";
import TopicBreakdown from "components/stats/TopicBreakdown.vue";
import SuccessStories from "components/stats/SuccessStories.vue";
import AiEfficiencyBanner from "components/stats/AiEfficiencyBanner.vue";

export default {
  name: "stats",
  data() {
    return {
      statsData: {},
      marketingData: null,
      detailsOpen: false,
    };
  },
  components: {
    StatsTable,
    FundingVolumeCards,
    GrowthChart,
    SuccessFunnel,
    RegionalReach,
    TopicBreakdown,
    SuccessStories,
    AiEfficiencyBanner,
  },
  computed: {
    statistics() {
      return [
        {
          title: this.$t("Statistics.currentFunding"),
          value: this.statsData.fundings,
        },
        {
          title: this.$t("Statistics.projectIdeas"),
          value: this.statsData.projects,
        },
        {
          title: this.$t("Statistics.administration/user"),
          value: this.statsData.users,
        },
        {
          title: this.$t("Statistics.fundinginfoArchive"),
          value: this.statsData.archivedFundings,
        },
        {
          title: this.$t("Statistics.projectinfoArchive"),
          value: this.statsData.archivedProjects,
        },
        {
          title: this.$t("Statistics.watchList"),
          value: this.statsData.watchlists,
        },
        {
          title: this.$t("Statistics.municipalities"),
          value: this.statsData.municipalities,
        },
        {
          title: this.$t("Statistics.projectTotalDups"),
          value: this.statsData.projectTotalDups,
        },
        {
          title: this.$t("Statistics.totalDups"),
          value: this.statsData.totalDups,
        },
      ];
    },
  },
  methods: {
    fetchMarketingStats() {
      this.$api
        .get("/api/stats/marketing")
        .then((response) => {
          this.marketingData = response.data;
        })
        .catch(() => {
          this.$store.dispatch("notifications/pushToast", { kind: "negative", title: this.$t("Statistics.marketing.loadError") });
        });
    },
  },
  created() {
    this.fetchMarketingStats();
  },
};
</script>

<style lang="sass" scoped>
.details-section
  background: #fff
  border-radius: 14px
  overflow: hidden

.details-toggle
  padding: 20px 28px
  display: flex
  align-items: center
  gap: 14px
  cursor: pointer

  &:hover
    background: #fbfcff

.details-title
  font-family: Georgia, serif
  font-size: 19px
  font-weight: 700
  color: #1b2a78

.details-subtitle
  font-size: 12.5px
  color: #7c86ae
  margin-top: 3px

.details-toggle-label
  font-size: 13px
  font-weight: 700
  color: #4759c4

.details-body
  padding: 28px 26px
  border-top: 1px solid #eef1fa
</style>
