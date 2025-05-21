<template>
  <div>
    <q-select
      outlined
      dense
      v-model="model"
      :rules="
        requiresValidation === true
          ? [val => (!!val && val.length > 0) || $t('Required')]
          : []
      "
      multiple
      :options="categories"
      options-selected-class="text-primary text-weight-600"
      class="no-shadow input-radius-6"
      @input="onSelect"
    >
      <template v-slot:selected>
        <template v-if="model && model.length > 0">
          <span v-for="(category, index) in model" :key="index">
            {{ index > 0 ? ", " : "" }}
            {{ category.title }}
          </span>
        </template>
        <template v-else>
          <span class="text-grey">
            {{ $t("categorySelector.title") }}
          </span>
        </template>
      </template>
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
          <q-item-section>
            <q-item-label>{{ scope.opt.title }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script>
export default {
  name: "categories",
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
      model: this.editing
    };
  },
  methods: {
    onSelect(value) {
      const categories = [];
      value.forEach(element => {
        categories.push({ id: element.id });
      });
      this.$emit("update:category", categories.length > 0 ? categories : []);
      this.setTempCategories(categories);
    },
    setCategories () {
      this.model = this.editing
      ? JSON.parse(JSON.stringify(this.$store.state.project.project.categories))
      : null;
    },
    //Set the selected categories temporarily in the store to be accessible in other components
    setTempCategories(categories) {
      this.$store.commit("project/setTempCategories", categories);
    }
  },
  computed: {
    categories() {
      return this.$store.state.category.categories
        .map(cat => {
          return {
            id: cat.id,
            title: cat.title
          };
        })
        .sort((a, b) => a.title.localeCompare(b.title));
    }
  },
  mounted() {
    this.$store.state.category.categories.length === 0 ? this.$store.dispatch("category/getCategories") : null;
  }
};
</script>

<style></style>
