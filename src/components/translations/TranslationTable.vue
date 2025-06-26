<template>
  <q-table
    title="Translations"
    :data="filteredData"
    :columns="columns"
    row-key="key"
    :loading="loading"
    :rows-per-page-options="[15, 50, 100, 0]"
    class="radius-20 shadow-1 pagination-no-shadow"
    :rows-per-page-label="$t('Records per page')"
    :no-data-label="$t('No data')"
    :no-results-label="$t('No results')"
    :pagination="pagination"
    ref="table"
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
  data() {
    return {
      pagination: {
        page: 1,
        rowsPerPage: 10,
      },
      initialDeValues: {}, // Store initial DE values to prevent reactivity
    };
  },
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
    },
  },

  computed: {
    translationData() {
      return Object.keys(this.translations).map((key) => ({
        key,
        en: this.translations[key].en,
        de: this.translations[key].de,
        deCurrent: this.initialDeValues[key] || '',
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
          (row.deCurrent && row.deCurrent.toLowerCase().includes(searchLower))
      );
    }
  },

  methods: {
    updateTranslation(key, locale, value) {
      this.$emit('update-translation', { key, locale, value });
    },

    initializeDeValues() {
      // Capture initial DE values to prevent reactivity with current translations
      this.initialDeValues = {};
      Object.keys(this.translations).forEach((key) => {
        const deValue = this.translations[key].de;
        this.initialDeValues[key] = deValue
          ? `${deValue.slice(0, 30)}...`
          : '';
      });
    },
  },

  watch: {
    translations: {
      handler() {
        this.initializeDeValues();
      },
      immediate: true,
    },
  },

  mounted() {
    if (localStorage.getItem("pagination")) {
      const savedPagination = JSON.parse(localStorage.getItem("pagination"));

      this.$refs.table.setPagination({
          page: savedPagination.translationsPage || 1,
          rowsPerPage: savedPagination.translationsRowsPerPage || 15,
      });
      this.$emit('update-filter', savedPagination.translationsSearchTerm || '');
    }
  },
  beforeDestroy() {
    const pagination = JSON.parse(localStorage.getItem("pagination"));
    const localPagination = {
      translationsPage: this.$refs.table.computedPagination.page,
      translationsRowsPerPage: this.$refs.table.computedPagination.rowsPerPage,
      translationsSearchTerm: this.filter,
    };
    const filters = { ...pagination, ...localPagination };
    localStorage.setItem("pagination", JSON.stringify(filters));
  },
};
</script>

<style scoped>
.q-table th {
  font-weight: bold;
}
</style>
