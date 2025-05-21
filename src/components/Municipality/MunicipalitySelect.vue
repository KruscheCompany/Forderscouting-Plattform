<template>
  <div>
    <q-select
      outlined
      dense
      v-model="model"
      :options="municipalities"
      options-selected-class="text-primary text-weight-600"
      class="no-shadow input-radius-6"
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
      return this.$store.state.municipality.municipalities
        .map((municipality) => {
          return {
            id: municipality.id,
            title: municipality.title,
          };
        })
        .sort((a, b) => a.title.localeCompare(b.title));
    },
  },
  // mounted() {
  //   console.log("this.currentMunicipality", this.currentMunicipality.title);
  //   this.model = this.currentMunicipality.title
  //     ? this.currentMunicipality
  //     : null;
  //   console.log("modell", this.model);
  // }
};
</script>

<style></style>
