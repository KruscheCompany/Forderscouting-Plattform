<template>
  <div class="q-my-lg ">
    <q-tabs
      v-if="isInPage"
      v-model="tab"
      align="justify"
      indicator-color="transparent"
      class="q-mb-lg text-black"
      active-bg-color="yellow"
      no-caps
    >
      <q-route-tab
        :to="{ query: { tab: 'all' } }"
        exact
        replace
        class="q-py-xs q-mr-lg radius-10 border-yellow"
        :class="$q.screen.gt.sm ? 'q-pa-lg' : 'q-pa-sm q-px-lg'"
        name="all"
      >
        <p class="font-20 no-margin">{{ $t("watchListHome.allBtn") }}</p>
      </q-route-tab>
      <q-route-tab
        :to="{ query: { tab: 'projectIdeas' } }"
        exact
        replace
        class="q-py-xs q-mr-lg radius-10 border-yellow"
        :class="$q.screen.gt.sm ? 'q-pa-lg' : 'q-pa-sm q-px-lg'"
        name="projectIdeas"
      >
        <p class="font-20 no-margin">{{ $t("myData.projectIdeas") }}</p>
      </q-route-tab>
      <q-route-tab
        :to="{ query: { tab: 'fundings' } }"
        exact
        replace
        class="q-mr-lg radius-10 border-yellow"
        :class="$q.screen.gt.sm ? 'q-pa-lg' : 'q-pa-sm q-px-lg'"
        name="fundings"
      >
        <p class="font-20 no-margin">{{ $t("myData.fundings") }}</p>
      </q-route-tab>
      <q-route-tab
        :to="{ query: { tab: 'implementationChecklist' } }"
        exact
        replace
        class=" radius-10 border-yellow"
        :class="$q.screen.gt.sm ? 'q-pa-lg' : 'q-pa-sm q-px-lg'"
        name="implementationChecklist"
      >
        <p class="font-20 no-margin">
          {{ $t("myData.implementationChecklist") }}
        </p>
      </q-route-tab>
    </q-tabs>
    <q-table
      class="radius-20 shadow-1 pagination-no-shadow"
      :data="data"
      :columns="columns"
      row-key="name"
      :hide-bottom="!isInPage && data.length > 0"
      :hide-header="!isInPage"
      :visible-columns="isInPage ? visibleColumns : ['title']"
      :filter="filter"
      :pagination="{
        sortBy: 'id',
        descending: true,
        page: 1,
        rowsPerPage: isInPage ? 10 : 5
      }"
      :rows-per-page-label="$t('Records per page')"
      :no-data-label="$t('No data')"
      :no-results-label="$t('No results')"
      ref="table"
    >
      <template v-slot:top>
        <div v-if="!isInPage" class="row full-width">
          <div class="col-12">
            <p class="font-20 ppeditorial">
              {{ $t("watchListHome.myWatchList") }}
              <span
                class="font-14 float-right text-blue text-underline text-weight-600 cursor-pointer"
                @click="$router.push({ path: `/watchlist?tab=${tab}` })"
              >
                {{ $t("watchListHome.showMy") }}
              </span>
            </p>
          </div>
          <div class="col-12">
            <q-tabs
              v-model="tab"
              align="justify"
              indicator-color="transparent"
              class="text-black"
              active-bg-color="yellow"
              no-caps
              dense
            >
              <q-tab class="q-mr-lg radius-6 border-yellow" name="all">
                <p class="font-14 text-weight-600 no-margin">
                  {{ $t("watchListHome.allBtn") }}
                </p>
              </q-tab>
              <q-tab class="q-mr-lg radius-6 border-yellow" name="projectIdeas">
                <p class="font-14 text-weight-600 no-margin">
                  {{ $t("watchListHome.projectIdeaBtn") }}
                </p>
              </q-tab>
              <q-tab class="q-mr-lg radius-6 border-yellow" name="fundings">
                <p class="font-14 text-weight-600 no-margin">
                  {{ $t("watchListHome.fundingsBtn") }}
                </p>
              </q-tab>
              <q-tab
                class="q-mr-lg radius-6 border-yellow"
                name="implementationChecklist"
              >
                <p class="font-14 text-weight-600 no-margin">
                  {{ $t("watchListHome.implementationChecklistBtn") }}
                </p>
              </q-tab>
            </q-tabs>
          </div>
        </div>
        <div
          v-if="isInPage"
          class="row full-width justify-between items-center"
        >
          <div class="col-8 col-md-4">
            <q-input
              borderless
              outlined
              class="input-radius-6 no-shadow q-mb-sm q-mt-sm"
              v-model="filter"
              :placeholder="$t('Search')"
              dense
              role="searcbox"
            >
              <template v-slot:prepend>
                <q-icon color="blue-5" name="search" />
              </template>
            </q-input>
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
                <q-list style="min-width: 250px">
                  <q-item clickable v-close-popup @click="view(props.row)">
                    <q-item-section
                      ><span class="text-right font-14">
                        {{ $t("myWatchListTableOptions.view") }}
                        <q-icon
                          v-if="!viewIsLoading"
                          size="sm"
                          class="text-blue"
                          name="visibility"
                        />
                        <q-spinner
                          v-else
                          color="primary"
                          size="sm"
                          :thickness="2"
                        /> </span
                    ></q-item-section>
                  </q-item>
                  <q-item
                    v-if="isAdmin || (!props.row.hasOwnProperty('funding') && !isGuest)"
                    clickable
                    v-close-popup
                    @click="editItem(props.row)"
                  >
                    <q-item-section
                      ><span class="text-right font-14">
                        {{ $t("myWatchListTableOptions.edit") }}

                        <q-icon
                          v-if="!editIsLoading"
                          size="sm"
                          class="text-blue"
                          name="edit"
                        />
                        <q-spinner
                          v-else
                          color="primary"
                          size="sm"
                          :thickness="2"
                        /> </span
                    ></q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    v-close-popup
                    @click="removeFromWatchlist(props.row)"
                  >
                    <q-item-section
                      ><span class="text-right font-14">
                        {{ $t("myWatchListTableOptions.removeBookmark") }}

                        <q-icon
                          v-if="!watchlistIsLoading"
                          size="sm"
                          class="text-blue"
                          name="star_rate"
                        />
                        <q-spinner
                          v-else
                          color="primary"
                          size="sm"
                          :thickness="2"
                        /> </span
                    ></q-item-section>
                  </q-item>
                  <q-item
                    v-if="
                      isAdmin ||
                        (!props.row.hasOwnProperty('funding') &&
                          (!!props.row.funding &&
                            !!props.row.funding.owner &&
                            props.row.funding.owner.id) ===
                            (!!loggedInUser && loggedInUser.id)) ||
                        (!!props.row.project &&
                          !!props.row.project.owner &&
                          props.row.project.owner.id) ===
                          (!!loggedInUser && loggedInUser.id) ||
                        (!!props.row.checklist &&
                          !!props.row.checklist.owner &&
                          props.row.checklist.owner.id) ===
                          (!!loggedInUser && loggedInUser.id)
                    "
                    clickable
                    v-close-popup
                    @click="archiveItem(props.row)"
                  >
                    <q-item-section
                      ><span class="text-right font-14">
                        {{ $t("myWatchListTableOptions.archive") }}

                        <q-icon
                          v-if="!archiveIsLoading"
                          size="sm"
                          class="text-blue"
                          name="inventory"
                        />
                        <q-spinner
                          v-else
                          color="red"
                          size="sm"
                          :thickness="2"
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
                        {{ $t("myWatchListTableOptions.delete") }}

                        <q-icon
                          v-if="!deleteIsLoading"
                          size="sm"
                          class="text-red"
                          name="delete"
                        />
                        <q-spinner
                          v-else
                          color="red"
                          size="sm"
                          :thickness="2"
                        /> </span
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
      :tab="editingType"
      :dialogState="deleteDialog"
      @update="closeDialog($event), (itemId = null), (editingType = null)"
    />
    <RequestAccessDialog
      :id="itemId"
      :tab="itemType"
      :type="type"
      :dialogState="requestDialog"
      @update="
        (requestDialog = $event),
          (itemId = null),
          (type = null),
          (itemType = null)
      "
    />
  </div>
</template>

<script>
import { dateFormatter } from "src/boot/dateFormatter";
import DeleteDialog from "components/data/DeleteDialog.vue";
import RequestAccessDialog from "components/data/RequestAccessDialog.vue";

export default {
  name: "watchlists",
  components: {
    DeleteDialog,
    RequestAccessDialog
  },
  data() {
    return {
      tab: this.$router.currentRoute.query.tab || "all",
      filter: "",
      visibleColumns: [
        "title",
        "type",
        "categories",
        "status",
        "carbs",
        "plannedStart",
        "plannedEnd",
        "owner"
      ],
      deleteDialog: false,
      itemId: null,
      editingType: null,
      viewIsLoading: false,
      editIsLoading: false,
      deleteIsLoading: false,
      archiveIsLoading: false,
      watchlistIsLoading: false,
      requestDialog: false,
      type: null,
      itemType: null
    };
  },
  methods: {
    dateFormatter,
    closeDialog(val) {
      this.deleteDialog = val;
      this.getData();
    },
    async view(row) {
      this.viewIsLoading = true;
      if (!!row && row.hasOwnProperty("project")) {
        const id = !!row.project && row.project.id;
        if (
          row.project.visibility === "listed only" &&
          (!!row.project && !!row.project.owner && row.project.owner.id) !==
            (!!this.loggedInUser && this.loggedInUser.id) &&
          !this.isAdmin
        ) {
          const hasReaderAccess =
            !!row.project &&
            !!row.project.readers &&
            row.project.readers.filter(
              user => user.id === (!!this.loggedInUser && this.loggedInUser.id)
            );
          const hasEditorAccess =
            !!row.project &&
            !!row.project.editors &&
            row.project.editors.filter(
              user => user.id === (!!this.loggedInUser && this.loggedInUser.id)
            );
          if (hasReaderAccess.length > 0 || hasEditorAccess.length > 0) {
            this.$router.push({ path: `/user/newProjectIdea/${id}` });
          } else {
            this.itemId = !!row.project && row.project.id;
            this.type = "view";
            this.itemType = "projectIdeas";
            this.requestDialog = true;
          }
        } else {
          this.$router.push({ path: `/user/newProjectIdea/${id}` });
        }
      } else if (!!row && row.hasOwnProperty("funding")) {
        const id = !!row.funding && row.funding.id;
        if (
          row.funding.visibility === "listed only" &&
          (!!row.funding && !!row.funding.owner && row.funding.owner.id) !==
            (!!this.loggedInUser && this.loggedInUser.id) &&
          !this.isAdmin
        ) {
          const hasReaderAccess =
            !!row.funding &&
            !!row.funding.readers &&
            row.funding.readers.filter(
              user => user.id === (!!this.loggedInUser && this.loggedInUser.id)
            );
          const hasEditorAccess =
            !!row.funding &&
            !!row.funding.editors &&
            row.funding.editors.filter(
              user => user.id === (!!this.loggedInUser && this.loggedInUser.id)
            );
          if (hasReaderAccess.length > 0 || hasEditorAccess.length > 0) {
            this.$router.push({ path: `/user/newFunding/${id}` });
          } else {
            this.itemId = !!row.funding && row.funding.id;
            this.type = "view";
            this.itemType = "fundings";
            this.requestDialog = true;
          }
        } else {
          this.$router.push({ path: `/user/newFunding/${id}` });
        }
      } else {
        const id = !!row.checklist && row.checklist.id;
        if (
          row.checklist.visibility === "listed only" &&
          (!!row.checklist &&
            !!row.checklist.owner &&
            row.checklist.owner.id) !==
            (!!this.loggedInUser && this.loggedInUser.id) &&
          !this.isAdmin
        ) {
          const hasReaderAccess =
            !!row.checklist &&
            !!row.checklist.readers &&
            row.checklist.readers.filter(
              user => user.id === (!!this.loggedInUser && this.loggedInUser.id)
            );
          const hasEditorAccess =
            !!row.checklist &&
            !!row.checklist.editors &&
            row.checklist.editors.filter(
              user => user.id === (!!this.loggedInUser && this.loggedInUser.id)
            );
          if (hasReaderAccess.length > 0 || hasEditorAccess.length > 0) {
            this.$router.push({ path: `/user/newChecklist/${id}` });
          } else {
            this.itemId = !!row.checklist && row.checklist.id;
            this.type = "view";
            this.itemType = "implementationChecklist";
            this.requestDialog = true;
          }
        } else {
          this.$router.push({ path: `/user/newChecklist/${id}` });
        }
      }
      this.viewIsLoading = false;
    },
    async editItem(row) {
      console.log("row", row);
      this.editIsLoading = true;
      if (!!row && row.hasOwnProperty("project")) {
        const id = !!row.project && row.project.id;
        if (
          (!!row.project && !!row.project.owner && row.project.owner.id) !==
            (!!this.loggedInUser && this.loggedInUser.id) &&
          !this.isAdmin
        ) {
          const hasEditorAccess =
            !!row.project &&
            !!row.project.editors &&
            row.project.editors.filter(
              user => user.id === (!!this.loggedInUser && this.loggedInUser.id)
            );
          if (hasEditorAccess.length > 0) {
            this.$router.push({ path: `/user/newProjectIdea/edit/${id}` });
          } else {
            this.itemId = !!row.project && row.project.id;
            this.type = "edit";
            this.itemType = "projectIdeas";
            this.requestDialog = true;
          }
        } else {
          this.$router.push({ path: `/user/newProjectIdea/edit/${id}` });
        }
      } else if (!!row && row.hasOwnProperty("funding")) {
        const id = !!row.funding && row.funding.id;
        if (
          (!!row.funding && !!row.funding.owner && row.funding.owner.id) !==
            (!!this.loggedInUser && this.loggedInUser.id) &&
          !this.isAdmin
        ) {
          const hasEditorAccess =
            !!row.funding &&
            !!row.funding.editors &&
            row.funding.editors.filter(
              user => user.id === (!!this.loggedInUser && this.loggedInUser.id)
            );
          if (hasEditorAccess.length > 0) {
            this.$router.push({ path: `/user/newFunding/edit/${id}` });
          } else {
            this.itemId = !!row.funding && row.funding.id;
            this.type = "edit";
            this.itemType = "fundings";
            this.requestDialog = true;
          }
        } else {
          this.$router.push({ path: `/user/newFunding/edit/${id}` });
        }
      } else {
        const id = !!row.checklist && row.checklist.id;
        if (
          (!!row.checklist &&
            !!row.checklist.owner &&
            row.checklist.owner.id) !==
            (!!this.loggedInUser && this.loggedInUser.id) &&
          !this.isAdmin
        ) {
          const hasEditorAccess =
            !!row.checklist &&
            !!row.checklist.editors &&
            row.checklist.editors.filter(
              user => user.id === (!!this.loggedInUser && this.loggedInUser.id)
            );
          if (hasEditorAccess.length > 0) {
            this.$router.push({ path: `/user/newChecklist/edit/${id}` });
          } else {
            this.itemId = !!row.checklist && row.checklist.id;
            this.type = "edit";
            this.itemType = "implementationChecklist";
            this.requestDialog = true;
          }
        } else {
          this.$router.push({ path: `/user/newChecklist/edit/${id}` });
        }
      }
      this.editIsLoading = false;
    },
    async deleteItem(row) {
      if (!!row && row.hasOwnProperty("project")) {
        this.editingType = "projectIdeas";
        this.itemId = row.project.id;
      } else if (!!row && row.hasOwnProperty("funding")) {
        this.editingType = "fundings";
        this.itemId = row.funding.id;
      } else {
        this.editingType = "implementationChecklist";
        this.itemId = row.checklist.id;
      }
      this.deleteDialog = true;
    },
    async archiveItem(row) {
      if (!!row && row.hasOwnProperty("project")) {
        this.archiveIsLoading = true;
        const id = !!row.project && row.project.id;
        await this.$store.dispatch("project/archiveProjectIdea", {
          id: id
        });
        this.archiveIsLoading = false;
        this.getData();
      } else if (!!row && row.hasOwnProperty("funding")) {
        this.archiveIsLoading = true;
        const id = !!row.funding && row.funding.id;
        await this.$store.dispatch("funding/archiveFunding", {
          id: id
        });
        this.archiveIsLoading = false;
        this.getData();
      } else {
        this.archiveIsLoading = true;
        const id = !!row.checklist && row.checklist.id;
        await this.$store.dispatch("implementationChecklist/archiveChecklist", {
          id: id
        });
        this.archiveIsLoading = false;
        this.getData();
      }
    },
    async removeFromWatchlist(row) {
      if (!!row && row.hasOwnProperty("project")) {
        this.watchlistIsLoading = true;
        const id = row.id;
        await this.$store.dispatch("project/removeFromWatchlist", {
          id: id
        });
        this.watchlistIsLoading = false;
        this.getData();
      } else if (!!row && row.hasOwnProperty("funding")) {
        this.watchlistIsLoading = true;
        const id = row.id;
        await this.$store.dispatch("funding/removeFromWatchlist", {
          id: id
        });
        this.watchlistIsLoading = false;
        this.getData();
      } else {
        this.watchlistIsLoading = true;
        const id = row.id;
        await this.$store.dispatch(
          "implementationChecklist/removeFromWatchlist",
          {
            id: id
          }
        );
        this.watchlistIsLoading = false;
        this.getData();
      }
    },
    getData() {
      this.$store.dispatch("userCenter/getWatchlists");
    }
  },
  watch: {
    tab(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getData();
      }
    }
  },
  computed: {
    isAdmin() {
      return this.$store.getters["userCenter/isAdmin"];
    },
    isGuest() {
      return this.$store.getters["userCenter/isGuest"];
    },
    loggedInUser() {
      return (
        !!this.$store.state.userCenter.user &&
        this.$store.state.userCenter.user.user
      );
    },
    isInPage() {
      return this.$router.currentRoute.path == "/watchlist";
    },
    columns() {
      if (this.tab === "projectIdeas") {
        return this.projectCols;
      } else if (this.tab === "fundings") {
        return this.fundingCols;
      } else if (this.tab === "implementationChecklist") {
        return this.checklistCols;
      } else {
        return this.allCols;
      }
    },
    data() {
      if (this.tab === "projectIdeas") {
        return (
          !!this.$store.state.userCenter.watchlists &&
          this.$store.state.userCenter.watchlists.filter(item =>
            item.hasOwnProperty("project")
          )
        );
      } else if (this.tab === "fundings") {
        return (
          !!this.$store.state.userCenter.watchlists &&
          this.$store.state.userCenter.watchlists.filter(item =>
            item.hasOwnProperty("funding")
          )
        );
      } else if (this.tab === "implementationChecklist") {
        return (
          !!this.$store.state.userCenter.watchlists &&
          this.$store.state.userCenter.watchlists.filter(item =>
            item.hasOwnProperty("checklist")
          )
        );
      } else {
        return (
          !!this.$store.state.userCenter.watchlists &&
          this.$store.state.userCenter.watchlists
        );
      }
    },
    allCols() {
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
          label: this.$t("myData.title"),
          align: "left",
          field: row =>
            row.hasOwnProperty("project")
              ? row.project.title
              : row.hasOwnProperty("funding")
              ? row.funding.title
              : row.hasOwnProperty("checklist")
              ? row.checklist.title
              : "",
          sortable: true
        },
        {
          name: "type",
          label: this.$t("statsTable.type"),
          align: "left",
          field: row =>
            row.hasOwnProperty("project")
              ? this.$t(row.project.type)
              : row.hasOwnProperty("funding")
              ? this.$t(row.funding.type)
              : row.hasOwnProperty("checklist")
              ? this.$t(row.checklist.type)
              : "",
          sortable: true
        },
        {
          name: "categories",
          align: "left",
          label: this.$t("fundingsCol.categories"),
          field: row =>
            row.hasOwnProperty("project")
              ? (!!row.project &&
                  !!row.project.categories &&
                  row.project.categories
                    .map(category => category.title)
                    .join(", ")) ||
                this.$t("NoCategories")
              : row.hasOwnProperty("funding")
              ? (!!row.funding &&
                  !!row.funding.categories &&
                  row.funding.categories
                    .map(category => category.title)
                    .join(", ")) ||
                this.$t("NoCategories")
              : row.hasOwnProperty("checklist")
              ? (!!row.checklist &&
                  !!row.checklist.categories &&
                  row.checklist.categories
                    .map(category => category.title)
                    .join(", ")) ||
                this.$t("NoCategories")
              : "",
          sortable: true
        },
        {
          name: "plannedStart",
          label: this.$t("fundingsCol.start"),
          align: "left",
          field: row =>
            row.hasOwnProperty("project")
              ? dateFormatter(!!row.project && row.project.plannedStart)
              : row.hasOwnProperty("funding")
              ? dateFormatter(!!row.funding && row.funding.plannedStart)
              : "",
          sortable: true,
          sort: (a, b, rowA, rowB) => {
            if (
              rowA.hasOwnProperty("project") &&
              rowB.hasOwnProperty("funding")
            ) {
              console.log("rowA", rowA);
              console.log("rowB", rowB);
              const dateA = new Date(
                !!rowA.project && rowA.project.plannedStart
              );
              const dateB = new Date(
                !!rowB.funding && rowB.funding.plannedStart
              );
              return dateB - dateA;
            } else if (
              rowA.hasOwnProperty("funding") ||
              rowB.hasOwnProperty("project")
            ) {
              const dateA = new Date(
                !!rowA.funding && rowA.funding.plannedStart
              );
              const dateB = new Date(
                !!rowB.project && rowB.project.plannedStart
              );
              return dateB - dateA;
            }
          }
        },
        {
          name: "plannedEnd",
          label: this.$t("fundingsCol.end"),
          align: "left",
          field: row =>
            row.hasOwnProperty("project")
              ? dateFormatter(!!row.project && row.project.plannedEnd)
              : row.hasOwnProperty("funding")
              ? dateFormatter(!!row.funding && row.funding.plannedEnd)
              : "",
          sortable: true,
          sort: (a, b, rowA, rowB) => {
            if (
              rowA.hasOwnProperty("project") &&
              rowB.hasOwnProperty("funding")
            ) {
              console.log("rowA", rowA);
              console.log("rowB", rowB);
              const dateA = new Date(
                !!rowA.project && rowA.project.plannedStart
              );
              const dateB = new Date(
                !!rowB.funding && rowB.funding.plannedStart
              );
              return dateB - dateA;
            } else if (
              rowA.hasOwnProperty("funding") ||
              rowB.hasOwnProperty("project")
            ) {
              const dateA = new Date(
                !!rowA.funding && rowA.funding.plannedStart
              );
              const dateB = new Date(
                !!rowB.project && rowB.project.plannedStart
              );
              return dateB - dateA;
            }
          }
        },
        {
          name: "owner",
          label: this.$t("Owner"),
          align: "left",
          field: row =>
            row.hasOwnProperty("project")
              ? !!row.project &&
                !!row.project.owner &&
                row.project.owner.username
              : row.hasOwnProperty("funding")
              ? !!row.funding &&
                !!row.funding.owner &&
                row.funding.owner.username
              : row.hasOwnProperty("checklist")
              ? !!row.checklist &&
                !!row.checklist.owner &&
                row.checklist.owner.username
              : "",

          sortable: true
        }
      ];
    },
    projectCols() {
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
          label: this.$t("myData.title"),
          align: "left",
          field: row => !!row.project && row.project.title,
          sortable: true
        },
        {
          name: "type",
          label: this.$t("statsTable.type"),
          align: "left",
          field: row => !!row.project && this.$t(row.project.type),
          sortable: true
        },
        {
          name: "categories",
          align: "left",
          label: this.$t("myData.categories"),
          field: row =>
            (!!row.project &&
              !!row.project.categories &&
              row.project.categories
                .map(category => category.title)
                .join(", ")) ||
            "No Categories",
          sortable: true
        },
        {
          name: "plannedStart",
          label: this.$t("fundingsCol.start"),
          align: "left",
          field: row =>
            dateFormatter(!!row.project && row.project.plannedStart),
          sortable: true,
          sort: (a, b, rowA, rowB) => {
            const dateA = new Date(!!rowA.project && rowA.project.plannedStart);
            const dateB = new Date(!!rowB.project && rowB.project.plannedStart);
            return dateB - dateA;
          }
        },
        {
          name: "plannedEnd",
          label: this.$t("fundingsCol.end"),
          align: "left",
          field: row => dateFormatter(!!row.project && row.project.plannedEnd),
          sortable: true,
          sort: (a, b, rowA, rowB) => {
            const dateA = new Date(!!rowA.project && rowA.project.plannedEnd);
            const dateB = new Date(!!rowB.project && rowB.project.plannedEnd);
            return dateB - dateA;
          }
        },
        {
          name: "owner",
          label: this.$t("Owner"),
          align: "left",
          field: row =>
            !!row.project && !!row.project.owner && row.project.owner.username,
          sortable: true
        }
      ];
    },
    fundingCols() {
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
          label: this.$t("fundingsCol.title"),
          align: "left",
          field: row => !!row.funding && row.funding.title,
          sortable: true
        },
        {
          name: "type",
          label: this.$t("statsTable.type"),
          align: "left",
          field: row => !!row.funding && this.$t(row.funding.type),
          sortable: true
        },
        {
          name: "categories",
          align: "left",
          label: this.$t("fundingsCol.categories"),
          field: row =>
            (!!row.funding &&
              !!row.funding.categories &&
              row.funding.categories
                .map(category => category.title)
                .join(", ")) ||
            this.$t("NoCategories"),
          sortable: true
        },
        {
          name: "plannedStart",
          label: this.$t("fundingsCol.start"),
          align: "left",
          field: row =>
            dateFormatter(!!row.funding && row.funding.plannedStart),
          sortable: true,
          sort: (a, b, rowA, rowB) => {
            const dateA = new Date(!!rowA.funding && rowA.funding.plannedStart);
            const dateB = new Date(!!rowB.funding && rowB.funding.plannedStart);
            return dateB - dateA;
          }
        },
        {
          name: "plannedEnd",
          label: this.$t("fundingsCol.end"),
          align: "left",
          field: row => dateFormatter(!!row.funding && row.funding.plannedEnd),
          sortable: true,
          sort: (a, b, rowA, rowB) => {
            const dateA = new Date(!!rowA.funding && rowA.funding.plannedEnd);
            const dateB = new Date(!!rowB.funding && rowB.funding.plannedEnd);
            return dateB - dateA;
          }
        },
        {
          name: "owner",
          label: this.$t("Owner"),
          align: "left",
          field: row =>
            !!row.funding && !!row.funding.owner && row.funding.owner.username,
          sortable: true
        }
      ];
    },
    checklistCols() {
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
          label: this.$t("myData.title"),
          align: "left",
          field: row => !!row.checklist && row.checklist.title,
          sortable: true
        },
        {
          name: "type",
          label: this.$t("statsTable.type"),
          align: "left",
          field: row => !!row.checklist && this.$t(row.checklist.type),
          sortable: true
        },
        {
          name: "categories",
          align: "left",
          label: this.$t("myData.categories"),
          field: row =>
            (!!row.checklist &&
              !!row.checklist.categories &&
              row.checklist.categories
                .map(category => category.title)
                .join(", ")) ||
            this.$t("NoCategories"),
          sortable: true
        },
        {
          name: "owner",
          label: this.$t("Owner"),
          align: "left",
          field: row =>
            !!row.checklist &&
            !!row.checklist.owner &&
            row.checklist.owner.username,
          sortable: true
        }
      ];
    }
  },
  mounted() {
    this.getData();
    if (localStorage.getItem("pagination")) {
      const savedPagination = JSON.parse(localStorage.getItem("pagination"));

      this.$refs.table.setPagination({
          page: savedPagination.watchListPage || 1,
          rowsPerPage: savedPagination.watchListRowsPerPage || 10,
        });
    }
  },
  beforeDestroy() {
    const pagination = JSON.parse(localStorage.getItem("pagination"));
    const localPagination = {
      watchListPage: this.$refs.table.computedPagination.page,
      watchListRowsPerPage: this.$refs.table.computedPagination.rowsPerPage,
    };
    const filters = { ...pagination, ...localPagination };
    localStorage.setItem("pagination", JSON.stringify(filters));
  },
};
</script>
