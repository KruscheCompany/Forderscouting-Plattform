<template>
  <div>
    <h6 class="text-center font-24 q-mt-md">
      {{ $t("generalData.generalData") }}
    </h6>
    <q-form ref="generalDataForm" class="q-gutter-lg q-px-md q-mb-md">
      <div class="row items-center">
        <div class="col-12 col-md-4">
          <p class="font-16 no-margin">
            Email
          </p>
        </div>
        <div class="col-12 col-md-8">
          <q-input
            outlined
            class="no-shadow input-radius-6"
            v-model="user.email"
            :rules="[]"
            disable
          />
        </div>
      </div>
      <q-separator inset class="bg-blue opacity-10" />
      <div class="row items-center">
        <div class="col-md-4 col-12">
          <p class="font-16 no-margin">
            {{ $t("generalData.resetPassword") }}
          </p>
        </div>
        <div class="col-md-8 col-12">
          <q-btn
            @click="pwdResetDialog = true"
            outline
            no-caps
            size="16px"
            color="primary"
            class="text-weight-600 q-py-xs"
          >
            {{ $t("generalData.request") }}
          </q-btn>
        </div>
      </div>
      <q-separator inset class="bg-blue opacity-10" />
      <div class="row items-center">
        <div class="col-md-4 col-12">
          <p class="font-16 no-margin">
            {{ $t("generalData.transferData") }}
          </p>
        </div>
        <div class="col-md-8 col-12">
          <q-btn
            @click="transferDialog = true"
            outline
            no-caps
            size="16px"
            color="primary"
            class="text-weight-600 q-py-xs"
          >
            {{ $t("generalData.selectUser") }}
          </q-btn>
        </div>
      </div>
      <q-separator inset class="bg-blue opacity-10" />
      <div class="row items-center">
        <div class="col-12">
          <q-btn
            @click="deleteData = true"
            flat
            no-caps
            icon="delete"
            size="16px"
            color="red"
            class="text-red q-py-xs"
          >
            {{ $t("generalData.deleteGeneralData") }}
          </q-btn>
        </div>
      </div>
    </q-form>
    <TransferDialog
      :dialogState="transferDialog"
      @update="transferDialog = $event"
    />
    <resetPwdDialog
      :dialogState="pwdResetDialog"
      @update="pwdResetDialog = $event"
    />
    <deleteDataDialog :dialogState="deleteData" @update="deleteData = $event" />
  </div>
</template>

<script>
import TransferDialog from "components/user/settings/TransferDialog.vue";
import resetPwdDialog from "./resetPasswordDialog.vue";
import deleteDataDialog from "./deleteDataDialog.vue";
export default {
  name: "generalDataTab",
  components: {
    TransferDialog,
    resetPwdDialog,
    deleteDataDialog
  },
  data() {
    return {
      transferDialog: false,
      pwdResetDialog: false,
      deleteData: false,
      email: ""
    };
  },
  computed: {
    user() {
      return (
        !!this.$store.state.userCenter.user &&
        this.$store.state.userCenter.user.user
      );
    }
  }
};
</script>

<style></style>
