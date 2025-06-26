<template>
  <q-page class="q-mt-lg" :class="$q.screen.gt.sm ? 'q-mx-xl' : 'q-mx-sm'">
    <div v-if="dataLoaded">
      <p class="text-center font-36 text-weight-regular q-my-lg ppeditorial">
        {{ $t("newProjectIdeaForm.title") }}
      </p>
      <div class="bg-white radius-20 q-py-lg" :class="{ 'q-px-md': $q.screen.gt.sm }">
        <q-form
          @validation-error="scrollToInvalidElement"
          ref="newProjectIdeaForm"
          class="q-gutter-lg q-px-md q-mb-md"
        >
          <div class="row items-baseline">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">
                {{ $t("newProjectIdeaForm.projectName") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <q-input
                outlined
                dense
                class="no-shadow input-radius-6"
                :placeholder="$t('projectIdeaPlaceholder.title')"
                v-model="form.title"
                :rules="[(val) => !!val || $t('Required')]"
              />
            </div>
          </div>
          <div class="row items-center">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">
                {{ $t("newProjectIdeaForm.contactPerson") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input
                    outlined
                    dense
                    class="no-shadow input-radius-6 disabledClass"
                    :placeholder="$t('projectIdeaPlaceholder.nameSurname')"
                    :value="
                      !!project
                        ? form.info.contactName
                        : !!userDetails && userDetails.fullName
                    "
                    disable
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    outlined
                    dense
                    disable
                    class="no-shadow input-radius-6 disabledClass"
                    placeholder="Gemeinde/Verwaltung"
                    :value="
                      !!project
                        ? form.municipality.title
                        : !!userDetails && userDetails.municipality.title
                    "
                    :rules="[]"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="row items-baseline">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">
                {{ $t("newProjectIdeaForm.contactDetails") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <div
                class="row q-col-gutter-x-md"
                :class="$q.screen.gt.sm ? 'q-col-gutter-y-lg' : 'q-col-gutter-y-md'"
              >
                <div class="col-12 col-md-6">
                  <q-input
                    outlined
                    dense
                    class="no-shadow input-radius-6 disabledClass"
                    :placeholder="$t('projectIdeaPlaceholder.streetNr')"
                    :value="
                      !!project
                        ? form.info.streetNo
                        : !!userDetails && userDetails.streetNo
                    "
                    disable
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    outlined
                    dense
                    class="no-shadow input-radius-6 disabledClass"
                    :placeholder="$t('projectIdeaPlaceholder.postalCity/place')"
                    :value="
                      !!project
                        ? form.info.postalCode
                        : !!userDetails && userDetails.postalCode
                    "
                    disable
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    outlined
                    dense
                    class="no-shadow input-radius-6 disabledClass"
                    :placeholder="$t('projectIdeaPlaceholder.telephone')"
                    :value="
                      !!project ? form.info.phone : !!userDetails && userDetails.phone
                    "
                    disable
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    outlined
                    dense
                    class="no-shadow input-radius-6 disabledClass"
                    :placeholder="$t('projectIdeaPlaceholder.email')"
                    :value="!!project ? form.info.email : !!user && user.email"
                    disable
                  />
                </div>
                <div class="col-12">
                  <MunicipalityCities
                    :currentMunicipality="form.info.location"
                    @update:city="form.info.location = $event"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="row items-center">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">
                {{ $t("newProjectIdeaForm.inviteEditors") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <UserSelect
                :editing="!!project ? project.editors : []"
                @update:user="form.editors = $event"
              />
            </div>
          </div>
          <div class="row items-baseline">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">
                {{ $t("newProjectIdeaForm.visibility") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <q-select
                outlined
                dense
                v-model="form.visibility"
                :options="visibilityOptions"
                emit-value
                :rules="[(val) => !!val || $t('Required')]"
                class="no-shadow input-radius-6"
                options-selected-class="text-primary"
              >
                <template v-slot:selected>
                  <template v-if="form.visibility">
                    {{
                      form.visibility === "only for me"
                        ? $t("visibility.onlyMe")
                        : form.visibility === "all users"
                        ? $t("visibility.allUsers")
                        : form.visibility === "listed only"
                        ? $t("visibility.listedOnly")
                        : ""
                    }}
                  </template>
                  <template v-else>
                    <span class="text-grey">
                      {{ $t("select") }}
                    </span>
                  </template>
                </template>
              </q-select>
              <p class="font-16 q-mb-none q-mt-md text-grey">
                {{
                  form.visibility === "only for me"
                    ? $t("visibility.docOnlyMe")
                    : form.visibility === "all users"
                    ? $t("visibility.docAllUsers")
                    : form.visibility === "listed only"
                    ? $t("visibility.docListedOnly")
                    : ""
                }}
              </p>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <q-separator class="bg-blue opacity-10" />
            </div>
          </div>
          <div class="row items-baseline">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">
                {{ $t("newProjectIdeaForm.filterCategories") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <Categories
                :requiresValidation="true"
                :editing="!!project ? project.categories : []"
                @update:category="form.categories = $event"
              />
            </div>
          </div>
          <div class="row items-baseline">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">{{ $t("Tags") }}</p>
            </div>
            <div class="col-12 col-md-8">
              <Tags
                :requiresValidation="true"
                :editing="!!project ? project.tags : []"
                @update:tag="form.tags = $event"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <q-separator class="bg-blue opacity-10" />
            </div>
          </div>
          <!-- Project Starting Condition -->
          <div class="row items-baseline">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">
                {{ $t("newProjectIdeaForm.projectStartingCondition") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <q-input
                outlined
                type="textarea"
                rows="10"
                class="no-shadow input-radius-6"
                :placeholder="
                  $t('projectIdeaPlaceholder.descripeProjectStartingCondition')
                "
                v-model="form.details.startingCondition"
                :rules="[(val) => !!val || $t('Required')]"
              />
            </div>
          </div>
          <!-- Project Starting Condition End -->
          <div class="row items-baseline">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">
                {{ $t("newProjectIdeaForm.projectContent") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <q-input
                outlined
                type="textarea"
                rows="10"
                class="no-shadow input-radius-6"
                :placeholder="$t('projectIdeaPlaceholder.descripeProject')"
                v-model="form.details.content"
                :rules="[(val) => !!val || $t('Required')]"
              />
            </div>
          </div>
          <div class="row items-baseline">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">
                {{ $t("newProjectIdeaForm.projectGoals") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <q-input
                outlined
                type="textarea"
                rows="10"
                class="no-shadow input-radius-6"
                :placeholder="$t('projectIdeaPlaceholder.describeProjectGoals')"
                v-model="form.details.goals"
                :rules="[(val) => !!val || $t('Required')]"
              />
            </div>
          </div>
          <div class="row items-baseline">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">
                {{ $t("newProjectIdeaForm.projectValue&Benefits") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <q-input
                outlined
                type="textarea"
                rows="10"
                class="no-shadow input-radius-6"
                :placeholder="$t('newProjectIdeaForm.projectValue&Benefits')"
                v-model="form.details.valuesAndBenefits"
                :rules="[(val) => !!val || $t('Required')]"
              />
            </div>
          </div>
          <div class="row items-center">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">
                {{ $t("newProjectIdeaForm.CooperationPartner") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <q-input
                outlined
                dense
                class="no-shadow input-radius-6"
                :placeholder="$t('newProjectIdeaForm.CooperationPartner')"
                v-model="form.details.partner"
                :rules="[]"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <q-separator class="bg-blue opacity-10" />
            </div>
          </div>
          <div class="row items-center">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">
                {{ $t("newProjectIdeaForm.investive/non-investive") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <q-btn-toggle
                v-model="form.details.investive"
                spread
                no-caps
                :rules="[(val) => !!val || $t('Required')]"
                toggle-color="yellow"
                padding="12px 10px"
                color="transparent"
                toggle-text-color="black"
                text-color="black"
                class="no-shadow toggleGap"
                :options="investiveNoninvestiveOptions"
              />
            </div>
          </div>
          <div class="row items-center">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">
                {{ $t("newProjectIdeaForm.projectStatus") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <q-btn-toggle
                v-model="form.details.status"
                :spread="$q.screen.gt.sm"
                no-caps
                clearable
                toggle-color="yellow"
                padding="12px 10px"
                color="transparent"
                toggle-text-color="black"
                text-color="black"
                class="no-shadow toggleGap"
                :class="{ flexWrap: $q.screen.lt.md }"
                :options="projectStatuses"
              />
            </div>
          </div>
          <div class="row items-baseline">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">
                {{ $t("newProjectIdeaForm.estimatedCost") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <EstimatedCost
                :editing="!!project ? project.estimatedCosts : []"
                @update:cost="form.estimatedCosts = $event"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <q-separator class="bg-blue opacity-10" />
            </div>
          </div>
          <div class="row items-center">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">
                {{ $t("newProjectIdeaForm.fundingGuidelines") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <Fundings
                :requiresValidation="false"
                :editing="!!project ? project.fundingGuideline : []"
                @update:linkToFunding="form.fundingGuideline = $event"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <q-separator class="bg-blue opacity-10" />
            </div>
          </div>
          <div class="row items-center">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">
                {{ $t("homeBtns.checkListBtn") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <Checklists
                :requiresValidation="false"
                :editing="!!project ? project.checklists : []"
                @update:linkToProject="form.checklists = $event"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <q-separator class="bg-blue opacity-10" />
            </div>
          </div>
          <div class="row items-baseline">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">
                {{ $t("newProjectIdeaForm.plaanedPeriod") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input
                    outlined
                    dense
                    class="no-shadow input-radius-6"
                    :value="dateFormatter(form.plannedStart)"
                    readonly
                    color="primary"
                    bg-color="white"
                    :placeholder="$t('projectIdeaPlaceholder.plannedStartDate')"
                    @click="$refs.qPlannedStartDateProxy.show()"
                    :rules="[(val) => !!val || $t('Required')]"
                  >
                    <template v-slot:append>
                      <q-icon name="event" color="blue-5" class="cursor-pointer">
                        <q-popup-proxy
                          ref="qPlannedStartDateProxy"
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            :options="plannedStartOptions"
                            v-model="form.plannedStart"
                            mask="YYYY-MM-DD"
                            @input="$refs.qPlannedStartDateProxy.hide()"
                            first-day-of-week="1"
                            :locale="datepickerLocale"
                          >
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                no-caps
                                :label="$t('Close')"
                                color="primary"
                                flat
                              />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    outlined
                    dense
                    class="no-shadow input-radius-6"
                    :value="dateFormatter(form.plannedEnd)"
                    color="primary"
                    readonly
                    bg-color="white"
                    :placeholder="$t('projectIdeaPlaceholder.plannedEndDate')"
                    @click="$refs.qPlannedEndDateProxy.show()"
                    :rules="[(val) => !!val || $t('Required')]"
                  >
                    <template v-slot:append>
                      <q-icon name="event" color="blue-5" class="cursor-pointer">
                        <q-popup-proxy
                          ref="qPlannedEndDateProxy"
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            :options="plannedEndOptions"
                            v-model="form.plannedEnd"
                            mask="YYYY-MM-DD"
                            @input="$refs.qPlannedEndDateProxy.hide()"
                            first-day-of-week="1"
                            :locale="datepickerLocale"
                          >
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                no-caps
                                :label="$t('Close')"
                                color="primary"
                                flat
                              />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <q-separator class="bg-blue opacity-10" />
            </div>
          </div>
          <div class="row items-baseline">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">
                {{ $t("projectContent.links") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <Links
                :editing="!!project ? project.links : []"
                @update:link="form.links = $event"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <q-separator class="bg-blue opacity-10" />
            </div>
          </div>
          <div class="row items-baseline">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">{{ $t("projectIdeaPlaceholder.uploads") }}</p>
            </div>
            <div class="col-12 col-md-8">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-file
                    flat
                    v-model="form.media"
                    class="uploadInput input-radius-6 text-white"
                    label-color="white"
                    dark
                    bg-color="primary"
                    :label="
                      !!form.media && form.media.length > 0
                        ? $t('Add Images')
                        : $t('Select Images')
                    "
                    multiple
                    display-value=""
                    append
                  >
                    <template v-slot:prepend>
                      <q-icon color="white" class="on-right" name="upload" />
                    </template>
                  </q-file>
                  <div class="q-mt-sm" v-if="form.media && form.media.length > 0">
                    <div
                      class="q-col-gutter-x-sm row radius-6 shadow-1 q-mt-sm items-center q-pa-sm"
                      v-for="(image, index) in form.media"
                      :key="index"
                    >
                      <div class="col-auto">
                        <q-avatar rounded size="48px">
                          <q-img :ratio="1" contain :src="imgPreview(image).url" />
                        </q-avatar>
                      </div>
                      <div class="col-8">
                        <q-item-label class="ellipsis" caption>{{
                          imgPreview(image).name
                        }}</q-item-label>
                      </div>
                      <div class="col-auto text-right">
                        <q-btn
                          icon="delete"
                          @click.prevent.stop="removeImg(index)"
                          size="sm"
                          round
                          text-color="red"
                          dense
                        >
                        </q-btn>
                      </div>
                      <div class="col-12 q-mt-sm">
                        <q-btn
                          :label="
                            !!imgPreview(image).caption
                              ? $t('Edit caption')
                              : $t('Add Caption')
                          "
                          @click.prevent.stop="addCaption(image, index)"
                          text-color="primary"
                          dense
                          class="radius-6"
                          no-caps
                          flat
                        >
                        </q-btn>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <q-file
                    flat
                    v-model="form.files"
                    class="uploadInput input-radius-6 text-white"
                    label-color="white"
                    dark
                    bg-color="primary"
                    :label="
                      !!form.files && form.files.length > 0
                        ? $t('Add Files')
                        : $t('Select Files')
                    "
                    multiple
                    display-value=""
                    append
                  >
                    <template v-slot:prepend>
                      <q-icon color="white" class="on-right" name="upload" />
                    </template>
                  </q-file>
                  <div class="q-mt-sm" v-if="form.files && form.files.length > 0">
                    <q-item
                      class="radius-6"
                      v-for="(file, index) in form.files"
                      :key="index"
                      clickable
                    >
                      <q-item-section side>
                        <q-avatar rounded size="48px">
                          <small>{{ imgPreview(file).name.split(".")[1] }}</small>
                        </q-avatar>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label class="ellipsis" caption>{{
                          imgPreview(file).name
                        }}</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-btn
                          icon="delete"
                          @click.prevent.stop="removeFile(index)"
                          size="sm"
                          round
                          text-color="red"
                          dense
                        >
                        </q-btn>
                      </q-item-section>
                    </q-item>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <q-separator class="bg-blue opacity-10" />
            </div>
          </div>
          <div class="row justify-center">
            <div class="col-5 col-md-3 q-ml-sm">
              <q-btn
                :label="$t('publishButton.publish')"
                @click="project ? editProjectIdea(true) : submitNewProjectIdea(true)"
                size="16px"
                color="primary"
                :loading="isLoading"
                no-caps
                class="radius-6 q-py-xs full-width"
              />
            </div>
          </div>
        </q-form>
      </div>
    </div>
    <ImageDialog
      :imageIndex="imageIndex"
      :image="image"
      type="project"
      :document="!!project ? project : null"
      :dialogState="imageDialog"
      @update="(imageDialog = false), (imageIndex = null), (image = null)"
      @add-caption="updateCaption"
    />
  </q-page>
</template>

<script>
import { scroll } from "quasar";
const { getScrollTarget, setScrollPosition } = scroll;
import UserSelect from "components/user/UserSelect.vue";
import Categories from "components/projects/create/Categories.vue";
import Tags from "components/projects/create/Tags.vue";
import EstimatedCost from "src/components/projects/create/EstimatedCost.vue";
import Links from "components/projects/create/Links.vue";
import Fundings from "components/funding/Fundings.vue";
import ImageDialog from "components/ImageDialog.vue";
import { dateFormatter } from "src/boot/dateFormatter";
import Checklists from "components/projects/implementationChecklists/implementationChecklists.vue";
import MunicipalityCities from "components/Municipality/MunicipalityCities.vue";

export default {
  name: "newProjectIdea",
  components: {
    UserSelect,
    Categories,
    Tags,
    EstimatedCost,
    MunicipalityCities,
    Links,
    Checklists,
    Fundings,
    ImageDialog,
  },
  data() {
    return {
      imageIndex: null,
      image: null,
      imageDialog: false,
      form: {
        title: "",
        plannedStart: "",
        plannedEnd: "",
        visibility: "",
        info: {
          contactName: "",
          phone: "",
          email: "",
          location: "",
          streetNo: "",
          postalCode: "",
        },
        details: {
          startingCondition: "",
          content: "",
          goals: "",
          valuesAndBenefits: "",
          partner: "",
          investive: true,
          status: "",
        },
        fundingGuideline: [],
        checklists: [],
        municipality: "",
        editors: [],
        categories: [],
        tags: [],
        estimatedCosts: [],
        links: [],
        media: null,
        files: null,
      },
      isLoading: false,
      dataLoaded: true,
    };
  },
  methods: {
    updateCaption(value, index) {
      this.form.media[index].caption = value;
    },
    addCaption(image, index) {
      this.imageDialog = true;
      this.imageIndex = index;
      this.image = image;
    },
    plannedEndOptions(date) {
      if (!!this.form.plannedStart) {
        const calendarDate = date.replace(/\//g, "-");
        return calendarDate >= this.form.plannedStart;
      } else {
        return true;
      }
    },
    plannedStartOptions(date) {
      if (!!this.form.plannedEnd) {
        const calendarDate = date.replace(/\//g, "-");
        return calendarDate <= this.form.plannedEnd;
      } else {
        return true;
      }
    },
    dateFormatter,
    imgPreview(val) {
      return {
        url: !!val.id ? `${this.appUrl}${val.url}` : URL.createObjectURL(val),
        name: val.name,
        caption: val.caption,
      };
    },
    removeImg(index) {
      this.form.media.splice(index, 1);
    },
    removeFile(index) {
      this.form.files.splice(index, 1);
    },
    scrollToInvalidElement(ref) {
      const el = ref.$el;
      const target = getScrollTarget(el);
      const offset = el.offsetTop;
      const duration = 500;
      setScrollPosition(target, offset, duration);
    },
    submitNewProjectIdea(val) {
      const published = val;
      this.$refs.newProjectIdeaForm.validate().then(async (success) => {
        if (success) {
          this.isLoading = true;
          await this.checkOptionalParameters();
          const res = await this.$store.dispatch("project/createNewProjectIdea", {
            data: {
              ...this.form,
              published: published,
              info: {
                ...this.form.info,
                contactName: this.userDetails.fullName,
                phone: this.userDetails.phone,
                email: this.user.email,
                streetNo: this.userDetails.streetNo,
                postalCode: this.userDetails.postalCode,
              },
              municipality: {
                id: this.userDetails.municipality && this.userDetails.municipality.id,
              },
              owner: {
                id: this.user && this.user.id,
              },
            },
          });
          this.isLoading = false;
        } else {
          const elements = this.$refs.newProjectIdeaForm.getValidationComponents();
          elements.map((el) => {
            if (el.validate) {
              el.validate();
            }
          });
        }
      });
    },
    async checkOptionalParameters() {
      if (!this.project) {
        if (!!this.form.fundingGuideline && this.form.fundingGuideline.length < 1) {
          delete this.form.fundingGuideline;
        }
        if (!this.form.details.status) {
          delete this.form.details.status;
        }
      }
    },
    editProjectIdea(val) {
      const published = val;
      this.$refs.newProjectIdeaForm.validate().then(async (success) => {
        if (success) {
          this.isLoading = true;
          await this.checkOptionalParameters();
          const res = await this.$store.dispatch("project/editProjectIdea", {
            data: {
              ...this.form,
              published: published,
            },
          });
          this.isLoading = false;
        } else {
          const elements = this.$refs.newProjectIdeaForm.getValidationComponents();
          elements.map((el) => {
            if (el.validate) {
              el.validate();
            }
          });
        }
      });
    },
    async setData() {
      if (!!this.$route.params && this.$route.params.id) {
        this.dataLoaded = false;
        this.$q.loading.show();
        await this.$store.dispatch("project/getSpecificProject", {
          id: Number(this.$route.params.id),
        });
        this.form = {
          ...this.form,
          ...JSON.parse(
            JSON.stringify({
              ...this.project,
              files: this.project.files,
              media: this.project.media,
            })
          ),
        };
        this.$q.loading.hide();
        this.dataLoaded = true;
      }
      this.$store.dispatch("userCenter/getUsers");
    },
  },
  computed: {
    datepickerLocale() {
      return {
        days: [
          this.$t("Sunday"),
          this.$t("Monday"),
          this.$t("Tuesday"),
          this.$t("Wednesday"),
          this.$t("Thursday"),
          this.$t("Friday"),
          this.$t("Saturday"),
        ],
        daysShort: [
          this.$t("Sun"),
          this.$t("Mon"),
          this.$t("Tue"),
          this.$t("Wed"),
          this.$t("Thu"),
          this.$t("Fri"),
          this.$t("Sat"),
        ],
        months: [
          this.$t("January"),
          this.$t("February"),
          this.$t("March"),
          this.$t("April"),
          this.$t("May"),
          this.$t("June"),
          this.$t("July"),
          this.$t("August"),
          this.$t("September"),
          this.$t("October"),
          this.$t("November"),
          this.$t("December"),
        ],
        monthsShort: [
          this.$t("Jan"),
          this.$t("Feb"),
          this.$t("Mar"),
          this.$t("Apr"),
          this.$t("May"),
          this.$t("Jun"),
          this.$t("Jul"),
          this.$t("Aug"),
          this.$t("Sep"),
          this.$t("Oct"),
          this.$t("Nov"),
          this.$t("Dec"),
        ],
      };
    },
    appUrl() {
      return process.env.VUE_APP_MAIN_URL;
    },
    userDetails() {
      return (
        this.$store.state.userCenter.user && this.$store.state.userCenter.user.userDetails
      );
    },
    user() {
      return this.$store.state.userCenter.user.user;
    },
    project() {
      return (
        !!this.$route.params.id &&
        JSON.parse(JSON.stringify(this.$store.state.project.project))
      );
    },
    visibilityOptions() {
      return [
        {
          value: "only for me",
          label: this.$t("visibility.onlyMe"),
        },
        {
          value: "all users",
          label: this.$t("visibility.allUsers"),
        },
        {
          value: "listed only",
          label: this.$t("visibility.listedOnly"),
        },
      ];
    },
    investiveNoninvestiveOptions() {
      return [
        { label: this.$t("Investive"), value: true },
        { label: this.$t("Non-Investive"), value: false },
      ];
    },
    projectStatuses() {
      return [
        { label: this.$t("projectStatusesOptions.idea"), value: "Idea" },
        {
          label: this.$t("projectStatusesOptions.development"),
          value: "Development",
        },
        {
          label: this.$t("projectStatusesOptions.pre-planning"),
          value: "Pre-Planning",
        },
        {
          label: this.$t("projectStatusesOptions.detailedPlanning"),
          value: "Detailed-Planning",
        },
      ];
    },
  },
  mounted() {
    this.setData();
  },
  beforeDestroy() {
    this.$q.loading.hide();
  },
};
</script>

<style lang="scss">
.toggleGap {
  gap: 15px;
  > button {
    border-radius: 10px !important;
    border: 1px solid $yellow;
  }
}
.flexWrap {
  flex-wrap: wrap !important;
}
.disabledClass {
  .q-field__inner .q-field__control input {
    color: black;
    opacity: 1 !important;
  }
  .q-field__inner .q-field__control:before {
    border-color: $primary;
  }
}
</style>
