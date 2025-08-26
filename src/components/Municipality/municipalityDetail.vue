<template>
  <div class="q-my-lg" :class="$q.screen.gt.sm ? 'q-mx-xl' : 'q-mx-sm'">
    <div class="row q-col-gutter-md">
      <!-- <div class="col-12 col-md-auto"> -->
      <!-- <q-card class="left-card radius-20 flex flex-center"> -->
      <!-- <q-card-section> -->
      <!-- TODO make this q-img -->
      <!-- <img class="logo" al src="../../assets/Wappen.png" /> -->
      <!-- </q-card-section> -->
      <!-- </q-card> -->
      <!-- </div> -->
      <div class="col-12 col-md-grow">
        <q-card class="radius-20 bg-blue-1 right-card">
          <q-card-section>
            <h6 class="q-mt-none q-mb-sm">
              {{ !!municipality && municipality.title }}
            </h6>
            <div class="row">
              <p class="label">{{ $t("DetailsAdministration.location") }}:</p>
              <p class="q-ml-lg">
                {{ !!municipality && municipality.location }}
              </p>
            </div>
            <div class="row">
              <div class="col row">
                <p class="label">{{ $t("DetailsAdministration.users") }}</p>
                <div v-if="
                  !!municipality.users &&
                  municipality.users.split(', ').length > 0
                " class="q-ml-xl">
                  <p v-for="(user, index) in municipality.users.split(', ')" :key="index" class="q-mb-xs">
                    {{ user }}
                  </p>
                </div>
                <div v-else class="q-ml-xl">
                  <p>
                    {{ $t("noUsers") }}
                  </p>
                </div>
              </div>
              <div class="col">
                <div class="row justify-end">
                  <p class="label">{{ $t("DetailsAdministration.guests") }}</p>
                  <div v-if="
                    !!municipality.guests &&
                    municipality.guests.split(', ').length > 0
                  " class="q-ml-xl">
                    <p v-for="(guest, index) in municipality.guests.split(', ')" :key="index" class="q-mb-xs">
                      {{ guest }}
                    </p>
                  </div>
                  <div v-else class="q-ml-xl">
                    <p>
                      {{ $t("noGuests") }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <q-btn v-if="isAdmin" class="more" size="md" color="primary" round flat dense icon="more_vert"
              aria-label="Optionen">
              <q-menu transition-show="jump-down" transition-hide="jump-up">
                <q-list style="min-width: 140px">
                  <q-item clickable v-close-popup @click="editMunicipality">
                    <q-item-section><span class="text-right font-14">
                        {{ $t("DetailsAdministration.edit") }}
                        <q-icon size="sm" class="text-blue" name="edit" /> </span></q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup @click="deleteMunicipality">
                    <q-item-section><span class="text-right text-red font-14">
                        {{ $t("DetailsAdministration.delete") }}
                        <q-icon size="sm" class="text-red" name="delete" /> </span></q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <q-table class="radius-20 shadow-1 q-mt-md pagination-no-shadow" :title="$t('DetailsAdministration.data')"
      :data="!!municipality && municipality.data" :columns="columns" row-key="name" :visible-columns="visibleColumns"
      :pagination="{
        sortBy: 'id',
        descending: true,
        page: 1,
        rowsPerPage: 10,
      }" :rows-per-page-label="$t('Records per page')" :no-data-label="$t('No data')"
      :no-results-label="$t('No results')">
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
                        {{ $t("DetailsAdministration.view") }}
                        <q-icon size="sm" class="text-blue" name="visibility" /> </span></q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup @click="editItem(props.row)">
                    <q-item-section><span class="text-right font-14">
                        {{ $t("DetailsAdministration.edit") }}

                        <q-icon size="sm" class="text-blue" name="edit" /> </span></q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="addToWatchlist(props.row)">
                    <q-item-section><span class="text-right font-14">
                        {{ $t("DetailsAdministration.bookmark") }}

                        <q-icon size="sm" class="text-blue" name="star" /> </span></q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="archiveItem(props.row)" v-if="
                    isAdmin ||
                    (props.row &&
                      props.row.type !== 'funding' &&
                      (!!props.row.owner && props.row.owner.id) ===
                      (!!loggedInUser && loggedInUser.id))
                  ">
                    <q-item-section><span class="text-right font-14">
                        {{ $t("DetailsAdministration.archive") }}
                        <q-icon size="sm" class="text-blue" name="archive" /> </span></q-item-section>
                  </q-item>

                  <q-item v-if="isAdmin" clickable v-close-popup @click="deleteItem(props.row)">
                    <q-item-section><span class="text-right font-14 text-red">
                        {{ $t("DetailsAdministration.delete") }}
                        <q-icon size="sm" name="delete" /> </span></q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <MunicipalityDeleteDialog :dialogState="deleteMunicipalityDialog" :id="municipalityId" @update="
      (deleteMunicipalityDialog = $event),
      (municipalityId = null),
      getMunicipalityData()
      " />
    <EditMunicipalityDialog :dialogState="editMunicipalityDialog" :editingId="municipalityId" @update="
      (editMunicipalityDialog = $event),
      (municipalityId = null),
      getMunicipalityData()
      " />
    <DeleteDialog :id="itemId" :tab="tab" :dialogState="deleteDialog"
      @update="closeDialog($event), (itemId = null), (tab = null)" />
    <RequestAccessDialog :id="itemId" :tab="tab" :type="itemType" :dialogState="requestDialog"
      @update="(requestDialog = $event), (itemId = null), (itemType = null)" />
  </div>
</template>

<script>
import MunicipalityDeleteDialog from "components/Municipality/DeleteDialog.vue";
import EditMunicipalityDialog from "components/Municipality/CreateDialog.vue";
import DeleteDialog from "components/data/DeleteDialog.vue";
import RequestAccessDialog from "components/data/RequestAccessDialog.vue";

export default {
  data() {
    return {
      visibleColumns: ["title", "type", "categories", "users"],
      deleteMunicipalityDialog: false,
      editMunicipalityDialog: false,
      deleteDialog: false,
      requestDialog: false,
      municipalityId: null,
      itemId: null,
      tab: null,
      itemType: null,
      municipality: {},
    };
  },
  components: {
    MunicipalityDeleteDialog,
    EditMunicipalityDialog,
    DeleteDialog,
    RequestAccessDialog,
  },
  methods: {
    getMunicipalityData() {
      const { id } = this.$route.params;
      if (id) {
        const municipality = this.$store.state.municipality.municipalities.find(
          (mun) => {
            return mun.id == id;
          }
        );
        if (!!municipality) {
          this.municipality = municipality;
        } else {
          this.$router.push("/Administation/Areas");
        }
        this.municipality = municipality;
      } else {
        this.$router.push("/Administation/Areas");
      }
    },
    async view(row) {
      console.log("row", row);
      const id = row && row.id;
      this.itemId = row && row.id;
      this.viewIsLoading = true;
      if (row.type === "project") {
        this.tab = "projectIdeas";
        if (
          row.visibility === "listed only" &&
          (!!row.owner && row.owner.id) !==
          (!!this.loggedInUser && this.loggedInUser.id) &&
          !this.isAdmin
        ) {
          const hasReaderAccess =
            !!row.readers &&
            row.readers.filter(
              (user) =>
                user.id === (!!this.loggedInUser && this.loggedInUser.id)
            );
          const hasEditorAccess =
            !!row.editors &&
            row.editors.filter(
              (user) =>
                user.id === (!!this.loggedInUser && this.loggedInUser.id)
            );
          if (hasReaderAccess.length > 0 || hasEditorAccess.length > 0) {
            this.$router.push({ path: `/application/process/view/${id}` });
          } else {
            this.itemId = row && row.id;
            this.itemType = "view";
            this.requestDialog = true;
          }
        } else {
          this.$router.push({ path: `/application/process/view/${id}` });
        }
      } else if (row.type === "funding") {
        this.tab = "fundings";
        if (
          row.visibility === "listed only" &&
          (!!row.owner && row.owner.id) !==
          (!!this.loggedInUser && this.loggedInUser.id) &&
          !this.isAdmin
        ) {
          const hasReaderAccess =
            !!row.readers &&
            row.readers.filter(
              (user) =>
                user.id === (!!this.loggedInUser && this.loggedInUser.id)
            );
          const hasEditorAccess =
            !!row.editors &&
            row.editors.filter(
              (user) =>
                user.id === (!!this.loggedInUser && this.loggedInUser.id)
            );
          if (hasReaderAccess.length > 0 || hasEditorAccess.length > 0) {
            this.$router.push({ path: `/user/newFunding/${id}` });
          } else {
            this.itemId = row && row.id;
            this.itemType = "view";
            this.requestDialog = true;
          }
        } else {
          this.$router.push({ path: `/user/newFunding/${id}` });
        }
      } else {
        this.tab = "implementationChecklist";
        if (
          row.visibility === "listed only" &&
          (!!row.owner && row.owner.id) !==
          (!!this.loggedInUser && this.loggedInUser.id) &&
          !this.isAdmin
        ) {
          const hasReaderAccess =
            !!row.readers &&
            row.readers.filter(
              (user) =>
                user.id === (!!this.loggedInUser && this.loggedInUser.id)
            );
          const hasEditorAccess =
            !!row.editors &&
            row.editors.filter(
              (user) =>
                user.id === (!!this.loggedInUser && this.loggedInUser.id)
            );
          if (hasReaderAccess.length > 0 || hasEditorAccess.length > 0) {
            this.$router.push({ path: `/user/newChecklist/${id}` });
          } else {
            this.itemId = row && row.id;
            this.itemType = "view";
            this.requestDialog = true;
          }
        } else {
          this.$router.push({ path: `/user/newChecklist/${id}` });
        }
      }
      this.viewIsLoading = false;
    },
    async editItem(row) {
      console.log("row", row);
      const id = row && row.id;
      this.itemId = row && row.id;
      this.editIsLoading = true;
      if (row.type === "project") {
        this.tab = "projectIdeas";
        if (
          (!!row.owner && row.owner.id) !==
          (!!this.loggedInUser && this.loggedInUser.id) &&
          !this.isAdmin
        ) {
          const hasEditorAccess =
            !!row.editors &&
            row.editors.filter(
              (user) =>
                user.id === (!!this.loggedInUser && this.loggedInUser.id)
            );
          if (hasEditorAccess.length > 0) {
            this.$router.push({ path: `/application/process/edit/${id}` });
          } else {
            this.itemId = row && row.id;
            this.itemType = "edit";
            this.requestDialog = true;
          }
        } else {
          this.$router.push({ path: `/application/process/edit/${id}` });
        }
      } else if (row.type === "funding") {
        this.tab = "fundings";
        if (
          (!!row.owner && row.owner.id) !==
          (!!this.loggedInUser && this.loggedInUser.id) &&
          !this.isAdmin
        ) {
          const hasEditorAccess =
            !!row.editors &&
            row.editors.filter(
              (user) =>
                user.id === (!!this.loggedInUser && this.loggedInUser.id)
            );
          if (hasEditorAccess.length > 0) {
            this.$router.push({ path: `/user/newFunding/edit/${id}` });
          } else {
            this.itemId = row && row.id;
            this.itemType = "edit";
            this.requestDialog = true;
          }
        } else {
          this.$router.push({ path: `/user/newFunding/edit/${id}` });
        }
      } else {
        this.tab = "implementationChecklist";
        if (
          (!!row.owner && row.owner.id) !==
          (!!this.loggedInUser && this.loggedInUser.id) &&
          !this.isAdmin
        ) {
          const hasEditorAccess =
            !!row.editors &&
            row.editors.filter(
              (user) =>
                user.id === (!!this.loggedInUser && this.loggedInUser.id)
            );
          if (hasEditorAccess.length > 0) {
            this.$router.push({ path: `/user/newChecklist/edit/${id}` });
          } else {
            this.itemId = row && row.id;
            this.itemType = "edit";
            this.requestDialog = true;
          }
        } else {
          this.$router.push({ path: `/user/newChecklist/edit/${id}` });
        }
      }
      this.editIsLoading = false;
    },
    async archiveItem(row) {
      if (row.type === "project") {
        this.archiveIsLoading = true;
        const id = row && row.id;
        await this.$store.dispatch("project/archiveProjectIdea", {
          id: id,
        });
        this.archiveIsLoading = false;
        this.getData();
      } else if (row.type === "funding") {
        this.archiveIsLoading = true;
        const id = row && row.id;
        await this.$store.dispatch("funding/archiveFunding", {
          id: id,
        });
        this.archiveIsLoading = false;
        this.getData();
      } else {
        this.archiveIsLoading = true;
        const id = row && row.id;
        await this.$store.dispatch("implementationChecklist/archiveChecklist", {
          id: id,
        });
        this.archiveIsLoading = false;
        this.getData();
      }
    },
    async addToWatchlist(row) {
      if (row.type === "project") {
        this.watchlistIsLoading = true;
        const id = row && row.id;
        await this.$store.dispatch("project/addToWatchlist", {
          id: id,
        });
        this.watchlistIsLoading = false;
        this.getData();
      } else if (row.type === "funding") {
        this.watchlistIsLoading = true;
        const id = row && row.id;
        await this.$store.dispatch("funding/addToWatchlist", {
          id: id,
        });
        this.watchlistIsLoading = false;
        this.getData();
      } else {
        this.watchlistIsLoading = true;
        const id = row && row.id;
        await this.$store.dispatch("implementationChecklist/addToWatchlist", {
          id: id,
        });
        this.watchlistIsLoading = false;
        this.getData();
      }
    },
    async deleteItem(row) {
      if (row.type === "project") {
        this.tab = "projectIdeas";
        this.itemId = row && row.id;
      } else if (row.type === "funding") {
        this.tab = "fundings";
        this.itemId = row && row.id;
      } else {
        this.tab = "implementationChecklist";
        this.itemId = row && row.id;
      }
      this.deleteDialog = true;
    },
    deleteMunicipality() {
      this.municipalityId = !!this.municipality && this.municipality.id;
      this.deleteMunicipalityDialog = true;
    },
    editMunicipality() {
      this.municipalityId = !!this.municipality && this.municipality.id;
      this.editMunicipalityDialog = true;
    },
    closeDialog(val) {
      this.deleteDialog = val;
      this.getData();
    },
    getData() {
      this.$store.dispatch("municipality/getMunicipalities");
    },
  },
  mounted() {
    this.getMunicipalityData();
  },
  computed: {
    columns() {
      return [
        {
          name: "id",
          label: "id",
          align: "left",
          field: (row) => row.id,
          sortable: true,
        },
        {
          name: "title",
          required: true,
          label: this.$t("DetailsAdministration.title"),
          align: "left",
          field: (row) => row.title,
          sortable: true,
        },
        {
          name: "type",
          align: "left",
          label: this.$t("DetailsAdministration.type"),
          field: (row) => this.$t(row.type),
          sortable: true,
        },
        {
          name: "categories",
          label: this.$t("DetailsAdministration.categories"),
          field: (row) =>
            (!!row.categories &&
              row.categories.map((category) => category.title).join(", ")) ||
            this.$t("NoCategories"),
          sortable: true,
          align: "left",
        },
        {
          name: "users",
          label: this.$t("DetailsAdministration.user"),
          field: (row) =>
            (!!row.owner && row.owner.username) || "No Owner Found",
          sortable: true,
          align: "left",
        },
      ];
    },
    isAdmin() {
      return this.$store.getters["userCenter/isAdmin"];
    },
    loggedInUser() {
      return (
        !!this.$store.state.userCenter.user &&
        this.$store.state.userCenter.user.user
      );
    },
  },
};
</script>

<style scoped>
.logo {
  display: block;
  width: 100%;
  height: auto;
  max-width: 100%;
}

.label {
  color: rgba(22, 66, 139, 0.5);
}

.left-card {
  height: 223px;
}

.more {
  position: absolute;
  top: 1rem;
  right: 10px;
}
</style>
