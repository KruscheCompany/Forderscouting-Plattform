<template>
  <q-dialog @before-show="getLandkreisInfo" v-model="$_options">
    <q-card class="q-pa-md radius-10" style="width: 532px; max-width: 90vw;">
      <div>
        <h6 class="text-center font-24 q-mt-md">
          {{
            !!editingId
              ? $t("editLandkreis")
              : $t("landkreise.createLandkreis")
          }}
        </h6>
        <q-form @submit.prevent="
          !!editingId ? editLandkreis() : createLandkreis()
          " class="q-gutter-sm q-px-md q-mb-md">
          <div class="items-center">
            <div class="col-12 col-md-3">
              <p class="font-14 no-margin">
                {{ $t("myData.title") }}
              </p>
            </div>
            <div class="col-12 col-md-9">
              <q-input outlined class="no-shadow input-radius-6" v-model="form.title"
                :rules="[val => !!val || $t('Required')]" :placeholder="$t('landkreise.landkreisName')" />
            </div>
          </div>
          <div class="items-center">
            <div class="col-12 col-md-3">
              <p class="font-14 no-margin">
                {{ $t("administrativeAreas.selectFederalStates") }}
              </p>
            </div>
            <div class="col-12 col-md-9">
              <q-select outlined multiple use-chips class="no-shadow input-radius-6" v-model="form.federalStates"
                :options="federalStatesOptions" option-value="id"
                :option-label="opt => opt.attributes ? opt.attributes.title : ''" emit-value map-options
                :rules="[val => (!!val && val.length > 0) || $t('Required')]"
                :placeholder="$t('administrativeAreas.selectFederalStates')" />
            </div>
          </div>
          <div class="items-center">
            <div class="col-12 col-md-3">
              <p class="font-14 no-margin">
                {{ $t("landkreise.selectMunicipalities") }}
              </p>
            </div>
            <div class="col-12 col-md-9">
              <q-select outlined multiple use-chips class="no-shadow input-radius-6" v-model="form.municipalities"
                :options="municipalitiesOptions" option-value="id" option-label="title" emit-value map-options
                :placeholder="$t('landkreise.selectMunicipalities')" />
            </div>
          </div>
          <div class="row q-col-gutter-sm q-mt-md">
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
  name: "createLandkreisDialog",
  props: {
    dialogState: { type: Boolean, default: false },
    editingId: { type: Number, default: null }
  },
  data() {
    return {
      form: {
        title: "",
        federalStates: [],
        municipalities: []
      },
      landkreis: {},
      isLoading: false
    };
  },
  methods: {
    async createLandkreis() {
      if (!!this.form.title && this.form.federalStates.length > 0) {
        this.isLoading = true;
        const res = await this.$store.dispatch(
          "landkreis/createLandkreis",
          {
            title: this.form.title,
            federalStates: this.form.federalStates,
            municipalities: this.form.municipalities
          }
        );
        this.isLoading = false;
        if (res !== false) {
          this.$_options = false;
          this.resetForm();
        }
      }
    },
    async editLandkreis() {
      if (!!this.form.title && !!this.editingId) {
        this.isLoading = true;
        const res = await this.$store.dispatch(
          "landkreis/editLandkreis",
          {
            id: this.editingId,
            title: this.form.title,
            federalStates: this.form.federalStates,
            municipalities: this.form.municipalities
          }
        );
        this.isLoading = false;
        if (res !== false) {
          this.$_options = false;
          this.resetForm();
        }
      }
    },
    getLandkreisInfo() {
      if (!!this.editingId) {
        const landkreise = this.$store.state.landkreis.landkreise;
        const landkreis = Array.isArray(landkreise)
          ? landkreise.find(lk => lk.id === this.editingId)
          : null;
        if (!!landkreis) {
          this.landkreis = landkreis;
          this.form.title = landkreis.title;
          this.form.federalStates = [...(landkreis.federalStates || [])];
          this.form.municipalities = [...(landkreis.municipalities || [])];
        }
      }
    },
    resetForm() {
      this.form.title = "";
      this.form.federalStates = [];
      this.form.municipalities = [];
    },
    loadFederalStates() {
      this.$store.dispatch("federalState/getFederalStates");
    },
    loadMunicipalities() {
      this.$store.dispatch("municipality/getSimplifiedMunicipalities");
    }
  },
  computed: {
    $_options: {
      get: function () {
        return this.dialogState;
      },
      set: function (val) {
        this.resetForm();
        this.$emit("update", val);
      }
    },
    federalStatesOptions() {
      const federalStatesResponse = this.$store.state.federalState.federalStates;
      if (federalStatesResponse && federalStatesResponse.data) {
        return Array.isArray(federalStatesResponse.data) ? federalStatesResponse.data : [];
      }
      return Array.isArray(federalStatesResponse) ? federalStatesResponse : [];
    },
    municipalitiesOptions() {
      const municipalities = this.$store.state.municipality.municipalitiesSimplified;
      return Array.isArray(municipalities) ? municipalities : [];
    }
  },
  mounted() {
    this.loadFederalStates();
    this.loadMunicipalities();
  }
};
</script>

<style></style>
