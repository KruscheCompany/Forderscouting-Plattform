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
          <div class="login-register-panel">
            <template v-if="!registerSuccess">
              <p class="login-greeting no-margin">
                {{ $t("guestRegistration") }}
              </p>
              <p class="login-subtitle text-grey-7">
                {{ $t("registerPage.subtitle") }}
              </p>
              <q-form ref="registerForm" class="login-fields">
                <div class="row login-field-row-first">
                  <div class="col-12">
                    <p class="q-mb-sm login-label">{{ $t("projectIdeaPlaceholder.name") }}</p>
                    <q-input
                      outlined
                      hide-bottom-space
                      class="no-shadow login-input"
                      v-model="form.name"
                      :rules="[val => !!val || 'Erforderlich']"
                    />
                  </div>
                  <div class="col-12 login-field-gap">
                    <p class="q-mb-sm login-label">{{ $t("projectIdeaPlaceholder.email") }}</p>
                    <q-input
                      @keyup.enter="signup"
                      outlined
                      hide-bottom-space
                      class="no-shadow login-input"
                      v-model="form.email"
                      :rules="[val => !!val || 'Erforderlich']"
                    />
                  </div>
                  <div class="col-12 login-field-gap login-select-field">
                    <p class="q-mb-sm login-label">{{ $t("personalData.administration") }}</p>
                    <Municipality :isRequired="true" @update:municipality="form.municipality = $event" />
                  </div>
                  <div class="col-12 login-field-gap login-select-field">
                    <p class="q-mb-sm login-label">{{ $t("personalData.location") }}</p>
                    <MunicipalityCities
                      :isRequired="true"
                      @update:city="form.location = $event"
                    />
                  </div>
                  <div class="col-12 login-field-gap login-select-field">
                    <p class="q-mb-sm login-label">{{ $t("projectIdeaPlaceholder.selectCategories") }}</p>
                    <Categories
                      :requiresValidation="false"
                      @update:category="form.categories = $event"
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
                      @click="signup"
                      class="radius-10 full-width login-submit-btn"
                      no-caps
                      padding="14px 12px"
                      color="yellow"
                      text-color="black"
                      unelevated
                      :loading="isLoading"
                    >
                      {{ $t("guestRegistration") }}
                      <template v-slot:loading>
                        <q-circular-progress
                          indeterminate
                          class="on-right"
                        /> </template
                    ></q-btn>
                  </div>
                </div>
              </q-form>
              <div class="login-guest-cta">
                {{ $t("registerPage.haveAccount") }}
                <router-link :to="{ name: 'Login' }" class="login-inline-link">
                  {{ $t("login") }}
                </router-link>
              </div>
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
                  {{ $t("registerPage.successTitle") }}
                </p>
                <p class="text-grey-7 q-mb-md">
                  {{ $t("registerPage.successMessage", { email: sentToEmail }) }}
                </p>
                <router-link :to="{ name: 'landing' }" class="login-inline-link">
                  {{ $t("home") }}
                </router-link>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MunicipalityCities from "components/Municipality/MunicipalityCities.vue";
import Municipality from "components/projects/create/Municipality.vue";
import Categories from "components/projects/create/Categories.vue";

export default {
  name: "Register",
  components: {
    MunicipalityCities,
    Municipality,
    Categories
  },
  data() {
    return {
      form: {
        name: "",
        email: "",
        location: "",
        municipality: null,
        categories: []
      },
      isLoading: false,
      errorMsg: "",
      registerSuccess: false,
      sentToEmail: ""
    };
  },
  methods: {
    async signup() {
      this.$refs.registerForm.validate().then(async success => {
        if (success) {
          this.isLoading = true;
          await this.register(this.form);
        } else {
          const elements = this.$refs.registerForm.getValidationComponents();
          elements.map(el => {
            if (el.validate) {
              el.validate();
            }
          });
        }
      });
    },
    async register(form) {
      try {
        const res = await this.$api.post("/api/guest-requests", {
          data: {
            name: form.name,
            email: form.email,
            location: form.location,
            municipality: {
              id: form.municipality
            },
            categories: form.categories
          }
        });
        this.isLoading = false;
        this.errorMsg = "";
        this.sentToEmail = form.email;
        this.registerSuccess = true;
        return res.data;
      } catch (error) {
        this.isLoading = false;
        this.errorMsg = error.response.data.error.message;
      }
    }
  },
  mounted() {
    this.$store.dispatch("municipality/getMunicipalitiesPublic");
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
.login-register-panel {
  max-width: 420px;
  width: 100%;
  padding: 4px;
  animation: login-fade-up 0.4s ease-out;
}
.login-side-middle {
  animation: login-fade-up 0.4s ease-out;
}
.login-side-footer {
  animation: login-fade-up 0.4s ease-out 0.08s both;
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
.login-select-field >>> .q-field__control {
  height: 50px !important;
  border-radius: 10px !important;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.login-select-field >>> .q-field__native,
.login-select-field >>> .q-field__input {
  font-size: 15px;
}
.login-select-field >>> .q-field--focused .q-field__control {
  transform: scale(1.01);
  box-shadow: 0 0 0 3px rgba(0, 0, 85, 0.12);
}
.login-submit-btn {
  height: 52px;
  font-weight: 700;
  font-size: 16px;
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
  .reset-envelope,
  .login-register-panel,
  .login-side-middle,
  .login-side-footer {
    animation: none !important;
  }
  .login-input >>> .q-field__control,
  .login-select-field >>> .q-field__control {
    transition: none !important;
  }
}
</style>
