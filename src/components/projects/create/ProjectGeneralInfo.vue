<template>
  <q-expansion-item class="shadow-1 overflow-hidden radius-20 col-12 q-mt-md bg-white" :label="$t(
    'projectContent.generalInformation')" header-class="bg-white text-black" v-model="expanded">
    <q-form @validation-error="scrollToInvalidElement" ref="newProjectIdeaForm" class="q-gutter-lg q-px-md ">
      <div class="row items-baseline">
        <div class="col-12 col-md-3 col-lg-2 col-xl-2">
          <p class="font-16 no-margin">
            {{ $t("newProjectIdeaForm.projectName") }}
          </p>
        </div>
        <div class="col-12 col-md-9 col-lg-10 col-xl-10">
          <q-input outlined dense class="no-shadow input-radius-6" :placeholder="$t('projectIdeaPlaceholder.title')"
            v-model="localForm.title" :rules="[(val) => !!val || $t('Required')]" />
        </div>
      </div>
      <div class="row items-center">
        <div class="col-12 col-md-3 col-lg-2 col-xl-2">
          <p class="font-16 no-margin">
            {{ $t("newProjectIdeaForm.contactPerson") }}
          </p>
        </div>
        <div class="col-12 col-md-9 col-lg-10 col-xl-10">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input outlined dense class="no-shadow input-radius-6 disabledClass"
                :placeholder="$t('projectIdeaPlaceholder.nameSurname')" :value="!!project
                  ? localForm.info.contactName
                  : !!userDetails && userDetails.fullName
                  " disable />
            </div>
            <div class="col-12 col-md-6" v-if="needsMunicipalityPicker">
              <q-select outlined dense class="no-shadow input-radius-6" v-model="selectedLandkreisMunicipality"
                :options="landkreisMunicipalityOptions" option-value="id" option-label="title" emit-value map-options
                :rules="[(val) => !!val || $t('Required')]"
                :placeholder="$t('projectComponents.generalInfo.municipalityPlaceholder')"
                @input="$emit('update:selected-municipality', $event)" />
            </div>
            <div class="col-12 col-md-6" v-else>
              <q-input outlined dense disable class="no-shadow input-radius-6 disabledClass"
                :placeholder="$t('projectComponents.generalInfo.municipalityPlaceholder')" :value="!!project
                  ? localForm.municipality.title
                  : !!userDetails && userDetails.municipality && userDetails.municipality.title
                  " :rules="[]" />
            </div>
          </div>
        </div>
      </div>
      <div class="row items-baseline">
        <div class="col-12 col-md-3 col-lg-2 col-xl-2">
          <p class="font-16 no-margin">
            {{ $t("newProjectIdeaForm.contactDetails") }}
          </p>
        </div>
        <div class="col-12 col-md-9 col-lg-10 col-xl-10">
          <div class="row q-col-gutter-x-md" :class="$q.screen.gt.sm ? 'q-col-gutter-y-lg' : 'q-col-gutter-y-md'">
            <div class="col-12 col-md-6">
              <q-input outlined dense class="no-shadow input-radius-6 disabledClass"
                :placeholder="$t('projectIdeaPlaceholder.streetNr')" :value="!!project
                  ? localForm.info.streetNo
                  : !!userDetails && userDetails.streetNo
                  " disable />
            </div>
            <div class="col-12 col-md-6">
              <q-input outlined dense class="no-shadow input-radius-6 disabledClass"
                :placeholder="$t('projectIdeaPlaceholder.postalCity/place')" :value="!!project
                  ? localForm.info.postalCode
                  : !!userDetails && userDetails.postalCode
                  " disable />
            </div>
            <div class="col-12 col-md-6">
              <q-input outlined dense class="no-shadow input-radius-6 disabledClass"
                :placeholder="$t('projectIdeaPlaceholder.telephone')" :value="!!project ? localForm.info.phone : !!userDetails && userDetails.phone
                  " disable />
            </div>
            <div class="col-12 col-md-6">
              <q-input outlined dense class="no-shadow input-radius-6 disabledClass"
                :placeholder="$t('projectIdeaPlaceholder.email')"
                :value="!!project ? localForm.info.email : !!user && user.email" disable />
            </div>
            <div class="col-12">
              <MunicipalityCities :currentMunicipality="localForm.info.location" @update:city="updateLocation" />
            </div>
          </div>
        </div>
      </div>
      <div class="row items-center">
        <div class="col-12 col-md-3 col-lg-2 col-xl-2" style="height: -webkit-fill-available;">
          <p class="font-16 no-margin">
            {{ $t("newProjectIdeaForm.inviteEditors") }}
          </p>
        </div>
        <div class="col-12 col-md-9 col-lg-10 col-xl-10">
          <UserSelect :editing="editingEditors" @update:user="updateEditors" />
        </div>
      </div>
      <div class="row items-baseline">
        <div class="col-12 col-md-3 col-lg-2 col-xl-2">
          <p class="font-16 no-margin">
            {{ $t("newProjectIdeaForm.visibility") }}
          </p>
        </div>
        <div class="col-12 col-md-9 col-lg-10 col-xl-10">
          <q-select outlined dense v-model="localForm.visibility" :options="visibilityOptions" emit-value
            :rules="[(val) => !!val || $t('Required')]" class="no-shadow input-radius-6"
            options-selected-class="text-primary">
            <template v-slot:selected>
              <template v-if="localForm.visibility">
                {{
                  localForm.visibility === "only for me"
                    ? $t("visibility.onlyMe")
                    : localForm.visibility === "all users"
                      ? $t("visibility.allUsers")
                      : localForm.visibility === "listed only"
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
              localForm.visibility === "only for me"
                ? $t("visibility.docOnlyMe")
                : localForm.visibility === "all users"
                  ? $t("visibility.docAllUsers")
                  : localForm.visibility === "listed only"
                    ? $t("visibility.docListedOnly")
                    : ""
            }}
          </p>
        </div>
      </div>
    </q-form>
  </q-expansion-item>
</template>

<script>
import UserSelect from "components/user/UserSelect.vue";
import MunicipalityCities from "components/Municipality/MunicipalityCities.vue";
import { scroll } from "quasar";
const { getScrollTarget, setScrollPosition } = scroll;
export default {
  name: "ProjectGeneralInfo",
  emits: ['update:form-data', 'update:selected-municipality'],
  components: {
    UserSelect,
    MunicipalityCities,
  },
  props: {
    currentTab: {
      type: String,
      default: null,
      required: true
    },
    formData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      expanded: this.currentTab === "project",
      localForm: {
        title: "",
        visibility: "",
        info: {
          contactName: "",
          phone: "",
          email: "",
          location: "",
          streetNo: "",
          postalCode: "",
        },
        municipality: "",
        editors: [],
      },
      isLoading: false,
      dataLoaded: true,
      selectedLandkreisMunicipality: null,
    };
  },
  computed: {
    project() {
      return this.$store.getters["project/getProject"];
    },
    needsMunicipalityPicker() {
      return !this.project && !this.userDetails?.municipality && !!this.userDetails?.landkreis;
    },
    landkreisMunicipalityOptions() {
      return this.userDetails?.landkreis?.municipalities || [];
    },

    // Stable computed properties for child component props
    editingEditors() {
      return this.project?.editors || [];
    },

    userDetails() {
      return (
        this.$store.state.userCenter.user && this.$store.state.userCenter.user.userDetails
      );
    },
    user() {
      return this.$store.state.userCenter.user.user;
    },
    visibilityOptions() {
      return [
        { label: this.$t("visibility.onlyMe"), value: "only for me" },
        { label: this.$t("visibility.allUsers"), value: "all users" },
        { label: this.$t("visibility.listedOnly"), value: "listed only" },
      ];
    },
  },
  watch: {
    currentTab(newTab) {
      this.expanded = newTab === "project";
    },
  },
  methods: {
    getCurrentFormData() {
      // Method to be called by parent to get current form data
      return this.localForm;
    },
    updateLocation(location) {
      this.localForm.info.location = location;
    },
    updateEditors(editors) {
      this.localForm.editors = editors;
    },
    async validateForm() {
      if (this.$refs.newProjectIdeaForm) {
        return await this.$refs.newProjectIdeaForm.validate();
      }
      return false;
    },
    scrollToInvalidElement(ref) {
      const el = ref.$el;
      const target = getScrollTarget(el);
      const offset = el.offsetTop;
      const duration = 500;
      setScrollPosition(target, offset, duration);
    },
    setData(formData) {
      this.localForm = {
        title: formData.title || "",
        visibility: formData.visibility || "",
        info: {
          contactName: formData.info?.contactName || "",
          phone: formData.info?.phone || "",
          email: formData.info?.email || "",
          location: formData.info?.location || "",
          streetNo: formData.info?.streetNo || "",
          postalCode: formData.info?.postalCode || "",
        },
        municipality: formData.municipality || "",
        editors: formData.editors || [],
      };
    }
  },
}
</script>

<style lang="scss" scoped></style>
