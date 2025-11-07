<template>
  <div class="funding-print-template" style="page-break-inside: avoid;">
    <div class="print-header" style="page-break-inside: avoid; page-break-after: avoid;">
      <h4 class="font-24 text-weight-regular q-my-none" style="page-break-inside: avoid; page-break-after: avoid;"
        v-html="sanitizeHtml(funding.title || '')"></h4>
    </div>

    <div class="print-content">
      <!-- Basic Information Section -->
      <div class="print-section avoid-page-break" style="page-break-inside: avoid; margin-bottom: 16px;">
        <q-card class="shadow-1 radius-20" style="page-break-inside: avoid;">
          <div v-if="!!funding.title" style="page-break-inside: avoid;">
            <q-card-section style="page-break-inside: avoid;">
              <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none" style="page-break-after: avoid;">
                {{ $t("projectContent.fundingGuidelines") }}
              </h4>
              <div class="q-ml-md font-16">
                <p class="q-mb-sm" style="page-break-inside: avoid;" v-html="sanitizeHtml(funding.title || '')"></p>
              </div>
            </q-card-section>
            <q-separator inset class="bg-blue opacity-10" />
          </div>

          <div v-if="!!funding.provider" style="page-break-inside: avoid;">
            <q-card-section style="page-break-inside: avoid;">
              <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none" style="page-break-after: avoid;">
                {{ $t("funding provider") }}
              </h4>
              <div class="q-ml-md font-16">
                <p class="q-mb-sm" style="page-break-inside: avoid;" v-html="sanitizeHtml(funding.provider || '')"></p>
              </div>
            </q-card-section>
            <q-separator inset class="bg-blue opacity-10" />
          </div>

          <div v-if="!!funding.info && funding.info.contactName" style="page-break-inside: avoid;">
            <q-card-section style="page-break-inside: avoid;">
              <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none" style="page-break-after: avoid;">
                {{ $t("Contact person") }}
              </h4>
              <div class="q-ml-md font-16">
                <p class="q-mb-sm" style="page-break-inside: avoid;"
                  v-html="sanitizeHtml((funding.info?.contactName) || '')"></p>
              </div>
            </q-card-section>
            <q-separator inset class="bg-blue opacity-10" />
          </div>

          <div v-if="
            (!!funding.info && funding.info.streetNo) ||
            (!!funding.info && funding.info.postalCode) ||
            (!!funding.info && funding.info.phone) ||
            (!!funding.info && funding.info.email)
          " style="page-break-inside: avoid;">
            <q-card-section style="page-break-inside: avoid;">
              <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none" style="page-break-after: avoid;">
                {{ $t("Contact Details") }}
              </h4>
              <p class="q-ml-md font-16 q-mb-sm" style="page-break-inside: avoid;" v-if="funding.info?.streetNo"
                v-html="sanitizeHtml(funding.info.streetNo)"></p>
              <p class="q-ml-md font-16 q-mb-sm" style="page-break-inside: avoid;" v-if="funding.info?.postalCode"
                v-html="sanitizeHtml(funding.info.postalCode)"></p>
              <p class="q-ml-md font-16 q-mb-sm" style="page-break-inside: avoid;" v-if="funding.info?.phone"
                v-html="sanitizeHtml(funding.info.phone)"></p>
              <p class="q-ml-md font-16 q-mb-sm text-overflow" style="page-break-inside: avoid;"
                v-if="funding.info?.email" v-html="sanitizeHtml(funding.info.email)"></p>
            </q-card-section>
            <q-separator inset class="bg-blue opacity-10" />
          </div>

          <!-- Location field hidden - can be re-enabled if needed -->
          <!-- <div v-if="!!funding.info && !!funding.info.location" style="page-break-inside: avoid;">
            <q-card-section style="page-break-inside: avoid;">
              <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none" style="page-break-after: avoid;">
                {{ $t("personalData.location") }}
              </h4>
              <p class="q-ml-md font-16 q-mb-sm" style="page-break-inside: avoid;"
                v-html="sanitizeHtml(funding.info.location)"></p>
            </q-card-section>
            <q-separator inset class="bg-blue opacity-10" />
          </div> -->

          <q-card-section v-if="funding.editors && funding.editors.length > 0 && isAdmin"
            style="page-break-inside: avoid;">
            <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none" style="page-break-after: avoid;">
              {{ $t("Invite Editor") }}
            </h4>
            <div class="q-ml-md font-16">
              <p v-for="(editor, index) in funding.editors" :key="index" class="q-mb-sm"
                style="page-break-inside: avoid;">
                {{ editor.username }}
              </p>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Categories and Tags Section -->
      <div class="print-section avoid-page-break">
        <q-card class="shadow-1 radius-20">
          <q-card-section class="q-pa-md">
            <div class="row">
              <div class="col-12 col-md-3">
                <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                  {{ $t("statsTable.categories") }}
                </h4>
              </div>
              <div class="col-12 col-md-9">
                <div class="q-ml-md font-16">
                  <div v-if="funding.categories && funding.categories.length > 0">
                    <q-chip v-for="(category, index) in funding.categories" :key="index" square size="16px"
                      color="yellow-10" text-color="blue">
                      {{ category.title }}
                    </q-chip>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
          <q-separator inset class="bg-blue opacity-10" />
          <q-card-section class="q-pa-md">
            <div class="row">
              <div class="col-12 col-md-3">
                <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                  {{ $t("Tags") }}
                </h4>
              </div>
              <div class="col-12 col-md-9">
                <div class="q-ml-md font-16">
                  <div v-if="funding.tags && funding.tags.length > 0">
                    <q-chip v-for="(tag, index) in funding.tags" :key="index" square size="16px" color="yellow-10"
                      text-color="blue">
                      {{ tag.title }}
                    </q-chip>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Funding Details Section -->
      <div v-if="
        (!!funding.details && funding.details.goal) ||
        (!!funding.details && funding.details.funded) ||
        (!!funding.details && funding.details.notFunded) ||
        (!!funding.details && funding.details.willBeFunded) ||
        (!!funding.details && funding.details.condition)
      " class="print-section page-break-before" style="page-break-before: always; margin-top: 16px;">
        <q-card class="shadow-1 radius-20" style="page-break-inside: avoid;">
          <div v-if="!!funding.details.goal" class="avoid-page-break">
            <q-card-section class="q-pa-md items-start">
              <div class="row">
                <div class="col-12 col-md-3">
                  <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                    {{ $t("Funding goal") }}
                  </h4>
                </div>
                <div class="col-12 col-md-9">
                  <div class="q-ml-xs">
                    <div class="q-ml-md font-16">
                      <p class="q-mt-sm q-mb-sm text-block" v-html="sanitizeHtml(funding.details?.goal || '')"></p>
                    </div>
                  </div>
                </div>
              </div>
            </q-card-section>
            <q-separator inset class="bg-blue opacity-10" />
          </div>

          <div v-if="!!funding.details.funded" class="avoid-page-break">
            <q-card-section class="q-pa-md items-start">
              <div class="row">
                <div class="col-12 col-md-3">
                  <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                    {{ $t("What is funded?") }}
                  </h4>
                </div>
                <div class="col-12 col-md-9">
                  <div class="q-ml-xs">
                    <div class="q-ml-md font-16">
                      <p class="q-mt-sm q-mb-sm text-block" v-html="sanitizeHtml(funding.details?.funded || '')"></p>
                    </div>
                  </div>
                </div>
              </div>
            </q-card-section>
            <q-separator inset class="bg-blue opacity-10" />
          </div>

          <div v-if="!!funding.details.notFunded" class="avoid-page-break">
            <q-card-section class="q-pa-md items-start">
              <div class="row">
                <div class="col-12 col-md-3">
                  <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                    {{ $t("What is not funded?") }}
                  </h4>
                </div>
                <div class="col-12 col-md-9">
                  <div class="q-ml-xs">
                    <div class="q-ml-md font-16">
                      <p class="q-mt-sm q-mb-sm text-block" v-html="sanitizeHtml(funding.details?.notFunded || '')"></p>
                    </div>
                  </div>
                </div>
              </div>
            </q-card-section>
            <q-separator inset class="bg-blue opacity-10" />
          </div>

          <div v-if="!!funding.details.willBeFunded" class="avoid-page-break">
            <q-card-section class="q-pa-md items-start">
              <div class="row">
                <div class="col-12 col-md-3">
                  <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                    {{ $t("Who will be funded?") }}
                  </h4>
                </div>
                <div class="col-12 col-md-9">
                  <div class="q-ml-xs">
                    <div class="q-ml-md font-16">
                      <p class="q-mt-sm q-mb-sm text-block" v-html="sanitizeHtml(funding.details?.willBeFunded || '')">
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </q-card-section>
            <q-separator inset class="bg-blue opacity-10" />
          </div>

          <div v-if="!!funding.details.condition" class="avoid-page-break">
            <q-card-section class="q-pa-md items-start">
              <div class="row">
                <div class="col-12 col-md-3">
                  <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                    {{ $t("Conditions for Applicants") }}
                  </h4>
                </div>
                <div class="col-12 col-md-9">
                  <div class="q-ml-xs">
                    <div class="q-ml-md font-16">
                      <p class="q-mt-sm q-mb-sm text-block" v-html="sanitizeHtml(funding.details?.condition || '')"></p>
                    </div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </div>
        </q-card>
      </div>

      <!-- Funding Rates Section -->
      <div class="print-section page-break-before" style="page-break-before: always; margin-top: 16px;">
        <q-card class="shadow-1 radius-20" style="page-break-inside: avoid;">
          <div v-if="funding.rates && funding.rates.length > 0">
            <q-card-section class="q-pa-md items-start">
              <div class="row">
                <div class="col-12 col-md-3">
                  <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                    {{ $t("Funding rates") }}
                  </h4>
                </div>
                <div class="col-12 col-md-9">
                  <div class="q-ml-xs">
                    <div class="q-ml-md font-16">
                      <div v-if="funding.rates && funding.rates.length > 0">
                        <div v-for="(rate, index) in funding.rates" :key="index" class="row q-col-gutter-x-xl">
                          <div class="col-10 col-md-auto">
                            <p class="q-mt-sm q-mb-sm inline-block" v-html="sanitizeHtml(rate.content || '')"></p>
                          </div>
                          <div class="col-auto col-md-auto">
                            <p class="q-mt-sm q-mb-sm inline-block">
                              {{ rate.amount || "" }}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </q-card-section>
            <q-separator inset class="bg-blue opacity-10" />
          </div>

          <div v-if="!!funding.ownContribution">
            <q-card-section class="q-pa-md items-start">
              <div class="row">
                <div class="col-12 col-md-3">
                  <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                    {{ $t("Own contribution") }}
                  </h4>
                </div>
                <div class="col-12 col-md-9">
                  <div class="q-ml-xs">
                    <div class="q-ml-md font-16">
                      <p class="q-mt-sm q-mb-sm" v-html="sanitizeHtml(funding.ownContribution || '')"></p>
                    </div>
                  </div>
                </div>
              </div>
            </q-card-section>
            <q-separator inset class="bg-blue opacity-10" />
          </div>

          <div>
            <q-card-section class="q-pa-md items-start">
              <div class="row">
                <div class="col-12 col-md-3">
                  <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                    {{ $t("Accumulability") }}
                  </h4>
                </div>
                <div class="col-12 col-md-9">
                  <div class="q-ml-xs">
                    <div class="q-ml-md font-16">
                      <p class="q-mt-sm q-mb-sm">
                        {{
                          funding.accumulability === true
                            ? $t("Yes")
                            : $t("No") || "Accumulability is not set"
                        }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </q-card-section>
            <q-separator inset class="bg-blue opacity-10" />
          </div>

          <q-card-section v-if="
            funding.accumulability === true &&
            funding.fundingsLinkedTo &&
            funding.fundingsLinkedTo.length > 0
          " class="q-pa-md items-baseline">
            <div class="row items-center">
              <div class="col-12 col-md-3">
                <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                  {{ $t("Links to the fundings") }}
                </h4>
              </div>
              <div class="col-12 col-md-9">
                <div class="q-ml-xs">
                  <div class="q-ml-md font-16">
                    <div v-if="funding.fundingsLinkedTo && funding.fundingsLinkedTo.length > 0" class="q-gutter-sm">
                      <div v-for="(linkedFunding, index) in funding.fundingsLinkedTo" :key="index" class="row">
                        <div class="col-auto">
                          <span class="q-mb-sm text-blue block text-weight-600">{{ linkedFunding.title }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Assessment and Period Section -->
      <div class="print-section page-break-before" style="page-break-before: always; margin-top: 16px;">
        <q-card class="shadow-1 radius-20" style="page-break-inside: avoid;">
          <div v-if="!!funding.assessment" class="avoid-page-break">
            <q-card-section class="q-pa-md items-start">
              <div class="row">
                <div class="col-12 col-md-3">
                  <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                    {{ $t("Basis for assessment") }}
                  </h4>
                </div>
                <div class="col-12 col-md-9">
                  <div class="q-ml-xs">
                    <div class="q-ml-md font-16">
                      <p class="q-mt-sm q-mb-sm text-block" v-html="sanitizeHtml(funding.assessment || '')"></p>
                    </div>
                  </div>
                </div>
              </div>
            </q-card-section>
            <q-separator inset class="bg-blue opacity-10" />
          </div>

          <q-card-section class="q-pa-md items-start avoid-page-break">
            <div class="row">
              <div class="col-12 col-md-3">
                <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                  {{ $t("Funding Period") }}
                </h4>
              </div>
              <div class="col-12 col-md-9">
                <div class="q-ml-xs">
                  <div class="q-ml-md font-16">
                    <div class="row">
                      <div class="col-12 col-md-3">
                        <p class="q-mt-sm q-mb-sm inline-block">
                          {{ $t("fundingsCol.start") }}
                        </p>
                      </div>
                      <div class="col-12 col-md-auto">
                        <p class="q-mt-sm q-mb-sm inline-block">
                          {{ dateFormatter(funding.plannedStart) || "" }}
                        </p>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-12 col-md-3">
                        <p class="q-mt-sm q-mb-sm inline-block">
                          {{ $t("fundingsCol.end") }}
                        </p>
                      </div>
                      <div class="col-12 col-md-auto">
                        <p class="q-mt-sm q-mb-sm inline-block">
                          {{ dateFormatter(funding.plannedEnd) || "" }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
          <q-separator inset class="bg-blue opacity-10" />

          <div v-if="!!funding.notes" class="avoid-page-break">
            <q-card-section class="q-pa-md items-start">
              <div class="row">
                <div class="col-12 col-md-3">
                  <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                    {{ $t("Notes to the funding period") }}
                  </h4>
                </div>
                <div class="col-12 col-md-9">
                  <div class="q-ml-xs">
                    <div class="q-ml-md font-16">
                      <p class="q-mt-sm q-mb-sm" v-html="sanitizeHtml(funding.notes || '')"></p>
                    </div>
                  </div>
                </div>
              </div>
            </q-card-section>
            <q-separator inset class="bg-blue opacity-10" />
          </div>

          <div v-if="funding.links && funding.links.length > 0" class="avoid-page-break">
            <q-card-section class="q-pa-md items-start">
              <div class="row">
                <div class="col-12 col-md-3">
                  <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                    {{ $t("projectContent.links") }}
                  </h4>
                </div>
                <div class="col-12 col-md-9">
                  <div class="q-ml-xs">
                    <div class="q-ml-md font-16">
                      <div v-if="funding.links && funding.links.length > 0">
                        <div v-for="(link, index) in funding.links" :key="index" class="row">
                          <div class="col-12">
                            <p class="q-mt-sm q-mb-xs inline-block">
                              {{ link.title || "" }}
                            </p>
                          </div>
                          <div class="col-auto">
                            <span class="q-mb-sm text-blue block text-weight-600">{{ link.link }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </q-card-section>
            <q-separator inset class="bg-blue opacity-10" />
          </div>

          <q-card-section v-if="funding.files && funding.files.length > 0" class="q-pa-md items-start avoid-page-break">
            <div class="row">
              <div class="col-12 col-md-3">
                <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                  Uploads
                </h4>
              </div>
              <div class="col-12 col-md-9">
                <div class="q-ml-xs">
                  <div class="q-ml-md font-16">
                    <div v-if="funding.files && funding.files.length > 0">
                      <div v-for="(file, index) in funding.files" :key="index" class="row">
                        <div class="col-auto">
                          <span class="q-mb-sm text-blue block text-weight-600">{{ file.name }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Projects Section -->
      <div v-if="funding.projects && funding.projects.length > 0" class="print-section page-break-before"
        style="page-break-before: always; margin-top: 16px;">
        <q-card class="shadow-1 radius-20" style="page-break-inside: avoid;">
          <q-card-section class="q-pa-md items-start">
            <div class="row">
              <div class="col-12 col-md-3">
                <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                  {{ $t("projectContent.projectContent") }}
                </h4>
              </div>
              <div class="col-12 col-md-9">
                <div class="q-ml-xs">
                  <div v-if="funding.projects && funding.projects.length > 0" class="q-ml-md font-16">
                    <div class="row">
                      <p class="q-mt-sm q-mb-xs">
                        {{ $t("Statistics.projectIdeas") }}
                      </p>
                    </div>
                    <div v-if="funding.projects && funding.projects.length > 0">
                      <div class="row" v-for="(project, index) in funding.projects" :key="index">
                        <div class="col-auto">
                          <span class="q-mb-sm text-blue block text-weight-600">{{ project.title }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
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
  background: white;
  padding: 20px;
}

.print-header {
  margin-bottom: 20px;
}

.print-content {
  width: 100%;
}

.print-section {
  margin-bottom: 15px;
}

/* Page break handling for better PDF generation */
.avoid-page-break {
  page-break-inside: avoid !important;
  break-inside: avoid !important;
  display: block;
}

.text-block {
  white-space: pre-line;
  word-wrap: break-word;
  page-break-inside: avoid !important;
  break-inside: avoid !important;
}

/* Ensure all text elements have proper spacing to avoid breaks */
h1,
h2,
h3,
h4,
h5,
h6 {
  page-break-after: avoid !important;
  break-after: avoid !important;
  page-break-inside: avoid !important;
  break-inside: avoid !important;
  page-break-before: auto;
  break-before: auto;
}

h4 {
  margin-bottom: 8px;
  margin-top: 8px;
}

p {
  orphans: 4;
  widows: 4;
  page-break-inside: avoid !important;
  break-inside: avoid !important;
  margin-bottom: 8px;
  line-height: 1.5;
}

div {
  page-break-inside: avoid;
  break-inside: avoid;
}

.q-card {
  page-break-inside: avoid !important;
  break-inside: avoid !important;
  margin-bottom: 16px;
}

.q-card-section {
  page-break-inside: avoid !important;
  break-inside: avoid !important;
  padding: 12px 16px;
}

.row {
  page-break-inside: avoid !important;
  break-inside: avoid !important;
}

/* Print-specific styles */
@media print {
  .funding-print-template {
    padding: 0;
  }

  * {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  .avoid-page-break {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    display: block !important;
  }

  .page-break-before {
    page-break-before: always !important;
    break-before: page !important;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    page-break-after: avoid !important;
    break-after: avoid !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  p,
  ul,
  ol,
  div,
  span,
  li {
    orphans: 4;
    widows: 4;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  .q-card,
  .q-card-section {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  .row {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  .q-chip {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    display: inline-block !important;
  }

  table,
  thead,
  tbody,
  tr,
  td,
  th {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }
}
</style>
