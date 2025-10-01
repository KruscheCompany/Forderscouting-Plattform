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

          <div class="row q-col-gutter-md items-center">
            <div class="col-auto">
              <q-icon
                :name="submissionStatus === null ? 'help_outline' : (submissionStatus === 'grantNotice' ? 'check' : (submissionStatus === 'sentToFunding' ? 'mdi-send-clock' : 'clear'))"
                :color="submissionStatus === null ? 'grey' : (submissionStatus === 'rejectionNotice' ? 'red' : 'green')"
                size="xl" />
            </div>
            <div class="col-auto">
              <span v-if="submissionStatus === null">
                {{ $t('projectComponents.submissionSigning.pendingDecision') }}
              </span>
              <span v-else-if="submissionStatus === 'sentToFunding'">
                {{ $t('projectComponents.submissionSigning.sentToFunding') }}
              </span>
              <span v-else-if="submissionStatus === 'grantNotice'">
                {{ $t('projectComponents.submissionSigning.grantNotice') }}
              </span>
              <span v-else>
                {{ $t('projectComponents.submissionSigning.rejectionNotice') }}
              </span>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-expansion-item>
  </q-card>
</template>

<script>
export default {
  name: "ProjectSubmissionSigning",
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
    submissionStatus() {
      return this.project && this.project.status !== undefined
        ? this.project.status
        : null;
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
