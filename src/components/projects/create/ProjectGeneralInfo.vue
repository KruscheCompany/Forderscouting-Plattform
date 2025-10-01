<template>
  <q-expansion-item class="shadow-1 overflow-hidden radius-20 col-12 q-mt-md bg-white" :label="$t(
    'projectContent.generalInformation')" header-class="bg-white text-black" v-model="expanded">
    <q-form @validation-error="scrollToInvalidElement" ref="newProjectIdeaForm" class="q-gutter-lg q-px-md ">
      <div class="row items-baseline">
        <div class="col-12 col-md-4">
          <p class="font-16 no-margin">
            {{ $t("newProjectIdeaForm.projectName") }}
          </p>
        </div>
        <div class="col-12 col-md-8">
          <q-input outlined dense class="no-shadow input-radius-6" :placeholder="$t('projectIdeaPlaceholder.title')"
            v-model="localForm.title" :rules="[(val) => !!val || $t('Required')]" />
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
              <q-input outlined dense class="no-shadow input-radius-6 disabledClass"
                :placeholder="$t('projectIdeaPlaceholder.nameSurname')" :value="!!project
                  ? localForm.info.contactName
                  : !!userDetails && userDetails.fullName
                  " disable />
            </div>
            <div class="col-12 col-md-6">
              <q-input outlined dense disable class="no-shadow input-radius-6 disabledClass"
                :placeholder="$t('projectComponents.generalInfo.municipalityPlaceholder')" :value="!!project
                  ? localForm.municipality.title
                  : !!userDetails && userDetails.municipality.title
                  " :rules="[]" />
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
        <div class="col-12 col-md-4" style="height: -webkit-fill-available;">
          <p class="font-16 no-margin">
            {{ $t("newProjectIdeaForm.inviteEditors") }}
          </p>
        </div>
        <div class="col-12 col-md-8">
          <UserSelect :editing="editingEditors" @update:user="updateEditors" />
        </div>
      </div>
      <div class="row items-baseline">
        <div class="col-12 col-md-4">
          <p class="font-16 no-margin">
            {{ $t("newProjectIdeaForm.visibility") }}
          </p>
        </div>
        <div class="col-12 col-md-8">
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
          <Categories :requiresValidation="true" :editing="editingCategories" @update:category="updateCategories" />
        </div>
      </div>
      <div class="row items-baseline">
        <div class="col-12 col-md-4">
          <p class="font-16 no-margin">{{ $t("Tags") }}</p>
        </div>
        <div class="col-12 col-md-8">
          <Tags :requiresValidation="true" :editing="editingTags" @update:tag="updateTags" />
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <q-separator class="bg-blue opacity-10" />
        </div>
      </div>
      <div class="row items-center q-mb-md">
        <div class="col-12 col-md-4">
          <p class="font-16 no-margin">
            {{ $t("newProjectIdeaForm.investive/non-investive") }}
          </p>
        </div>
        <div class="col-12 col-md-8">
          <q-btn-toggle v-model="localForm.details.investive" spread no-caps :rules="[(val) => !!val || $t('Required')]"
            toggle-color="yellow" padding="12px 10px" color="transparent" toggle-text-color="black" text-color="black"
            class="no-shadow toggleGap" :options="investiveNoninvestiveOptions" />
        </div>
      </div>
    </q-form>
  </q-expansion-item>
</template>

<script>
import UserSelect from "components/user/UserSelect.vue";
import MunicipalityCities from "components/Municipality/MunicipalityCities.vue";
import Categories from "components/projects/create/Categories.vue";
import Tags from "components/projects/create/Tags.vue";
import { scroll } from "quasar";
const { getScrollTarget, setScrollPosition } = scroll;
export default {
  name: "ProjectGeneralInfo",
  emits: ['update:form-data'],
  components: {
    UserSelect,
    MunicipalityCities,
    Categories,
    Tags,
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
        details: {
          investive: true,
        },
        municipality: "",
        editors: [],
        categories: [],
        tags: [],
      },
      isLoading: false,
      dataLoaded: true,
    };
  },
  computed: {
    project() {
      return this.$store.getters["project/getProject"];
    },

    // Stable computed properties for child component props
    editingCategories() {
      return this.project?.categories || [];
    },

    editingTags() {
      return this.project?.tags || [];
    },

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
    investiveNoninvestiveOptions() {
      return [
        { label: this.$t("Investive"), value: true },
        { label: this.$t("Non-Investive"), value: false },
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
    updateCategories(categories) {
      this.localForm.categories = categories;
    },
    updateTags(tags) {
      this.localForm.tags = tags;
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
        details: {
          investive: formData.details?.investive || true,
        },
        municipality: formData.municipality || "",
        editors: formData.editors || [],
        categories: formData.categories || [],
        tags: formData.tags || [],
      };
    }
  },
}
</script>

<style lang="scss" scoped></style>
