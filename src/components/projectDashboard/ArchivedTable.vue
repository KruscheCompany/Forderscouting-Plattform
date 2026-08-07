<template>
  <q-expansion-item v-model="expanded" @show="fetchArchivedProjects" header-class="radius-20 shadow-1 bg-white q-px-md"
    expand-icon-class="text-blue" class="q-mt-md q-mb-lg">
    <template v-slot:header>
      <q-item-section avatar>
        <q-icon name="inventory" color="blue" />
      </q-item-section>
      <q-item-section>
        <span class="font-16 text-weight-600">{{ $t("ProjectDashboard.archivedApplications") }}</span>
      </q-item-section>
    </template>

    <q-table class="radius-20 shadow-1 q-mt-sm pagination-no-shadow" :data="archivedProjects" :columns="columns" row-key="id"
      :loading="loading" :pagination="{ rowsPerPage: 10 }">
      <template v-slot:header="props">
        <q-tr class="tableHeader" :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props" class="font-14 text-black">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-expansion-item>
</template>

<script>
import { dateFormatter } from "src/boot/dateFormatter";

export default {
  name: "ArchivedProjectsTable",
  data() {
    return {
      expanded: false,
      loading: false,
      fetched: false
    };
  },
  computed: {
    archivedProjects() {
      return this.$store.state.project.archivedProjects;
    },
    columns() {
      return [
        {
          name: "title",
          required: true,
          label: this.$t("ProjectDashboard.title"),
          align: "left",
          field: "title",
          sortable: true,
        },
        {
          name: "municipality",
          align: "left",
          label: this.$t("ProjectDashboard.municipality"),
          field: row => row.municipality?.title,
          sortable: true,
        },
        {
          name: "owner",
          align: "left",
          label: this.$t("ProjectDashboard.owner"),
          field: row => row.owner?.user_detail?.fullName || row.owner?.username,
          sortable: true,
        },
        {
          name: "plannedStart",
          align: "center",
          label: this.$t("ProjectDashboard.plannedStart"),
          field: "plannedStart",
          format: val => (val ? dateFormatter(val) : ""),
          sortable: true,
        },
        {
          name: "plannedEnd",
          align: "center",
          label: this.$t("ProjectDashboard.plannedEnd"),
          field: "plannedEnd",
          format: val => (val ? dateFormatter(val) : ""),
          sortable: true,
        }
      ];
    }
  },
  methods: {
    async fetchArchivedProjects() {
      if (this.fetched) return;
      this.loading = true;
      await this.$store.dispatch("project/getArchivedProjects");
      this.fetched = true;
      this.loading = false;
    }
  }
};
</script>
