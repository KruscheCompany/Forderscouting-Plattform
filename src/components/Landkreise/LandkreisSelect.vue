<template>
  <div>
    <q-select
      outlined
      dense
      v-model="model"
      :options="landkreise"
      options-selected-class="text-primary text-weight-600"
      class="no-shadow input-radius-6"
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
            {{ $t("landkreise.selectLandkreis") }}
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
  name: "landkreisSelect",
  props: {
    currentLandkreis: {
      type: Object,
      default: null,
    },
    rules: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      model: this.currentLandkreis,
    };
  },
  methods: {
    onSelect(value) {
      const landkreis = {
        id: value.id,
        title: value.title,
      };
      this.$emit("update:landkreis", landkreis);
    },
  },
  computed: {
    landkreise() {
      const landkreise = this.$store.state.landkreis.landkreise;
      return Array.isArray(landkreise)
        ? [...landkreise].sort((a, b) => a.title.localeCompare(b.title))
        : [];
    },
  },
  mounted() {
    this.$store.dispatch("landkreis/getLandkreise");
  },
};
</script>

<style></style>
