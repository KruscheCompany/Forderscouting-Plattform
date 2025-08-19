<template>
  <q-card class="col-12 shadow-1 radius-20 q-mb-none q-pa-none">
    <q-card-section class="row items-center justify-between q-pa-md q-col-gutter-sm">
      <div class="col-12 col-md-auto">
        <div class="row q-col-gutter-y-sm q-col-gutter-x-xl">
          <div class="col-auto">
            <h4 class="font-24 text-weight-bold q-mb-none q-mt-sm">
              {{ project.title || $t("Projekttitel") }}
            </h4>
          </div>
          <div class="col-auto">
            <p class="font-14 no-margin text-blue-grey-10">
              {{ $t("Speicherdatum") }}
            </p>
            <p class="font-16 q-mt-xs q-mb-none text-weight-600">
              {{ formatUpdatedDate }}
            </p>
          </div>

          <div class="col-auto">
            <p class="font-14 no-margin text-blue-grey-10">
              {{ $t("Erstelldatum") }}
            </p>
            <p class="font-16 q-mt-xs q-mb-none text-weight-600">
              {{ formatCreatedDate }}
            </p>
          </div>

          <div class="col-auto">
            <p class="font-14 no-margin text-blue-grey-10">{{ $t("Owner") }}</p>
            <p class="font-16 q-mt-xs q-mb-none text-weight-600">
              {{ ownerName }}
            </p>
          </div>

          <div class="col-auto">
            <p class="font-14 no-margin text-blue-grey-10">{{ $t("projectContent.visibility") }}</p>
            <p class="font-16 q-mt-xs q-mb-none text-weight-600">
              {{ visibilityText }}
            </p>
          </div>
        </div>

        <ProjectActionButtons :project="project" :logged-in-user="loggedInUser" :is-admin="isAdmin"
          :loading-states="loadingStates" @transfer-document="$emit('transfer-document')"
          @export-to-pdf="$emit('export-to-pdf')" @add-to-watchlist="$emit('add-to-watchlist')"
          @edit-project="$emit('edit-project')" @duplicate-project="$emit('duplicate-project')"
          @archive-project="$emit('archive-project')" @delete-project="$emit('delete-project')" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { dateFormatter } from "src/boot/dateFormatter";
import ProjectActionButtons from "./ProjectActionButtons.vue";

export default {
  name: "ProjectHeader",
  components: {
    ProjectActionButtons
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    loggedInUser: {
      type: Object,
      default: () => ({})
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    loadingStates: {
      type: Object,
      default: () => ({})
    }
  },
  emits: [
    'transfer-document',
    'export-to-pdf',
    'add-to-watchlist',
    'edit-project',
    'duplicate-project',
    'archive-project',
    'delete-project'
  ],
  computed: {
    formatCreatedDate() {
      return (this.project.createdAt && dateFormatter(this.project.createdAt)) || "";
    },
    formatUpdatedDate() {
      return (this.project.updatedAt && dateFormatter(this.project.updatedAt)) || "";
    },
    ownerName() {
      return (this.project.owner && this.project.owner.username) || "";
    },
    visibilityText() {
      const visibility = this.project.visibility;
      if (visibility === "only for me") {
        return this.$t("visibility.onlyMe");
      } else if (visibility === "all users") {
        return this.$t("visibility.allUsers");
      } else if (visibility === "listed only") {
        return this.$t("visibility.listedOnly");
      }
      return "";
    }
  }
};
</script>
