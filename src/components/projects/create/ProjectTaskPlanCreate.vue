<template>
  <q-card class="shadow-1 radius-20">
    <q-expansion-item class="shadow-1 overflow-hidden radius-20" :label="$t('Task Plan')"
      header-class="bg-white text-black" v-model="expandedAptitude">
      <q-card-section class="q-pt-none">
        <div>
          <q-list>
            <q-item v-for="(task, index) in defaultTasks" :key="`default-${index}`" tag="label" v-ripple
              class="q-pa-none">
              <q-item-section avatar>
                <q-checkbox v-model="task.completed" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ task.title }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <div>
          <q-list>
            <q-item v-for="(task, index) in customTasks" :key="`custom-${index}`" tag="label" v-ripple
              class="q-pa-none">
              <q-item-section avatar>
                <q-checkbox v-model="task.completed" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ task.title }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn flat round dense icon="delete" color="negative" @click.stop="removeCustomTask(index)" />
              </q-item-section>
            </q-item>

            <q-item class="q-pa-none q-mt-md">
              <q-item-section>
                <div class="row items-center">
                  <q-input v-model="newTaskTitle" outlined class="no-shadow input-radius-6 col-grow"
                    placeholder="Enter new task" @keyup.enter="addCustomTask">
                    <template v-slot:append>
                      <q-btn class="q-ml-sm" round color="primary" icon="add" @click="addCustomTask"
                        :disabled="!newTaskTitle.trim()" />
                    </template>
                  </q-input>
                </div>
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
  name: "ProjectTaskPlanCreate",
  props: {
    projectData: {
      type: Object,
      required: true
    },
    currentTab: {
      type: String,
      default: null,
      required: true
    },
    createdProjectId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      expandedAptitude: this.currentTab === "taskPlan",
      newTaskTitle: '',
      taskPlan: this.projectData.taskPlan || {
        tasks: [
          { title: 'Organisation Begehung (Teilnehmer*innen, Dokumentation)', completed: false, isDefault: true },
          { title: 'Organisation Zieldefinition (Arbeitsformat, Teilnehmer*innen, Dokumentation)', completed: false, isDefault: true },
          { title: 'Organisation Anforderungen definieren (Arbeitsformat, Teilnehmer*innen, Dokumentation)', completed: false, isDefault: true },
          { title: 'Richtlinien-Check (Inhalt – Durchsicht der Langfassung und Überführung der Projektbeschreibung in das entsprechende Formular)', completed: false, isDefault: true },
          { title: 'Richtlinien-Check (Antragsweg – Recherche und Dokumentation offener Fragen mit dem Fördermittelgebenden)', completed: false, isDefault: true },
          { title: 'Finanzierungscheck (Eigenmittel, Darlehen, weitere Fördermittel, Drittmittel/ Spenden)', completed: false, isDefault: true },
          { title: 'Abstimmung der Projektunterlagen ((Arbeitsformat, Teilnehmer*innen, Dokumentation)', completed: false, isDefault: true },
          { title: 'Vorbereitung Grundsatzbeschluss (Beschlussvorlage und Projektunterlagen)', completed: false, isDefault: true }
        ]
      },
      resetSteps: [
        { name: 'taskPlan', title: 'task plan', icon: 'mdi-checkbox-multiple-marked', done: true },
        { name: 'siteVisit', title: 'site visit', icon: 'mdi-map-marker', done: false },
        { name: 'goals', title: 'goals', icon: 'mdi-target', done: false },
        { name: 'requirements', title: 'requirements', icon: 'mdi-file-document', done: false }
      ]
    };
  },
  computed: {
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
      this.expandedAptitude = newTab === "taskPlan";
    }
  },
  methods: {
    // Get updated steps with taskPlan marked as done
    getUpdatedSteps() {
      // Use existing steps from projectData if available, otherwise use default steps
      const currentSteps = this.projectData.projectDevelopmentSteps || this.resetSteps;

      return currentSteps.map(step => {
        if (step.name === 'taskPlan') {
          // Mark taskPlan as done when submitting
          return { ...step, done: true };
        }
        // Keep all other steps as they are
        return { ...step };
      });
    },

    hasCompletedTasks() {
      return this.taskPlan.tasks.some(task => task.completed);
    },

    addCustomTask() {
      if (this.newTaskTitle.trim()) {
        // Add a new custom task
        this.taskPlan.tasks.push({
          title: this.newTaskTitle.trim(),
          completed: false,
          isDefault: false
        });
        // Clear the input
        this.newTaskTitle = '';
      }
    },

    removeCustomTask(index) {
      // Get the actual custom task to remove
      const taskToRemove = this.customTasks[index];

      // Find its index in the full task list and remove it
      const actualIndex = this.taskPlan.tasks.findIndex(task => task === taskToRemove);
      if (actualIndex !== -1) {
        this.taskPlan.tasks.splice(actualIndex, 1);
      }
    },

    async submitTaskPlan() {
      await this.$store.dispatch('project/simpleUpdateProjectIdea', {
        data: {
          id: this.createdProjectId,
          taskPlan: this.taskPlan,
          projectDevelopmentSteps: this.getUpdatedSteps()
        }
      });
      this.$emit("taskPlan-submitted", this.taskPlan);
    }
  }
}
</script>

<style lang="scss" scoped></style>
