<template>
  <q-table
    title="Translations"
    :data="filteredData"
    :columns="columns"
    row-key="key"
    :loading="loading"
    :filter="filter"
    :rows-per-page-options="[15, 50, 100, 0]"
    class="radius-20 shadow-1 pagination-no-shadow"
    :rows-per-page-label="$t('Records per page')"
    :no-data-label="$t('No data')"
    :no-results-label="$t('No results')"
  >
    <template v-slot:top>
      <slot name="search"></slot>
    </template>
    <template v-slot:header="props">
      <q-tr class="tableHeader" :props="props">
        <q-th
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
          class="font-14 text-black"
        >
          {{ col.label }}
        </q-th>
        <q-th auto-width />
      </q-tr>
    </template>
    <template v-slot:body-cell-en="props">
      <q-td :props="props">
        <q-input
          :value="translations[props.row.key] ? translations[props.row.key].en : ''"
          class="bg-white input-radius-6 no-shadow q-mb-sm q-mt-sm"
          borderless
          outlined
          dense
          @input="(value) => updateTranslation(props.row.key, 'en', value)"
        />
      </q-td>
    </template>

    <template v-slot:body-cell-de="props">
      <q-td :props="props">
        <q-input
          :value="translations[props.row.key] ? translations[props.row.key].de : ''"
          borderless
          outlined
          dense
          class="bg-white input-radius-6 no-shadow q-mb-sm q-mt-sm"
          @input="(value) => updateTranslation(props.row.key, 'de', value)"
        />
      </q-td>
    </template>
  </q-table>
</template>

<script>
export default {
  name: "TranslationTable",

  props: {
    loading: {
      type: Boolean,
      default: false
    },
    translations: {
      type: Object,
      required: true
    },
    filter: {
      type: String,
      default: ""
    },
    columns: {
      type: Array,
      required: true
    }
  },

  computed: {
    translationData() {
      return Object.keys(this.translations).map((key) => ({
        key,
        en: this.translations[key].en,
        de: this.translations[key].de,
        id_en: this.translations[key].id_en,
        id_de: this.translations[key].id_de,
      }));
    },

    filteredData() {
      if (!this.filter) {
        return this.translationData;
      }

      const searchLower = this.filter.toLowerCase();
      return this.translationData.filter(
        (row) =>
          row.key.toLowerCase().includes(searchLower) ||
          (row.en && row.en.toLowerCase().includes(searchLower)) ||
          (row.de && row.de.toLowerCase().includes(searchLower))
      );
    }
  },

  methods: {
    updateTranslation(key, locale, value) {
      this.$emit('update-translation', { key, locale, value });
    }
  }
};
</script>

<style scoped>
.q-table th {
  font-weight: bold;
}
</style>
