<template>
  <div>
    <div v-if="!!checklist" :class="!isDashboardView ? 'container' : ''">
      <div class="row">
        <div v-if="!isDashboardView" class="col-12">
          <q-btn @click="$router.go(-1)" color="back" align="left" flat no-caps>
            <q-icon name="chevron_left" color="primary" class="on-left" />
            Back
          </q-btn>
        </div>
        <div
          class="col-12"
          v-if="
            isAdmin && !!checklist.requests && checklist.requests.length > 0
          "
        >
          <div
            v-for="request in checklist.requests"
            :key="request.id"
            class="row"
          >
            <q-card class="col-12 shadow-1 radius-20 q-mb-md q-pa-none">
              <q-card-section class="row items-center">
                <q-icon
                  name="description"
                  size="md"
                  color="blue-5"
                  class="q-mr-sm"
                />
                <div class="col">
                  <p class="font-16 text-weight-600 q-mb-none">
                    {{ !!request.user && request.user.username }}
                    {{ $t("would like to access document") }}
                  </p>
                  <p class="font-14 q-mb-none">
                    {{ !!request.checklist && request.checklist.title }}
                  </p>
                </div>
                <div class="text-right">
                  <q-btn
                    @click="handleRequest(true, request.id)"
                    color="blue"
                    unelevated
                    class="radius-6 q-ml-md text-weight-600"
                    no-caps
                  >
                    <p class="q-mb-none q-mx-xl q-my-sm">
                      {{ $t("notificationsUser.acceptBtn") }}
                    </p>
                  </q-btn>
                  <q-btn
                    @click="handleRequest(false, request.id)"
                    color="red"
                    unelevated
                    class="radius-6 q-ml-md text-weight-600"
                    no-caps
                  >
                    <p class="q-mb-none q-mx-xl q-my-sm">
                      {{ $t("notificationsUser.declineBtn") }}
                    </p>
                  </q-btn>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <div class="col-12">
          <div class="row">
            <q-card class="col-12 shadow-1 radius-20 q-mb-none q-pa-none">
              <q-card-section
                class="row items-center justify-between q-pa-md q-col-gutter-sm"
              >
                <div class="col-12 col-md-auto">
                  <div class="row q-col-gutter-y-sm q-col-gutter-x-xl">
                    <div class="col-auto">
                      <p class="font-14 no-margin text-blue-grey-10">
                        Erstelldatum
                      </p>
                      <p class="font-16 q-mt-xs q-mb-none text-weight-600 ">
                        {{
                          (!!checklist.createdAt &&
                            dateFormatter(checklist.createdAt)) ||
                            ""
                        }}
                      </p>
                    </div>
                    <div class="col-auto">
                      <p class="font-14 no-margin text-blue-grey-10">Besitzer*in</p>
                      <p class="font-16 q-mt-xs q-mb-none text-weight-600 ">
                        {{
                          (!!checklist.owner && checklist.owner.username) || ""
                        }}
                      </p>
                    </div>
                    <div class="col-auto">
                      <p class="font-14 no-margin text-blue-grey-10">Typ</p>
                      <p class="font-16 q-mt-xs q-mb-none text-weight-600 ">
                        Umsetzungscheckliste
                      </p>
                    </div>
                    <div class="col-auto">
                      <p class="font-14 no-margin text-blue-grey-10">Sichtbarkeit</p>
                      <p class="font-16 q-mt-xs q-mb-none text-weight-600 ">
                        {{
                          checklist.visibility === "only for me"
                            ? $t("visibility.onlyMe")
                            : checklist.visibility === "all users"
                            ? $t("visibility.allUsers")
                            : checklist.visibility === "listed only"
                            ? $t("visibility.listedOnly")
                            : ""
                        }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-auto">
                  <div
                    :class="
                      $q.screen.gt.sm
                        ? 'q-col-gutter-x-md'
                        : 'q-col-gutter-x-xs q-mt-md'
                    "
                    class="row"
                  >
                  <div class="col-auto q-mb-md">
                    <q-btn
                      v-if="!!checklist && !!checklist.id && (checklist.owner.id === loggedInUser.id || isAdmin)"
                      @click="transferDocument()"
                      color="blue"
                      unelevated
                      class="radius-6 text-weight-600"
                      no-caps
                      outline
                      icon="send"
                      aria-label="transfer document"
                      ><q-tooltip
                        anchor="top middle"
                        self="bottom middle"
                        :offset="[10, 10]"
                      >
                        {{ $t("transferOwnership") }}
                      </q-tooltip></q-btn
                    >
                  </div>
                  <div class="col-auto q-mb-md">
                      <q-btn
                        @click="exportToPdf()"
                        color="blue"
                        unelevated
                        class="radius-6 text-weight-600"
                        no-caps
                        outline
                        icon="print"
                        aria-label="print document"
                        :loading="watchlistIsLoading"
                        ><q-tooltip
                          anchor="top middle"
                          self="bottom middle"
                          :offset="[10, 10]"
                        >
                          {{ $t("print") }}
                        </q-tooltip></q-btn
                      >
                    </div>
                    <div class="col-auto q-mb-md">
                      <q-btn
                        @click="addToWatchlist()"
                        color="blue"
                        unelevated
                        class="radius-6 text-weight-600"
                        no-caps
                        outline
                        icon="star_outline"
                        aria-label="bookmark document"
                        :loading="watchlistIsLoading"
                        ><q-tooltip
                          anchor="top middle"
                          self="bottom middle"
                          :offset="[10, 10]"
                        >
                          {{ $t("bookmark") }}
                        </q-tooltip></q-btn
                      >
                    </div>
                    <div class="col-auto q-mb-md">
                      <q-btn
                        @click="editChecklist()"
                        color="blue"
                        unelevated
                        class="radius-6 text-weight-600"
                        no-caps
                        icon="edit"
                        aria-label="edit document"
                        :loading="editIsLoading"
                      >
                        <q-tooltip
                          anchor="top middle"
                          self="bottom middle"
                          :offset="[10, 10]"
                        >
                          {{ $t("edit") }}
                        </q-tooltip></q-btn
                      >
                    </div>
                    <div class="col-auto q-mb-md">
                      <q-btn
                        @click="duplicateChecklist()"
                        color="blue"
                        unelevated
                        class="radius-6 text-weight-600"
                        no-caps
                        icon="content_copy"
                        aria-label="duplicate document"
                        :loading="duplicateIsLoading"
                        ><q-tooltip
                          anchor="top middle"
                          self="bottom middle"
                          :offset="[10, 10]"
                        >
                          {{ $t("duplicate") }}
                        </q-tooltip></q-btn
                      >
                    </div>
                    <div
                      v-if="
                        isAdmin ||
                          (!!checklist &&
                            !!checklist.owner &&
                            checklist.owner.id) ===
                            (!!loggedInUser && loggedInUser.id)
                      "
                      class="col-auto q-mb-md"
                    >
                      <q-btn
                        @click="archiveChecklist()"
                        color="blue"
                        unelevated
                        class="radius-6 text-weight-600"
                        no-caps
                        icon="inventory"
                        aria-label="archive document"
                        :loading="archiveIsLoading"
                      >
                        <q-tooltip
                          anchor="top middle"
                          self="bottom middle"
                          :offset="[10, 10]"
                        >
                          {{ $t("archive") }}
                        </q-tooltip></q-btn
                      >
                    </div>
                    <div v-if="isAdmin" class="col-auto q-mb-md">
                      <q-btn
                        @click="deleteChecklist()"
                        color="red"
                        unelevated
                        class="radius-6 text-weight-600"
                        no-caps
                        icon="delete"
                        aria-label="delete document"
                        :loading="deleteIsLoading"
                      >
                        <q-tooltip
                          anchor="top middle"
                          self="bottom middle"
                          :offset="[10, 10]"
                        >
                          {{ $t("delete") }}
                        </q-tooltip></q-btn
                      >
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
        <vue-html2pdf
        :show-layout="false"
        :float-layout="true"
        :enable-download="false"
        :preview-modal="true"
        :paginate-elements-by-height="18000"
        :pdf-quality="2"
        :manual-pagination="false"
        pdf-format="a4"
        pdf-orientation="landscape"
        pdf-content-width="1100px"
        autoPaging="text"
        :htmlToPdfOptions="{
          margin: [0, 5, 0, 5],
          html2canvas: { useCORS: true, scale: 2, letterRendering: true },
          autoPaging: 'text',
          jsPDF: { unit: 'pt', format: 'a4', orientation: 'landscape' },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        }"
        @hasStartedGeneration="hasStartedGeneration()"
        @hasGenerated="hasGenerated($event)"
        @progress="pdfGenerationProgress($event)"
        ref="html2Pdf"
        >
          <section slot="pdf-content" id="print">
            <div class="row">
              <div class="col-12">
                <h4 class="font-24 text-weight-regular q-my-none">
                  {{ checklist.title || "" }}
                </h4>
              </div>
            </div>
            <div class="row q-col-gutter-lg">
              <div class="col-12 col-md-4">
                <div class="row">
                  <div class="col-12 q-mb-md">
                    <q-card class="shadow-1 radius-20">
                      <q-card-section>
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("Idea Provider/giver") }}
                        </h4>
                        <div class="q-ml-md font-16">
                          <p class="q-mb-sm">
                            {{
                              checklist.ideaProvider === "volunteering"
                                ? $t("Volunteering")
                                : $t("Main Office") || ""
                            }}
                          </p>
                        </div>
                      </q-card-section>
                      <q-separator inset class="bg-blue opacity-10" />
                      <q-card-section>
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("Contact person checklist view") }}
                        </h4>
                        <div class="q-ml-md font-16">
                          <p class="q-mb-sm">
                            {{
                              (!!checklist.info && checklist.info.contactName) ||
                                (!!checklist &&
                                  !!checklist.owner &&
                                  checklist.owner.username) ||
                                ""
                            }}
                          </p>
                        </div>
                      </q-card-section>
                      <q-separator inset class="bg-blue opacity-10" />
                      <q-card-section>
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("Contact Details") }}
                        </h4>
                        <div class="q-ml-md font-16">
                          <p class="q-mb-sm">
                            {{ (!!checklist.info && checklist.info.streetNo) || "" }}
                          </p>
                          <p class="q-mb-sm">
                            {{
                              (!!checklist.info && checklist.info.postalCode) || ""
                            }}
                          </p>
                          <p class="q-mb-sm">
                            {{ (!!checklist.info && checklist.info.phone) || "" }}
                          </p>
                          <p class="q-mb-sm text-overflow">
                            {{ (!!checklist.info && checklist.info.email) || "" }}
                          </p>
                          <!-- <p class="q-mb-sm">
                            {{
                              (!!checklist.municipality &&
                                checklist.municipality.location) ||
                                ""
                            }}
                          </p> -->
                        </div>
                      </q-card-section>
                      <q-separator inset class="bg-blue opacity-10" />
                      <div v-if="!!checklist.info && !!checklist.info.location">
                              <q-card-section

                              >
                                <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                                  {{ $t("personalData.location") }}
                                </h4>
                                <div class="q-ml-md font-16">
                                  <p class="q-mb-sm">
                                    {{ (!!checklist.info && checklist.info.location) || "" }}
                                  </p>
                                </div>
                              </q-card-section>
                              <q-separator inset class="bg-blue opacity-10" />
                          </div>
                      <div v-if="checklist.editors && checklist.editors.length > 0" class="html2pdf__page-break">
                        <q-card-section>
                          <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                            {{ $t("Invite Editor") }}
                          </h4>
                          <div class="q-ml-md font-16">
                            <div
                              v-if="checklist.editors && checklist.editors.length > 0"
                            >
                              <p
                                v-for="(editor, index) in checklist.editors"
                                :key="index"
                                class="q-mb-sm"
                              >
                                {{ editor.username }}
                              </p>
                            </div>
                          </div>
                        </q-card-section>
                        <q-separator inset class="bg-blue opacity-10" />
                      </div>
                      <q-card-section
                        v-if="checklist.project && checklist.project.id"
                      >
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("Link for Project Idea") }}
                        </h4>
                        <div class="q-ml-md font-16">
                          <div v-if="checklist.project && checklist.project.id">
                            <a
                              class="q-mb-sm text-blue block text-weight-600 cursor-pointer"
                              target="_blank"
                              rel="noopener noreferrer"
                              @click.prevent="viewProject(checklist.project.id)"
                              >{{ checklist.project.title }}</a
                            >
                          </div>
                          <div v-else>
                            <p class="q-mb-sm"></p>
                          </div>
                        </div>
                      </q-card-section>
                      <div v-if="checklist.duplications > 0">
                        <q-card-section>
                          <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                            {{ $t("projectContent.duplications") }}
                          </h4>
                          <div class="q-ml-md font-16">
                            <p class="q-mb-sm">
                              {{ checklist.duplications }}
                            </p>
                          </div>
                        </q-card-section>
                        <q-separator inset class="bg-blue opacity-10" />
                      </div>
                    </q-card>
                  </div>
                </div>
              </div>
              <div class="col-12 col-md-8">
                <div class="row">
                  <div class="col-12 q-mb-md">
                    <q-card class="shadow-1 radius-20">
                      <q-card-section v-if="checklist.media">
                        <q-carousel
                          swipeable
                          animated
                          v-model="slide"
                          infinite
                          class="radius-10"
                          autoplay
                        >
                          <q-carousel-slide
                            class="imageStyling"
                            v-for="(item, index) in checklist.media"
                            :key="index"
                            :name="index + 1"
                            :img-src="
                              !item.mime.includes('video')
                                ? `${appUrl}${item.url}`
                                : ''
                            "
                          >
                            <video
                              v-if="item.mime.includes('video')"
                              class="full-width full-height"
                              controls
                            >
                              <source
                                :src="`${appUrl}${item.url}`"
                                type="video/mp4"
                              />
                            </video>
                          </q-carousel-slide>
                        </q-carousel>
                        <div class="row justify-center">
                          <div class="col-9">
                            <q-tabs
                              swipeable
                              v-model="slide"
                              indicator-color="transparent"
                              outside-arrows
                              inline-label
                              mobile-arrows
                              align="center"
                              active-class="opacity-50"
                              class="no-padding q-mt-md"
                              :class="{ carouselThumbnails: $q.screen.gt.sm }"
                            >
                              <q-tab
                                :name="index + 1"
                                @click="slide = index + 1"
                                v-for="(item, index) in checklist.media"
                                :key="index"
                                class="no-padding q-mx-sm radius-10"
                                content-class="no-padding overflow-hidden"
                              >
                                <div
                                  class="no-padding radius-10 overflow-hidden"
                                  style="width:100px; height:100px"
                                >
                                  <q-card-section class="no-padding">
                                    <q-img
                                      v-if="!item.mime.includes('video')"
                                      class="tabStyling"
                                      :src="`${appUrl}${item.url}`"
                                      height="100px"
                                      width="100px"
                                    />
                                    <video
                                      v-if="item.mime.includes('video')"
                                      class="full-width full-height"
                                    >
                                      <source
                                        :src="`${appUrl}${item.url}`"
                                        type="video/mp4"
                                      />
                                    </video>
                                  </q-card-section>
                                </div>
                              </q-tab>
                            </q-tabs>
                            <p
                              class="q-mt-md q-mb-none font-14 text-center text-grey"
                            >
                              {{
                                !!checklist.media[slide - 1] &&
                                !!checklist.media[slide - 1].caption
                                  ? checklist.media[slide - 1].caption
                                  : ""
                              }}
                            </p>
                          </div>
                        </div>
                      </q-card-section>
                      <q-card-section
                        class="flex flex-center"
                        v-else
                        style="height: 548px"
                      >
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
                              {{ $t("myData.categories") }}
                            </h4>
                          </div>
                          <div class="col-12 col-md-8">
                            <div class="q-ml-md font-16">
                              <div
                                v-if="
                                  checklist.categories &&
                                    checklist.categories.length > 0
                                "
                              >
                                <q-chip
                                  v-for="(category, index) in checklist.categories"
                                  :key="index"
                                  square
                                  size="16px"
                                  color="yellow-10"
                                  text-color="blue"
                                >
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
                              {{ $t("projectContent.tags") }}
                            </h4>
                          </div>
                          <div class="col-12 col-md-8">
                            <div class="q-ml-md font-16">
                              <div v-if="checklist.tags && checklist.tags.length > 0">
                                <q-chip
                                  v-for="(tag, index) in checklist.tags"
                                  :key="index"
                                  square
                                  size="16px"
                                  color="yellow-10"
                                  text-color="blue"
                                >
                                  {{ tag.title }}
                                </q-chip>
                              </div>
                            </div>
                          </div>
                        </div>
                      </q-card-section>
                      <q-separator inset class="bg-blue opacity-10" />
                      <q-card-section v-if="checklist.project && checklist.project.id">
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("project Idea") }}
                        </h4>
                        <InlineProjectView expandAll :projectID="checklist.project.id" />
                      </q-card-section>
                      <q-separator inset class="bg-blue opacity-10" />
                      <q-card-section v-if="checklist.funding && checklist.funding.id">
                      <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                        {{ $t("Funding") }}
                      </h4>
                      <InlineFundingView expandAll :fundingId="checklist.funding.id" />
                    </q-card-section>
                    </q-card>
                  </div>

                  <div
                    v-if="
                      (!!checklist.initialContact &&
                        !!checklist.initialContact.captureIdea.active) ||
                        (!!checklist.initialContact &&
                          !!checklist.initialContact.caputreContect.active)
                    "
                    class="col-12 q-mb-md"
                  >

                    <q-card
                      class="shadow-1 radius-20"
                      :class="
                        checkProgress(
                          checklist.initialContact.start,
                          checklist.initialContact.end
                        )
                      "
                    >
                      <q-card-section class="q-pa-md items-start q-col-gutter-x-sm">
                        <div class="row">
                          <div class="col-12 col-md-4">
                            <div class="row">
                              <div class="col-12">
                                <h4 class="font-20 text-weight-600 q-mb-xs q-mt-none">
                                  {{ $t("Initial discussion with the politics") }}
                                </h4>
                              </div>
                              <div class="col-12 col-md-4">
                                <p class="q-mb-none font-16">
                                  {{ $t("start") }}
                                </p>
                              </div>
                              <div class="col-12 col-md-8">
                                <p class="q-mb-none font-16">
                                  {{
                                    dateFormatter(
                                      !!checklist.initialContact &&
                                        checklist.initialContact.start
                                    )
                                  }}
                                </p>
                              </div>
                              <div class="col-12 col-md-4">
                                <p class="q-mt-sm q-mb-none font-16">
                                  {{ $t("end") }}
                                </p>
                              </div>
                              <div class="col-12 col-md-8">
                                <p
                                  :class="
                                    $q.screen.gt.sm ? 'q-mt-sm q-mb-none' : 'q-mb-sm'
                                  "
                                  class="font-16"
                                >
                                  {{
                                    dateFormatter(
                                      !!checklist.initialContact &&
                                        checklist.initialContact.end
                                    )
                                  }}
                                </p>
                              </div>
                               <!-- responsiblePerson -->
                               <!-- <div class="col-12">
                                <p class="q-mt-sm q-mb-none font-16">
                                  {{ $t("responsiblePerson") }}
                                </p>
                              </div> -->
                              <!-- <div class="col-12">
                                <p
                                  :class="
                                    $q.screen.gt.sm ? 'q-mb-none' : 'q-mt-sm'
                                  "
                                  class="font-16"
                                >
                                  {{
                                    !!checklist.initialContact &&
                                      checklist.initialContact.responsiblePerson
                                  }}
                                </p>
                              </div> -->
                            </div>
                          </div>
                          <div class="col-12 col-md-8">
                            <div
                              v-for="(card, propertyName) in checklist.initialContact"
                              :key="card.sortPosition"
                            >
                              <div
                                v-if="
                                  (propertyName !== 'end' ||
                                    propertyName !== 'start' ||
                                    propertyName !== 'id') &&
                                    card.active === true
                                "
                              >
                                <div class="q-mb-sm" style="background:#16428B1A">
                                  <div class="q-pa-md font-16">
                                    <div
                                      class="row justify-between items-start q-mb-md"
                                    >
                                      <div>
                                        <p
                                          class="font-18 text-blue text-weight-600 q-ma-none"
                                        >
                                          {{
                                            propertyName === "captureIdea"
                                              ? $t("Capture Project Idea")
                                              : $t("Capture Content")
                                          }}
                                        </p>
                                        <p
                                          v-if="!!card.name"
                                          class="font-14 q-ma-none"
                                        >
                                          {{ card.name || "" }}
                                        </p>
                                      </div>
                                      <div
                                        v-if="
                                          checkProgress(
                                            checklist.initialContact.start,
                                            checklist.initialContact.end
                                          ) !== 'notStarted'
                                        "
                                      >
                                        <q-chip square class="text-weight-600">{{
                                          checkProgress(
                                            checklist.initialContact.start,
                                            checklist.initialContact.end
                                          ) === "done"
                                            ? $t("Done")
                                            : $t("In Progress")
                                        }}</q-chip>
                                      </div>
                                    </div>
                                    <div class="row items-center q-mb-md">
                                      <div
                                        v-if="
                                          propertyName === 'captureIdea' &&
                                            !!card.project &&
                                            card.project.id
                                        "
                                      >
                                        <p class="font-16 text-blue-grey-10 q-ma-none">
                                          {{ $t("Link for Project Idea") }}
                                        </p>
                                        <a
                                          class="q-mb-sm text-blue block text-weight-600 cursor-pointer"
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          @click.prevent="
                                            viewProject(card.project.id)
                                          "
                                          >{{ card.project.title }}</a
                                        >
                                      </div>
                                    </div>
                                    <div
                                      v-if="!!card.text"
                                      class="row items-center q-mb-md"
                                    >
                                      <div>
                                        <p class="font-16 text-blue-grey-10 q-ma-none">
                                          {{ $t("Description") }}
                                        </p>
                                        <p
                                          class="font-16 q-ma-none text-block"
                                          v-html="!!card.text ? card.text : ''"
                                        ></p>
                                      </div>
                                    </div>
                                    <div v-if="propertyName === 'captureIdea'">
                                      <div
                                        v-if="card.file && card.file.length > 0"
                                        class="row items-center q-mb-none"
                                      >
                                        <div
                                          v-for="(file, index) in card.file"
                                          :key="index"
                                          class="col-auto q-mr-md"
                                        >
                                          <a
                                            class="q-mb-md text-blue block text-weight-600"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            :href="`${appUrl}${file.url}`"
                                            >{{ file.name }}</a
                                          >
                                        </div>
                                      </div>
                                    </div>
                                    <div v-if="propertyName === 'caputreContect'">
                                      <div
                                        v-if="card.file && card.file.length > 0"
                                        class="row items-center q-mb-none"
                                      >
                                        <div
                                          v-for="(file, index) in card.file"
                                          :key="index"
                                          class="col-auto q-mr-md"
                                        >
                                          <a
                                            class="q-mb-md text-blue block text-weight-600"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            :href="`${appUrl}${file.url}`"
                                            >{{ file.name }}</a
                                          >
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div v-if="!!card.tasks && card.tasks.length > 0">
                                  <q-expansion-item
                                    expand-icon-class="text-blue"
                                    v-for="task in card.tasks"
                                    :key="task.sortPosition"
                                    style="background:#FDD50033"
                                    class="q-mb-sm"
                                    default-opened
                                    v-show="task.active === true"
                                  >
                                    <template v-slot:header>
                                      <q-item-section>
                                        <p class="font-18 text-weight-600 q-ma-none">
                                          {{ task.name }}
                                        </p>
                                      </q-item-section>
                                    </template>
                                    <q-card>
                                      <div
                                        v-if="
                                          !!task.children && task.children.length > 0
                                        "
                                      >
                                        <div
                                          v-for="item in task.children"
                                          :key="item.sortPosition"
                                        >
                                          <q-card-section
                                            class="q-pl-none q-py-sm q-pr-none"
                                            v-if="item.active === true"
                                          >
                                            <div class="row">
                                              <div class="col-12">
                                                <div
                                                  class="row justify-between items-center"
                                                >
                                                  <div class="col-10 col-md-11">
                                                    <p class="font-14 q-ma-none">
                                                      {{ item.name }}
                                                    </p>
                                                  </div>
                                                  <div class="col-auto">
                                                    <q-checkbox
                                                      disable
                                                      color="primary"
                                                      class="isActiveCheckbox font-16 q-py-none"
                                                      :value="item.active"
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </q-card-section>
                                        </div>
                                      </div>
                                    </q-card>
                                  </q-expansion-item>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </q-card-section>
                      <q-separator inset class="bg-blue opacity-10" />
                    </q-card>

                  </div>
                  <div
                    v-if="
                      (!!checklist.preparation &&
                        !!checklist.preparation.inspection.active) ||
                        (!!checklist.preparation &&
                          !!checklist.preparation.captureRequirements.active) ||
                        (!!checklist.preparation &&
                          !!checklist.preparation.captureNeeds.active)
                    "
                    class="col-12 q-mb-md"
                  >
                    <q-card
                      class="shadow-1 radius-20"
                      :class="
                        checkProgress(
                          checklist.preparation.start,
                          checklist.preparation.end
                        )
                      "
                    >
                      <q-card-section class="q-pa-md items-start q-col-gutter-x-sm">
                        <div class="row">
                          <div class="col-12 col-md-4">
                            <div class="row">
                              <div class="col-12">
                                <h4 class="font-20 text-weight-600 q-mb-xs q-mt-none">
                                  {{
                                    $t(
                                      "Preparation of the project idea outline with internal coordination"
                                    )
                                  }}
                                </h4>
                              </div>
                              <div class="col-12 col-md-4">
                                <p class="q-mb-none font-16">{{ $t("start") }}</p>
                              </div>
                              <div class="col-12 col-md-8">
                                <p class="q-mb-none font-16">
                                  {{
                                    dateFormatter(
                                      !!checklist.preparation &&
                                        checklist.preparation.start
                                    )
                                  }}
                                </p>
                              </div>
                              <div class="col-12 col-md-4">
                                <p class="q-mt-sm q-mb-none font-16">
                                  {{ $t("end") }}
                                </p>
                              </div>
                              <div class="col-12 col-md-8">
                                <p
                                  :class="
                                    $q.screen.gt.sm ? 'q-mt-sm q-mb-none' : 'q-mb-sm'
                                  "
                                  class="font-16"
                                >
                                  {{
                                    dateFormatter(
                                      !!checklist.preparation &&
                                        checklist.preparation.end
                                    )
                                  }}
                                </p>
                              </div>
                              <!-- responsiblePerson -->
                              <!-- <div class="col-12">
                                <p class="q-mt-sm q-mb-none font-16">
                                  {{ $t("responsiblePerson") }}
                                </p>
                              </div> -->
                              <!-- <div class="col-12">
                                <p
                                  :class="
                                    $q.screen.gt.sm ? 'q-mb-none' : 'q-mt-sm'
                                  "
                                  class="font-16"
                                >
                                  {{
                                    !!checklist.preparation &&
                                      checklist.preparation.responsiblePerson
                                  }}
                                </p>
                              </div> -->
                            </div>
                          </div>
                          <div class="col-12 col-md-8">
                            <div
                              v-for="(card, propertyName) in checklist.preparation"
                              :key="card.sortPosition"
                            >
                              <div
                                v-if="
                                  (propertyName != 'end' ||
                                    propertyName != 'start' ||
                                    propertyName != 'id') &&
                                    card.active === true
                                "
                              >
                                <div class="q-mb-sm" style="background:#16428B1A">
                                  <div class="q-pa-md font-16">
                                    <div
                                      class="row justify-between items-start q-mb-md"
                                    >
                                      <div>
                                        <p
                                          class="font-18 text-blue text-weight-600 q-ma-none"
                                        >
                                          {{
                                            propertyName === "inspection"
                                              ? $t("Inspection")
                                              : propertyName === "captureRequirements"
                                              ? $t("Capture requirements")
                                              : propertyName === "captureNeeds"
                                              ? $t("Capture Needs")
                                              : ""
                                          }}
                                        </p>
                                        <p
                                          v-if="!!card.name"
                                          class="font-14 q-ma-none"
                                        >
                                          {{ card.name || "" }}
                                        </p>
                                      </div>
                                      <div
                                        v-if="
                                          checkProgress(
                                            checklist.preparation.start,
                                            checklist.preparation.end
                                          ) !== 'notStarted'
                                        "
                                      >
                                        <q-chip square class="text-weight-600">{{
                                          checkProgress(
                                            checklist.preparation.start,
                                            checklist.preparation.end
                                          ) === "done"
                                            ? $t("Done")
                                            : $t("In Progress")
                                        }}</q-chip>
                                      </div>
                                    </div>

                                    <div
                                      v-if="!!card.text"
                                      class="row items-center q-mb-md"
                                    >
                                      <div>
                                        <p class="font-16 text-blue-grey-10 q-ma-none">
                                          {{ $t("Description") }}
                                        </p>
                                        <p
                                          class="font-16 q-ma-none text-block"
                                          v-html="!!card.text ? card.text : ''"
                                        ></p>
                                      </div>
                                    </div>
                                    <div v-if="propertyName === 'inspection'">
                                      <div
                                        v-if="card.file && card.file.length > 0"
                                        class="row items-center q-mb-none"
                                      >
                                        <div
                                          v-for="(file, index) in card.file"
                                          :key="index"
                                          class="col-auto q-mr-md"
                                        >
                                          <a
                                            class="q-mb-md text-blue block text-weight-600"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            :href="`${appUrl}${file.url}`"
                                            >{{ file.name }}</a
                                          >
                                        </div>
                                      </div>
                                    </div>
                                    <div
                                      v-if="propertyName === 'captureRequirements'"
                                    >
                                      <div
                                        v-if="card.file && card.file.length > 0"
                                        class="row items-center q-mb-none"
                                      >
                                        <div
                                          v-for="(file, index) in card.file"
                                          :key="index"
                                          class="col-auto q-mr-md"
                                        >
                                          <a
                                            class="q-mb-md text-blue block text-weight-600"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            :href="`${appUrl}${file.url}`"
                                            >{{ file.name }}</a
                                          >
                                        </div>
                                      </div>
                                    </div>
                                    <div v-if="propertyName === 'captureNeeds'">
                                      <div
                                        v-if="card.file && card.file.length > 0"
                                        class="row items-center q-mb-none"
                                      >
                                        <div
                                          v-for="(file, index) in card.file"
                                          :key="index"
                                          class="col-auto q-mr-md"
                                        >
                                          <a
                                            class="q-mb-md text-blue block text-weight-600"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            :href="`${appUrl}${file.url}`"
                                            >{{ file.name }}</a
                                          >
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div v-if="!!card.tasks && card.tasks.length > 0">
                                  <q-expansion-item
                                    expand-icon-class="text-blue"
                                    v-for="task in card.tasks"
                                    :key="task.sortPosition"
                                    style="background:#FDD50033"
                                    class="q-mb-sm"
                                    v-show="task.active === true"
                                    default-opened
                                  >
                                    <template v-slot:header>
                                      <q-item-section>
                                        <p class="font-18 text-weight-600 q-ma-none">
                                          {{ task.name }}
                                        </p>
                                      </q-item-section>
                                    </template>
                                    <q-card>
                                      <div
                                        v-if="
                                          !!task.children && task.children.length > 0
                                        "
                                      >
                                        <div
                                          v-for="item in task.children"
                                          :key="item.sortPosition"
                                        >
                                          <q-card-section
                                            horizontal
                                            class="q-pl-none q-py-sm q-pr-none"
                                            v-if="item.active === true"
                                          >
                                            <div class="col-12">
                                              <div
                                                class="row justify-between items-center"
                                              >
                                                <div class="col-10 col-md-11">
                                                  <p class="font-14 q-ma-none">
                                                    {{ item.name }}
                                                  </p>
                                                </div>
                                                <div class="col-auto">
                                                  <q-checkbox
                                                    disable
                                                    color="primary"
                                                    class="isActiveCheckbox font-16 q-py-none"
                                                    :value="item.active"
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </q-card-section>
                                        </div>
                                      </div>
                                    </q-card>
                                  </q-expansion-item>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </q-card-section>
                      <q-separator inset class="bg-blue opacity-10" />
                    </q-card>
                  </div>
                  <div
                    v-if="
                      (!!checklist.fundingResearch &&
                        !!checklist.fundingResearch.checkDatabase.active) ||
                        (!!checklist.fundingResearch &&
                          !!checklist.fundingResearch.checkForFunding.active) ||
                        (!!checklist.fundingResearch &&
                          !!checklist.fundingResearch.checkWithFunding.active) ||
                        (!!checklist.fundingResearch &&
                        !!checklist.fundingResearch.checkGuildlines.active) ||
                        (!!checklist.fundingResearch &&
                        !!checklist.fundingResearch.selectFunding.active)
                    "
                    class="col-12 q-mb-md"
                  >
                    <q-card
                      :class="
                        checkProgress(
                          checklist.fundingResearch.start,
                          checklist.fundingResearch.end
                        )
                      "
                      class="shadow-1 radius-20"
                    >
                      <q-card-section class="q-pa-md items-start q-col-gutter-x-sm">
                        <div class="row">
                          <div class="col-12 col-md-4">
                            <div class="row">
                              <div class="col-12">
                                <h4 class="font-20 text-weight-600 q-mb-xs q-mt-none">
                                  {{ $t("Funding research") }}
                                </h4>
                              </div>
                              <div class="col-12 col-md-4">
                                <p class="q-mb-none font-16">{{ $t("start") }}</p>
                              </div>
                              <div class="col-12 col-md-8">
                                <p class="q-mb-none font-16">
                                  {{
                                    dateFormatter(
                                      !!checklist.fundingResearch &&
                                        checklist.fundingResearch.start
                                    )
                                  }}
                                </p>
                              </div>
                              <div class="col-12 col-md-4">
                                <p class="q-mt-sm q-mb-none font-16">
                                  {{ $t("end") }}
                                </p>
                              </div>
                              <div class="col-12 col-md-8">
                                <p
                                  :class="
                                    $q.screen.gt.sm ? 'q-mb-sm q-mb-none' : 'q-mt-sm'
                                  "
                                  class="font-16"
                                >
                                  {{
                                    dateFormatter(
                                      !!checklist.fundingResearch &&
                                        checklist.fundingResearch.end
                                    )
                                  }}
                                </p>
                              </div>
                              <!-- responsiblePerson -->
                              <!-- <div class="col-12">
                                <p class="q-mt-sm q-mb-none font-16">
                                  {{ $t("responsiblePerson") }}
                                </p>
                              </div> -->
                              <!-- <div class="col-12">
                                <p
                                  :class="
                                    $q.screen.gt.sm ? 'q-mb-none' : 'q-mb-sm'
                                  "
                                  class="font-16"
                                >
                                  {{
                                    !!checklist.fundingResearch &&
                                      checklist.fundingResearch.responsiblePerson
                                  }}
                                </p>
                              </div> -->
                            </div>
                          </div>
                          <div class="col-12 col-md-8">
                            <div
                              v-for="(card,
                              propertyName) in sortedFundingResearch"
                              :key="card.sortPosition"
                            >
                              <div
                                v-if="
                                  (propertyName != 'end' ||
                                    propertyName != 'start' ||
                                    propertyName != 'id') &&
                                    card.active === true
                                "
                              >
                                <div class="q-mb-sm" style="background:#16428B1A">
                                  <div class="q-pa-md font-16">
                                    <div
                                      class="row justify-between items-start q-mb-md"
                                    >
                                      <div>
                                        <p
                                          class="font-18 text-blue text-weight-600 q-ma-none"
                                        >
                                          {{
                                            propertyName === "checkDatabase"
                                              ? $t("Check database “Fundings”")
                                              : propertyName === "checkForFunding"
                                              ? $t("Check for funding scouting")
                                              : propertyName === "checkWithFunding"
                                              ? $t(
                                                  "Joint research for funding or check of the project idea"
                                                )
                                              : propertyName === "checkGuildlines"
                                              ? $t("Check Guidlines (long version)")
                                              : propertyName === "selectFunding"
                                    ? $t("Select Funding") : ""
                                          }}
                                        </p>
                                        <p
                                          v-if="!!card.name"
                                          class="font-14 q-ma-none"
                                        >
                                          {{ card.name || "" }}
                                        </p>
                                      </div>
                                      <div
                                        v-if="
                                          checkProgress(
                                            checklist.fundingResearch.start,
                                            checklist.fundingResearch.end
                                          ) !== 'notStarted'
                                        "
                                      >
                                        <q-chip square class="text-weight-600">{{
                                          checkProgress(
                                            checklist.fundingResearch.start,
                                            checklist.fundingResearch.end
                                          ) === "done"
                                            ? $t("Done")
                                            : $t("In Progress")
                                        }}</q-chip>
                                      </div>
                                    </div>
                                    <div
                                      v-if="!!card.text"
                                      class="row items-center q-mb-md"
                                    >
                                      <div>
                                        <p class="font-16 text-blue-grey-10 q-ma-none">
                                          {{ $t("Description") }}
                                        </p>
                                        <p
                                          class="font-16 q-ma-none text-block"
                                          v-html="!!card.text ? card.text : ''"
                                        ></p>
                                      </div>
                                    </div>
                                    <div v-if="propertyName === 'selectFunding' && checklist.funding">
                                      <a
                                            class="q-mb-sm text-blue block text-weight-600 cursor-pointer"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            @click.prevent="
                                              viewFunding(checklist.funding.id)
                                            "
                                            >{{ checklist.funding.title }}</a
                                          >
                                    </div>
                                    <div v-if="propertyName === 'checkDatabase'">
                                      <div
                                        v-if="card.file && card.file.length > 0"
                                        class="row items-center q-mb-none"
                                      >
                                        <div
                                          v-for="(file, index) in card.file"
                                          :key="index"
                                          class="col-auto q-mr-md"
                                        >
                                          <a
                                            class="q-mb-md text-blue block text-weight-600"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            :href="`${appUrl}${file.url}`"
                                            >{{ file.name }}</a
                                          >
                                        </div>
                                      </div>
                                    </div>
                                    <div v-if="propertyName === 'checkForFunding'">
                                      <div
                                        v-if="card.file && card.file.length > 0"
                                        class="row items-center q-mb-none"
                                      >
                                        <div
                                          v-for="(file, index) in card.file"
                                          :key="index"
                                          class="col-auto q-mr-md"
                                        >
                                          <a
                                            class="q-mb-md text-blue block text-weight-600"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            :href="`${appUrl}${file.url}`"
                                            >{{ file.name }}</a
                                          >
                                        </div>
                                      </div>
                                    </div>
                                    <div v-if="propertyName === 'checkWithFunding'">
                                      <div
                                        v-if="card.file && card.file.length > 0"
                                        class="row items-center q-mb-none"
                                      >
                                        <div
                                          v-for="(file, index) in card.file"
                                          :key="index"
                                          class="col-auto q-mr-md"
                                        >
                                          <a
                                            class="q-mb-md text-blue block text-weight-600"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            :href="`${appUrl}${file.url}`"
                                            >{{ file.name }}</a
                                          >
                                        </div>
                                      </div>
                                    </div>
                                    <div v-if="propertyName === 'checkGuildlines'">
                                      <div
                                        v-if="card.file && card.file.length > 0"
                                        class="row items-center q-mb-none"
                                      >
                                        <div
                                          v-for="(file, index) in card.file"
                                          :key="index"
                                          class="col-auto q-mr-md"
                                        >
                                          <a
                                            class="q-mb-md text-blue block text-weight-600"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            :href="`${appUrl}${file.url}`"
                                            >{{ file.name }}</a
                                          >
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div v-if="!!card.tasks && card.tasks.length > 0">
                                  <q-expansion-item
                                    expand-icon-class="text-blue"
                                    v-for="task in card.tasks"
                                    :key="task.sortPosition"
                                    style="background:#FDD50033"
                                    class="q-mb-sm"
                                    v-show="task.active === true"
                                    default-opened
                                  >
                                    <template v-slot:header>
                                      <q-item-section>
                                        <p class="font-18 text-weight-600 q-ma-none">
                                          {{ task.name }}
                                        </p>
                                      </q-item-section>
                                    </template>
                                    <q-card>
                                      <div
                                        v-if="
                                          !!task.children && task.children.length > 0
                                        "
                                      >
                                        <div
                                          v-for="item in task.children"
                                          :key="item.sortPosition"
                                        >
                                          <q-card-section
                                            horizontal
                                            v-if="item.active === true"
                                            class="q-pl-none q-py-sm q-pr-none"
                                          >
                                            <div class="col-12">
                                              <div
                                                class="row justify-between items-center"
                                              >
                                                <div class="col-10 col-md-11">
                                                  <p class="font-14 q-ma-none">
                                                    {{ item.name }}
                                                  </p>
                                                </div>
                                                <div class="col-auto">
                                                  <q-checkbox
                                                    disable
                                                    color="primary"
                                                    class="isActiveCheckbox font-16 q-py-none"
                                                    :value="item.active"
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </q-card-section>
                                        </div>
                                      </div>
                                    </q-card>
                                  </q-expansion-item>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </q-card-section>
                      <q-separator inset class="bg-blue opacity-10" />
                    </q-card>
                  </div>
                  <div
                    v-if="
                      (!!checklist.preparationOfProject &&
                        !!checklist.preparationOfProject.checkContent.active) ||
                        (!!checklist.preparationOfProject &&
                          !!checklist.preparationOfProject.checkCooperations
                            .active) ||
                        (!!checklist.preparationOfProject &&
                          !!checklist.preparationOfProject.checkSimilarProejcts
                            .active) ||
                        (!!checklist.preparationOfProject &&
                          !!checklist.preparationOfProject.checkPlanning.active)
                    "
                    class="col-12 q-mb-md"
                  >
                    <q-card
                      :class="
                        checkProgress(
                          checklist.preparationOfProject.start,
                          checklist.preparationOfProject.end
                        )
                      "
                      class="shadow-1 radius-20"
                    >
                      <q-card-section class="q-pa-md items-start q-col-gutter-x-sm">
                        <div class="row">
                          <div class="co-12 col-md-4">
                            <div class="row">
                              <div class="col-12">
                                <h4 class="font-20 text-weight-600 q-mb-xs q-mt-none">
                                  {{
                                    $t(
                                      "Preparation/optimisation of project documents"
                                    )
                                  }}
                                </h4>
                              </div>
                              <div class="col-12 col-md-4">
                                <p class="q-mb-none font-16">{{ $t("start") }}</p>
                              </div>
                              <div class="col-12 col-md-8">
                                <p class="q-mb-none font-16">
                                  {{
                                    dateFormatter(
                                      !!checklist.preparationOfProject &&
                                        checklist.preparationOfProject.start
                                    )
                                  }}
                                </p>
                              </div>
                              <div class="col-12 col-md-4">
                                <p class="q-mt-sm q-mb-none font-16">
                                  {{ $t("end") }}
                                </p>
                              </div>
                              <div class="col-12 col-md-8">
                                <p
                                  :class="
                                    $q.screen.gt.sm ? 'q-mt-sm q-mb-none' : 'q-mb-sm'
                                  "
                                  class="font-16"
                                >
                                  {{
                                    dateFormatter(
                                      !!checklist.preparationOfProject &&
                                        checklist.preparationOfProject.end
                                    )
                                  }}
                                </p>
                              </div>
                               <!-- responsiblePerson -->
                               <!-- <div class="col-12">
                                <p class="q-mt-sm q-mb-none font-16">
                                  {{ $t("responsiblePerson") }}
                                </p>
                              </div> -->
                              <!-- <div class="col-12">
                                <p
                                  :class="
                                    $q.screen.gt.sm ? 'q-mb-none' : 'q-mt-sm'
                                  "
                                  class="font-16"
                                >
                                  {{
                                    !!checklist.preparationOfProject &&
                                      checklist.preparationOfProject.responsiblePerson
                                  }}
                                </p>
                              </div> -->
                            </div>
                          </div>
                          <div class="col-12 col-md-8">
                            <div
                              v-for="(card,
                              propertyName) in sortedPreparationOfProject"
                              :key="card.sortPosition"
                            >
                              <div
                                v-if="
                                  (propertyName != 'end' ||
                                    propertyName != 'start' ||
                                    propertyName != 'id') &&
                                    card.active === true
                                "
                              >
                                <div class="q-mb-sm" style="background:#16428B1A">
                                  <div class="q-pa-md font-16">
                                    <div
                                      class="row justify-between items-start q-mb-md"
                                    >
                                      <div>
                                        <p
                                          class="font-18 text-blue text-weight-600 q-ma-none"
                                        >
                                          {{
                                            propertyName === "checkContent"
                                              ? $t("Check Content with Guidelines")
                                              : propertyName === "checkCooperations"
                                              ? $t("If necessary check cooperations")
                                              : propertyName ===
                                                "checkSimilarProejcts"
                                              ? $t(
                                                  "If necessary check similar projects"
                                                )
                                              : propertyName === "checkPlanning"
                                              ? $t(
                                                  "Check planning and financing with all relevant departments"
                                                )
                                              : ""
                                          }}
                                        </p>
                                        <p
                                          v-if="!!card.name"
                                          class="font-14 q-ma-none"
                                        >
                                          {{ card.name || "" }}
                                        </p>
                                      </div>
                                      <div
                                        v-if="
                                          checkProgress(
                                            checklist.preparationOfProject.start,
                                            checklist.preparationOfProject.end
                                          ) !== 'notStarted'
                                        "
                                      >
                                        <q-chip square class="text-weight-600">{{
                                          checkProgress(
                                            checklist.preparationOfProject.start,
                                            checklist.preparationOfProject.end
                                          ) === "done"
                                            ? $t("Done")
                                            : $t("In Progress")
                                        }}</q-chip>
                                      </div>
                                    </div>
                                    <div
                                      v-if="!!card.text"
                                      class="row items-center q-mb-md"
                                    >
                                      <div>
                                        <p class="font-16 text-blue-grey-10 q-ma-none">
                                          {{ $t("Description") }}
                                        </p>
                                        <p
                                          class="font-16 q-ma-none text-block"
                                          v-html="!!card.text ? card.text : ''"
                                        ></p>
                                      </div>
                                    </div>
                                    <div v-if="propertyName === 'checkContent'">
                                      <div
                                        v-if="card.file && card.file.length > 0"
                                        class="row items-center q-mb-none"
                                      >
                                        <div
                                          v-for="(file, index) in card.file"
                                          :key="index"
                                          class="col-auto q-mr-md"
                                        >
                                          <a
                                            class="q-mb-md text-blue block text-weight-600"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            :href="`${appUrl}${file.url}`"
                                            >{{ file.name }}</a
                                          >
                                        </div>
                                      </div>
                                    </div>
                                    <div v-if="propertyName === 'checkCooperations'">
                                      <div
                                        v-if="card.file && card.file.length > 0"
                                        class="row items-center q-mb-none"
                                      >
                                        <div
                                          v-for="(file, index) in card.file"
                                          :key="index"
                                          class="col-auto q-mr-md"
                                        >
                                          <a
                                            class="q-mb-md text-blue block text-weight-600"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            :href="`${appUrl}${file.url}`"
                                            >{{ file.name }}</a
                                          >
                                        </div>
                                      </div>
                                    </div>
                                    <div
                                      v-if="propertyName === 'checkSimilarProejcts'"
                                    >
                                      <div
                                        v-if="card.file && card.file.length > 0"
                                        class="row items-center q-mb-none"
                                      >
                                        <div
                                          v-for="(file, index) in card.file"
                                          :key="index"
                                          class="col-auto q-mr-md"
                                        >
                                          <a
                                            class="q-mb-md text-blue block text-weight-600"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            :href="`${appUrl}${file.url}`"
                                            >{{ file.name }}</a
                                          >
                                        </div>
                                      </div>
                                    </div>
                                    <div v-if="propertyName === 'checkPlanning'">
                                      <div
                                        v-if="card.file && card.file.length > 0"
                                        class="row items-center q-mb-none"
                                      >
                                        <div
                                          v-for="(file, index) in card.file"
                                          :key="index"
                                          class="col-auto q-mr-md"
                                        >
                                          <a
                                            class="q-mb-md text-blue block text-weight-600"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            :href="`${appUrl}${file.url}`"
                                            >{{ file.name }}</a
                                          >
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div v-if="!!card.tasks && card.tasks.length > 0">
                                  <q-expansion-item
                                    expand-icon-class="text-blue"
                                    v-for="task in card.tasks"
                                    :key="task.sortPosition"
                                    style="background:#FDD50033"
                                    class="q-mb-sm"
                                    v-show="task.active === true"
                                    default-opened
                                  >
                                    <template v-slot:header>
                                      <q-item-section>
                                        <p class="font-18 text-weight-600 q-ma-none">
                                          {{ task.name }}
                                        </p>
                                      </q-item-section>
                                    </template>
                                    <q-card>
                                      <div
                                        v-if="
                                          !!task.children && task.children.length > 0
                                        "
                                      >
                                        <div
                                          v-for="item in task.children"
                                          :key="item.sortPosition"
                                        >
                                          <q-card-section
                                            horizontal
                                            v-if="item.active === true"
                                            class="q-pl-none q-py-sm q-pr-none"
                                          >
                                            <div class="col-12">
                                              <div
                                                class="row justify-between items-center"
                                              >
                                                <div class="col-10 col-md-11">
                                                  <p class="font-14 q-ma-none">
                                                    {{ item.name }}
                                                  </p>
                                                </div>
                                                <div class="col-auto">
                                                  <q-checkbox
                                                    disable
                                                    color="primary"
                                                    class="isActiveCheckbox font-16 q-py-none"
                                                    :value="item.active"
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </q-card-section>
                                        </div>
                                      </div>
                                    </q-card>
                                  </q-expansion-item>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </q-card-section>
                      <q-separator inset class="bg-blue opacity-10" />
                    </q-card>
                  </div>
                  <div
                    v-if="
                      !!checklist.legitimation &&
                        !!checklist.legitimation.template.active
                    "
                    class="col-12 q-mb-md"
                  >
                    <q-card
                      :class="
                        checkProgress(
                          checklist.legitimation.start,
                          checklist.legitimation.end
                        )
                      "
                      class="shadow-1 radius-20"
                    >
                      <q-card-section class="q-pa-md items-start q-col-gutter-x-sm">
                        <div class="row">
                          <div class="col-12 col-md-4">
                            <div class="row">
                              <div class="col-12">
                                <h4 class="font-20 text-weight-600 q-mb-xs q-mt-none">
                                  {{ $t("Legitimation for submission") }}
                                </h4>
                              </div>
                              <div class="col-12 col-md-4">
                                <p class="q-mb-none font-16">{{ $t("start") }}</p>
                              </div>
                              <div class="col-12 col-md-8">
                                <p class="q-mb-none font-16">
                                  {{
                                    dateFormatter(
                                      !!checklist.legitimation &&
                                        checklist.legitimation.start
                                    )
                                  }}
                                </p>
                              </div>
                              <div class="col-12 col-md-4">
                                <p class="q-mt-sm q-mb-none font-16">
                                  {{ $t("end") }}
                                </p>
                              </div>
                              <div class="col-12 col-md-8">
                                <p
                                  :class="
                                    $q.screen.gt.sm ? 'q-mt-sm q-mb-none' : 'q-mb-sm'
                                  "
                                  class="font-16"
                                >
                                  {{
                                    dateFormatter(
                                      !!checklist.legitimation &&
                                        checklist.legitimation.end
                                    )
                                  }}
                                </p>
                              </div>
                              <!-- responsiblePerson -->
                              <!-- <div class="col-12">
                                <p class="q-mt-sm q-mb-none font-16">
                                  {{ $t("responsiblePerson") }}
                                </p>
                              </div> -->
                              <!-- <div class="col-12">
                                <p
                                  :class="
                                    $q.screen.gt.sm ? 'q-mb-none' : 'q-mt-sm'
                                  "
                                  class="font-16"
                                >
                                  {{
                                    !!checklist.legitimation &&
                                      checklist.legitimation.responsiblePerson
                                  }}
                                </p>
                              </div> -->
                            </div>
                          </div>
                          <div class="col-12 col-md-8">
                            <div
                              v-for="(card, propertyName) in sortedLegitimation"
                              :key="card.sortPosition"
                            >
                              <div
                                v-if="
                                  (propertyName != 'end' ||
                                    propertyName != 'start' ||
                                    propertyName != 'id') &&
                                    card.active === true
                                "
                              >
                                <div class="q-mb-sm" style="background:#16428B1A">
                                  <div class="q-pa-md font-16">
                                    <div
                                      class="row justify-between items-start q-mb-md"
                                    >
                                      <div>
                                        <p
                                          class="font-18 text-blue text-weight-600 q-ma-none"
                                        >
                                          {{
                                            propertyName === "template"
                                              ? $t(
                                                  "Presentation/discussion of the project documents"
                                                )
                                              : ""
                                          }}
                                        </p>
                                        <p
                                          v-if="!!card.name"
                                          class="font-14 q-ma-none"
                                        >
                                          {{ card.name || "" }}
                                        </p>
                                      </div>
                                      <div
                                        v-if="
                                          checkProgress(
                                            checklist.legitimation.start,
                                            checklist.legitimation.end
                                          ) !== 'notStarted'
                                        "
                                      >
                                        <q-chip square class="text-weight-600">{{
                                          checkProgress(
                                            checklist.legitimation.start,
                                            checklist.legitimation.end
                                          ) === "done"
                                            ? $t("Done")
                                            : $t("In Progress")
                                        }}</q-chip>
                                      </div>
                                    </div>

                                    <div
                                      v-if="!!card.text"
                                      class="row items-center q-mb-md"
                                    >
                                      <div>
                                        <p class="font-16 text-blue-grey-10 q-ma-none">
                                          {{ $t("Description") }}
                                        </p>
                                        <p
                                          class="font-16 q-ma-none text-block"
                                          v-html="!!card.text ? card.text : ''"
                                        ></p>
                                      </div>
                                    </div>
                                    <div v-if="propertyName === 'template'">
                                      <div
                                        v-if="card.file && card.file.length > 0"
                                        class="row items-center q-mb-none"
                                      >
                                        <div
                                          v-for="(file, index) in card.file"
                                          :key="index"
                                          class="col-auto q-mr-md"
                                        >
                                          <a
                                            class="q-mb-md text-blue block text-weight-600"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            :href="`${appUrl}${file.url}`"
                                            >{{ file.name }}</a
                                          >
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div v-if="!!card.tasks && card.tasks.length > 0">
                                  <q-expansion-item
                                    expand-icon-class="text-blue"
                                    v-for="task in card.tasks"
                                    :key="task.sortPosition"
                                    style="background:#FDD50033"
                                    class="q-mb-sm"
                                    v-show="task.active === true"
                                    default-opened
                                  >
                                    <template v-slot:header>
                                      <q-item-section>
                                        <p class="font-18 text-weight-600 q-ma-none">
                                          {{ task.name }}
                                        </p>
                                      </q-item-section>
                                    </template>
                                    <q-card>
                                      <div
                                        v-if="
                                          !!task.children && task.children.length > 0
                                        "
                                      >
                                        <div
                                          v-for="item in task.children"
                                          :key="item.sortPosition"
                                        >
                                          <q-card-section
                                            horizontal
                                            v-if="item.active === true"
                                            class="q-pl-none q-py-sm q-pr-none"
                                          >
                                            <div class="col-12">
                                              <div
                                                class="row justify-between items-center"
                                              >
                                                <div class="col-10 col-md-11">
                                                  <p class="font-14 q-ma-none">
                                                    {{ item.name }}
                                                  </p>
                                                </div>
                                                <div class="col-auto">
                                                  <q-checkbox
                                                    disable
                                                    color="primary"
                                                    class="isActiveCheckbox font-16 q-py-none"
                                                    :value="item.active"
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </q-card-section>
                                        </div>
                                      </div>
                                    </q-card>
                                  </q-expansion-item>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </q-card-section>
                      <q-separator inset class="bg-blue opacity-10" />
                    </q-card>
                  </div>
                  <div
                    v-if="
                      (!!checklist.finalExamination &&
                        !!checklist.finalExamination.signatures.active) ||
                        (!!checklist.finalExamination &&
                          !!checklist.finalExamination.revision.active)
                    "
                    class="col-12 q-mb-md"
                  >
                    <q-card
                      :class="
                        checkProgress(
                          checklist.finalExamination.start,
                          checklist.finalExamination.end
                        )
                      "
                      class="shadow-1 radius-20"
                    >
                      <q-card-section class="q-pa-md items-start q-col-gutter-x-sm">
                        <div class="row">
                          <div class="col-12 col-md-4">
                            <div class="row">
                              <div class="col-12">
                                <h4 class="font-20 text-weight-600 q-mb-xs q-mt-none">
                                  {{
                                    $t("Final examination of the project documents")
                                  }}
                                </h4>
                              </div>
                              <div class="col-12 col-md-4">
                                <p class="q-mb-none font-16">{{ $t("start") }}</p>
                              </div>
                              <div class="col-12 col-md-8">
                                <p class="q-mb-none font-16">
                                  {{
                                    dateFormatter(
                                      !!checklist.finalExamination &&
                                        checklist.finalExamination.start
                                    )
                                  }}
                                </p>
                              </div>
                              <div class="col-12 col-md-4">
                                <p class="q-mt-sm q-mb-none font-16">
                                  {{ $t("end") }}
                                </p>
                              </div>
                              <div class="col-12 col-md-8">
                                <p
                                  :class="
                                    $q.screen.gt.sm ? 'q-mt-sm q-mb-none' : 'q-mb-sm'
                                  "
                                  class="font-16"
                                >
                                  {{
                                    dateFormatter(
                                      !!checklist.finalExamination &&
                                        checklist.finalExamination.end
                                    )
                                  }}
                                </p>
                              </div>
                              <!-- responsiblePerson -->
                              <!-- <div class="col-12">
                                <p class="q-mt-sm q-mb-none font-16">
                                  {{ $t("responsiblePerson") }}
                                </p>
                              </div> -->
                              <!-- <div class="col-12">
                                <p
                                  :class="
                                    $q.screen.gt.sm ? 'q-mb-none' : 'q-mt-sm'
                                  "
                                  class="font-16"
                                >
                                  {{
                                    !!checklist.finalExamination &&
                                      checklist.finalExamination.responsiblePerson
                                  }}
                                </p>
                              </div> -->
                            </div>
                          </div>
                          <div class="col-12 col-md-8">
                            <div
                              v-for="(card,
                              propertyName) in sortedFinalExamination"
                              :key="card.sortPosition"
                            >
                              <div
                                v-if="
                                  (propertyName != 'end' ||
                                    propertyName != 'start' ||
                                    propertyName != 'id') &&
                                    card.active === true
                                "
                              >
                                <div class="q-mb-sm" style="background:#16428B1A">
                                  <div class="q-pa-md font-16">
                                    <div
                                      class="row justify-between items-start q-mb-md"
                                    >
                                      <div>
                                        <p
                                          class="font-18 text-blue text-weight-600 q-ma-none"
                                        >
                                          {{
                                            propertyName === "signatures"
                                              ? $t("Collection of signatures")
                                              : propertyName === "revision"
                                              ? $t("Revision of project documents")
                                              : ""
                                          }}
                                        </p>
                                        <p
                                          v-if="!!card.name"
                                          class="font-14 q-ma-none"
                                        >
                                          {{ card.name || "" }}
                                        </p>
                                      </div>
                                      <div
                                        v-if="
                                          checkProgress(
                                            checklist.finalExamination.start,
                                            checklist.finalExamination.end
                                          ) !== 'notStarted'
                                        "
                                      >
                                        <q-chip square class="text-weight-600">{{
                                          checkProgress(
                                            checklist.finalExamination.start,
                                            checklist.finalExamination.end
                                          ) === "done"
                                            ? $t("Done")
                                            : $t("In Progress")
                                        }}</q-chip>
                                      </div>
                                    </div>

                                    <div
                                      v-if="!!card.text"
                                      class="row items-center q-mb-md"
                                    >
                                      <div>
                                        <p class="font-16 text-blue-grey-10 q-ma-none">
                                          {{ $t("Description") }}
                                        </p>
                                        <p
                                          class="font-16 q-ma-none text-block"
                                          v-html="!!card.text ? card.text : ''"
                                        ></p>
                                      </div>
                                    </div>
                                    <div v-if="propertyName === 'signatures'">
                                      <div
                                        v-if="card.file && card.file.length > 0"
                                        class="row items-center q-mb-none"
                                      >
                                        <div
                                          v-for="(file, index) in card.file"
                                          :key="index"
                                          class="col-auto q-mr-md"
                                        >
                                          <a
                                            class="q-mb-md text-blue block text-weight-600"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            :href="`${appUrl}${file.url}`"
                                            >{{ file.name }}</a
                                          >
                                        </div>
                                      </div>
                                    </div>
                                    <div v-if="propertyName === 'revision'">
                                      <div
                                        v-if="card.file && card.file.length > 0"
                                        class="row items-center q-mb-none"
                                      >
                                        <div
                                          v-for="(file, index) in card.file"
                                          :key="index"
                                          class="col-auto q-mr-md"
                                        >
                                          <a
                                            class="q-mb-md text-blue block text-weight-600"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            :href="`${appUrl}${file.url}`"
                                            >{{ file.name }}</a
                                          >
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div v-if="!!card.tasks && card.tasks.length > 0">
                                  <q-expansion-item
                                    expand-icon-class="text-blue"
                                    v-for="task in card.tasks"
                                    :key="task.sortPosition"
                                    style="background:#FDD50033"
                                    class="q-mb-sm"
                                    v-show="task.active === true"
                                    default-opened
                                  >
                                    <template v-slot:header>
                                      <q-item-section>
                                        <p class="font-18 text-weight-600 q-ma-none">
                                          {{ task.name }}
                                        </p>
                                      </q-item-section>
                                    </template>
                                    <q-card>
                                      <div
                                        v-if="
                                          !!task.children && task.children.length > 0
                                        "
                                      >
                                        <div
                                          v-for="item in task.children"
                                          :key="item.sortPosition"
                                        >
                                          <q-card-section
                                            horizontal
                                            v-if="item.active === true"
                                            class="q-pl-none q-py-sm q-pr-none"
                                          >
                                            <div class="col-12">
                                              <div
                                                class="row justify-between items-center"
                                              >
                                                <div class="col-10 col-md-11">
                                                  <p class="font-14 q-ma-none">
                                                    {{ item.name }}
                                                  </p>
                                                </div>
                                                <div class="col-auto">
                                                  <q-checkbox
                                                    disable
                                                    color="primary"
                                                    class="isActiveCheckbox font-16 q-py-none"
                                                    :value="item.active"
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </q-card-section>
                                        </div>
                                      </div>
                                    </q-card>
                                  </q-expansion-item>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </q-card-section>
                      <q-separator inset class="bg-blue opacity-10" />
                    </q-card>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </vue-html2pdf>
        <div class="row">
            <div class="col-12">
              <h1 class="font-24 text-weight-regular q-my-none" style="line-height: 3rem;">
                {{ checklist.title || "" }}
              </h1>
            </div>
          </div>
          <div class="row q-col-gutter-lg">
            <div class="col-12 col-md-4">
              <div class="row">
                <div class="col-12 q-mb-md">
                  <q-card class="shadow-1 radius-20">
                    <q-card-section>
                      <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                        {{ $t("Idea Provider/giver") }}
                      </h4>
                      <div class="q-ml-md font-16">
                        <p class="q-mb-sm">
                          {{
                            checklist.ideaProvider === "volunteering"
                              ? $t("Volunteering")
                              : $t("Main Office") || ""
                          }}
                        </p>
                      </div>
                    </q-card-section>
                    <q-separator inset class="bg-blue opacity-10" />
                    <q-card-section>
                      <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                        {{ $t("Contact person checklist view") }}
                      </h4>
                      <div class="q-ml-md font-16">
                        <p class="q-mb-sm">
                          {{
                            (!!checklist.info && checklist.info.contactName) ||
                              (!!checklist &&
                                !!checklist.owner &&
                                checklist.owner.username) ||
                              ""
                          }}
                        </p>
                      </div>
                    </q-card-section>
                    <q-separator inset class="bg-blue opacity-10" />
                    <q-card-section>
                      <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                        {{ $t("Contact Details") }}
                      </h4>
                      <div class="q-ml-md font-16">
                        <p class="q-mb-sm">
                          {{ (!!checklist.info && checklist.info.streetNo) || "" }}
                        </p>
                        <p class="q-mb-sm">
                          {{
                            (!!checklist.info && checklist.info.postalCode) || ""
                          }}
                        </p>
                        <p class="q-mb-sm">
                          {{ (!!checklist.info && checklist.info.phone) || "" }}
                        </p>
                        <p class="q-mb-sm text-overflow">
                          {{ (!!checklist.info && checklist.info.email) || "" }}
                        </p>
                        <!-- <p class="q-mb-sm">
                          {{
                            (!!checklist.municipality &&
                              checklist.municipality.location) ||
                              ""
                          }}
                        </p> -->
                      </div>
                    </q-card-section>
                    <q-separator inset class="bg-blue opacity-10" />
                    <div v-if="!!checklist.info && !!checklist.info.location">
                      <q-card-section>
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("personalData.location") }}
                        </h4>
                        <div class="q-ml-md font-16">
                          <p class="q-mb-sm">
                            {{ (!!checklist.info && checklist.info.location) || "" }}
                          </p>
                        </div>
                      </q-card-section>
                      <q-separator inset class="bg-blue opacity-10" />
                    </div>
                    <div v-if="checklist.editors && checklist.editors.length > 0">
                      <q-card-section>
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("Invite Editor") }}
                        </h4>
                        <div class="q-ml-md font-16">
                          <div
                            v-if="checklist.editors && checklist.editors.length > 0"
                          >
                            <p
                              v-for="(editor, index) in checklist.editors"
                              :key="index"
                              class="q-mb-sm"
                            >
                              {{ editor.username }}
                            </p>
                          </div>
                        </div>
                      </q-card-section>
                      <q-separator inset class="bg-blue opacity-10" />
                    </div>
                    <q-card-section
                      v-if="checklist.project && checklist.project.id"
                    >
                      <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                        {{ $t("Link for Project Idea") }}
                      </h4>
                      <div class="q-ml-md font-16">
                        <div v-if="checklist.project && checklist.project.id">
                          <a
                            class="q-mb-sm text-blue block text-weight-600 cursor-pointer"
                            target="_blank"
                            rel="noopener noreferrer"
                            @click.prevent="viewProject(checklist.project.id)"
                            >{{ checklist.project.title }}</a
                          >
                        </div>
                        <div v-else>
                          <p class="q-mb-sm"></p>
                        </div>
                      </div>
                    </q-card-section>
                    <div v-if="checklist.duplications > 0">
                      <q-card-section>
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("projectContent.duplications") }}
                        </h4>
                        <div class="q-ml-md font-16">
                          <p class="q-mb-sm">
                            {{ checklist.duplications }}
                          </p>
                        </div>
                      </q-card-section>
                      <q-separator inset class="bg-blue opacity-10" />
                    </div>
                  </q-card>
                </div>
              </div>
            </div>
            <div class="col-12 col-md-8">
              <div class="row">
                <div class="col-12 q-mb-md">
                  <q-card class="shadow-1 radius-20">
                    <q-card-section v-if="checklist.media">
                      <q-carousel
                        swipeable
                        animated
                        v-model="slide"
                        infinite
                        class="radius-10"
                        autoplay
                      >
                        <q-carousel-slide
                          class="imageStyling"
                          v-for="(item, index) in checklist.media"
                          :key="index"
                          :name="index + 1"
                          :img-src="
                            !item.mime.includes('video')
                              ? `${appUrl}${item.url}`
                              : ''
                          "
                        >
                          <video
                            v-if="item.mime.includes('video')"
                            class="full-width full-height"
                            controls
                          >
                            <source
                              :src="`${appUrl}${item.url}`"
                              type="video/mp4"
                            />
                          </video>
                        </q-carousel-slide>
                      </q-carousel>
                      <div class="row justify-center">
                        <div class="col-9">
                          <q-tabs
                            swipeable
                            v-model="slide"
                            indicator-color="transparent"
                            outside-arrows
                            inline-label
                            mobile-arrows
                            align="center"
                            active-class="opacity-50"
                            class="no-padding q-mt-md"
                            :class="{ carouselThumbnails: $q.screen.gt.sm }"
                          >
                            <q-tab
                              :name="index + 1"
                              @click="slide = index + 1"
                              v-for="(item, index) in checklist.media"
                              :key="index"
                              class="no-padding q-mx-sm radius-10"
                              content-class="no-padding overflow-hidden"
                            >
                              <div
                                class="no-padding radius-10 overflow-hidden"
                                style="width:100px; height:100px"
                              >
                                <q-card-section class="no-padding">
                                  <q-img
                                    v-if="!item.mime.includes('video')"
                                    class="tabStyling"
                                    :src="`${appUrl}${item.url}`"
                                    height="100px"
                                    width="100px"
                                  />
                                  <video
                                    v-if="item.mime.includes('video')"
                                    class="full-width full-height"
                                  >
                                    <source
                                      :src="`${appUrl}${item.url}`"
                                      type="video/mp4"
                                    />
                                  </video>
                                </q-card-section>
                              </div>
                            </q-tab>
                          </q-tabs>
                          <p
                            class="q-mt-md q-mb-none font-14 text-center text-grey"
                          >
                            {{
                              !!checklist.media[slide - 1] &&
                              !!checklist.media[slide - 1].caption
                                ? checklist.media[slide - 1].caption
                                : ""
                            }}
                          </p>
                        </div>
                      </div>
                    </q-card-section>
                    <q-card-section
                      class="flex flex-center"
                      v-else
                      style="height: 548px"
                    >
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
                            {{ $t("myData.categories") }}
                          </h4>
                        </div>
                        <div class="col-12 col-md-8">
                          <div class="q-ml-md font-16">
                            <div
                              v-if="
                                checklist.categories &&
                                  checklist.categories.length > 0
                              "
                            >
                              <q-chip
                                v-for="(category, index) in checklist.categories"
                                :key="index"
                                square
                                size="16px"
                                color="yellow-10"
                                text-color="blue"
                              >
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
                            {{ $t("projectContent.tags") }}
                          </h4>
                        </div>
                        <div class="col-12 col-md-8">
                          <div class="q-ml-md font-16">
                            <div v-if="checklist.tags && checklist.tags.length > 0">
                              <q-chip
                                v-for="(tag, index) in checklist.tags"
                                :key="index"
                                square
                                size="16px"
                                color="yellow-10"
                                text-color="blue"
                              >
                                {{ tag.title }}
                              </q-chip>
                            </div>
                          </div>
                        </div>
                      </div>
                    </q-card-section>
                    <q-separator inset class="bg-blue opacity-10" />
                    <q-card-section v-if="checklist.project && checklist.project.id">
                      <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                        {{ $t("project Idea") }}
                      </h4>
                      <InlineProjectView :projectID="checklist.project.id" />
                    </q-card-section>
                    <q-separator inset class="bg-blue opacity-10" />
                    <q-card-section v-if="checklist.funding && checklist.funding.id">
                      <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                        {{ $t("Funding") }}
                      </h4>
                      <InlineFundingView :fundingId="checklist.funding.id" />
                    </q-card-section>
                  </q-card>
                </div>
                <div
                  v-if="
                    (!!checklist.initialContact &&
                      !!checklist.initialContact.captureIdea.active) ||
                      (!!checklist.initialContact &&
                        !!checklist.initialContact.caputreContect.active)
                  "
                  class="col-12 q-mb-md"
                >
                  <q-card
                    class="shadow-1 radius-20"
                    :class="
                      checkProgress(
                        checklist.initialContact.start,
                        checklist.initialContact.end
                      )
                    "
                  >
                    <q-card-section class="q-pa-md items-start q-col-gutter-x-sm">
                      <div class="row">
                        <div class="col-12 col-md-4">
                          <div class="row">
                            <div class="col-12">
                              <h4 class="font-20 text-weight-600 q-mb-xs q-mt-none">
                                {{ $t("Initial discussion with the politics") }}
                              </h4>
                            </div>
                            <div class="col-12 col-md-4">
                              <p class="q-mb-none font-16">
                                {{ $t("start") }}
                              </p>
                            </div>
                            <div class="col-12 col-md-8">
                              <p class="q-mb-none font-16">
                                {{
                                  dateFormatter(
                                    !!checklist.initialContact &&
                                      checklist.initialContact.start
                                  )
                                }}
                              </p>
                            </div>
                            <div class="col-12 col-md-4">
                              <p class="q-mt-sm q-mb-none font-16">
                                {{ $t("end") }}
                              </p>
                            </div>
                            <div class="col-12 col-md-8">
                              <p
                                :class="
                                  $q.screen.gt.sm ? 'q-mt-sm q-mb-none' : 'q-mb-sm'
                                "
                                class="font-16"
                              >
                                {{
                                  dateFormatter(
                                    !!checklist.initialContact &&
                                      checklist.initialContact.end
                                  )
                                }}
                              </p>
                            </div>
                            <!-- responsiblePerson -->
                            <!-- <div class="col-12 col-lg-4">
                              <p class="q-mb-sm q-mt-sm q-mb-none font-16">
                                {{ $t("responsiblePerson") }}
                              </p>
                            </div> -->
                            <!-- <div class="col-12 col-lg-8">
                              <p
                                :class="
                                  $q.screen.gt.lg ? 'q-mb-none' : 'q-mt-sm'
                                "
                                class="font-16"
                              >
                                {{
                                  !!checklist.initialContact &&
                                    checklist.initialContact.responsiblePerson
                                }}
                              </p>
                            </div> -->
                          </div>
                        </div>
                        <div class="col-12 col-md-8">
                          <div
                            v-for="(card, propertyName) in checklist.initialContact"
                            :key="card.sortPosition"
                          >
                            <div
                              v-if="
                                (propertyName !== 'end' ||
                                  propertyName !== 'start' ||
                                  propertyName !== 'id') &&
                                  card.active === true
                              "
                            >
                              <div class="q-mb-sm" style="background:#16428B1A">
                                <div class="q-pa-md font-16">
                                  <div
                                    class="row justify-between items-start q-mb-md"
                                  >
                                    <div>
                                      <p
                                        class="font-18 text-blue text-weight-600 q-ma-none"
                                      >
                                        {{
                                          propertyName === "captureIdea"
                                            ? $t("Capture Project Idea")
                                            : $t("Capture Content")
                                        }}
                                      </p>
                                      <p
                                        v-if="!!card.name"
                                        class="font-14 q-ma-none"
                                      >
                                        {{ card.name || "" }}
                                      </p>
                                    </div>
                                    <div
                                      v-if="
                                        checkProgress(
                                          checklist.initialContact.start,
                                          checklist.initialContact.end
                                        ) !== 'notStarted'
                                      "
                                    >
                                      <q-chip square class="text-weight-600">{{
                                        checkProgress(
                                          checklist.initialContact.start,
                                          checklist.initialContact.end
                                        ) === "done"
                                          ? $t("Done")
                                          : $t("In Progress")
                                      }}</q-chip>
                                    </div>
                                  </div>
                                  <div class="row items-center q-mb-md">
                                    <div
                                      v-if="
                                        propertyName === 'captureIdea' &&
                                          !!card.project &&
                                          card.project.id
                                      "
                                    >
                                      <p class="font-16 text-blue-grey-10 q-ma-none">
                                        {{ $t("Link for Project Idea") }}
                                      </p>
                                      <a
                                        class="q-mb-sm text-blue block text-weight-600 cursor-pointer"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        @click.prevent="
                                          viewProject(card.project.id)
                                        "
                                        >{{ card.project.title }}</a
                                      >
                                    </div>
                                  </div>
                                  <div
                                    v-if="!!card.text"
                                    class="row items-center q-mb-md"
                                  >
                                    <div>
                                      <p class="font-16 text-blue-grey-10 q-ma-none">
                                        {{ $t("Description") }}
                                      </p>
                                      <p
                                        class="font-16 q-ma-none text-block"
                                        v-html="!!card.text ? card.text : ''"
                                      ></p>
                                    </div>
                                  </div>
                                  <div v-if="propertyName === 'captureIdea'">
                                    <div
                                      v-if="card.file && card.file.length > 0"
                                      class="row items-center q-mb-none"
                                    >
                                      <div
                                        v-for="(file, index) in card.file"
                                        :key="index"
                                        class="col-auto q-mr-md"
                                      >
                                      <div>
                                        <span @click="handleOpenDocumentPreviewModal(file)" class="text-blue q-my-sm text-weight-bold cursor-pointer" style="text-decoration: underline;">{{ file.name }} </span>
                                      </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div v-if="propertyName === 'caputreContect'">
                                    <div
                                      v-if="card.file && card.file.length > 0"
                                      class="row items-center q-mb-none"
                                    >
                                      <div
                                        v-for="(file, index) in card.file"
                                        :key="index"
                                        class="col-auto q-mr-md"
                                      >
                                      <div>
                                        <span @click="handleOpenDocumentPreviewModal(file)" class="text-blue q-my-sm text-weight-bold cursor-pointer" style="text-decoration: underline;">{{ file.name }} </span>
                                      </div>

                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div v-if="!!card.tasks && card.tasks.length > 0">
                                <q-expansion-item
                                  expand-icon-class="text-blue"
                                  v-for="task in card.tasks"
                                  :key="task.sortPosition"
                                  style="background:#FDD50033"
                                  class="q-mb-sm"
                                  v-show="task.active === true"
                                >
                                  <template v-slot:header>
                                    <q-item-section>
                                      <p class="font-18 text-weight-600 q-ma-none">
                                        {{ task.name }}
                                      </p>
                                    </q-item-section>
                                  </template>
                                  <q-card>
                                    <div
                                      v-if="
                                        !!task.children && task.children.length > 0
                                      "
                                    >
                                      <div
                                        v-for="item in task.children"
                                        :key="item.sortPosition"
                                      >
                                        <q-card-section
                                          class="q-pl-none q-py-sm q-pr-none"
                                          v-if="item.active === true"
                                        >
                                          <div class="row">
                                            <div class="col-12">
                                              <div
                                                class="row justify-between items-center"
                                              >
                                                <div class="col-10 col-md-11">
                                                  <p class="font-14 q-ma-none">
                                                    {{ item.name }}
                                                  </p>
                                                </div>
                                                <div class="col-auto">
                                                  <q-checkbox
                                                    disable
                                                    color="primary"
                                                    class="isActiveCheckbox font-16 q-py-none"
                                                    :value="item.active"
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </q-card-section>
                                      </div>
                                    </div>
                                  </q-card>
                                </q-expansion-item>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </q-card-section>
                    <q-separator inset class="bg-blue opacity-10" />
                  </q-card>
                </div>
                <div
                  v-if="
                    (!!checklist.preparation &&
                      !!checklist.preparation.inspection.active) ||
                      (!!checklist.preparation &&
                        !!checklist.preparation.captureRequirements.active) ||
                      (!!checklist.preparation &&
                        !!checklist.preparation.captureNeeds.active)
                  "
                  class="col-12 q-mb-md"
                >
                  <q-card
                    class="shadow-1 radius-20"
                    :class="
                      checkProgress(
                        checklist.preparation.start,
                        checklist.preparation.end
                      )
                    "
                  >
                    <q-card-section class="q-pa-md items-start q-col-gutter-x-sm">
                      <div class="row">
                        <div class="col-12 col-md-4">
                          <div class="row">
                            <div class="col-12">
                              <h4 class="font-20 text-weight-600 q-mb-xs q-mt-none">
                                {{
                                  $t(
                                    "Preparation of the project idea outline with internal coordination"
                                  )
                                }}
                              </h4>
                            </div>
                            <div class="col-12 col-md-4">
                              <p class="q-mb-none font-16">{{ $t("start") }}</p>
                            </div>
                            <div class="col-12 col-md-8">
                              <p class="q-mb-none font-16">
                                {{
                                  dateFormatter(
                                    !!checklist.preparation &&
                                      checklist.preparation.start
                                  )
                                }}
                              </p>
                            </div>
                            <div class="col-12 col-md-4">
                              <p class="q-mt-sm q-mb-none font-16">
                                {{ $t("end") }}
                              </p>
                            </div>
                            <div class="col-12 col-md-8">
                              <p
                                :class="
                                  $q.screen.gt.sm ? 'q-mb-none' : 'q-mb-sm'
                                "
                                class="font-16"
                              >
                                {{
                                  dateFormatter(
                                    !!checklist.preparation &&
                                      checklist.preparation.end
                                  )
                                }}
                              </p>
                            </div>
                            <!-- responsiblePerson -->
                            <!-- <div class="col-12 col-lg-4">
                              <p class="q-mb-sm q-mt-sm q-mb-none font-16">
                                {{ $t("responsiblePerson") }}
                              </p>
                            </div> -->
                            <!-- <div class="col-12 col-lg-8">
                              <p
                                :class="
                                  $q.screen.gt.lg ? 'q-mb-none' : 'q-mt-sm'
                                "
                                class="font-16"
                              >
                                {{
                                  !!checklist.preparation &&
                                    checklist.preparation.responsiblePerson
                                }}
                              </p>
                            </div> -->
                          </div>
                        </div>
                        <div class="col-12 col-md-8">
                          <div
                            v-for="(card, propertyName) in checklist.preparation"
                            :key="card.sortPosition"
                          >
                            <div
                              v-if="
                                (propertyName != 'end' ||
                                  propertyName != 'start' ||
                                  propertyName != 'id') &&
                                  card.active === true
                              "
                            >
                              <div class="q-mb-sm" style="background:#16428B1A">
                                <div class="q-pa-md font-16">
                                  <div
                                    class="row justify-between items-start q-mb-md"
                                  >
                                    <div>
                                      <p
                                        class="font-18 text-blue text-weight-600 q-ma-none"
                                      >
                                        {{
                                          propertyName === "inspection"
                                            ? $t("Inspection")
                                            : propertyName === "captureRequirements"
                                            ? $t("Capture requirements")
                                            : propertyName === "captureNeeds"
                                            ? $t("Capture Needs")
                                            : ""
                                        }}
                                      </p>
                                      <p
                                        v-if="!!card.name"
                                        class="font-14 q-ma-none"
                                      >
                                        {{ card.name || "" }}
                                      </p>
                                    </div>
                                    <div
                                      v-if="
                                        checkProgress(
                                          checklist.preparation.start,
                                          checklist.preparation.end
                                        ) !== 'notStarted'
                                      "
                                    >
                                      <q-chip square class="text-weight-600">{{
                                        checkProgress(
                                          checklist.preparation.start,
                                          checklist.preparation.end
                                        ) === "done"
                                          ? $t("Done")
                                          : $t("In Progress")
                                      }}</q-chip>
                                    </div>
                                  </div>

                                  <div
                                    v-if="!!card.text"
                                    class="row items-center q-mb-md"
                                  >
                                    <div>
                                      <p class="font-16 text-blue-grey-10 q-ma-none">
                                        {{ $t("Description") }}
                                      </p>
                                      <p
                                        class="font-16 q-ma-none text-block"
                                        v-html="!!card.text ? card.text : ''"
                                      ></p>
                                    </div>
                                  </div>
                                  <div v-if="propertyName === 'inspection'">
                                    <div
                                      v-if="card.file && card.file.length > 0"
                                      class="row items-center q-mb-none"
                                    >
                                      <div
                                        v-for="(file, index) in card.file"
                                        :key="index"
                                        class="col-auto q-mr-md"
                                      >
                                      <div>
                                        <span @click="handleOpenDocumentPreviewModal(file)" class="text-blue q-my-sm text-weight-bold cursor-pointer" style="text-decoration: underline;">{{ file.name }} </span>
                                      </div>

                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    v-if="propertyName === 'captureRequirements'"
                                  >
                                    <div
                                      v-if="card.file && card.file.length > 0"
                                      class="row items-center q-mb-none"
                                    >
                                      <div
                                        v-for="(file, index) in card.file"
                                        :key="index"
                                        class="col-auto q-mr-md"
                                      >
                                      <div>
                                        <span @click="handleOpenDocumentPreviewModal(file)" class="text-blue q-my-sm text-weight-bold cursor-pointer" style="text-decoration: underline;">{{ file.name }} </span>
                                      </div>

                                      </div>
                                    </div>
                                  </div>
                                  <div v-if="propertyName === 'captureNeeds'">
                                    <div
                                      v-if="card.file && card.file.length > 0"
                                      class="row items-center q-mb-none"
                                    >
                                      <div
                                        v-for="(file, index) in card.file"
                                        :key="index"
                                        class="col-auto q-mr-md"
                                      >
                                      <div>
                                        <span @click="handleOpenDocumentPreviewModal(file)" class="text-blue q-my-sm text-weight-bold cursor-pointer" style="text-decoration: underline;">{{ file.name }} </span>
                                      </div>

                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div v-if="!!card.tasks && card.tasks.length > 0">
                                <q-expansion-item
                                  expand-icon-class="text-blue"
                                  v-for="task in card.tasks"
                                  :key="task.sortPosition"
                                  style="background:#FDD50033"
                                  class="q-mb-sm"
                                  v-show="task.active === true"
                                >
                                  <template v-slot:header>
                                    <q-item-section>
                                      <p class="font-18 text-weight-600 q-ma-none">
                                        {{ task.name }}
                                      </p>
                                    </q-item-section>
                                  </template>
                                  <q-card>
                                    <div
                                      v-if="
                                        !!task.children && task.children.length > 0
                                      "
                                    >
                                      <div
                                        v-for="item in task.children"
                                        :key="item.sortPosition"
                                      >
                                        <q-card-section
                                          horizontal
                                          class="q-pl-none q-py-sm q-pr-none"
                                          v-if="item.active === true"
                                        >
                                          <div class="col-12">
                                            <div
                                              class="row justify-between items-center"
                                            >
                                              <div class="col-10 col-md-11">
                                                <p class="font-14 q-ma-none">
                                                  {{ item.name }}
                                                </p>
                                              </div>
                                              <div class="col-auto">
                                                <q-checkbox
                                                  disable
                                                  color="primary"
                                                  class="isActiveCheckbox font-16 q-py-none"
                                                  :value="item.active"
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </q-card-section>
                                      </div>
                                    </div>
                                  </q-card>
                                </q-expansion-item>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </q-card-section>
                    <q-separator inset class="bg-blue opacity-10" />
                  </q-card>
                </div>
                <div
                  v-if="
                    (!!checklist.fundingResearch &&
                      !!checklist.fundingResearch.checkDatabase.active) ||
                      (!!checklist.fundingResearch &&
                        !!checklist.fundingResearch.checkForFunding.active) ||
                      (!!checklist.fundingResearch &&
                        !!checklist.fundingResearch.checkWithFunding.active) ||
                      (!!checklist.fundingResearch &&
                      !!checklist.fundingResearch.checkGuildlines.active) ||
                      (!!checklist.fundingResearch &&
                      !!checklist.fundingResearch.selectFunding.active)
                  "
                  class="col-12 q-mb-md"
                >
                  <q-card
                    :class="
                      checkProgress(
                        checklist.fundingResearch.start,
                        checklist.fundingResearch.end
                      )
                    "
                    class="shadow-1 radius-20"
                  >
                    <q-card-section class="q-pa-md items-start q-col-gutter-x-sm">
                      <div class="row">
                        <div class="col-12 col-md-4">
                          <div class="row">
                            <div class="col-12">
                              <h4 class="font-20 text-weight-600 q-mb-xs q-mt-none">
                                {{ $t("Funding research") }}
                              </h4>
                            </div>
                            <div class="col-12 col-md-4">
                              <p class="q-mb-none font-16">{{ $t("start") }}</p>
                            </div>
                            <div class="col-12 col-md-8">
                              <p class="q-mb-none font-16">
                                {{
                                  dateFormatter(
                                    !!checklist.fundingResearch &&
                                      checklist.fundingResearch.start
                                  )
                                }}
                              </p>
                            </div>
                            <div class="col-12 col-md-4">
                              <p class="q-mt-sm q-mb-none font-16">
                                {{ $t("end") }}
                              </p>
                            </div>
                            <div class="col-12 col-md-8">
                              <p
                                :class="
                                  $q.screen.gt.sm ? 'q-mb-none' : 'q-mb-sm'
                                "
                                class="font-16"
                              >
                                {{
                                  dateFormatter(
                                    !!checklist.fundingResearch &&
                                      checklist.fundingResearch.end
                                  )
                                }}
                              </p>
                            </div>
                            <!-- responsiblePerson -->
                            <!-- <div class="col-12 col-lg-4">
                              <p class="q-mb-sm q-mt-sm q-mb-none font-16">
                                {{ $t("responsiblePerson") }}
                              </p>
                            </div> -->
                            <!-- <div class="col-12 col-lg-8">
                              <p
                                :class="
                                  $q.screen.gt.lg ? 'q-mb-none' : 'q-mt-sm'
                                "
                                class="font-16"
                              >
                                {{
                                  !!checklist.fundingResearch &&
                                    checklist.fundingResearch.responsiblePerson
                                }}
                              </p>
                            </div> -->
                          </div>
                        </div>
                        <div class="col-12 col-md-8">
                          <div
                            v-for="(card,
                            propertyName) in sortedFundingResearch"
                            :key="card.sortPosition"
                          >
                            <div
                              v-if="
                                (propertyName != 'end' ||
                                  propertyName != 'start' ||
                                  propertyName != 'id') &&
                                  card.active === true
                              "
                            >
                              <div class="q-mb-sm" style="background:#16428B1A">
                                <div class="q-pa-md font-16">
                                  <div
                                    class="row justify-between items-start q-mb-md"
                                  >
                                    <div>
                                      <p
                                        class="font-18 text-blue text-weight-600 q-ma-none"
                                      >
                                        {{
                                          propertyName === "checkDatabase"
                                            ? $t("Check database “Fundings”")
                                            : propertyName === "checkForFunding"
                                            ? $t("Check for funding scouting")
                                            : propertyName === "checkWithFunding"
                                            ? $t(
                                                "Joint research for funding or check of the project idea"
                                              )
                                            : propertyName === "checkGuildlines"
                                            ? $t("Check Guidlines (long version)")
                                            : propertyName === "selectFunding"
                                  ? $t("Select Funding") : ""
                                        }}
                                      </p>
                                      <p
                                        v-if="!!card.name"
                                        class="font-14 q-ma-none"
                                      >
                                        {{ card.name || "" }}
                                      </p>
                                    </div>
                                    <div
                                      v-if="
                                        checkProgress(
                                          checklist.fundingResearch.start,
                                          checklist.fundingResearch.end
                                        ) !== 'notStarted'
                                      "
                                    >
                                      <q-chip square class="text-weight-600">{{
                                        checkProgress(
                                          checklist.fundingResearch.start,
                                          checklist.fundingResearch.end
                                        ) === "done"
                                          ? $t("Done")
                                          : $t("In Progress")
                                      }}</q-chip>
                                    </div>
                                  </div>
                                  <div
                                    v-if="!!card.text"
                                    class="row items-center q-mb-md"
                                  >
                                    <div>
                                      <p class="font-16 text-blue-grey-10 q-ma-none">
                                        {{ $t("Description") }}
                                      </p>
                                      <p
                                        class="font-16 q-ma-none text-block"
                                        v-html="!!card.text ? card.text : ''"
                                      ></p>
                                    </div>
                                  </div>
                                  <div v-if="propertyName === 'selectFunding' && checklist.funding">
                                    <a
                                          class="q-mb-sm text-blue block text-weight-600 cursor-pointer"
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          @click.prevent="
                                            viewFunding(checklist.funding.id)
                                          "
                                          >{{ checklist.funding.title }}</a
                                        >
                                  </div>
                                  <div v-if="propertyName === 'checkDatabase'">
                                    <div
                                      v-if="card.file && card.file.length > 0"
                                      class="row items-center q-mb-none"
                                    >
                                      <div
                                        v-for="(file, index) in card.file"
                                        :key="index"
                                        class="col-auto q-mr-md"
                                      >
                                      <div>
                                        <span @click="handleOpenDocumentPreviewModal(file)" class="text-blue q-my-sm text-weight-bold cursor-pointer" style="text-decoration: underline;">{{ file.name }} </span>
                                      </div>

                                      </div>
                                    </div>
                                  </div>
                                  <div v-if="propertyName === 'checkForFunding'">
                                    <div
                                      v-if="card.file && card.file.length > 0"
                                      class="row items-center q-mb-none"
                                    >
                                      <div
                                        v-for="(file, index) in card.file"
                                        :key="index"
                                        class="col-auto q-mr-md"
                                      >
                                      <div>
                                        <span @click="handleOpenDocumentPreviewModal(file)" class="text-blue q-my-sm text-weight-bold cursor-pointer" style="text-decoration: underline;">{{ file.name }} </span>
                                      </div>

                                      </div>
                                    </div>
                                  </div>
                                  <div v-if="propertyName === 'checkWithFunding'">
                                    <div
                                      v-if="card.file && card.file.length > 0"
                                      class="row items-center q-mb-none"
                                    >
                                      <div
                                        v-for="(file, index) in card.file"
                                        :key="index"
                                        class="col-auto q-mr-md"
                                      >
                                      <div>
                                        <span @click="handleOpenDocumentPreviewModal(file)" class="text-blue q-my-sm text-weight-bold cursor-pointer" style="text-decoration: underline;">{{ file.name }} </span>
                                      </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div v-if="propertyName === 'checkGuildlines'">
                                    <div
                                      v-if="card.file && card.file.length > 0"
                                      class="row items-center q-mb-none"
                                    >
                                      <div
                                        v-for="(file, index) in card.file"
                                        :key="index"
                                        class="col-auto q-mr-md"
                                      >
                                      <div>
                                        <span @click="handleOpenDocumentPreviewModal(file)" class="text-blue q-my-sm text-weight-bold cursor-pointer" style="text-decoration: underline;">{{ file.name }} </span>
                                      </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div v-if="!!card.tasks && card.tasks.length > 0">
                                <q-expansion-item
                                  expand-icon-class="text-blue"
                                  v-for="task in card.tasks"
                                  :key="task.sortPosition"
                                  style="background:#FDD50033"
                                  class="q-mb-sm"
                                  v-show="task.active === true"
                                >
                                  <template v-slot:header>
                                    <q-item-section>
                                      <p class="font-18 text-weight-600 q-ma-none">
                                        {{ task.name }}
                                      </p>
                                    </q-item-section>
                                  </template>
                                  <q-card>
                                    <div
                                      v-if="
                                        !!task.children && task.children.length > 0
                                      "
                                    >
                                      <div
                                        v-for="item in task.children"
                                        :key="item.sortPosition"
                                      >
                                        <q-card-section
                                          horizontal
                                          v-if="item.active === true"
                                          class="q-pl-none q-py-sm q-pr-none"
                                        >
                                          <div class="col-12">
                                            <div
                                              class="row justify-between items-center"
                                            >
                                              <div class="col-10 col-md-11">
                                                <p class="font-14 q-ma-none">
                                                  {{ item.name }}
                                                </p>
                                              </div>
                                              <div class="col-auto">
                                                <q-checkbox
                                                  disable
                                                  color="primary"
                                                  class="isActiveCheckbox font-16 q-py-none"
                                                  :value="item.active"
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </q-card-section>
                                      </div>
                                    </div>
                                  </q-card>
                                </q-expansion-item>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </q-card-section>
                    <q-separator inset class="bg-blue opacity-10" />
                  </q-card>
                </div>
                <div
                  v-if="
                    (!!checklist.preparationOfProject &&
                      !!checklist.preparationOfProject.checkContent.active) ||
                      (!!checklist.preparationOfProject &&
                        !!checklist.preparationOfProject.checkCooperations
                          .active) ||
                      (!!checklist.preparationOfProject &&
                        !!checklist.preparationOfProject.checkSimilarProejcts
                          .active) ||
                      (!!checklist.preparationOfProject &&
                        !!checklist.preparationOfProject.checkPlanning.active)
                  "
                  class="col-12 q-mb-md"
                >
                  <q-card
                    :class="
                      checkProgress(
                        checklist.preparationOfProject.start,
                        checklist.preparationOfProject.end
                      )
                    "
                    class="shadow-1 radius-20"
                  >
                    <q-card-section class="q-pa-md items-start q-col-gutter-x-sm">
                      <div class="row">
                        <div class="co-12 col-md-4">
                          <div class="row">
                            <div class="col-12">
                              <h4 class="font-20 text-weight-600 q-mb-xs q-mt-none">
                                {{
                                  $t(
                                    "Preparation/optimisation of project documents"
                                  )
                                }}
                              </h4>
                            </div>
                            <div class="col-12 col-md-4">
                              <p class="q-mb-none font-16">{{ $t("start") }}</p>
                            </div>
                            <div class="col-12 col-md-8">
                              <p class="q-mb-none font-16">
                                {{
                                  dateFormatter(
                                    !!checklist.preparationOfProject &&
                                      checklist.preparationOfProject.start
                                  )
                                }}
                              </p>
                            </div>
                            <div class="col-12 col-md-4">
                              <p class="q-mt-sm q-mb-none font-16">
                                {{ $t("end") }}
                              </p>
                            </div>
                            <div class="col-12 col-md-8">
                              <p
                                :class="
                                  $q.screen.gt.sm ? 'q-mb-none' : 'q-mb-sm'
                                "
                                class="font-16"
                              >
                                {{
                                  dateFormatter(
                                    !!checklist.preparationOfProject &&
                                      checklist.preparationOfProject.end
                                  )
                                }}
                              </p>
                            </div>
                            <!-- responsiblePerson -->
                            <!-- <div class="col-12 col-lg-4">
                              <p class="q-mb-sm q-mt-sm q-mb-none font-16">
                                {{ $t("responsiblePerson") }}
                              </p>
                            </div> -->
                            <!-- <div class="col-12 col-lg-8">
                              <p
                                :class="
                                  $q.screen.gt.lg ? 'q-mb-none' : 'q-mt-sm'
                                "
                                class="font-16"
                              >
                                {{
                                  !!checklist.preparationOfProject &&
                                    checklist.preparationOfProject.responsiblePerson
                                }}
                              </p>
                            </div> -->
                          </div>
                        </div>
                        <div class="col-12 col-md-8">
                          <div
                            v-for="(card,
                            propertyName) in sortedPreparationOfProject"
                            :key="card.sortPosition"
                          >
                            <div
                              v-if="
                                (propertyName != 'end' ||
                                  propertyName != 'start' ||
                                  propertyName != 'id') &&
                                  card.active === true
                              "
                            >
                              <div class="q-mb-sm" style="background:#16428B1A">
                                <div class="q-pa-md font-16">
                                  <div
                                    class="row justify-between items-start q-mb-md"
                                  >
                                    <div>
                                      <p
                                        class="font-18 text-blue text-weight-600 q-ma-none"
                                      >
                                        {{
                                          propertyName === "checkContent"
                                            ? $t("Check Content with Guidelines")
                                            : propertyName === "checkCooperations"
                                            ? $t("If necessary check cooperations")
                                            : propertyName ===
                                              "checkSimilarProejcts"
                                            ? $t(
                                                "If necessary check similar projects"
                                              )
                                            : propertyName === "checkPlanning"
                                            ? $t(
                                                "Check planning and financing with all relevant departments"
                                              )
                                            : ""
                                        }}
                                      </p>
                                      <p
                                        v-if="!!card.name"
                                        class="font-14 q-ma-none"
                                      >
                                        {{ card.name || "" }}
                                      </p>
                                    </div>
                                    <div
                                      v-if="
                                        checkProgress(
                                          checklist.preparationOfProject.start,
                                          checklist.preparationOfProject.end
                                        ) !== 'notStarted'
                                      "
                                    >
                                      <q-chip square class="text-weight-600">{{
                                        checkProgress(
                                          checklist.preparationOfProject.start,
                                          checklist.preparationOfProject.end
                                        ) === "done"
                                          ? $t("Done")
                                          : $t("In Progress")
                                      }}</q-chip>
                                    </div>
                                  </div>
                                  <div
                                    v-if="!!card.text"
                                    class="row items-center q-mb-md"
                                  >
                                    <div>
                                      <p class="font-16 text-blue-grey-10 q-ma-none">
                                        {{ $t("Description") }}
                                      </p>
                                      <p
                                        class="font-16 q-ma-none text-block"
                                        v-html="!!card.text ? card.text : ''"
                                      ></p>
                                    </div>
                                  </div>
                                  <div v-if="propertyName === 'checkContent'">
                                    <div
                                      v-if="card.file && card.file.length > 0"
                                      class="row items-center q-mb-none"
                                    >
                                      <div
                                        v-for="(file, index) in card.file"
                                        :key="index"
                                        class="col-auto q-mr-md"
                                      >
                                      <div>
                                        <span @click="handleOpenDocumentPreviewModal(file)" class="text-blue q-my-sm text-weight-bold cursor-pointer" style="text-decoration: underline;">{{ file.name }} </span>
                                      </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div v-if="propertyName === 'checkCooperations'">
                                    <div
                                      v-if="card.file && card.file.length > 0"
                                      class="row items-center q-mb-none"
                                    >
                                      <div
                                        v-for="(file, index) in card.file"
                                        :key="index"
                                        class="col-auto q-mr-md"
                                      >
                                      <div>
                                        <span @click="handleOpenDocumentPreviewModal(file)" class="text-blue q-my-sm text-weight-bold cursor-pointer" style="text-decoration: underline;">{{ file.name }} </span>
                                      </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    v-if="propertyName === 'checkSimilarProejcts'"
                                  >
                                    <div
                                      v-if="card.file && card.file.length > 0"
                                      class="row items-center q-mb-none"
                                    >
                                      <div
                                        v-for="(file, index) in card.file"
                                        :key="index"
                                        class="col-auto q-mr-md"
                                      >
                                      <div>
                                        <span @click="handleOpenDocumentPreviewModal(file)" class="text-blue q-my-sm text-weight-bold cursor-pointer" style="text-decoration: underline;">{{ file.name }} </span>
                                      </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div v-if="propertyName === 'checkPlanning'">
                                    <div
                                      v-if="card.file && card.file.length > 0"
                                      class="row items-center q-mb-none"
                                    >
                                      <div
                                        v-for="(file, index) in card.file"
                                        :key="index"
                                        class="col-auto q-mr-md"
                                      >
                                      <div>
                                        <span @click="handleOpenDocumentPreviewModal(file)" class="text-blue q-my-sm text-weight-bold cursor-pointer" style="text-decoration: underline;">{{ file.name }} </span>
                                      </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div v-if="!!card.tasks && card.tasks.length > 0">
                                <q-expansion-item
                                  expand-icon-class="text-blue"
                                  v-for="task in card.tasks"
                                  :key="task.sortPosition"
                                  style="background:#FDD50033"
                                  class="q-mb-sm"
                                  v-show="task.active === true"
                                >
                                  <template v-slot:header>
                                    <q-item-section>
                                      <p class="font-18 text-weight-600 q-ma-none">
                                        {{ task.name }}
                                      </p>
                                    </q-item-section>
                                  </template>
                                  <q-card>
                                    <div
                                      v-if="
                                        !!task.children && task.children.length > 0
                                      "
                                    >
                                      <div
                                        v-for="item in task.children"
                                        :key="item.sortPosition"
                                      >
                                        <q-card-section
                                          horizontal
                                          v-if="item.active === true"
                                          class="q-pl-none q-py-sm q-pr-none"
                                        >
                                          <div class="col-12">
                                            <div
                                              class="row justify-between items-center"
                                            >
                                              <div class="col-10 col-md-11">
                                                <p class="font-14 q-ma-none">
                                                  {{ item.name }}
                                                </p>
                                              </div>
                                              <div class="col-auto">
                                                <q-checkbox
                                                  disable
                                                  color="primary"
                                                  class="isActiveCheckbox font-16 q-py-none"
                                                  :value="item.active"
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </q-card-section>
                                      </div>
                                    </div>
                                  </q-card>
                                </q-expansion-item>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </q-card-section>
                    <q-separator inset class="bg-blue opacity-10" />
                  </q-card>
                </div>
                <div
                  v-if="
                    !!checklist.legitimation &&
                      !!checklist.legitimation.template.active
                  "
                  class="col-12 q-mb-md"
                >
                  <q-card
                    :class="
                      checkProgress(
                        checklist.legitimation.start,
                        checklist.legitimation.end
                      )
                    "
                    class="shadow-1 radius-20"
                  >
                    <q-card-section class="q-pa-md items-start q-col-gutter-x-sm">
                      <div class="row">
                        <div class="col-12 col-md-4">
                          <div class="row">
                            <div class="col-12">
                              <h4 class="font-20 text-weight-600 q-mb-xs q-mt-none">
                                {{ $t("Legitimation for submission") }}
                              </h4>
                            </div>
                            <div class="col-12 col-md-4">
                              <p class="q-mb-none font-16">{{ $t("start") }}</p>
                            </div>
                            <div class="col-12 col-md-8">
                              <p class="q-mb-none font-16">
                                {{
                                  dateFormatter(
                                    !!checklist.legitimation &&
                                      checklist.legitimation.start
                                  )
                                }}
                              </p>
                            </div>
                            <div class="col-12 col-md-4">
                              <p class="q-mt-sm q-mb-none font-16">
                                {{ $t("end") }}
                              </p>
                            </div>
                            <div class="col-12 col-md-8">
                              <p
                                :class="
                                  $q.screen.gt.sm ? 'q-mb-none' : 'q-mb-sm'
                                "
                                class="font-16"
                              >
                                {{
                                  dateFormatter(
                                    !!checklist.legitimation &&
                                      checklist.legitimation.end
                                  )
                                }}
                              </p>
                            </div>
                            <!-- responsiblePerson -->
                            <!-- <div class="col-12">
                              <p class="q-mt-sm q-mb-none font-16">
                                {{ $t("responsiblePerson") }}
                              </p>
                            </div> -->
                            <!-- <div class="col-12">
                              <p
                                :class="
                                  $q.screen.gt.sm ? 'q-mb-none' : 'q-mt-sm'
                                "
                                class="font-16"
                              >
                                {{
                                  !!checklist.legitimation &&
                                    checklist.legitimation.responsiblePerson
                                }}
                              </p>
                            </div> -->
                          </div>
                        </div>
                        <div class="col-12 col-md-8">
                          <div
                            v-for="(card, propertyName) in sortedLegitimation"
                            :key="card.sortPosition"
                          >
                            <div
                              v-if="
                                (propertyName != 'end' ||
                                  propertyName != 'start' ||
                                  propertyName != 'id') &&
                                  card.active === true
                              "
                            >
                              <div class="q-mb-sm" style="background:#16428B1A">
                                <div class="q-pa-md font-16">
                                  <div
                                    class="row justify-between items-start q-mb-md"
                                  >
                                    <div>
                                      <p
                                        class="font-18 text-blue text-weight-600 q-ma-none"
                                      >
                                        {{
                                          propertyName === "template"
                                            ? $t(
                                                "Presentation/discussion of the project documents"
                                              )
                                            : ""
                                        }}
                                      </p>
                                      <p
                                        v-if="!!card.name"
                                        class="font-14 q-ma-none"
                                      >
                                        {{ card.name || "" }}
                                      </p>
                                    </div>
                                    <div
                                      v-if="
                                        checkProgress(
                                          checklist.legitimation.start,
                                          checklist.legitimation.end
                                        ) !== 'notStarted'
                                      "
                                    >
                                      <q-chip square class="text-weight-600">{{
                                        checkProgress(
                                          checklist.legitimation.start,
                                          checklist.legitimation.end
                                        ) === "done"
                                          ? $t("Done")
                                          : $t("In Progress")
                                      }}</q-chip>
                                    </div>
                                  </div>

                                  <div
                                    v-if="!!card.text"
                                    class="row items-center q-mb-md"
                                  >
                                    <div>
                                      <p class="font-16 text-blue-grey-10 q-ma-none">
                                        {{ $t("Description") }}
                                      </p>
                                      <p
                                        class="font-16 q-ma-none text-block"
                                        v-html="!!card.text ? card.text : ''"
                                      ></p>
                                    </div>
                                  </div>
                                  <div v-if="propertyName === 'template'">
                                    <div
                                      v-if="card.file && card.file.length > 0"
                                      class="row items-center q-mb-none"
                                    >
                                      <div
                                        v-for="(file, index) in card.file"
                                        :key="index"
                                        class="col-auto q-mr-md"
                                      >
                                      <div>
                                        <span @click="handleOpenDocumentPreviewModal(file)" class="text-blue q-my-sm text-weight-bold cursor-pointer" style="text-decoration: underline;">{{ file.name }} </span>
                                      </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div v-if="!!card.tasks && card.tasks.length > 0">
                                <q-expansion-item
                                  expand-icon-class="text-blue"
                                  v-for="task in card.tasks"
                                  :key="task.sortPosition"
                                  style="background:#FDD50033"
                                  class="q-mb-sm"
                                  v-show="task.active === true"
                                >
                                  <template v-slot:header>
                                    <q-item-section>
                                      <p class="font-18 text-weight-600 q-ma-none">
                                        {{ task.name }}
                                      </p>
                                    </q-item-section>
                                  </template>
                                  <q-card>
                                    <div
                                      v-if="
                                        !!task.children && task.children.length > 0
                                      "
                                    >
                                      <div
                                        v-for="item in task.children"
                                        :key="item.sortPosition"
                                      >
                                        <q-card-section
                                          horizontal
                                          v-if="item.active === true"
                                          class="q-pl-none q-py-sm q-pr-none"
                                        >
                                          <div class="col-12">
                                            <div
                                              class="row justify-between items-center"
                                            >
                                              <div class="col-10 col-md-11">
                                                <p class="font-14 q-ma-none">
                                                  {{ item.name }}
                                                </p>
                                              </div>
                                              <div class="col-auto">
                                                <q-checkbox
                                                  disable
                                                  color="primary"
                                                  class="isActiveCheckbox font-16 q-py-none"
                                                  :value="item.active"
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </q-card-section>
                                      </div>
                                    </div>
                                  </q-card>
                                </q-expansion-item>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </q-card-section>
                    <q-separator inset class="bg-blue opacity-10" />
                  </q-card>
                </div>
                <div
                  v-if="
                    (!!checklist.finalExamination &&
                      !!checklist.finalExamination.signatures.active) ||
                      (!!checklist.finalExamination &&
                        !!checklist.finalExamination.revision.active)
                  "
                  class="col-12 q-mb-md"
                >
                  <q-card
                    :class="
                      checkProgress(
                        checklist.finalExamination.start,
                        checklist.finalExamination.end
                      )
                    "
                    class="shadow-1 radius-20"
                  >
                    <q-card-section class="q-pa-md items-start q-col-gutter-x-sm">
                      <div class="row">
                        <div class="col-12 col-md-4">
                          <div class="row">
                            <div class="col-12">
                              <h4 class="font-20 text-weight-600 q-mb-xs q-mt-none">
                                {{
                                  $t("Final examination of the project documents")
                                }}
                              </h4>
                            </div>
                            <div class="col-12 col-md-4">
                              <p class="q-mb-none font-16">{{ $t("start") }}</p>
                            </div>
                            <div class="col-12 col-md-8">
                              <p class="q-mb-none font-16">
                                {{
                                  dateFormatter(
                                    !!checklist.finalExamination &&
                                      checklist.finalExamination.start
                                  )
                                }}
                              </p>
                            </div>
                            <div class="col-12 col-md-4">
                              <p class="q-mt-sm q-mb-none font-16">
                                {{ $t("end") }}
                              </p>
                            </div>
                            <div class="col-12 col-md-8">
                              <p
                                :class="
                                  $q.screen.gt.sm ? 'q-mb-none' : 'q-mb-sm'
                                "
                                class="font-16"
                              >
                                {{
                                  dateFormatter(
                                    !!checklist.finalExamination &&
                                      checklist.finalExamination.end
                                  )
                                }}
                              </p>
                            </div>
                            <!-- responsiblePerson -->
                            <!-- <div class="col-12 col-lg-4">
                              <p class="q-mb-sm q-mt-sm q-mb-none font-16">
                                {{ $t("responsiblePerson") }}
                              </p>
                            </div> -->
                            <!-- <div class="col-12 col-lg-8">
                              <p
                                :class="
                                  $q.screen.gt.lg ? 'q-mb-none' : 'q-mt-sm'
                                "
                                class="font-16"
                              >
                                {{
                                  !!checklist.finalExamination &&
                                    checklist.finalExamination.responsiblePerson
                                }}
                              </p>
                            </div> -->
                          </div>
                        </div>
                        <div class="col-12 col-md-8">
                          <div
                            v-for="(card,
                            propertyName) in sortedFinalExamination"
                            :key="card.sortPosition"
                          >
                            <div
                              v-if="
                                (propertyName != 'end' ||
                                  propertyName != 'start' ||
                                  propertyName != 'id') &&
                                  card.active === true
                              "
                            >
                              <div class="q-mb-sm" style="background:#16428B1A">
                                <div class="q-pa-md font-16">
                                  <div
                                    class="row justify-between items-start q-mb-md"
                                  >
                                    <div>
                                      <p
                                        class="font-18 text-blue text-weight-600 q-ma-none"
                                      >
                                        {{
                                          propertyName === "signatures"
                                            ? $t("Collection of signatures")
                                            : propertyName === "revision"
                                            ? $t("Revision of project documents")
                                            : ""
                                        }}
                                      </p>
                                      <p
                                        v-if="!!card.name"
                                        class="font-14 q-ma-none"
                                      >
                                        {{ card.name || "" }}
                                      </p>
                                    </div>
                                    <div
                                      v-if="
                                        checkProgress(
                                          checklist.finalExamination.start,
                                          checklist.finalExamination.end
                                        ) !== 'notStarted'
                                      "
                                    >
                                      <q-chip square class="text-weight-600">{{
                                        checkProgress(
                                          checklist.finalExamination.start,
                                          checklist.finalExamination.end
                                        ) === "done"
                                          ? $t("Done")
                                          : $t("In Progress")
                                      }}</q-chip>
                                    </div>
                                  </div>

                                  <div
                                    v-if="!!card.text"
                                    class="row items-center q-mb-md"
                                  >
                                    <div>
                                      <p class="font-16 text-blue-grey-10 q-ma-none">
                                        {{ $t("Description") }}
                                      </p>
                                      <p
                                        class="font-16 q-ma-none text-block"
                                        v-html="!!card.text ? card.text : ''"
                                      ></p>
                                    </div>
                                  </div>
                                  <div v-if="propertyName === 'signatures'">
                                    <div
                                      v-if="card.file && card.file.length > 0"
                                      class="row items-center q-mb-none"
                                    >
                                      <div
                                        v-for="(file, index) in card.file"
                                        :key="index"
                                        class="col-auto q-mr-md"
                                      >
                                      <div>
                                        <span @click="handleOpenDocumentPreviewModal(file)" class="text-blue q-my-sm text-weight-bold cursor-pointer" style="text-decoration: underline;">{{ file.name }} </span>
                                      </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div v-if="propertyName === 'revision'">
                                    <div
                                      v-if="card.file && card.file.length > 0"
                                      class="row items-center q-mb-none"
                                    >
                                      <div
                                        v-for="(file, index) in card.file"
                                        :key="index"
                                        class="col-auto q-mr-md"
                                      >
                                      <div>
                                        <span @click="handleOpenDocumentPreviewModal(file)" class="text-blue q-my-sm text-weight-bold cursor-pointer" style="text-decoration: underline;">{{ file.name }} </span>
                                      </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div v-if="!!card.tasks && card.tasks.length > 0">
                                <q-expansion-item
                                  expand-icon-class="text-blue"
                                  v-for="task in card.tasks"
                                  :key="task.sortPosition"
                                  style="background:#FDD50033"
                                  class="q-mb-sm"
                                  v-show="task.active === true"
                                >
                                  <template v-slot:header>
                                    <q-item-section>
                                      <p class="font-18 text-weight-600 q-ma-none">
                                        {{ task.name }}
                                      </p>
                                    </q-item-section>
                                  </template>
                                  <q-card>
                                    <div
                                      v-if="
                                        !!task.children && task.children.length > 0
                                      "
                                    >
                                      <div
                                        v-for="item in task.children"
                                        :key="item.sortPosition"
                                      >
                                        <q-card-section
                                          horizontal
                                          v-if="item.active === true"
                                          class="q-pl-none q-py-sm q-pr-none"
                                        >
                                          <div class="col-12">
                                            <div
                                              class="row justify-between items-center"
                                            >
                                              <div class="col-10 col-md-11">
                                                <p class="font-14 q-ma-none">
                                                  {{ item.name }}
                                                </p>
                                              </div>
                                              <div class="col-auto">
                                                <q-checkbox
                                                  disable
                                                  color="primary"
                                                  class="isActiveCheckbox font-16 q-py-none"
                                                  :value="item.active"
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </q-card-section>
                                      </div>
                                    </div>
                                  </q-card>
                                </q-expansion-item>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </q-card-section>
                    <q-separator inset class="bg-blue opacity-10" />
                  </q-card>
                </div>
              </div>
            </div>
          </div>
    </div>
    <DeleteDialog
      :id="itemId"
      :tab="tab"
      :dialogState="deleteDialog"
      @update="closeDeleteDialog($event), (itemId = null)"
    />
    <ArchiveDialog
      :id="itemId"
      :tab="tab"
      :dialogState="archiveDialog"
      @update="closeArchiveDialog($event), (itemId = null)"
    />
    <RequestAccessDialog
      :id="itemId"
      :tab="tab"
      :type="type"
      :dialogState="requestDialog"
      @update="
        (requestDialog = $event),
          (itemId = null),
          (type = null),
          (editIsLoading = false),
          (duplicateIsLoading = false)
      "
    />
    <DocumentTransferDialog
      v-if="!!checklist && !!checklist.id && (checklist.owner.id === loggedInUser.id || isAdmin)"
      :id="itemId"
      type="checklist"
      :dialogState="documentTransferDialog"
      @update="closeDocumentTransferDialog($event), (itemId = null)"
    />
    <q-dialog v-model="openDocumentPreviewModal" full-width>
      <q-card>
        <q-card-section style="max-height: 70vh;" class="scroll">
          <iframe
            className="doc"
            title="file"
            :src="previewDocumentData"
            style="width: 100%; height: 70vh; border-style: none;"
            type="application/pdf"
          />
          <div style="width: 80px; height: 80px; position: absolute; opacity: 0; right: 0px; top: 0px;">&nbsp;</div>
        </q-card-section>

      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { dateFormatter } from "src/boot/dateFormatter";
import { QSpinnerGears } from 'quasar'
import DeleteDialog from "components/data/DeleteDialog.vue";
import ArchiveDialog from "components/data/ArchiveDialog.vue";
import RequestAccessDialog from "components/data/RequestAccessDialog.vue";
import InlineProjectView from "components/projects/view/InlineProjectView.vue";
import InlineFundingView from "components/funding/view/InlineFundingView.vue";
import DocumentTransferDialog from "components/DocumentTransferDialog.vue";
import VueHtml2pdf from "vue-html2pdf";

export default {
  name: "checklistContent",
  data() {
    return {
      slide: 1,
      isLoading: false,
      itemId: null,
      type: null,
      tab: "implementationChecklist",
      openDocumentPreviewModal: false,
      previewDocumentData: null,
      deleteDialog: false,
      archiveDialog: false,
      documentTransferDialog: false,
      requestDialog: false,
      editIsLoading: false,
      deleteIsLoading: false,
      archiveIsLoading: false,
      watchlistIsLoading: false,
      duplicateIsLoading: false
    };
  },
  components: {
    DeleteDialog,
    InlineProjectView,
    ArchiveDialog,
    RequestAccessDialog,
    DocumentTransferDialog,
    InlineFundingView,
    VueHtml2pdf
  },
  watch: {
    $route(to, from) {
      if (
        (to.params && to.params.id) !==
        (this.$store.state.implementationChecklist.checklist &&
          this.$store.state.implementationChecklist.checklist.id)
      ) {
        this.getNewData(to.params.id);
      }
    }
  },
  methods: {
    dateFormatter,
    closeDeleteDialog(val) {
      this.deleteDialog = val;
      if (!!this.checklist && !this.checklist.id) {
        this.$router.go(-1);
      }
    },
    closeArchiveDialog(val) {
      this.archiveDialog = val;
      if (!!this.checklist && this.checklist.archived === true) {
        this.$router.go(-1);
      }
    },
    closeDocumentTransferDialog(val) {
      this.documentTransferDialog = val;
      if (!!this.checklist && this.checklist.id) {
        this.documentTransferDialog = false;
      }
    },
    async getData() {
      this.$q.loading.show();
      await this.$store.dispatch(
        "implementationChecklist/getSpecificChecklist",
        {
          id: Number(this.$route.params.id)
        }
      );
      this.$q.loading.hide();
    },
    async getNewData(id) {
      if (!!id) {
        this.$q.loading.show();
        await this.$store.dispatch(
          "implementationChecklist/getSpecificChecklist",
          {
            id: id
          }
        );
        this.$q.loading.hide();
      }
    },
    async handleRequest(val, id) {
      const res = await this.$store.dispatch("userCenter/manageRequest", {
        id,
        val
      });
      this.getData();
    },
    checkProgress(start, end) {
      const currentDate = new Date();
      const startDate = new Date(start);
      const endDate = new Date(end);
      if (currentDate < startDate) {
        return "notStarted";
      } else if (currentDate > endDate) {
        return "done";
      } else {
        return "inProgress";
      }
    },
    async viewFunding(id) {
      if (!!id) {
        this.$router.push({ path: `/user/newFunding/${id}` });
      }
    },
    async viewProject(id) {
      if (!!id) {
        this.viewIsLoading = true;
        this.$router.push({ path: `/user/newProjectIdea/${id}` });
      }
    },
    async handleOpenDocumentPreviewModal (file) {
      this.openDocumentPreviewModal = true;
      this.previewDocumentData = `https://pdf.foerderscouting-plattform.de/generic/web/viewer_readonly.html?file=${process.env.VUE_APP_MAIN_URL}/api/file/${file.id}?token=${this.$store.state.userCenter.user.jwt}`;
    },
    async addToWatchlist() {
      this.watchlistIsLoading = true;
      const id = !!this.checklist && this.checklist.id;
      await this.$store.dispatch("implementationChecklist/addToWatchlist", {
        id: id
      });
      this.watchlistIsLoading = false;
    },
    async editChecklist() {
      this.editIsLoading = true;
      const id = !!this.checklist && this.checklist.id;

      if (
        !!this.checklist &&
        (!!this.checklist &&
          !!this.checklist.owner &&
          this.checklist.owner.id) !==
          (!!this.loggedInUser && this.loggedInUser.id) &&
        !this.isAdmin
      ) {
        const hasEditorAccess =
          !!this.checklist &&
          !!this.checklist.editors &&
          this.checklist.editors.filter(
            user => user.id === (!!this.loggedInUser && this.loggedInUser.id)
          );
        if (hasEditorAccess.length > 0) {
          this.$router.push({ path: `/user/newChecklist/edit/${id}` });
        } else {
          this.itemId = !!this.checklist && this.checklist.id;
          this.type = "edit";
          this.requestDialog = true;
        }
      } else {
        this.$router.push({ path: `/user/newChecklist/edit/${id}` });
      }
    },
    async duplicateChecklist() {
      this.duplicateIsLoading = true;
      const id = !!this.checklist && this.checklist.id;
      if (
        !!this.checklist &&
        this.checklist.visibility !== "all users" &&
        (!!this.checklist.owner && this.checklist.owner.id) !==
          (!!this.loggedInUser && this.loggedInUser.id)
      ) {
        this.itemId = !!this.checklist && this.checklist.id;
        this.type = "duplicate";
        this.requestDialog = true;
      } else {
        const res = await this.$store.dispatch(
          "implementationChecklist/duplicateChecklist",
          {
            id: id
          }
        );
        if (res !== false && !!res && !!res.data && !!res.data.id) {
          this.$router.push({ path: `/user/newChecklist/${res.data.id}` });
        }
        this.duplicateIsLoading = false;
      }
    },
    async archiveChecklist() {
      this.itemId = !!this.checklist && this.checklist.id;
      this.archiveDialog = true;
    },
    async transferDocument() {
      this.itemId = !!this.checklist && this.checklist.id;
      this.documentTransferDialog = true;
    },
    async deleteChecklist() {
      this.itemId = !!this.checklist && this.checklist.id;
      this.deleteDialog = true;
    },
    exportToPdf() {
      this.$refs.html2Pdf.generatePdf()
      this.$q.loading.show({
        message: `${this.$t("checkListCols.pdfDownloadProgress")} 0%`,
        backgroundColor: "primary",
        spinnerColor: "primary"
      })
    },
    pdfGenerationProgress(progress) {
      this.$q.loading.show({
        message: `${this.$t("checkListCols.pdfDownloadProgress")} ${progress}%`,
        backgroundColor: "primary",
      })
      if(progress === 100) {
        setTimeout(() => {
          this.$q.loading.hide() 
        }, 500);
      }
    }
  },
  computed: {
    isAdmin() {
      return this.$store.getters["userCenter/isAdmin"];
    },
    loggedInUser() {
      return (
        !!this.$store.state.userCenter.user &&
        this.$store.state.userCenter.user.user
      );
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
    checklist() {
      return this.$store.state.implementationChecklist.checklist;
    },
    sortedFundingResearch() {
      const { fundingResearch } = this.checklist;
      const sortedFundingResearch = Object.keys(fundingResearch)
        .sort((a, b) => fundingResearch[a].sortPosition - fundingResearch[b].sortPosition)
        .reduce((acc, key) => ({ ...acc, [key]: fundingResearch[key] }), {});

      return sortedFundingResearch;
    },
    sortedPreparationOfProject() {
      const { preparationOfProject } = this.checklist;
      const sortedPreparationOfProject = Object.keys(preparationOfProject)
        .sort((a, b) => preparationOfProject[a].sortPosition - preparationOfProject[b].sortPosition)
        .reduce((acc, key) => ({ ...acc, [key]: preparationOfProject[key] }), {});

      return sortedPreparationOfProject;
    },
    sortedLegitimation() {
      const { legitimation } = this.checklist;
      const sortedLegitimation = Object.keys(legitimation)
        .sort((a, b) => legitimation[a].sortPosition - legitimation[b].sortPosition)
        .reduce((acc, key) => ({ ...acc, [key]: legitimation[key] }), {});

      return sortedLegitimation;
    },
    sortedFinalExamination() {
      const { finalExamination } = this.checklist;
      const sortedFinalExamination = Object.keys(finalExamination)
        .sort((a, b) => finalExamination[a].sortPosition - finalExamination[b].sortPosition)
        .reduce((acc, key) => ({ ...acc, [key]: finalExamination[key] }), {});

      return sortedFinalExamination;
    },
  },
  mounted() {
    this.getData();
  },
  beforeDestroy() {
    this.$q.loading.hide();
  },
};
</script>

<style lang="scss">
.text-block {
  white-space: pre-line;
}
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
.isActiveCheckbox .q-checkbox__bg {
  background: transparent;
}
.isActiveCheckbox .q-checkbox__bg svg {
  color: $primary;
  padding: 2px;
}
.done {
  border: 1px solid $green;
  .q-chip {
    background: $green;
    .q-chip__content {
      color: white;
    }
  }
}
.inProgress {
  border: 1px solid $yellow;
  .q-chip {
    background: $yellow;
    .q-chip__content {
      color: black;
    }
  }
}

@media print {
  @page { margin: 0; }
}
</style>
