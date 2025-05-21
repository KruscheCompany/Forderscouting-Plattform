<template>
  <div>
    <q-select
      outlined
      :bg-color="isInChecklist ? 'white' : ''"
      dense
      v-model="model"
      :multiple="isInChecklist === false"
      :clearable="isInChecklist === true"
      :options="projects"
      options-selected-class="text-primary text-weight-600"
      class="no-shadow input-radius-6"
      @input="onSelect"
    >
      <template v-slot:selected>
        <div v-if="!isInChecklist">
          <template v-if="model && model.length > 0">
            <span v-for="(project, index) in model" :key="index">
              {{ index > 0 ? ", " : "" }}
              {{ project.title }}
            </span>
          </template>
          <template v-else>
            <span class="text-grey">
              {{ $t("Select Projects") }}
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
              {{ $t("Select Projects") }}
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
  name: "projectIdeas",
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
        const projects = [];
        value.forEach(element => {
          projects.push({ id: element.id });
        });
        this.$emit("update:linkToProject", projects.length > 0 ? projects : []);
      } else {
        let project = value;
        this.$emit(
          "update:linkToProject",
          !!project && project.id ? project : null
        );
      }
    },
    setProject() {
      const project = JSON.parse(JSON.stringify(this.$store.state.project.project));
      const { id, title } = project;
      this.model = { id, title };
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
