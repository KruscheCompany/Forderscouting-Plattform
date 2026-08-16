<template>
  <q-expansion-item v-if="showSection" v-model="expanded" header-class="radius-20 shadow-1 bg-white q-px-md"
    expand-icon-class="text-blue" class="q-mt-md q-mb-lg">
    <template v-slot:header>
      <q-item-section avatar>
        <q-icon name="mdi-star" color="blue" />
      </q-item-section>
      <q-item-section>
        <span class="font-16 text-weight-600">{{ $t("ProjectDashboard.prioritizedProjects") }}</span>
      </q-item-section>
    </template>

    <div class="bg-white radius-20 shadow-1 overflow-hidden priority-table q-mt-md">
      <div v-if="isAdmin" class="q-pa-md" :class="{ 'priority-selector-border': selectedMunicipality }">
        <p class="text-black q-mb-xs font-14">{{ $t("ProjectDashboard.municipalities") }}</p>
        <q-select clearable class="no-shadow input-radius-4" style="max-width: 320px" color="primary"
          bg-color="grey-2" :label="$t('Search')" filled :options="municipalityOptions"
          v-model="selectedMunicipality" option-value="id" option-label="title" @input="onMunicipalityChange" />
      </div>

      <div v-if="isAdmin && !selectedMunicipality" class="priority-empty-state q-pa-xl text-center">
        <q-icon name="mdi-office-building-outline" size="40px" color="grey-5" />
        <p class="text-blue-grey-7 font-14 q-mt-sm q-mb-none">{{ $t("ProjectDashboard.selectMunicipalityPrompt") }}</p>
      </div>

      <div v-else-if="loading" class="text-center q-pa-xl">
        <q-spinner color="primary" size="2em" />
      </div>

      <div v-else-if="prioritizedProjects.length === 0" class="priority-empty-state q-pa-xl text-center">
        <q-icon name="mdi-star-off-outline" size="40px" color="grey-5" />
        <p class="text-blue-grey-7 font-14 q-mt-sm q-mb-none">{{ $t("ProjectDashboard.noPrioritizedProjects") }}</p>
      </div>

      <q-table v-else flat class="radius-20 shadow-1 pagination-no-shadow" :data="localList" :columns="columns"
        row-key="id" :pagination.sync="pagination" hide-bottom>
        <template v-slot:header="props">
          <q-tr class="tableHeader" :props="props">
            <q-th v-if="isLeader" auto-width />
            <q-th v-for="col in props.cols" :key="col.name" :props="props" class="font-14 text-black">
              {{ col.label }}
            </q-th>
            <q-th v-if="isLeader" auto-width />
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props" class="priority-row" :draggable="isLeader && !isSorted"
            @dragstart="onRowDragStart(props.row)" @dragover.prevent @drop="onRowDrop(props.row)">
            <q-td v-if="isLeader" auto-width class="priority-col-handle">
              <q-icon name="mdi-drag" size="sm" :class="isSorted ? 'text-grey-5' : 'drag-handle cursor-pointer'" />
            </q-td>
            <q-td v-for="col in props.cols" :key="col.name" :props="props" class="font-14 cursor-pointer"
              :class="{ 'text-overflow': col.name === 'title', 'text-blue-grey-7 text-overflow': col.name === 'prioritizedBy' }"
              @click="view(props.row.project)">
              <template v-if="col.name === 'applicationProcess'">
                <q-badge color="primary" class="text-white q-py-xs q-px-sm" v-if="!props.row.project.applicationProcessSteps">
                  {{ $t("aiFundingCheck") }}
                </q-badge>
                <q-badge :color="getLastCompletedStepColor(props.row.project.applicationProcessSteps)"
                  :text-color="getLastCompletedStepTextColor(props.row.project.applicationProcessSteps)"
                  class="q-py-xs q-px-sm" v-else>
                  {{ getLastCompletedStep(props.row.project.applicationProcessSteps) }}
                </q-badge>
              </template>
              <template v-else-if="col.name === 'status'">
                <q-badge :color="getStatusColor(props.row.project.status)"
                  :class="props.row.project.status === null ? 'text-black' : 'text-white'" class="q-py-xs q-px-sm">
                  {{ getStatusText(props.row.project.status) }}
                </q-badge>
              </template>
              <template v-else>
                {{ col.value }}
              </template>
            </q-td>
            <q-td v-if="isLeader" auto-width class="text-right">
              <q-btn flat dense round size="sm" icon="close" color="grey-8"
                :title="$t('ProjectDashboard.removeFromPriorityList')" @click.stop="remove(props.row)" />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <RequestAccessDialog :id="requestProjectId" tab="projectIdeas" type="view" :dialogState="requestDialog"
      @update="(requestDialog = $event), (requestProjectId = null)" />
  </q-expansion-item>
</template>

<script>
import { dateFormatter } from "src/boot/dateFormatter";
import RequestAccessDialog from "components/data/RequestAccessDialog.vue";
import projectStatusLabels from "src/mixins/projectStatusLabels";

export default {
  name: "PriorityTable",
  mixins: [projectStatusLabels],
  components: {
    RequestAccessDialog,
  },
  data() {
    return {
      expanded: true,
      loading: false,
      selectedMunicipality: null,
      localList: [],
      requestDialog: false,
      requestProjectId: null,
      dragRow: null,
      pagination: {
        sortBy: null,
        descending: false,
        page: 1,
        rowsPerPage: 0,
      },
    };
  },
  computed: {
    isAdmin() {
      return this.$store.getters["userCenter/isAdmin"];
    },
    isLeader() {
      return this.$store.getters["userCenter/isLeader"];
    },
    isSorted() {
      return !!this.pagination.sortBy;
    },
    columns() {
      const cols = [
        {
          name: "title",
          required: true,
          label: this.$t("ProjectDashboard.title"),
          align: "left",
          field: (row) => row.project.title,
          sortable: true,
        },
        {
          name: "updatedAt",
          align: "center",
          label: this.$t("Speicherdatum"),
          field: (row) => row.project.updatedAt,
          sortable: true,
          format: (val) => (val ? this.formatDate(val) : ""),
        },
        {
          name: "applicationProcess",
          align: "left",
          label: this.$t("ProjectDashboard.applicationProcess"),
          field: (row) => this.getLastCompletedStep(row.project.applicationProcessSteps),
          sortable: true,
        },
        {
          name: "status",
          align: "left",
          label: this.$t("ProjectDashboard.status"),
          field: (row) => this.getStatusText(row.project.status),
          sortable: true,
        },
      ];
      if (this.isAdmin) {
        cols.push({
          name: "prioritizedBy",
          align: "left",
          label: this.$t("ProjectDashboard.prioritizedBy"),
          field: (row) => this.prioritizedByName(row),
          sortable: true,
        });
      }
      return cols;
    },
    prioritizedProjects() {
      return this.$store.state.project.prioritizedProjects;
    },
    municipalityOptions() {
      return this.$store.state.municipality.municipalitiesSimplified;
    },
    showSection() {
      if (this.isAdmin || this.isLeader) return true;
      return this.prioritizedProjects.length > 0;
    },
    loggedInUser() {
      return (
        !!this.$store.state.userCenter.user &&
        this.$store.state.userCenter.user.user
      );
    },
  },
  watch: {
    prioritizedProjects: {
      immediate: true,
      handler(val) {
        this.localList = [...(val || [])];
      },
    },
  },
  methods: {
    prioritizedByName(row) {
      return row.prioritizedBy?.user_detail?.fullName || row.prioritizedBy?.username || "";
    },
    async fetchList() {
      this.loading = true;
      const municipalityId = this.isAdmin ? this.selectedMunicipality?.id : undefined;
      if (this.isAdmin && !municipalityId) {
        this.loading = false;
        return;
      }
      await this.$store.dispatch("project/getPrioritizedProjects", { municipalityId });
      this.loading = false;
    },
    onMunicipalityChange() {
      this.fetchList();
    },
    async remove(row) {
      await this.$store.dispatch("project/removeFromPriorityList", { id: row.id });
      this.$emit("removed");
    },
    async persistOrder() {
      const order = this.localList.map((row) => row.id);
      await this.$store.dispatch("project/reorderPriorityList", { order });
    },
    onRowDragStart(row) {
      this.dragRow = row;
    },
    onRowDrop(targetRow) {
      if (!this.dragRow || this.dragRow.id === targetRow.id) return;
      const from = this.localList.findIndex((row) => row.id === this.dragRow.id);
      const to = this.localList.findIndex((row) => row.id === targetRow.id);
      const list = [...this.localList];
      const [moved] = list.splice(from, 1);
      list.splice(to, 0, moved);
      this.localList = list;
      this.dragRow = null;
      this.persistOrder();
    },
    formatDate(val) {
      return dateFormatter(val);
    },
    async view(project) {
      const id = project && project.id;
      if (!id) return;

      try {
        const validationResult = await this.$store.dispatch("project/validateApplicationAccess", id);

        if (validationResult.financialPlan) {
          this.$store.commit("project/setFinancialPlan", validationResult.financialPlan);
        }

        if (validationResult.accessGranted) {
          this.$router.push({ path: `/application/process/view/${id}` });
        } else {
          this.requestProjectId = id;
          this.requestDialog = true;
        }
      } catch (error) {
        console.error("Error in view function:", error);
        // API call failed - fall back to a best-effort client-side check using data
        // already on hand. Defaults to requiring access approval (fail closed) unless
        // the user is clearly the owner, an admin, or the project is open to all users.
        const isOwner = !!project.owner && !!this.loggedInUser && project.owner.id === this.loggedInUser.id;
        if (this.isAdmin || isOwner || project.visibility === "all users") {
          this.$router.push({ path: `/application/process/view/${id}` });
          return;
        }
        if (project.visibility === "listed only") {
          const hasReaderAccess =
            !!project.readers &&
            project.readers.some((user) => !!this.loggedInUser && user.id === this.loggedInUser.id);
          const hasEditorAccess =
            !!project.editors &&
            project.editors.some((user) => !!this.loggedInUser && user.id === this.loggedInUser.id);
          if (hasReaderAccess || hasEditorAccess) {
            this.$router.push({ path: `/application/process/view/${id}` });
            return;
          }
        }
        this.requestProjectId = id;
        this.requestDialog = true;
      }
    },
  },
  mounted() {
    if (this.isAdmin) {
      this.$store.dispatch("municipality/getSimplifiedMunicipalities");
    } else {
      this.fetchList();
    }
  },
};
</script>

<style lang="scss" scoped>
.priority-selector-border {
  border-bottom: 1px solid rgba(18, 54, 115, 0.1);
}

.priority-row:hover {
  background: $grey-1;
}

.priority-col-handle {
  width: 32px;
}

.text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
