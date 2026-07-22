<template>
  <div class="q-mt-lg">
    <q-table class="radius-20 shadow-1  pagination-no-shadow" :title="$t('fundingsInfo.current')" :data="data"
      :visible-columns="visibleColumns" :columns="columns" row-key="name" :pagination="{
        page: 1,
        rowsPerPage: 10
      }" :rows-per-page-label="$t('Records per page')" :no-data-label="$t('No data')"
      :no-results-label="$t('No results')" ref="table">
      <template v-slot:top v-if="!isGuest">
        <div class="column">
          <p class="font-24 ppeditorial q-mb-none">{{ $t("fundingsInfo.current") }}</p>
          <p @click="$router.push({ path: '/user/data?tab=fundings' })"
            class="font-16 text-blue text-underline text-weight-600 cursor-pointer ppeditorial q-mt-xs q-mb-none">
            {{ $t("fundingsInfo.showAll") }}
          </p>
        </div>
        <q-space />
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
                  <q-icon :name="opt.icon" :color="eligibilityFilter === opt.value ? 'primary' : opt.color" size="sm" />
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
      </template>
      <template v-slot:top v-else>
        <div class="column">
          <p class="font-24 ppeditorial q-mb-none">{{ $t("fundingsInfo.current") }}</p>
          <p @click="$router.push({ path: '/community/data?tab=fundings' })"
            class="font-16 text-blue text-underline text-weight-600 cursor-pointer ppeditorial q-mt-xs q-mb-none">
            {{ $t("fundingsInfo.showAll") }}
          </p>
        </div>
        <q-space />
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
                  <q-icon :name="opt.icon" :color="eligibilityFilter === opt.value ? 'primary' : opt.color" size="sm" />
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
          <q-td @click="view(props.row)" auto-width v-for="col in props.cols" :key="col.name" :props="props"
            class="font-14 cursor-pointer">
            <template v-if="col.name === 'visibilityIcon'">
              <q-icon :name="col.value === 'all users' ? 'visibility' : 'visibility_off'" size="sm" class="text-blue" />
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
              {{
                col.value && col.value.length > 145
                  ? col.value.substring(0, 145) + "..."
                  : col.value
              }}
              <q-tooltip v-if="col.name === 'title' && col.value && col.value.length > 145" anchor="bottom left"
                self="top left" content-style="font-size: 14px">
                {{ col.value }}
              </q-tooltip>
            </template>
          </q-td>
          <q-td class="text-right" auto-width>
            <q-btn size="md" color="primary" round flat dense icon="more_vert" aria-label="Optionen">
              <q-menu transition-show="jump-down" transition-hide="jump-up">
                <q-list style="min-width: 140px">
                  <q-item clickable v-close-popup @click="view(props.row)">
                    <q-item-section><span class="text-right font-14">
                        {{ $t("fundingTableOptions.view") }}
                        <q-icon size="sm" class="text-blue" name="visibility" /> </span></q-item-section>
                  </q-item>
                  <q-item v-if="isAdmin" clickable v-close-popup @click="editItem(props.row)">
                    <q-item-section><span class="text-right font-14">
                        {{ $t("fundingTableOptions.edit") }}

                        <q-icon size="sm" class="text-blue" name="edit" /> </span></q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="addToWatchlist(props.row)">
                    <q-item-section><span class="text-right font-14">
                        {{ $t("fundingTableOptions.bookmark") }}

                        <q-icon size="sm" class="text-blue" name="star_rate" /> </span></q-item-section>
                  </q-item>
                  <q-item v-if="isAdmin" clickable v-close-popup @click="archiveItem(props.row)">
                    <q-item-section><span class="text-right font-14">
                        {{ $t("fundingTableOptions.archive") }}

                        <q-icon size="sm" class="text-blue" name="inventory" /> </span></q-item-section>
                  </q-item>
                  <q-item v-if="isAdmin" clickable v-close-popup @click="deleteItem(props.row)">
                    <q-item-section><span class="text-right font-14 text-red">
                        {{ $t("fundingTableOptions.delete") }}

                        <q-icon size="sm" name="delete" /> </span></q-item-section>
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
import DeleteDialog from "components/data/DeleteDialog.vue";
import RequestAccessDialog from "components/data/RequestAccessDialog.vue";
import { dateFormatter } from "src/boot/dateFormatter";

export default {
  name: "fundingInfo",
  data() {
    return {
      itemId: null,
      tab: "fundings",
      deleteDialog: false,
      type: null,
      requestDialog: false,
      eligibilityFilter: "all"
    };
  },
  components: {
    DeleteDialog,
    RequestAccessDialog
  },
  computed: {
    data() {
      const fundings = this.$store.state.funding.fundings;
      if (!fundings) return fundings;
      if (this.eligibilityFilter === "eligible") {
        return fundings.filter(item => item.applicationEligible === true);
      } else if (this.eligibilityFilter === "notEligible") {
        return fundings.filter(item => item.applicationEligible !== true);
      }
      return fundings;
    },
    isGuest() {
      return this.$store.getters["userCenter/isGuest"];
    },
    eligibilityFilterOptions() {
      return [
        { label: this.$t("eligibilityFilter.all"), value: "all", icon: "filter_list", color: "grey-7" },
        { label: this.$t("eligibilityFilter.eligible"), value: "eligible", icon: "check_circle", color: "positive" },
        { label: this.$t("eligibilityFilter.notEligible"), value: "notEligible", icon: "cancel", color: "negative" }
      ];
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
          name: "visibilityIcon",
          align: "center",
          label: this.$t("fundingsCol.visibility") || "Sichtbarkeit",
          field: row => row.visibility,
          sortable: false
        },
        {
          name: "applicationEligible",
          align: "center",
          label: this.$t("fundingsCol.eligibility"),
          field: row => row.applicationEligible,
          sortable: true
        }
      ];
    },
    isAdmin() {
      return this.$store.getters["userCenter/isAdmin"];
    },
    visibleColumns() {
      const cols = ["title", "plannedStart", "plannedEnd", "applicationEligible"];
      if (this.isAdmin) cols.push("visibilityIcon");
      return cols;
    },
    loggedInUser() {
      return (
        !!this.$store.state.userCenter.user &&
        this.$store.state.userCenter.user.user
      );
    }
  },
  methods: {
    dateFormatter,
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
