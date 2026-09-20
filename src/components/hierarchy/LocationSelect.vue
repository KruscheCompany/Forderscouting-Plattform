<template>
  <div>
    <q-select
      outlined
      dense
      v-model="model"
      :options="options"
      options-selected-class="text-primary text-weight-600"
      class="no-shadow input-radius-6"
      hide-bottom-space
      :rules="rules"
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
            {{ $t("personalData.location") }}
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
  name: "locationSelect",
  props: {
    currentLocation: {
      type: Object,
      default: null,
    },
    // Optional: narrows options to this municipality's locations. When
    // omitted, shows every location (matching today's no-context fallback).
    parentMunicipalityId: {
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
      model: this.currentLocation,
    };
  },
  methods: {
    onSelect(value) {
      const location = {
        id: value.id,
        title: value.title,
      };
      this.$emit("update:location", location);
    },
  },
  computed: {
    options() {
      const locations = this.$store.state.location.locations || [];
      const filtered = this.parentMunicipalityId
        ? locations.filter((loc) => ((loc.municipality && loc.municipality.id) || loc.municipality) === this.parentMunicipalityId)
        : locations;
      return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    },
  },
  watch: {
    currentLocation(val) {
      this.model = val;
    },
  },
  mounted() {
    this.$store.dispatch("location/getLocations");
  },
};
</script>

<style></style>
