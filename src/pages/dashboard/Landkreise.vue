<template>
  <q-page class="q-my-lg" :class="$q.screen.gt.sm ? 'q-mx-xl' : 'q-mx-sm'">
    <q-table class="radius-20 shadow-1 pagination-no-shadow" :title="$t('landkreise.overview')" :data="data"
      row-key="name" :columns="columns" :filter="filter" :visible-columns="visibleColumns" :pagination="{
        sortBy: 'id',
        descending: true,
        page: 1,
        rowsPerPage: 10,
      }" :rows-per-page-label="$t('Records per page')" :no-data-label="$t('No data')"
      :no-results-label="$t('No results')" ref="table">
      <template v-slot:top>
        <div class="row full-width justify-between items-center">
          <div class="col-8 col-md-4">
            <q-input borderless outlined class="input-radius-6 no-shadow q-mb-sm q-mt-sm" v-model="filter"
              :placeholder="$t('Search')" dense>
              <template v-slot:prepend>
                <q-icon color="blue-5" name="search" />
              </template>
            </q-input>
          </div>
          <div v-if="isAdmin" class="col-4 col-md-4 text-right">
            <q-btn color="blue" icon="add" unelevated :round="$q.screen.lt.md" class="no-shadow text-weight-600"
              :class="$q.screen.gt.sm ? 'radius-6' : ''" no-caps @click="createDialog = true">
              <p v-if="$q.screen.gt.sm" class="q-mb-none q-mx-md q-my-sm">
                {{ $t("landkreise.createLandkreis") }}
              </p>
            </q-btn>
          </div>
        </div>
      </template>
      <template v-slot:header="props">
        <q-tr class="tableHeader" :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props" class="font-14 text-black">
            {{ col.label }}
          </q-th>
          <q-th auto-width />
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width v-for="col in props.cols" :key="col.name" :props="props" class="font-14">
            {{ col.value }}
          </q-td>
          <q-td class="text-right" auto-width>
            <q-btn v-if="isAdmin" size="md" color="primary" round flat dense icon="more_vert"
              :aria-label="$t('options')">
              <q-menu transition-show="jump-down" transition-hide="jump-up">
                <q-list style="min-width: 140px">
                  <q-item clickable v-close-popup @click="prepEditDialog(props.row)">
                    <q-item-section>
                      <span class="text-right font-14">
                        {{ $t("landkreise.edit") }}
                        <q-icon size="sm" class="text-blue" name="edit" />
                      </span>
                    </q-item-section>
                  </q-item>

                  <q-item v-if="isAdmin" clickable v-close-popup @click="prepDeleteDialog(props.row)">
                    <q-item-section><span class="text-right font-14 text-red">
                        {{ $t("landkreise.delete") }}
                        <q-icon size="sm" name="delete" /> </span></q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <CreateDialog :dialogState="createDialog" :editingId="landkreisId"
      @update="(createDialog = $event), (landkreisId = null)" />
    <DeleteDialog :id="landkreisId" :dialogState="deleteDialog"
      @update="(deleteDialog = $event), (landkreisId = null)" />
  </q-page>
</template>

<script>
import CreateDialog from "components/Landkreise/CreateDialog.vue";
import DeleteDialog from "components/Landkreise/DeleteDialog.vue";
export default {
  name: "Landkreise",
  components: {
    CreateDialog,
    DeleteDialog,
  },
  data() {
    return {
      createDialog: false,
      deleteDialog: false,
      landkreisId: null,
      filter: "",
      visibleColumns: ["title"],
    };
  },
  methods: {
    prepDeleteDialog(row) {
      this.landkreisId = !!row.id ? row.id : "";
      this.deleteDialog = true;
    },
    prepEditDialog(row) {
      this.landkreisId = !!row.id ? row.id : "";
      this.createDialog = true;
    },
    getData() {
      this.$store.dispatch("landkreis/getLandkreise");
    },
  },
  computed: {
    data() {
      const landkreise = this.$store.state.landkreis.landkreise;
      if (!Array.isArray(landkreise)) {
        return [];
      }
      return landkreise.map((landkreis) => ({
        id: landkreis.id,
        title: landkreis.title,
      }));
    },
    isAdmin() {
      return this.$store.getters["userCenter/isAdmin"];
    },
    columns() {
      return [
        {
          name: "id",
          label: "id",
          align: "left",
          field: (row) => row.id,
          sortable: true,
        },
        {
          name: "title",
          label: this.$t("landkreise.landkreisName"),
          field: (row) => row.title,
          sortable: true,
          align: "left",
        },
      ];
    },
  },
  mounted() {
    this.getData();
    if (localStorage.getItem("pagination")) {
      const savedPagination = JSON.parse(localStorage.getItem("pagination"));

      this.$refs.table.setPagination({
        page: savedPagination.landkreisePage || 1,
        rowsPerPage: savedPagination.landkreiseRowsPerPage || 10,
      });
    }
  },
  beforeDestroy() {
    const pagination = JSON.parse(localStorage.getItem("pagination"));
    const localPagination = {
      landkreisePage: this.$refs.table.computedPagination.page,
      landkreiseRowsPerPage: this.$refs.table.computedPagination.rowsPerPage,
    };
    const filters = { ...pagination, ...localPagination };
    localStorage.setItem("pagination", JSON.stringify(filters));
  },
};
</script>
