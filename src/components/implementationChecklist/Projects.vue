<template>
  <q-select
    outlined
    dense
    v-model="model"
    multiple
    :options="projects"
    options-selected-class="text-primary text-weight-600"
    class="no-shadow input-radius-6"
    @input="onSelect"
  >
    <template v-slot:selected>
      <template v-if="model && model.length > 0">
        <span v-for="(project, index) in model" :key="index">
          {{ index > 0 ? ", " : "" }}
          {{ project.title }}
        </span>
      </template>
      <template v-else>
        <span class="text-grey">
          Select Projects
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
  name: "projects",
  props: {
    editing: {
      type: Array,
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
      const projects = [];
      value.forEach(element => {
        projects.push({ id: element.id });
      });
      this.$emit("update:linkToProject", projects.length > 0 ? projects : []);
    }
  },
  computed: {
    projects() {
      return this.$store.state.project.projects.map(project => {
        return {
          id: project.id,
          title: project.title
        };
      });
    }
  }
  // mounted() {
  //   this.model = this.editing
  //     ? JSON.parse(JSON.stringify(this.$store.state.project.project.projects))
  //     : null;
  // }
};
</script>

<style></style>
