<template>
  <q-card class="shadow-1 radius-20">
    <q-expansion-item class="shadow-1 overflow-hidden radius-20"
      :label="$t('projectComponents.goalsAndRequirements.title')" header-class="bg-white text-black"
      v-model="expandedGoalsAndRequirements">
      <q-card-section class="q-pt-none">
        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
          {{ $t('projectComponents.goalsAndRequirements.description') }}
        </h4>
        <q-banner rounded class="bg-grey-3 font-16">
          <p class="q-my-sm text-block" v-html="sanitizeHtml(goalsAndRequirementsText)"></p>
        </q-banner>
      </q-card-section>
    </q-expansion-item>
  </q-card>
</template>

<script>
import htmlSanitizer from 'src/mixins/htmlSanitizer.js';

export default {
  name: "ProjectGoalsAndRequirementsView",
  mixins: [htmlSanitizer],
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
      expandedGoalsAndRequirements: this.currentTab === "goalsAndRequirements",
    };
  },
  computed: {
    goalsAndRequirementsText() {
      const raw = this.project && this.project.details && this.project.details.goalsAndRequirements
        ? this.project.details.goalsAndRequirements
        : this.$t('projectComponents.goalsAndRequirements.noContent');
      // Convert newlines to <br> before sanitizeHtml() runs, since sanitizeHtml()
      // strips raw \n characters (see src/mixins/htmlSanitizer.js) which would
      // otherwise destroy the "\n\n---\n\n" merge separator between the old
      // goals/requirements fields.
      return raw.replace(/\n/g, '<br>');
    }
  },
  watch: {
    currentTab(newTab) {
      this.expandedGoalsAndRequirements = newTab === "goalsAndRequirements";
    }
  }
}
</script>

<style lang="scss" scoped>
.text-block {
  white-space: pre-line;
}
</style>
