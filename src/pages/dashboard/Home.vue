<template>
  <q-page class="q-mt-lg" :class="$q.screen.gt.sm ? 'q-mx-xl' : 'q-mx-sm'">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-3">
        <q-btn color="blue" icon="search" unelevated class="mr-0 radius-6 text-weight-600"
          :class="{ 'full-width': $q.screen.lt.md }" no-caps to="/overview">
          <p class="q-mb-none q-mx-md q-my-sm">
            {{ $t("homeBtns.SearchBtn") }}
          </p>
        </q-btn>
      </div>
      <div class="col-12 col-md-9">
        <div class="row q-col-gutter-md justify-end">
          <div class="col-12 col-md-auto" v-if="isAdmin">
            <q-btn color="blue" icon="drive_folder_upload" unelevated outline class="mr-0 radius-6 text-weight-600"
              :class="{ 'full-width': $q.screen.lt.md }" no-caps @click="openImportFunding">
              <p class="q-mb-none q-mx-md q-my-sm">
                {{ $t("homeBtns.importFundingBtn") }}
              </p>
            </q-btn>
          </div>
          <div v-if="isAdmin" class="col-12 col-md-auto">
            <q-btn color="blue" icon="add" unelevated outline class="mr-0 radius-6 text-weight-600"
              :class="{ 'full-width': $q.screen.lt.md }" no-caps @click="$router.push({ path: '/user/newFunding' })">
              <p class="q-mb-none q-mx-md q-my-sm">
                {{ $t("homeBtns.fundingsBtn") }}
              </p>
            </q-btn>
          </div>
          <div class="col-12 col-md-auto" v-if="!isGuest">
            <q-btn color="blue" icon="add" unelevated outline class="mr-0 radius-6 text-weight-600"
              :class="{ 'full-width': $q.screen.lt.md }" no-caps @click="$router.push({ path: '/user/newChecklist' })">
              <p class="q-mb-none q-mx-md q-my-sm">
                {{ $t("homeBtns.checkListBtn") }}
              </p>
            </q-btn>
          </div>
        </div>
      </div>
    </div>

    <div>
      <fundingInfo />
    </div>
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <myCommunityData v-if="isGuest" />
        <dataOverview v-else />
      </div>
      <div class="col-12 col-md-6">
        <watchlist />
      </div>
    </div>
    <div v-if="false">
      <network />
    </div>
    <div v-if="isAdmin">
      <importFunding :showDialog="showImportFunding" @update:showDialog="showImportFunding = $event" />
    </div>
  </q-page>
</template>

<script>
import fundingInfo from "components/funding/info.vue";
import dataOverview from "components/data/overview.vue";
import myCommunityData from "components/data/myCommunityData.vue";
import watchlist from "components/watchlist/overview.vue";
import network from "components/network/overview.vue";
import importFunding from "components/funding/ImportFunding.vue";

export default {
  name: "index",
  components: {
    fundingInfo,
    dataOverview,
    myCommunityData,
    watchlist,
    network,
    importFunding
  },
  data() {
    return {
      showImportFunding: false,
    };
  },
  computed: {
    isAdmin() {
      return this.$store.getters["userCenter/isAdmin"];
    },
    isGuest() {
      return this.$store.getters["userCenter/isGuest"];
    },
  },
  methods: {
    openImportFunding() {
      this.showImportFunding = true;
    },
  },
};
</script>
