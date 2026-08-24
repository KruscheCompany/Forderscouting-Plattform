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
        <q-form @submit.prevent="
          !!editingId ? editState() : createState()
          " class="q-gutter-sm q-px-md q-mb-md">
          <div class="items-center">
            <div class="col-12 col-md-3">
              <p class="font-14 no-margin">
                {{ $t("myData.title") }}
              </p>
            </div>
            <div class="col-12 col-md-9">
              <q-input outlined class="no-shadow input-radius-6" v-model="form.title"
                :rules="[val => !!val || $t('Required')]" :placeholder="$t('administrativeAreas.stateName')" />
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
          <div class="items-center q-mb-lg">
            <div class="col-12 col-md-3">
              <p class="font-14 no-margin">
                {{ $t("administrativeAreas.selectFederalStates") }}
              </p>
            </div>
            <div class="col-12 col-md-9">
              <q-select outlined multiple use-chips class="no-shadow input-radius-6" v-model="form.federalStates"
                :options="federalStatesOptions" option-value="id"
                :option-label="opt => opt.attributes ? opt.attributes.title : ''" emit-value map-options
                :placeholder="$t('administrativeAreas.selectFederalStates')"
                :rules="[val => (val && val.length > 0) || $t('Required')]" />
            </div>
          </div>
          <div class="items-center q-mb-lg">
            <div class="col-12 col-md-3">
              <p class="font-14 no-margin">
                {{ $t("administrativeAreas.selectLandkreise") }}
              </p>
            </div>
            <div class="col-12 col-md-9">
              <q-select outlined multiple use-chips class="no-shadow input-radius-6" v-model="form.landkreise"
                :options="landkreiseOptions" option-value="id" option-label="title" emit-value map-options
                :placeholder="$t('administrativeAreas.selectLandkreise')" />
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
        municipality: { id: null, title: "" },
        federalStates: [],
        landkreise: []
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
          {
            title: this.form.title,
            municipality: this.form.municipality,
            federalStates: this.form.federalStates,
            landkreise: this.form.landkreise
          }
        );
        this.isLoading = false;
        if (res !== false) {
          this.$_options = false;
          this.form.title = "";
          this.form.municipality = { id: null, title: "" };
          this.form.federalStates = [];
          this.form.landkreise = [];
        }
      } else {
        this.$store.dispatch("notifications/pushToast", { kind: "negative", title: this.$t("Bitte füllen Sie alle Felder aus") });
      }
    },
    async editState() {
      if (!!this.form.title && this.form.municipality && !!this.editingId) {
        if (
          this.form.title !== this.state.title ||
          this.form.municipality.id !== this.state.municipality.id ||
          JSON.stringify(this.form.federalStates) !== JSON.stringify(this.state.federalStates) ||
          JSON.stringify(this.form.landkreise) !== JSON.stringify(this.state.landkreise)
        ) {
          this.isLoading = true;
          const res = await this.$store.dispatch(
            "municipality/editState",
            {
              id: this.editingId,
              title: this.form.title,
              municipality: this.form.municipality.id,
              federalStates: this.form.federalStates,
              landkreise: this.form.landkreise
            }
          );
          this.isLoading = false;
          if (res !== false) {
            this.$_options = false;
            this.form.title = "";
            this.form.municipality = { id: null, title: "" };
            this.form.federalStates = [];
            this.form.landkreise = [];
          }
        } else {
          this.$store.dispatch("notifications/pushToast", { kind: "negative", title: this.$t("Bitte wählen Sie einen anderen Titel oder anderen Ort aus") });
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
          // Handle federal states - check if they exist and are in array format
          if (state.federalStates) {
            if (Array.isArray(state.federalStates)) {
              this.form.federalStates = state.federalStates.map(fs => fs.id || fs);
            } else {
              this.form.federalStates = [];
            }
          } else {
            this.form.federalStates = [];
          }
          if (state.landkreise) {
            if (Array.isArray(state.landkreise)) {
              this.form.landkreise = state.landkreise.map(lk => lk.id || lk);
            } else {
              this.form.landkreise = [];
            }
          } else {
            this.form.landkreise = [];
          }
        }
      }
    },
    loadFederalStates() {
      this.$store.dispatch("federalState/getFederalStates");
    },
    loadLandkreise() {
      this.$store.dispatch("landkreis/getLandkreise");
    },
    handleMunicipalitySelected(municipality) {
      this.form.municipality = municipality;
      const fullMunicipality = this.$store.state.municipality.municipalities.find(
        mun => mun.id === municipality.id
      );
      if (fullMunicipality) {
        this.form.federalStates = Array.isArray(fullMunicipality.federalStates)
          ? fullMunicipality.federalStates.map(fs => fs.id || fs)
          : [];
        this.form.landkreise = Array.isArray(fullMunicipality.landkreise)
          ? fullMunicipality.landkreise.map(lk => lk.id || lk)
          : [];
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
        this.form.municipality = 0;
        this.form.federalStates = [];
        this.form.landkreise = [];
        this.$emit("update", val);
      }
    },
    federalStatesOptions() {
      const federalStatesResponse = this.$store.state.federalState.federalStates;
      // Check if the response has a data property (Strapi format)
      if (federalStatesResponse && federalStatesResponse.data) {
        const federalStates = federalStatesResponse.data;
        if (!Array.isArray(federalStates)) {
          return [];
        }
        return federalStates;
      }
      // Fallback for direct array format
      if (Array.isArray(federalStatesResponse)) {
        return federalStatesResponse;
      }
      return [];
    },
    landkreiseOptions() {
      const landkreise = this.$store.state.landkreis.landkreise;
      if (!Array.isArray(landkreise)) {
        return [];
      }
      const sorted = [...landkreise].sort((a, b) => a.title.localeCompare(b.title));
      if (!this.form.federalStates.length) {
        return sorted;
      }
      return sorted.filter(lk =>
        (lk.federalStates || []).some(fsId => this.form.federalStates.includes(fsId))
      );
    }
  },
  mounted() {
    this.loadFederalStates();
    this.loadLandkreise();
  }
};
</script>

<style></style>
