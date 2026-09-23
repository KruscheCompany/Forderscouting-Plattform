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
    // Only honored for admins (see fetchLocations) - a non-admin's own
    // municipality/landkreis/federalState scope is resolved server-side
    // regardless of this prop. Omitted for an admin: no filter, all locations.
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
      locations: [],
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
    // Signed-in: the by-municipality endpoint scopes non-admins server-side
    // automatically (municipalityId is only honored for admins), so this
    // always returns exactly what the user is allowed to see. Signed-out
    // (e.g. Register.vue) has no scope to resolve against yet, so it falls
    // back to the unscoped list.
    async fetchLocations() {
      if (this.$store.getters["userCenter/isSignedIn"]) {
        this.locations = await this.$store.dispatch("location/getLocationsUnder", {
          municipalityId: this.parentMunicipalityId || undefined,
        });
      } else {
        await this.$store.dispatch("location/getLocations");
        this.locations = this.$store.state.location.locations || [];
      }
    },
  },
  computed: {
    options() {
      return [...this.locations].sort((a, b) => a.title.localeCompare(b.title));
    },
  },
  watch: {
    currentLocation(val) {
      this.model = val;
    },
    parentMunicipalityId() {
      this.fetchLocations();
    },
  },
  mounted() {
    this.fetchLocations();
  },
};
</script>

<style></style>
