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
        <q-form @submit.prevent="
          !!editingId ? editMunicipality() : createMunicipality()
          " class="q-gutter-sm q-px-md q-mb-md">
          <div class="items-center">
            <div class="col-12 col-md-3">
              <p class="font-14 no-margin">
                {{ $t("myData.title") }}
              </p>
            </div>
            <div class="col-12 col-md-9">
              <q-input outlined class="no-shadow input-radius-6" v-model="form.title"
                :rules="[val => !!val || $t('Required')]" :placeholder="$t('administrativeAreas.administrationName')" />
            </div>
          </div>
          <div class="items-center">
            <div class="col-12 col-md-3 ">
              <p class="font-14 no-margin ">
                {{ $t("personalData.location") }}
              </p>
            </div>
            <div class="col-12 col-md-9">
              <q-input outlined class="no-shadow input-radius-6" v-model="form.location"
                :rules="[val => !!val || $t('Required')]" :placeholder="$t('adminstrationLocation')" />
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
                :placeholder="$t('administrativeAreas.selectFederalStates')" />
            </div>
          </div>
          <div class="items-center">
            <div class="col-12 col-md-3">
              <p class="font-14 no-margin">
                {{ $t("administrativeAreas.financeContactEmail") }}
              </p>
            </div>
            <div class="col-12 col-md-9">
              <q-input outlined type="email" class="no-shadow input-radius-6" v-model="form.financeContactEmail"
                :placeholder="$t('administrativeAreas.financeContactEmail')" />
            </div>
          </div>
          <div class="items-center">
            <div class="col-12 col-md-3">
              <p class="font-14 no-margin">
                {{ $t("administrativeAreas.financeContactFirstName") }}
              </p>
            </div>
            <div class="col-12 col-md-9">
              <q-input outlined class="no-shadow input-radius-6" v-model="form.financeContactFirstName"
                :placeholder="$t('administrativeAreas.financeContactFirstName')" />
            </div>
          </div>
          <div class="items-center">
            <div class="col-12 col-md-3">
              <p class="font-14 no-margin">
                {{ $t("administrativeAreas.financeContactLastName") }}
              </p>
            </div>
            <div class="col-12 col-md-9">
              <q-input outlined class="no-shadow input-radius-6" v-model="form.financeContactLastName"
                :placeholder="$t('administrativeAreas.financeContactLastName')" />
            </div>
          </div>
          <div class="items-center">
            <div class="col-12 col-md-3">
              <p class="font-14 no-margin">
                {{ $t("administrativeAreas.personnelContactEmail") }}
              </p>
            </div>
            <div class="col-12 col-md-9">
              <q-input outlined type="email" class="no-shadow input-radius-6" v-model="form.personnelContactEmail"
                :placeholder="$t('administrativeAreas.personnelContactEmail')" />
            </div>
          </div>
          <div class="items-center">
            <div class="col-12 col-md-3">
              <p class="font-14 no-margin">
                {{ $t("administrativeAreas.personnelContactFirstName") }}
              </p>
            </div>
            <div class="col-12 col-md-9">
              <q-input outlined class="no-shadow input-radius-6" v-model="form.personnelContactFirstName"
                :placeholder="$t('administrativeAreas.personnelContactFirstName')" />
            </div>
          </div>
          <div class="items-center">
            <div class="col-12 col-md-3">
              <p class="font-14 no-margin">
                {{ $t("administrativeAreas.personnelContactLastName") }}
              </p>
            </div>
            <div class="col-12 col-md-9">
              <q-input outlined class="no-shadow input-radius-6" v-model="form.personnelContactLastName"
                :placeholder="$t('administrativeAreas.personnelContactLastName')" />
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
  name: "createMunicipalityDialog",
  props: {
    dialogState: { type: Boolean, default: false },
    editingId: { type: Number, default: null }
  },
  data() {
    return {
      form: {
        title: "",
        location: "",
        federalStates: [],
        financeContactEmail: "",
        financeContactFirstName: "",
        financeContactLastName: "",
        personnelContactEmail: "",
        personnelContactFirstName: "",
        personnelContactLastName: ""
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
          {
            title: this.form.title,
            location: this.form.location,
            federalStates: this.form.federalStates,
            financeContactEmail: this.form.financeContactEmail,
            financeContactFirstName: this.form.financeContactFirstName,
            financeContactLastName: this.form.financeContactLastName,
            personnelContactEmail: this.form.personnelContactEmail,
            personnelContactFirstName: this.form.personnelContactFirstName,
            personnelContactLastName: this.form.personnelContactLastName
          }
        );
        this.isLoading = false;
        if (res !== false) {
          this.$_options = false;
          this.form.title = "";
          this.form.location = "";
          this.form.federalStates = [];
        }
      }
    },
    async editMunicipality() {
      if (!!this.form.title && this.form.location && !!this.editingId) {
        if (
          this.form.title !== this.municipality.title ||
          this.form.location !== this.municipality.location ||
          JSON.stringify(this.form.federalStates) !== JSON.stringify(this.municipality.federalStates) ||
          this.form.financeContactEmail !== this.municipality.financeContactEmail ||
          this.form.financeContactFirstName !== this.municipality.financeContactFirstName ||
          this.form.financeContactLastName !== this.municipality.financeContactLastName ||
          this.form.personnelContactEmail !== this.municipality.personnelContactEmail ||
          this.form.personnelContactFirstName !== this.municipality.personnelContactFirstName ||
          this.form.personnelContactLastName !== this.municipality.personnelContactLastName
        ) {
          this.isLoading = true;
          const res = await this.$store.dispatch(
            "municipality/editMunicipality",
            {
              id: this.editingId,
              title: this.form.title,
              location: this.form.location,
              federalStates: this.form.federalStates,
              financeContactEmail: this.form.financeContactEmail,
              financeContactFirstName: this.form.financeContactFirstName,
              financeContactLastName: this.form.financeContactLastName,
              personnelContactEmail: this.form.personnelContactEmail,
              personnelContactFirstName: this.form.personnelContactFirstName,
              personnelContactLastName: this.form.personnelContactLastName
            }
          );
          this.isLoading = false;
          if (res !== false) {
            this.$_options = false;
            this.form.title = "";
            this.form.location = "";
            this.form.federalStates = [];
          }
        } else {
          this.$store.dispatch("notifications/pushToast", { kind: "negative", title: this.$t("Bitte wählen Sie einen anderen Titel oder anderen Ort aus") });
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
          this.form.financeContactEmail = municipality.financeContactEmail || "";
          this.form.financeContactFirstName = municipality.financeContactFirstName || "";
          this.form.financeContactLastName = municipality.financeContactLastName || "";
          this.form.personnelContactEmail = municipality.personnelContactEmail || "";
          this.form.personnelContactFirstName = municipality.personnelContactFirstName || "";
          this.form.personnelContactLastName = municipality.personnelContactLastName || "";
          // Handle federal states - check if they exist and are in array format
          if (municipality.federalStates) {
            if (Array.isArray(municipality.federalStates)) {
              this.form.federalStates = municipality.federalStates.map(fs => fs.id || fs);
            } else {
              this.form.federalStates = [];
            }
          } else {
            this.form.federalStates = [];
          }
        }
      }
    },
    loadFederalStates() {
      this.$store.dispatch("federalState/getFederalStates");
    }
  },
  computed: {
    $_options: {
      get: function () {
        return this.dialogState;
      },
      set: function (val) {
        this.form.title = "";
        this.form.location = "";
        this.form.federalStates = [];
        this.form.financeContactEmail = "";
        this.form.financeContactFirstName = "";
        this.form.financeContactLastName = "";
        this.form.personnelContactEmail = "";
        this.form.personnelContactFirstName = "";
        this.form.personnelContactLastName = "";
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
    }
  },
  mounted() {
    this.loadFederalStates();
  }
};
</script>

<style></style>
