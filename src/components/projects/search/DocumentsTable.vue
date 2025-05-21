<template>
  <q-table
    :data="data"
    :columns="columns"
    row-key="title"
    :filter="query"
    class="bg-white shadow-1 radius-20 -mb-xl pagination-no-shadow"
    :pagination="{
      sortBy: 'title',
      descending: true,
      page: 1,
      rowsPerPage: 15
    }"
    :loading="loading"
    color="primary"
    rows-per-page-label="Datensätze pro Seite:"
    no-data-label="Keine Daten verfügbar"
    no-results-label="Keine passenden Datensätze gefunden"
  >
    <template v-slot:top>
      <div class="col-12 col-md-3">
        <q-input
          borderless
          outlined
          class="input-radius-6 no-shadow q-mb-sm q-mt-sm"
          v-model="query"
          placeholder="Suche"
          dense
          role="searcbox"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </template>
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
          class="text-blue font-14"
        >
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td
          auto-width
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
          class="font-14"
        >
          {{
            col.value && col.value.length > 48
              ? col.value.substring(0, 48) + "..."
              : col.value
          }}
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
import { dateFormatter } from "src/boot/dateFormatter";
export default {
  name: "documentsTable",
  data() {
    return {
      query: "",
      columns: [
        {
          name: "title",
          label: "Titel",
          align: "left",
          field: row => row.title,
          sortable: true
        },
        {
          name: "type",
          label: "Typ",
          align: "left",
          field: row =>
            row.type === "project"
              ? "Projektidee"
              : row.type === "funding"
              ? "Förderinfo"
              : row.type === "checklist"
              ? "Umsetzungscheckliste"
              : "",
          sortable: true
        },
        {
          name: "categories",
          align: "left",
          label: "Kategorien",
          field: row =>
            (!!row.categories &&
              row.categories.map(category => category.title).join(", ")) ||
            "No Categories",
          sortable: true
        }
      ],
      data: [],
      loading: false
    };
  },
  mounted() {
    this.query = this.$route.query.q;
    this.getData();
  },
  methods: {
    dateFormatter,
    async getData() {
      // Create new instance without Auth
      const instance = this.$api.create();
      delete instance.defaults.headers.common["Authorization"];
      try {
        this.loading = true;
        const res = await instance.get("/api/public/data");
        await this.prepData(res.data);
        this.loading = false;
      } catch (error) {
        this.$q.notify({
          type: "negative",
          message: error.response.data.error.message
        });
        this.loading = false;
      }
    },
    async prepData(data) {
      this.data = [];
      for (const item in data) {
        if (data.hasOwnProperty(item)) {
          if (item === "fundings") {
            data[item].forEach(funding => {
              this.data.push({ ...funding, type: "funding" });
            });
          } else if (item === "projects") {
            data[item].forEach(funding => {
              this.data.push({ ...funding, type: "project" });
            });
          } else if (item === "checklists") {
            data[item].forEach(funding => {
              this.data.push({ ...funding, type: "checklist" });
            });
          }
        }
      }
      this.updateDataCount(this.query);
    },
    updateDataCount(val) {
      this.$emit(
        "update-data",
        !!this.data &&
          this.data.filter(item =>
            item.title.toLowerCase().includes(val.toLowerCase())
          )
      );
    }
  },
  watch: {
    query(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.updateDataCount(newVal);
      }
    }
  }
};
</script>

<style></style>
