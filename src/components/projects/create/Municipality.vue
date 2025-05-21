<template>
  <div>
    <q-select
      outlined
      dense
      v-model="model"
      :options="administrations"
      options-selected-class="text-primary"
      class="no-shadow input-radius-6"
      @input="onSelect"
      :rules="!isRequired ? [val => !!val || $t('Required')] : []"
    >
      <template v-slot:selected>
        <template v-if="model">
          <span>
            {{ model.title }}
          </span>
        </template>
        <template v-else>
          <span class="text-grey">
            {{ $t("select administration") }}
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
      default: null
    },
    isRequired: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      model: ""
    };
  },
  methods: {
    onSelect(value) {
      const municipality = {
        id: value.id,
        title: value.title
      };
      this.$emit("update:municipality", municipality.id);
      this.$store.commit("municipality/setTempMunicipality", municipality);
    }
  },
  computed: {
    administrations() {
      return this.$store.state.municipality.municipalities;
    }
  },
  mounted() {
    if (this.currentMunicipality) {
      this.model = this.currentMunicipality;
    }
  },
  beforeDestroy() {
    this.$store.commit("municipality/setTempMunicipality", null);
  }
};
</script>

<style></style>
