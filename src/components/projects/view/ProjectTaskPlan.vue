<template>
  <q-card class="shadow-1 radius-20">
    <q-expansion-item class="shadow-1 overflow-hidden radius-20" :label="$t('projectComponents.taskPlan.title')"
      header-class="bg-white text-black" v-model="expandedTaskPlan">
      <q-card-section class="q-pt-none">
        <!-- Default Tasks -->
        <div>
          <q-list>
            <q-item v-for="(task, index) in defaultTasks" :key="`default-${index}`" tag="label" class="q-pa-none">
              <q-item-section avatar>
                <q-checkbox v-model="task.completed" disable />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ task.title }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <!-- Custom Tasks -->
        <div>
          <q-list>
            <q-item v-for="(task, index) in customTasks" :key="`custom-${index}`" tag="label" class="q-pa-none">
              <q-item-section avatar>
                <q-checkbox v-model="task.completed" disable />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ task.title }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-card-section>
    </q-expansion-item>
  </q-card>
</template>

<script>
export default {
  name: "ProjectTaskPlan",
  props: {
    project: {
      type: Object,
      required: true
    },
    currentTab: {
      type: String,
      default: null,
      required: false
    }
  },
  data() {
    return {
      expandedTaskPlan: this.currentTab === "taskPlan",
    };
  },
  computed: {
    taskPlan() {
      // Use project's taskPlan if available, otherwise create an empty structure
      return this.project && this.project.taskPlan ? this.project.taskPlan : {
        tasks: []
      };
    },
    defaultTasks() {
      return this.taskPlan.tasks.filter(task => task.isDefault);
    },
    customTasks() {
      return this.taskPlan.tasks.filter(task => !task.isDefault);
    }
  },
  watch: {
    currentTab(newTab) {
      // Expand the section if the current tab is 'taskPlan'
      this.expandedTaskPlan = newTab === "taskPlan";
    }
  }
}
</script>

<style lang="scss" scoped></style>
