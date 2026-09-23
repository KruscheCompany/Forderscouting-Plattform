<template>
  <q-dialog @before-show="getLocationEntryInfo" v-model="$_options">
    <q-card class="q-pa-md radius-10" style="width: 532px; max-width: 90vw;">
      <div>
        <h6 class="text-center font-24 q-mt-md">
          {{
            !!editingId
              ? $t("editLocationEntry")
              : $t("administrativeAreas.createLocationEntry")
          }}
        </h6>
        <q-form @submit.prevent="
          !!editingId ? editLocationEntry() : createLocationEntry()
          " class="q-gutter-sm q-px-md q-mb-md">
          <div class="items-center">
            <div class="col-12 col-md-3">
              <p class="font-14 no-margin">
                {{ $t("myData.title") }}
              </p>
            </div>
            <div class="col-12 col-md-9">
              <q-input outlined class="no-shadow input-radius-6" v-model="form.title"
                :rules="[val => !!val || $t('Required')]" :placeholder="$t('administrativeAreas.locationEntryName')" />
            </div>
          </div>
          <div class="items-center q-mb-md">
            <div class="col-12 col-md-3 ">
              <p class="font-14 no-margin ">
                {{ $t("userAdministration.administration") }}
              </p>
            </div>
            <div class="col-12 col-md-9">
              <MunicipalitySelect :currentMunicipality="form.municipality"
                @update:municipality="handleMunicipalitySelected"
                :rules="[val => (!!val && !!val.id) || $t('Required')]" />
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
import MunicipalitySelect from "components/Municipality/MunicipalitySelect.vue";
export default {
  name: "createLocationEntryDialog",
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
      locationEntry: {},
      isLoading: false
    };
  },
  methods: {
    async createLocationEntry() {
      if (!!this.form.title && !!this.form.municipality) {
        this.isLoading = true;
        const res = await this.$store.dispatch(
          "municipality/createLocationEntry",
          {
            title: this.form.title,
            municipality: this.form.municipality
          }
        );
        this.isLoading = false;
        if (res !== false) {
          this.$_options = false;
          this.form.title = "";
          this.form.municipality = { id: null, title: "" };
        }
      } else {
        this.$store.dispatch("notifications/pushToast", { kind: "negative", title: this.$t("Bitte füllen Sie alle Felder aus") });
      }
    },
    async editLocationEntry() {
      if (!!this.form.title && this.form.municipality && !!this.editingId) {
        if (
          this.form.title !== this.locationEntry.title ||
          this.form.municipality.id !== this.locationEntry.municipality.id
        ) {
          this.isLoading = true;
          const res = await this.$store.dispatch(
            "municipality/editLocationEntry",
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
          this.$store.dispatch("notifications/pushToast", { kind: "negative", title: this.$t("Bitte wählen Sie einen anderen Titel oder anderen Ort aus") });
        }
      }
    },
    async getLocationEntryInfo() {
      if (!!this.editingId) {
        const locationEntry = this.$store.state.location.locations.find(
          loc => {
            return loc.id === this.editingId;
          }
        );
        if (locationEntry) {
          this.locationEntry = locationEntry;
          this.form.title = locationEntry.title;
          this.form.municipality = {
            id: locationEntry.municipality.id,
            title: locationEntry.municipality.title
          };
        }
      }
    },
    handleMunicipalitySelected(municipality) {
      this.form.municipality = municipality;
    }
  },
  computed: {
    $_options: {
      get: function () {
        return this.dialogState;
      },
      set: function (val) {
        this.form.title = "";
        this.form.municipality = 0;
        this.$emit("update", val);
      }
    }
  }
};
</script>

<style></style>
