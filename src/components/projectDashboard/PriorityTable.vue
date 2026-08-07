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

      <template v-else>
        <div class="row items-center priority-table-header font-14 text-black q-px-md q-py-sm">
          <div v-if="isLeader" class="priority-col-handle"></div>
          <div class="col">{{ $t("ProjectDashboard.title") }}</div>
          <div v-if="isAdmin" class="priority-col-by">{{ $t("ProjectDashboard.prioritizedBy") }}</div>
          <div v-if="isLeader" class="priority-col-actions"></div>
        </div>

        <draggable v-model="localList" tag="div" handle=".drag-handle" :disabled="!isLeader" @end="onDragEnd">
          <div v-for="row in localList" :key="row.id" class="row items-center q-px-md q-py-sm priority-row">
            <div v-if="isLeader" class="priority-col-handle">
              <q-icon name="mdi-drag" class="drag-handle cursor-pointer" size="sm" />
            </div>
            <div class="col font-14 text-overflow">{{ row.project.title }}</div>
            <div v-if="isAdmin" class="priority-col-by font-14 text-blue-grey-7 text-overflow">
              {{ prioritizedByName(row) }}
            </div>
            <div v-if="isLeader" class="priority-col-actions text-right">
              <q-btn flat dense round size="sm" icon="close" color="grey-8"
                :title="$t('ProjectDashboard.removeFromPriorityList')" @click="remove(row)" />
            </div>
          </div>
        </draggable>
      </template>
    </div>
  </q-expansion-item>
</template>

<script>
import draggable from "vuedraggable";

export default {
  name: "PriorityTable",
  components: {
    draggable,
  },
  data() {
    return {
      expanded: true,
      loading: false,
      selectedMunicipality: null,
      localList: [],
    };
  },
  computed: {
    isAdmin() {
      return this.$store.getters["userCenter/isAdmin"];
    },
    isLeader() {
      return this.$store.getters["userCenter/isLeader"];
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
    async onDragEnd() {
      const order = this.localList.map((row) => row.id);
      await this.$store.dispatch("project/reorderPriorityList", { order });
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

.priority-table-header {
  background: white;
  border-bottom: 1px solid rgba(18, 54, 115, 0.5);
}

.priority-row {
  border-bottom: 1px solid rgba(18, 54, 115, 0.1);

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: $grey-1;
  }
}

.priority-col-handle {
  width: 32px;
}

.priority-col-by {
  width: 220px;
}

.priority-col-actions {
  width: 48px;
}

.text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
