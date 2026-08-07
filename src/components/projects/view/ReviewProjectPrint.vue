<template>
  <div class="print-sheet">
    <h1>{{ project.title }}</h1>

    <table class="meta-table">
      <tbody>
        <tr v-if="fundingProgramTitle">
          <th>{{ $t('reviewPage.fundingProgramLabel') }}</th>
          <td>{{ fundingProgramTitle }}</td>
        </tr>
        <tr v-if="project.municipality">
          <th>{{ $t('reviewPage.submittedByLabel') }}</th>
          <td>{{ project.municipality.title }}</td>
        </tr>
        <tr v-if="ticket && ticket.sentAt">
          <th>{{ $t('reviewPage.submittedOnLabel') }}</th>
          <td>{{ formatDate(ticket.sentAt) }}</td>
        </tr>
        <tr>
          <th>{{ $t('reviewPage.decisionLabel') }}</th>
          <td>{{ statusText }}</td>
        </tr>
      </tbody>
    </table>

    <h2>{{ $t('projectComponents.fundingCheck.title') }}</h2>
    <table v-if="fundingMatches.length" class="funding-table">
      <thead>
        <tr>
          <th>#</th>
          <th>{{ $t('reviewPage.projectDetailsLabel') }}</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(funding, index) in fundingMatches" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ funding.title }}</td>
          <td>{{ (funding.score * 100).toFixed(2) }}%</td>
        </tr>
      </tbody>
    </table>
    <p v-else>{{ $t('projectComponents.fundingCheck.noFundingData') }}</p>

    <h2>{{ $t('projectContent.projectContent') }}</h2>

    <section>
      <h3>{{ $t('projectComponents.contentDetailsView.tabs.Ausgangssituation') }}</h3>
      <div v-html="sanitizeHtml(startingCondition)"></div>
    </section>

    <section>
      <h3>{{ $t('projectComponents.contentDetailsView.tabs.Projektinhalt') }}</h3>
      <div v-html="sanitizeHtml(content)"></div>
    </section>

    <section>
      <h3>{{ $t('projectComponents.contentDetailsView.tabs.Projektziele') }}</h3>
      <div v-html="sanitizeHtml(goals)"></div>
    </section>

    <section>
      <h3>{{ $t('projectComponents.contentDetailsView.tabs.Nutzen/Wirkung') }}</h3>
      <div v-html="sanitizeHtml(valuesAndBenefits)"></div>
    </section>

    <section>
      <h3>{{ $t('projectComponents.contentDetailsView.tabs.Finanzplan') }}</h3>
      <div v-html="sanitizeHtml(financialPlanText)"></div>
      <table class="finance-table">
        <tbody>
          <tr v-for="(stat, index) in financialPlan" :key="index">
            <th>{{ stat.title }}</th>
            <td>{{ formatCurrency(stat.value) }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section>
      <h3>{{ $t('projectComponents.contentDetailsView.tabs.Zeitplan') }}</h3>
      <div v-html="sanitizeHtml(timeline)"></div>
    </section>

    <section>
      <h3>{{ $t('projectComponents.contentDetailsView.tabs.Uploads') }}</h3>
      <div v-html="sanitizeHtml(documentation)"></div>
      <ul v-if="files.length">
        <li v-for="(file, index) in files" :key="index">{{ file.name }}</li>
      </ul>
    </section>

    <section v-if="links.length">
      <h3>{{ $t('projectComponents.contentDetailsView.tabs.Links') }}</h3>
      <ul>
        <li v-for="(link, index) in links" :key="index">{{ link.title }}: {{ link.link }}</li>
      </ul>
    </section>

    <h2>{{ $t('projectComponents.qAndA.title') }}</h2>
    <div v-if="questions.length">
      <section v-for="(question, index) in questions" :key="index">
        <h3>{{ question.text }}</h3>
        <div v-html="sanitizeHtml(question.answer || $t('projectComponents.qAndA.noAnswer'))"></div>
      </section>
    </div>
    <p v-else>{{ $t('projectComponents.qAndA.noQuestions') }}</p>

    <template v-if="ticket && ticket.responseText">
      <h2>{{ $t('reviewPage.yourResponseLabel') }}</h2>
      <p>{{ ticket.responseText }}</p>
    </template>
  </div>
</template>

<script>
import htmlSanitizer from "src/mixins/htmlSanitizer";

export default {
  name: "ReviewProjectPrint",
  mixins: [htmlSanitizer],
  props: {
    project: {
      type: Object,
      required: true
    },
    ticket: {
      type: Object,
      default: null
    },
    statusText: {
      type: String,
      default: ""
    }
  },
  computed: {
    fundingProgramTitle() {
      return this.project?.fundingGuideline?.[0]?.title || null;
    },
    fundingMatches() {
      return (this.project.fundingMatches || []).filter(funding => !funding.isFehlanzeige);
    },
    startingCondition() {
      return (this.project.details && this.project.details.startingCondition) ||
        this.$t('projectComponents.contentDetailsView.noStartingCondition');
    },
    content() {
      return (this.project.details && this.project.details.content) ||
        this.$t('projectComponents.contentDetailsView.noProjectContent');
    },
    goals() {
      return (this.project.details && this.project.details.goals) ||
        this.$t('projectComponents.contentDetailsView.noProjectGoals');
    },
    valuesAndBenefits() {
      return (this.project.details && this.project.details.valuesAndBenefits) ||
        this.$t('projectComponents.contentDetailsView.noValuesAndBenefits');
    },
    financialPlanText() {
      return (this.project.financialPlan && this.project.financialPlan.description) ||
        this.$t('projectComponents.contentDetailsView.noFinancialPlan');
    },
    financialPlan() {
      if (this.project.financialPlan && this.project.financialPlan.costAndFinance) {
        return this.project.financialPlan.costAndFinance.map(item => ({
          ...item,
          title: this.translateCostTitle(item.title)
        }));
      }
      return [
        { title: this.$t('ProjectDashboard.totalInvestment'), value: "" },
        { title: this.$t('ProjectDashboard.grants'), value: "" },
        { title: this.$t('ProjectDashboard.ownFunds'), value: "" },
        { title: this.$t('ProjectDashboard.thirdPartyFunds'), value: "" }
      ];
    },
    timeline() {
      return (this.project.details && this.project.details.timeline) ||
        this.$t('projectComponents.contentDetailsView.noTimeline');
    },
    documentation() {
      return (this.project.details && this.project.details.uploadDescription) ||
        this.$t('projectComponents.contentDetailsView.noDocumentation');
    },
    files() {
      return this.project.files || [];
    },
    links() {
      return this.project.links || [];
    },
    questions() {
      return this.project.questions || [];
    }
  },
  methods: {
    formatDate(value) {
      return new Date(value).toLocaleDateString("de-DE");
    },
    translateCostTitle(title) {
      const costTitleMap = {
        'Gesamtinvestition': this.$t('ProjectDashboard.totalInvestment'),
        'Fördermittel': this.$t('ProjectDashboard.grants'),
        'Eigenmittel': this.$t('ProjectDashboard.ownFunds'),
        'Drittmittel': this.$t('ProjectDashboard.thirdPartyFunds')
      };
      return costTitleMap[title] || title;
    },
    formatCurrency(value) {
      if (!value || value === '') {
        return this.$t('projectComponents.contentDetailsView.notSpecified');
      }
      const numValue = typeof value === 'string'
        ? parseFloat(value.replace(/[.,]/g, match => match === ',' ? '.' : ''))
        : value;
      if (isNaN(numValue)) {
        return value;
      }
      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(numValue);
    }
  }
};
</script>

<style scoped>
.print-sheet {
  display: none;
}

@media print {
  .print-sheet {
    display: block;
    font-family: Arial, Helvetica, sans-serif;
    color: #000;
  }

  h1 {
    font-size: 20px;
    margin-bottom: 12px;
  }

  h2 {
    font-size: 16px;
    margin-top: 22px;
    border-bottom: 1px solid #999;
    padding-bottom: 4px;
  }

  h3 {
    font-size: 13px;
    margin-bottom: 2px;
  }

  section {
    margin-bottom: 14px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 10px;
  }

  th,
  td {
    text-align: left;
    padding: 4px 8px;
    border: 1px solid #ccc;
    font-size: 12px;
  }

  .meta-table th {
    width: 220px;
    background: #f4f4f4;
  }
}
</style>
