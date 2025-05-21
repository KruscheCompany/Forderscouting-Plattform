<template>
  <q-dialog v-model="$_options">
    <q-card
      class="q-px-xl radius-10 column"
      style="
        display: flex;
        justify-content: center;
        height: 350px;
        position: absolute;
        top: 50px;
      "
    >
      <h5 style="margin: 0 0 0 35px">
        {{ $t("transferOwnershipMessage") }}
      </h5>
      <q-card-section>
        <q-select
          v-model="selected"
          behavior="default"
          :options="usersOptions"
          :label="$t('generalData.changeOwner')"
          outlined
          :rules="[(val) => !!val || $t('Required')]"
          dense
          class="no-shadow radius-6 q-px-xl q-py-sm"
        />
      </q-card-section>
      <q-card-section>
        <div class="row justify-center q-ml-lg">
          <q-btn
            :label="$t('category&Keyword.cancel')"
            outline
            v-close-popup
            size="14px"
            color="primary"
            no-caps
            class="no-shadow radius-6 q-px-xl q-mr-sm"
            :loading="isLoading"
          />
          <q-btn
            :label="$t('confirm')"
            unelevated
            :loading="isLoading"
            size="14px"
            color="primary"
            no-caps
            class="no-shadow radius-6 q-px-xl q-py-sm"
            @click="transferDocument"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "archiveDataDialog",
  props: {
    dialogState: { type: Boolean, default: false },
    type: { type: String, default: "" },
    id: { type: Number, default: null },
  },
  data() {
    return {
      isLoading: false,
      selected: null,
    };
  },
  methods: {
    async transferDocument() {
      this.isLoading = true;
      if (!this.selected) {
        this.$q.notify({
          type: "negative",
          message: "Bitte wählen Sie einen Benutzer aus",
        });
        this.isLoading = false;
        return;
      }
      try {
        try {
          await this.$api.post("/api/change/document/ownership/", {
            type: this.type,
            id: this.id,
            newOwnerId: this.selected.value,
          });
          this.$q.notify({
            message: "Das Dokument wurde erfolgreich übertragen",
            type: "positive",
          });
          this.$router.go(-1);
        } catch (error) {
          console.log("error :>> ", error.response);
          this.$q.notify({
            type: "negative",
            message: error.response.data.error.message,
          });
        }
        this.$emit("close");
      } catch (error) {
        console.log(error);
      }
      this.isLoading = false;
      this.$emit("close");
    },
  },
  computed: {
    $_options: {
      get: function () {
        return this.dialogState;
      },
      set: function (val) {
        this.$emit("update", val);
      },
    },
    usersOptions() {
      const users = [];
      const filteredUsers = this.users.filter(
        (item) =>
          item.user_detail.municipality.title ===
          this.$store.state.userCenter.user.userDetails.municipality.title
      );
      filteredUsers.forEach((user) => {
        users.push({
          label: user.user_detail.fullName,
          value: user.id,
        });
      });
      if (this.isAdmin) {
        this.users.forEach((user) => {
          users.push({
            label: user.user_detail.fullName,
            value: user.id,
          });
        });

        return [...new Set(users)].sort((a, b) => a.label.localeCompare(b.label));
      } else {
        return [...new Set(users)].sort((a, b) => a.label.localeCompare(b.label));
      }
    },
    users() {
      return this.$store.state.userCenter.users;
    },
    isAdmin() {
      return this.$store.getters["userCenter/isAdmin"];
    },
  },
};
</script>
