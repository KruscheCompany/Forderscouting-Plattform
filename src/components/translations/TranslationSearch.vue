<template>
  <div class="col-8 col-md-4">
    <q-input
      v-model="searchValue"
      debounce="300"
      borderless
      outlined
      dense
      :placeholder="$t('Search')"
      class="bg-white input-radius-6 no-shadow q-mb-sm q-mt-sm"
      @input="onSearch"
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
      <template v-slot:append>
        <q-btn round flat icon="clear" @click="onClear" v-if="searchValue" />
      </template>
    </q-input>
  </div>
</template>

<script>
export default {
  name: "TranslationSearch",

  props: {
    value: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      searchValue: this.value,
    };
  },

  watch: {
    value(newVal) {
      this.searchValue = newVal;
    },
  },

  methods: {
    onSearch(value) {
      this.$emit("input", value);
    },

    onClear() {
      this.searchValue = "";
      this.$emit("input", "");
    },
  },
};
</script>
