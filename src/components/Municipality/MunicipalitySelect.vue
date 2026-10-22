<template>
  <div>
    <q-select
      outlined
      dense
      v-model="model"
      :options="municipalities"
      options-selected-class="text-primary text-weight-600"
      class="no-shadow input-radius-6"
      :rules="rules"
      reactive-rules
      @input="onSelect"
    >
      <template v-slot:selected>
        <template v-if="model">
          <span>
            {{ model.title }}
          </span>
        </template>
        <template v-else>
          <span class="text-grey">
            {{ $t("Select Municipality") }}
          </span>
        </template>
      </template>
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
          <q-item-section>
            <q-item-label>{{ scope.opt.title }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script>
export default {
  name: "municipalitySelect",
  props: {
    currentMunicipality: {
      type: Object,
      default: null,
    },
    // Optional: narrows options to municipalities under this landkreis. When
    // omitted, shows every municipality (matching today's no-context fallback).
    parentLandkreisId: {
      type: Number,
      default: null,
    },
    // Optional: narrows options to municipalities under this federal state.
    // A parent landkreis is narrower and takes precedence.
    parentFederalStateId: {
      type: Number,
      default: null,
    },
    rules: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      model: this.currentMunicipality,
    };
  },
  methods: {
    onSelect(value) {
      const municipality = {
        id: value.id,
        title: value.title,
      };
      this.$emit("update:municipality", municipality);
    },
  },
  computed: {
    municipalities() {
      const all = this.$store.state.municipality.municipalities || [];
      let municipalities = all;
      if (this.parentLandkreisId) {
        municipalities = this.$store.getters["landkreis/municipalitiesUnder"](this.parentLandkreisId);
      } else if (this.parentFederalStateId) {
        const ids = this.$store.getters["federalState/municipalitiesUnderState"](this.parentFederalStateId);
        municipalities = all.filter((municipality) => ids.includes(municipality.id));
      }
      return municipalities
        .map((municipality) => {
          return {
            id: municipality.id,
            title: municipality.title,
          };
        })
        .sort((a, b) => a.title.localeCompare(b.title));
    },
  },
  watch: {
    currentMunicipality(val) {
      this.model = val;
    },
  },
};
</script>

<style></style>
