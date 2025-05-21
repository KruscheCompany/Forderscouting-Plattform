<template>
  <q-page :class="$q.screen.gt.sm ? 'q-mx-xl' : 'q-mx-sm'" class="q-mt-lg">
    <div v-if="dataLoaded">
      <p class="text-center font-36 text-weight-regular q-my-lg ppeditorial">
        {{ $t("myData.fundings") }}
      </p>
      <div
        class="bg-white radius-20 q-py-lg"
        :class="{ 'q-px-md': $q.screen.gt.sm }"
      >
        <q-form
          @validation-error="scrollToInvalidElement"
          ref="newFundingForm"
          class="q-gutter-lg q-px-md q-mb-md"
        >
          <div class="row items-baseline">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">
                {{ $t("projectContent.fundingGuidelines") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <q-input
                outlined
                dense
                class="no-shadow input-radius-6"
                :placeholder="$t('official title')"
                v-model="form.title"
                :rules="[val => !!val || $t('Required')]"
              />
            </div>
          </div>
          <div class="row items-baseline">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">
                {{ $t("funding provider") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <div class="row q-col-gutter-x-md">
                <div class="col-12">
                  <q-input
                    outlined
                    dense
                    class="no-shadow input-radius-6"
                    :placeholder="$t('funding provider')"
                    v-model="form.provider"
                    :rules="[val => !!val || $t('Required')]"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="row items-baseline">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">
                {{ $t("Contact person") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <div class="row q-col-gutter-x-md q-col-gutter-y-lg">
                <div class="col-12">
                  <q-input
                    outlined
                    dense
                    class="no-shadow input-radius-6"
                    :placeholder="$t('projectIdeaPlaceholder.nameSurname')"
                    v-model="form.info.contactName"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="row items-baseline">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">
                {{ $t("Contact Details (optional)") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <div class="row q-col-gutter-x-md q-col-gutter-y-lg">
                <div class="col-6">
                  <q-input
                    outlined
                    dense
                    class="no-shadow input-radius-6"
                    :placeholder="$t('projectIdeaPlaceholder.streetNr')"
                    v-model="form.info.streetNo"
                  />
                </div>
                <div class="col-6">
                  <q-input
                    outlined
                    dense
                    class="no-shadow input-radius-6"
                    :placeholder="$t('projectIdeaPlaceholder.postalCity/place')"
                    v-model="form.info.postalCode"
                  />
                </div>
                <div class="col-6">
                  <q-input
                    outlined
                    dense
                    class="no-shadow input-radius-6"
                    :placeholder="$t('projectIdeaPlaceholder.telephone')"
                    v-model="form.info.phone"
                  />
                </div>
                <div class="col-6">
                  <q-input
                    outlined
                    dense
                    class="no-shadow input-radius-6"
                    :placeholder="$t('projectIdeaPlaceholder.email')"
                    v-model="form.info.email"
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
                {{ $t("Invite Editor") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <UserSelect
                :editing="!!funding ? funding.editors : []"
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
                emit-value
                :options="visibilityOptions"
                :rules="[val => !!val || $t('Required')]"
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
              <p class="font-16 no-margin">{{ $t("Filter Categories") }}</p>
            </div>
            <div class="col-12 col-md-8">
              <Categories
                :requiresValidation="true"
                :editing="!!funding ? funding.categories : []"
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
                :editing="!!funding ? funding.tags : []"
                @update:tag="form.tags = $event"
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
                {{ $t("Funding goal") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <q-input
                outlined
                type="textarea"
                rows="10"
                class="no-shadow input-radius-6"
                placeholder="Förderziel"
                v-model="form.details.goal"
              />
            </div>
          </div>
          <div class="row items-baseline">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">
                {{ $t("What is funded?") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <q-input
                outlined
                type="textarea"
                rows="10"
                class="no-shadow input-radius-6"
                placeholder="Was wird gefördert"
                v-model="form.details.funded"
              />
            </div>
          </div>
          <div class="row items-baseline">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">
                {{ $t("What is not funded?") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <q-input
                outlined
                type="textarea"
                rows="10"
                class="no-shadow input-radius-6"
                placeholder="Was wird nicht gefördert"
                v-model="form.details.notFunded"
              />
            </div>
          </div>
          <div class="row items-baseline">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">
                {{ $t("Who will be funded?") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <q-input
                outlined
                type="textarea"
                rows="10"
                class="no-shadow input-radius-6"
                :placeholder="$t('Who will be funded?')"
                v-model="form.details.willBeFunded"
              />
            </div>
          </div>
          <div class="row items-baseline">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin q-pr-md">
                {{ $t("Conditions for Applicants") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <q-input
                outlined
                type="textarea"
                rows="10"
                class="no-shadow input-radius-6"
                placeholder="Rahmenbedingungen für Antragsteller*in"
                v-model="form.details.condition"
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
                {{ $t("Funding rates") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <FundingRate
                :editing="!!funding ? funding.rates : []"
                @update:fundingRate="form.rates = $event"
              />
            </div>
          </div>

          <div class="row items-center">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">
                {{ $t("Own contribution") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <q-input
                outlined
                dense
                class="no-shadow input-radius-6 removeArrow"
                suffix="%"
                placeholder="0"
                v-model="form.ownContribution"
                :rules="[]"
              />
            </div>
          </div>
          <div class="row items-center">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">
                {{ $t("Accumulability") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <q-btn-toggle
                v-model="form.accumulability"
                spread
                no-caps
                toggle-color="yellow"
                padding="12px 10px"
                color="transparent"
                toggle-text-color="black"
                text-color="black"
                class="no-shadow toggleGap"
                :options="accumulabilityOptions"
              />
            </div>
          </div>
          <div v-if="form.accumulability" class="row items-center">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">
                {{ $t("Link to fundings") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <Fundings
                :requiresValidation="false"
                :editing="funding.fundingsLinkedTo"
                @update:linkToFunding="form.fundingsLinkedTo = $event"
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
                {{ $t("Basis for assessment") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <q-input
                outlined
                type="textarea"
                rows="10"
                class="no-shadow input-radius-6"
                :placeholder="$t('Basis for assessment')"
                v-model="form.assessment"
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
                {{ $t("Funding Period") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <div class="row q-col-gutter-x-md">
                <div class="col-6">
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
                    :rules="[val => !!val || $t('Required')]"
                  >
                    <template v-slot:append>
                      <q-icon
                        name="event"
                        color="blue-5"
                        class="cursor-pointer"
                      >
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
                <div class="col-6">
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
                    :rules="[val => !!val || $t('Required')]"
                  >
                    <template v-slot:append>
                      <q-icon
                        name="event"
                        color="blue-5"
                        class="cursor-pointer"
                      >
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
          <div class="row items-center">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">
                {{ $t("Notes to the funding period") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <div class="row q-col-gutter-x-md">
                <div class="col-12">
                  <q-input
                    outlined
                    dense
                    class="no-shadow input-radius-6"
                    v-model="form.notes"
                    color="primary"
                    bg-color="white"
                    placeholder="Hinweise zum Förderzeitraum"
                  >
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
                Links
              </p>
            </div>
            <div class="col-12 col-md-8">
              <Links
                :editing="!!funding ? funding.links : []"
                @update:link="form.links = $event"
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
                Uploads
              </p>
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
                  <div
                    class="q-mt-sm"
                    v-if="form.media && form.media.length > 0"
                  >
                    <div
                      class="q-col-gutter-x-sm row radius-6 shadow-1 q-mt-sm items-center q-pa-sm"
                      v-for="(image, index) in form.media"
                      :key="index"
                    >
                      <div class="col-auto">
                        <q-avatar rounded size="48px">
                          <q-img
                            :ratio="1"
                            contain
                            :src="imgPreview(image).url"
                          />
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
                          class="radius-6 "
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
                  <div
                    class="q-mt-sm"
                    v-if="form.files && form.files.length > 0"
                  >
                    <q-item
                      v-for="(file, index) in form.files"
                      :key="index"
                      clickable
                    >
                      <q-item-section side>
                        <q-avatar rounded size="48px">
                          <small>{{
                            imgPreview(file).name.split(".")[1]
                          }}</small>
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
          <div class="row items-center">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">
                {{ $t("Link to project ideas (optional)") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <ProjectIdeas
                :editing="!!funding ? funding.projects : []"
                @update:linkToProject="form.projects = $event"
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
              <p
                class="font-16 no-margin"
                :class="$q.screen.gt.md ? 'q-pr-xl' : ''"
              >
                {{ $t("Link to implementation checklist (optional)") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <ImplementationChecklists
                :editing="!!funding ? funding.checklist : null"
                @update:linkToImplementationChecklist="form.checklist = $event"
              />
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
                :label="$t('newProjectIdeaForm.publish')"
                @click="!!funding ? editFunding(true) : submitNewFunding(true)"
                unelevated
                size="16px"
                color="primary"
                no-caps
                class="radius-6 q-py-xs full-width"
                :loading="isLoading"
              />
            </div>
          </div>
        </q-form>
      </div>
    </div>
    <ImageDialog
      :imageIndex="imageIndex"
      :image="image"
      type="funding"
      :document="!!funding ? funding : null"
      :dialogState="imageDialog"
      @update="(imageDialog = false), (imageIndex = null), (image = null)"
      @add-caption="updateCaption"
    />
  </q-page>
</template>

<script>
import { scroll } from "quasar";
const { getScrollTarget, setScrollPosition } = scroll;
import { dateFormatter } from "src/boot/dateFormatter";
import UserSelect from "components/user/UserSelect.vue";
import Categories from "components/projects/create/Categories.vue";
import Tags from "components/projects/create/Tags.vue";
import FundingRate from "src/components/funding/FundingRate.vue";
import Links from "src/components/projects/create/Links.vue";
import ProjectIdeas from "components/funding/ProjectIdeas.vue";
import ImplementationChecklists from "components/funding/ImplementationChecklists.vue";
import Fundings from "components/funding/Fundings.vue";
import ImageDialog from "components/ImageDialog.vue";
import MunicipalityCities from "components/Municipality/MunicipalityCities.vue";

export default {
  name: "newFund",
  components: {
    UserSelect,
    Categories,
    Tags,
    FundingRate,
    MunicipalityCities,
    Links,
    ProjectIdeas,
    ImplementationChecklists,
    Fundings,
    ImageDialog
  },
  data() {
    return {
      imageIndex: null,
      image: null,
      imageDialog: false,
      form: {
        title: "",
        visibility: "",
        provider: "",
        assessment: "",
        info: {
          contactName: "",
          phone: "",
          email: "",
          streetNo: "",
          postalCode: "",
          location: ""
        },
        details: {
          goal: "",
          funded: "",
          notFunded: "",
          willBeFunded: "",
          condition: ""
        },
        ownContribution: "",
        accumulability: false,
        plannedStart: "",
        plannedEnd: "",
        notes: "",
        editors: [],
        rates: [],
        links: [],
        categories: [],
        tags: [],
        projects: [],
        checklist: null,
        media: null,
        files: null,
        fundingsLinkedTo: []
      },
      accumulabilityOptions: [
        { label: "Ja", value: true },
        { label: "Nein", value: false }
      ],
      isLoading: false,
      dataLoaded: true
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
    scrollToInvalidElement(ref) {
      const el = ref.$el;
      const target = getScrollTarget(el);
      const offset = el.offsetTop;
      const duration = 500;
      setScrollPosition(target, offset, duration);
    },
    dateFormatter,
    imgPreview(val) {
      return {
        url: !!val.id ? `${this.appUrl}${val.url}` : URL.createObjectURL(val),
        name: val.name,
        caption: val.caption
      };
    },
    removeImg(index) {
      this.form.media.splice(index, 1);
    },
    removeFile(index) {
      this.form.files.splice(index, 1);
    },
    submitNewFunding(val) {
      const published = val;
      this.$refs.newFundingForm.validate().then(async success => {
        if (success) {
          this.isLoading = true;
          await this.checkOptionalParameters();
          const res = await this.$store.dispatch("funding/createNewFunding", {
            data: {
              ...this.form,
              published: published,
              municipality: {
                id:
                  this.userDetails.municipality &&
                  this.userDetails.municipality.id
              },
              owner: {
                id: this.user && this.user.id
              }
            }
          });
          if (res !== false) {
            console.log("RES WASN'T FALSE");
          }
          this.isLoading = false;
        } else {
          const elements = this.$refs.newFundingForm.getValidationComponents();
          elements.map(el => {
            if (el.validate) {
              el.validate();
            }
          });
        }
      });
    },
    editFunding(val) {
      const published = val;
      this.$refs.newFundingForm.validate().then(async success => {
        if (success) {
          this.isLoading = true;
          await this.checkOptionalParameters();
          const res = await this.$store.dispatch("funding/editFunding", {
            data: {
              ...this.form,
              published: published,
              municipality: {
                id:
                  this.userDetails.municipality &&
                  this.userDetails.municipality.id
              }
              // owner: {
              //   id: this.user && this.user.id
              // }
            }
          });
          this.isLoading = false;
        } else {
          const elements = this.$refs.newFundingForm.getValidationComponents();
          elements.map(el => {
            if (el.validate) {
              el.validate();
            }
          });
        }
      });
    },
    checkOptionalParameters() {
      // if Editing a funding
      if (!!this.funding) {
        console.log("Editing");
        // if (this.form.accumulability === true) {
        // this.form.fundingsLinkedTo = null;
        // this.$refs.fundings.validate();
        // }
      } else {
        console.log("Creating");
        if (
          this.form.fundingsLinkedTo &&
          this.form.fundingsLinkedTo.length < 1
        ) {
          delete this.form.fundingsLinkedTo;
        } else {
          // this.$refs.fundings.validate();
        }
        if (!this.form.checklist) {
          delete this.form.checklist;
        }
        if (!!this.form.projects && this.form.projects.length < 1) {
          delete this.form.projects;
        }
      }
    },
    async setData() {
      if (!!this.$route.params && this.$route.params.id) {
        this.dataLoaded = false;
        this.$q.loading.show();
        await this.$store.dispatch("funding/getSpecificFunding", {
          id: Number(this.$route.params.id)
        });
        this.form = {
          ...this.form,
          ...this.funding,
          files: this.funding.files,
          media: this.funding.media
        };
        this.$q.loading.hide();
        this.dataLoaded = true;
      }
      this.$store.dispatch("userCenter/getUsers");

      if (this.form.archived && !isAdmin) {
        this.$q.notify({
          message: this.$t("Der Zugang zu archivierten Dokumenten ist nicht möglich"),
          color: "negative",
          position: "top"
        });
        this.$router.go(-1);
        
      }
    }
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
          this.$t("Saturday")
        ],
        daysShort: [
          this.$t("Sun"),
          this.$t("Mon"),
          this.$t("Tue"),
          this.$t("Wed"),
          this.$t("Thu"),
          this.$t("Fri"),
          this.$t("Sat")
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
          this.$t("December")
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
          this.$t("Dec")
        ]
      };
    },
    visibilityOptions() {
      return [
        {
          value: "only for me",
          label: this.$t("visibility.onlyMe")
        },
        {
          value: "all users",
          label: this.$t("visibility.allUsers")
        },
        {
          value: "listed only",
          label: this.$t("visibility.listedOnly")
        }
      ];
    },
    appUrl() {
      return process.env.VUE_APP_MAIN_URL;
    },
    userDetails() {
      return (
        this.$store.state.userCenter.user &&
        this.$store.state.userCenter.user.userDetails
      );
    },
    user() {
      return this.$store.state.userCenter.user.user;
    },
    funding() {
      return (
        !!this.$route.params.id &&
        JSON.parse(JSON.stringify(this.$store.state.funding.funding))
      );
    }
  },
  mounted() {
    // if (!!this.funding && !!this.$route.params.id) {
    this.setData();
    // }
  }
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
.removeArrow input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.removeArrow input[type="number"] {
  -moz-appearance: textfield;
}
</style>
