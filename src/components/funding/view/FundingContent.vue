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
                  <p class="font-14 q-mb-none">
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
                <div class="col-12 col-md-8">
                  <div class="row q-col-gutter-y-sm q-col-gutter-x-xl">
                    <div class="col-auto">
                      <p class="font-14 no-margin text-blue-grey-10">
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
                      <p class="font-14 no-margin text-blue-grey-10">{{ $t("Owner") }}</p>
                      <p class="font-16 q-mt-xs q-mb-none text-weight-600 ">
                        {{ (!!funding.owner && funding.owner.username) || "" }}
                      </p>
                    </div>
                    <div class="col-auto">
                      <p class="font-14 no-margin text-blue-grey-10">{{ $t("projectContent.type") }}</p>
                      <p class="font-16 q-mt-xs q-mb-none text-weight-600 ">
                        {{ $t("fundingsColsHome.fundInfo") }}
                      </p>
                    </div>
                    <div class="col-auto">
                      <p class="font-14 no-margin text-blue-grey-10">{{ $t("projectContent.visibility") }}</p>
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
                    <div class="col-auto q-mb-md">
                      <q-btn @click="exportToPdf()" color="blue" unelevated class="radius-6 text-weight-600 q-mr-md"
                        no-caps outline icon="print" aria-label="Print" :loading="watchlistIsLoading"><q-tooltip
                          anchor="top middle" self="bottom middle" :offset="[10, 10]">
                          {{ $t("print") }}
                        </q-tooltip></q-btn>
                      <q-btn @click="addToWatchlist()" color="blue" unelevated class="radius-6 text-weight-600" no-caps
                        outline icon="star_outline" aria-label="Bookmark" :loading="watchlistIsLoading"><q-tooltip
                          anchor="top middle" self="bottom middle" :offset="[10, 10]">
                          {{ $t("bookmark") }}
                        </q-tooltip></q-btn>
                    </div>
                    <div class="col-auto">
                      <q-btn @click="editFunding()" color="blue" unelevated class="radius-6 text-weight-600" no-caps
                        icon="edit" aria-label="Edit" :loading="editIsLoading"><q-tooltip anchor="top middle"
                          self="bottom middle" :offset="[10, 10]">
                          {{ $t("edit") }}
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
                      <p class="font-14 no-margin text-blue-grey-10">
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
                      <p class="font-14 no-margin text-blue-grey-10">{{ $t("Owner") }}</p>
                      <p class="font-16 q-mt-xs q-mb-none text-weight-600 ">
                        {{ (!!funding.owner && funding.owner.username) || "" }}
                      </p>
                    </div>
                    <div class="col-4">
                      <p class="font-14 no-margin text-blue-grey-10">{{ $t("projectContent.type") }}</p>
                      <p class="font-16 q-mt-xs q-mb-none text-weight-600 ">
                        {{ $t("fundingsColsHome.fundInfo") }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="col-4">
                  <div class="row justify-end">
                    <div class="col-auto">
                      <q-btn @click="exportToPdf()" color="blue" unelevated class="radius-6 text-weight-600 q-mr-md"
                        no-caps outline icon="print" aria-label="Print" :loading="watchlistIsLoading"><q-tooltip
                          anchor="top middle" self="bottom middle" :offset="[10, 10]">
                          {{ $t("print") }}
                        </q-tooltip></q-btn>
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
          <h1 class="font-24 text-weight-regular q-my-none" style="line-height: 3rem;">
            {{ funding.title || "" }}
          </h1>
        </div>
      </div>
      <vue-html2pdf :show-layout="false" :float-layout="true" :enable-download="false" :preview-modal="true"
        :paginate-elements-by-height="18000" :pdf-quality="2" :manual-pagination="true" pdf-format="a4"
        pdf-orientation="landscape" pdf-content-width="1100px" autoPaging="text" :htmlToPdfOptions="{
          margin: [0, 5, 0, 5],
          html2canvas: { useCORS: true, scale: 2, letterRendering: true },
          autoPaging: 'text',
          jsPDF: { unit: 'pt', format: 'a4', orientation: 'landscape' },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        }" @hasStartedGeneration="hasStartedGeneration()" @hasGenerated="hasGenerated($event)" ref="html2Pdf">
        <section slot="pdf-content">
          <div class="row">
            <div class="col-12">
              <h4 class="font-24 text-weight-regular q-my-none">
                {{ funding.title || "" }}
              </h4>
            </div>
          </div>
          <div class="row q-col-gutter-lg">
            <div class="col-12 col-md-4">
              <div class="row">
                <div class="col-12 q-mb-md">
                  <q-card class="shadow-1 radius-20">
                    <div v-if="!!funding.title">
                      <q-card-section>
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("projectContent.fundingGuidelines") }}
                        </h4>
                        <div class="q-ml-md font-16">
                          <p class="q-mb-sm">
                            {{ funding.title || "" }}
                          </p>
                        </div>
                      </q-card-section>
                      <q-separator inset class="bg-blue opacity-10" />
                    </div>
                    <div v-if="!!funding.provider">
                      <q-card-section>
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("funding provider") }}
                        </h4>
                        <div class="q-ml-md font-16">
                          <p class="q-mb-sm">
                            {{ funding.provider || "" }}
                          </p>
                        </div>
                      </q-card-section>
                      <q-separator inset class="bg-blue opacity-10" />
                    </div>
                    <div v-if="!!funding.info && funding.info.contactName">
                      <q-card-section>
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("Contact person") }}
                        </h4>
                        <div class="q-ml-md font-16">
                          <p class="q-mb-sm">
                            {{ (!!funding.info && funding.info.contactName) || "" }}
                          </p>
                          <!-- <p class="q-mb-sm">
                            {{
                              (funding.municipality &&
                                funding.municipality.location) ||
                                ""
                            }}
                          </p> -->
                        </div>
                      </q-card-section>
                      <q-separator inset class="bg-blue opacity-10" />
                    </div>
                    <div v-if="
                      (!!funding.info && funding.info.streetNo) ||
                      (!!funding.info && funding.info.postalCode) ||
                      (!!funding.info && funding.info.phone) ||
                      (!!funding.info && funding.info.email)
                    ">
                      <q-card-section>
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("Contact Details") }}
                        </h4>
                        <div class="q-ml-md font-16">
                          <p class="q-mb-sm">
                            {{ (!!funding.info && funding.info.streetNo) || "" }}
                          </p>
                          <p class="q-mb-sm">
                            {{ (!!funding.info && funding.info.postalCode) || "" }}
                          </p>
                          <p class="q-mb-sm">
                            {{ (!!funding.info && funding.info.phone) || "" }}
                          </p>
                          <p class="q-mb-sm text-overflow">
                            {{ (!!funding.info && funding.info.email) || "" }}
                          </p>
                        </div>
                      </q-card-section>
                      <q-separator inset class="bg-blue opacity-10" />
                    </div>
                    <div>
                      <q-card-section v-if="!!funding.info && !!funding.info.location">
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("personalData.location") }}
                        </h4>
                        <div class="q-ml-md font-16">
                          <p class="q-mb-sm">
                            {{ (!!funding.info && funding.info.location) || "" }}
                          </p>
                        </div>
                      </q-card-section>
                      <q-separator inset class="bg-blue opacity-10" />
                    </div>
                    <q-card-section v-if="funding.editors && funding.editors.length > 0">
                      <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                        {{ $t("Invite Editor") }}
                      </h4>
                      <div class="q-ml-md font-16">
                        <div v-if="funding.editors && funding.editors.length > 0">
                          <p v-for="(editor, index) in funding.editors" :key="index" class="q-mb-sm">
                            {{ editor.username }}
                          </p>
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </div>
            <div class="col-12 col-md-8">
              <div class="row">
                <div class="col-12 q-mb-md">
                  <q-card class="shadow-1 radius-20">
                    <q-card-section v-if="funding.media">
                      <q-carousel swipeable animated v-model="slide" infinite class="radius-10" autoplay>
                        <q-carousel-slide class="imageStyling" v-for="(item, index) in funding.media" :key="index"
                          :name="index + 1" :img-src="!item.mime.includes('video')
                              ? `${appUrl}${item.url}`
                              : ''
                            ">
                          <video v-if="item.mime.includes('video')" class="full-width full-height" controls>
                            <source :src="`${appUrl}${item.url}`" type="video/mp4" />
                          </video>
                        </q-carousel-slide>
                      </q-carousel>
                      <div class="row justify-center">
                        <div class="col-9">
                          <q-tabs swipeable v-model="slide" indicator-color="transparent" outside-arrows inline-label
                            mobile-arrows align="center" active-class="opacity-50" class="no-padding q-mt-md"
                            :class="{ carouselThumbnails: $q.screen.gt.sm }">
                            <q-tab :name="index + 1" @click="slide = index + 1" v-for="(item, index) in funding.media"
                              :key="index" class="no-padding q-mx-sm radius-10"
                              content-class="no-padding overflow-hidden">
                              <div class="no-padding radius-10 overflow-hidden" style="width:100px; height:100px">
                                <q-card-section class="no-padding">
                                  <q-img v-if="!item.mime.includes('video')" class="tabStyling"
                                    :src="`${appUrl}${item.url}`" height="100px" width="100px" />
                                  <video v-if="item.mime.includes('video')" class="full-width full-height">
                                    <source :src="`${appUrl}${item.url}`" type="video/mp4" />
                                  </video>
                                </q-card-section>
                              </div>
                            </q-tab>
                          </q-tabs>
                          <p class="q-mt-md q-mb-none font-14 text-center text-grey">
                            {{
                              !!funding.media[slide - 1] &&
                                !!funding.media[slide - 1].caption
                                ? funding.media[slide - 1].caption
                                : ""
                            }}
                          </p>
                        </div>
                      </div>
                    </q-card-section>
                    <q-card-section class="flex flex-center" v-else style="height: 548px">
                      <div>
                        <h6 class="text-grey">{{ $t("No Images") }}</h6>
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
                        <div class="col-12 col-md-4">
                          <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                            {{ $t("statsTable.categories") }}
                          </h4>
                        </div>
                        <div class="col-12 col-md-8">
                          <div class="q-ml-md font-16">
                            <div v-if="
                              funding.categories && funding.categories.length > 0
                            ">
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
                        <div class="col-12 col-md-4">
                          <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                            {{ $t("Tags") }}
                          </h4>
                        </div>
                        <div class="col-12 col-md-8">
                          <div class="q-ml-md font-16">
                            <div v-if="funding.tags && funding.tags.length > 0">
                              <q-chip v-for="(tag, index) in funding.tags" :key="index" square size="16px"
                                color="yellow-10" text-color="blue">
                                {{ tag.title }}
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
                          <div class="col-12 col-md-4">
                            <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                              {{ $t("Funding goal") }}
                            </h4>
                          </div>
                          <div class="col-12 col-md-8">
                            <div class="q-ml-xs">
                              <div class="q-ml-md font-16">
                                <p class="q-mt-sm q-mb-sm text-block" v-html="!!funding.details.goal
                                    ? funding.details.goal
                                    : ''
                                  "></p>
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
                          <div class="col-12 col-md-4">
                            <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                              {{ $t("What is funded?") }}
                            </h4>
                          </div>
                          <div class="col-12 col-md-8">
                            <div class="q-ml-xs">
                              <div class="q-ml-md font-16">
                                <p class="q-mt-sm q-mb-sm text-block" v-html="!!funding.details.funded
                                    ? funding.details.funded
                                    : ''
                                  "></p>
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
                          <div class="col-12 col-md-4">
                            <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                              {{ $t("What is not funded?") }}
                            </h4>
                          </div>
                          <div class="col-12 col-md-8">
                            <div class="q-ml-xs">
                              <div class="q-ml-md font-16">
                                <p class="q-mt-sm q-mb-sm text-block" v-html="!!funding.details.notFunded
                                    ? funding.details.notFunded
                                    : ''
                                  "></p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </q-card-section>
                      <q-separator inset class="bg-blue opacity-10" />
                    </div>
                    <div v-if="!!funding.details.willBeFunded">
                      <q-card-section class="q-pa-md items-start">
                        <div class="row">
                          <div class="col-12 col-md-4">
                            <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                              {{ $t("Who will be funded?") }}
                            </h4>
                          </div>
                          <div class="col-12 col-md-8">
                            <div class="q-ml-xs">
                              <div class="q-ml-md font-16">
                                <p class="q-mt-sm q-mb-sm text-block" v-html="!!funding.details.willBeFunded
                                    ? funding.details.willBeFunded
                                    : ''
                                  "></p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </q-card-section>
                      <q-separator inset class="bg-blue opacity-10" />
                    </div>
                    <q-card-section v-if="!!funding.details.condition" class="q-pa-md items-start">
                      <div class="row">
                        <div class="col-12 col-md-4">
                          <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                            {{ $t("Conditions for Applicants") }}
                          </h4>
                        </div>
                        <div class="col-12 col-md-8">
                          <div class="q-ml-xs">
                            <div class="q-ml-md font-16">
                              <p class="q-mt-sm q-mb-sm text-block" v-html="!!funding.details.condition
                                  ? funding.details.condition
                                  : ''
                                "></p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-12 q-mb-md">
                  <q-card class="shadow-1 radius-20">
                    <div v-if="funding.rates && funding.rates.length > 0">
                      <q-card-section class="q-pa-md items-start">
                        <div class="row">
                          <div class="col-12 col-md-4">
                            <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                              {{ $t("Funding rates") }}
                            </h4>
                          </div>
                          <div class="col-12 col-md-8">
                            <div class="q-ml-xs">
                              <div class="q-ml-md font-16">
                                <div v-if="funding.rates && funding.rates.length > 0">
                                  <div v-for="(rate, index) in funding.rates" :key="index" class="row" :class="$q.screen.gt.sm
                                      ? 'q-col-gutter-x-xl'
                                      : 'q-col-gutter-x-sm'
                                    ">
                                    <div class="col-10 col-md-auto">
                                      <p class="q-mt-sm q-mb-sm inline-block">
                                        {{ rate.content || "" }}
                                      </p>
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
                          <div class="col-12 col-md-4">
                            <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                              {{ $t("Own contribution") }}
                            </h4>
                          </div>
                          <div class="col-12 col-md-8">
                            <div class="q-ml-xs">
                              <div class="q-ml-md font-16">
                                <p class="q-mt-sm q-mb-sm">
                                  {{ funding.ownContribution || "" }}
                                </p>
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
                          <div class="col-12 col-md-4">
                            <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                              {{ $t("Accumulability") }}
                            </h4>
                          </div>
                          <div class="col-12 col-md-8">
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
                        <div class="col-12 col-md-4">
                          <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                            {{ $t("Links to the fundings") }}
                          </h4>
                        </div>
                        <div class="col-12 col-md-8">
                          <div class="q-ml-xs">
                            <div class="q-ml-md font-16">
                              <div v-if="
                                funding.fundingsLinkedTo &&
                                funding.fundingsLinkedTo.length > 0
                              " class="q-gutter-sm">
                                <div v-for="(funding,
                                  index) in funding.fundingsLinkedTo" :key="index" class="row">
                                  <div class="col-auto">
                                    <a class="q-mb-sm text-blue block text-weight-600 cursor-pointer" target="_blank"
                                      rel="noopener noreferrer" @click.prevent="viewFunding(funding.id)">{{
                                      funding.title }}</a>
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

                <div class="col-12 q-mb-md">
                  <q-card class="shadow-1 radius-20">
                    <div v-if="!!funding.assessment">
                      <q-card-section class="q-pa-md items-start">
                        <div class="row">
                          <div class="col-12 col-md-4">
                            <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                              {{ $t("Basis for assessment") }}
                            </h4>
                          </div>
                          <div class="col-12 col-md-8">
                            <div class="q-ml-xs">
                              <div class="q-ml-md font-16">
                                <p class="q-mt-sm q-mb-sm text-block" v-html="!!funding.assessment ? funding.assessment : ''
                                  "></p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </q-card-section>
                      <q-separator inset class="bg-blue opacity-10" />
                    </div>
                    <q-card-section :horizontal="$q.screen.gt.sm" class="q-pa-md items-start">
                      <div class="col-12 col-md-4">
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("Funding Period") }}
                        </h4>
                      </div>
                      <div class="col-12 col-md-8">
                        <div class="q-ml-xs">
                          <div class="q-ml-md font-16">
                            <div class="row">
                              <div class="col-12 col-md-4">
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
                              <div class="col-12 col-md-4">
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
                    </q-card-section>
                    <q-separator inset class="bg-blue opacity-10" />
                    <div v-if="!!funding.notes">
                      <q-card-section class="q-pa-md items-start">
                        <div class="row">
                          <div class="col-12 col-md-4">
                            <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                              {{ $t("Notes to the funding period") }}
                            </h4>
                          </div>
                          <div class="col-12 col-md-8">
                            <div class="q-ml-xs">
                              <div class="q-ml-md font-16">
                                <p class="q-mt-sm q-mb-sm">
                                  {{ funding.notes || "" }}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </q-card-section>
                      <q-separator inset class="bg-blue opacity-10" />
                    </div>
                    <div v-if="funding.links && funding.links.length > 0">
                      <q-card-section class="q-pa-md items-start">
                        <div class="row">
                          <div class="col-12 col-md-4">
                            <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                              {{ $t("projectContent.links") }}
                            </h4>
                          </div>
                          <div class="col-12 col-md-8">
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
                                      <a class="q-mb-sm text-blue block text-weight-600" target="_blank"
                                        rel="noopener noreferrer" :href="link.link
                                            .split('://')[0]
                                            .substring(0, 5) === 'https'
                                            ? link.link
                                            : link.link
                                              .split('://')[0]
                                              .substring(0, 4) === 'http'
                                              ? link.link
                                              : `http://${link.link}`
                                          ">{{ link.link }}</a>
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
                    <q-card-section v-if="funding.files && funding.files.length > 0" class="q-pa-md items-start">
                      <div class="row">
                        <div class="col-12 col-md-4">
                          <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                            Uploads
                          </h4>
                        </div>
                        <div class="col-12 col-md-8">
                          <div class="q-ml-xs">
                            <div class="q-ml-md font-16">
                              <div v-if="funding.files && funding.files.length > 0">
                                <div v-for="(file, index) in funding.files" :key="index" class="row">
                                  <div class="col-auto">
                                    <a class="q-mb-sm text-blue block text-weight-600" target="_blank"
                                      rel="noopener noreferrer" :href="`${appUrl}${file.url}`">{{ file.name }}</a>
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
                  (funding.projects && funding.projects.length > 0) ||
                  (!!funding.checklist && !!funding.checklist.id)
                " class="col-12 q-mb-md">
                  <q-card class="shadow-1 radius-20">
                    <q-card-section class="q-pa-md items-start">
                      <div class="row">
                        <div class="col-12 col-md-4">
                          <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                            {{ $t("projectContent.projectContent") }}
                          </h4>
                        </div>
                        <div class="col-12 col-md-8">
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
                                      rel="noopener noreferrer" @click.prevent="viewProject(project.id)">{{
                                      project.title }}</a>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div v-if="!!funding.checklist && !!funding.checklist.id" class="q-ml-md font-16">
                              <div class="row">
                                <p class="q-mt-sm q-mb-xs">
                                  {{ $t("Statistics.implementationChecklist") }}
                                </p>
                              </div>
                              <div v-if="!!funding.checklist && !!funding.checklist.id">
                                <div class="row">
                                  <div class="col-auto">
                                    <a class="q-mb-sm text-blue block text-weight-600 cursor-pointer" target="_blank"
                                      rel="noopener noreferrer" @click.prevent="
                                        viewChecklist(funding.checklist.id)
                                        ">{{ funding.checklist.title }}</a>
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
        </section>
      </vue-html2pdf>



      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-4">
          <div class="row">
            <div class="col-12 q-mb-md">
              <q-card class="shadow-1 radius-20">
                <div v-if="!!funding.title">
                  <q-card-section>
                    <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                      {{ $t("projectContent.fundingGuidelines") }}
                    </h4>
                    <div class="q-ml-md font-16">
                      <p class="q-mb-sm">
                        {{ funding.title || "" }}
                      </p>
                    </div>
                  </q-card-section>
                  <q-separator inset class="bg-blue opacity-10" />
                </div>
                <div v-if="!!funding.provider">
                  <q-card-section>
                    <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                      {{ $t("funding provider") }}
                    </h4>
                    <div class="q-ml-md font-16">
                      <p class="q-mb-sm">
                        {{ funding.provider || "" }}
                      </p>
                    </div>
                  </q-card-section>
                  <q-separator inset class="bg-blue opacity-10" />
                </div>
                <div v-if="!!funding.info && funding.info.contactName">
                  <q-card-section>
                    <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                      {{ $t("Contact person") }}
                    </h4>
                    <div class="q-ml-md font-16">
                      <p class="q-mb-sm">
                        {{ (!!funding.info && funding.info.contactName) || "" }}
                      </p>
                      <!-- <p class="q-mb-sm">
                        {{
                          (funding.municipality &&
                            funding.municipality.location) ||
                            ""
                        }}
                      </p> -->
                    </div>
                  </q-card-section>
                  <q-separator inset class="bg-blue opacity-10" />
                </div>
                <div v-if="
                  (!!funding.info && funding.info.streetNo) ||
                  (!!funding.info && funding.info.postalCode) ||
                  (!!funding.info && funding.info.phone) ||
                  (!!funding.info && funding.info.email)
                ">
                  <q-card-section>
                    <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                      {{ $t("Contact Details") }}
                    </h4>
                    <div class="q-ml-md font-16">
                      <p class="q-mb-sm">
                        {{ (!!funding.info && funding.info.streetNo) || "" }}
                      </p>
                      <p class="q-mb-sm">
                        {{ (!!funding.info && funding.info.postalCode) || "" }}
                      </p>
                      <p class="q-mb-sm">
                        {{ (!!funding.info && funding.info.phone) || "" }}
                      </p>
                      <p class="q-mb-sm text-overflow">
                        {{ (!!funding.info && funding.info.email) || "" }}
                      </p>
                    </div>
                  </q-card-section>
                  <q-separator inset class="bg-blue opacity-10" />
                </div>
                <div>
                  <q-card-section v-if="!!funding.info && !!funding.info.location">
                    <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                      {{ $t("personalData.location") }}
                    </h4>
                    <div class="q-ml-md font-16">
                      <p class="q-mb-sm">
                        {{ (!!funding.info && funding.info.location) || "" }}
                      </p>
                    </div>
                  </q-card-section>
                  <q-separator inset class="bg-blue opacity-10" />
                </div>
                <q-card-section v-if="funding.editors && funding.editors.length > 0">
                  <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                    {{ $t("Invite Editor") }}
                  </h4>
                  <div class="q-ml-md font-16">
                    <div v-if="funding.editors && funding.editors.length > 0">
                      <p v-for="(editor, index) in funding.editors" :key="index" class="q-mb-sm">
                        {{ editor.username }}
                      </p>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-8">
          <div class="row">
            <div class="col-12 q-mb-md">
              <q-card class="shadow-1 radius-20">
                <q-card-section v-if="funding.media">
                  <q-carousel swipeable animated v-model="slide" infinite class="radius-10" autoplay>
                    <q-carousel-slide class="imageStyling" v-for="(item, index) in funding.media" :key="index"
                      :name="index + 1" :img-src="!item.mime.includes('video')
                          ? `${appUrl}${item.url}`
                          : ''
                        ">
                      <video v-if="item.mime.includes('video')" class="full-width full-height" controls>
                        <source :src="`${appUrl}${item.url}`" type="video/mp4" />
                      </video>
                    </q-carousel-slide>
                  </q-carousel>
                  <div class="row justify-center">
                    <div class="col-9">
                      <q-tabs swipeable v-model="slide" indicator-color="transparent" outside-arrows inline-label
                        mobile-arrows align="center" active-class="opacity-50" class="no-padding q-mt-md"
                        :class="{ carouselThumbnails: $q.screen.gt.sm }">
                        <q-tab :name="index + 1" @click="slide = index + 1" v-for="(item, index) in funding.media"
                          :key="index" class="no-padding q-mx-sm radius-10" content-class="no-padding overflow-hidden">
                          <div class="no-padding radius-10 overflow-hidden" style="width:100px; height:100px">
                            <q-card-section class="no-padding">
                              <q-img v-if="!item.mime.includes('video')" class="tabStyling"
                                :src="`${appUrl}${item.url}`" height="100px" width="100px" />
                              <video v-if="item.mime.includes('video')" class="full-width full-height">
                                <source :src="`${appUrl}${item.url}`" type="video/mp4" />
                              </video>
                            </q-card-section>
                          </div>
                        </q-tab>
                      </q-tabs>
                      <p class="q-mt-md q-mb-none font-14 text-center text-grey">
                        {{
                          !!funding.media[slide - 1] &&
                            !!funding.media[slide - 1].caption
                            ? funding.media[slide - 1].caption
                            : ""
                        }}
                      </p>
                    </div>
                  </div>
                </q-card-section>
                <q-card-section class="flex flex-center" v-else style="height: 548px">
                  <div>
                    <h6 class="text-grey">{{ $t("No Images") }}</h6>
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
                    <div class="col-12 col-md-4">
                      <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                        {{ $t("statsTable.categories") }}
                      </h4>
                    </div>
                    <div class="col-12 col-md-8">
                      <div class="q-ml-md font-16">
                        <div v-if="
                          funding.categories && funding.categories.length > 0
                        ">
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
                    <div class="col-12 col-md-4">
                      <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                        {{ $t("Tags") }}
                      </h4>
                    </div>
                    <div class="col-12 col-md-8">
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
                      <div class="col-12 col-md-4">
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("Funding goal") }}
                        </h4>
                      </div>
                      <div class="col-12 col-md-8">
                        <div class="q-ml-xs">
                          <div class="q-ml-md font-16">
                            <p class="q-mt-sm q-mb-sm text-block" v-html="!!funding.details.goal
                                ? funding.details.goal
                                : ''
                              "></p>
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
                      <div class="col-12 col-md-4">
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("What is funded?") }}
                        </h4>
                      </div>
                      <div class="col-12 col-md-8">
                        <div class="q-ml-xs">
                          <div class="q-ml-md font-16">
                            <p class="q-mt-sm q-mb-sm text-block" v-html="!!funding.details.funded
                                ? funding.details.funded
                                : ''
                              "></p>
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
                      <div class="col-12 col-md-4">
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("What is not funded?") }}
                        </h4>
                      </div>
                      <div class="col-12 col-md-8">
                        <div class="q-ml-xs">
                          <div class="q-ml-md font-16">
                            <p class="q-mt-sm q-mb-sm text-block" v-html="!!funding.details.notFunded
                                ? funding.details.notFunded
                                : ''
                              "></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                  <q-separator inset class="bg-blue opacity-10" />
                </div>
                <div v-if="!!funding.details.willBeFunded">
                  <q-card-section class="q-pa-md items-start">
                    <div class="row">
                      <div class="col-12 col-md-4">
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("Who will be funded?") }}
                        </h4>
                      </div>
                      <div class="col-12 col-md-8">
                        <div class="q-ml-xs">
                          <div class="q-ml-md font-16">
                            <p class="q-mt-sm q-mb-sm text-block" v-html="!!funding.details.willBeFunded
                                ? funding.details.willBeFunded
                                : ''
                              "></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                  <q-separator inset class="bg-blue opacity-10" />
                </div>
                <q-card-section v-if="!!funding.details.condition" class="q-pa-md items-start">
                  <div class="row">
                    <div class="col-12 col-md-4">
                      <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                        {{ $t("Conditions for Applicants") }}
                      </h4>
                    </div>
                    <div class="col-12 col-md-8">
                      <div class="q-ml-xs">
                        <div class="q-ml-md font-16">
                          <p class="q-mt-sm q-mb-sm text-block" v-html="!!funding.details.condition
                              ? funding.details.condition
                              : ''
                            "></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 q-mb-md">
              <q-card class="shadow-1 radius-20">
                <div v-if="funding.rates && funding.rates.length > 0">
                  <q-card-section class="q-pa-md items-start">
                    <div class="row">
                      <div class="col-12 col-md-4">
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("Funding rates") }}
                        </h4>
                      </div>
                      <div class="col-12 col-md-8">
                        <div class="q-ml-xs">
                          <div class="q-ml-md font-16">
                            <div v-if="funding.rates && funding.rates.length > 0">
                              <div v-for="(rate, index) in funding.rates" :key="index" class="row" :class="$q.screen.gt.sm
                                  ? 'q-col-gutter-x-xl'
                                  : 'q-col-gutter-x-sm'
                                ">
                                <div class="col-10 col-md-auto">
                                  <p class="q-mt-sm q-mb-sm inline-block">
                                    {{ rate.content || "" }}
                                  </p>
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
                      <div class="col-12 col-md-4">
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("Own contribution") }}
                        </h4>
                      </div>
                      <div class="col-12 col-md-8">
                        <div class="q-ml-xs">
                          <div class="q-ml-md font-16">
                            <p class="q-mt-sm q-mb-sm">
                              {{ funding.ownContribution || "" }}
                            </p>
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
                      <div class="col-12 col-md-4">
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("Accumulability") }}
                        </h4>
                      </div>
                      <div class="col-12 col-md-8">
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
                    <div class="col-12 col-md-4">
                      <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                        {{ $t("Links to the fundings") }}
                      </h4>
                    </div>
                    <div class="col-12 col-md-8">
                      <div class="q-ml-xs">
                        <div class="q-ml-md font-16">
                          <div v-if="
                            funding.fundingsLinkedTo &&
                            funding.fundingsLinkedTo.length > 0
                          " class="q-gutter-sm">
                            <div v-for="(funding,
                              index) in funding.fundingsLinkedTo" :key="index" class="row">
                              <div class="col-auto">
                                <a class="q-mb-sm text-blue block text-weight-600 cursor-pointer" target="_blank"
                                  rel="noopener noreferrer" @click.prevent="viewFunding(funding.id)">{{ funding.title
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

            <div class="col-12 q-mb-md">
              <q-card class="shadow-1 radius-20">
                <div v-if="!!funding.assessment">
                  <q-card-section class="q-pa-md items-start">
                    <div class="row">
                      <div class="col-12 col-md-4">
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("Basis for assessment") }}
                        </h4>
                      </div>
                      <div class="col-12 col-md-8">
                        <div class="q-ml-xs">
                          <div class="q-ml-md font-16">
                            <p class="q-mt-sm q-mb-sm text-block" v-html="!!funding.assessment ? funding.assessment : ''
                              "></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                  <q-separator inset class="bg-blue opacity-10" />
                </div>
                <q-card-section :horizontal="$q.screen.gt.sm" class="q-pa-md items-start">
                  <div class="col-12 col-md-4">
                    <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                      {{ $t("Funding Period") }}
                    </h4>
                  </div>
                  <div class="col-12 col-md-8">
                    <div class="q-ml-xs">
                      <div class="q-ml-md font-16">
                        <div class="row">
                          <div class="col-12 col-md-4">
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
                          <div class="col-12 col-md-4">
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
                </q-card-section>
                <q-separator inset class="bg-blue opacity-10" />
                <div v-if="!!funding.notes">
                  <q-card-section class="q-pa-md items-start">
                    <div class="row">
                      <div class="col-12 col-md-4">
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("Notes to the funding period") }}
                        </h4>
                      </div>
                      <div class="col-12 col-md-8">
                        <div class="q-ml-xs">
                          <div class="q-ml-md font-16">
                            <p class="q-mt-sm q-mb-sm">
                              {{ funding.notes || "" }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </q-card-section>
                  <q-separator inset class="bg-blue opacity-10" />
                </div>
                <div v-if="funding.links && funding.links.length > 0">
                  <q-card-section class="q-pa-md items-start">
                    <div class="row">
                      <div class="col-12 col-md-4">
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("projectContent.links") }}
                        </h4>
                      </div>
                      <div class="col-12 col-md-8">
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
                                  <a class="q-mb-sm text-blue block text-weight-600" target="_blank"
                                    rel="noopener noreferrer" :href="link.link
                                        .split('://')[0]
                                        .substring(0, 5) === 'https'
                                        ? link.link
                                        : link.link
                                          .split('://')[0]
                                          .substring(0, 4) === 'http'
                                          ? link.link
                                          : `http://${link.link}`
                                      ">{{ link.link }}</a>
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
                <q-card-section v-if="funding.files && funding.files.length > 0" class="q-pa-md items-start">
                  <div class="row">
                    <div class="col-12 col-md-4">
                      <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                        Uploads
                      </h4>
                    </div>
                    <div class="col-12 col-md-8">
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
              (funding.projects && funding.projects.length > 0) ||
              (!!funding.checklist && !!funding.checklist.id)
            " class="col-12 q-mb-md">
              <q-card class="shadow-1 radius-20">
                <q-card-section class="q-pa-md items-start">
                  <div class="row">
                    <div class="col-12 col-md-4">
                      <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                        {{ $t("projectContent.projectContent") }}
                      </h4>
                    </div>
                    <div class="col-12 col-md-8">
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
                        <div v-if="!!funding.checklist && !!funding.checklist.id" class="q-ml-md font-16">
                          <div class="row">
                            <p class="q-mt-sm q-mb-xs">
                              {{ $t("Statistics.implementationChecklist") }}
                            </p>
                          </div>
                          <div v-if="!!funding.checklist && !!funding.checklist.id">
                            <div class="row">
                              <div class="col-auto">
                                <a class="q-mb-sm text-blue block text-weight-600 cursor-pointer" target="_blank"
                                  rel="noopener noreferrer" @click.prevent="
                                    viewChecklist(funding.checklist.id)
                                    ">{{ funding.checklist.title }}</a>
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
export default {
  name: "FundingView",
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
    async viewChecklist(id) {
      if (!!id) {
        this.$router.push({ path: `/user/newChecklist/${id}` });
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
      this.$refs.html2Pdf.generatePdf();
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
</style>
