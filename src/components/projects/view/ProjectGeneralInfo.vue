<template>
  <div class="row justify-between">
    <q-expansion-item class="shadow-1 overflow-hidden radius-20 col-12 q-mt-md" :label="$t(
      'projectContent.generalInformation')" header-class="bg-white text-black" v-model="expanded">
      <div class="row">
        <q-card class="shadow-0 radius-bottom-20 q-pa-none col-12">

          <q-card-section class="q-pt-none">
            <div class="row q-col-gutter-md">

              <div class="col-4 col-md-4">

                <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                  {{ $t("projectContent.contactPerson") }}
                </h4>
                <div class="font-16">
                  <p class="q-mb-sm">
                    {{ contactPersonName }}
                  </p>
                </div>

                <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                  {{ $t("projectContent.contactDetails") }}
                </h4>
                <div class="font-16">
                  <p class="q-mb-sm">
                    {{ streetAddress }} / {{ postalCode }} / {{ phone }} / {{ email }}
                  </p>
                </div>

                <div v-if="hasEditors">
                  <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                    {{ $t("projectContent.inviteEditors") }}
                  </h4>
                  <div class="font-16">
                    <div v-if="editors.length > 0">
                      <p v-for="(editor, index) in editors" :key="index" class="q-mb-sm">
                        {{ editor.username }}
                      </p>
                    </div>
                    <div v-else>
                      <p class="q-mb-sm">{{ $t("projectContent.noEditorsInvited") }}</p>
                    </div>
                  </div>
                </div>

              </div>

              <div class="col-4 col-md-4">

                <div v-if="location">
                  <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                    {{ $t("projectContent.locationOfProject") }}
                  </h4>
                  <div class="font-16">
                    <p class="q-mb-sm">
                      {{ location }}
                    </p>
                  </div>
                </div>

                <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                  {{ $t("projectContent.CooperationPartner") }}
                </h4>
                <div class="font-16">
                  <p class="q-mb-sm">
                    {{ partner }}
                  </p>
                </div>

                <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                  {{ $t("projectContent.investive/non-investive") }}
                </h4>
                <div class="font-16">
                  <p class="q-mb-sm">
                    {{ investiveText }}
                  </p>
                </div>

                <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                  {{ $t("projectContent.visibility") }}
                </h4>
                <div class="font-16">
                  <p class="q-mb-sm">
                    {{ visibilityText }}
                  </p>
                </div>

              </div>

              <div class="col-4">
                <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                  {{ $t("projectContent.categories") }} & {{ $t("projectContent.tags") }}
                </h4>
                <div class="font-16">
                  <div v-if="hasCategories">
                    <q-chip v-for="(category, index) in categories" :key="index" square size="16px" color="yellow-10"
                      text-color="blue">
                      {{ category.title }}
                    </q-chip>
                    <div v-if="hasTags">
                      <q-chip v-for="(tag, index) in tags" :key="index" square size="16px" color="yellow-10"
                        text-color="blue">
                        {{ tag.title }}
                      </q-chip>
                    </div>
                  </div>
                  <div v-else>
                    {{ $t("projectContent.noCategoriesSet") || "No categories set" }}
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>

        </q-card>
      </div>
    </q-expansion-item>
  </div>
</template>

<script>
export default {
  name: "ProjectContactInfo",
  data() {
    return {
      expanded: this.currentTab === "project"
    };
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    currentTab: {
      type: String,
      default: null,
      required: true
    }
  },
  computed: {
    contactPersonName() {
      return (
        (this.project.info && this.project.info.contactName) ||
        (this.project.owner && this.project.owner.username) ||
        ""
      );
    },
    streetAddress() {
      return (this.project.info && this.project.info.streetNo) || "";
    },
    postalCode() {
      return (this.project.info && this.project.info.postalCode) || "";
    },
    phone() {
      return (this.project.info && this.project.info.phone) || "";
    },
    email() {
      return (this.project.info && this.project.info.email) || "";
    },
    location() {
      return (this.project.info && this.project.info.location) || "";
    },
    editors() {
      return this.project.editors || [];
    },
    hasEditors() {
      return this.editors.length > 0;
    },
    categories() {
      return this.project.categories || [];
    },
    tags() {
      return this.project.tags || [];
    },
    hasCategories() {
      return this.categories.length > 0;
    },
    hasTags() {
      return this.tags.length > 0;
    },
    partner() {
      return (
        (this.project.details && this.project.details.partner) ||
        ""
      );
    },
    investiveText() {
      if (this.project.details) {
        if (this.project.details.investive === true) {
          return this.$t("Investive");
        } else if (this.project.details.investive === false) {
          return this.$t("Non-Investive");
        }
      }
      return "";
    },
    visibilityText() {
      if (this.project.visibility === "only for me") {
        return this.$t("visibility.onlyMe");
      } else if (this.project.visibility === "all users") {
        return this.$t("visibility.allUsers");
      } else if (this.project.visibility === "listed only") {
        return this.$t("visibility.listedOnly");
      }
      return "";
    },
  },
  watch: {
    currentTab(newTab) {
      this.expanded = newTab === "project";
    },
  },
};
</script>
