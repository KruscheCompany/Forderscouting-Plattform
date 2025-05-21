<template>
  <div class="q-mt-lg">
    <q-table
      class="radius-20 shadow-1  pagination-no-shadow"
      :title="$t('fundingsInfo.current')"
      :data="data"
      :visible-columns="visibleColumns"
      :columns="columns"
      row-key="name"
      :pagination="{
        sortBy: 'id',
        descending: true,
        page: 1,
        rowsPerPage: 10
      }"
      :rows-per-page-label="$t('Records per page')"
      :no-data-label="$t('No data')"
      :no-results-label="$t('No results')"
      ref="table"
    >
      <template v-slot:top v-if="!isGuest">
        <p class="font-24 ppeditorial">{{ $t("fundingsInfo.current") }}</p>
        <q-space />
        <p
          @click="$router.push({ path: '/user/data?tab=fundings' })"
          class="font-16 text-blue text-underline text-weight-600 cursor-pointer ppeditorial"
        >
          {{ $t("fundingsInfo.showAll") }}
        </p>
      </template>
      <template v-slot:top v-else>
          <p class="font-24 ppeditorial">{{ $t("fundingsInfo.current") }}</p>
          <q-space />
          <p
            @click="$router.push({ path: '/community/data?tab=fundings' })"
            class="font-16 text-blue text-underline text-weight-600 cursor-pointer ppeditorial"
          >
            {{ $t("fundingsInfo.showAll") }}
          </p>
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
            @click="view(props.row)"
            auto-width
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="font-14 cursor-pointer"
          >
            {{
              col.value && col.value.length > 48
                ? col.value.substring(0, 48) + "..."
                : col.value
            }}
          </q-td>
          <q-td class="text-right" auto-width>
            <q-btn size="md" color="primary" round flat dense icon="more_vert" aria-label="Optionen">
              <q-menu transition-show="jump-down" transition-hide="jump-up">
                <q-list style="min-width: 140px">
                  <q-item clickable v-close-popup @click="view(props.row)">
                    <q-item-section
                      ><span class="text-right font-14">
                        {{ $t("fundingTableOptions.view") }}
                        <q-icon
                          size="sm"
                          class="text-blue"
                          name="visibility"
                        /> </span
                    ></q-item-section>
                  </q-item>
                  <q-item
                    v-if="isAdmin"
                    clickable
                    v-close-popup
                    @click="editItem(props.row)"
                  >
                    <q-item-section
                      ><span class="text-right font-14">
                        {{ $t("fundingTableOptions.edit") }}

                        <q-icon
                          size="sm"
                          class="text-blue"
                          name="edit"
                        /> </span
                    ></q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    v-close-popup
                    @click="addToWatchlist(props.row)"
                  >
                    <q-item-section
                      ><span class="text-right font-14">
                        {{ $t("fundingTableOptions.bookmark") }}

                        <q-icon
                          size="sm"
                          class="text-blue"
                          name="star_rate"
                        /> </span
                    ></q-item-section>
                  </q-item>
                  <q-item
                    v-if="isAdmin"
                    clickable
                    v-close-popup
                    @click="archiveItem(props.row)"
                  >
                    <q-item-section
                      ><span class="text-right font-14">
                        {{ $t("fundingTableOptions.archive") }}

                        <q-icon
                          size="sm"
                          class="text-blue"
                          name="inventory"
                        /> </span
                    ></q-item-section>
                  </q-item>
                  <q-item
                    v-if="isAdmin"
                    clickable
                    v-close-popup
                    @click="deleteItem(props.row)"
                  >
                    <q-item-section
                      ><span class="text-right font-14 text-red">
                        {{ $t("fundingTableOptions.delete") }}

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
    <DeleteDialog
      :id="itemId"
      :tab="tab"
      :dialogState="deleteDialog"
      @update="(deleteDialog = $event), (itemId = null)"
    />
    <RequestAccessDialog
      :id="itemId"
      :tab="tab"
      :type="type"
      :dialogState="requestDialog"
      @update="(requestDialog = $event), (itemId = null), (type = null)"
    />
  </div>
</template>

<script>
import DeleteDialog from "components/data/DeleteDialog.vue";
import RequestAccessDialog from "components/data/RequestAccessDialog.vue";

export default {
  name: "fundingInfo",
  data() {
    return {
      visibleColumns: ["title", "categories", "owner"],
      itemId: null,
      tab: "fundings",
      deleteDialog: false,
      type: null,
      requestDialog: false
    };
  },
  components: {
    DeleteDialog,
    RequestAccessDialog
  },
  computed: {
    data() {
      return (
        !!this.$store.state.funding.fundings &&
        this.$store.state.funding.fundings
      );
    },
    isGuest() {
      return this.$store.getters["userCenter/isGuest"];
    },
    columns() {
      return [
        {
          name: "id",
          label: "id",
          align: "left",
          field: row => row.id,
          sortable: true
        },
        {
          name: "title",
          align: "left",
          label: this.$t("fundingsColsHome.title"),
          field: row => row.title,
          sortable: true
        },
        {
          name: "categories",
          align: "left",
          label: this.$t("fundingsColsHome.categories"),
          field: row =>
            (!!row.categories &&
              row.categories.map(category => category.title).join(", ")) ||
            "No Categories",
          sortable: true
        },
        {
          name: "owner",
          align: "left",
          label: this.$t("Owner"),
          field: row => (!!row.owner && row.owner.username) || "No Author",
          sortable: true
        }
      ];
    },
    isAdmin() {
      return this.$store.getters["userCenter/isAdmin"];
    },
    loggedInUser() {
      return (
        !!this.$store.state.userCenter.user &&
        this.$store.state.userCenter.user.user
      );
    }
  },
  methods: {
    getData() {
      this.$store.dispatch("funding/getFundings");
    },
    async view(row) {
      const id = row && row.id;
      this.viewIsLoading = true;
      if (
        row.visibility === "listed only" &&
        (!!row.owner && row.owner.id) !==
          (!!this.loggedInUser && this.loggedInUser.id) &&
        !this.isAdmin
      ) {
        const hasReaderAccess =
          !!row.readers &&
          row.readers.filter(
            user => user.id === (!!this.loggedInUser && this.loggedInUser.id)
          );
        const hasEditorAccess =
          !!row.editors &&
          row.editors.filter(
            user => user.id === (!!this.loggedInUser && this.loggedInUser.id)
          );
        if (hasReaderAccess.length > 0 || hasEditorAccess.length > 0) {
          this.$router.push({ path: `/user/newFunding/${id}` });
        } else {
          this.itemId = row && row.id;
          this.type = "view";
          this.requestDialog = true;
        }
      } else {
        this.$router.push({ path: `/user/newFunding/${id}` });
      }
      this.viewIsLoading = false;
    },
    async editItem(row) {
      this.editIsLoading = true;
      const id = row && row.id;
      if (
        (!!row.owner && row.owner.id) !==
          (!!this.loggedInUser && this.loggedInUser.id) &&
        !this.isAdmin
      ) {
        const hasEditorAccess =
          !!row.editors &&
          row.editors.filter(
            user => user.id === (!!this.loggedInUser && this.loggedInUser.id)
          );
        if (hasEditorAccess.length > 0) {
          this.$router.push({ path: `/user/newFunding/edit/${id}` });
        } else {
          this.itemId = row && row.id;
          this.type = "edit";
          this.requestDialog = true;
        }
      } else {
        this.$router.push({ path: `/user/newFunding/edit/${id}` });
      }
      this.editIsLoading = false;
    },
    async addToWatchlist(row) {
      this.watchlistIsLoading = true;
      const id = row && row.id;
      await this.$store.dispatch("funding/addToWatchlist", {
        id: id
      });
      this.watchlistIsLoading = false;
    },
    async archiveItem(row) {
      this.archiveIsLoading = true;
      const id = row && row.id;
      await this.$store.dispatch("funding/archiveFunding", {
        id: id
      });
      this.archiveIsLoading = false;
    },
    async deleteItem(row) {
      this.itemId = row && row.id;
      this.deleteDialog = true;
    }
  },
  mounted() {
    this.getData();
    if (localStorage.getItem("pagination")) {
      const savedPagination = JSON.parse(localStorage.getItem("pagination"));

      this.$refs.table.setPagination({
          page: savedPagination.fundingInfoPage || 1,
          rowsPerPage: savedPagination.fundingInfoRowsPerPage || 10,
        });
    }
  },
  beforeDestroy() {
    const pagination = JSON.parse(localStorage.getItem("pagination"));
    const localPagination = {
      fundingInfoPage: this.$refs.table.computedPagination.page,
      fundingInfoRowsPerPage: this.$refs.table.computedPagination.rowsPerPage,
    };
    const filters = { ...pagination, ...localPagination };
    localStorage.setItem("pagination", JSON.stringify(filters));
  },
};
</script>
