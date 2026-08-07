<template>
  <q-page class="column items-center q-mt-xl">
    <h3 class="text-center  q-mt-md">{{ $t("User Details") }}</h3>
    <q-card class="q-pa-lg radius-10">
      <q-form
        @submit.prevent="updateUserInformation"
        ref="updateUserForm"
        class="q-gutter-lg q-px-md q-mb-md "
      >
        <div class="row items-center ">
          <div class="col-3">
            <p class="font-14 no-margin">
              Name
            </p>
          </div>
          <div class="col-9">
            <q-input
              outlined
              dense
              class="no-shadow input-radius-6"
              v-model="form.username"
              :rules="[]"
              placeholder="Name"
            />
          </div>
        </div>
        <div class="row items-center ">
          <div class="col-3 ">
            <p class="font-14 no-margin ">
              {{ $t("userAdministration.administration") }}
            </p>
          </div>
          <div class="col-9">
            <q-btn-toggle
              v-model="form.scope"
              spread
              no-caps
              class="q-mb-sm no-shadow input-radius-6"
              toggle-color="primary"
              :options="[
                { label: $t('userAdministration.administration'), value: 'municipality' },
                { label: $t('landkreise.landkreisName'), value: 'landkreis' }
              ]"
              @input="onScopeChange"
            />
            <MunicipalitySelect
              v-if="form.scope === 'municipality'"
              :currentMunicipality="form.municipality"
              @update:municipality="form.municipality = $event"
            />
            <LandkreisSelect
              v-else
              :currentLandkreis="form.landkreis"
              @update:landkreis="form.landkreis = $event"
            />
          </div>
        </div>
        <div class="row items-center">
          <div class="col-3">
            <p class="font-14 no-margin">
              E-mail
            </p>
          </div>
          <div class="col-9">
            <q-input
              outlined
              dense
              class="no-shadow input-radius-6"
              v-model="form.email"
              :rules="[]"
              placeholder="wilson.culhane@mail.com"
            />
          </div>
        </div>
        <div class="row items-center justify-evenly">
          <div class="col-3">
            <p class="font-14 no-margin">
              {{ $t("userAdministration.role") }}
            </p>
          </div>
          <div class="col-9">
            <q-select
              :disable="
                (!!currentUser && currentUser.id) ===
                  (!!loggedInUser && loggedInUser.id)
              "
              outlined
              dense
              :options="options"
              options-selected-class="text-primary text-weight-600"
              class="no-shadow input-radius-6"
              v-model="form.role"
              :rules="[]"
              placeholder="Role"
            />
          </div>
        </div>
        <div class="row justify-center q-ml-lg ">
          <q-btn
            type="submit"
            :label="$t('personalData.saveChanges')"
            size="16px"
            color="primary"
            no-caps
            unelevated
            class="no-shadow radius-6 q-px-xl q-mr-sm"
          />
          <q-btn
            :label="$t('delete user')"
            outline
            @click="showDialog = true"
            size="16px"
            color="red"
            no-caps
            class="no-shadow radius-6 q-px-xl"
          />
        </div>
      </q-form>
    </q-card>
    <q-dialog v-model="showDialog">
      <q-card class="q-pa-lg radius-10 column  justify-center">
        <h6 class="text-center  q-mt-md q-mb-lg">{{ $t("delete user") }}</h6>
        <p
          class="text-center text-weight-light font-16
"
        >
          {{ $t("deleteUserInfo") }}
        </p>
        <div class="row justify-center q-ml-lg q-mt-lg ">
          <q-btn
            :label="$t('userAdministration.cancel')"
            outline
            v-close-popup
            type="submit"
            size="16px"
            color="primary"
            no-caps
            class="no-shadow radius-6 q-px-xl q-mr-sm"
            :loading="isLoading"
          />
          <q-btn
            @click="
              transferDialog = true;
              showDialog = false;
            "
            :label="$t('confirm')"
            type="submit"
            size="16px"
            color="red"
            no-caps
            class="no-shadow radius-6 q-px-xl"
            :loading="isLoading"
          />
        </div>
      </q-card>
    </q-dialog>
    <TransferDialog
      v-if="currentUser !== null"
      :fromId="currentUser"
      :dialogState="transferDialog"
      @update="
        transferDialog = $event;
        deleteData = true;
      "
    />
    <deleteDataDialog
      v-if="currentUser !== null"
      :fromId="!!currentUser ? currentUser.id.toString() : ''"
      :dialogState="deleteData"
      @update="deleteData = $event"
    />
  </q-page>
</template>

<script>
import TransferDialog from "components/user/settings/TransferDialog.vue";
import deleteDataDialog from "components/user/settings/deleteDataDialog.vue";
import MunicipalitySelect from "components/Municipality/MunicipalitySelect.vue";
import LandkreisSelect from "components/Landkreise/LandkreisSelect.vue";
export default {
  components: {
    MunicipalitySelect,
    LandkreisSelect,
    TransferDialog,
    deleteDataDialog
  },
  data() {
    return {
      currentUser: null,
      options: ["admin", "user", "leader", "guest"],
      showDialog: false,
      isLoading: false,
      transferDialog: false,
      deleteData: false,
      form: {
        username: "",
        email: "",
        role: "",
        scope: "municipality",
        municipality: { id: null, title: "" },
        landkreis: { id: null, title: "" }
      },
      dataRight: ""
    };
  },
  methods: {
    onScopeChange() {
      this.form.municipality = { id: null, title: "" };
      this.form.landkreis = { id: null, title: "" };
    },
    getUserData() {
      const id = !!this.$route.params && this.$route.params.id;
      if (id) {
        let currentUser = this.$store.state.userCenter.users.find(user => {
          return (!!user && user.id) === Number(id);
        });
        this.currentUser = currentUser;
        this.form.username = currentUser.username;
        this.form.email = currentUser.email;
        if (currentUser.user_detail.municipality) {
          this.form.scope = "municipality";
          this.form.municipality.id = currentUser.user_detail.municipality.id;
          this.form.municipality.title =
            currentUser.user_detail.municipality.title;
        } else if (currentUser.user_detail.landkreis) {
          this.form.scope = "landkreis";
          this.form.landkreis.id = currentUser.user_detail.landkreis.id;
          this.form.landkreis.title = currentUser.user_detail.landkreis.title;
        }
        this.form.role =
          currentUser.role.type === "authenticated" ? "user" : currentUser.role.type === "guest" ? "guest" : currentUser.role.type === "leader" ? "leader" : "admin";
      } else {
        this.$router.push("/Administation/User");
      }
    },
    updateUserInformation() {
      this.$refs.updateUserForm.validate().then(async success => {
        if (success) {
          this.isLoading = true;
          const { municipality, landkreis, scope, ...rest } = this.form;
          const data =
            scope === "municipality"
              ? { ...rest, municipality: { id: municipality.id } }
              : { ...rest, landkreis: { id: landkreis.id } };
          const res = await this.$store.dispatch("userCenter/updateUser", {
            id: this.$route.params.id,
            data
          });
          this.isLoading = false;
        } else {
          console.log("error");
        }
      });
    }
  },
  computed: {
    isAdmin() {
      return this.$store.getters["userCenter/isAdmin"];
    },
    loggedInUser() {
      return (
        !!this.$store.state.userCenter.user &&
        this.$store.state.userCenter.user.user
      );
    }
  },
  mounted() {
    this.getUserData();
  }
};
</script>
