<template>
  <div>
    <vue-html2pdf :show-layout="false" :float-layout="true" :enable-download="false" :preview-modal="true"
      :paginate-elements-by-height="18000" :pdf-quality="2" :manual-pagination="false" pdf-format="a4"
      pdf-orientation="landscape" pdf-content-width="1100px" autoPaging="text" :htmlToPdfOptions="{
        margin: [0, 5, 0, 5],
        html2canvas: { useCORS: true, scale: 2, letterRendering: true },
        autoPaging: 'text',
        jsPDF: { unit: 'pt', format: 'a4', orientation: 'landscape' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      }" @hasStartedGeneration="hasStartedGeneration()" @hasGenerated="hasGenerated($event)" ref="html2Pdf">
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
                      <q-card-section v-if="!!project.info && !!project.info.location">
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

                    <q-card-section v-if="project.editors && project.editors.length > 0">
                      <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                        {{ $t("projectContent.inviteEditors") }}
                      </h4>
                      <div class="q-ml-md font-16">
                        <div v-if="project.editors && project.editors.length > 0">
                          <p v-for="(editor, index) in project.editors" :key="index" class="q-mb-sm">
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
                        <div v-if="
                          project.categories && project.categories.length > 0
                        ">
                          <q-chip v-for="(category, index) in project.categories" :key="index" square size="16px"
                            color="yellow-10" text-color="blue">
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
                          <q-chip v-for="(tag, index) in project.tags" :key="index" square size="16px" color="yellow-10"
                            text-color="blue">
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
                    <div v-if="
                      !!project.details && project.details.status !== null
                    ">
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

                    <q-card-section v-if="
                      project.estimatedCosts &&
                      project.estimatedCosts.length > 0
                    ">
                      <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                        {{ $t("projectContent.estimatedCost") }}
                      </h4>
                      <div v-if="
                        project.estimatedCosts &&
                        project.estimatedCosts.length > 0
                      ">
                        <div class="q-ml-md font-16 row justify-between" v-for="(cost, index) in project.estimatedCosts"
                          :key="index">
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
                    <div v-if="
                      project.fundingGuideline &&
                      project.fundingGuideline.length > 0
                    ">
                      <q-card-section>
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("projectContent.fundingGuidelines") }}
                        </h4>
                        <div v-if="
                          project.fundingGuideline &&
                          project.fundingGuideline.length > 0
                        " class="font-16">
                          <div class="row" v-for="(funding, index) in project.fundingGuideline" :key="index">
                            <div class="col-auto q-ml-md">
                              <a class="q-mb-sm text-blue block text-weight-600 cursor-pointer" target="_blank"
                                rel="noopener noreferrer" @click.prevent="viewFunding(funding.id)">{{ funding.title
                                }}</a>
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

                    <div v-if="project.checklists && project.checklists.length > 0">
                      <q-card-section>
                        <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                          {{ $t("Implementation checklist") }}
                        </h4>
                        <div v-if="
                          project.checklists && project.checklists.length > 0
                        " class="font-16">
                          <div class="row" v-for="(checklist, index) in project.checklists" :key="index">
                            <div class="col-auto q-ml-md">
                              <a class="q-mb-sm text-blue block text-weight-600 cursor-pointer"
                                @click.prevent="viewChecklist(checklist.id)">{{ checklist.title }}</a>
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
                            <div class="row" v-for="(link, index) in project.links" :key="index">
                              <p class="q-mb-none">{{ link.title }}</p>
                              <a class="col-12 q-mb-sm text-blue block text-weight-600 text-overflow" target="_blank"
                                rel="noopener noreferrer" :href="link.link.split('://')[0].substring(0, 5) ===
                                  'https'
                                  ? link.link
                                  : link.link
                                    .split('://')[0]
                                    .substring(0, 4) === 'http'
                                    ? link.link
                                    : `http://${link.link}`
                                  ">
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
                    <q-card-section v-if="project.files && project.files.length > 0">
                      <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                        Uploads
                      </h4>
                      <div class="q-ml-md font-16">
                        <div v-if="project.files && project.files.length > 0">
                          <div class="row" v-for="(file, index) in project.files" :key="index">
                            <a class="q-mb-sm text-blue block text-weight-600" target="_blank" rel="noopener noreferrer"
                              :href="`${appUrl}${file.url}`">{{ file.name }}</a>
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
                      <q-carousel swipeable animated v-model="slide" infinite class="radius-10" autoplay>
                        <q-carousel-slide class="imageStyling" v-for="(item, index) in project.media" :key="index"
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
                            <q-tab :name="index + 1" @click="slide = index + 1" v-for="(item, index) in project.media"
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
                          <p class="q-mt-md q-mb-none font-14 text-center text-blue-grey-10">
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
                    <q-card-section class="flex flex-center" v-else style="height: 548px">
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
                        <p class="q-mb-sm text-block" v-html="!!project.details &&
                          !!project.details.startingCondition
                          ? project.details.startingCondition
                          : 'No Project Starting Condition found'
                          "></p>
                      </div>
                    </q-card-section>

                    <q-card-section>
                      <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                        {{ $t("projectContent.projectContent") }}
                      </h4>
                      <div class="q-ml-md font-16">
                        <p class="q-mb-sm text-block" v-html="!!project.details && !!project.details.content
                          ? project.details.content
                          : 'No Project Content found'
                          "></p>
                      </div>
                    </q-card-section>


                    <q-card-section>
                      <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                        {{ $t("projectContent.projectGoals") }}
                      </h4>
                      <div class="q-ml-md font-16">
                        <p class="q-mb-sm text-block"
                          v-html="!!project.details ? project.details.goals : 'No Project Goals found'">
                        </p>
                      </div>
                    </q-card-section>



                    <q-card-section>
                      <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                        {{ $t("projectContent.projectValue&Benefits") }}
                      </h4>
                      <div class="q-ml-md font-16">
                        <p class="q-mb-sm text-block" v-html="!!project.details
                          ? project.details.valuesAndBenefits
                          : 'No Project Goals found'
                          "></p>
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
  </div>
</template>

<script>
import VueHtml2pdf from "vue-html2pdf";
import { dateFormatter } from "src/boot/dateFormatter";
export default {
  data() {
    return {
      slide: 1
    };
  },
  components: {
    VueHtml2pdf
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    appUrl: {
      type: String,
      required: false,
      default: process.env.VUE_APP_MAIN_URL
    },
  },
  methods: {
    dateFormatter,

    exportToPdf() {
      this.$refs.html2Pdf.generatePdf();
    },

    hasStartedGeneration() {
      this.$q.loading.show({
        message: 'Generating PDF...'
      });
    },

    hasGenerated(event) {
      this.$q.loading.hide();
      if (event.success) {
        this.$q.notify({
          type: 'positive',
          message: 'PDF generated successfully'
        });
      } else {
        this.$q.notify({
          type: 'negative',
          message: 'Failed to generate PDF'
        });
      }
    },
  }
}
</script>

<style lang="scss" scoped></style>
