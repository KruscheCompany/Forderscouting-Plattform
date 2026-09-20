<template>
  <q-dialog v-model="$_options">
    <q-card class="invite-user-card"
      :style="$q.screen.lt.sm ? 'width: 95vw; max-width: 95vw;' : 'width: 760px; max-width: 92vw;'">
      <div class="iu-header">
        <div>
          <h6 class="iu-title">
            {{ $t("userAdministration.inviteUser") }}
          </h6>
          <p class="iu-subtitle">
            {{ $t("userAdministration.inviteUserHint") }}
          </p>
        </div>
        <q-space />
        <div class="iu-close-btn" v-close-popup>
          <q-icon name="close" size="18px" />
        </div>
      </div>

      <div class="iu-body">
        <q-form ref="userInviteForm" class="iu-sections">

          <div>
            <p class="iu-section-label">1 · {{ $t('userAdministration.person') }}</p>
            <div class="iu-grid-2 q-mt-sm">
              <label class="iu-field">
                <span class="iu-field-label">{{ $t("Username") }}</span>
                <q-input outlined dense class="iu-input" v-model="form.username"
                  :rules="[val => !!val || $t('Required')]" :placeholder="$t('Username')" />
              </label>
              <label class="iu-field">
                <span class="iu-field-label">{{ $t("E-Mail") }}</span>
                <q-input outlined dense class="iu-input" v-model="form.email"
                  :rules="[val => !!val || $t('Required')]" :placeholder="$t('E-Mail')" />
              </label>
            </div>
          </div>

          <div>
            <div class="iu-section-heading">
              <p class="iu-section-label">2 · {{ $t('userAdministration.role') }}</p>
              <span class="iu-hint">{{ $t('userAdministration.roleHint') }}</span>
            </div>
            <div class="iu-role-list q-mt-sm">
              <div v-for="opt in currentRoleOptions" :key="opt.value" class="iu-role-row"
                :class="{ 'iu-role-row--active': form.role === opt.value, 'iu-role-row--error': roleError }"
                @click="selectRole(opt.value)">
                <span class="iu-role-dot" :class="{ 'iu-role-dot--active': form.role === opt.value }" />
                <div class="column">
                  <span class="iu-role-name">{{ opt.label }}</span>
                  <span class="iu-role-desc">{{ opt.desc }}</span>
                </div>
              </div>
            </div>
            <p v-if="roleError" class="iu-error">
              {{ $t('Required') }}
            </p>
          </div>

          <div>
            <div class="iu-section-heading">
              <p class="iu-section-label">3 · {{ $t('userAdministration.scope') }}</p>
              <span class="iu-hint">{{ $t('userAdministration.scopeHint') }}</span>
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

          <div>
            <div class="iu-message-toggle" @click="messageOpen = !messageOpen">
              <q-icon name="chevron_right" size="16px" class="iu-caret" :class="{ 'iu-caret--open': messageOpen }" />
              <span>{{ $t("userAdministration.message") }}</span>
            </div>
            <q-slide-transition>
              <div v-show="messageOpen" class="q-mt-sm">
                <q-input outlined class="iu-input iu-textarea" v-model="form.message"
                  :rules="[val => !!val || $t('Required')]" type="textarea" placeholder="Text" />
              </div>
            </q-slide-transition>
          </div>
        </q-form>
      </div>

      <div class="iu-footer">
        <p class="iu-required">
          {{ requiredFieldsSummary }}
        </p>
        <div class="iu-footer-actions">
          <q-btn :label="$t('userAdministration.cancel')" v-close-popup no-caps unelevated
            class="iu-btn iu-btn--cancel" />
          <q-btn :label="$t('userAdministration.sendInvitation')" @click="inviteUser" no-caps unelevated
            :loading="isLoading" class="iu-btn iu-btn--primary" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import HierarchyScopePicker from "components/hierarchy/HierarchyScopePicker.vue";
import { emptyScope, scopeToUserPayload } from "components/hierarchy/scopePayload";
import LocationSelect from "components/hierarchy/LocationSelect.vue";
import Categories from "components/projects/create/Categories.vue";
export default {
  name: "inviteUserDialog",
  props: {
    dialogState: { type: Boolean, default: false },
    guestEmail: { type: String, default: "" },
    guestLocation: { type: String, default: "" },
    guestMunicipality: { type: Object, default: null },
    guestCategories: { type: Array, default: () => [] },
    guestName: { type: String, default: "" },
    notification: { type: Object, default: null }
  },
  components: {
    HierarchyScopePicker,
    LocationSelect,
    Categories
  },
  data() {
    return {
      isLeader: false,
      roleError: false,
      messageOpen: false,
      form: {
        username: "",
        role: "",
        // "assign one, infer the rest" - scope is used for every role except
        // Guest, which is location-only (see form.assignedLocation).
        scope: emptyScope(),
        assignedLocation: null,
        categories: [],
        message: "",
        email: ""
      },
      isLoading: false
    };
  },
  methods: {
    selectRole(value) {
      this.form.role = value;
      this.roleError = false;
    },
    clearScope() {
      if (this.form.role === "guest") this.form.assignedLocation = null;
      else this.form.scope = emptyScope();
    },
    inviteUser() {
      this.roleError = !this.form.role;
      this.$refs.userInviteForm.validate().then(async success => {
        if (success && !this.roleError) {
          this.isLoading = true;
          const { scope, assignedLocation, ...rest } = this.form;
          const data = { ...rest };
          if (this.form.role === "guest") {
            if (assignedLocation?.id) data.assignedLocation = { id: assignedLocation.id };
          } else {
            Object.assign(data, scopeToUserPayload(scope));
          }
          const res = await this.$store.dispatch("userCenter/inviteUser", {
            data
          });
          this.isLoading = false;
          if (res !== false) {
            this.$emit("invited");
            if (this.guestEmail.length > 0) {
              this.$store.dispatch("userCenter/deleteGuestRequest", {
                id: this.notification.id
              });
              this.$emit("deltedNotification", this.notification, this.notification.index);
            }
            setTimeout(() => {
              this.$_options = false;
              this.form.username = "";
              this.form.role = "";
              this.form.scope = emptyScope();
              this.form.assignedLocation = null;
              this.form.message = "";
              this.form.email = "";
              this.messageOpen = false;
            }, 500);
          }
        } else {
          const elements = this.$refs.userInviteForm.getValidationComponents();
          elements.map(el => {
            if (el.validate) {
              el.validate();
            }
          });
        }
      });
    }
  },
  computed: {
    roleOptions() {
      return [
        { label: this.$t("userAdministration.roleAdmin"), value: "admin", desc: this.$t("userAdministration.roleAdminDesc") },
        { label: this.$t("userAdministration.roleLeader"), value: "leader", desc: this.$t("userAdministration.roleLeaderDesc") },
        { label: this.$t("userAdministration.roleUser"), value: "user", desc: this.$t("userAdministration.roleUserDesc") },
        { label: this.$t("userAdministration.roleGuest"), value: "guest", desc: this.$t("userAdministration.roleGuestDesc") }
      ];
    },
    roleOptionsLeader() {
      return [
        { label: this.$t("userAdministration.roleGuest"), value: "guest", desc: this.$t("userAdministration.roleGuestDesc") }
      ];
    },
    currentRoleOptions() {
      return this.isLeader ? this.roleOptionsLeader : this.roleOptions;
    },
    requiredFieldsSummary() {
      const fields = [
        this.$t("Username"),
        this.$t("E-Mail"),
        this.$t("userAdministration.role"),
        this.$t("userAdministration.scope")
      ];
      return `${this.$t("Required")}: ${fields.join(", ")}`;
    },
    $_options: {
      get: function () {
        return this.dialogState;
      },
      set: function (val) {
        this.$emit("update", val);
      }
    }
  },
  watch: {
    dialogState: async function (val) {
      if (val) {
        this.form.email = this.guestEmail;
        this.form.categories = this.guestCategories;
        this.form.username = this.guestName;
        // Start from a clean scope every time the dialog opens, so a previous
        // guest conversion's municipality/location cannot leak into a plain invite.
        this.form.scope = this.guestMunicipality?.id
          ? { anchorLevel: "municipality", anchorId: this.guestMunicipality.id, levels: null }
          : emptyScope();
        this.form.assignedLocation = null;
        // guestLocation is the legacy free-text city from a guest-request - best-effort
        // match it against the real location list so LocationSelect can preselect it;
        // if nothing matches, the admin picks manually (same "unlinked legacy data"
        // handling as the rest of the location backfill).
        if (this.guestLocation) {
          await this.$store.dispatch("location/getLocations");
          const match = (this.$store.state.location.locations || []).find(
            (loc) => loc.title.trim().toLowerCase() === this.guestLocation.trim().toLowerCase()
          );
          this.form.assignedLocation = match ? { id: match.id, title: match.title } : null;
        }
      }
    }
  },
  mounted() {
    this.isLeader = this.$store.getters["userCenter/isLeader"];
    this.isLeader ? this.form.role = "guest" : "";
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

.iu-subtitle {
  margin: 4px 0 0;
  font-size: 13px;
  color: #7c86ae;
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

.iu-section-label {
  margin: 0;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: #7c86ae;
}

.iu-hint {
  font-size: 12.5px;
  color: #9aa3c6;
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

.iu-textarea >>> .q-field__control {
  height: auto;
  padding: 0;
}

.iu-textarea >>> .q-field__native {
  min-height: 84px;
  padding: 11px 12px;
  font-size: 13.5px;
  line-height: 1.5;
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

.iu-role-row--error {
  border-color: #d60000;
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

.iu-error {
  margin: 6px 0 0;
  font-size: 12px;
  color: #d60000;
}

/* message toggle */
.iu-message-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  font-size: 13px;
  font-weight: 700;
  color: #000055;
  cursor: pointer;
}

.iu-caret {
  transition: transform .15s;
}

.iu-caret--open {
  transform: rotate(90deg);
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

.iu-required {
  margin: 0;
  font-size: 12.5px;
  color: #7c86ae;
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

.iu-btn--primary {
  background: #000055;
  color: #fff;
}

.iu-btn--primary:hover {
  background: #101c58;
}
</style>
