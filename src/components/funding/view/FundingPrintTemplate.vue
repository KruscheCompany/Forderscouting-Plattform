<template>
  <div class="funding-print-template">
    <!-- Header with Title -->
    <div class="print-header">
      <h1 class="document-title">
        {{ funding.title || 'Richtlinie für die Gewährung von Zuwendungen' }}
      </h1>
    </div>

    <!-- Main Content -->
    <div class="print-content">

      <!-- Fördermittelgeber & Ansprechpartner (Two Column) -->
      <div class="info-row">
        <div class="info-column">
          <h3 class="section-label">{{ $t("funding provider") }}</h3>
          <div class="section-content" v-if="funding.provider" v-html="sanitizeHtml(funding.provider)"></div>
        </div>
        <div class="info-column">
          <h3 class="section-label">{{ $t("Contact person") }}</h3>
          <div class="section-content" v-if="funding.info?.contactFirstName || funding.info?.contactLastName"
            v-html="sanitizeHtml([funding.info?.contactFirstName, funding.info?.contactLastName].filter(Boolean).join(' '))">
          </div>
        </div>
      </div>

      <!-- Kontaktdaten -->
      <div v-if="hasContactData" class="print-section">
        <h3 class="section-label">{{ $t("Contact Details") }}</h3>
        <div class="section-content">
          <p v-if="funding.info?.streetNo" class="contact-line" v-html="sanitizeHtml(funding.info.streetNo)"></p>
          <p v-if="funding.info?.postalCode" class="contact-line" v-html="sanitizeHtml(funding.info.postalCode)"></p>
          <p v-if="funding.info?.phone" class="contact-line" v-html="sanitizeHtml(funding.info.phone)"></p>
          <p v-if="funding.info?.email" class="contact-line" v-html="sanitizeHtml(funding.info.email)"></p>
        </div>
      </div>

      <!-- Ziel der Förderung -->
      <div v-if="funding.details?.goal" class="print-section">
        <h3 class="section-label">{{ $t("Funding goal") }}</h3>
        <div class="section-content formatted-text" v-html="sanitizeHtml(funding.details.goal)"></div>
      </div>

      <!-- Fördergegenstand -->
      <div v-if="funding.details?.funded" class="print-section">
        <h3 class="section-label">{{ $t("What is funded?") }}</h3>
        <div class="section-content formatted-text" v-html="sanitizeHtml(funding.details.funded)"></div>
      </div>

      <!-- Förderfähige Ausgaben -->
      <div v-if="funding.details?.notFunded" class="print-section">
        <h3 class="section-label">{{ $t("What is not funded?") }}</h3>
        <div class="section-content formatted-text" v-html="sanitizeHtml(funding.details.notFunded)"></div>
      </div>

      <!-- Ausschlusskriterien -->
      <div v-if="funding.details?.condition" class="print-section page-break">
        <h3 class="section-label">{{ $t("Conditions for Applicants") }}</h3>
        <div class="section-content formatted-text" v-html="sanitizeHtml(funding.details.condition)"></div>
      </div>

      <!-- Zuwendungsempfänger -->
      <div v-if="funding.details?.willBeFunded" class="print-section">
        <h3 class="section-label">{{ $t("Who will be funded?") }}</h3>
        <div class="section-content formatted-text" v-html="sanitizeHtml(funding.details.willBeFunded)"></div>
      </div>

      <!-- Voraussetzungen -->
      <div v-if="funding.assessment" class="print-section">
        <h3 class="section-label">{{ $t("Basis for assessment") }}</h3>
        <div class="section-content formatted-text" v-html="sanitizeHtml(funding.assessment)"></div>
      </div>

      <!-- Fördersätze -->
      <div v-if="hasRatesData" class="print-section page-break">
        <h3 class="section-label">{{ $t("Funding rates") }}</h3>
        <div class="rates-table">
          <div class="rates-row rates-header">
            <div class="rate-label">Projektförderung bis zu</div>
            <div class="rate-percentage">Eigenanteil</div>
            <div class="rate-accumulation">Kumulierbarkeit</div>
          </div>
          <div v-for="(rate, index) in funding.rates" :key="index" class="rates-row">
            <div class="rate-label">{{ rate.content || 'Projektförderung bis zu' }}</div>
            <div class="rate-percentage">{{ rate.amount || '0' }}%</div>
            <div class="rate-accumulation">{{ funding.accumulability ? $t('Yes') : $t('No') }}</div>
          </div>
        </div>
      </div>

      <!-- Programmlaufzeit -->
      <div v-if="funding.plannedStart || funding.plannedEnd" class="print-section">
        <h3 class="section-label">{{ $t("Funding Period") }}</h3>
        <div class="program-dates">
          <div class="date-row">
            <span class="date-label">{{ $t("fundingsCol.start") }}</span>
            <span class="date-value">{{ dateFormatter(funding.plannedStart) }}</span>
          </div>
          <div class="date-row">
            <span class="date-label">{{ $t("fundingsCol.end") }}</span>
            <span class="date-value">{{ dateFormatter(funding.plannedEnd) }}</span>
          </div>
        </div>
      </div>

      <!-- Weitere Informationen -->
      <div v-if="funding.notes || (funding.links && funding.links.length > 0)" class="print-section page-break">
        <h3 class="section-label">{{ $t("Notes to the funding period") }}</h3>
        <div class="section-content">
          <div v-if="funding.notes" class="formatted-text q-mb-md" v-html="sanitizeHtml(funding.notes)"></div>

          <!-- Links -->
          <div v-if="funding.links && funding.links.length > 0">
            <div v-for="(link, index) in funding.links" :key="index" class="link-item">
              <div class="link-title">{{ link.title }}</div>
              <a :href="link.link" class="link-url text-blue">{{ link.link }}</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Categories and Tags (Optional - can be hidden for cleaner print) -->
      <div v-if="showCategoriesAndTags && (hasCategoriesOrTags)" class="print-section">
        <div v-if="funding.categories && funding.categories.length > 0" class="q-mb-md">
          <h4 class="subsection-label">{{ $t("statsTable.categories") }}</h4>
          <div class="tags-container">
            <span v-for="(category, index) in funding.categories" :key="index" class="tag">
              {{ category.title }}
            </span>
          </div>
        </div>
        <div v-if="funding.tags && funding.tags.length > 0">
          <h4 class="subsection-label">{{ $t("Tags") }}</h4>
          <div class="tags-container">
            <span v-for="(tag, index) in funding.tags" :key="index" class="tag">
              {{ tag.title }}
            </span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { dateFormatter } from "src/boot/dateFormatter";
import htmlSanitizer from "src/mixins/htmlSanitizer.js";

export default {
  name: "FundingPrintTemplate",
  mixins: [htmlSanitizer],
  props: {
    funding: {
      type: Object,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    showCategoriesAndTags: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    hasContactData() {
      return !!(
        this.funding.info?.streetNo ||
        this.funding.info?.postalCode ||
        this.funding.info?.phone ||
        this.funding.info?.email
      );
    },
    hasRatesData() {
      return this.funding.rates && this.funding.rates.length > 0;
    },
    hasCategoriesOrTags() {
      return (
        (this.funding.categories && this.funding.categories.length > 0) ||
        (this.funding.tags && this.funding.tags.length > 0)
      );
    }
  },
  methods: {
    dateFormatter
  }
};
</script>

<style lang="scss" scoped>
.funding-print-template {
  width: 100%;
  max-width: 210mm;
  margin: 0 auto;
  background: white;
  padding: 20mm 15mm;
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: 11pt;
  line-height: 1.6;
  color: #000;
}

.print-header {
  margin-bottom: 30px;
  page-break-after: avoid;
}

.document-title {
  font-size: 18pt;
  font-weight: 400;
  line-height: 1.4;
  margin: 20px 0 30px 0;
  color: #000;
  page-break-after: avoid;
}

.info-row {
  display: flex;
  gap: 40px;
  margin-bottom: 25px;
  page-break-inside: avoid;
}

.info-column {
  flex: 1;
  page-break-inside: avoid;
}

.section-label {
  font-size: 10pt;
  font-weight: 400;
  color: #666;
  margin: 0 0 8px 0;
  font-style: italic;
  page-break-after: avoid;
}

.subsection-label {
  font-size: 10pt;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  page-break-after: avoid;
}

.section-content {
  font-size: 11pt;
  color: #000;
  margin-bottom: 5px;
  page-break-inside: avoid;
}

.contact-line {
  margin: 2px 0;
  page-break-inside: avoid;
}

.print-section {
  margin-bottom: 20px;
  page-break-inside: avoid;
}

.page-break {
  page-break-before: auto;
}

.formatted-text {
  white-space: pre-line;
  word-wrap: break-word;

  ::v-deep ul,
  ::v-deep ol {
    margin: 10px 0;
    padding-left: 25px;
  }

  ::v-deep li {
    margin: 5px 0;
    page-break-inside: avoid;
  }

  ::v-deep p {
    margin: 8px 0;
  }

  ::v-deep strong {
    font-weight: 600;
  }
}

// Rates Table
.rates-table {
  width: 100%;
  margin-top: 10px;
  page-break-inside: avoid;
}

.rates-row {
  display: flex;
  border-bottom: 1px solid #ddd;
  padding: 8px 0;
  page-break-inside: avoid;
}

.rates-header {
  font-weight: 600;
  border-bottom: 2px solid #333;
}

.rate-label {
  flex: 2;
}

.rate-percentage {
  flex: 0.8;
  text-align: center;
}

.rate-accumulation {
  flex: 1;
  text-align: center;
}

// Program Dates
.program-dates {
  display: flex;
  gap: 60px;
  margin-top: 10px;
  page-break-inside: avoid;
}

.date-row {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.date-label {
  font-size: 10pt;
  color: #666;
  font-style: italic;
}

.date-value {
  font-size: 11pt;
  color: #000;
}

// Links
.link-item {
  margin-bottom: 10px;
  page-break-inside: avoid;
}

.link-title {
  font-weight: 500;
  margin-bottom: 2px;
}

.link-url {
  font-size: 10pt;
  word-break: break-all;
}

// Tags
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.tag {
  display: inline-block;
  padding: 4px 12px;
  background-color: #f0f0f0;
  border-radius: 4px;
  font-size: 9pt;
  color: #333;
}

/* Print-specific styles */
@media print {
  .funding-print-template {
    padding: 0;
    max-width: 100%;
  }

  .document-title {
    page-break-after: avoid;
  }

  .print-section {
    page-break-inside: avoid;
  }

  .info-row,
  .info-column {
    page-break-inside: avoid;
  }

  .page-break {
    page-break-before: auto;
  }

  h1,
  h2,
  h3,
  h4 {
    page-break-after: avoid;
  }

  .rates-table,
  .rates-row {
    page-break-inside: avoid;
  }

  .program-dates,
  .date-row {
    page-break-inside: avoid;
  }

  .link-item {
    page-break-inside: avoid;
  }

  a {
    color: #0066cc;
    text-decoration: none;
  }
}
</style>
