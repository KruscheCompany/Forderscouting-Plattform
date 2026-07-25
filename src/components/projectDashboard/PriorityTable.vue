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

    <div class="q-pa-md">
      <q-select v-if="isAdmin" clearable class="no-shadow q-mb-md input-radius-4" style="max-width: 320px"
        color="primary" bg-color="white" :label="$t('ProjectDashboard.municipalities')" filled
        :options="municipalityOptions" v-model="selectedMunicipality" option-value="id" option-label="title"
        @input="onMunicipalityChange" />

      <div v-if="isAdmin && !selectedMunicipality" class="text-black">
        {{ $t("ProjectDashboard.selectMunicipalityPrompt") }}
      </div>

      <div v-else-if="!loading && prioritizedProjects.length === 0" class="text-black">
        {{ $t("ProjectDashboard.noPrioritizedProjects") }}
      </div>

      <draggable v-else v-model="localList" tag="div" handle=".drag-handle" :disabled="!isLeader"
        @end="onDragEnd">
        <div v-for="row in localList" :key="row.id" class="row items-center q-py-sm q-px-sm priority-row">
          <q-icon v-if="isLeader" name="mdi-drag" class="drag-handle cursor-pointer q-mr-sm" size="sm" />
          <div class="col">
            <span class="font-14">{{ row.project.title }}</span>
            <div v-if="isAdmin && row.prioritizedBy" class="font-14 text-blue-grey-7">
              {{ $t("ProjectDashboard.prioritizedBy") }}: {{ prioritizedByName(row) }}
            </div>
          </div>
          <q-btn v-if="isLeader" flat dense round size="sm" icon="close" color="grey-8"
            :title="$t('ProjectDashboard.removeFromPriorityList')" @click="remove(row)" />
        </div>
      </draggable>
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
.priority-row {
  border-bottom: 1px solid $grey-3;

  &:last-child {
    border-bottom: none;
  }
}
</style>
