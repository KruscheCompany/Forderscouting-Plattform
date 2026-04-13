<template>
  <q-card class="col-12 shadow-1 radius-20 q-mb-none q-pa-none">
    <q-card-section class="row q-pa-md q-col-gutter-sm">
      <div class="col-12 q-my-md">
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
      </div>

    </q-card-section>
  </q-card>
</template>

<script>
import { dateFormatter } from "src/boot/dateFormatter";

export default {
  name: "ProjectHeader",
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
    }
  },

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
