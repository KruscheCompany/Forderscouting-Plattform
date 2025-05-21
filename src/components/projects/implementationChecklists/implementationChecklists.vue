<template>
  <div>
    <q-select outlined :bg-color="isInChecklist ? 'white' : ''" dense v-model="model"
      :multiple="isInChecklist === false" :clearable="isInChecklist === true"
      :options="checklists" options-selected-class="text-primary text-weight-600" class="no-shadow input-radius-6"
      @input="onSelect">
      <template v-slot:selected>
        <div v-if="!isInChecklist">
          <template v-if="model && model.length > 0">
            <span v-for="(checklist, index) in model" :key="index">
              {{ index > 0 ? ", " : "" }}
              {{ checklist.title }}
            </span>
          </template>
          <template v-else>
            <span class="text-grey">
              {{ $t("Select Implementation Checklist") }}
            </span>
          </template>
        </div>
        <div v-if="isInChecklist">
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
        </div>
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
  name: "checklists",
  props: {
    isInChecklist: {
      type: Boolean,
      default: false
    },
    editing: {
      type: [Object, Array],
      default: () => null
    }
  },
  data() {
    return {
      model: this.editing
    };
  },
  methods: {
    onSelect(value) {
      if (!this.isInChecklist) {
        const checklists = [];
        value.forEach(element => {
          checklists.push({ id: element.id });
        });
        this.$emit("update:linkToProject", checklists.length > 0 ? checklists : []);
      } else {
        let checklist = value;
        this.$emit(
          "update:linkToProject",
          !!checklist && checklist.id ? checklist : null
        );
      }
    }
  },
  computed: {
    checklists() {
      return this.$store.state.implementationChecklist.checklists;
    }
  }
};
</script>

<style>

</style>
