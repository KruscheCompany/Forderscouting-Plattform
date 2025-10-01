<template>
  <div>
    <q-card class="shadow-1 radius-20">
      <q-expansion-item class="shadow-1 overflow-hidden radius-20"
        :label="$t('projectComponents.applicationDecision.title')" header-class="bg-white text-black"
        v-model="expanded">
        <q-card-section class="q-pt-none">
          <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
            {{ $t('projectComponents.applicationDecision.description') }}
          </h4>

          <div class="col-12 q-mt-md">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <div v-if="hasFiles">
                  <h4 class="font-16 text-blue-grey-10 q-mb-md q-mt-sm">
                    {{ $t('projectComponents.contentDetailsView.files') || 'Dateien' }}
                  </h4>
                  <div class="font-16">
                    <div v-if="hasFiles">
                      <div class="row q-col-gutter-md">
                        <div class="col-12 q-mb-sm" v-for="(file, index) in applicationDecisionFiles" :key="index">
                          <div class="radius-6 shadow-1 q-pa-md">
                            <div class="row items-center">
                              <div class="col-auto">
                                <q-avatar rounded size="48px">
                                  <q-icon name="insert_drive_file" size="24px" color="primary" />
                                </q-avatar>
                              </div>
                              <div class="col">
                                <span @click="handleOpenDocumentPreview(file)"
                                  class="text-blue q-my-sm text-weight-bold cursor-pointer block"
                                  style="text-decoration: underline; word-break: break-word;">
                                  {{ file.name }}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-else>
                      <q-banner rounded class="bg-grey-3 font-16">
                        <p class="q-my-sm">{{ $t('projectComponents.contentDetailsView.noFilesUploaded') }}</p>
                      </q-banner>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <q-banner rounded class="bg-grey-3 font-16">
                    <p class="q-my-sm">{{ $t('projectComponents.contentDetailsView.noFilesUploaded') }}</p>
                  </q-banner>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-expansion-item>
    </q-card>

    <!-- Preview Document Dialog -->
    <q-dialog v-model="showPreviewDocumentDialog" full-width>
      <q-card>
        <q-card-section style="max-height: 70vh;" class="scroll">
          <iframe className="doc" title="file" :src="previewDocumentData"
            style="width: 100%; height: 70vh; border-style: none;" type="application/pdf" />
          <div style="width: 100%; height: 70vh; opacity: 0;">&nbsp;</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: "ProjectApplicationDecisionView",
  emits: ['open-document-preview'],
  props: {
    project: {
      type: Object,
      required: true
    },
    currentTab: {
      type: String,
      default: null,
      required: true
    }
  },
  data() {
    return {
      expanded: this.currentTab === "submissionSigning" || this.currentTab === "applicationDecision",
      showPreviewDocumentDialog: false,
      previewDocumentData: null
    };
  },
  computed: {
    applicationDecisionFiles() {
      return this.project.applicationDecisionFiles || [];
    },
    hasFiles() {
      return this.applicationDecisionFiles.length > 0;
    },
    appUrl() {
      return process.env.VUE_APP_MAIN_URL;
    }
  },
  watch: {
    currentTab(newTab) {
      // Expand the section if the current tab is 'submissionSigning' or 'applicationDecision'
      this.expanded = newTab === "submissionSigning" || newTab === "applicationDecision";
    }
  },
  methods: {
    formatLinkUrl(link) {
      const linkParts = link.split('://');
      if (linkParts[0].substring(0, 5) === 'https') {
        return link;
      } else if (linkParts[0].substring(0, 4) === 'http') {
        return link;
      } else {
        return `http://${link}`;
      }
    },
    async handleOpenDocumentPreview(file) {
      // Show document preview directly in this component
      this.showPreviewDocumentDialog = true;
      this.previewDocumentData = `https://pdf.foerderscouting-plattform.de/generic/web/viewer_readonly.html?file=${process.env.VUE_APP_MAIN_URL}/api/file/${file.id}?token=${this.$store.state.userCenter.user.jwt}`;
    }
  }
};
</script>

<style lang="scss" scoped>
.text-block {
  white-space: pre-line;
}
</style>
