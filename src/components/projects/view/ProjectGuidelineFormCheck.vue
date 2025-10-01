<template>
  <q-card class="shadow-1 radius-20">
    <q-expansion-item class="shadow-1 overflow-hidden radius-20"
      :label="$t('projectComponents.guidelineFormCheck.title')" header-class="bg-white text-black"
      v-model="expandedGuidelineFormCheck">
      <q-card-section class="q-pt-none">
        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
          {{ $t('projectComponents.guidelineFormCheck.bulletPointTitle') }}
        </h4>
        <ul>
          <li>{{ $t('projectComponents.guidelineFormCheck.documents') }}</li>
          <li>{{ $t('projectComponents.guidelineFormCheck.procedure') }}</li>
          <li>{{ $t('projectComponents.guidelineFormCheck.applicationDeadline') }}</li>
          <li>{{ $t('projectComponents.guidelineFormCheck.applicationCost') }}</li>
        </ul>
        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
          {{ $t('projectComponents.guidelineFormCheck.description') }}
        </h4>
        <q-banner rounded class="bg-grey-3 font-16">
          <p class="q-my-sm text-block" v-html="guidelineFormCheckText"></p>
        </q-banner>
      </q-card-section>
    </q-expansion-item>
  </q-card>
</template>

<script>
export default {
  name: "ProjectGuidelineFormCheck",
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
      expandedGuidelineFormCheck: this.currentTab === "guidelineFormCheck",
    };
  },
  computed: {
    guidelineFormCheckText() {
      return this.project && this.project.details && this.project.details.guidelineFormCheck
        ? this.project.details.guidelineFormCheck
        : this.$t('projectComponents.guidelineFormCheck.noContent');
    }
  },
  watch: {
    currentTab(newTab) {
      // Expand the section if the current tab is 'guidelineFormCheck'
      this.expandedGuidelineFormCheck = newTab === "guidelineFormCheck";
    }
  }
}
</script>

<style lang="scss" scoped>
.text-block {
  white-space: pre-line;
}
</style>
