<template>
  <q-dialog v-model="$_options">
    <q-card class="q-px-xl radius-10 column">
      <q-card-section align="center">
        <h6 class="text-center font-20 q-mt-md q-mb-none">
          {{
          tab == "Delete category"
          ? $t("category&Keyword.deleteCPopupTitle")
          : $t("category&Keyword.deleteKPopupTitle")
          }}
        </h6>
      </q-card-section>
      <q-card-section align="left">
        <div class=" items-center text-center ">
          <p>
            {{
            tab == "Delete category"
            ? $t("category&Keyword.deleteCPopupText")
            : $t("category&Keyword.deleteKPopupText")
            }}
          </p>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row justify-center q-ml-lg ">
          <q-btn :label="$t('category&Keyword.cancel')" outline v-close-popup size="14px" color="primary" no-caps
            class="no-shadow radius-6 q-px-xl  q-mr-sm " />
          <q-btn :label="$t('confirm')" unelevated :loading="isLoading" size="14px" color="red" no-caps
            class="no-shadow radius-6 q-px-xl q-py-sm" @click="deleteCategory" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "deleteCategoryKeywordDialog",
  props: {
    dialogState: { type: Boolean, default: false },
    tab: { type: String, default: "" },
    id: { type: Number, default: null }
  },
  data() {
    return {
      isLoading: false
    };
  },
  methods: {
    async deleteCategory() {
      if (!!this.id) {
        let res = null;
        this.isLoading = true;
        if (this.tab === "Delete category") {
          res = await this.$store.dispatch("category/deleteCategory", {
            id: this.id
          });
        } else {
          res = await this.$store.dispatch("tag/deleteTag", { id: this.id });
        }
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
