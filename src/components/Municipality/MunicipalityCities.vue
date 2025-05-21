<template>
  <div>
    <q-select
      clearable
      outlined
      dense
      v-model="model"
      :options="options"
      use-input
      hide-selected
      fill-input
      input-debounce="0"
      @filter="filterFn"
      behavior="menu"
      @focus="municipalityChanged"
      :label="$t('personalData.location')"
      :rules="isRequired ? [(val) => !!val || $t('Required')] : []"
      options-selected-class="text-primary text-weight-600"
      class="no-shadow input-radius-6"
      @input="onSelect"
    >
      <template v-slot:selected>
        <template v-if="model">
          <span>
            {{ model }}
          </span>
        </template>
        <template v-else>
          <span class="text-grey">
            {{ $t("personalData.location") }}
          </span>
        </template>
      </template>
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
          <q-item-section>
            <q-item-label>{{ scope.opt }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script>
// import municipalities from "src/municipalities.json";
export default {
  name: "municipalityCities",
  props: {
    currentMunicipality: null,
    isRequired: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      model: this.currentMunicipality,
      municipalities: [],
      options: [],
      selectedMunicipality: null,
    };
  },
  methods: {
    getGroupedStates() {
      this.$store.dispatch("municipality/getGroupedStates");
    },
    municipalityChanged() {
      if (this.$store.state.municipality.tempMunicipality) {
        this.selectedMunicipality =
          this.$store.state.municipality.tempMunicipality.title;
        for (const key in this.municipalities) {
          if (key.includes(this.selectedMunicipality)) {
            this.options = this.municipalities[key];
          }
        }
        this.options = this.municipalities[this.selectedMunicipality];
      } else {
        this.options = this.allStates;
      }
    },
    onSelect(value) {
      const city = value;
      this.model = city;
      this.$emit("update:city", city);
    },
    filterFn(input, update) {
      if (input === "" && this.selectedMunicipality) {
        update(() => {
          this.options = this.municipalities[this.selectedMunicipality];
        });
        return;
      } else if (input === "" && !this.selectedMunicipality) {
        update(() => {
          this.options = this.allStates;
        });
        return;
      }
      update(() => {
        const search = input.toLowerCase();
        this.options = this.options.filter(
          (v) => v.toLowerCase().indexOf(search) > -1
        );
      });
    },
  },
  computed: {
    userDetails() {
      return (
        this.$store.state.userCenter.user &&
        this.$store.state.userCenter.user.userDetails
      );
    },
    isAdmin() {
      return this.$store.getters["userCenter/isAdmin"];
    },
    allStates() {
      let allStates = [];
      for (const key in this.municipalities) {
        allStates = allStates.concat(this.municipalities[key]);
      }
      allStates.sort((a, b) => a.localeCompare(b));
      return allStates;
    },
  },
  mounted() {
    this.getGroupedStates();
    this.municipalities = this.$store.state.municipality.groupedStates;

    if (this.selectedMunicipality === null) {
      if (this.userDetails && this.userDetails.municipality && !this.isAdmin) {
        this.selectedMunicipality = this.userDetails.municipality.title;
        if (this.$route.query.tab === "personalData") {
          this.model = this.userDetails.location;
        }
      } else {
        //if the user has not selected a municipality yet then set the options to the cities of all municipalities
        this.options = this.allStates;
      }
    }
    this.options = this.municipalities[this.selectedMunicipality];
  },
};
</script>

<style></style>
