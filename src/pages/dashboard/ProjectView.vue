<template>
  <q-page class="q-mt-lg bg-blue-1" :class="$q.screen.gt.sm ? 'q-mx-xl' : 'q-mx-sm'">
    <q-toolbar class="bg-blue text-white shadow-2 radius-top-20">
      <q-tabs v-model="tab" shrink stretch active-color="yellow" content-class="custom-borders">
        <q-tab v-for="tab in tabs" :key="tab.name" :name="tab.name" :label="tab.label" />
      </q-tabs>
    </q-toolbar>
    <q-stepper v-model="step" header-nav ref="stepper" color="primary" animated class="radius-bottom-20 shadow-2">
      <q-step v-for="(step, index) in steps" :key="index" :name="step.name" :title="step.title" :icon="step.icon"
        :done="step.done" :header-nav="step.done" />
    </q-stepper>
    <ProjectContent :currentTab="step" />
  </q-page>
</template>

<script>
import ProjectContent from "components/projects/view/ProjectContent.vue";
export default {
  name: "projectView",
  components: {
    ProjectContent,
  },
  data() {
    return {
      step: 'project',
      tab: 'tab1',
      tabs: [
        { name: 'tab1', label: this.$t('projectView.tabs.aiFundingCheck') },
        { name: 'tab2', label: this.$t('projectView.tabs.projectDevelopment') },
        { name: 'tab3', label: this.$t('projectView.tabs.application') }
      ],
    };
  },
  computed: {
    project() {
      return this.$store.getters["project/getProject"];
    },
    steps() {
      return this.project ? this.project.fundingCheckSteps : [
        { name: 'project', title: this.$t('projectView.steps.projectDescription'), icon: 'description', done: true },
        { name: 'fundingCheck', title: this.$t('projectView.steps.fundingCheck'), icon: 'monetization_on', done: false },
        { name: 'qAndA', title: this.$t('projectView.steps.openQuestions'), icon: 'help_outline', done: false },
        { name: 'aptitude', title: this.$t('projectView.steps.aptitude'), icon: 'check_circle', done: false },
        { name: 'decision', title: this.$t('projectView.steps.basicDecision'), icon: 'gavel', done: false }
      ];
    }
  },
  methods: {
    async getData() {
      this.$q.loading.show();
      await this.$store.dispatch("project/getSpecificProject", {
        id: Number(this.$route.params.id || this.$route.params.projectId)
      });
      this.$q.loading.hide();
    },
  },
  mounted() {
    this.getData();
  }
};
</script>

<style lang="scss">
.carouselThumbnails .q-tabs__arrow--end {
  right: -70px;
  color: $blue;
}

.carouselThumbnails .q-tabs__arrow--start {
  left: -70px;
  color: $blue;
}

.custom-borders {
  .q-tab:not(:first-child)::before {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0%;
    width: 2px;
    height: 40%;
    background-color: $grey;
  }

  &-secondary {
    .q-tab:not(:first-child)::before {
      content: '';
      position: absolute;
      top: 50%;
      transform: translateY(-50%) rotate(15deg);
      left: 0%;
      width: 2px;
      height: 40%;
      background-color: $grey;
    }
  }
}

.fundingCheckTabs:hover>.q-focus-helper {
  background-color: transparent !important;
}

.q-stepper__header--border {
  border: 0
}

[dir] .q-stepper--horizontal .q-stepper__step-inner {
  padding: 0;
}
</style>
