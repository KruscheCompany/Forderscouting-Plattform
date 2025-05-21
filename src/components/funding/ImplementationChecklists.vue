<template>
  <q-select
    outlined
    clearable
    dense
    v-model="model"
    :options="implementationChecklists"
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
          {{ $t("Select Implementation Checklist") }}
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
</template>

<script>
export default {
  name: "implementationChecklists",
  props: {
    editing: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      model: this.editing
    };
  },
  methods: {
    onSelect(value) {
      // const implementationChecklists = [];
      // value.forEach(element => {
      //   implementationChecklists.push({ id: element.id });
      // });
      this.$emit(
        "update:linkToImplementationChecklist",
        !!value ? value : null
      );
    }
  },
  computed: {
    implementationChecklists() {
      return this.$store.state.implementationChecklist.checklists.map(
        checklist => {
          return {
            id: checklist.id,
            title: checklist.title
          };
        }
      );
    }
  }
};
</script>

<style></style>
