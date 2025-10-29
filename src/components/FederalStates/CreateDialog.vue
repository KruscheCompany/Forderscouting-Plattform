<template>
  <q-dialog @before-show="getFederalStateInfo" v-model="$_options">
    <q-card class="q-pa-md radius-10" style="width: 532px; max-width: 90vw;">
      <div>
        <h6 class="text-center font-24 q-mt-md">
          {{
            !!editingId
              ? $t("editFederalState")
              : $t("federalStates.createFederalState")
          }}
        </h6>
        <q-form @submit.prevent="
          !!editingId ? editFederalState() : createFederalState()
          " class="q-gutter-sm q-px-md q-mb-md">
          <div class="items-center">
            <div class="col-12 col-md-3">
              <p class="font-14 no-margin">
                {{ $t("myData.title") }}
              </p>
            </div>
            <div class="col-12 col-md-9">
              <q-input outlined class="no-shadow input-radius-6" v-model="form.title"
                :rules="[val => !!val || $t('Required')]" :placeholder="$t('federalStates.federalStateName')" />
            </div>
          </div>
          <div class="row q-col-gutter-sm">
            <div class="col">
              <q-btn :label="$t('category&Keyword.cancel')" outline v-close-popup size="16px" color="primary" no-caps
                class="no-shadow q-py-xs full-width radius-6" />
            </div>
            <div class="col">
              <q-btn :label="!!editingId
                ? $t('fundingTableOptions.edit')
                : $t('category&Keyword.save')
                " type="submit" unelevated size="16px" color="primary" no-caps
                class="no-shadow q-py-xs full-width radius-6" :loading="isLoading" />
            </div>
          </div>
        </q-form>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "createFederalStateDialog",
  props: {
    dialogState: { type: Boolean, default: false },
    editingId: { type: Number, default: null }
  },
  data() {
    return {
      form: {
        title: ""
      },
      federalState: {},
      isLoading: false
    };
  },
  methods: {
    async createFederalState() {
      if (!!this.form.title) {
        this.isLoading = true;
        const res = await this.$store.dispatch(
          "federalState/createFederalState",
          this.form
        );
        this.isLoading = false;
        if (res !== false) {
          this.$_options = false;
          this.form.title = "";
        }
      } else {
        this.$q.notify({
          type: "negative",
          message: "Bitte füllen Sie alle Felder aus"
        });
      }
    },
    async editFederalState() {
      if (!!this.form.title && !!this.editingId) {
        if (this.form.title !== this.federalState.title) {
          this.isLoading = true;
          const res = await this.$store.dispatch(
            "federalState/editFederalState",
            {
              id: this.editingId,
              title: this.form.title
            }
          );
          this.isLoading = false;
          if (res !== false) {
            this.$_options = false;
            this.form.title = "";
          }
        } else {
          this.$q.notify({
            type: "negative",
            message: "Bitte wählen Sie einen anderen Titel aus"
          });
        }
      }
    },
    async getFederalStateInfo() {
      if (!!this.editingId) {
        const federalStatesResponse = this.$store.state.federalState.federalStates;
        let federalStates = [];

        // Handle Strapi format
        if (federalStatesResponse && federalStatesResponse.data) {
          federalStates = federalStatesResponse.data;
        } else if (Array.isArray(federalStatesResponse)) {
          federalStates = federalStatesResponse;
        }

        if (!Array.isArray(federalStates)) {
          return;
        }

        const federalState = federalStates.find(
          fs => {
            return fs.id === this.editingId;
          }
        );

        if (federalState) {
          this.federalState = federalState;
          // Handle both Strapi format and direct format
          this.form.title = federalState.attributes ? federalState.attributes.title : federalState.title;
        }
      }
    }
  },
  computed: {
    $_options: {
      get: function () {
        return this.dialogState;
      },
      set: function (val) {
        this.form.title = "";
        this.$emit("update", val);
      }
    }
  },
  watch: {
    editingId: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.getFederalStateInfo();
        } else {
          this.form.title = "";
          this.federalState = {};
        }
      }
    }
  }
};
</script>

<style></style>
