<template>
  <div>
    <div v-if="!!project" :class="!isDashboardView ? 'container' : ''">
      <div class="row">
        <div v-if="!isDashboardView" class="col-12">
          <q-btn @click="$router.go(-1)" color="back" align="left" flat no-caps>
            <q-icon name="chevron_left" color="primary" class="on-left" />
            Back
          </q-btn>
        </div>
        <div
          class="col-12"
          v-if="isAdmin && !!project.requests && project.requests.length > 0"
        >
          <div
            v-for="request in project.requests"
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
                    {{ !!request.user && request.user.username }} would like to
                    access document
                  </p>
                  <p class="font-14 q-mb-none">
                    {{ !!request.project && request.project.title }}
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
                          (!!project.createdAt &&
                            dateFormatter(project.createdAt)) ||
                            ""
                        }}
                      </p>
                    </div>
                    <div class="col-auto">
                      <p class="font-14 no-margin text-blue-grey-10">{{ $t("Owner") }}</p>
                      <p class="font-16 q-mt-xs q-mb-none text-weight-600 ">
                        {{ (!!project.owner && project.owner.username) || "" }}
                      </p>
                    </div>
                    <div class="col-auto">
                      <p class="font-14 no-margin text-blue-grey-10">{{ $t("projectContent.type") }}</p>
                      <p class="font-16 q-mt-xs q-mb-none text-weight-600 ">
                        {{ $t("dashboard.projectIdeaBtn") }}
                      </p>
                    </div>
                    <div class="col-auto">
                      <p class="font-14 no-margin text-blue-grey-10">{{ $t("projectContent.visibility") }}</p>
                      <p class="font-16 q-mt-xs q-mb-none text-weight-600 ">
                        {{
                          project.visibility === "only for me"
                            ? $t("visibility.onlyMe")
                            : project.visibility === "all users"
                            ? $t("visibility.allUsers")
                            : project.visibility === "listed only"
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
                        : 'q-col-gutter-x-md q-mt-md'
                    "
                    class="row"
                  >
                    <div class="col-auto q-mb-sm">
                      <q-btn
                        v-if="!!project && !!project.id && (project.owner.id === loggedInUser.id || isAdmin)"
                        @click="transferDocument()"
                        color="blue"
                        unelevated
                        class="radius-6 text-weight-600"
                        no-caps
                        outline
                        icon="send"
                        aria-label="Transfer Ownership"
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
                        aria-label="Print"
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
                        aria-label="Bookmark"
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
                    <!-- Redirect to checklist creation page -->
                    <div
                      v-if="
                        isAdmin ||
                          (!!project && !!project.owner && project.owner.id) ===
                            (!!loggedInUser && loggedInUser.id)
                      "
                      class="col-auto q-mb-md"
                    >
                      <q-btn
                        @click="createChecklist()"
                        color="blue"
                        unelevated
                        class="radius-6 text-weight-600"
                        no-caps
                        icon="list"
                        aria-label="Create Checklist"
                        :loading="archiveIsLoading"
                      >
                        <q-tooltip
                          anchor="top middle"
                          self="bottom middle"
                          :offset="[10, 10]"
                        >
                          {{
                            $t("checkListCols.createImplementationChecklist")
                          }}
                        </q-tooltip></q-btn
                      >
                    </div>
                    <div class="col-auto q-mb-md">
                      <q-btn
                        @click="editProject()"
                        color="blue"
                        unelevated
                        class="radius-6 text-weight-600"
                        no-caps
                        icon="edit"
                        aria-label="Edit"
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
                        @click="duplicateProject()"
                        color="blue"
                        unelevated
                        class="radius-6 text-weight-600"
                        no-caps
                        icon="content_copy"
                        aria-label="Duplicate"
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
                          (!!project && !!project.owner && project.owner.id) ===
                            (!!loggedInUser && loggedInUser.id)
                      "
                      class="col-auto q-mb-md"
                    >
                      <q-btn
                        @click="archiveProject()"
                        color="blue"
                        unelevated
                        class="radius-6 text-weight-600"
                        no-caps
                        icon="inventory"
                        aria-label="Archive"
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
                        @click="deleteProject()"
                        color="red"
                        unelevated
                        class="radius-6 text-weight-600"
                        no-caps
                        icon="delete"
                        aria-label="Delete"
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
        ref="html2Pdf"
      >
        <section slot="pdf-content">
          <div class="q-mx-md">
            <div class="row">
            <div class="col-12">
              <h4 class="font-24 text-weight-regular q-my-none">
                {{ project.title || "" }}
              </h4>
            </div>
            </div>

            <div class="row q-col-gutter-lg">

              <div class="col-12 col-md-4">
                <div class="row">

                  <div class="col-12 q-mb-md" >
                    <q-card class="shadow-1 radius-20">
                      <q-card-section>
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("projectContent.contactPerson") }}
                        </h4>
                        <div class="q-ml-md font-16">
                          <p class="q-mb-sm">
                            {{
                              (!!project.info && project.info.contactName) ||
                                (!!project &&
                                  !!project.owner &&
                                  project.owner.username) ||
                                ""
                            }}
                          </p>
                        </div>
                      </q-card-section>

                      <q-card-section>
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("projectContent.contactDetails") }}
                        </h4>
                        <div class="q-ml-md font-16">
                          <p class="q-mb-sm">
                            {{ (!!project.info && project.info.streetNo) || "" }}
                          </p>
                          <p class="q-mb-sm">
                            {{
                              (!!project.info && project.info.postalCode) || ""
                            }}
                          </p>
                          <p class="q-mb-sm">
                            {{ (!!project.info && project.info.phone) || "" }}
                          </p>
                          <p class="q-mb-sm text-overflow">
                            {{ (!!project.info && project.info.email) || "" }}
                          </p>
                          <!-- <p class="q-mb-sm">
                        {{
                          (!!project.municipality &&
                            project.municipality.location) ||
                            ""
                        }}
                      </p> -->
                        </div>
                      </q-card-section>

                      <div>
                        <q-card-section
                          v-if="!!project.info && !!project.info.location"
                        >
                          <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                            {{ $t("projectContent.locationOfProject") }}
                          </h4>
                          <div class="q-ml-md font-16">
                            <p class="q-mb-sm">
                              {{
                                (!!project.info && project.info.location) || ""
                              }}
                            </p>
                          </div>
                        </q-card-section>

                      </div>

                      <q-card-section
                        v-if="project.editors && project.editors.length > 0"
                      >
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("projectContent.inviteEditors") }}
                        </h4>
                        <div class="q-ml-md font-16">
                          <div
                            v-if="project.editors && project.editors.length > 0"
                          >
                            <p
                              v-for="(editor, index) in project.editors"
                              :key="index"
                              class="q-mb-sm"
                            >
                              {{ editor.username }}
                            </p>
                          </div>
                          <div v-else>
                            <p class="q-mb-sm">{{ $t("projectContent.noEditorsInvited") }}</p>
                          </div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>


                  <div class="col-12 q-mb-md">
                    <q-card class="shadow-1 radius-20">
                      <q-card-section>
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("projectContent.categories") }}
                        </h4>
                        <div class="q-ml-md font-16">
                          <div
                            v-if="
                              project.categories && project.categories.length > 0
                            "
                          >
                            <q-chip
                              v-for="(category, index) in project.categories"
                              :key="index"
                              square
                              size="16px"
                              color="yellow-10"
                              text-color="blue"
                            >
                              {{ category.title }}
                            </q-chip>
                          </div>
                          <div v-else>
                            No categories set
                          </div>
                        </div>
                      </q-card-section>

                      <q-card-section>
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("projectContent.tags") }}
                        </h4>
                        <div class="q-ml-md font-16">
                          <div v-if="project.tags && project.tags.length > 0">
                            <q-chip
                              v-for="(tag, index) in project.tags"
                              :key="index"
                              square
                              size="16px"
                              color="yellow-10"
                              text-color="blue"
                            >
                              {{ tag.title }}
                            </q-chip>
                          </div>
                          <div v-else>{{ $t("projectContent.noTagsSet") }}</div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>


                  <div class="col-12 q-mb-md">
                    <q-card class="shadow-1 radius-20">
                      <q-card-section>
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("projectContent.investive/non-investive") }}
                        </h4>
                        <div class="q-ml-md font-16">
                          <p class="q-mb-sm">
                            {{
                              !!project.details &&
                              project.details.investive === true
                                ? $t("Investive")
                                : !!project.details &&
                                  project.details.investive === false
                                ? $t("Non-Investive")
                                : ""
                            }}
                          </p>
                        </div>
                      </q-card-section>

                      <div v-if="project.duplications > 0">
                        <q-card-section>
                          <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                            {{ $t("projectContent.duplications") }}
                          </h4>
                          <div class="q-ml-md font-16">
                            <p class="q-mb-sm">
                              {{ project.duplications }}
                            </p>
                          </div>
                        </q-card-section>

                      </div>
                      <div
                        v-if="
                          !!project.details && project.details.status !== null
                        "
                      >
                        <q-card-section>
                          <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                            {{ $t("projectContent.projectStatus") }}
                          </h4>
                          <div class="q-ml-md font-16">
                            <p class="q-mb-sm">
                              {{
                                !!project.details && project.details.satus !== ""
                                  ? $t(project.details.status)
                                  : ""
                              }}
                            </p>
                          </div>
                        </q-card-section>

                      </div>

                      <q-card-section
                        v-if="
                          project.estimatedCosts &&
                            project.estimatedCosts.length > 0
                        "
                      >
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("projectContent.estimatedCost") }}
                        </h4>
                        <div
                          v-if="
                            project.estimatedCosts &&
                              project.estimatedCosts.length > 0
                          "
                        >
                          <div
                            class="q-ml-md font-16 row justify-between"
                            v-for="(cost, index) in project.estimatedCosts"
                            :key="index"
                          >
                            <div class="col-auto">
                              <p class="q-mb-sm">
                                {{ cost.name }}
                              </p>
                            </div>
                            <div class="col-auto text-right ">
                              <p class="q-mb-sm text-overflow">
                                {{ cost.price }} €
                              </p>
                            </div>
                          </div>
                        </div>
                        <div v-else>
                          <div class="q-ml-md font-16 row">
                            <div class="col-12">
                              <p class="q-mb-sm">
                                No costs set
                              </p>
                            </div>
                          </div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>


                  <div class="col-12 q-mb-md">
                    <q-card class="shadow-1 radius-20">
                      <div
                        v-if="
                          project.fundingGuideline &&
                            project.fundingGuideline.length > 0
                        "
                      >
                        <q-card-section>
                          <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                            {{ $t("projectContent.fundingGuidelines") }}
                          </h4>
                          <div
                            v-if="
                              project.fundingGuideline &&
                                project.fundingGuideline.length > 0
                            "
                            class="font-16"
                          >
                            <div
                              class="row"
                              v-for="(funding, index) in project.fundingGuideline"
                              :key="index"
                            >
                              <div class="col-auto q-ml-md">
                                <a
                                  class="q-mb-sm text-blue block text-weight-600 cursor-pointer"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  @click.prevent="viewFunding(funding.id)"
                                  >{{ funding.title }}</a
                                >
                              </div>
                            </div>
                          </div>
                          <div class="q-ml-md font-16" v-else>
                            <p class="q-mb-sm q-mt-xs">
                              No Funding Guidlines
                            </p>
                          </div>
                        </q-card-section>

                      </div>
                      <!-- If checklist(s) selected -->

                      <div
                        v-if="project.checklists && project.checklists.length > 0"
                      >
                        <q-card-section>
                          <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                            {{ $t("Implementation checklist") }}
                          </h4>
                          <div
                            v-if="
                              project.checklists && project.checklists.length > 0
                            "
                            class="font-16"
                          >
                            <div
                              class="row"
                              v-for="(checklist, index) in project.checklists"
                              :key="index"
                            >
                              <div class="col-auto q-ml-md">
                                <a
                                  class="q-mb-sm text-blue block text-weight-600 cursor-pointer"
                                  @click.prevent="viewChecklist(checklist.id)"
                                  >{{ checklist.title }}</a
                                >
                              </div>
                            </div>
                          </div>
                          <div class="q-ml-md font-16" v-else>
                            <p class="q-mb-sm q-mt-xs">
                              No Implementation Checklists
                            </p>
                          </div>
                        </q-card-section>

                      </div>

                      <q-card-section>
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("projectContent.plannedPeriod") }}
                        </h4>
                        <div class="q-ml-md font-16 row">
                          <div class="col-6 text-left">
                            <p class="q-mb-sm">{{ $t("start") }}</p>
                          </div>
                          <div class="col-6 text-right">
                            <p class="q-mb-sm">
                              {{
                                dateFormatter(project.plannedStart) ||
                                  "No start date found"
                              }}
                            </p>
                          </div>
                          <div class="col-6 text-left">
                            <p class="q-mb-sm">{{ $t("end") }}</p>
                          </div>
                          <div class="col-6 text-right">
                            <p class="q-mb-sm">
                              {{
                                dateFormatter(project.plannedEnd) ||
                                  "No end date found"
                              }}
                            </p>
                          </div>
                        </div>
                      </q-card-section>

                      <div v-if="project.links && project.links.length > 0">
                        <q-card-section>
                          <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                            Links
                          </h4>
                          <div class="q-ml-md font-16">
                            <div v-if="project.links && project.links.length > 0">
                              <div
                                class="row"
                                v-for="(link, index) in project.links"
                                :key="index"
                              >
                                <p class="q-mb-none">{{ link.title }}</p>
                                <a
                                  class="col-12 q-mb-sm text-blue block text-weight-600 text-overflow"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  :href="
                                    link.link.split('://')[0].substring(0, 5) ===
                                    'https'
                                      ? link.link
                                      : link.link
                                          .split('://')[0]
                                          .substring(0, 4) === 'http'
                                      ? link.link
                                      : `http://${link.link}`
                                  "
                                >
                                  {{ link.link }}
                                </a>
                              </div>
                            </div>
                            <div v-else>
                              <p class="col-12 q-mb-none">{{ $t("projectContent.noLinksSet") }}</p>
                            </div>
                          </div>
                        </q-card-section>

                      </div>
                      <q-card-section
                        v-if="project.files && project.files.length > 0"
                      >
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          Uploads
                        </h4>
                        <div class="q-ml-md font-16">
                          <div v-if="project.files && project.files.length > 0">
                            <div
                              class="row"
                              v-for="(file, index) in project.files"
                              :key="index"
                            >
                              <a
                                class="q-mb-sm text-blue block text-weight-600"
                                target="_blank"
                                rel="noopener noreferrer"
                                :href="`${appUrl}${file.url}`"
                                >{{ file.name }}</a
                              >
                            </div>
                          </div>
                          <div v-else>
                            No Files uploaded
                          </div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>

                </div>
              </div>

              <div class="col-12 col-md-8">
                <div class="row">
                  <div class="col-12 q-mb-md" v-if="project.media">
                    <q-card class="shadow-1 radius-20">
                      <q-card-section v-if="project.media">
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
                            v-for="(item, index) in project.media"
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
                                v-for="(item, index) in project.media"
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
                              class="q-mt-md q-mb-none font-14 text-center text-blue-grey-10"
                            >
                              {{
                                !!project.media[slide - 1] &&
                                !!project.media[slide - 1].caption
                                  ? project.media[slide - 1].caption
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
                          <h6 class="text-blue-grey-10">{{ $t("No Images") }}</h6>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                  <div class="col-12 q-mb-md">
                    <q-card class="shadow-1 radius-20">

                      <q-card-section>
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("newProjectIdeaForm.projectStartingCondition") }}
                        </h4>

                        <div class="q-ml-md font-16">
                          <p
                            class="q-mb-sm text-block"
                            v-html="
                              !!project.details &&
                              !!project.details.startingCondition
                                ? project.details.startingCondition
                                : 'No Project Starting Condition found'
                            "
                          ></p>
                        </div>
                      </q-card-section>

                      <q-card-section>
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("projectContent.projectContent") }}
                        </h4>
                        <div class="q-ml-md font-16">
                          <p
                            class="q-mb-sm text-block"
                            v-html="
                              !!project.details && !!project.details.content
                                ? project.details.content
                                : 'No Project Content found'
                            "
                          ></p>
                        </div>
                      </q-card-section>


                      <q-card-section>
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("projectContent.projectGoals") }}
                        </h4>
                        <div class="q-ml-md font-16">
                          <p
                            class="q-mb-sm text-block"
                            v-html="!!project.details? project.details.goals: 'No Project Goals found'"
                          >
                          </p>
                        </div>
                      </q-card-section>



                      <q-card-section>
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("projectContent.projectValue&Benefits") }}
                        </h4>
                        <div class="q-ml-md font-16">
                          <p
                            class="q-mb-sm text-block"
                            v-html="
                              !!project.details
                                ? project.details.valuesAndBenefits
                                : 'No Project Goals found'
                            "
                          ></p>
                        </div>
                      </q-card-section>


                      <div v-if="!!project.details && project.details.partner">
                        <q-card-section>
                          <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                            {{ $t("projectContent.CooperationPartner") }}
                          </h4>
                          <div class="q-ml-md font-16">
                            <p class="q-mb-sm">
                              {{
                                (!!project.details && project.details.partner) ||
                                  "No Project Partners found"
                              }}
                            </p>
                          </div>
                        </q-card-section>

                      </div>
                    </q-card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </vue-html2pdf>

      <div class="row">
        <div class="col-12">
          <h1 class="font-24 text-weight-regular q-my-none" style="line-height: 3rem;">
            {{ project.title || "" }}
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
                    {{ $t("projectContent.contactPerson") }}
                  </h4>
                  <div class="q-ml-md font-16">
                    <p class="q-mb-sm">
                      {{
                        (!!project.info && project.info.contactName) ||
                          (!!project &&
                            !!project.owner &&
                            project.owner.username) ||
                          ""
                      }}
                    </p>
                  </div>
                </q-card-section>
                <q-separator inset class="bg-blue opacity-10" />
                <q-card-section>
                  <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                    {{ $t("projectContent.contactDetails") }}
                  </h4>
                  <div class="q-ml-md font-16">
                    <p class="q-mb-sm">
                      {{ (!!project.info && project.info.streetNo) || "" }}
                    </p>
                    <p class="q-mb-sm">
                      {{ (!!project.info && project.info.postalCode) || "" }}
                    </p>
                    <p class="q-mb-sm">
                      {{ (!!project.info && project.info.phone) || "" }}
                    </p>
                    <p class="q-mb-sm text-overflow">
                      {{ (!!project.info && project.info.email) || "" }}
                    </p>
                    <!-- <p class="q-mb-sm">
                      {{
                        (!!project.municipality &&
                          project.municipality.location) ||
                          ""
                      }}
                    </p> -->
                  </div>
                </q-card-section>
                <q-separator inset class="bg-blue opacity-10" />
                <div>
                  <q-card-section
                    v-if="!!project.info && !!project.info.location"
                  >
                    <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                      {{ $t("projectContent.locationOfProject") }}
                    </h4>
                    <div class="q-ml-md font-16">
                      <p class="q-mb-sm">
                        {{ (!!project.info && project.info.location) || "" }}
                      </p>
                    </div>
                  </q-card-section>
                  <q-separator inset class="bg-blue opacity-10" />
                </div>

                <q-card-section
                  v-if="project.editors && project.editors.length > 0"
                >
                  <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                    {{ $t("projectContent.inviteEditors") }}
                  </h4>
                  <div class="q-ml-md font-16">
                    <div v-if="project.editors && project.editors.length > 0">
                      <p
                        v-for="(editor, index) in project.editors"
                        :key="index"
                        class="q-mb-sm"
                      >
                        {{ editor.username }}
                      </p>
                    </div>
                    <div v-else>
                      <p class="q-mb-sm">{{ $t("projectContent.noEditorsInvited") }}</p>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 q-mb-md">
              <q-card class="shadow-1 radius-20">
                <q-card-section>
                  <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                    {{ $t("projectContent.categories") }}
                  </h4>
                  <div class="q-ml-md font-16">
                    <div
                      v-if="project.categories && project.categories.length > 0"
                    >
                      <q-chip
                        v-for="(category, index) in project.categories"
                        :key="index"
                        square
                        size="16px"
                        color="yellow-10"
                        text-color="blue"
                      >
                        {{ category.title }}
                      </q-chip>
                    </div>
                    <div v-else>
                      No categories set
                    </div>
                  </div>
                </q-card-section>
                <q-separator inset class="bg-blue opacity-10" />
                <q-card-section>
                  <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                    {{ $t("projectContent.tags") }}
                  </h4>
                  <div class="q-ml-md font-16">
                    <div v-if="project.tags && project.tags.length > 0">
                      <q-chip
                        v-for="(tag, index) in project.tags"
                        :key="index"
                        square
                        size="16px"
                        color="yellow-10"
                        text-color="blue"
                      >
                        {{ tag.title }}
                      </q-chip>
                    </div>
                    <div v-else>{{ $t("projectContent.noTagsSet") }}</div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 q-mb-md">
              <q-card class="shadow-1 radius-20">
                <q-card-section>
                  <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                    {{ $t("projectContent.investive/non-investive") }}
                  </h4>
                  <div class="q-ml-md font-16">
                    <p class="q-mb-sm">
                      {{
                        !!project.details && project.details.investive === true
                          ? $t("Investive")
                          : !!project.details &&
                            project.details.investive === false
                          ? $t("Non-Investive")
                          : ""
                      }}
                    </p>
                  </div>
                </q-card-section>
                <q-separator inset class="bg-blue opacity-10" />
                <div v-if="project.duplications > 0">
                  <q-card-section>
                    <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                      {{ $t("projectContent.duplications") }}
                    </h4>
                    <div class="q-ml-md font-16">
                      <p class="q-mb-sm">
                        {{ project.duplications }}
                      </p>
                    </div>
                  </q-card-section>
                  <q-separator inset class="bg-blue opacity-10" />
                </div>
                <div
                  v-if="!!project.details && project.details.status !== null"
                >
                  <q-card-section>
                    <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                      {{ $t("projectContent.projectStatus") }}
                    </h4>
                    <div class="q-ml-md font-16">
                      <p class="q-mb-sm">
                        {{
                          !!project.details && project.details.satus !== ""
                            ? $t(project.details.status)
                            : ""
                        }}
                      </p>
                    </div>
                  </q-card-section>
                  <q-separator inset class="bg-blue opacity-10" />
                </div>

                <q-card-section
                  v-if="
                    project.estimatedCosts && project.estimatedCosts.length > 0
                  "
                >
                  <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                    {{ $t("projectContent.estimatedCost") }}
                  </h4>
                  <div
                    v-if="
                      project.estimatedCosts &&
                        project.estimatedCosts.length > 0
                    "
                  >
                    <div
                      class="q-ml-md font-16 row justify-between"
                      v-for="(cost, index) in project.estimatedCosts"
                      :key="index"
                    >
                      <div class="col-auto">
                        <p class="q-mb-sm">
                          {{ cost.name }}
                        </p>
                      </div>
                      <div class="col-auto text-right ">
                        <p class="q-mb-sm text-overflow">{{ cost.price }} €</p>
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <div class="q-ml-md font-16 row">
                      <div class="col-12">
                        <p class="q-mb-sm">
                          No costs set
                        </p>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 q-mb-md">
              <q-card class="shadow-1 radius-20">
                <div
                  v-if="
                    project.fundingGuideline &&
                      project.fundingGuideline.length > 0
                  "
                >
                  <q-card-section>
                    <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                      {{ $t("projectContent.fundingGuidelines") }}
                    </h4>
                    <div
                      v-if="
                        project.fundingGuideline &&
                          project.fundingGuideline.length > 0
                      "
                      class="font-16"
                    >
                      <div
                        class="row"
                        v-for="(funding, index) in project.fundingGuideline"
                        :key="index"
                      >
                        <div class="col-auto q-ml-md">
                          <a
                            class="q-mb-sm text-blue block text-weight-600 cursor-pointer"
                            target="_blank"
                            rel="noopener noreferrer"
                            @click.prevent="viewFunding(funding.id)"
                            >{{ funding.title }}</a
                          >
                        </div>
                      </div>
                    </div>
                    <div class="q-ml-md font-16" v-else>
                      <p class="q-mb-sm q-mt-xs">
                        No Funding Guidlines
                      </p>
                    </div>
                  </q-card-section>
                  <q-separator inset class="bg-blue opacity-10" />
                </div>
                <!-- If checklist(s) selected -->

                <div v-if="project.checklists && project.checklists.length > 0">
                  <q-card-section>
                    <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                      {{ $t("Implementation checklist") }}
                    </h4>
                    <div
                      v-if="project.checklists && project.checklists.length > 0"
                      class="font-16"
                    >
                      <div
                        class="row"
                        v-for="(checklist, index) in project.checklists"
                        :key="index"
                      >
                        <div class="col-auto q-ml-md">
                          <a
                            class="q-mb-sm text-blue block text-weight-600 cursor-pointer"
                            @click.prevent="viewChecklist(checklist.id)"
                            >{{ checklist.title }}</a
                          >
                        </div>
                      </div>
                    </div>
                    <div class="q-ml-md font-16" v-else>
                      <p class="q-mb-sm q-mt-xs">
                        No Implementation Checklists
                      </p>
                    </div>
                  </q-card-section>
                  <q-separator inset class="bg-blue opacity-10" />
                </div>

                <q-card-section>
                  <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                    {{ $t("projectContent.plannedPeriod") }}
                  </h4>
                  <div class="q-ml-md font-16 row">
                    <div class="col-6 text-left">
                      <p class="q-mb-sm">{{ $t("start") }}</p>
                    </div>
                    <div class="col-6 text-right">
                      <p class="q-mb-sm">
                        {{
                          dateFormatter(project.plannedStart) ||
                            "No start date found"
                        }}
                      </p>
                    </div>
                    <div class="col-6 text-left">
                      <p class="q-mb-sm">{{ $t("end") }}</p>
                    </div>
                    <div class="col-6 text-right">
                      <p class="q-mb-sm">
                        {{
                          dateFormatter(project.plannedEnd) ||
                            "No end date found"
                        }}
                      </p>
                    </div>
                  </div>
                </q-card-section>
                <q-separator inset class="bg-blue opacity-10" />
                <div v-if="project.links && project.links.length > 0">
                  <q-card-section>
                    <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                      Links
                    </h4>
                    <div class="q-ml-md font-16">
                      <div v-if="project.links && project.links.length > 0">
                        <div
                          class="row"
                          v-for="(link, index) in project.links"
                          :key="index"
                        >
                          <p class="q-mb-none">{{ link.title }}</p>
                          <a
                            class="col-12 q-mb-sm text-blue block text-weight-600 text-overflow"
                            target="_blank"
                            rel="noopener noreferrer"
                            :href="
                              link.link.split('://')[0].substring(0, 5) ===
                              'https'
                                ? link.link
                                : link.link.split('://')[0].substring(0, 4) ===
                                  'http'
                                ? link.link
                                : `http://${link.link}`
                            "
                          >
                            {{ link.link }}
                          </a>
                        </div>
                      </div>
                      <div v-else>
                        <p class="col-12 q-mb-none">{{ $t("projectContent.noLinksSet") }}</p>
                      </div>
                    </div>
                  </q-card-section>
                  <q-separator inset class="bg-blue opacity-10" />
                </div>
                <q-card-section
                  v-if="project.files && project.files.length > 0"
                >
                  <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                    Uploads
                  </h4>
                  <div class="q-ml-md font-16">
                    <div v-if="project.files && project.files.length > 0">
                      <div
                        class="row"
                        v-for="(file, index) in project.files"
                        :key="index"
                      >
                      <div>
                        <span @click="handleOpenDocumentPreviewModal(file)" class="text-blue q-my-sm text-weight-bold cursor-pointer" style="text-decoration: underline;">{{ file.name }} </span>
                      </div>
                      </div>
                    </div>
                    <div v-else>
                      No Files uploaded
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <!-- <div class="col-12 q-mb-md">
            <q-card class="shadow-1 radius-20">
              <q-card-section>
                <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                  {{ $t("projectContent.relevantDocuments") }}
                </h4>
                <div class="q-ml-md font-16">
                  <p class="q-mb-none">Förderinfo</p>
                  <a
                    class="q-mb-sm text-blue block text-weight-600"
                    href="http://link.to.page"
                    >Förderinfo name</a
                  >
                  <p class="q-mb-none">{{ $t("category&Keyword.implementationChecklist") }}</p>
                  <a
                    class="q-mb-sm text-blue block text-weight-600"
                    href="http://link.to.page"
                    >{{ $t("category&Keyword.implementationChecklist") }} name</a
                  >
                </div>
              </q-card-section>
            </q-card>
          </div> -->
          </div>
        </div>
        <div class="col-12 col-md-8">
          <div class="row">
            <div class="col-12 q-mb-md">
              <q-card class="shadow-1 radius-20">
                <q-card-section v-if="project.media">
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
                      v-for="(item, index) in project.media"
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
                          v-for="(item, index) in project.media"
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
                        class="q-mt-md q-mb-none font-14 text-center text-blue-grey-10"
                      >
                        {{
                          !!project.media[slide - 1] &&
                          !!project.media[slide - 1].caption
                            ? project.media[slide - 1].caption
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
                    <h6 class="text-blue-grey-10">{{ $t("No Images") }}</h6>
                  </div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 q-mb-md">
              <q-card class="shadow-1 radius-20">
                <q-card-section>
                  <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                    {{ $t("newProjectIdeaForm.projectStartingCondition") }}
                  </h4>
                  <div class="q-ml-md font-16">
                    <p
                      class="q-mb-sm text-block"
                      v-html="
                        !!project.details && !!project.details.startingCondition
                          ? project.details.startingCondition
                          : 'No Project Starting Condition found'
                      "
                    ></p>
                  </div>
                </q-card-section>
                <q-card-section>
                  <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                    {{ $t("projectContent.projectContent") }}
                  </h4>
                  <div class="q-ml-md font-16">
                    <p
                      class="q-mb-sm text-block"
                      v-html="
                        !!project.details && !!project.details.content
                          ? project.details.content
                          : 'No Project Content found'
                      "
                    ></p>
                  </div>
                </q-card-section>
                <q-separator inset class="bg-blue opacity-10" />
                <q-card-section>
                  <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                    {{ $t("projectContent.projectGoals") }}
                  </h4>
                  <div class="q-ml-md font-16">
                    <p
                      class="q-mb-sm text-block"
                      v-html="
                        !!project.details
                          ? project.details.goals
                          : 'No Project Goals found'
                      "
                    >
                    </p>
                  </div>
                </q-card-section>
                <q-separator inset class="bg-blue opacity-10" />
                <q-card-section>
                  <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                    {{ $t("projectContent.projectValue&Benefits") }}
                  </h4>
                  <div class="q-ml-md font-16">
                    <p
                      class="q-mb-sm text-block"
                      v-html="
                        !!project.details
                          ? project.details.valuesAndBenefits
                          : 'No Project Goals found'
                      "
                    ></p>
                  </div>
                </q-card-section>
                <q-separator inset class="bg-blue opacity-10" />
                <div v-if="!!project.details && project.details.partner">
                  <q-card-section>
                    <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                      {{ $t("projectContent.CooperationPartner") }}
                    </h4>
                    <div class="q-ml-md font-16">
                      <p class="q-mb-sm">
                        {{
                          (!!project.details && project.details.partner) ||
                            "No Project Partners found"
                        }}
                      </p>
                    </div>
                  </q-card-section>
                  <q-separator inset class="bg-blue opacity-10" />
                </div>
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
      v-if="!!project && !!project.id && (project.owner.id === loggedInUser.id || isAdmin)"
      :id="itemId"
      type="project"
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
import RequestAccessDialog from "components/data/RequestAccessDialog.vue";
import DocumentTransferDialog from "components/DocumentTransferDialog.vue";
import VueHtml2pdf from "vue-html2pdf";

export default {
  name: "projectContent",
  data() {
    return {
      slide: 1,
      itemId: null,
      tab: "projectIdeas",
      type: null,
      requestDialog: false,
      deleteDialog: false,
      archiveDialog: false,
      documentTransferDialog: false,
      isLoading: false,
      editIsLoading: false,
      deleteIsLoading: false,
      archiveIsLoading: false,
      watchlistIsLoading: false,
      duplicateIsLoading: false,
      openDocumentPreviewModal: false,
      previewDocumentData: null
    };
  },
  components: {
    DeleteDialog,
    ArchiveDialog,
    RequestAccessDialog,
    DocumentTransferDialog,
    VueHtml2pdf
  },
  watch: {
    $route(to, from) {
      if (
        (to.params && to.params.id) !==
        (this.$store.state.project.project &&
          this.$store.state.project.project.id)
      ) {
        this.getNewData(to.params.id);
      }
    }
  },
  methods: {
    async getProject() {
      await this.$store.dispatch("project/getSpecificProject", {
        id: Number(this.project.id)
      });
    },
    createChecklist() {
      this.$router.push({
        path: "/user/newChecklist",
        query: { red: "pid" }
      });
    },

    dateFormatter,
    closeArchiveDialog(val) {
      this.archiveDialog = val;
      if (!!this.project && this.project.archived === true) {
        this.$router.go(-1);
      }
    },
    closeDocumentTransferDialog(val) {
      this.documentTransferDialog = val;
      if (!!this.project && this.project.id) {
        this.documentTransferDialog = false;
      }
    },
    closeDeleteDialog(val) {
      this.deleteDialog = val;
      if (!!this.project && !this.project.id) {
        this.$router.go(-1);
      }
    },
    async getData() {
      this.$q.loading.show();
      await this.$store.dispatch("project/getSpecificProject", {
        id: Number(this.$route.params.id)
      });
      this.$q.loading.hide();
    },
    async getNewData(id) {
      if (!!id) {
        this.$q.loading.show();
        await this.$store.dispatch("project/getSpecificProject", {
          id: id
        });
        this.$q.loading.hide();
      }
    },
    async handleOpenDocumentPreviewModal (file) {
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
      if (!!id) {
        this.$router.push({ path: `/user/newFunding/${id}` });
      }
    },
    async viewChecklist(id) {
      if (!!id) {
        this.$router.push({ path: `/user/newChecklist/${id}` });
      }
    },
    async addToWatchlist() {
      this.watchlistIsLoading = true;
      const id = !!this.project && this.project.id;
      await this.$store.dispatch("project/addToWatchlist", {
        id: id
      });
      this.watchlistIsLoading = false;
    },
    async editProject() {
      this.editIsLoading = true;
      const id = !!this.project && this.project.id;
      if (
        !!this.project &&
        (!!this.project && !!this.project.owner && this.project.owner.id) !==
          (!!this.loggedInUser && this.loggedInUser.id) &&
        !this.isAdmin
      ) {
        const hasEditorAccess =
          !!this.project &&
          !!this.project.editors &&
          this.project.editors.filter(
            user => user.id === (!!this.loggedInUser && this.loggedInUser.id)
          );
        if (hasEditorAccess.length > 0) {
          this.$router.push({ path: `/user/newProjectIdea/edit/${id}` });
        } else {
          this.itemId = !!this.project && this.project.id;
          this.type = "edit";
          this.requestDialog = true;
        }
      } else {
        this.$router.push({ path: `/user/newProjectIdea/edit/${id}` });
      }
    },
    async duplicateProject() {
      this.duplicateIsLoading = true;
      const id = !!this.project && this.project.id;
      if (
        !!this.project &&
        this.project.visibility !== "all users" &&
        (!!this.project.owner && this.project.owner.id) !==
          (!!this.loggedInUser && this.loggedInUser.id)
      ) {
        this.itemId = !!this.project && this.project.id;
        this.type = "duplicate";
        this.requestDialog = true;
      } else {
        const res = await this.$store.dispatch("project/duplicateProject", {
          id: id
        });
        if (res !== false && !!res && !!res.data && !!res.data.id) {
          this.$router.push({ path: `/user/newProjectIdea/${res.data.id}` });
        }
        this.duplicateIsLoading = false;
      }
    },
    async archiveProject() {
      this.itemId = !!this.project && this.project.id;
      this.archiveDialog = true;
    },
    async transferDocument() {
      this.itemId = !!this.project && this.project.id;
      this.documentTransferDialog = true;
    },
    async deleteProject() {
      this.itemId = !!this.project && this.project.id;
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
    project() {
      return this.$store.state.project.project;
    }
  },
  mounted() {
    this.getData();
    // this.setLoadingData();
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
.mobile-row {
  max-width: 300px;
}
</style>
