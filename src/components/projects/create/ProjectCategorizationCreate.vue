<template>
  <CategorizationCard :current-tab="currentTab" :requiresValidation="true" :editingCategories="editingCategories"
    :editingTags="editingTags"
    :suggested="taxonomySuggestions && taxonomySuggestions.categories && taxonomySuggestions.categories.suggested"
    :tagsSuggested="taxonomySuggestions && taxonomySuggestions.tags && taxonomySuggestions.tags.suggested"
    :tagsGenerated="taxonomySuggestions && taxonomySuggestions.tags && taxonomySuggestions.tags.generated"
    :loading="isLoadingTaxonomy" :investive="localForm.details.investive" :nonInvestive="localForm.details.nonInvestive"
    @update:category="updateCategories" @update:tag="updateTags"
    @update:investive="localForm.details.investive = $event" @update:nonInvestive="localForm.details.nonInvestive = $event" />
</template>

<script>
import CategorizationCard from "components/projects/create/CategorizationCard.vue";

export default {
  name: "ProjectCategorizationCreate",
  components: {
    CategorizationCard,
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
      localForm: {
        details: {
          investive: true,
          nonInvestive: false,
        },
        categories: [],
        tags: [],
      },
    };
  },
  computed: {
    project() {
      return this.$store.getters["project/getProject"];
    },
    editingCategories() {
      return this.project?.categories || [];
    },
    editingTags() {
      return this.project?.tags || [];
    },
    taxonomySuggestions() {
      return this.$store.getters["ai/getTaxonomySuggestions"];
    },
    isLoadingTaxonomy() {
      return this.$store.getters["ai/getLoadingTaxonomy"];
    },
  },
  methods: {
    getCurrentFormData() {
      return this.localForm;
    },
    updateCategories(categories) {
      this.localForm.categories = categories;
    },
    updateTags(tags) {
      this.localForm.tags = tags;
    },
    async validateForm() {
      return this.localForm.details.investive === true || this.localForm.details.nonInvestive === true;
    },
    setData(formData) {
      this.localForm = {
        details: {
          investive: typeof formData.details?.investive === 'boolean' ? formData.details.investive : true,
          nonInvestive: typeof formData.details?.nonInvestive === 'boolean' ? formData.details.nonInvestive : false,
        },
        categories: formData.categories || [],
        tags: formData.tags || [],
      };
    }
  },
}
</script>
