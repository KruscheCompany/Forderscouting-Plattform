<template>
  <q-layout view="lhh lpR fFf">
    <q-header class="bg-primary text-white no-shadow">
      <q-toolbar class="q-py-sm">
        <q-avatar size="3.5rem" style="border-radius: 0;">
          <img src="../assets/Logo.svg" alt="logo" />
        </q-avatar>
        <div class="q-ml-sm">
          <div class="font-16 ppeditorial">Projektkompass Kommune</div>
          <div class="font-11 text-blue-grey-2" style="letter-spacing: 0.03em; text-transform: uppercase;">
            {{ $t('reviewPage.headerSubtitle') }}
          </div>
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "ReviewLayout"
};
</script>

<style scoped>
@media print {
  .q-header {
    display: none;
  }
}
</style>
