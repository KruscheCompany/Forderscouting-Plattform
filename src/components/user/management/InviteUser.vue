<template>
  <q-dialog v-model="$_options">
    <q-card class="q-pa-md radius-10" style="width: 532px; max-width: 90vw;">
      <q-card-section class="no-padding">
        <h6 class="text-center font-24 q-mt-md">
          {{ $t("userAdministration.inviteUser") }}
        </h6>
        <q-form ref="userInviteForm" class="q-gutter-md q-px-md q-mb-md ">
          <div class="row items-baseline">
            <div class="col-12 col-md-3">
              <p class="font-14 no-margin">
                {{ $t("Username") }}
              </p>
            </div>
            <div class="col-12 col-md-9">
              <q-input
                outlined
                class="no-shadow input-radius-6"
                v-model="form.username"
                :rules="[val => !!val || $t('Required')]"
                :placeholder="$t('Username')"
              />
            </div>
          </div>
          <div class="row items-baseline ">
            <div class="col-12 col-md-3">
              <p class="font-14 no-margin">
                {{ $t("E-Mail") }}
              </p>
            </div>
            <div class="col-12 col-md-9">
              <q-input
                outlined
                class="no-shadow input-radius-6"
                v-model="form.email"
                :rules="[val => !!val || $t('Required')]"
                :placeholder="$t('E-Mail')"
              />
            </div>
          </div>
          <div class="row items-baseline ">
            <div class="col-12 col-md-3 ">
              <p class="font-14 no-margin ">
                {{ $t("userAdministration.role") }}
              </p>
            </div>
            <div class="col-12 col-md-9">
              <q-select
                outlined
                :options="!isLeader ? roleOptions : roleOptionsLeader"
                options-selected-class="text-primary"
                class="no-shadow input-radius-6"
                v-model="form.role"
                :rules="[val => !!val || $t('Required')]"
                placeholder="Editor"
                map-options
                emit-value
              >
                <template v-slot:selected>
                  <template v-if="form.role">
                    <span>
                      {{ form.role }}
                    </span>
                  </template>
                  <template v-else>
                    <span class="text-grey">
                      {{ $t("select role") }}
                    </span>
                  </template>
                </template>
              </q-select>
            </div>
          </div>
          <div class="row items-baseline">
            <div class="col-12 col-md-3">
              <p class="font-14 no-margin">
                {{ $t("userAdministration.administration") }}
              </p>
            </div>
            <div class="col-12 col-md-9">
              <Municipality :currentMunicipality="form.municipality" @update:municipality="form.municipality = $event" />
            </div>
          </div>
          <div class="row items-baseline ">
              <div class="col-12 col-md-3">
                <p class="font-14 no-margin">
                  {{ $t('personalData.location') }}
                </p>
              </div>
              <div class="col-12 col-md-9">
                <MunicipalityCities
                :currentMunicipality="form.location"
                    @update:city="form.location = $event"
                  />
              </div>
            </div>
          <div class="row items-baseline ">
              <div class="col-12 col-md-3">
                <p class="font-14 no-margin">
                  Interests
                </p>
              </div>
              <div class="col-12 col-md-9">
                <Categories
                  :requiresValidation="false"
                  :editing="form.categories.length > 0 ? form.categories : []"
                  @update:category="form.categories = $event"
                />
              </div>
            </div>
          <div class="row items-baseline justify-evenly">
            <div class="col-12 col-md-3">
              <p class="font-14 no-margin">
                {{ $t("userAdministration.message") }}
              </p>
            </div>
            <div class="col-12 col-md-9">
              <q-input
                outlined
                class="no-shadow input-radius-6"
                v-model="form.message"
                :rules="[val => !!val || $t('Required')]"
                type="textarea"
                placeholder="Text"
              />
            </div>
          </div>
          <div class="row justify-center">
            <div class="col-5 q-mr-sm">
              <q-btn
                :label="$t('userAdministration.cancel')"
                outline
                v-close-popup
                size="16px"
                color="primary"
                no-caps
                class="radius-6 q-py-xs full-width"
              />
            </div>
            <div class="col-5 q-ml-sm">
              <q-btn
                :label="$t('userAdministration.sendInvitation')"
                @click="inviteUser"
                unelevated
                size="16px"
                color="primary"
                no-caps
                :loading="isLoading"
                class="radius-6 q-py-xs full-width"
              />
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import Municipality from "components/projects/create/Municipality.vue";
import MunicipalityCities from "components/Municipality/MunicipalityCities.vue";
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
    Municipality,
    MunicipalityCities,
    Categories
  },
  data() {
    return {
      isLeader: false,
      roleOptions: [
        {
          label: "Admin",
          value: "admin"
        },
        {
          label: "User",
          value: "user"
        },
        {
          label: "Guest",
          value: "Guest"
        },
        {
          label: "Municipality Leader",
          value: "Leader"
        }
      ],
      roleOptionsLeader: [
        {
          label: "Guest",
          value: "Guest"
        }
      ],
      form: {
        username: "",
        role: "",
        municipality: {
          id: null,
        },
        categories: [],
        message: "",
        email: "",
        location: ""
      },
      isLoading: false
    };
  },
  methods: {
    inviteUser() {
      this.$refs.userInviteForm.validate().then(async success => {
        if (success) {
          this.isLoading = true;
          const res = await this.$store.dispatch("userCenter/inviteUser", {
            data: this.form
          });
          this.isLoading = false;
          if (res !== false) {
            if(this.guestEmail.length > 0){
              this.$store.dispatch("userCenter/deleteGuestRequest", {
                id: this.notification.id
              });
              this.$emit("deltedNotification", this.notification, this.notification.index);
            }
            setTimeout(() => {
              this.$_options = false;
            this.form.username = "";
            this.form.role = "";
            this.form.municipality = {
              id: null
            };
            this.form.message = "";
            this.form.email = "";
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
    $_options: {
      get: function() {
        return this.dialogState;
      },
      set: function(val) {
        this.$emit("update", val);
      }
    }
  },
  watch: {
    dialogState: function(val) {
      if (val) {
        this.form.email = this.guestEmail;
        this.form.location = this.guestLocation;
        this.form.municipality = this.guestMunicipality;
        this.form.categories = this.guestCategories;
        this.form.username = this.guestName;
      }
    }
  },
  mounted() {
    this.isLeader = this.$store.getters["userCenter/isLeader"];
    this.isLeader ? this.form.role = "Guest" : "";
  }
};
</script>

<style></style>
