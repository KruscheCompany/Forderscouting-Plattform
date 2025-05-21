<template>
  <q-dialog
    v-model="alert"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card class="radius-sm bg-BAgrey text-BAblue text-center">
      <q-card-section>
        <div class="text-h5 q-my-md text-red">
          {{ $t("An Error Has Happened") }}
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <h5 class="q-my-md">{{ errorMsg.title }}</h5>
        <p class="text-subtitle1">{{ errorMsg.detail }}</p>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="OK"
          color="primary"
          v-close-popup
          @click="resetError"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  data() {
    return {
      alert: false
    };
  },
  computed: {
    isError() {
      return this.$store.state.errorDialog.activeError;
    },
    errorMsg() {
      return this.$store.state.errorDialog.errorMsg;
    }
  },
  watch: {
    isError(newVal, oldVal) {
      if (newVal) this.alert = true;
      else this.alert = false;
    },
    errorMsg() {}
  },
  methods: {
    resetError() {
      this.$store.commit("errorDialog/showError", { active: false, msg: "" });
    }
  }
};
</script>

<style></style>
