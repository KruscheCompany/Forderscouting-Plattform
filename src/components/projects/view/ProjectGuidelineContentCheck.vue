<template>
  <q-card class="shadow-1 radius-20">
    <q-expansion-item class="shadow-1 overflow-hidden radius-20" :label="$t('projectComponents.guidelineContentCheck.title')"
      header-class="bg-white text-black" v-model="expandedGuidelineContentCheck">
      <q-card-section class="q-pt-none">
        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
          {{ $t('projectComponents.guidelineContentCheck.description') }}
        </h4>
        <q-banner rounded class="bg-grey-3 font-16">
          <p class="q-my-sm text-block" v-html="guidelineContentCheckText"></p>
        </q-banner>
      </q-card-section>
    </q-expansion-item>
  </q-card>
</template>

<script>
export default {
  name: "ProjectGuidelineContentCheck",
  props: {
    project: {
      type: Object,
      required: true
    },
    currentTab: {
      type: String,
      default: null,
      required: false
    }
  },
  data() {
    return {
      expandedGuidelineContentCheck: this.currentTab === "guidelineContentCheck",
    };
  },
  computed: {
    guidelineContentCheckText() {
      return this.project && this.project.details && this.project.details.guidelineContentCheck 
        ? this.project.details.guidelineContentCheck 
        : this.$t('projectComponents.guidelineContentCheck.noContent');
    }
  },
  watch: {
    currentTab(newTab) {
      // Expand the section if the current tab is 'guidelineContentCheck'
      this.expandedGuidelineContentCheck = newTab === "guidelineContentCheck";
    }
  }
}
</script>

<style lang="scss" scoped>
.text-block {
  white-space: pre-line;
}
</style>
