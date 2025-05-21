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
                  Impressum
                </router-link>
                <router-link
                  style="text-decoration: none"
                  class="text-primary q-mt-sm block"
                  :to="{ path: '/datenschutzerklaerung' }"
                  target="_blank"
                >
                  Datenschutzerklaerung
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
                    outline
                    color="primary"
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
      let consent = {
        essential: this.essential,
        prefrences: this.userPreferences,
        version: "1.0.0"
      };
      if (val === "essential") {
        consent.prefrences = false;
      }
      if (consent.prefrences === false) {
        localStorage.clear();
      }
      const consentCookie = Cookies.get("consent");
      if (!!consentCookie) {
        const cookie = JSON.parse(consentCookie);
        console.log("cookie", cookie);
        if (cookie.hasOwnProperty("cKey")) {
          console.log("update");
          const instance = this.$api.create();
          delete instance.defaults.headers.common["Authorization"];
          try {
            const res = await instance.put(`/api/data-concents/1`, {
              data: {
                key: cookie.cKey,
                consent: consent
              }
            });
            Cookies.set("consent", JSON.stringify(res.data), {
              expires: 365,
              secure: this.APP_URL !== "188" ? true : false,
              sameSite: this.APP_URL !== "188" ? "None" : "Lax"
            });
            // this.checkConsentStatus();
            location.reload();
          } catch (error) {
            this.$q.notify({
              type: "negative",
              message: error.response.data.error.message
            });
            this.loading = false;
          }
        } else {
          console.log("create");
          const instance = this.$api.create();
          delete instance.defaults.headers.common["Authorization"];
          try {
            const res = await instance.put(`/api/data-concents/1`, {
              data: {
                key: cookie,
                consent: consent
              }
            });
            Cookies.set("consent", JSON.stringify(res.data), {
              expires: 365,
              secure: this.APP_URL !== "188" ? true : false,
              sameSite: this.APP_URL !== "188" ? "None" : "Lax"
            });
            // this.checkConsentStatus();
            location.reload();
          } catch (error) {
            this.$q.notify({
              type: "negative",
              message: error.response.data.error.message
            });
            this.loading = false;
          }
        }
      } else {
        console.log("create key and update");
        const instance = this.$api.create();
        delete instance.defaults.headers.common["Authorization"];
        try {
          const res = await instance.get("/api/concent/key");
          Cookies.set("consent", JSON.stringify(res.data.key), {
            expires: 365,
            secure: this.APP_URL !== "188" ? true : false,
            sameSite: this.APP_URL !== "188" ? "None" : "Lax"
          });
          const updateRes = await instance.put(`/api/data-concents/1`, {
            data: {
              key: res.data.key,
              consent: consent
            }
          });
          Cookies.set("consent", JSON.stringify(updateRes.data), {
            expires: 365,
            secure: this.APP_URL !== "188" ? true : false,
            sameSite: this.APP_URL !== "188" ? "None" : "Lax"
          });
          this.checkConsentStatus();
        } catch (error) {
          this.$q.notify({
            type: "negative",
            message: error.response.data.error.message
          });
          this.loading = false;
        }
      }
    },
    async checkConsentStatus() {
      const cookieStatus = Cookies.get("consent");
      if (!cookieStatus) {
        console.log("consent not found");
        this.$store.commit("userCenter/changeShowCookieBox", true);
      } else {
        console.log("consent found, check specific cookie");
        this.$store.commit("userCenter/changeShowCookieBox", false);
        this.getCookieDetails();
      }
    },
    async getCookieDetails() {
      const consentCookie = Cookies.get("consent");
      if (!!consentCookie) {
        const cookie = JSON.parse(Cookies.get("consent"));
        console.log("cookie", cookie);
        if (cookie.hasOwnProperty("cKey")) {
          console.log("update");
          const instance = this.$api.create();
          delete instance.defaults.headers.common["Authorization"];
          try {
            const res = await instance.post(`/api/concent/findKey`, {
              data: {
                key: cookie.cKey
              }
            });
            console.log("resssss", res);
            Cookies.set("consent", JSON.stringify(res.data[0]), {
              expires: 365,
              secure: this.APP_URL !== "188" ? true : false,
              sameSite: this.APP_URL !== "188" ? "None" : "Lax"
            });
            this.essential = res.data[0].consent.essential;
            this.userPreferences = res.data[0].consent.prefrences;
          } catch (error) {
            this.$q.notify({
              type: "negative",
              message: error.response.data.error.message || ""
            });
            this.loading = false;
          }
        } else {
          console.log("create");
          const instance = this.$api.create();
          delete instance.defaults.headers.common["Authorization"];
          try {
            const res = await instance.post(`/api/concent/findKey`, {
              data: {
                key: cookie
              }
            });
            Cookies.set("consent", JSON.stringify(res.data[0]), {
              expires: 365,
              secure: this.APP_URL !== "188" ? true : false,
              sameSite: this.APP_URL !== "188" ? "None" : "Lax"
            });
            this.essential = res.data[0].consent.essential;
            this.userPreferences = res.data[0].consent.prefrences;
            console.log("resssss", res);
          } catch (error) {
            this.$q.notify({
              type: "negative",
              message: error.response.data.error.message || ""
            });
            this.loading = false;
          }
        }
      }
    }
  },
  mounted() {
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
    },
    APP_URL() {
      return window.location.hostname.substring(0, 3);
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
