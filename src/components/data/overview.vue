<template>
  <div class="q-my-lg ">
    <q-tabs v-if="isInPage" v-model="tab" align="justify" indicator-color="transparent" class="q-mb-lg text-black"
      active-bg-color="yellow" no-caps>
      <q-route-tab :to="{ query: { tab: 'projectIdeas' } }" exact replace class="q-py-xs q-mr-lg radius-10 border-yellow"
        :class="$q.screen.gt.sm ? 'q-pa-lg' : 'q-pa-sm q-px-lg'" name="projectIdeas">
        <p class="font-20 no-margin">{{ $t("myData.projectIdeas") }}</p>
      </q-route-tab>
      <q-route-tab :to="{ query: { tab: 'fundings' } }" exact replace class="q-mr-lg radius-10 border-yellow"
        :class="$q.screen.gt.sm ? 'q-pa-lg' : 'q-pa-sm q-px-lg'" name="fundings">
        <p class="font-20 no-margin">{{ $t("myData.fundings") }}</p>
      </q-route-tab>
      <q-route-tab :to="{ query: { tab: 'implementationChecklist' } }" exact replace class=" radius-10 border-yellow"
        :class="$q.screen.gt.sm ? 'q-pa-lg' : 'q-pa-sm q-px-lg'" name="implementationChecklist">
        <p class="font-20 no-margin">
          {{ $t("myData.implementationChecklist") }}
        </p>
      </q-route-tab>
    </q-tabs>
    <q-table class="radius-20 shadow-1 pagination-no-shadow" :data="data" :columns="columns" row-key="title"
      :hide-bottom="!isInPage && data.length > 0" :hide-header="!isInPage"
      :visible-columns="isInPage ? visibleColumns : ['title']" :filter="filter" :pagination="{
        sortBy: 'id',
        descending: true,
        page: 1,
        rowsPerPage: isInPage ? 10 : 5
      }" :rows-per-page-label="$t('Records per page')" :no-data-label="$t('No data')"
      :no-results-label="$t('No results')"
      ref="table">
      <template v-slot:top>
        <div v-if="!isInPage" class="row full-width">
          <div class="col-12">
            <p class="font-20 ppeditorial">
              {{ $t("myDataHome.myData") }}
              <span class="font-14 float-right text-blue text-underline text-weight-600 cursor-pointer"
                @click="$router.push({ path: `/user/data?tab=${tab}` })">
                {{ $t("myDataHome.showMy") }}
              </span>
            </p>
          </div>
          <div class="col-12">
            <q-tabs v-model="tab" align="justify" indicator-color="transparent" class="text-black"
              active-bg-color="yellow" no-caps dense>
              <q-tab class="q-mr-lg radius-6 border-yellow" name="projectIdeas">
                <p class="font-14 text-weight-600 no-margin">
                  {{ $t("myDataHome.projectIdeaBtn") }}
                </p>
              </q-tab>
              <q-tab class="q-mr-lg radius-6 border-yellow" name="fundings">
                <p class="font-14 text-weight-600 no-margin">
                  {{ $t("myDataHome.fundingsBtn") }}
                </p>
              </q-tab>
              <q-tab class="q-mr-lg radius-6 border-yellow" name="implementationChecklist">
                <p class="font-14 text-weight-600 no-margin">
                  {{ $t("myDataHome.implementationChecklistBtn") }}
                </p>
              </q-tab>
            </q-tabs>
          </div>
        </div>
        <div v-if="isInPage" class="row full-width justify-between items-center">
          <div class="col-8 col-md-4">
            <q-input borderless outlined class="input-radius-6 no-shadow q-mb-sm q-mt-sm" v-model="filter"
              :placeholder="$t('Search')" dense>
              <template v-slot:prepend>
                <q-icon color="blue-5" name="search" />
              </template>
            </q-input>
          </div>
          <div class="text-right">
            <q-btn color="blue" icon="add" unelevated :round="$q.screen.lt.md" filled
              class="mr-0 text-weight-600 q-mb-sm q-mt-sm" :class="$q.screen.gt.sm ? 'radius-6' : ''" no-caps
              @click="goToPage(tab)" v-if="isAdmin || tab !== 'fundings'">
              <p v-if="$q.screen.gt.sm" class="q-mb-none q-mx-md q-my-sm">
                {{
                  tab == "projectIdeas"
                  ? $t("myData.createProjectIdea")
                  : tab == "fundings"
                    ? $t("fundingsCol.createFunding")
                    : $t("checkListCols.createImplementationChecklist")
                }}
              </p>
            </q-btn>
          </div>
        </div>
      </template>
      <template v-slot:header="props">
        <q-tr class="tableHeader" :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props" class="font-14  text-black">
            {{ col.label }}
          </q-th>
          <q-th auto-width />
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td @click="view(props.row)" auto-width v-for="col in props.cols" :key="col.name" :props="props"
            class="font-14 cursor-pointer">
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
                    <q-item-section><span class="text-right font-14">
                        {{ $t("myDataTableOptions.view") }}
                        <q-icon v-if="!viewIsLoading" size="sm" class="text-blue" name="visibility" />
                        <q-spinner v-else color="primary" size="sm" :thickness="2" /> </span></q-item-section>
                  </q-item>
                  <q-item v-if="isAdmin || tab !== 'fundings'" clickable v-close-popup @click="editItem(props.row)">
                    <q-item-section><span class="text-right font-14">
                        {{ $t("myDataTableOptions.edit") }}

                        <q-icon v-if="!editIsLoading" size="sm" class="text-blue" name="edit" />
                        <q-spinner v-else color="primary" size="sm" :thickness="2" /> </span></q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="addToWatchlist(props.row)">
                    <q-item-section><span class="text-right font-14">
                        {{ $t("myDataTableOptions.bookmark") }}

                        <q-icon v-if="!watchlistIsLoading" size="sm" class="text-blue" name="star_rate" />
                        <q-spinner v-else color="primary" size="sm" :thickness="2" /> </span></q-item-section>
                  </q-item>
                  <q-item v-if="isAdmin ||
                    (tab !== 'fundings' &&
                      (!!props.row.owner && props.row.owner.id) ===
                      (!!loggedInUser && loggedInUser.id))
                    " clickable v-close-popup @click="archiveItem(props.row)">
                    <q-item-section><span class="text-right font-14">
                        {{ $t("myDataTableOptions.archive") }}

                        <q-icon v-if="!archiveIsLoading" size="sm" class="text-blue" name="inventory" />
                        <q-spinner v-else color="red" size="sm" :thickness="2" /> </span></q-item-section>
                  </q-item>
                  <q-item v-if="isAdmin" clickable v-close-popup @click="deleteItem(props.row)">
                    <q-item-section><span class="text-right font-14 text-red">
                        {{ $t("myDataTableOptions.delete") }}

                        <q-icon v-if="!deleteIsLoading" size="sm" class="text-red" name="delete" />
                        <q-spinner v-else color="red" size="sm" :thickness="2" /> </span></q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <DeleteDialog :id="itemId" :tab="tab" :dialogState="deleteDialog"
      @update="(deleteDialog = $event), (itemId = null)" />
    <RequestAccessDialog :id="itemId" :tab="tab" :type="type" :dialogState="requestDialog"
      @update="(requestDialog = $event), (itemId = null), (type = null)" />
  </div>
</template>

<script>
import { dateFormatter } from "src/boot/dateFormatter";
import DeleteDialog from "components/data/DeleteDialog.vue";
import RequestAccessDialog from "components/data/RequestAccessDialog.vue";
export default {
  name: "dataOverview",
  components: {
    DeleteDialog,
    RequestAccessDialog
  },
  data() {
    return {
      tab: this.$router.currentRoute.query.tab || "projectIdeas",
      filter: "",
      visibleColumns: [
        "title",
        "categories",
        "status",
        "plannedStart",
        "plannedEnd"
      ],
      deleteDialog: false,
      requestDialog: false,
      itemId: null,
      type: null,
      viewIsLoading: false,
      editIsLoading: false,
      deleteIsLoading: false,
      archiveIsLoading: false,
      watchlistIsLoading: false
    };
  },
  methods: {
    filterTable(rows, terms, cols, getCellValue) {
      let filteredRows = rows;
      console.log("terms", terms);
      console.log("cols", cols);

      if (!!terms) {
        filteredRows = filteredRows.filter(row => {
          console.log("row", row);
          // return row.title.toLowerCase().includes(terms.toLowerCase());
          for (const key in row) {
            // console.log("key", key);
            if (row.hasOwnProperty(key)) {
              const value = row[key];
              // console.log("value", value);
              // console.log("typeof value", typeof value);
              if (typeof value === "string") {
                if (value.toLowerCase().includes(terms.toLowerCase())) {
                  return true;
                }
              } else if (typeof value === "object") {
                for (const nestedKey in value) {
                  if (value.hasOwnProperty(nestedKey)) {
                    const nestedValue = value[nestedKey];
                    console.log("nestedValue", nestedValue);
                    if (nestedValue.includes(terms.toLowerCase())) {
                      return true;
                    }
                  }
                }
              }
            }
          }
        });
      }

      return filteredRows;
    },
    dateFormatter,
    async view(row) {
      const id = row && row.id;
      this.viewIsLoading = true;
      if (this.tab === "projectIdeas") {
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
          console.log("hasReaderAccess", hasReaderAccess);
          console.log("hasEditorAccess", hasEditorAccess);
          console.log("hasReaderAccess", hasReaderAccess.length);
          console.log("hasEditorAccess", hasEditorAccess.length);
          if (hasReaderAccess.length > 0 || hasEditorAccess.length > 0) {
            this.$router.push({ path: `/user/newProjectIdea/${id}` });
          } else {
            this.itemId = row && row.id;
            this.type = "view";
            this.requestDialog = true;
          }
        } else {
          this.$router.push({ path: `/user/newProjectIdea/${id}` });
        }
      } else if (this.tab === "fundings") {
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
      } else {
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
            this.$router.push({ path: `/user/newChecklist/${id}` });
          } else {
            this.itemId = row && row.id;
            this.type = "view";
            this.requestDialog = true;
          }
        } else {
          this.$router.push({ path: `/user/newChecklist/${id}` });
        }
      }
      this.viewIsLoading = false;
    },
    async editItem(row) {
      this.editIsLoading = true;
      const id = row && row.id;
      if (this.tab === "projectIdeas") {
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
            this.$router.push({ path: `/user/newProjectIdea/edit/${id}` });
          } else {
            this.itemId = row && row.id;
            this.type = "edit";
            this.requestDialog = true;
          }
        } else {
          this.$router.push({ path: `/user/newProjectIdea/edit/${id}` });
        }
      } else if (this.tab === "fundings") {
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
      } else {
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
            this.$router.push({ path: `/user/newChecklist/edit/${id}` });
          } else {
            this.itemId = row && row.id;
            this.type = "edit";
            this.requestDialog = true;
          }
        } else {
          this.$router.push({ path: `/user/newChecklist/edit/${id}` });
        }
      }
      this.editIsLoading = false;
    },
    async deleteItem(row) {
      this.itemId = row && row.id;
      this.deleteDialog = true;
    },
    async archiveItem(row) {
      if (this.tab === "projectIdeas") {
        this.archiveIsLoading = true;
        const id = row && row.id;
        await this.$store.dispatch("project/archiveProjectIdea", {
          id: id
        });
        this.archiveIsLoading = false;
      } else if (this.tab === "fundings") {
        this.archiveIsLoading = true;
        const id = row && row.id;
        await this.$store.dispatch("funding/archiveFunding", {
          id: id
        });
        this.archiveIsLoading = false;
      } else {
        this.archiveIsLoading = true;
        const id = row && row.id;
        await this.$store.dispatch("implementationChecklist/archiveChecklist", {
          id: id
        });
        this.archiveIsLoading = false;
      }
    },
    async addToWatchlist(row) {
      if (this.tab === "projectIdeas") {
        this.watchlistIsLoading = true;
        const id = row && row.id;
        await this.$store.dispatch("project/addToWatchlist", {
          id: id
        });
        this.watchlistIsLoading = false;
      } else if (this.tab === "fundings") {
        this.watchlistIsLoading = true;
        const id = row && row.id;
        await this.$store.dispatch("funding/addToWatchlist", {
          id: id
        });
        this.watchlistIsLoading = false;
      } else {
        this.watchlistIsLoading = true;
        const id = row && row.id;
        await this.$store.dispatch("implementationChecklist/addToWatchlist", {
          id: id
        });
        this.watchlistIsLoading = false;
      }
    },
    goToPage(page) {
      if (page === "projectIdeas") {
        this.$store.commit("project/setSpecificProject", null);
        this.$router.push({ path: "/user/newProjectIdea" });
      } else if (page === "fundings") {
        this.$store.commit("funding/setSpecificFunding", null);
        this.$router.push({ path: "/user/newFunding" });
      } else {
        this.$store.commit(
          "implementationChecklist/setSpecificChecklist",
          null
        );
        this.$router.push({ path: "/user/newChecklist" });
      }
    },
    getData(tab) {
      if (tab === "projectIdeas") {
        this.$store.dispatch("project/getProjectIdeas");
        this.$store.commit("project/setSpecificProject", null);
      } else if (tab == "fundings") {
        this.$store.dispatch("funding/getFundings");
        this.$store.commit("funding/setSpecificFunding", null);
      } else {
        this.$store.dispatch("implementationChecklist/getChecklists");
        this.$store.commit(
          "implementationChecklist/setSpecificChecklist",
          null
        );
      }
    }
  },
  watch: {
    tab(val) {
      if (val === "projectIdeas") {
        this.getData("projectIdeas");
      } else if (val === "fundings") {
        this.getData("fundings");
      } else {
        this.getData("implementationChecklist");
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
    loggedInUserMunicipality() {
      return (
        !!this.$store.state.userCenter.user &&
        this.$store.state.userCenter.user.userDetails.municipality
      );
    },
    isInPage() {
      return this.$router.currentRoute.path == "/user/data";
    },
    columns() {
      return this.tab == "projectIdeas"
        ? this.projectCols
        : this.tab == "fundings"
          ? this.fundingCols
          : this.checklistCols;
    },
    data() {
      // if (this.isGuest) {
      //   return this.tab == "projectIdeas"
      //     ? !!this.$store.state.project.projects &&
      //     this.$store.state.project.projects.filter((item) => {
      //       return item.owner.user_detail.municipality.title == this.loggedInUserMunicipality.title && item.visibility != "only for me"
      //     })
      //     : this.tab == "fundings"
      //       ? !!this.$store.state.funding.fundings &&
      //       this.$store.state.funding.fundings.filter((item) => {
      //         return item.owner.user_detail.municipality.title == this.loggedInUserMunicipality.title && item.visibility != "only for me"
      //       })
      //       : !!this.$store.state.implementationChecklist.checklists &&
      //       this.$store.state.implementationChecklist.checklists.filter((item) => {
      //         return item.owner.user_detail.municipality.title == this.loggedInUserMunicipality.title && item.visibility != "only for me"
      //       });
      // } else {
      return this.tab == "projectIdeas"
        ? !!this.$store.state.project.projects &&
        this.$store.state.project.projects.filter((item) => {
          return item.owner.id == this.loggedInUser.id || item.editors.filter((editor) => {
            return editor.id == this.loggedInUser.id
          }).length > 0
        })
        : this.tab == "fundings"
          ? !!this.$store.state.funding.fundings &&
          this.$store.state.funding.fundings.filter((item) => {
            return item.owner.id == this.loggedInUser.id || item.editors.filter((editor) => {
              return editor.id == this.loggedInUser.id
            }).length > 0
          })
          : !!this.$store.state.implementationChecklist.checklists &&
          this.$store.state.implementationChecklist.checklists.filter((item) => {
            return item.owner.id == this.loggedInUser.id || item.editors.filter((editor) => {
              return editor.id == this.loggedInUser.id
            }).length > 0
          });
      // }
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
          field: row => row.title,
          sortable: true
        },
        {
          name: "categories",
          align: "left",
          label: this.$t("myData.categories"),
          field: row =>
            (!!row.categories &&
              row.categories.map(category => category.title).join(", ")) ||
            this.$t("NoCategories"),
          sortable: true
        },
        {
          name: "status",
          label: "Status",
          align: "left",
          field: row =>
            row.published === true
              ? this.$t("Published")
              : row.published === false
                ? this.$t("Draft")
                : this.$t("Status Unavailable"),
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
          field: row => row.title,
          sortable: true
        },
        {
          name: "categories",
          align: "left",
          label: this.$t("fundingsCol.categories"),
          field: row =>
            (!!row.categories &&
              row.categories.map(category => category.title).join(", ")) ||
            "No Categories",
          sortable: true
        },
        {
          name: "plannedStart",
          label: this.$t("fundingsCol.start"),
          align: "left",
          field: row => dateFormatter(row.plannedStart),
          sortable: true,
          sort: (a, b, rowA, rowB) => {
            const dateA = new Date(rowA.plannedStart);
            const dateB = new Date(rowB.plannedStart);
            return dateB - dateA;
          }
        },
        {
          name: "plannedEnd",
          label: this.$t("fundingsCol.end"),
          align: "left",
          field: row => dateFormatter(row.plannedEnd),
          sortable: true,
          sort: (a, b, rowA, rowB) => {
            const dateA = new Date(rowA.plannedEnd);
            const dateB = new Date(rowB.plannedEnd);
            return dateB - dateA;
          }
        },
        {
          name: "status",
          label: "Status",
          align: "left",
          field: row =>
            row.published === true
              ? this.$t("Published")
              : row.published === false
                ? this.$t("Draft")
                : this.$t("Status Unavailable"),
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
          label: this.$t("checkListCols.title"),
          align: "left",
          field: row => row.title,
          sortable: true
        },
        {
          name: "categories",
          align: "left",
          label: this.$t("checkListCols.categories"),
          field: row =>
            (!!row.categories &&
              row.categories.map(category => category.title).join(", ")) ||
            "No Categories",
          sortable: true
        },
        {
          name: "status",
          label: "Status",
          align: "left",
          field: row =>
            row.published === true
              ? this.$t("Published")
              : row.published === false
                ? this.$t("Draft")
                : this.$t("Status Unavailable"),
          sortable: true
        }
      ];
    }
  },
  mounted() {
    console.log("this.$router.currentRoute", this.$router.currentRoute);
    this.getData(this.tab);
    if (localStorage.getItem("pagination")) {
      const savedPagination = JSON.parse(localStorage.getItem("pagination"));

      this.$refs.table.setPagination({
          page: savedPagination.dataOverviewPage || 1,
          rowsPerPage: savedPagination.dataOverviewRowsPerPage || 10,
        });
    }
  },
  beforeDestroy() {
    const pagination = JSON.parse(localStorage.getItem("pagination"));
    const localPagination = {
      dataOverviewPage: this.$refs.table.computedPagination.page,
      dataOverviewRowsPerPage: this.$refs.table.computedPagination.rowsPerPage,
    };
    const filters = { ...pagination, ...localPagination };
    localStorage.setItem("pagination", JSON.stringify(filters));
  },
};
</script>
