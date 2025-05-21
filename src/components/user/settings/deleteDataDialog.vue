<template>
  <q-dialog v-model="$_options">
    <q-card class="q-px-xl radius-10 column">
      <q-card-section align="center">
        <h6 class="text-center font-20 q-mt-md q-mb-none">
          {{ $t("generalData.deleteGeneralData") }}
        </h6>
      </q-card-section>
      <q-card-section align="left">
        <div class=" items-center text-center ">
          <p>
            {{ $t("delteDataInfo") }}
          </p>
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none text-center">
        <div class="row justify-center q-ml-lg ">
          <q-btn
            :label="$t('userAdministration.cancel')"
            outline
            v-close-popup
            size="14px"
            color="primary"
            no-caps
            class="no-shadow radius-6 q-px-xl  q-mr-sm "
          />
          <q-btn
            :label="$t('category&Keyword.deletePopupButton')"
            unelevated
            size="14px"
            color="red"
            no-caps
            class="no-shadow radius-6 q-px-xl q-py-sm"
            @click="deleteUser"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "deleteDataDialog",
  props: {
    dialogState: { type: Boolean, default: false },
    fromId: { type: String, default: "" }
  },
  data() {
    return {
      isLoading: false
    };
  },
  methods: {
    async deleteUser() {
      const fromId = this.fromId.length > 0 ? this.fromId : this.user.id;
      this.isLoading = true;
      const res = await this.$store.dispatch("userCenter/deleteUser", {
        id: fromId,
        admin: this.fromId.length > 0
      });
      if (this.fromId.length > 0 && this.$router.currentRoute.path != "/Administation/User") {
        this.$router.push({ path: `/Administation/User` });
      }
      this.isLoading = false;
      if (res !== false) {
        this.$_options = false;
      }
    }
  },
  computed: {
    $_options: {
      get: function() {
        return this.dialogState;
      },
      set: function(val) {
        this.$emit("update", val);
      }
    },
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
