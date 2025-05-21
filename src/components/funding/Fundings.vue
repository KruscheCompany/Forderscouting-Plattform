<template>
  <div>
    <q-select
      outlined
      dense
      v-model="model"
      multiple
      :options="mappedFundings"
      options-selected-class="text-primary text-weight-600"
      class="no-shadow input-radius-6"
      @input="onSelect"
      @focus="onSelectOpen"
      :rules="
        requiresValidation === true
          ? [val => (!!val && val.length > 0) || $t('Required')]
          : []
      "
    >
      <template v-slot:selected>
        <template v-if="model && model.length > 0">
          <span v-for="(funding, index) in model" :key="index">
            <q-chip v-if="funding.archived" :label="$t('fundingSelector.expired')" class="bg-orange-7 text-white" style="height: 20px; margin-bottom: 7px;" />
            {{ index > 0 ? ", " : "" }}
            {{ funding.title }}
            
          </span>
        </template>
        <template v-else>
          <span class="text-grey">
            {{ $t("fundingSelector.title") }}
          </span>
        </template>
      </template>
      <template v-slot:option="scope" v-if="sorted">
          <q-item v-if="scope.index < 3" v-bind="scope.itemProps" v-on="scope.itemEvents" class="q-mb-xs text-white justify-between" style="background-color: #0050ff;" :style="{opacity: scope.opt.ctWeight + 0.1}">
            <q-item-section>
              <q-item-label class="">
                <q-chip v-if="scope.opt.archived" :label="$t('fundingSelector.expired')" class="bg-orange-7 text-white" style="height: 20px; margin-bottom: 7px;"/>
                {{ scope.opt.title }}
               
              </q-item-label>
            </q-item-section>
            <ul class="no-margin">
              <li v-if="scope.opt.categoryWeight">
                <strong>
                  <small>{{ Math.round(scope.opt.categoryWeight) }}% Übereinstimmungsgrad nach Kategorien</small>
                </strong>
              </li>
              <li v-if="scope.opt.tagWeight">
                <strong>
                  <small>{{ Math.round(scope.opt.tagWeight) }}% Übereinstimmungsgrad nach Schlagwörter</small>
                </strong>
              </li>
              <li v-if="scope.opt.ctWeight">
                <strong>
                  <small>{{ Math.round(scope.opt.ctWeight * 100) }}% Übereinstimmungsgrad insgesamt</small>
                </strong>
              </li>
            </ul>
          </q-item>
          <q-item v-else v-bind="scope.itemProps" v-on="scope.itemEvents" class="q-mb-xs">
              <q-item-section>
                <q-item-label>
                  <q-chip v-if="scope.opt.archived" :label="$t('fundingSelector.expired')" class="bg-orange-7 text-white" style="height: 20px; margin-bottom: 7px;" />
                  {{ scope.opt.title }}
                  
                </q-item-label>
              </q-item-section>
            </q-item>
      </template>
      <template v-slot:option="scope" v-else>
            <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
              <q-item-section>
                <q-item-label>
                  <q-chip v-if="scope.opt.archived" :label="$t('fundingSelector.expired')" class="bg-orange-7 text-white" style="height: 20px; margin-bottom: 7px;" />
                  {{ scope.opt.title }}
                  
                </q-item-label>
              </q-item-section>
            </q-item>
        </template>
    </q-select>
  </div>
</template>

<script>
export default {
  name: "fundings",
  props: {
    requiresValidation: {
      type: Boolean,
      default: false
    },
    editing: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      mappedFundings: [],
      sorted: false,
      model: this.editing
    };
  },
  methods: {
    onSelect(value) {
      const fundings = [];
      value.forEach(element => {
        fundings.push({ id: element.id });
      });
      this.$emit("update:linkToFunding", fundings.length > 0 ? fundings : []);
    },

    onSelectOpen() {
      let fundings = this.filteredFundings;
      let selectedCategories = JSON.parse(JSON.stringify(this.$store.state.project.tempCategories)).map(category => {
        return category.id
      });
      let selectedTags = JSON.parse(JSON.stringify(this.$store.state.project.tempTags)).map(tag => {
        return tag.id
      });
      if (selectedCategories.length == 0 || selectedCategories.length == 0) {
        this.mappedFundings = this.fundings;
      } else {
        this.sorted = true;
        const sortedAndFiltered = fundings
          .map((funding) => {
            const categories = funding.categories.map((category) => category.id);
            const tags = funding.tags.map((tag) => tag.id);
            const matchingCategories = categories.filter((id) => selectedCategories.includes(id));
            const matchingTags = tags.filter((id) => selectedTags.includes(id));
            const matchingCategoriesCount = matchingCategories.length;
            const matchingTagsCount = matchingTags.length;
            const totalCategoriesCount = selectedCategories.length;
            const totalTagsCount = selectedTags.length;
            const categoryWeight = (matchingCategoriesCount / totalCategoriesCount) * 100;
            const tagWeight = (matchingTagsCount / totalTagsCount) * 100;
            const ctWeight = ((categoryWeight + tagWeight) / 2) / 100; //Category and tag weight combined
            const matchLevel =
              matchingCategoriesCount === totalCategoriesCount && matchingTagsCount === totalTagsCount
                ? 1 //Highest matches are the ones that have exactly the same amount of tags and categories as selected
                : matchingCategoriesCount > totalCategoriesCount / 2
                  ? 2 //Second degree matches are the ones that have the majority of the selected categories
                  : 3; //Third degree matches are funding that don’t follow points a and b. will be sorted based on the most amount of matching categories + tags
            return { ...funding, matchingCategoriesCount, categoryWeight, matchingTagsCount, tagWeight, matchLevel, ctWeight };
          })
          .sort((a, b) => {
            if (a.matchLevel !== b.matchLevel) {
              return a.matchLevel - b.matchLevel;
            }
            if (a.matchLevel === 1) {
              return b.categoryWeight - a.categoryWeight || b.tagWeight - a.tagWeight;
            }
            if (a.matchLevel === 2) {
              const categoryDiff = b.matchingCategoriesCount - a.matchingCategoriesCount;
              return categoryDiff !== 0 ? categoryDiff : b.matchingTagsCount - a.matchingTagsCount;
            }
            return b.matchingCategoriesCount + b.matchingTagsCount - a.matchingCategoriesCount - a.matchingTagsCount;
          })
          .filter((funding) => funding.matchingCategoriesCount > 0);


        this.mappedFundings = sortedAndFiltered.slice(0, 10);
      }
    }
  },
  computed: {
    fundings() {
      return this.$store.state.funding.fundings.map(funding => {
        return {
          id: funding.id,
          title: funding.title,
          archived: funding.archived,
        };
      });
    },
    filteredFundings() {
      const fundings = JSON.parse(JSON.stringify(this.$store.state.funding.fundings));
      return fundings.map(funding => {
        return {
          id: funding.id,
          title: funding.title,
          categories: funding.categories,
          tags: funding.tags
        }
      });
    }
  },
  beforeMount() {
    this.$store.dispatch("project/tempCategories", []);
    this.$store.dispatch("project/tempTags", []);
  },
  mounted() {
    this.$store.dispatch("funding/getFundingsWithArchived");
    this.mappedFundings = this.fundings;
  }
};
</script>

<style></style>
