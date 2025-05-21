<template>
  <q-dialog v-model="$_options">
    <q-card class="q-pa-lg radius-10">
      <q-card-section>
        <h6 class="text-center font-24 q-mt-none">
          {{ $t("deleteState") }}
        </h6>
        <p class="text-center text-weight-light">
          {{ $t("deleteStateMessage") }}
        </p>
      </q-card-section>
      <q-card-section>
        <div class="row justify-center q-ml-lg ">
          <q-btn
            :label="$t('category&Keyword.cancel')"
            outline
            v-close-popup
            size="16px"
            color="primary"
            no-caps
            class="no-shadow radius-6 q-px-xl q-mr-sm "
          />
          <q-btn
            :label="$t('approve')"
            type="submit"
            unelevated
            size="16px"
            color="red"
            no-caps
            class="no-shadow radius-6 q-px-xl"
            :loading="isLoading"
            @click="deleteState"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "deleteStateDialog",
  props: {
    dialogState: { type: Boolean, default: false },
    id: { type: Number, default: null }
  },
  data() {
    return {
      isLoading: false
    };
  },
  methods: {
    async deleteState() {
      if (!!this.id) {
        this.isLoading = true;
        const res = await this.$store.dispatch(
          "municipality/deleteState",
          { id: this.id }
        );
        this.isLoading = false;
        if (res !== false) {
          this.$_options = false;
        }
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
    }
  }
};
</script>

<style></style>
