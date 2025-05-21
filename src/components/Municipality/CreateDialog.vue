<template>
  <q-dialog @before-show="getMunicipalityInfo" v-model="$_options">
    <q-card class="q-pa-md radius-10" style="width: 532px; max-width: 90vw;">
      <div>
        <h6 class="text-center font-24 q-mt-md">
          {{
            !!editingId
              ? $t("editAdministration")
              : $t("administrativeAreas.createAdministration")
          }}
        </h6>
        <q-form
          @submit.prevent="
            !!editingId ? editMunicipality() : createMunicipality()
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
                :placeholder="$t('administrativeAreas.administrationName')"
              />
            </div>
          </div>
          <div class="items-center">
            <div class="col-12 col-md-3 ">
              <p class="font-14 no-margin ">
                {{ $t("personalData.location") }}
              </p>
            </div>
            <div class="col-12 col-md-9">
              <q-input
                outlined
                class="no-shadow input-radius-6"
                v-model="form.location"
                :rules="[val => !!val || $t('Required')]"
                :placeholder="$t('adminstrationLocation')"
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
export default {
  name: "createMunicipalityDialog",
  props: {
    dialogState: { type: Boolean, default: false },
    editingId: { type: Number, default: null }
  },
  data() {
    return {
      form: {
        title: "",
        location: ""
      },
      municipality: {},
      isLoading: false
    };
  },
  methods: {
    async createMunicipality() {
      if (!!this.form.title && !!this.form.location) {
        this.isLoading = true;
        const res = await this.$store.dispatch(
          "municipality/createMunicipality",
          this.form
        );
        this.isLoading = false;
        if (res !== false) {
          this.$_options = false;
          this.form.title = "";
          this.form.location = "";
        }
      }
    },
    async editMunicipality() {
      if (!!this.form.title && this.form.location && !!this.editingId) {
        if (
          this.form.title !== this.municipality.title ||
          this.form.location !== this.municipality.location
        ) {
          this.isLoading = true;
          const res = await this.$store.dispatch(
            "municipality/editMunicipality",
            {
              id: this.editingId,
              title: this.form.title,
              location: this.form.location
            }
          );
          this.isLoading = false;
          if (res !== false) {
            this.$_options = false;
            this.form.title = "";
            this.form.location = "";
          }
        } else {
          this.$q.notify({
            type: "negative",
            message: "Bitte wählen Sie einen anderen Titel oder anderen Ort aus"
          });
        }
      }
    },
    async getMunicipalityInfo() {
      if (!!this.editingId) {
        const municipality = this.$store.state.municipality.municipalities.find(
          mun => {
            return mun.id === this.editingId;
          }
        );
        if (!!municipality) {
          this.municipality = municipality;
          this.form.title = municipality.title;
          this.form.location = municipality.location;
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
        this.form.location = "";
        this.$emit("update", val);
      }
    }
  }
};
</script>

<style></style>
