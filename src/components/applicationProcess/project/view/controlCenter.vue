<template>
  <div class="col-12">
          <div class="row">
            <q-card class="col-12 shadow-1 radius-20 q-mb-none q-pa-none">
              <q-card-section
                class="row items-center justify-between q-pa-md q-col-gutter-sm"
              >
                <div class="col-12 col-md-auto">
                  <div class="row q-col-gutter-y-sm q-col-gutter-x-xl">
                    <div class="col-auto">
                      <p class="font-14 no-margin text-blue-grey-10">
                        Erstelldatum
                      </p>
                      <p class="font-16 q-mt-xs q-mb-none text-weight-600 ">
                        {{
                          (!!project.createdAt &&
                            dateFormatter(project.createdAt)) ||
                            ""
                        }}
                      </p>
                    </div>
                    <div class="col-auto">
                      <p class="font-14 no-margin text-blue-grey-10">{{ $t("Owner") }}</p>
                      <p class="font-16 q-mt-xs q-mb-none text-weight-600 ">
                        {{ (!!project.owner && project.owner.username) || "" }}
                      </p>
                    </div>
                    <div class="col-auto">
                      <p class="font-14 no-margin text-blue-grey-10">{{ $t("projectContent.type") }}</p>
                      <p class="font-16 q-mt-xs q-mb-none text-weight-600 ">
                        {{ $t("dashboard.projectIdeaBtn") }}
                      </p>
                    </div>
                    <div class="col-auto">
                      <p class="font-14 no-margin text-blue-grey-10">{{ $t("projectContent.visibility") }}</p>
                      <p class="font-16 q-mt-xs q-mb-none text-weight-600 ">
                        {{
                          project.visibility === "only for me"
                            ? $t("visibility.onlyMe")
                            : project.visibility === "all users"
                            ? $t("visibility.allUsers")
                            : project.visibility === "listed only"
                            ? $t("visibility.listedOnly")
                            : ""
                        }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-auto">
                  <div
                    :class="
                      $q.screen.gt.sm
                        ? 'q-col-gutter-x-md'
                        : 'q-col-gutter-x-md q-mt-md'
                    "
                    class="row"
                  >
                    <div class="col-auto q-mb-sm">
                      <q-btn
                        v-if="!!project && !!project.id && (project.owner.id === loggedInUser.id || isAdmin)"
                        @click="transferDocument()"
                        color="blue"
                        unelevated
                        class="radius-6 text-weight-600"
                        no-caps
                        outline
                        icon="send"
                        aria-label="Transfer Ownership"
                        ><q-tooltip
                          anchor="top middle"
                          self="bottom middle"
                          :offset="[10, 10]"
                        >
                          {{ $t("transferOwnership") }}
                        </q-tooltip></q-btn
                      >
                    </div>
                    <div class="col-auto q-mb-md">
                      <q-btn
                        @click="exportToPdf()"
                        color="blue"
                        unelevated
                        class="radius-6 text-weight-600"
                        no-caps
                        outline
                        icon="print"
                        aria-label="Print"
                        :loading="watchlistIsLoading"
                        ><q-tooltip
                          anchor="top middle"
                          self="bottom middle"
                          :offset="[10, 10]"
                        >
                          {{ $t("print") }}
                        </q-tooltip></q-btn
                      >
                    </div>
                    <div class="col-auto q-mb-md">
                      <q-btn
                        @click="addToWatchlist()"
                        color="blue"
                        unelevated
                        class="radius-6 text-weight-600"
                        no-caps
                        outline
                        icon="star_outline"
                        aria-label="Bookmark"
                        :loading="watchlistIsLoading"
                        ><q-tooltip
                          anchor="top middle"
                          self="bottom middle"
                          :offset="[10, 10]"
                        >
                          {{ $t("bookmark") }}
                        </q-tooltip></q-btn
                      >
                    </div>
                    <!-- Redirect to checklist creation page -->
                    <div
                      v-if="
                        isAdmin ||
                          (!!project && !!project.owner && project.owner.id) ===
                            (!!loggedInUser && loggedInUser.id)
                      "
                      class="col-auto q-mb-md"
                    >
                      <q-btn
                        @click="createChecklist()"
                        color="blue"
                        unelevated
                        class="radius-6 text-weight-600"
                        no-caps
                        icon="list"
                        aria-label="Create Checklist"
                        :loading="archiveIsLoading"
                      >
                        <q-tooltip
                          anchor="top middle"
                          self="bottom middle"
                          :offset="[10, 10]"
                        >
                          {{
                            $t("checkListCols.createImplementationChecklist")
                          }}
                        </q-tooltip></q-btn
                      >
                    </div>
                    <div class="col-auto q-mb-md">
                      <q-btn
                        @click="editProject()"
                        color="blue"
                        unelevated
                        class="radius-6 text-weight-600"
                        no-caps
                        icon="edit"
                        aria-label="Edit"
                        :loading="editIsLoading"
                      >
                        <q-tooltip
                          anchor="top middle"
                          self="bottom middle"
                          :offset="[10, 10]"
                        >
                          {{ $t("edit") }}
                        </q-tooltip></q-btn
                      >
                    </div>
                    <div class="col-auto q-mb-md">
                      <q-btn
                        @click="duplicateProject()"
                        color="blue"
                        unelevated
                        class="radius-6 text-weight-600"
                        no-caps
                        icon="content_copy"
                        aria-label="Duplicate"
                        :loading="duplicateIsLoading"
                        ><q-tooltip
                          anchor="top middle"
                          self="bottom middle"
                          :offset="[10, 10]"
                        >
                          {{ $t("duplicate") }}
                        </q-tooltip></q-btn
                      >
                    </div>
                    <div
                      v-if="
                        isAdmin ||
                          (!!project && !!project.owner && project.owner.id) ===
                            (!!loggedInUser && loggedInUser.id)
                      "
                      class="col-auto q-mb-md"
                    >
                      <q-btn
                        @click="archiveProject()"
                        color="blue"
                        unelevated
                        class="radius-6 text-weight-600"
                        no-caps
                        icon="inventory"
                        aria-label="Archive"
                        :loading="archiveIsLoading"
                      >
                        <q-tooltip
                          anchor="top middle"
                          self="bottom middle"
                          :offset="[10, 10]"
                        >
                          {{ $t("archive") }}
                        </q-tooltip></q-btn
                      >
                    </div>
                    <div v-if="isAdmin" class="col-auto q-mb-md">
                      <q-btn
                        @click="deleteProject()"
                        color="red"
                        unelevated
                        class="radius-6 text-weight-600"
                        no-caps
                        icon="delete"
                        aria-label="Delete"
                        :loading="deleteIsLoading"
                      >
                        <q-tooltip
                          anchor="top middle"
                          self="bottom middle"
                          :offset="[10, 10]"
                        >
                          {{ $t("delete") }}
                        </q-tooltip></q-btn
                      >
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
</template>

<script>
  export default {
    
  }
</script>

<style lang="scss" scoped>

</style>