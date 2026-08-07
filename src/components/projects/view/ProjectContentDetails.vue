<template>
  <q-card class="shadow-1 radius-20">
    <q-expansion-item class="shadow-1 overflow-hidden radius-20" :label="$t(
      'projectContent.projectDescription')" header-class="bg-white text-black" v-model="expanded">
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
            <p class="q-my-sm text-block" v-html="sanitizeHtml(startingCondition)"></p>
          </q-banner>
        </q-tab-panel>

        <q-tab-panel name="Projektziele">
          <q-banner rounded class="bg-grey-3 font-16">
            <p class="q-my-sm text-block" v-html="sanitizeHtml(content)"></p>
          </q-banner>
        </q-tab-panel>

        <q-tab-panel name="Projektinhalt">
          <q-banner rounded class="bg-grey-3 font-16">
            <p class="q-my-sm text-block" v-html="sanitizeHtml(goals)"></p>
          </q-banner>
        </q-tab-panel>

        <q-tab-panel name="Nutzen/Wirkung">
          <q-banner rounded class="bg-grey-3 font-16">
            <p class="q-my-sm text-block" v-html="sanitizeHtml(valuesAndBenefits)"></p>
          </q-banner>
        </q-tab-panel>

        <q-tab-panel name="Finanzplan">
          <div class="row">
            <div class="col-8 q-pr-sm">
              <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                {{ $t('projectComponents.contentDetailsView.financialPlanDescription') }}
              </h4>

              <q-banner rounded class="bg-grey-3 font-16">
                <p class="q-my-sm text-block" v-html="sanitizeHtml(financialPlanText)"></p>
              </q-banner>
            </div>
            <div class="col-4">

              <h4 class="font-16 text-blue-grey-10 q-my-none">
                {{ $t('projectComponents.contentDetails.financialPlanTitle') }}
              </h4>
              <div class="financial-grid q-py-sm q-pl-md bg-grey-3">
                <div v-for="(stat, index) in financialPlan" :key="index" class="financial-grid-row">
                  <p class="font-14 text-blue text-weight-bold q-my-none">{{ stat.title }}: </p>
                  <p class="font-16 text-weight-regular q-my-none text-blue">{{ formatCurrency(stat.value) }}</p>
                </div>
              </div>
            </div>
          </div>

        </q-tab-panel>

        <q-tab-panel name="Zeitplan">

          <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
            {{ $t('projectComponents.contentDetailsView.timelineDescription') }}
          </h4>

          <q-banner rounded class="bg-grey-3 font-16">
            <p class="q-my-sm text-block" v-html="sanitizeHtml(timeline)"></p>
          </q-banner>

        </q-tab-panel>

        <q-tab-panel name="Uploads">

          <div class="row justify-between">

            <div :class="hasMedia ? 'col-4' : 'col-12'">
              <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                {{ $t('projectComponents.contentDetailsView.uploadsDescription') }}
              </h4>
              <q-banner rounded class="bg-grey-3 font-16" style="align-items: flex-start;"
                :style="hasMedia ? 'min-height: 400px;' : 'min-height: 144px;'">
                <p class="q-my-sm text-block" v-html="sanitizeHtml(documentation)"></p>
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

            <div v-if="hasMedia" class="col-8 q-pl-md" style="margin-top:39px">
              <ProjectMediaGallery :project="project" />
            </div>

          </div>
        </q-tab-panel>

        <q-tab-panel name="Links">

          <q-tab-panel name="Links">
            <q-banner rounded class="bg-grey-3 font-16 links-block">
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
            </q-banner>
          </q-tab-panel>

        </q-tab-panel>

      </q-tab-panels>
    </q-expansion-item>
  </q-card>
</template>

<script>
import ProjectMediaGallery from './ProjectMediaGallery.vue';
import htmlSanitizer from 'src/mixins/htmlSanitizer';
export default {
  name: "ProjectContentDetails",
  mixins: [htmlSanitizer],
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
        { title: this.$t('ProjectDashboard.totalInvestment'), value: "" },
        { title: this.$t('ProjectDashboard.grants'), value: "" },
        { title: this.$t('ProjectDashboard.ownFunds'), value: "" },
        { title: this.$t('ProjectDashboard.thirdPartyFunds'), value: "" }
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
    media() {
      return this.project.media || [];
    },
    hasMedia() {
      return this.media.length > 0;
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
        'Gesamtinvestition': this.$t('ProjectDashboard.totalInvestment'),
        'Fördermittel': this.$t('ProjectDashboard.grants'),
        'Eigenmittel': this.$t('ProjectDashboard.ownFunds'),
        'Drittmittel': this.$t('ProjectDashboard.thirdPartyFunds')
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
  min-height: 144px
}

.links-block {
  min-height: 144px;
  align-items: normal;
}

.financial-grid {
  display: grid;
  grid-template-columns: max-content 1fr;
  align-items: center;
  column-gap: 12px;

  .financial-grid-row {
    display: contents;

    >* {
      height: 40.5px;
      display: flex;
      align-items: center;
    }
  }
}
</style>
