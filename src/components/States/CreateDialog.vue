<template>
  <q-dialog @before-show="getStateInfo" v-model="$_options">
    <q-card class="q-pa-md radius-10" style="width: 532px; max-width: 90vw;">
      <div>
        <h6 class="text-center font-24 q-mt-md">
          {{
            !!editingId
              ? $t("editState")
              : $t("administrativeAreas.createState")
          }}
        </h6>
        <q-form
          @submit.prevent="
            !!editingId ? editState() : createState()
          "
          class="q-gutter-sm q-px-md q-mb-md"
        >
          <div class="items-center">
            <div class="col-12 col-md-3">
              <p class="font-14 no-margin">
                {{ $t("myData.title") }}
              </p>
            </div>
            <div class="col-12 col-md-9">
              <q-input
                outlined
                class="no-shadow input-radius-6"
                v-model="form.title"
                :rules="[val => !!val || $t('Required')]"
                :placeholder="$t('administrativeAreas.stateName')"
              />
            </div>
          </div>
          <div class="items-center">
            <div class="col-12 col-md-3 ">
              <p class="font-14 no-margin ">
                {{ $t("userAdministration.administration") }}
              </p>
            </div>
            <div class="col-12 col-md-9">
              <MunicipalitySelect
                :currentMunicipality="form.municipality"
                @update:municipality="form.municipality = $event"
              />
            </div>
          </div>
          <div class="row justify-center">
            <div class="col-5 q-mr-sm">
              <q-btn
                :label="$t('category&Keyword.cancel')"
                outline
                v-close-popup
                size="16px"
                color="primary"
                no-caps
                class="no-shadow q-py-xs full-width radius-6"
              />
            </div>
            <div class="col-5 q-ml-sm">
              <q-btn
                :label="
                  !!editingId
                    ? $t('fundingTableOptions.edit')
                    : $t('category&Keyword.save')
                "
                type="submit"
                unelevated
                size="16px"
                color="primary"
                no-caps
                class="no-shadow q-py-xs full-width radius-6"
                :loading="isLoading"
              />
            </div>
          </div>
        </q-form>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import MunicipalitySelect from "components/Municipality/MunicipalitySelect.vue";
export default {
  name: "createStateDialog",
  props: {
    dialogState: { type: Boolean, default: false },
    editingId: { type: Number, default: null }
  },
  components: {
    MunicipalitySelect
  },
  data() {
    return {
      form: {
        title: "",
        municipality: { id: null, title: "" }
      },
      state: {},
      isLoading: false
    };
  },
  methods: {
    async createState() {
      if (!!this.form.title && !!this.form.municipality) {
        this.isLoading = true;
        const res = await this.$store.dispatch(
          "municipality/createState",
          this.form
        );
        this.isLoading = false;
        if (res !== false) {
          this.$_options = false;
          this.form.title = "";
          this.form.municipality = { id: null, title: "" };
        }
      } else {
        this.$q.notify({
          type: "negative",
          message: "Bitte füllen Sie alle Felder aus"
        });
      }
    },
    async editState() {
      if (!!this.form.title && this.form.municipality && !!this.editingId) {
        if (
          this.form.title !== this.state.title ||
          this.form.municipality.id !== this.state.municipality.id
        ) {
          this.isLoading = true;
          const res = await this.$store.dispatch(
            "municipality/editState",
            {
              id: this.editingId,
              title: this.form.title,
              municipality: this.form.municipality.id
            }
          );
          this.isLoading = false;
          if (res !== false) {
            this.$_options = false;
            this.form.title = "";
            this.form.municipality = { id: null, title: "" };
          }
        } else {
          this.$q.notify({
            type: "negative",
            message: "Bitte wählen Sie einen anderen Titel oder anderen Ort aus"
          });
        }
      }
    },
    async getStateInfo() {
      if (!!this.editingId) {
        const state = this.$store.state.municipality.states.find(
          mun => {
            return mun.id === this.editingId;
          }
        );
        if (state) {
          this.state = state;
          this.form.title = state.title;
          this.form.municipality = {
            id: state.municipality.id,
            title: state.municipality.title
          };
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
        this.form.title = "";
        this.form.municipality = 0;
        this.$emit("update", val);
      }
    }
  }
};
</script>

<style></style>
