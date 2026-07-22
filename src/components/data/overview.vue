<template>
  <div class="q-my-lg ">
    <q-tabs v-if="isInPage" v-model="tab" align="justify" indicator-color="transparent" class="q-mb-lg text-black"
      active-bg-color="yellow" no-caps>
      <q-route-tab :to="{ query: { tab: 'projectIdeas' } }" exact replace
        class="q-py-xs q-mr-lg radius-10 border-yellow" :class="$q.screen.gt.sm ? 'q-pa-lg' : 'q-pa-sm q-px-lg'"
        name="projectIdeas">
        <p class="font-20 no-margin">{{ $t("myData.projectIdeas") }}</p>
      </q-route-tab>
      <q-route-tab :to="{ query: { tab: 'fundings' } }" exact replace class="q-mr-lg radius-10 border-yellow"
        :class="$q.screen.gt.sm ? 'q-pa-lg' : 'q-pa-sm q-px-lg'" name="fundings">
        <p class="font-20 no-margin">{{ $t("myData.fundings") }}</p>
      </q-route-tab>
    </q-tabs>
    <q-table class="radius-20 shadow-1 pagination-no-shadow" :data="data" :columns="columns" row-key="title"
      :hide-bottom="!isInPage && data.length > 0" :hide-header="!isInPage"
      :visible-columns="isInPage ? visibleColumns : ['title']" :filter="filter" :pagination="{
        sortBy: 'updatedAt',
        descending: true,
        page: 1,
        rowsPerPage: isInPage ? 10 : 5
      }" :rows-per-page-label="$t('Records per page')" :no-data-label="$t('No data')"
      :no-results-label="$t('No results')" ref="table">
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
          <div v-if="tab === 'fundings'" class="col-auto">
            <q-btn round flat dense icon="filter_list" :color="eligibilityFilter !== 'all' ? 'primary' : 'grey-7'"
              aria-label="Filter">
              <q-menu anchor="bottom right" self="top right" class="radius-10 shadow-2" transition-show="jump-down"
                transition-hide="jump-up">
                <q-list style="min-width: 220px" separator padding>
                  <q-item-label header class="font-12 text-weight-600 text-grey-7 q-pb-sm">
                    {{ $t("eligibilityFilter.filterTooltip") }}
                  </q-item-label>
                  <q-item v-for="opt in eligibilityFilterOptions" :key="opt.value" clickable v-close-popup
                    :active="eligibilityFilter === opt.value" active-class="bg-blue-1 text-primary"
                    @click="eligibilityFilter = opt.value">
                    <q-item-section avatar>
                      <q-icon :name="opt.icon" :color="eligibilityFilter === opt.value ? 'primary' : opt.color"
                        size="sm" />
                    </q-item-section>
                    <q-item-section class="text-weight-500">{{ opt.label }}</q-item-section>
                    <q-item-section side v-if="eligibilityFilter === opt.value">
                      <q-icon name="check" color="primary" size="xs" />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
              <q-tooltip>{{ $t("eligibilityFilter.filterTooltip") }}</q-tooltip>
            </q-btn>
          </div>
          <div class="text-right">
            <q-btn color="blue" icon="add" unelevated :round="$q.screen.lt.md" filled
              class="mr-0 text-weight-600 q-mb-sm q-mt-sm" :class="$q.screen.gt.sm ? 'radius-6' : ''" no-caps
              @click="goToPage(tab)" v-if="isAdmin || tab !== 'fundings'">
              <p v-if="$q.screen.gt.sm" class="q-mb-none q-mx-md q-my-sm">
                {{
                  tab == "projectIdeas"
                    ? $t("myData.createProjectIdea")
                    : $t("fundingsCol.createFunding")
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
            <template v-if="col.name === 'applicationProcess'">
              <q-badge color="primary" class="text-white q-py-sm q-px-md" v-if="!props.row.applicationProcessSteps">
                {{ $t("aiFundingCheck") }}
              </q-badge>
              <q-badge :color="getLastCompletedStepColor(props.row.applicationProcessSteps)"
                :text-color="getLastCompletedStepTextColor(props.row.applicationProcessSteps)"
                class="text-white q-py-sm q-px-md" v-else>
                {{ getLastCompletedStep(props.row.applicationProcessSteps) }}
              </q-badge>
            </template>
            <template v-else-if="col.name === 'status'">
              <q-badge :color="getStatusColor(props.row.status)"
                :class="props.row.status === null ? 'text-black' : 'text-white'" class="q-py-sm q-px-md">
                {{ getStatusText(props.row.status) }}
              </q-badge>
            </template>
            <template v-else-if="col.name === 'applicationEligible'">
              <div class="flex flex-center">
                <q-icon :name="col.value ? 'check_circle' : 'cancel'"
                  :color="col.value ? 'positive' : 'negative'" size="sm">
                  <q-tooltip>{{ col.value ? $t('eligibilityFilter.eligible') : $t('eligibilityFilter.notEligible') }}</q-tooltip>
                </q-icon>
              </div>
            </template>
            <template v-else>
              <q-tooltip v-if="col.value && col.value.length > 48" anchor="bottom left" self="top left"
                content-style="font-size: 14px">
                {{ col.value }}
              </q-tooltip>
              {{
                col.value && col.value.length > 125
                  ? col.value.substring(0, 125) + "..."
                  : col.value
              }}
            </template>

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
        "plannedEnd",
        "updatedAt",
        "applicationProcess",
        "owner",
        "applicationEligible"
      ],
      deleteDialog: false,
      requestDialog: false,
      itemId: null,
      type: null,
      viewIsLoading: false,
      editIsLoading: false,
      deleteIsLoading: false,
      archiveIsLoading: false,
      watchlistIsLoading: false,
      eligibilityFilter: "all"
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
            this.$router.push({ path: `/application/process/view/${id}` });
          } else {
            this.itemId = row && row.id;
            this.type = "view";
            this.requestDialog = true;
          }
        } else {
          this.$router.push({ path: `/application/process/view/${id}` });
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
            this.$router.push({ path: `/application/process/edit/${id}` });
          } else {
            this.itemId = row && row.id;
            this.type = "edit";
            this.requestDialog = true;
          }
        } else {
          this.$router.push({ path: `/application/process/edit/${id}` });
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
      }
    },
    goToPage(page) {
      if (page === "projectIdeas") {
        this.$store.commit("project/setSpecificProject", null);
        this.$router.push({ path: "/application/process/" });
      } else if (page === "fundings") {
        this.$store.commit("funding/setSpecificFunding", null);
        this.$router.push({ path: "/user/newFunding" });
      }
    },
    getData(tab) {
      if (tab === "projectIdeas") {
        this.$store.dispatch("project/getProjectIdeas");
        this.$store.commit("project/setSpecificProject", null);
      } else if (tab == "fundings") {
        this.$store.dispatch("funding/getFundings");
        this.$store.commit("funding/setSpecificFunding", null);
      }
    },
    getLastCompletedStepColor(applicationProcessSteps) {
      if (!applicationProcessSteps || !Array.isArray(applicationProcessSteps) || applicationProcessSteps.length === 0) {
        return 'primary'; // Default color
      }

      // Filter the steps that are done
      const completedSteps = applicationProcessSteps.filter(step => step.done);

      // If no completed steps, return default
      if (completedSteps.length === 0) {
        return 'primary';
      }

      // Get the last completed step
      const lastCompletedStep = completedSteps[completedSteps.length - 1];

      // Determine color based on the name of the last completed step
      switch (lastCompletedStep.name) {
        case 'aiFundingCheck':
          return 'primary'; // Blue
        case 'projectDevelopment':
          return 'blue-2'; // Light Blue
        case 'application':
          return 'blue-1'; // Green
        default:
          return 'primary'; // Default color
      }
    },
    getLastCompletedStep(applicationProcessSteps) {
      if (!applicationProcessSteps || !Array.isArray(applicationProcessSteps) || applicationProcessSteps.length === 0) {
        return this.$t("aiFundingCheck");
      }

      // Filter the steps that are done
      const completedSteps = applicationProcessSteps.filter(step => step.done);

      // If no completed steps, return default
      if (completedSteps.length === 0) {
        return this.$t("aiFundingCheck");
      }

      // Get the last completed step
      const lastCompletedStep = completedSteps[completedSteps.length - 1];

      // Try to use translation key based on the name property first
      // If not available, use the title directly, and if that's not available either, use a default
      const translationKey = `${lastCompletedStep.name}`;
      return this.$t(translationKey) ? this.$t(translationKey) : (lastCompletedStep.title || this.$t("aiFundingCheck"));
    },

    getLastCompletedStepTextColor(applicationProcessSteps) {
      if (!applicationProcessSteps || !Array.isArray(applicationProcessSteps) || applicationProcessSteps.length === 0) {
        return 'white'; // Default text color
      }

      // Filter the steps that are done
      const completedSteps = applicationProcessSteps.filter(step => step.done);

      // If no completed steps, return default
      if (completedSteps.length === 0) {
        return 'white';
      }

      // Get the last completed step
      const lastCompletedStep = completedSteps[completedSteps.length - 1];

      // Determine text color based on the name of the last completed step
      switch (lastCompletedStep.name) {
        case 'aiFundingCheck':
          return 'white'; // Blue badge - white text
        case 'projectDevelopment':
          return 'black'; // Light Blue badge - black text
        case 'application':
          return 'black'; // Green badge - black text
        default:
          return 'white'; // Default text color
      }
    },

    getStatusText(status) {
      if (status === "sentToFunding") {
        return this.$t('projectComponents.submissionSigning.sentToFunding');
      } else if (status === "grantNotice") {
        return this.$t('Zuwendungsbescheid'); // Granted
      } else if (status === "rejectionNotice") {
        return this.$t('Ablehnungsbescheid'); // Rejected
      } else {
        return this.$t('In Bearbeitung'); // In progress (null)
      }
    },

    getStatusColor(status) {
      if (status === "grantNotice") {
        return 'green'; // Granted - green badge
      } else if (status === "rejectionNotice") {
        return 'red'; // Rejected - red badge
      } else if (status === "sentToFunding") {
        return 'blue'; // Sent to funding - blue badge
      } else {
        return 'yellow'; // In progress - yellow badge
      }
    },
  },
  watch: {
    tab(val) {
      if (val === "projectIdeas") {
        this.getData("projectIdeas");
      } else if (val === "fundings") {
        this.getData("fundings");
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
        : this.fundingCols;
    },
    data() {
      if (this.tab == "projectIdeas") {
        return !!this.$store.state.project.projects &&
          this.$store.state.project.projects.filter((item) => {
            return item.owner.id == this.loggedInUser.id || item.editors.filter((editor) => {
              return editor.id == this.loggedInUser.id
            }).length > 0
          });
      }
      const fundings = !!this.$store.state.funding.fundings &&
        this.$store.state.funding.fundings.filter((item) => {
          return item.owner.id == this.loggedInUser.id || item.editors.filter((editor) => {
            return editor.id == this.loggedInUser.id
          }).length > 0
        });
      if (!fundings) return fundings;
      if (this.eligibilityFilter === "eligible") {
        return fundings.filter(item => item.applicationEligible === true);
      } else if (this.eligibilityFilter === "notEligible") {
        return fundings.filter(item => item.applicationEligible !== true);
      }
      return fundings;
    },
    eligibilityFilterOptions() {
      return [
        { label: this.$t("eligibilityFilter.all"), value: "all", icon: "filter_list", color: "grey-7" },
        { label: this.$t("eligibilityFilter.eligible"), value: "eligible", icon: "check_circle", color: "positive" },
        { label: this.$t("eligibilityFilter.notEligible"), value: "notEligible", icon: "cancel", color: "negative" }
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
          field: row => row.title,
          sortable: true
        }, {
          name: "updatedAt",
          align: "center",
          label: this.$t("Speicherdatum"),
          field: "updatedAt",
          sortable: true,
          format: (val) => (val ? dateFormatter(val) : ""),
        },
        {
          name: "applicationProcess",
          align: "left",
          label: this.$t("ProjectDashboard.applicationProcess"),
          field: "applicationProcessSteps",
          sortable: true,
        },
        {
          name: "status",
          align: "left",
          label: this.$t("ProjectDashboard.status"),
          field: "status",
          sortable: true,
        },
        {
          name: "owner",
          align: "left",
          label: this.$t("statsTable.owners"),
          field: row => (row.owner ? row.owner.username : this.$t("Unknown")),
          sortable: true,
        },
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
          align: "left",
          label: this.$t("fundingsColsHome.title"),
          field: row => row.title,
          sortable: true
        },
        {
          name: "plannedStart",
          align: "center",
          label: this.$t("fundingsCol.start"),
          field: row => dateFormatter(row.plannedStart),
          sortable: true,
          sort: (a, b, rowA, rowB) => {
            const dateA = new Date(rowA.plannedStart);
            const dateB = new Date(rowB.plannedStart);
            return dateB - dateA;
          },
        },
        {
          name: "plannedEnd",
          align: "center",
          label: this.$t("fundingsCol.end"),
          field: row => dateFormatter(row.plannedEnd),
          sortable: true,
          sort: (a, b, rowA, rowB) => {
            const dateA = new Date(rowA.plannedEnd);
            const dateB = new Date(rowB.plannedEnd);
            return dateB - dateA;
          }
        },
        {
          name: "applicationEligible",
          align: "center",
          label: this.$t("fundingsCol.eligibility"),
          field: row => row.applicationEligible,
          sortable: true
        }
      ];
    }
  },
  mounted() {
    console.log("this.$router.currentRoute", this.$router.currentRoute);
    this.getData(this.tab);

    // Apply saved pagination settings with proper error handling
    this.$nextTick(() => {
      if (localStorage.getItem("pagination") && this.$refs.table) {
        try {
          const savedPagination = JSON.parse(localStorage.getItem("pagination") || "{}");
          this.$refs.table.setPagination({
            page: savedPagination.dataOverviewPage || 1,
            rowsPerPage: savedPagination.dataOverviewRowsPerPage || 10,
          });
        } catch (error) {
          console.error("Error applying saved pagination:", error);
        }
      }
    });
  },
  beforeDestroy() {
    // Save pagination settings with proper error handling
    if (this.$refs.table) {
      try {
        const pagination = JSON.parse(localStorage.getItem("pagination") || "{}");
        const localPagination = {
          dataOverviewPage: this.$refs.table.computedPagination.page,
          dataOverviewRowsPerPage: this.$refs.table.computedPagination.rowsPerPage,
        };
        const filters = { ...pagination, ...localPagination };
        localStorage.setItem("pagination", JSON.stringify(filters));
      } catch (error) {
        console.error("Error saving pagination:", error);
      }
    }
  },
};
</script>
