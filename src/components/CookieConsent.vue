<template>
  <transition name="fade">
    <q-card
      v-if="showCookieBox"
      class="z-top fixed-bottom full-width q-mx-auto q-pa-lg shadow-2"
      :style="$q.screen.lt.md ? 'max-height:60vh; overflow: scroll' : ''"
    >
      <div class="row justify-center">
        <div class="col-12 col-md-10">
          <div class="row items-center">
            <div class="col-12 col-md-8">
              <q-card-section class="q-pb-none">
                <div class="row justify-between">
                  <div class="col-12 col-md-6">
                    <p class="no-margin font-24">
                      {{ $t("This website uses Cookies") }}
                    </p>
                  </div>
                </div>
              </q-card-section>
              <q-card-section class="">
                <div class="row">
                  <div class="col-12">
                    {{ $t("cookieMain") }}
                    <br />
                    <br />
                    <p class="no-margin">{{ $t("byAcceptingYouAgree") }}</p>
                  </div>
                </div>
                <router-link
                  style="text-decoration: none"
                  class="text-primary q-mt-sm block"
                  :to="{ path: '/impressum' }"
                  target="_blank"
                >
                  {{ $t("imprint") }}
                </router-link>
                <router-link
                  style="text-decoration: none"
                  class="text-primary q-mt-sm block"
                  :to="{ path: '/datenschutzerklaerung' }"
                  target="_blank"
                >
                  {{ $t("dataProtectionDeclaration") }}
                </router-link>
              </q-card-section>
            </div>
            <div class="col-12 col-md-4">
              <q-card-section class="">
                <div class="col-12">
                  <q-btn
                    @click="onAccept('preferences')"
                    padding="10px 0"
                    unelevated
                    color="primary"
                    class="shadow-0 full-width"
                  >
                    {{ $t("acceptMyPrefrences") }}
                  </q-btn>
                </div>
                <div class="col-12 q-mt-sm">
                  <q-btn
                    @click="onAccept('essential')"
                    padding="10px 0"
                    unelevated
                    color="grey-6"
                    class="shadow-0 full-width"
                  >
                    {{ $t("acceptEssentials") }}
                  </q-btn>
                </div>
              </q-card-section>
            </div>
            <div class="col-12">
              <q-card-section>
                <div class="row q-col-gutter-x-md justify-between items-center">
                  <div class="col-auto">
                    <div class="row">
                      <div class="col-auto">
                        <q-toggle
                          size="xl"
                          color="primary"
                          v-model="essential"
                          disable
                          :label="$t('essential')"
                          left-label
                        />
                      </div>
                      <div class="col-auto">
                        <q-toggle
                          size="xl"
                          color="primary"
                          v-model="userPreferences"
                          :label="$t('userPrefrence')"
                          left-label
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col-auto">
                    <div class="row">
                      <div class="col-auto">
                        <q-btn
                          class="radius-6"
                          outline
                          color="primary"
                          @click="expanded = !expanded"
                          label="Details"
                          :icon-right="expanded ? 'expand_less' : 'expand_more'"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    <q-expansion-item
                      header-class="hidden"
                      expand-icon="0"
                      v-model="expanded"
                    >
                      <q-card>
                        <q-card-section class="q-pl-none">
                          <h3 class="font-20 q-ma-none ">
                            {{ $t("essential") }}
                          </h3>
                          {{ $t("essenitialDesc") }}
                        </q-card-section>
                        <q-card-section class="q-pl-none">
                          <h3 class="font-20 q-ma-none ">
                            {{ $t("userPrefrence") }}
                          </h3>
                          {{ $t("userPrefrenceDesc") }}
                        </q-card-section>
                      </q-card>
                    </q-expansion-item>
                  </div>
                </div>
              </q-card-section>
            </div>
          </div>
        </div>
      </div>
    </q-card>
  </transition>
</template>

<script>
import Cookies from "js-cookie";
export default {
  name: "cookieConsent",
  data() {
    return {
      essential: true,
      userPreferences: false,
      expanded: false
    };
  },
  methods: {
    async onAccept(val) {
      const consent = {
        essential: true,
        prefrences: val !== "essential" ? this.userPreferences : false,
        version: "2.0.0",
        timestamp: new Date().toISOString(),
      };

      Cookies.set("consent", JSON.stringify(consent), {
        expires: 365,
        secure: window.location.protocol === "https:",
        sameSite: "Lax",
      });

      if (this.$store.getters["userCenter/isSignedIn"]) {
        try {
          await this.$api.put("/api/users/me", { consent });
          await this.$store.dispatch("userCenter/getUserInfo");
        } catch (error) {
          this.$q.notify({
            type: "negative",
            message: error?.response?.data?.error?.message || "Fehler beim Speichern."
          });
        }
      }

      if (!consent.prefrences) {
        localStorage.clear();
      }

      this.$store.commit("userCenter/changeShowCookieBox", false);
    },
    async checkConsentStatus() {
      const cookieStatus = Cookies.get("consent");
      if (!cookieStatus) {
        this.$store.commit("userCenter/changeShowCookieBox", true);
      } else {
        const cookie = JSON.parse(cookieStatus);
        const consentData = cookie.consent || {};
        if (consentData.version !== "2.0.0") {
          this.$store.commit("userCenter/changeShowCookieBox", true);
          return;
        }
        this.$store.commit("userCenter/changeShowCookieBox", false);
        this.getCookieDetails();
      }
    },
    getCookieDetails() {
      const userInfo = this.$store.state.userCenter.user?.user;
      if (userInfo?.consent) {
        this.essential = userInfo.consent.essential ?? true;
        this.userPreferences = userInfo.consent.prefrences ?? false;
        return;
      }
      const cookie = Cookies.get("consent");
      if (cookie) {
        try {
          const parsed = JSON.parse(cookie);
          this.essential = parsed.essential ?? true;
          this.userPreferences = parsed.prefrences ?? false;
        } catch (e) {
          // malformed cookie — ignore
        }
      }
    }
  },
  async mounted() {
    if (navigator.globalPrivacyControl === true) {
      this.userPreferences = false;
      await this.onAccept("essential");
      return;
    }
    this.checkConsentStatus();
  },
  watch: {
    showCookieBox(newVal, oldVal) {
      if (newVal === true) {
        this.getCookieDetails();
      }
    }
  },
  computed: {
    showCookieBox() {
      return this.$store.state.userCenter.showCookieBox;
    }
  }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
