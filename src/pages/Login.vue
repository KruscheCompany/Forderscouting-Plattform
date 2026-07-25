<template>
  <div class="login-page">
    <div class="login-page-row">
      <div class="login-side-panel">
        <div class="login-side-top">
          <img src="../assets/Logo.svg" alt="logo" class="login-side-logo">
        </div>

        <div class="login-side-middle">
          <p class="login-side-headline">{{ $t("fundingScoutingPlatform") }}</p>
          <p class="login-side-tagline">{{ $t("loginDialog.tagline") }}</p>
        </div>

        <p class="login-side-footer">{{ $t("loginDialog.sidePanelFooter") }}</p>
      </div>

      <div class="login-form-col">
        <div class="login-form-inner">
          <q-tab-panels v-model="tab" animated class="full-width">
            <q-tab-panel class="login-tab-panel" name="login">
              <p class="login-greeting no-margin">
                {{ $t("login") }}
              </p>
              <p class="login-subtitle text-grey-7">
                {{ $t("loginDialog.subtitle") }}
              </p>
              <q-form ref="loginForm" class="login-fields">
                <div class="row login-field-row-first">
                  <div class="col-12">
                    <p class="q-mb-sm login-label">{{ $t("projectIdeaPlaceholder.email") }}</p>
                    <q-input
                      @keyup.enter="login"
                      outlined
                      hide-bottom-space
                      class="no-shadow login-input"
                      v-model="form.identifier"
                      :rules="[val => !!val || 'Erforderlich']"
                    />
                  </div>
                  <div class="col-12 login-field-gap">
                    <div class="row items-baseline justify-between q-mb-sm">
                      <p class="no-margin login-label">{{ $t("password") }}</p>
                      <q-btn
                        :ripple="false"
                        @click="tab = 'forgot-password'"
                        flat
                        dense
                        no-caps
                        padding="0"
                        color="primary"
                        class="login-inline-link"
                      >
                        {{ $t("generalData.forgotPassword") }}
                      </q-btn>
                    </div>
                    <q-input
                      @keyup.enter="login"
                      outlined
                      type="password"
                      hide-bottom-space
                      class="no-shadow login-input"
                      v-model="form.password"
                      :rules="[val => !!val || 'Erforderlich']"
                    />
                  </div>
                </div>
                <div v-if="errorMsg" class="row login-error-row">
                  <p class="no-margin text-red text-center full-width">
                    {{ errorMsg }}
                  </p>
                </div>
                <div class="row justify-center login-field-row-first">
                  <div class="col-12 text-center">
                    <q-btn
                      :class="{ 'login-card-shake': shake }"
                      @click="login"
                      class="radius-10 full-width login-submit-btn"
                      no-caps
                      padding="14px 12px"
                      :color="loginSuccess ? 'positive' : 'yellow'"
                      :text-color="loginSuccess ? 'white' : 'black'"
                      unelevated
                      :loading="isLoading"
                    >
                      <q-icon v-if="loginSuccess" name="check" size="20px" />
                      <template v-else>{{ $t("login") }}</template>
                      <template v-slot:loading>
                        {{ loginMessages }}
                        <q-circular-progress
                          indeterminate
                          class="on-right"
                        /> </template
                    ></q-btn>
                  </div>
                </div>
              </q-form>
              <div class="login-guest-cta">
                {{ $t("loginDialog.noAccountYet") }}
                <router-link :to="{ name: 'Register' }" class="login-inline-link">
                  {{ $t("guestRegistration") }}
                </router-link>
              </div>
            </q-tab-panel>

            <q-tab-panel class="login-tab-panel" name="forgot-password">
              <q-btn
                @click="tab = 'login'"
                flat
                dense
                padding="4px"
                color="primary"
                icon="arrow_back"
                class="login-back-btn q-mb-sm"
              />
              <template v-if="!resetSuccess">
                <p class="login-greeting no-margin">
                  {{ $t("loginDialog.forgotPasswordTitle") }}
                </p>
                <p class="login-subtitle text-grey-7">
                  {{ $t("loginDialog.forgotPasswordSubtitle") }}
                </p>
                <q-form
                  @submit.prevent="resetPassword"
                  ref="forgotPasswordForm"
                  class="login-fields"
                >
                  <div class="row login-field-row-first">
                    <div class="col-12">
                      <p class="q-mb-sm login-label">{{ $t("projectIdeaPlaceholder.email") }}</p>
                      <q-input
                        outlined
                        ref="resetPasswordEmail"
                        hide-bottom-space
                        class="no-shadow login-input"
                        v-model="resetForm.email"
                        :rules="[val => !!val || 'Erforderlich']"
                      />
                    </div>
                  </div>
                  <div v-if="errorMsg" class="row login-error-row">
                    <p class="no-margin text-red text-center full-width">
                      {{ errorMsg }}
                    </p>
                  </div>
                  <div class="row justify-center login-field-row-first">
                    <div class="col-12 text-center">
                      <q-btn
                        type="submit"
                        class="radius-10 full-width login-submit-btn"
                        no-caps
                        padding="14px 12px"
                        color="yellow"
                        text-color="black"
                        unelevated
                        :loading="isLoading"
                        >{{ $t("generalData.resetPassword") }}</q-btn
                      >
                    </div>
                  </div>
                </q-form>
              </template>
              <template v-else>
                <div class="text-center q-py-md">
                  <q-icon
                    name="mail_outline"
                    size="48px"
                    color="primary"
                    class="reset-envelope"
                  />
                  <p class="login-greeting no-margin q-mt-sm">
                    {{ $t("loginDialog.checkInboxTitle") }}
                  </p>
                  <p class="text-grey-7 q-mb-md">
                    {{ $t("loginDialog.checkInboxMessage", { email: sentToEmail }) }}
                  </p>
                  <q-btn
                    flat
                    :ripple="false"
                    @click="resetSuccess = false"
                    color="black"
                    text-color="grey-7"
                    class="radius-10"
                    padding="8px 12px"
                  >
                    {{ $t("loginDialog.useAnotherEmail") }}
                  </q-btn>
                </div>
              </template>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
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
      isLoading: false,
      shake: false,
      loginSuccess: false,
      resetSuccess: false,
      sentToEmail: ""
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
            this.loginSuccess = true;
            this.errorMsg = "";
          } else {
            this.shake = true;
            setTimeout(() => {
              this.shake = false;
            }, 400);
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
            this.sentToEmail = this.resetForm.email;
            this.resetSuccess = true;
            this.resetForm.email = "";
          }
        }
      });
    }
  },
  computed: {
    loginMessages() {
      return this.$store.state.userCenter.loadingMessages;
    }
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #fff;
}
.login-page-row {
  display: flex;
  min-height: 100vh;
}
.login-form-col {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: #fff;
}
.login-form-inner {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 56px 60px;
}
.login-form-inner .q-tab-panels {
  max-width: 388px;
  width: 100%;
  animation: login-fade-up 0.4s ease-out;
}
.login-side-middle {
  animation: login-fade-up 0.4s ease-out;
}
.login-side-footer {
  animation: login-fade-up 0.4s ease-out 0.08s both;
}
.login-tab-panel {
  padding: 4px;
}
.login-fields {
  margin-top: 0;
}
.login-field-row-first {
  margin-top: 30px;
}
.login-field-gap {
  margin-top: 18px;
}
.login-error-row {
  margin-top: 12px;
}
.login-back-btn {
  margin-left: -4px;
}
.login-greeting {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 32px;
  font-weight: 700;
  color: #000055;
}
.login-subtitle {
  font-size: 14px;
  line-height: 1.5;
  margin-top: 8px;
}
.login-label {
  font-size: 13px;
  font-weight: 600;
  color: #000055;
}
.login-input >>> .q-field__control {
  height: 50px;
  border-radius: 10px;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.login-input >>> .q-field__native,
.login-input >>> .q-field__input {
  font-size: 15px;
}
.login-input.q-field--focused >>> .q-field__control {
  transform: scale(1.01);
  box-shadow: 0 0 0 3px rgba(0, 0, 85, 0.12);
}
.login-submit-btn {
  height: 52px;
  font-weight: 700;
  font-size: 16px;
}
.login-card-shake {
  animation: login-shake 0.4s ease;
}
.login-inline-link {
  color: #000055;
  font-weight: 600;
  font-size: 13px;
  text-decoration: none;
}
.login-inline-link:hover {
  text-decoration: underline;
}
.login-guest-cta {
  margin-top: 22px;
  padding-top: 22px;
  border-top: 1px solid #eef0f8;
  text-align: center;
  font-size: 13.5px;
  color: #6b74a0;
}
.reset-envelope {
  animation: login-envelope-in 0.5s ease;
}

.login-side-panel {
  position: relative;
  width: 42%;
  flex: 0 0 42%;
  background: #e8ecfb;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 44px 40px;
}
.login-side-logo {
  height: 30px;
}
.login-side-middle {
  max-width: 380px;
}
.login-side-headline {
  font-family: Georgia, "Times New Roman", serif;
  color: #000055;
  font-size: 34px;
  font-weight: 700;
  line-height: 1.15;
  margin: 0;
}
.login-side-tagline {
  color: #3a4788;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.6;
  margin-top: 18px;
  margin-bottom: 0;
}
.login-side-footer {
  color: #59639b;
  font-size: 12px;
  margin: 0;
}

@keyframes login-shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}
@keyframes login-envelope-in {
  0% { opacity: 0; transform: scale(0.7); }
  60% { opacity: 1; transform: scale(1.08); }
  100% { transform: scale(1); }
}
@keyframes login-fade-up {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

@media (max-width: 700px) {
  .login-side-panel {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .login-card-shake,
  .reset-envelope,
  .login-form-inner .q-tab-panels,
  .login-side-middle,
  .login-side-footer {
    animation: none !important;
  }
  .login-input >>> .q-field__control {
    transition: none !important;
  }
}
</style>
