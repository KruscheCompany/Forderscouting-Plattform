<template>
  <div class="action-button">
    <q-fab v-model="actionButton" color="blue" icon="keyboard_arrow_left" direction="left">
      <q-btn v-if="showTransferButton" @click="transferDocument" color="blue" unelevated
        class="radius-6 text-weight-600" no-caps icon="send" aria-label="Transfer Ownership">
        <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
          {{ $t("transferOwnership") }}
        </q-tooltip>
      </q-btn>

      <q-btn @click="exportToPdf" color="blue" unelevated class="radius-6 text-weight-600" no-caps icon="print"
        aria-label="Print" :loading="loadingStates.watchlist">
        <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
          {{ $t("print") }}
        </q-tooltip>
      </q-btn>

      <q-btn @click="addToWatchlist" color="blue" unelevated class="radius-6 text-weight-600" no-caps
        icon="star_outline" aria-label="Bookmark" :loading="loadingStates.watchlist">
        <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
          {{ $t("bookmark") }}
        </q-tooltip>
      </q-btn>

      <div class="col-auto">
        <q-btn @click="editProject" color="blue" unelevated class="radius-6 text-weight-600" no-caps icon="edit"
          aria-label="Edit" :loading="loadingStates.edit">
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
            {{ $t("edit") }}
          </q-tooltip>
        </q-btn>
      </div>

      <div class="col-auto">
        <q-btn @click="duplicateProject" color="blue" unelevated class="radius-6 text-weight-600" no-caps
          icon="content_copy" aria-label="Duplicate" :loading="loadingStates.duplicate">
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
            {{ $t("duplicate") }}
          </q-tooltip>
        </q-btn>
      </div>

      <div v-if="showArchiveButton" class="col-auto">
        <q-btn @click="archiveProject" color="blue" unelevated class="radius-6 text-weight-600" no-caps icon="inventory"
          aria-label="Archive" :loading="loadingStates.archive">
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
            {{ $t("archive") }}
          </q-tooltip>
        </q-btn>
      </div>

      <div v-if="isAdmin" class="col-auto">
        <q-btn @click="deleteProject" color="red" unelevated class="radius-6 text-weight-600" no-caps icon="delete"
          aria-label="Delete" :loading="loadingStates.delete">
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
            {{ $t("delete") }}
          </q-tooltip>
        </q-btn>
      </div>
    </q-fab>
  </div>
</template>

<script>
export default {
  name: "ProjectActionButtons",
  data() {
    return {
      actionButton: false
    };
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
      default: () => ({
        watchlist: false,
        edit: false,
        duplicate: false,
        archive: false,
        delete: false
      })
    }
  },
  emits: [
    'transfer-document',
    'export-to-pdf',
    'archive-project',
    'delete-project',
    'request-access',
  ],
  methods: {
    async addToWatchlist() {
      this.$emit('loading-state', { type: 'watchlist', value: true });
      const id = this.project?.id;
      await this.$store.dispatch("project/addToWatchlist", { id });
      this.$emit('loading-state', { type: 'watchlist', value: false });
    },

    async editProject() {
      this.$emit('loading-state', { type: 'edit', value: true });
      const id = this.project?.id;

      if (
        this.project &&
        this.project.owner?.id !== this.loggedInUser?.id &&
        !this.isAdmin
      ) {
        const hasEditorAccess = this.project.editors?.some(
          user => user.id === this.loggedInUser?.id
        );

        if (hasEditorAccess) {
          this.$router.push({ path: `/application/process/edit/${id}` });
        } else {
          this.$emit('request-access', { id, type: 'edit' });
        }
      } else {
        this.$router.push({ path: `/application/process/edit/${id}` });
      }

      this.$emit('loading-state', { type: 'edit', value: false });
    },

    async duplicateProject() {
      this.$emit('loading-state', { type: 'duplicate', value: true });
      const id = this.project?.id;

      if (
        this.project &&
        this.project.visibility !== "all users" &&
        this.project.owner?.id !== this.loggedInUser?.id
      ) {
        this.$emit('request-access', { id, type: 'duplicate' });
      } else {
        const res = await this.$store.dispatch("project/duplicateProject", { id });
        if (res?.data?.id) {
          this.$router.push({ path: `/application/process/view/${res.data.id}` });
        }
      }

      this.$emit('loading-state', { type: 'duplicate', value: false });
    },

    archiveProject() {
      this.$emit('archive-project', this.project?.id);
    },

    transferDocument() {
      this.$emit('transfer-document', this.project?.id);
    },

    deleteProject() {
      this.$emit('delete-project', this.project?.id);
    },

    exportToPdf() {
      this.$emit('export-to-pdf');
    }
  },
  computed: {
    showTransferButton() {
      return (
        this.project &&
        this.project.id &&
        (this.project.owner.id === this.loggedInUser.id || this.isAdmin)
      );
    },
    showArchiveButton() {
      return (
        this.isAdmin ||
        (this.project &&
          this.project.owner &&
          this.project.owner.id === this.loggedInUser.id)
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.action-button {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}
</style>
