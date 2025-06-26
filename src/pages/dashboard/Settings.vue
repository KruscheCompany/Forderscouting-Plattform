<template>
  <q-page class="q-mt-lg" :class="$q.screen.gt.sm ? 'q-mx-xl' : 'q-mx-sm'">
    <q-tabs
      v-model="tab"
      align="justify"
      indicator-color="transparent"
      class="q-mb-lg text-black"
      active-bg-color="yellow"
      no-caps
    >
      <q-route-tab
        :to="{ query: { tab: 'generalData' } }"
        exact
        replace
        class="q-pa-lg q-mr-lg radius-10 border-yellow"
        name="generalData"
      >
        <p class="font-20 no-margin">{{ $t("settingsTab.generalData") }}</p>
      </q-route-tab>
      <q-route-tab
        :to="{ query: { tab: 'personalData' } }"
        exact
        replace
        class="q-pa-lg q-mr-lg radius-10 border-yellow"
        name="personalData"
      >
        <p class="font-20 no-margin">{{ $t("settingsTab.personalData") }}</p>
      </q-route-tab>
      <q-route-tab
        :to="{ query: { tab: 'notifications' } }"
        exact
        replace
        class="q-pa-lg q-mr-lg radius-10 border-yellow"
        name="notifications"
      >
        <p class="font-20 no-margin">{{ $t("settingsTab.notifications") }}</p>
      </q-route-tab>
    </q-tabs>

    <div class="overflow-hidden">
      <div class="row justify-center">
        <div class="col-12 col-lg-8 col-xl-7">
          <q-tab-panels class="radius-20 shadow-1 q-mb-xl" v-model="tab" animated>
            <q-tab-panel name="generalData">
              <GeneralData />
            </q-tab-panel>
            <q-tab-panel name="personalData">
              <PersonalData />
            </q-tab-panel>

            <q-tab-panel name="notifications">
              <Notifications />
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import GeneralData from "components/user/settings/GeneralData.vue";
import PersonalData from "components/user/settings/PersonalData.vue";
import Notifications from "components/user/settings/Notifications.vue";
export default {
  name: "settings",
  components: {
    GeneralData,
    PersonalData,
    Notifications,
  },
  data() {
    return {
      tab: this.$router.currentRoute.query.tab || "generalData",
    };
  },
  watch: {
    tab() {
      this.getData();
    },
  },
  methods: {
    getData() {
      this.$store.dispatch("userCenter/getUserDetails");
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style lang="scss">
.border-yellow {
  border: 2px solid $yellow;
}
</style>
