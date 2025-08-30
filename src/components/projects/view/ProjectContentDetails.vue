<template>
  <q-card class="shadow-1 radius-20">
    <q-expansion-item class="shadow-1 overflow-hidden radius-20" :label="$t(
      'projectContent.generalInformation')" header-class="bg-white text-black" v-model="expanded">
      <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify"
        narrow-indicator>
        <q-tab v-for="tab in tabs" :key="tab.name" :name="tab.name" :label="tab.label" />

      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="Ausgangssituation">
          <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
            {{ $t('projectComponents.contentDetails.startingConditionDescription') }}
          </h4>
          <q-banner rounded class="bg-grey-3 font-16">
            <p class="q-my-sm text-block" v-html="startingCondition"></p>
          </q-banner>
        </q-tab-panel>

        <q-tab-panel name="Projektziele">
          <q-banner rounded class="bg-grey-3 font-16">
            <p class="q-my-sm text-block" v-html="content"></p>
          </q-banner>
        </q-tab-panel>

        <q-tab-panel name="Projektinhalt">
          <q-banner rounded class="bg-grey-3 font-16">
            <p class="q-my-sm text-block" v-html="goals"></p>
          </q-banner>
        </q-tab-panel>

        <q-tab-panel name="Nutzen/Wirkung">
          <q-banner rounded class="bg-grey-3 font-16">
            <p class="q-my-sm text-block" v-html="valuesAndBenefits"></p>
          </q-banner>
        </q-tab-panel>

        <q-tab-panel name="Finanzplan">

          <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
            {{ $t('projectComponents.contentDetailsView.briefTaskText') }}
          </h4>

          <q-banner rounded class="bg-grey-3 font-16">
            <p class="q-my-sm text-block" v-html="financialPlanText"></p>
          </q-banner>

          <h4 class="font-16 text-blue-grey-10 q-mt-md q-mb-none">
            {{ $t('projectComponents.contentDetails.financialPlanTitle') }}
          </h4>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-3" v-for="(stat, index) in financialPlan" :key="index">
              <div class="shadow-0 radius-20 q-pa-md bg-grey-3" style="height: 130px">
                <p class="font-14 text-blue-grey-10 q-mt-xs q-mb-none">{{ stat.title }}</p>
                <p class="font-24 text-weight-bold text-blue q-mb-sm">
                  {{ formatCurrency(stat.value) }}
                </p>
              </div>
            </div>
          </div>

        </q-tab-panel>

        <q-tab-panel name="Zeitplan">

          <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
            {{ $t('projectComponents.contentDetailsView.briefTaskText') }}
          </h4>

          <q-banner rounded class="bg-grey-3 font-16">
            <p class="q-my-sm text-block" v-html="timeline"></p>
          </q-banner>

        </q-tab-panel>

        <q-tab-panel name="Uploads">

          <div class="row justify-between">

            <div class="col-4">
              <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                {{ $t('projectComponents.contentDetailsView.briefTaskText') }}
              </h4>
              <q-banner rounded class="bg-grey-3 font-16" style="min-height: 100px;">
                <p class="q-my-sm text-block" v-html="documentation"></p>
              </q-banner>

              <div v-if="hasFiles">
                <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-md">
                  {{ $t('projectComponents.contentDetailsView.files') }}
                </h4>
                <div class="font-16">
                  <div v-if="hasFiles">
                    <div class="row" v-for="(file, index) in files" :key="index">
                      <span @click="handleOpenDocumentPreview(file)"
                        class="text-blue q-my-sm text-weight-bold cursor-pointer block"
                        style="text-decoration: underline; word-break: break-word;">
                        {{ file.name }}
                      </span>
                    </div>
                  </div>
                  <div v-else>
                    {{ $t('projectComponents.contentDetailsView.noFilesUploaded') }}
                  </div>
                </div>
              </div>
            </div>

            <div class="col-8 q-pl-md">
              <ProjectMediaGallery :project="project" />
            </div>

          </div>
        </q-tab-panel>

        <q-tab-panel name="Links">

          <q-tab-panel name="Links">
            <q-banner rounded class="bg-grey-3 font-16">
              <div v-if="hasLinks">
                <div class="font-16">
                  <div v-if="hasLinks">
                    <div class="row" v-for="(link, index) in links" :key="index">
                      <p class="q-mb-none">{{ link.title }}: <a class="q-mb-sm text-blue text-weight-600 text-overflow"
                          target="_blank" rel="noopener noreferrer" :href="formatLinkUrl(link.link)">
                          {{ link.link }}
                        </a></p>
                    </div>
                  </div>
                  <div v-else>
                    <p class="col-12 q-mb-none">{{ $t("projectContent.noLinksSet") }}</p>
                  </div>
                </div>
              </div>
            </q-banner>
          </q-tab-panel>

        </q-tab-panel>

      </q-tab-panels>
    </q-expansion-item>
  </q-card>
</template>

<script>
import ProjectMediaGallery from './ProjectMediaGallery.vue';
export default {
  name: "ProjectContentDetails",
  emits: ['open-document-preview'],
  data() {
    return {
      tab: "Ausgangssituation",
      tabs: [
        { name: "Ausgangssituation", label: this.$t('projectComponents.contentDetailsView.tabs.Ausgangssituation') },
        { name: "Projektziele", label: this.$t('projectComponents.contentDetailsView.tabs.Projektziele') },
        { name: "Projektinhalt", label: this.$t('projectComponents.contentDetailsView.tabs.Projektinhalt') },
        { name: "Nutzen/Wirkung", label: this.$t('projectComponents.contentDetailsView.tabs.Nutzen/Wirkung') },
        { name: "Finanzplan", label: this.$t('projectComponents.contentDetailsView.tabs.Finanzplan') },
        { name: "Zeitplan", label: this.$t('projectComponents.contentDetailsView.tabs.Zeitplan') },
        { name: "Uploads", label: this.$t('projectComponents.contentDetailsView.tabs.Uploads') },
        { name: "Links", label: this.$t('projectComponents.contentDetailsView.tabs.Links') }
      ],
      expanded: this.currentTab === "project"
    };
  },
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
  components: {
    ProjectMediaGallery
  },
  computed: {
    startingCondition() {
      return (
        (this.project.details && this.project.details.startingCondition) ||
        this.$t('projectComponents.contentDetailsView.noStartingCondition')
      );
    },
    content() {
      return (
        (this.project.details && this.project.details.content) ||
        this.$t('projectComponents.contentDetailsView.noProjectContent')
      );
    },
    goals() {
      return (
        (this.project.details && this.project.details.goals) ||
        this.$t('projectComponents.contentDetailsView.noProjectGoals')
      );
    },
    valuesAndBenefits() {
      return (
        (this.project.details && this.project.details.valuesAndBenefits) ||
        this.$t('projectComponents.contentDetailsView.noValuesAndBenefits')
      );
    },
    financialPlanText() {
      return (
        (this.project.financialPlan && this.project.financialPlan.description) ||
        this.$t('projectComponents.contentDetailsView.noFinancialPlan')
      );
    },
    financialPlan() {
      if (this.project.financialPlan && this.project.financialPlan.costAndFinance) {
        // Translate titles if they are the standard cost categories
        return this.project.financialPlan.costAndFinance.map(item => ({
          ...item,
          title: this.translateCostTitle(item.title)
        }));
      }
      // Return default structure if no data is available
      return [
        { title: this.$t('projectComponents.contentDetails.costs.Gesamtinvestition'), value: "" },
        { title: this.$t('projectComponents.contentDetails.costs.Fördermittel'), value: "" },
        { title: this.$t('projectComponents.contentDetails.costs.Eigenmittel'), value: "" },
        { title: this.$t('projectComponents.contentDetails.costs.Fremdmittel'), value: "" }
      ];
    },
    timeline() {
      return (
        (this.project.details && this.project.details.timeline) ||
        this.$t('projectComponents.contentDetailsView.noTimeline')
      );
    },
    documentation() {
      return (
        (this.project.details && this.project.details.uploadDescription) ||
        this.$t('projectComponents.contentDetailsView.noDocumentation')
      );
    },
    files() {
      return this.project.files || [];
    },
    hasFiles() {
      return this.files.length > 0;
    },
    links() {
      return this.project.links || [];
    },
    hasLinks() {
      return this.links.length > 0;
    },
  },
  watch: {
    currentTab(newTab) {
      // Expand the section if the current tab is 'project'
      this.expanded = newTab === "project";
    }
  },
  methods: {
    translateCostTitle(title) {
      // Map known German cost titles to i18n keys
      const costTitleMap = {
        'Gesamtinvestition': this.$t('projectComponents.contentDetails.costs.Gesamtinvestition'),
        'Fördermittel': this.$t('projectComponents.contentDetails.costs.Fördermittel'),
        'Eigenmittel': this.$t('projectComponents.contentDetails.costs.Eigenmittel'),
        'Fremdmittel': this.$t('projectComponents.contentDetails.costs.Fremdmittel')
      };

      return costTitleMap[title] || title; // Return translation or original if not found
    },
    formatCurrency(value) {
      if (!value || value === '') {
        return this.$t('projectComponents.contentDetailsView.notSpecified');
      }

      // Convert to number if it's a string
      const numValue = typeof value === 'string' ? parseFloat(value.replace(/[.,]/g, match => match === ',' ? '.' : '')) : value;

      if (isNaN(numValue)) {
        return value; // Return original value if not a number
      }

      // Format using German locale (thousands: ".", decimal: ",")
      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(numValue);
    },
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
      this.$emit('open-document-preview', file);
    }
  }
};
</script>

<style lang="scss" scoped>
.text-block {
  white-space: pre-line;
}
</style>
