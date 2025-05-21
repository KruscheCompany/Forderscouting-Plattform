<template>
  <q-dialog @before-show="setData" v-model="$_options">
    <q-card class="q-pa-md radius-10" style="width: 532px; max-width: 90vw;">
      <q-form @submit.prevent="addCaption()">
        <q-card-section class="q-pt-none" align="center">
          <h6 class="text-center font-20 q-mt-md q-mb-none">
            {{
              !!image && !!image.caption
                ? $t("Edit Caption")
                : $t("Add Caption")
            }}
          </h6>
        </q-card-section>
        <q-card-section class="q-pb-none">
          <div class=" items-center ">
            <div class="col-12 col-md-3">
              <p class="font-14 no-margin">
                {{ $t("Add caption or credit the author") }}
              </p>
            </div>
            <div class="col-12 col-md-9">
              <q-input
                outlined
                class="no-shadow input-radius-6"
                v-model="captionInput"
                :placeholder="$t('myData.title')"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row justify-center">
            <div class="col-5 q-mr-sm">
              <q-btn
                :label="$t('category&Keyword.cancel')"
                v-close-popup
                outline
                size="14px"
                color="primary"
                no-caps
                class="q-py-xs radius-6 full-width"
              />
            </div>
            <div class="col-5 q-ml-sm">
              <q-btn
                :label="$t('category&Keyword.save')"
                type="submit"
                unelevated
                :loading="isLoading"
                size="14px"
                color="primary"
                no-caps
                class="q-py-xs radius-6 full-width"
              />
            </div>
          </div>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "captionDialog",
  props: {
    dialogState: { type: Boolean, default: false },
    imageIndex: { type: Number, default: null },
    image: { type: [File, Object], default: () => null },
    type: { type: String, default: "" },
    document: { type: Object, default: () => null }
  },
  data() {
    return {
      captionInput: "",
      isLoading: false
    };
  },
  methods: {
    async addCaption() {
      if (!!this.image && !!this.image.id && !!this.document) {
        try {
          await this.$api.put(`api/upload/caption/${this.image.id}`, {
            caption: this.captionInput,
            type: this.type,
            docId: this.document.id
          });
          this.$emit("add-caption", this.captionInput, this.imageIndex);
          this.$_options = false;
          this.$q.notify({
            type: "positive",
            message: this.$t("Caption updated")
          });
        } catch (error) {
          this.$q.notify({
            type: "negative",
            message: error.response.data.error.message
          });
        }
      } else {
        this.$emit("add-caption", this.captionInput, this.imageIndex);
        this.$_options = false;
      }
    },
    setData() {
      if (!!this.image && this.image.caption) {
        this.captionInput = this.image.caption;
      }
    }
  },
  computed: {
    $_options: {
      get: function() {
        return this.dialogState;
      },
      set: function(val) {
        this.captionInput = "";
        this.$emit("update", val);
      }
    }
  }
};
</script>
