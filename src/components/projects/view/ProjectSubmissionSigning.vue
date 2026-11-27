<template>
  <q-card class="shadow-1 radius-20">
    <q-expansion-item class="shadow-1 overflow-hidden radius-20"
      :label="$t('projectComponents.submissionSigning.title')" header-class="bg-white text-black"
      v-model="expandedSubmissionSigning">
      <q-card-section class="q-pt-none">

        <div class="col-12 q-mt-md">
          <h5 class="font-16 text-blue-grey-10 q-mb-md">
            {{ $t('projectComponents.submissionSigning.selectionLabel') }}
          </h5>

          <div v-if="statusEntries.length === 0" class="row q-col-gutter-md items-center">
            <div class="col-auto">
              <q-icon name="help_outline" color="grey" size="xl" />
            </div>
            <div class="col-auto">
              {{ $t('projectComponents.submissionSigning.pendingDecision') }}
            </div>
          </div>
          <div v-for="entry in statusEntries" :key="entry.status" class="row q-col-gutter-md items-center">
            <div class="col-auto">
              <q-icon :name="getStatusIcon(entry.status)" :color="entry.color" size="xl" />
            </div>
            <div class="col-auto">
              <div class="text-caption text-grey-7">{{ $t(entry.caption) }}</div>
              {{ getStatusText(entry.status) }}
            </div>
          </div>
        </div>
      </q-card-section>
    </q-expansion-item>
  </q-card>
</template>

<script>
import projectStatusLabels from "src/mixins/projectStatusLabels";

export default {
  name: "ProjectSubmissionSigning",
  mixins: [projectStatusLabels],
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
      expandedSubmissionSigning: this.currentTab === "submissionSigning",
    };
  },
  computed: {
    statusEntries() {
      const { status, projectStatus } = this.project || {};
      const entries = [];
      if (status) {
        entries.push({
          status,
          caption: "projectComponents.submissionSigning.applicationStep",
          color: status === "rejectionNotice" ? "red" : "green"
        });
      }
      if (projectStatus) {
        entries.push({
          status: projectStatus,
          caption: "projectComponents.submissionSigning.projectStep",
          color: this.getStatusColor(projectStatus)
        });
      }
      return entries;
    }
  },
  watch: {
    currentTab(newTab) {
      // Expand the section if the current tab is 'submissionSigning'
      this.expandedSubmissionSigning = newTab === "submissionSigning";
    }
  }
}
</script>

<style lang="scss" scoped>
.text-block {
  white-space: pre-line;
}
</style>
