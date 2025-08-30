<template>
  <q-card class="shadow-1 radius-20">
    <q-expansion-item class="shadow-1 overflow-hidden radius-20" :label="$t(
      'projectContent.projectDescription')" header-class="bg-white text-black" v-model="expanded">
      <q-form @validation-error="scrollToInvalidElement" ref="contentDetailsForm">
        <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify"
          narrow-indicator>
          <q-tab v-for="tab in tabs" :key="tab.name" :name="tab.name" :label="$t(tab.label)" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="Ausgangssituation">
            <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
              {{ $t('projectComponents.contentDetails.startingConditionDescription') }}
            </h4>
            <div class="col-12 col-md-8">
              <q-input outlined type="textarea" rows="10" class="no-shadow input-radius-6" :placeholder="$t('projectIdeaPlaceholder.descripeProjectStartingCondition')
                " v-model="localForm.details.startingCondition" :rules="[(val) => !!val || $t('Required')]" />
            </div>
          </q-tab-panel>

          <q-tab-panel name="Projektziele">
            <q-input outlined type="textarea" rows="10" class="no-shadow input-radius-6"
              :placeholder="$t('projectIdeaPlaceholder.describeProjectGoals')" v-model="localForm.details.goals" />
          </q-tab-panel>

          <q-tab-panel name="Projektinhalt">
            <q-input outlined type="textarea" rows="10" class="no-shadow input-radius-6"
              :placeholder="$t('projectIdeaPlaceholder.descripeProject')" v-model="localForm.details.content" />
          </q-tab-panel>

          <q-tab-panel name="Nutzen/Wirkung">
            <q-input outlined type="textarea" rows="10" class="no-shadow input-radius-6"
              :placeholder="$t('newProjectIdeaForm.projectValue&Benefits')"
              v-model="localForm.details.valuesAndBenefits" />
          </q-tab-panel>

          <q-tab-panel name="Finanzplan">

            <div class="row">
              <div class="col-8 q-pr-sm">
                <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                  {{ $t('projectComponents.contentDetails.financingOverview') }}
                </h4>
                <q-input outlined type="textarea" rows="14" class="no-shadow input-radius-6"
                  :placeholder="$t('newProjectIdeaForm.financialPlan')" v-model="localForm.financialPlan.description" />
              </div>
              <div class="col-4">
                <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                  {{ $t('projectComponents.contentDetails.financialPlanTitle') }}
                </h4>
                <q-input v-for="(plan, index) in localForm.financialPlan.costAndFinance" :key="index" outlined
                  class="no-shadow input-radius-6 q-mb-md"
                  :label="$t(`projectComponents.contentDetails.costs.${plan.title}`)" v-model="plan.value"
                  v-money="money" suffix="€" />
              </div>
            </div>

          </q-tab-panel>

          <q-tab-panel name="Zeitplan">

            <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
              {{ $t('projectComponents.contentDetails.timelineTitle') }}
            </h4>

            <q-input outlined type="textarea" rows="10" class="no-shadow input-radius-6"
              :placeholder="$t('projectIdeaPlaceholder.describeProjectTimeline')"
              v-model="localForm.details.timeline" />

          </q-tab-panel>

          <q-tab-panel name="Uploads">

            <div class="row justify-between">

              <div class="col-12">
                <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                  {{ $t('projectComponents.contentDetails.documentationTitle') }}
                </h4>

                <q-input outlined type="textarea" rows="10" class="no-shadow input-radius-6"
                  :placeholder="$t('projectIdeaPlaceholder.describeProjectDocumentation')"
                  v-model="localForm.details.uploadDescription" />

              </div>

              <div class="col-12">
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-md-6">
                    <q-file flat v-model="localForm.media" class="uploadInput input-radius-6 text-white"
                      label-color="white" dark bg-color="primary" :label="!!localForm.media && localForm.media.length > 0
                        ? $t('Add Images')
                        : $t('Select Images')
                        " multiple display-value="" append>
                      <template v-slot:prepend>
                        <q-icon color="white" class="on-right" name="upload" />
                      </template>
                    </q-file>
                    <div class="q-mt-sm" v-if="localForm.media && localForm.media.length > 0">
                      <div class="q-col-gutter-x-sm row radius-6 shadow-1 q-mt-sm items-center q-pa-sm"
                        v-for="(image, index) in localForm.media" :key="index">
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
                          <q-btn icon="delete" @click.prevent.stop="removeImg(index)" size="sm" round text-color="red"
                            dense>
                          </q-btn>
                        </div>
                        <div class="col-12 q-mt-sm">
                          <q-btn :label="!!imgPreview(image).caption
                            ? $t('Edit caption')
                            : $t('Add Caption')
                            " @click.prevent.stop="addCaption(image, index)" text-color="primary" dense
                            class="radius-6" no-caps flat>
                          </q-btn>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-12 col-md-6">
                    <q-file flat v-model="localForm.files" class="uploadInput input-radius-6 text-white"
                      label-color="white" dark bg-color="primary" :label="!!localForm.files && localForm.files.length > 0
                        ? $t('Add Files')
                        : $t('Select Files')
                        " multiple display-value="" append>
                      <template v-slot:prepend>
                        <q-icon color="white" class="on-right" name="upload" />
                      </template>
                    </q-file>
                    <div class="q-mt-sm" v-if="localForm.files && localForm.files.length > 0">
                      <q-item class="radius-6" v-for="(file, index) in localForm.files" :key="index" clickable>
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
                          <q-btn icon="delete" @click.prevent.stop="removeFile(index)" size="sm" round text-color="red"
                            dense>
                          </q-btn>
                        </q-item-section>
                      </q-item>
                    </div>
                  </div>
                </div>
              </div>
              <ImageDialog :imageIndex="imageIndex" :image="image" type="project" :document="!!project ? project : null"
                :dialogState="imageDialog" @update="(imageDialog = false), (imageIndex = null), (image = null)"
                @add-caption="updateCaption" />
            </div>
          </q-tab-panel>

          <q-tab-panel name="Links">

            <q-tab-panel name="Links">
              <Links :editing="!!localForm.links ? localForm.links : []" @update:link="updateLinks" />
            </q-tab-panel>

          </q-tab-panel>

        </q-tab-panels>
      </q-form>
    </q-expansion-item>
  </q-card>
</template>

<script>
import ImageDialog from "components/ImageDialog.vue";
import Links from "components/projects/create/Links.vue";
import { scroll } from "quasar";
import { VMoney } from "v-money";
const { getScrollTarget, setScrollPosition } = scroll;

export default {
  name: "ProjectContentDetails",
  directives: {
    money: VMoney
  },
  emits: ['open-document-preview', 'update:form-data', 'switch-to-tab'],
  props: {
    project: {
      type: Object,
      default: () => ({})
    },
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
      tab: "Ausgangssituation",
      money: {
        thousands: ".",
        decimal: ",",
        suffix: "",
        precision: 2,
        masked: false
      },
      tabs: [
        { name: "Ausgangssituation", label: "newProjectIdeaForm.projectStartingCondition" },
        { name: "Projektziele", label: "newProjectIdeaForm.projectGoals" },
        { name: "Projektinhalt", label: "newProjectIdeaForm.projectContent" },
        { name: "Nutzen/Wirkung", label: "newProjectIdeaForm.projectValue&Benefits" },
        { name: "Finanzplan", label: "newProjectIdeaForm.financialPlan" },
        { name: "Zeitplan", label: "newProjectIdeaForm.timeline" },
        { name: "Uploads", label: "newProjectIdeaForm.uploads" },
        { name: "Links", label: "newProjectIdeaForm.links" },
      ],
      expanded: this.currentTab === "project",
      imageIndex: null,
      image: null,
      imageDialog: false,
      // Local form data that syncs with parent
      localForm: {
        details: {
          startingCondition: "",
          content: "",
          goals: "",
          valuesAndBenefits: "",
          timeline: "",
          uploadDescription: "",
        },
        financialPlan: {
          description: "",
          costAndFinance: [
            { title: "Gesamtinvestition", value: "" },
            { title: "Fördermittel", value: "" },
            { title: "Eigenmittel", value: "" },
            { title: "Fremdmittel", value: "" }
          ]
        },
        links: [],
        media: null,
        files: null,
      }
    };
  },
  components: {
    ImageDialog,
    Links
  },
  computed: {
    appUrl() {
      return process.env.VUE_APP_MAIN_URL;
    },
  },
  watch: {
    currentTab(newTab) {
      this.expanded = newTab === "project";
    },
  },
  methods: {
    emitFormData() {
      this.$emit('update:form-data', this.localForm);
    },
    getCurrentFormData() {
      // Method to be called by parent to get current form data
      return this.localForm;
    },
    updateLinks(links) {
      this.localForm.links = links;
    },
    switchToTab(tabName) {
      this.tab = tabName;
      // Also expand the component if it's collapsed
      this.expanded = true;
    },
    async validateForm() {
      if (this.$refs.contentDetailsForm) {
        const isValid = await this.$refs.contentDetailsForm.validate();

        if (!isValid) {
          // Find which tab has the validation error and switch to it
          const validationComponents = this.$refs.contentDetailsForm.getValidationComponents();

          // Map form fields to their corresponding tabs
          const fieldToTabMap = {
            'startingCondition': 'Ausgangssituation',
            'goals': 'Projektziele',
            'content': 'Projektinhalt',
            'valuesAndBenefits': 'Nutzen/Wirkung',
            'financialPlan': 'Finanzplan',
            'timeline': 'Zeitplan',
            'uploadDescription': 'Uploads',
            'links': 'Links'
          };

          // Find the first invalid field and switch to its tab
          for (const component of validationComponents) {
            if (component.validate && !component.validate()) {
              // Try to determine which field this is based on v-model or other attributes
              const vModel = component.$attrs?.['v-model'] || component.$vnode?.data?.model?.expression;

              if (vModel) {
                // Extract field name from v-model (e.g., "localForm.details.startingCondition" -> "startingCondition")
                const fieldName = vModel.split('.').pop();
                const targetTab = fieldToTabMap[fieldName];

                if (targetTab) {
                  this.switchToTab(targetTab);
                  break;
                }
              }
            }
          }
        }

        return isValid;
      }
      return false;
    },
    scrollToInvalidElement(ref) {
      const el = ref.$el;
      const target = getScrollTarget(el);
      const offset = el.offsetTop - 100; // Add some offset for better visibility
      const duration = 500;
      setScrollPosition(target, offset, duration);
    },
    updateCaption(value, index) {
      if (this.localForm.media && this.localForm.media[index]) {
        this.localForm.media[index].caption = value;
      }
    },
    addCaption(image, index) {
      this.imageDialog = true;
      this.imageIndex = index;
      this.image = image;
    },
    imgPreview(val) {
      return {
        url: !!val.id ? `${this.appUrl}${val.url}` : URL.createObjectURL(val),
        name: val.name,
        caption: val.caption,
      };
    },
    removeImg(index) {
      if (this.localForm.media) {
        this.localForm.media.splice(index, 1);
      }
    },
    removeFile(index) {
      if (this.localForm.files) {
        this.localForm.files.splice(index, 1);
      }
    },
    formatLinkUrl(link) {
      const linkParts = link.split('://');
      if (linkParts[0].substring(0, 5) === 'https') {
        return link;
      } else if (linkParts[0].substring(0, 4) === 'http') {
        return link;
      } else {
        return `http://${link}`;
      }
    },
    async handleOpenDocumentPreview(file) {
      this.$emit('open-document-preview', file);
    },
    setData(formData) {
      const { startingCondition,
        content,
        goals,
        valuesAndBenefits,
        timeline,
        uploadDescription } = formData.details;

      this.localForm = {
        details: {
          startingCondition: startingCondition || "",
          content: content || "",
          goals: goals || "",
          valuesAndBenefits: valuesAndBenefits || "",
          timeline: timeline || "",
          uploadDescription: uploadDescription || "",
        },
        financialPlan: formData.financialPlan || {
          description: "",
          costAndFinance: [
            { title: "Gesamtinvestition", value: "" },
            { title: "Fördermittel", value: "" },
            { title: "Eigenmittel", value: "" },
            { title: "Fremdmittel", value: "" }
          ]
        },
        links: formData.links || [],
        media: formData.media || null,
        files: formData.files || null,
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.text-block {
  white-space: pre-line;
}
</style>
