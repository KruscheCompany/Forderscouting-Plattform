<template>
  <q-layout view="lhh lpR fFf">
    <q-header
      :class="{ dimmed: loginDialog }"
      class="light-blue text-white no-shadow"
    >
      <q-toolbar class="q-my-sm navContainer ">
        <!-- TODO Fix toolbar title taking full width -->
        <q-toolbar-title>
          <q-btn
            v-if="$q.screen.gt.sm"
            unelevated
            no-caps
            flat
            size="lg"
            :ripple="false"
            :to="{ name: 'landing' }"
            class="light-blue"
          >
          <q-avatar size="250px" style="height: 100px; border-radius: 0px;">
            <img src="../assets/Logo.svg" alt="logo">
          </q-avatar>
          </q-btn>
          <q-btn
            v-if="$q.screen.lt.md"
            round
            icon="home"
            flat
            size="md"
            :to="{ name: 'landing' }"
            aria-label="Home"
          />
        </q-toolbar-title>
        <q-btn
          @click="loginDialog = true"
          color="yellow"
          unelevated
          class="q-mr-sm radius-6"
          no-caps
        >
          <p class="q-mb-none text-blue q-mx-sm q-my-xs"
          :style="$q.screen.lt.sm ? 'font-size: 11px;' : ''"
          >
            Login
          </p>
        </q-btn>
        <q-btn
            @click="signupDialogState = true"
            color="yellow"
            unelevated
            class="mr-0 radius-6"
            no-caps
          >
            <p class="q-mb-none text-blue q-my-xs" :style="$q.screen.lt.sm ? 'font-size: 11px;' : ''">Registrierung Gastzugang</p>
        </q-btn>
      </q-toolbar>
    </q-header>
    <LoginDialog :dialogState="loginDialog" @update="loginDialog = $event" />
    <signupDialog
      :dialogState="signupDialogState"
      @update="signupDialogState = $event"
    />
    <q-page-container>
      <router-view :class="{ dimmed: loginDialog }" />
      <div v-if="$router.currentRoute.path != '/'" class="bg-yellow-10 q-py-xl">
        <div class="row container">
          <div v-if="$q.screen.gt.sm" class="col-2">
            <img src="folder.svg" alt="folder icon" />
          </div>
          <div
            class="col self-center font-18"
            :class="$q.screen.lt.md ? 'text-center' : ''"
          >
            <p>
              Wenn Sie weitere Dokumente sowie Checklisten sehen möchten, dann
              registrieren Sie sich.
            </p>
            <q-btn
              @click="signupDialogState = true"
              color="blue"
              unelevated
              class="mr-0 radius-6"
              no-caps
            >
              <p class="q-mb-none q-my-xs">Registrierung Gastzugang</p>
            </q-btn>
          </div>
        </div>
      </div>
      <div class="text-center text-white font-16 q-py-md"  style="background-color: #40407B;">
        {{ currentYear }} © Amt Viöl. All rights reserved
        <p
          @click="showCookieBox"
          class="q-ml-md inline-block cursor-pointer text-blue-grey-1"
        >
          Cookie-Einstellungen ändern
        </p>
        <p
          @click="$router.push({ path: '/impressum' })"
          class="q-ml-md inline-block cursor-pointer text-blue-grey-1"
        >
          Impressum
        </p>
        <p
          @click="$router.push({ path: '/datenschutzerklaerung' })"
          class="q-ml-md inline-block cursor-pointer text-blue-grey-1"
        >
          Datenschutzerklaerung
        </p>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import { date } from "quasar";
import LoginDialog from "components/user/authentication/LoginDialog.vue";
import signupDialog from "components/user/authentication/signupDialog.vue";
export default {
  name: "MainLayout",
  components: {
    LoginDialog,
    signupDialog
  },
  data() {
    return {
      currentYear: date.formatDate(Date.now(), "YYYY"),
      loginDialog: false,
      signupDialogState: false
    };
  },
  methods: {
    showCookieBox() {
      this.$store.commit("userCenter/changeShowCookieBox", true);
    }
  }
};
</script>
<style scoped>
@media only screen and (min-width: 600px) {
  .navContainer {
    padding: 0 135px !important;
  }
}
</style>
