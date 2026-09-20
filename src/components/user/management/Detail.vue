<template>
  <q-dialog v-model="$_options">
    <q-card class="invite-user-card"
      :style="$q.screen.lt.sm ? 'width: 95vw; max-width: 95vw;' : 'width: 760px; max-width: 92vw;'">
      <div class="iu-header">
        <div>
          <h6 class="iu-title">
            {{ $t("User Details") }}
          </h6>
        </div>
        <q-space />
        <div class="iu-close-btn" v-close-popup>
          <q-icon name="close" size="18px" />
        </div>
      </div>

      <div class="iu-body">
        <q-form @submit.prevent="updateUserInformation" ref="updateUserForm" class="iu-sections">

          <div>
            <p class="iu-section-label">1 · {{ $t('userAdministration.person') }}</p>
            <div class="iu-grid-2 q-mt-sm">
              <label class="iu-field">
                <span class="iu-field-label">{{ $t("Username") }}</span>
                <q-input outlined dense class="iu-input" v-model="form.username"
                  :rules="[]" :placeholder="$t('Username')" />
              </label>
              <label class="iu-field">
                <span class="iu-field-label">{{ $t("E-Mail") }}</span>
                <q-input outlined dense class="iu-input" v-model="form.email"
                  :rules="[]" :placeholder="$t('E-Mail')" />
              </label>
            </div>
          </div>

          <div>
            <div class="iu-section-heading">
              <p class="iu-section-label">2 · {{ $t('userAdministration.role') }}</p>
            </div>
            <div class="iu-role-list q-mt-sm">
              <div v-for="opt in roleOptions" :key="opt.value" class="iu-role-row"
                :class="{ 'iu-role-row--active': form.role === opt.value, 'iu-role-row--disabled': roleDisabled }"
                @click="selectRole(opt.value)">
                <span class="iu-role-dot" :class="{ 'iu-role-dot--active': form.role === opt.value }" />
                <div class="column">
                  <span class="iu-role-name">{{ opt.label }}</span>
                  <span class="iu-role-desc">{{ opt.desc }}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div class="iu-section-heading">
              <p class="iu-section-label">3 · {{ $t('userAdministration.scope') }}</p>
              <q-space />
              <span class="iu-clear-btn" @click="clearScope">{{ $t('userAdministration.clearScope') }}</span>
            </div>
            <div class="iu-panel q-mt-sm">
              <template v-if="form.role === 'guest'">
                <label class="iu-field">
                  <span class="iu-field-label">{{ $t('personalData.location') }}</span>
                  <LocationSelect :currentLocation="form.assignedLocation"
                    :rules="[val => !!val || $t('Required')]"
                    @update:location="form.assignedLocation = $event" />
                </label>
              </template>
              <template v-else>
                <HierarchyScopePicker v-model="form.scope" :municipality-only="form.role === 'leader'" />
              </template>
            </div>
          </div>

          <div>
            <div class="iu-section-heading">
              <span class="iu-field-label">Interests</span>
              <span class="iu-hint">optional</span>
            </div>
            <div class="q-mt-sm">
              <Categories :requiresValidation="false" :editing="form.categories.length > 0 ? form.categories : []"
                @update:category="form.categories = $event" />
            </div>
          </div>
        </q-form>
      </div>

      <div class="iu-footer">
        <q-btn :label="$t('delete user')" outline @click="showDialog = true" no-caps unelevated
          class="iu-btn iu-btn--delete" />
        <div class="iu-footer-actions">
          <q-btn :label="$t('userAdministration.cancel')" v-close-popup no-caps unelevated
            class="iu-btn iu-btn--cancel" />
          <q-btn :label="$t('personalData.saveChanges')" @click="updateUserInformation" :loading="isLoading"
            no-caps unelevated class="iu-btn iu-btn--primary" />
        </div>
      </div>
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
  </q-dialog>
</template>

<script>
import TransferDialog from "components/user/settings/TransferDialog.vue";
import deleteDataDialog from "components/user/settings/deleteDataDialog.vue";
import HierarchyScopePicker from "components/hierarchy/HierarchyScopePicker.vue";
import { emptyScope, scopeToUserPayload, userDetailToScope } from "components/hierarchy/scopePayload";
import LocationSelect from "components/hierarchy/LocationSelect.vue";
import Categories from "components/projects/create/Categories.vue";
export default {
  props: {
    dialogState: { type: Boolean, default: false },
    userId: { type: Number, default: null }
  },
  components: {
    HierarchyScopePicker,
    LocationSelect,
    Categories,
    TransferDialog,
    deleteDataDialog
  },
  data() {
    return {
      currentUser: null,
      showDialog: false,
      isLoading: false,
      transferDialog: false,
      deleteData: false,
      form: {
        username: "",
        email: "",
        role: "",
        // "assign one, infer the rest" - scope is used for every role except
        // guest, which is location-only (see form.assignedLocation).
        scope: emptyScope(),
        assignedLocation: null,
        categories: []
      },
      dataRight: ""
    };
  },
  methods: {
    selectRole(value) {
      if (this.roleDisabled) return;
      this.form.role = value;
    },
    clearScope() {
      if (this.form.role === "guest") this.form.assignedLocation = null;
      else this.form.scope = emptyScope();
    },
    getUserData() {
      if (this.userId) {
        let currentUser = this.$store.state.userCenter.users.find(user => {
          return (!!user && user.id) === this.userId;
        });
        this.currentUser = currentUser;
        this.form.username = currentUser.username;
        this.form.email = currentUser.email;
        this.form.scope = userDetailToScope(currentUser.user_detail);
        if (currentUser.user_detail.assignedLocation) {
          this.form.assignedLocation = {
            id: currentUser.user_detail.assignedLocation.id,
            title: currentUser.user_detail.assignedLocation.title
          };
        }
        this.form.role =
          currentUser.role.type === "authenticated" ? "user" : currentUser.role.type === "guest" ? "guest" : currentUser.role.type === "leader" ? "leader" : "admin";
        this.form.categories = currentUser.user_detail.categories || [];
      }
    },
    updateUserInformation() {
      this.$refs.updateUserForm.validate().then(async success => {
        if (success) {
          this.isLoading = true;
          const { scope, assignedLocation, ...rest } = this.form;
          const data = { ...rest };
          if (this.form.role === "guest") {
            if (assignedLocation?.id) data.assignedLocation = { id: assignedLocation.id };
          } else {
            Object.assign(data, scopeToUserPayload(scope));
          }
          const res = await this.$store.dispatch("userCenter/updateUser", {
            id: this.userId,
            data
          });
          this.isLoading = false;
          if (res !== false) {
            this.$emit("updated");
            this.$_options = false;
          }
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
    },
    roleDisabled() {
      return (
        (!!this.currentUser && this.currentUser.id) ===
        (!!this.loggedInUser && this.loggedInUser.id)
      );
    },
    roleOptions() {
      return [
        { label: this.$t("userAdministration.roleAdmin"), value: "admin", desc: this.$t("userAdministration.roleAdminDesc") },
        { label: this.$t("userAdministration.roleLeader"), value: "leader", desc: this.$t("userAdministration.roleLeaderDesc") },
        { label: this.$t("userAdministration.roleUser"), value: "user", desc: this.$t("userAdministration.roleUserDesc") },
        { label: this.$t("userAdministration.roleGuest"), value: "guest", desc: this.$t("userAdministration.roleGuestDesc") }
      ];
    },
    $_options: {
      get() {
        return this.dialogState;
      },
      set(val) {
        this.$emit("update", val);
      }
    }
  },
  watch: {
    dialogState(val) {
      if (val) this.getUserData();
    }
  }
};
</script>

<style scoped>
/* card shell */
.invite-user-card {
  border-radius: 16px;
  box-shadow: 0 26px 64px rgba(0, 0, 85, .22);
  overflow: hidden;
}

/* header */
.iu-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 24px 28px 20px;
  border-bottom: 1px solid #eef1fb;
}

.iu-title {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 23px;
  font-weight: 700;
  color: #000055;
}

.iu-close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  color: #7c86ae;
  cursor: pointer;
}

.iu-close-btn:hover {
  background: #f4f6fd;
  color: #000055;
}

/* body */
.iu-body {
  padding: 22px 28px 26px;
  max-height: 65vh;
  overflow-y: auto;
}

.iu-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.iu-section-heading {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.iu-clear-btn {
  font-size: 12.5px;
  font-weight: 600;
  color: #46527f;
  cursor: pointer;
}

.iu-clear-btn:hover {
  color: #000055;
  text-decoration: underline;
}

.iu-section-label {
  margin: 0;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: #7c86ae;
}

.iu-grid-2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}

.iu-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.iu-field-label {
  font-size: 12.5px;
  font-weight: 600;
  color: #46527f;
}

/* quasar field overrides -> mock's outlined input look */
.iu-input >>> .q-field__control {
  height: 42px;
  border-radius: 9px;
  padding: 0 12px;
  background: #fff;
  box-shadow: none;
}

.iu-input >>> .q-field__control:before {
  border: 1.5px solid #dfe4f5;
}

.iu-input >>> .q-field__control:hover:before {
  border-color: #000055;
}

.iu-sections >>> .q-field--focused .q-field__control:before {
  border-color: #000055;
}

.iu-sections >>> .q-field--focused .q-field__control {
  box-shadow: 0 0 0 3px rgba(0, 0, 85, .16);
}

.iu-input >>> .q-field__native,
.iu-input >>> .q-field__input,
.iu-input >>> .q-field__selected {
  font-size: 14px;
  color: #000055;
}

/* section 3 scope panel */
.iu-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f4f6fd;
  border: 1.5px solid #e6eaf7;
  border-radius: 12px;
  padding: 14px;
}

/* section 2 role list */
.iu-role-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.iu-role-row {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  padding: 12px 14px;
  border-radius: 11px;
  border: 1.5px solid #e6eaf7;
  background: #fff;
  cursor: pointer;
}

.iu-role-row--active {
  border-color: #000055;
  background: #f4f6fd;
}

.iu-role-row--disabled {
  cursor: not-allowed;
  opacity: .55;
}

.iu-role-dot {
  flex: none;
  margin-top: 3px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #c3cbea;
  background: #fff;
}

.iu-role-dot--active {
  border: 5px solid #000055;
}

.iu-role-name {
  font-size: 14px;
  font-weight: 700;
  color: #000055;
}

.iu-role-desc {
  font-size: 12.5px;
  line-height: 1.4;
  color: #6b74a0;
}

/* footer */
.iu-footer {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 16px 28px;
  background: #f4f6fd;
  border-top: 1px solid #e6eaf7;
}

.iu-footer-actions {
  margin-left: auto;
  display: flex;
  gap: 10px;
}

.iu-btn {
  height: 42px;
  padding: 0 20px;
  border-radius: 9px;
  font-size: 14px;
  font-weight: 700;
}

.iu-btn--cancel {
  border: 1.5px solid #cfd6ee;
  background: #fff;
  color: #000055;
}

.iu-btn--cancel:hover {
  border-color: #000055;
}

.iu-btn--delete {
  border: 1.5px solid #d60000;
  background: #fff;
  color: #d60000;
}

.iu-btn--delete:hover {
  background: #fdecec;
}

.iu-btn--primary {
  background: #000055;
  color: #fff;
}

.iu-btn--primary:hover {
  background: #101c58;
}
</style>
