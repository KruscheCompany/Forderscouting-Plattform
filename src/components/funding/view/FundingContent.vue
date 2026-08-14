<template>
  <div>
    <div v-if="!!funding" :class="!isDashboardView ? 'container' : ''">
      <div class="row">
        <div v-if="!isDashboardView" class="col-12">
          <q-btn @click="$router.go(-1)" color="back" align="left" flat no-caps>
            <q-icon name="chevron_left" color="primary" class="on-left" />
            Back
          </q-btn>
        </div>
        <div class="col-12" v-if="isAdmin && !!funding.requests && funding.requests.length > 0">
          <div v-for="request in funding.requests" :key="request.id" class="row">
            <q-card class="col-12 shadow-1 radius-20 q-mb-md q-pa-none">
              <q-card-section class="row items-center">
                <q-icon name="description" size="md" color="blue-5" class="q-mr-sm" />
                <div class="col">
                  <p class="font-16 text-weight-600 q-mb-none">
                    {{ !!request.user && request.user.username }}
                    {{ $t("would like to access document") }}
                  </p>
                  <p class="font-16 q-mb-none">
                    {{ !!request.funding && request.funding.title }}
                  </p>
                </div>
                <div class="text-right">
                  <q-btn @click="handleRequest(true, request.id)" color="blue" unelevated
                    class="radius-6 q-ml-md text-weight-600" no-caps>
                    <p class="q-mb-none q-mx-xl q-my-sm">
                      {{ $t("notificationsUser.acceptBtn") }}
                    </p>
                  </q-btn>
                  <q-btn @click="handleRequest(false, request.id)" color="red" unelevated
                    class="radius-6 q-ml-md text-weight-600" no-caps>
                    <p class="q-mb-none q-mx-xl q-my-sm">
                      {{ $t("notificationsUser.declineBtn") }}
                    </p>
                  </q-btn>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <div v-if="isAdmin" class="col-12">
          <div class="row">
            <q-card class="col-12 shadow-1 radius-20 q-mb-none q-pa-none">
              <q-card-section class="row items-center justify-between q-pa-md q-col-gutter-sm">
                <div class="col-12 col-md-8 col-lg-9 col-xl-10">
                  <div class="row q-col-gutter-y-sm q-col-gutter-x-xl">
                    <div class="col-auto">
                      <p class="font-16 no-margin text-blue-grey-10">
                        Erstelldatum
                      </p>
                      <p class="font-16 q-mt-xs q-mb-none text-weight-600 ">
                        {{
                          (!!funding.createdAt &&
                            dateFormatter(funding.createdAt)) ||
                          ""
                        }}
                      </p>
                    </div>
                    <div class="col-auto">
                      <p class="font-16 no-margin text-blue-grey-10">{{ $t("Owner") }}</p>
                      <p class="font-16 q-mt-xs q-mb-none text-weight-600 ">
                        {{ (!!funding.owner && funding.owner.username) || "" }}
                      </p>
                    </div>
                    <div class="col-auto">
                      <p class="font-16 no-margin text-blue-grey-10">{{ $t("projectContent.type") }}</p>
                      <p class="font-16 q-mt-xs q-mb-none text-weight-600 ">
                        {{ $t("fundingsColsHome.fundInfo") }}
                      </p>
                    </div>
                    <div class="col-auto">
                      <p class="font-16 no-margin text-blue-grey-10">{{ $t("projectContent.visibility") }}</p>
                      <p class="font-16 q-mt-xs q-mb-none text-weight-600 ">
                        {{
                          funding.visibility === "only for me"
                            ? $t("visibility.onlyMe")
                            : funding.visibility === "all users"
                              ? $t("visibility.allUsers")
                              : funding.visibility === "listed only"
                                ? $t("visibility.listedOnly")
                                : ""
                        }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-auto" v-if="!!funding && !funding.archived || isAdmin">
                  <div :class="$q.screen.gt.sm
                    ? 'q-col-gutter-x-md'
                    : 'q-col-gutter-x-xs q-mt-md'
                    " class="row justify-between">
                    <div class="col-auto">
                      <q-btn @click="editFunding()" color="yellow" unelevated class="radius-6 text-weight-600" no-caps
                        icon="edit" aria-label="Edit" :loading="editIsLoading" text-color="blue"><q-tooltip
                          anchor="top middle" self="bottom middle" :offset="[10, 10]">
                          {{ $t("edit") }}
                        </q-tooltip></q-btn>
                    </div>
                    <div class="col-auto q-mb-md">
                      <q-btn-dropdown color="blue" unelevated class="radius-6 text-weight-600 q-mr-md" no-caps outline
                        icon="print" aria-label="Print" :loading="pdfIsLoading">
                        <q-list>
                          <q-item clickable v-close-popup @click="exportToPdf()">
                            <q-item-section avatar>
                              <q-icon name="picture_as_pdf" color="blue" />
                            </q-item-section>
                            <q-item-section>
                              <q-item-label>{{ $t("Export as PDF") }}</q-item-label>
                              <q-item-label caption>{{ $t("Generate and download PDF") }}</q-item-label>
                            </q-item-section>
                          </q-item>
                          <q-item clickable v-close-popup @click="printWithBrowser()">
                            <q-item-section avatar>
                              <q-icon name="print" color="blue" />
                            </q-item-section>
                            <q-item-section>
                              <q-item-label>{{ $t("Browser Print") }}</q-item-label>
                              <q-item-label caption>{{ $t("Perfect page breaks (recommended)") }}</q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                        <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                          {{ $t("print") }}
                        </q-tooltip>
                      </q-btn-dropdown>
                      <q-btn @click="addToWatchlist()" color="blue" unelevated class="radius-6 text-weight-600" no-caps
                        outline icon="star_outline" aria-label="Bookmark" :loading="watchlistIsLoading"><q-tooltip
                          anchor="top middle" self="bottom middle" :offset="[10, 10]">
                          {{ $t("bookmark") }}
                        </q-tooltip></q-btn>
                    </div>
                    <div class="col-auto">
                      <q-btn @click="archiveFunding()" color="blue" unelevated class="radius-6 text-weight-600" no-caps
                        icon="inventory" aria-label="Archive" :loading="archiveIsLoading">
                        <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                          {{ $t("archive") }}
                        </q-tooltip></q-btn>
                    </div>
                    <div class="col-auto">
                      <q-btn @click="deleteFunding()" color="red" unelevated class="radius-6 text-weight-600" no-caps
                        icon="delete" aria-label="Delete" :loading="deleteIsLoading">
                        <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                          {{ $t("delete") }}
                        </q-tooltip></q-btn>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <div v-if="!isAdmin" class="col-12">
          <div class="row">
            <q-card class="col-12 shadow-1 radius-20 q-mb-none q-pa-none">
              <q-card-section class="row items-center justify-between q-pa-md">
                <div class="col-8">
                  <div class="row">
                    <div class="col-4">
                      <p class="font-16 no-margin text-blue-grey-10">
                        Erstelldatum
                      </p>
                      <p class="font-16 q-mt-xs q-mb-none text-weight-600 ">
                        {{
                          dateFormatter(
                            !!funding.createdAt &&
                            funding.createdAt.split("T"[0])
                          ) || ""
                        }}
                      </p>
                    </div>
                    <div class="col-4">
                      <p class="font-16 no-margin text-blue-grey-10">{{ $t("Owner") }}</p>
                      <p class="font-16 q-mt-xs q-mb-none text-weight-600 ">
                        {{ (!!funding.owner && funding.owner.username) || "" }}
                      </p>
                    </div>
                    <div class="col-4">
                      <p class="font-16 no-margin text-blue-grey-10">{{ $t("projectContent.type") }}</p>
                      <p class="font-16 q-mt-xs q-mb-none text-weight-600 ">
                        {{ $t("fundingsColsHome.fundInfo") }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="col-4">
                  <div class="row justify-end">
                    <div class="col-auto">
                      <q-btn-dropdown color="blue" unelevated class="radius-6 text-weight-600 q-mr-md" no-caps outline
                        icon="print" aria-label="Print" :loading="pdfIsLoading">
                        <q-list>
                          <q-item clickable v-close-popup @click="exportToPdf()">
                            <q-item-section avatar>
                              <q-icon name="picture_as_pdf" color="blue" />
                            </q-item-section>
                            <q-item-section>
                              <q-item-label>{{ $t("Export as PDF") }}</q-item-label>
                              <q-item-label caption>{{ $t("Generate and download PDF") }}</q-item-label>
                            </q-item-section>
                          </q-item>
                          <q-item clickable v-close-popup @click="printWithBrowser()">
                            <q-item-section avatar>
                              <q-icon name="print" color="blue" />
                            </q-item-section>
                            <q-item-section>
                              <q-item-label>{{ $t("Browser Print") }}</q-item-label>
                              <q-item-label caption>{{ $t("Perfect page breaks (recommended)") }}</q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                        <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                          {{ $t("print") }}
                        </q-tooltip>
                      </q-btn-dropdown>
                    </div>
                    <div class="col-auto">
                      <q-btn @click="addToWatchlist()" color="blue" unelevated class="radius-6 q-ml-md text-weight-600"
                        no-caps outline icon="star_outline" aria-label="Bookmark" :loading="watchlistIsLoading" />
                    </div>
                    <div class="col-auto">
                      <q-btn @click="addComment()" color="blue" unelevated class="radius-6 q-ml-md text-weight-600"
                        no-caps icon="comment" aria-label="Comment" :loading="commentIsLoading" />
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <h1 class="font-24 text-weight-regular q-mt-lg q-mb-none" style="line-height: 3rem;"
            v-html="sanitizeHtml(funding.title || '')">
          </h1>
        </div>
      </div>

      <vue-html2pdf :show-layout="false" :float-layout="true" :enable-download="false" :preview-modal="true"
        :paginate-elements-by-height="750" :pdf-quality="2" :manual-pagination="false" pdf-format="a4"
        pdf-orientation="portrait" pdf-content-width="800px" :htmlToPdfOptions="{
          margin: [20, 15, 20, 15],
          html2canvas: {
            useCORS: true,
            scale: 2,
            letterRendering: true,
            scrollY: 0,
            scrollX: 0,
            windowWidth: 800,
            allowTaint: false,
            backgroundColor: '#ffffff'
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: {
            mode: ['css', 'legacy'],
            before: ['.page-break-before'],
            after: ['.page-break-after'],
            avoid: ['div', 'p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', '.avoid-page-break', '.print-section', '.q-card', '.q-card-section', '.row', 'tr', 'td', 'th', 'li', '.q-chip', 'table', 'thead', 'tbody']
          }
        }" @hasStartedGeneration="hasStartedGeneration()" @hasGenerated="hasGenerated($event)" ref="html2Pdf">
        <section slot="pdf-content">
          <FundingPrintTemplate :funding="funding" :isAdmin="isAdmin" />
        </section>
      </vue-html2pdf>

      <div class="row q-col-gutter-lg">
        <div class="col-12">
          <div class="row">
            <div class="col-12 q-mb-md">
              <q-card class="shadow-1 radius-20">

                <!-- Status indicators row -->
                <q-card-section class="q-pa-md q-pb-sm">
                  <div class="row items-center q-gutter-x-sm">
                    <span :style="{
                      width: '12px', height: '12px', borderRadius: '50%', display: 'inline-block',
                      background: funding.applicationEligible ? '#43a047' : '#ef5350'
                    }" />
                    <span
                      :class="funding.applicationEligible ? 'text-positive text-weight-medium ppeditorial' : 'text-negative text-weight-medium ppeditorial'"
                      class="text-caption">
                      {{ $t('applicationEligible') }}
                    </span>
                  </div>
                </q-card-section>

                <q-separator class="bg-blue opacity-10" />

                <!-- Three-column body -->
                <q-card-section class="q-pa-none">
                  <div class="row no-wrap info-card-columns">

                    <!-- Column 1: Provider, Contact person, Editors -->
                    <div class="col q-pa-md info-card-col">
                      <div v-if="!!funding.provider">
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("funding provider") }}
                        </h4>
                        <p class="font-16 text-blue-grey-10 q-mb-sm q-mt-xs"
                          v-html="sanitizeHtml(funding.provider || '')"></p>
                      </div>
                      <div v-if="!!funding.info && (funding.info.contactFirstName || funding.info.contactLastName)">
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-md">
                          {{ $t("Contact person") }}
                        </h4>
                        <p class="font-16 text-blue-grey-10 q-mb-sm q-mt-xs"
                          v-html="sanitizeHtml([funding.info?.contactFirstName, funding.info?.contactLastName].filter(Boolean).join(' '))"></p>
                      </div>
                      <div v-if="funding.editors && funding.editors.length > 0 && isAdmin">
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-md">
                          {{ $t("Invite Editor") }}
                        </h4>
                        <p v-for="(editor, index) in funding.editors" :key="index"
                          class="font-16 text-blue-grey-10 q-mb-xs q-mt-xs">
                          {{ editor.username }}
                        </p>
                      </div>
                    </div>

                    <!-- Column 2: Contact Details -->
                    <div class="col q-pa-md info-card-col">
                      <template v-if="
                        (!!funding.info && funding.info.streetNo) ||
                        (!!funding.info && funding.info.postalCode) ||
                        (!!funding.info && funding.info.phone) ||
                        (!!funding.info && funding.info.email)
                      ">
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("Contact Details") }}
                        </h4>
                        <p v-if="funding.info?.streetNo" class="font-16 text-blue-grey-10 q-mb-xs q-mt-xs"
                          v-html="sanitizeHtml(funding.info.streetNo)"></p>
                        <p v-if="funding.info?.postalCode" class="font-16 text-blue-grey-10 q-mb-xs"
                          v-html="sanitizeHtml(funding.info.postalCode)"></p>
                        <p v-if="funding.info?.phone" class="font-16 text-blue-grey-10 q-mb-xs"
                          v-html="sanitizeHtml(funding.info.phone)">
                        </p>
                        <p v-if="funding.info?.email" class="font-16 text-blue-grey-10 q-mb-xs text-overflow"
                          v-html="sanitizeHtml(funding.info.email)"></p>
                      </template>
                    </div>

                    <!-- Column 3: Funding period + Calls + Additional info -->
                    <div class="col q-pa-md">

                      <div class="row q-col-gutter-lg">
                        <!-- Programmaufzeit -->
                        <div class="col-auto">
                          <h4 class="font-16 text-blue-grey-10 q-mb-sm q-mt-none">
                            {{ $t("Funding Period") }}
                          </h4>
                          <div class="q-mb-sm">
                            <p class="ppeditorial text-caption text-blue-grey-4 q-mb-none">{{ $t("fundingsCol.start") }}
                            </p>
                            <p class="font-16 q-mb-none q-mt-none">{{ dateFormatter(funding.plannedStart) || '—' }}</p>
                          </div>
                          <div>
                            <p class="ppeditorial text-caption text-blue-grey-4 q-mb-none">{{ $t("fundingsCol.end") }}
                            </p>
                            <p v-if="funding.fundingOpen"
                              class="font-16 text-positive text-weight-medium q-mb-none q-mt-none">
                              {{ $t('fundingOpen') }}
                            </p>
                            <p v-else class="font-16 q-mb-none q-mt-none">{{ dateFormatter(funding.plannedEnd) || '—' }}
                            </p>
                          </div>
                        </div>

                        <!-- Förderaufrufe -->
                        <div class="col-auto" v-if="funding.fundingCalls && funding.fundingCalls.length > 0">
                          <h4 class="font-16 text-blue-grey-10 q-mb-sm q-mt-none">
                            {{ $t("fundingCalls.label") }}
                          </h4>
                          <div v-for="(call, idx) in funding.fundingCalls" :key="idx"
                            class="row no-wrap items-baseline q-mb-xs" style="gap: 12px;">
                            <span class="text-weight-medium font-16">{{ call.label }}</span>
                            <span class="font-16 text-blue-grey-6 text-no-wrap">
                              {{ dateFormatter(call.date) }}
                            </span>
                          </div>
                        </div>
                      </div>

                      <!-- Additional Info -->
                      <template v-if="funding.additionalInfo">
                        <q-separator class="bg-blue opacity-10 q-mt-md q-mb-sm" />
                        <p class="font-16 text-blue-grey-8 q-mb-none">
                          {{ funding.additionalInfo }}
                        </p>
                      </template>
                    </div>

                  </div>
                </q-card-section>

              </q-card>
            </div>
          </div>
        </div>

        <!-- Links / Fördernehmende / Rates / Contribution+Accumulability card -->
        <div class="col-12 q-pt-none" v-if="
          (funding.links && funding.links.length > 0) ||
          (funding.details && funding.details.willBeFunded) ||
          (funding.rates && funding.rates.length > 0) ||
          funding.ownContribution ||
          funding.accumulability !== undefined
        ">
          <div class="row">
            <div class="col-12 q-mb-md">
              <q-card class="shadow-1 radius-20">

                <!-- Links -->
                <div v-if="funding.links && funding.links.length > 0">
                  <q-card-section class="q-pa-md items-start">
                    <div class="row">
                      <div class="col-12 col-md-4 col-lg-3 col-xl-2">
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("projectContent.links") }}
                        </h4>
                        <p class="font-16 text-blue-grey-10 q-mb-none q-mt-xs q-pr-md">{{ $t('help.projectLinks') }}</p>
                      </div>
                      <div class="col-12 col-md-8 col-lg-9 col-xl-10">
                        <div class="q-ml-xs">
                          <div class="q-ml-md font-16">
                            <div v-for="(link, index) in funding.links" :key="index" class="row">
                              <div class="col-12">
                                <p class="q-mt-sm q-mb-xs inline-block">{{ link.title || "" }}</p>
                              </div>
                              <div class="col-12">
                                <a class="q-mb-sm text-blue block text-weight-600" target="_blank"
                                  rel="noopener noreferrer" style="overflow-wrap: break-word; word-break: break-all;"
                                  :href="link.link.split('://')[0].substring(0, 5) === 'https'
                                    ? link.link
                                    : link.link.split('://')[0].substring(0, 4) === 'http'
                                      ? link.link
                                      : `http://${link.link}`
                                    ">{{ link.link }}</a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                  <q-separator inset class="bg-blue opacity-10" />
                </div>

                <!-- Fördernehmende -->
                <div v-if="funding.details && !!funding.details.willBeFunded">
                  <q-card-section class="q-pa-md items-start">
                    <div class="row">
                      <div class="col-12 col-md-4 col-lg-3 col-xl-2">
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("Who will be funded?") }}
                        </h4>
                        <p class="font-16 text-blue-grey-10 q-mb-none q-mt-xs q-pr-md">{{ $t('help.whoWillBeFunded') }}
                        </p>
                      </div>
                      <div class="col-12 col-md-8 col-lg-9 col-xl-10">
                        <div class="q-ml-xs">
                          <div class="q-ml-md font-16">
                            <p class="q-mt-sm q-mb-sm text-block"
                              v-html="sanitizeHtml(funding.details.willBeFunded || '')"></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                  <q-separator inset class="bg-blue opacity-10" />
                </div>

                <!-- Funding rates -->
                <div v-if="funding.rates && funding.rates.length > 0">
                  <q-card-section class="q-pa-md items-start">
                    <div class="row">
                      <div class="col-12 col-md-4 col-lg-3 col-xl-2">
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("Funding rates") }}
                        </h4>
                        <p class="font-16 text-blue-grey-10 q-mb-none q-mt-xs q-pr-md">{{ $t('help.fundingRates') }}</p>
                      </div>
                      <div class="col-12 col-md-8 col-lg-9 col-xl-10">
                        <div class="q-ml-xs">
                          <div class="q-ml-md font-16">
                            <div class="rates-grid">
                              <div v-for="(rate, index) in funding.rates" :key="index" class="rates-grid-row">
                                <p class="q-mt-sm q-mb-sm">{{ rate.amount || "" }}%</p>
                                <p class="q-mt-sm q-mb-sm" v-html="sanitizeHtml(rate.content || '')"></p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                  <q-separator inset class="bg-blue opacity-10" />
                </div>

                <!-- Own contribution -->
                <div v-if="!!funding.ownContribution">
                  <q-card-section class="q-pa-md items-start">
                    <div class="row">
                      <div class="col-12 col-md-4 col-lg-3 col-xl-2">
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("Own contribution") }}
                        </h4>
                        <p class="font-16 text-blue-grey-10 q-mb-none q-mt-xs q-pr-md">{{ $t('help.ownContribution') }}
                        </p>
                      </div>
                      <div class="col-12 col-md-8 col-lg-9 col-xl-10">
                        <div class="q-ml-xs">
                          <div class="q-ml-md font-16">
                            <p class="q-mt-sm q-mb-sm"
                              v-html="sanitizeHtml(funding.ownContribution + (funding.ownContribution && !funding.ownContribution.toString().includes('%') ? '%' : '') || '')">
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                  <q-separator inset class="bg-blue opacity-10" />
                </div>

                <!-- Accumulability -->
                <q-card-section class="q-pa-md items-start">
                  <div class="row">
                    <div class="col-12 col-md-4 col-lg-3 col-xl-2">
                      <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                        {{ $t("Accumulability") }}
                      </h4>
                      <p class="font-16 text-blue-grey-10 q-mb-none q-mt-xs q-pr-md">{{ $t('help.accumulability') }}</p>
                    </div>
                    <div class="col-12 col-md-8 col-lg-9 col-xl-10">
                      <div class="q-ml-xs">
                        <div class="q-ml-md font-16">
                          <p class="q-mt-sm q-mb-sm">
                            {{ funding.accumulability === true ? $t("Yes") : $t("No") }}
                          </p>
                          <div
                            v-if="funding.accumulability === true && funding.fundingsLinkedTo && funding.fundingsLinkedTo.length > 0">
                            <p class="font-16 text-blue-grey-10 q-mb-xs">{{ $t("Links to the fundings") }}</p>
                            <div v-for="(linkedFunding, index) in funding.fundingsLinkedTo" :key="index">
                              <a class="q-mb-sm text-blue block text-weight-600 cursor-pointer" target="_blank"
                                rel="noopener noreferrer" @click.prevent="viewFunding(linkedFunding.id)">
                                {{ linkedFunding.title }}
                              </a>
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

        <div class="col-12 q-pt-none">
          <div class="row">
            <div class="col-12 q-mb-md">
              <q-card class="shadow-1 radius-20">
                <q-card-section class="q-pa-md">
                  <div class="row">
                    <div class="col-12 col-md-4 col-lg-3 col-xl-2">
                      <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                        {{ $t("statsTable.categories") }}
                      </h4>
                      <p class="font-16 text-blue-grey-10 q-mb-none q-mt-none q-pr-xl">
                        {{ $t('projectComponents.contentDetails.startingConditionDescription') }}
                      </p>
                    </div>
                    <div class="col-12 col-md-8 col-lg-9 col-xl-10">
                      <div class="q-ml-md font-16">
                        <div v-if="
                          funding.categories && funding.categories.length > 0
                        ">
                          <q-chip v-for="(category, index) in sortedCategories" :key="index" square size="16px"
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
                    <div class="col-12 col-md-4 col-lg-3 col-xl-2">
                      <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                        {{ $t("Tags") }}
                      </h4>
                      <p class="font-16 text-blue-grey-10 q-mb-none q-mt-xs q-pr-md">{{ $t('help.tags') }}</p>
                    </div>
                    <div class="col-12 col-md-8 col-lg-9 col-xl-10">
                      <div class="q-ml-md font-16">
                        <div v-if="funding.tags && funding.tags.length > 0">
                          <q-chip v-for="(tag, index) in sortedTags" :key="index" square size="16px" color="yellow-10"
                            text-color="blue">
                            {{ tag.title }}
                            <q-icon v-if="tag.status === 'pending'" name="hourglass_empty" size="14px" class="q-ml-xs">
                              <q-tooltip>{{ $t("tagsSelector.pendingBadge") }}</q-tooltip>
                            </q-icon>
                          </q-chip>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div v-if="
              (!!funding.details && funding.details.goal) ||
              (!!funding.details && funding.details.funded) ||
              (!!funding.details && funding.details.notFunded) ||
              (!!funding.details && funding.details.willBeFunded) ||
              (!!funding.details && funding.details.condition)
            " class="col-12 q-mb-md">
              <q-card class="shadow-1 radius-20">
                <div v-if="!!funding.details.goal">
                  <q-card-section class="q-pa-md items-start">
                    <div class="row">
                      <div class="col-12 col-md-4 col-lg-3 col-xl-2">
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("Funding goal") }}
                        </h4>
                        <p class="font-16 text-blue-grey-10 q-mb-none q-mt-xs q-pr-md">{{ $t('help.fundingGoal') }}</p>
                      </div>
                      <div class="col-12 col-md-8 col-lg-9 col-xl-10">
                        <div class="q-ml-xs">
                          <div class="q-ml-md font-16">
                            <p class="q-mt-sm q-mb-sm text-block" v-html="sanitizeHtml(funding.details.goal || '')"></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                  <q-separator inset class="bg-blue opacity-10" />
                </div>
                <div v-if="!!funding.details.funded">
                  <q-card-section class="q-pa-md items-start">
                    <div class="row">
                      <div class="col-12 col-md-4 col-lg-3 col-xl-2">
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("What is funded?") }}
                        </h4>
                        <p class="font-16 text-blue-grey-10 q-mb-none q-mt-xs q-pr-md">{{ $t('help.whatIsFunded') }}</p>
                      </div>
                      <div class="col-12 col-md-8 col-lg-9 col-xl-10">
                        <div class="q-ml-xs">
                          <div class="q-ml-md font-16">
                            <p class="q-mt-sm q-mb-sm text-block" v-html="sanitizeHtml(funding.details.funded || '')">
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                  <q-separator inset class="bg-blue opacity-10" />
                </div>
                <div v-if="!!funding.details.notFunded">
                  <q-card-section class="q-pa-md items-start">
                    <div class="row">
                      <div class="col-12 col-md-4 col-lg-3 col-xl-2">
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("What is not funded?") }}
                        </h4>
                        <p class="font-16 text-blue-grey-10 q-mb-none q-mt-xs q-pr-md">{{ $t('help.whatIsNotFunded') }}
                        </p>
                      </div>
                      <div class="col-12 col-md-8 col-lg-9 col-xl-10">
                        <div class="q-ml-xs">
                          <div class="q-ml-md font-16">
                            <p class="q-mt-sm q-mb-sm text-block"
                              v-html="sanitizeHtml(funding.details.notFunded || '')"></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                  <q-separator inset class="bg-blue opacity-10" />
                </div>
                <q-card-section v-if="!!funding.details.condition" class="q-pa-md items-start">
                  <div class="row">
                    <div class="col-12 col-md-4 col-lg-3 col-xl-2">
                      <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                        {{ $t("Conditions for Applicants") }}
                      </h4>
                      <p class="font-16 text-blue-grey-10 q-mb-none q-mt-xs q-pr-md">{{
                        $t('help.conditionsForApplicants') }}
                      </p>
                    </div>
                    <div class="col-12 col-md-8 col-lg-9 col-xl-10">
                      <div class="q-ml-xs">
                        <div class="q-ml-md font-16">
                          <p class="q-mt-sm q-mb-sm text-block" v-html="sanitizeHtml(funding.details.condition || '')">
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 q-mb-md">
              <q-card class="shadow-1 radius-20">
                <div v-if="!!funding.assessment">
                  <q-card-section class="q-pa-md items-start">
                    <div class="row">
                      <div class="col-12 col-md-4 col-lg-3 col-xl-2">
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("Basis for assessment") }}
                        </h4>
                        <p class="font-16 text-blue-grey-10 q-mb-none q-mt-xs q-pr-md">{{ $t('help.basisForAssessment')
                          }}</p>
                      </div>
                      <div class="col-12 col-md-8 col-lg-9 col-xl-10">
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
                <div v-if="!!funding.notes">
                  <q-card-section class="q-pa-md items-start">
                    <div class="row">
                      <div class="col-12 col-md-4 col-lg-3 col-xl-2">
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("Notes to the funding period") }}
                        </h4>
                        <p class="font-16 text-blue-grey-10 q-mb-none q-mt-xs q-pr-md">{{
                          $t('help.notesToFundingPeriod') }}</p>
                      </div>
                      <div class="col-12 col-md-8 col-lg-9 col-xl-10">
                        <div class="q-ml-xs">
                          <div class="q-ml-md font-16">
                            <p class="q-mt-sm q-mb-sm" v-html="sanitizeHtml(funding.notes || '')">
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                  <q-separator inset class="bg-blue opacity-10" />
                </div>
                <q-card-section v-if="funding.files && funding.files.length > 0" class="q-pa-md items-start">
                  <div class="row">
                    <div class="col-12 col-md-4 col-lg-3 col-xl-2">
                      <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                        Uploads
                      </h4>
                      <p class="font-16 text-blue-grey-10 q-mb-none q-mt-xs q-pr-md">{{ $t('help.uploads') }}</p>
                    </div>
                    <div class="col-12 col-md-8 col-lg-9 col-xl-10">
                      <div class="q-ml-xs">
                        <div class="q-ml-md font-16">
                          <div v-if="funding.files && funding.files.length > 0">
                            <div v-for="(file, index) in funding.files" :key="index" class="row">
                              <div>
                                <span @click="handleOpenDocumentPreviewModal(file)"
                                  class="text-blue q-my-sm text-weight-bold cursor-pointer"
                                  style="text-decoration: underline;">{{ file.name }} </span>
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

            <div v-if="
              (funding.projects && funding.projects.length > 0)
            " class="col-12 q-mb-md">
              <q-card class="shadow-1 radius-20">
                <q-card-section class="q-pa-md items-start">
                  <div class="row">
                    <div class="col-12 col-md-4 col-lg-3 col-xl-2">
                      <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                        {{ $t("projectContent.projectContent") }}
                      </h4>
                      <p class="font-16 text-blue-grey-10 q-mb-none q-mt-xs q-pr-md">{{ $t('help.projectContent') }}</p>
                    </div>
                    <div class="col-12 col-md-8 col-lg-9 col-xl-10">
                      <div class="q-ml-xs">
                        <div v-if="funding.projects && funding.projects.length > 0" class="q-ml-md font-16">
                          <div class="row">
                            <p class="q-mt-sm q-mb-xs">
                              {{ $t("Statistics.projectIdeas") }}
                            </p>
                          </div>
                          <div v-if="
                            funding.projects && funding.projects.length > 0
                          ">
                            <div class="row" v-for="(project, index) in funding.projects" :key="index">
                              <div class="col-auto">
                                <a class="q-mb-sm text-blue block text-weight-600 cursor-pointer" target="_blank"
                                  rel="noopener noreferrer" @click.prevent="viewProject(project.id)">{{ project.title
                                  }}</a>
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
      </div>
    </div>
    <DeleteDialog :id="itemId" :tab="tab" :dialogState="deleteDialog"
      @update="closeDeleteDialog($event), (itemId = null)" />
    <ArchiveDialog :id="itemId" :tab="tab" :dialogState="archiveDialog"
      @update="closeArchiveDialog($event), (itemId = null)" />
    <CommentDialog :fundingId="itemId" :dialogState="commentDialog"
      @update="(commentDialog = $event), (commentIsLoading = false)" />
    <q-dialog v-model="openDocumentPreviewModal" full-width>
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
import { dateFormatter } from "src/boot/dateFormatter";
import DeleteDialog from "components/data/DeleteDialog.vue";
import ArchiveDialog from "components/data/ArchiveDialog.vue";
import CommentDialog from "components/funding/view/CommentDialog.vue";
import VueHtml2pdf from "vue-html2pdf";
import FundingPrintTemplate from "./FundingPrintTemplate.vue";
import htmlSanitizer from "src/mixins/htmlSanitizer.js";

export default {
  name: "FundingViewContent",
  mixins: [htmlSanitizer],
  data() {
    return {
      slide: 1,
      itemId: null,
      tab: "fundings",
      deleteDialog: false,
      archiveDialog: false,
      editIsLoading: false,
      deleteIsLoading: false,
      archiveIsLoading: false,
      watchlistIsLoading: false,
      pdfIsLoading: false,
      commentIsLoading: false,
      commentDialog: false,
      openDocumentPreviewModal: false,
      previewDocumentData: null
    };
  },
  components: {
    DeleteDialog,
    ArchiveDialog,
    CommentDialog,
    VueHtml2pdf,
    FundingPrintTemplate,
  },
  watch: {
    $route(to, from) {
      if (
        (to.params && to.params.id) !==
        (this.$store.state.funding.funding &&
          this.$store.state.funding.funding.id)
      ) {
        this.getNewData(to.params.id);
      }
    }
  },
  methods: {
    dateFormatter,
    closeArchiveDialog(val) {
      this.archiveDialog = val;
      if (!!this.funding && this.funding.archived === true) {
        this.$router.go(-1);
      }
    },
    closeDeleteDialog(val) {
      this.deleteDialog = val;
      if (!!this.funding && !this.funding.id) {
        this.$router.go(-1);
      }
    },
    async getData() {
      this.$q.loading.show();
      await this.$store.dispatch("funding/getSpecificFunding", {
        id: Number(this.$route.params.id)
      });
      this.$q.loading.hide();
    },
    async handleOpenDocumentPreviewModal(file) {
      this.openDocumentPreviewModal = true;
      this.previewDocumentData = `https://pdf.foerderscouting-plattform.de/generic/web/viewer_readonly.html?file=${process.env.VUE_APP_MAIN_URL}/api/file/${file.id}?token=${this.$store.state.userCenter.user.jwt}`;
    },
    async handleRequest(val, id) {
      const res = await this.$store.dispatch("userCenter/manageRequest", {
        id,
        val
      });
      this.getData();
    },
    async viewFunding(id) {
      if (
        !!id &&
        id !== (!!this.$route.params && Number(this.$route.params.id))
      ) {
        this.$router.push({ path: `/user/newFunding/${id}` });
      }
    },
    async viewProject(id) {
      if (!!id) {
        this.$router.push({ path: `/application/process/view/${id}` });
      }
    },
    async getNewData(id) {
      if (!!id) {
        this.$q.loading.show();
        await this.$store.dispatch("funding/getSpecificFunding", {
          id: id
        });
        this.$q.loading.hide();
      }
    },
    async addToWatchlist() {
      this.watchlistIsLoading = true;
      const id = !!this.funding && this.funding.id;
      await this.$store.dispatch("funding/addToWatchlist", {
        id: id
      });
      this.watchlistIsLoading = false;
    },
    async editFunding() {
      this.editIsLoading = true;
      const id = !!this.funding && this.funding.id;
      this.$router.push({ path: `/user/newFunding/edit/${id}` });
    },
    async archiveFunding() {
      this.itemId = !!this.funding && this.funding.id;
      this.archiveDialog = true;
    },
    async addComment() {
      this.commentIsLoading = true;
      this.itemId = !!this.funding && this.funding.id;
      this.commentDialog = true;
    },
    async deleteFunding() {
      this.itemId = !!this.funding && this.funding.id;
      this.deleteDialog = true;
    },
    exportToPdf() {
      this.pdfIsLoading = true;
      this.$refs.html2Pdf.generatePdf();
    },
    printWithBrowser() {
      // Store current body content
      const originalContents = document.body.innerHTML;
      const originalTitle = document.title;

      // Get the print template content
      const printContent = document.querySelector('.funding-print-template');

      if (!printContent) {
        this.$store.dispatch("notifications/pushToast", { kind: "negative", title: this.$t('Print content not found') });
        return;
      }

      // Create a temporary container
      const printContainer = document.createElement('div');
      printContainer.innerHTML = printContent.innerHTML;

      // Replace body with print content
      document.body.innerHTML = printContainer.innerHTML;
      document.title = `${this.funding.title || 'Funding'} - PDF`;

      // Add print-specific styles
      const style = document.createElement('style');
      style.innerHTML = `
        @media print {
          body { margin: 0; padding: 0; }
          * { page-break-inside: avoid !important; }
          h1, h2, h3, h4, h5, h6 { page-break-after: avoid !important; }
          .page-break-before { page-break-before: always !important; }
          .q-card { margin-bottom: 16px; page-break-inside: avoid !important; box-shadow: unset !important; }
          .print-section { page-break-inside: avoid !important; }
        }
      `;
      document.head.appendChild(style);

      // Trigger print dialog
      window.print();

      // Restore original content after print dialog closes
      setTimeout(() => {
        document.body.innerHTML = originalContents;
        document.title = originalTitle;
        // Re-initialize Vue (this will cause a page reload, which is necessary)
        window.location.reload();
      }, 100);
    },
    hasStartedGeneration() {
      this.$q.loading.show({ message: this.$t('Generating PDF...') || 'Generating PDF...' });
    },
    hasGenerated(event) {
      this.pdfIsLoading = false;
      this.$q.loading.hide();
      if (event && event.blobUrl) {
        this.$store.dispatch("notifications/pushToast", { kind: "positive", title: this.$t('PDF generated successfully') || 'PDF generated successfully' });
      }
    }
  },
  computed: {
    isAdmin() {
      return this.$store.getters["userCenter/isAdmin"];
    },
    appUrl() {
      return process.env.VUE_APP_MAIN_URL;
    },
    isDashboardView() {
      return (
        this.$router.currentRoute.meta &&
        this.$router.currentRoute.meta.backLink === "/user/data"
      );
    },
    funding() {
      return this.$store.state.funding.funding;
    },
    sortedCategories() {
      if (!this.funding || !this.funding.categories || !this.funding.categories.length) {
        return [];
      }
      return [...this.funding.categories].sort((a, b) => {
        const titleA = (a.title || '').toLowerCase();
        const titleB = (b.title || '').toLowerCase();
        return titleA.localeCompare(titleB);
      });
    },
    sortedTags() {
      if (!this.funding || !this.funding.tags || !this.funding.tags.length) {
        return [];
      }
      return [...this.funding.tags].sort((a, b) => {
        const titleA = (a.title || '').toLowerCase();
        const titleB = (b.title || '').toLowerCase();
        return titleA.localeCompare(titleB);
      });
    }
  },
  mounted() {
    this.getData();
  },
  beforeDestroy() {
    this.$q.loading.hide();
  }
};
</script>

<style lang="scss">
.carouselThumbnails .q-tabs__arrow--end {
  right: -70px;
  color: $blue;
}

.carouselThumbnails .q-tabs__arrow--start {
  left: -70px;
  color: $blue;
}

.imageStyling {
  background-size: contain;
  background-repeat: no-repeat;
}

.tabStyling div.q-img__image {
  background-size: contain !important;
  background-repeat: no-repeat !important;
}

.text-block {
  white-space: pre-line;
}

.info-card-columns {
  >.info-card-col {
    border-right: 1px solid rgba(25, 118, 210, 0.1);
  }

  >.info-card-col:last-of-type {
    border-right: none;
  }
}

@media (max-width: 599px) {
  .info-card-columns {
    flex-wrap: wrap;

    >.col {
      flex: 0 0 100%;
      max-width: 100%;
      border-right: none !important;
      border-bottom: 1px solid rgba(25, 118, 210, 0.1);
    }

    >.col:last-child {
      border-bottom: none;
    }
  }
}

.rates-grid {
  display: grid;
  grid-template-columns: auto auto;
  justify-content: start;
  align-items: center;
  column-gap: 24px;

  .rates-grid-row {
    display: contents;

    p:first-child {
      overflow-wrap: break-word;
      word-break: break-word;
      min-width: 0;
    }
  }
}
</style>
