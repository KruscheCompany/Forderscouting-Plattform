<template>
  <q-dialog v-model="$_options">
    <q-card
      class="radius-10 q-px-lg q-pt-lg q-pb-xs"
      style="width: 570px; max-width: 90vw;"
    >
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel class="no-padding" name="login">
          <q-card-section class="q-pb-none">
            <q-form ref="loginForm" class="q-gutter-lg">
              <div class="row">
                <div class="col-12">
                  <p class="q-mb-sm font-16">Email</p>
                  <q-input
                    @keyup.enter="login"
                    outlined
                    dense
                    class="no-shadow input-radius-6"
                    v-model="form.identifier"
                    :rules="[val => !!val || 'Erforderlich']"
                  />
                </div>
                <div class="col-12 q-mt-lg">
                  <p class="q-mb-sm font-16">Passwort</p>
                  <q-input
                    @keyup.enter="login"
                    outlined
                    dense
                    type="password"
                    class="no-shadow input-radius-6"
                    v-model="form.password"
                    :rules="[val => !!val || 'Erforderlich']"
                  />
                </div>
              </div>
              <div class="row q-mt-none">
                <p class="no-margin text-red text-center full-width">
                  {{ errorMsg }}
                </p>
              </div>
              <div class="row justify-center">
                <div class="col-12 col-md-5 text-center">
                  <q-btn
                    @click="login"
                    class="radius-10 full-width"
                    padding="12px 12px"
                    color="yellow"
                    text-color="black"
                    unelevated
                    :loading="isLoading"
                  >
                    Login<template v-slot:loading>
                      {{ loginMessages }}
                      <q-circular-progress
                        indeterminate
                        class="on-right"
                      /> </template
                  ></q-btn>
                </div>
                <div class="col-12 q-mt-md">
                  <div class="row justify-center">
                    <div class="col-12 col-md-5">
                      <q-btn
                        :ripple="false"
                        @click="tab = 'forgot-password'"
                        flat
                        class="radius-10 full-width"
                        padding="12px 12px"
                        color="black"
                        text-color="grey-7"
                        unelevated
                      >
                        Passwort vergessen
                      </q-btn>
                    </div>
                  </div>
                </div>
              </div>
            </q-form>
          </q-card-section>
        </q-tab-panel>

        <q-tab-panel class="no-padding" name="forgot-password">
          <div class="row">
            <q-btn
              @click="tab = 'login'"
              round
              flat
              color="primary"
              icon="arrow_back"
            />
          </div>
          <q-card-section class="q-pt-none">
            <q-form
              @submit.prevent="resetPassword"
              ref="forgotPasswordForm"
              class="q-mt-xs q-gutter-lg"
            >
              <div class="row">
                <div class="col-12">
                  <p class="q-mb-sm font-16">Email</p>
                  <q-input
                    outlined
                    dense
                    ref="resetPasswordEmail"
                    class="no-shadow input-radius-6"
                    v-model="resetForm.email"
                    :rules="[val => !!val || 'Erforderlich']"
                  />
                </div>
              </div>
              <div class="row q-mt-none">
                <p class="no-margin text-red text-center full-width">
                  {{ errorMsg }}
                </p>
              </div>
              <div class="row justify-center">
                <div class="col-12 col-md-6 text-center">
                  <q-btn
                    type="submit"
                    class="radius-10 full-width"
                    padding="12px 12px"
                    color="yellow"
                    text-color="black"
                    unelevated
                    :loading="isLoading"
                    >Passwort zurücksetzen</q-btn
                  >
                </div>
              </div>
            </q-form>
          </q-card-section>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "loginDialog",
  props: {
    dialogState: { type: Boolean, default: false }
  },
  data() {
    return {
      tab: "login",
      form: {
        identifier: "",
        password: ""
      },
      resetForm: {
        email: ""
      },
      errorMsg: "",
      isLoading: false
    };
  },
  methods: {
    async login() {
      this.$refs.loginForm.validate().then(async success => {
        if (success) {
          this.isLoading = true;
          const res = await this.$store.dispatch("userCenter/login", this.form);
          this.isLoading = false;
          this.errorMsg = res;
          if (res === true) {
            this.$_options = false;
            this.isLoading = false;
            this.errorMsg = "";
          }
        } else {
          const elements = this.$refs.loginForm.getValidationComponents();
          elements.map(el => {
            if (el.validate) {
              el.validate();
            }
          });
        }
      });
    },
    async resetPassword() {
      this.$refs.forgotPasswordForm.validate().then(async success => {
        if (success) {
          this.isLoading = true;
          let res = null;
          try {
            await this.$api.post("/api/auth/forgot-password", {
              email: this.resetForm.email
            });
            this.$q.notify({
              message:
                "Vielen Dank. Wir schicken Ihnen einen Link an die in Ihrem Benutzer*innenaccount hinterlegte Email-Adresse. Dann können Sie Ihr Password zurück setzen.",
              type: "positive"
            });
            res = true;
          } catch (error) {
            console.log("error :>> ", error.response);
            this.$q.notify({
              type: "negative",
              message: error.response.data.error.message
            });
            res = false;
          }
          this.isLoading = false;
          if (res === true) {
            this.tab = "login";
            this.resetForm.email = "";
          }
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
        this.form.identifier = "";
        this.form.password = "";
        this.resetForm.email = "";
        this.tab = "login";
        this.errorMsg = "";
        this.isLoading = false;
      }
    },
    loginMessages() {
      return this.$store.state.userCenter.loadingMessages;
    }
  }
};
</script>

<style></style>
