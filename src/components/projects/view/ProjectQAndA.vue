<template>
  <q-card class="shadow-1 radius-20">
    <q-expansion-item class="shadow-1 overflow-hidden radius-20" :label="$t('projectComponents.qAndA.title')"
      header-class="bg-white text-black" v-model="expandedQAndA">
      <q-card-section class="q-pt-none">
        <div v-if="questions && questions.length > 0">
          <q-list>
            <q-item v-for="(question, index) in questions" :key="index" class="q-mb-sm q-pa-none">
              <q-item-section>
                <h4 class="font-16 text-blue-grey-10 q-mb-none q-mt-none">
                  {{ question.text }}
                </h4>
                <q-banner rounded class="bg-grey-3 font-16">
                  <p class="q-my-sm text-block" v-html="question.answer || $t('projectComponents.qAndA.noAnswer')"></p>
                </q-banner>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <div v-else>
          <p class="text-grey">{{ $t('projectComponents.qAndA.noQuestions') }}</p>
        </div>
      </q-card-section>
    </q-expansion-item>
  </q-card>
</template>

<script>
export default {
  name: "ProjectQAndA",
  data() {
    return {
      expandedQAndA: this.currentTab === "qAndA", // Expand by default if currentTab is 'qAndA'
    };
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    currentTab: {
      type: String,
      default: null,
      required: true
    }
  },
  watch: {
    currentTab(newTab) {
      // Expand the section if the current tab is 'qAndA'
      this.expandedQAndA = newTab === "qAndA";
    }
  },
  computed: {
    questions() {
      return this.project.questions || [];
    }
  },
}
</script>

<style lang="scss" scoped></style>
