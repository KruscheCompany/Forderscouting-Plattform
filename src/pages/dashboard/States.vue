<template>
  <q-page class="q-my-lg" :class="$q.screen.gt.sm ? 'q-mx-xl' : 'q-mx-sm'">
    <q-table
      class="radius-20 shadow-1 pagination-no-shadow"
      :title="$t('administrativeAreas.statesOverview')"
      :data="data"
      row-key="name"
      :columns="columns"
      :filter="filter"
      :visible-columns="visibleColumns"
      :pagination="{
        sortBy: 'id',
        descending: true,
        page: 1,
        rowsPerPage: 10,
      }"
      :rows-per-page-label="$t('Records per page')"
      :no-data-label="$t('No data')"
      :no-results-label="$t('No results')"
      ref="table"
    >
      <template v-slot:top>
        <div class="row full-width justify-between items-center">
          <div class="col-8 col-md-4">
            <q-input
              borderless
              outlined
              class="input-radius-6 no-shadow q-mb-sm q-mt-sm"
              v-model="filter"
              :placeholder="$t('Search')"
              dense
            >
              <template v-slot:prepend>
                <q-icon color="blue-5" name="search" />
              </template>
            </q-input>
          </div>
          <div v-if="isAdmin" class="col-4 col-md-4 text-right">
            <q-btn
              color="blue"
              icon="add"
              unelevated
              :round="$q.screen.lt.md"
              class="no-shadow text-weight-600"
              :class="$q.screen.gt.sm ? 'radius-6' : ''"
              no-caps
              @click="createDialog = true"
            >
              <p v-if="$q.screen.gt.sm" class="q-mb-none q-mx-md q-my-sm">
                {{ $t("administrativeAreas.createState") }}
              </p>
            </q-btn>
          </div>
        </div>
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
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td
            auto-width
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="font-14"
          >
            {{ col.value }}
          </q-td>
          <q-td class="text-right" auto-width>
            <q-btn
              v-if="isAdmin"
              size="md"
              color="primary"
              round
              flat
              dense
              icon="more_vert"
              :aria-label="$t('options')"
            >
              <q-menu transition-show="jump-down" transition-hide="jump-up">
                <q-list style="min-width: 140px">
                  <q-item clickable v-close-popup @click="prepEditDialog(props.row)">
                    <q-item-section>
                      <span class="text-right font-14">
                        {{ $t("administrativeAreas.edit") }}
                        <q-icon size="sm" class="text-blue" name="edit" />
                      </span>
                    </q-item-section>
                  </q-item>

                  <q-item
                    v-if="isAdmin"
                    clickable
                    v-close-popup
                    @click="prepDeleteDialog(props.row)"
                  >
                    <q-item-section
                      ><span class="text-right font-14 text-red">
                        {{ $t("administrativeAreas.delete") }}
                        <q-icon size="sm" name="delete" /> </span
                    ></q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <CreateDialog
      :dialogState="createDialog"
      :editingId="municipalityId"
      @update="(createDialog = $event), (municipalityId = null)"
    />
    <DeleteDialog
      :id="municipalityId"
      :dialogState="deleteDialog"
      @update="(deleteDialog = $event), (municipalityId = null)"
    />
  </q-page>
</template>

<script>
import CreateDialog from "components/States/CreateDialog.vue";
import DeleteDialog from "components/States/DeleteDialog.vue";
export default {
  name: "States",
  components: {
    CreateDialog,
    DeleteDialog,
  },
  data() {
    return {
      createDialog: false,
      deleteDialog: false,
      municipalityId: null,
      filter: "",
      visibleColumns: ["title", "municipality"],
    };
  },
  methods: {
    prepDeleteDialog(row) {
      this.municipalityId = !!row.id ? row.id : "";
      this.deleteDialog = true;
    },
    prepEditDialog(row) {
      this.municipalityId = !!row.id ? row.id : "";
      this.createDialog = true;
    },
    getData() {
      this.$store.dispatch("municipality/getStates");
    },
  },
  computed: {
    data() {
      return this.$store.state.municipality.states.map((state) => {
        return {
          id: state.id,
          title: state.title,
          municipality: state.municipality.title,
        };
      });
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
          label: this.$t("administrativeAreas.federalState"),
          field: (row) => row.title,
          sortable: true,
          align: "left",
        },
        {
          name: "municipality",
          label: this.$t("administrativeAreas.administrationName"),
          field: (row) => row.municipality,
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
        page: savedPagination.statesPage || 1,
        rowsPerPage: savedPagination.statesRowsPerPage || 10,
      });
    }
  },
  beforeDestroy() {
    const pagination = JSON.parse(localStorage.getItem("pagination"));
    const localPagination = {
      statesPage: this.$refs.table.computedPagination.page,
      statesRowsPerPage: this.$refs.table.computedPagination.rowsPerPage,
    };
    const filters = { ...pagination, ...localPagination };
    localStorage.setItem("pagination", JSON.stringify(filters));
  },
};
</script>
