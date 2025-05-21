<template>
  <div>
    <div
      class="bg-white radius-20"
    >
      <div class="row" v-if="!!project">
        <!-- Project idea title -->
        <div class="col-12 col-md-4">
          <strong style="color: #0050ff">
            {{ project.title }}
          </strong>
        </div>
        <!-- Project idea info -->
        <div class="col-12 col-md-8" style="margin-top: -25px">
          <span @click="expanded = !expanded" class="cursor-pointer q-mb-sm" style="color: #0050ff; display: flex; justify-content: end;">
              <span v-show="!expanded">
                Alle öffnen
              </span>
              <span v-show="expanded">
                Alle schließen
              </span>
                <q-icon v-show="expanded" name="arrow_upward" class="q-mb-xs" size="xs"/>
              <q-icon v-show="!expanded" name="arrow_downward" class="q-mb-xs" size="xs"/>
            </span>
          <q-expansion-item
          switch-toggle-side
          expand-separator
          :label="$t('newProjectIdeaForm.projectStartingCondition')"
          header-style="color: #0050ff; font-weight: bold; background-color: #e7efff;"
          dense
          :default-opened="expandAll"
          ref="expandableItem1"
          expand-icon-toggle
          class="q-mb-md"
        >
          <q-card>
            <q-card-section style="background-color: #e7efff;">
              {{project.details.startingCondition}}
            </q-card-section>
          </q-card>
        </q-expansion-item>
         <q-expansion-item
            switch-toggle-side
            expand-separator
            :default-opened="expandAll"
            :label="$t('projectContent.projectContent')"
            header-style="color: #0050ff; font-weight: bold; background-color: #f6f9ff;"
            dense
            ref="expandableItem2"
             expand-icon-toggle
             class="q-mb-md"
          >
            <q-card>
              <q-card-section style="background-color: #f6f9ff;">
                 {{ project.details.content }}
              </q-card-section>
            </q-card>
          </q-expansion-item>
           <q-expansion-item
            switch-toggle-side
            expand-separator
            :default-opened="expandAll"
            :label="$t('projectContent.projectGoals')"
            header-style="color: #0050ff; font-weight: bold; background-color: #e7efff;"
            dense
            ref="expandableItem3"
             expand-icon-toggle
               class="q-mb-md"
          >
            <q-card>
              <q-card-section style="background-color: #e7efff;">
                 {{ project.details.goals }}
              </q-card-section>
            </q-card>
          </q-expansion-item>
           <q-expansion-item
              switch-toggle-side
              expand-separator
              :default-opened="expandAll"
              :label="$t('projectContent.projectValue&Benefits')"
              header-style="color: #0050ff; font-weight: bold; background-color: #f6f9ff;"
              dense
              ref="expandableItem4"
               expand-icon-toggle
               class="q-mb-md"
            >
              <q-card>
                <q-card-section style="background-color: #f6f9ff;">
                  {{ project.details.valuesAndBenefits }}
                </q-card-section>
              </q-card>
            </q-expansion-item>

             <q-expansion-item
            switch-toggle-side
            expand-separator
            :default-opened="expandAll"
            :label="$t('Investive') + '/' + $t('Non-Investive')"
            header-style="color: #0050ff; font-weight: bold; background-color: #e7efff;"
            dense
            ref="expandableItem5"
             expand-icon-toggle
               class="q-mb-md"
          >
            <q-card>
              <q-card-section style="background-color: #e7efff;">
                {{ project.details.investive ? $t("Investive") : $t("Non-Investive") }}
              </q-card-section>
            </q-card>
          </q-expansion-item>
          <q-expansion-item
              switch-toggle-side
              expand-separator
              :default-opened="expandAll"
              :label="$t('projectContent.projectStatus')"
              header-style="color: #0050ff; font-weight: bold; background-color: #f6f9ff;"
              dense
              ref="expandableItem6"
               expand-icon-toggle
               class="q-mb-md"
            >
              <q-card>
                <q-card-section style="background-color: #f6f9ff;">
                 {{ $t(project.details.status) }}
                </q-card-section>
              </q-card>
            </q-expansion-item>
             <q-expansion-item
                switch-toggle-side
                expand-separator
                :default-opened="expandAll"
                :label="$t('projectContent.estimatedCost')"
                header-style="color: #0050ff; font-weight: bold; background-color: #e7efff;"
                dense
                ref="expandableItem7"
                 expand-icon-toggle
               class="q-mb-md"
              >
                <q-card>
                  <q-card-section style="background-color: #e7efff;">
                   <div
                        v-if="project.estimatedCosts &&
                          project.estimatedCosts.length > 0
                          "
                      >
                        <div
                          class="q-ml-md font-16 row justify-between"
                          v-for="(cost, index) in project.estimatedCosts"
                          :key="index"
                        >
                          <div class="col-auto">
                            <p class="q-mb-sm">
                              {{ cost.name }}
                            </p>
                          </div>
                          <div class="col-auto text-right ">
                            <p class="q-mb-sm text-overflow">{{ cost.price }} €</p>
                          </div>
                        </div>
                      </div>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
             <q-expansion-item
                switch-toggle-side
                expand-separator
                :default-opened="expandAll"
                :label="$t('projectContent.plannedPeriod')"
                header-style="color: #0050ff; font-weight: bold; background-color: #f6f9ff;"
                dense
                ref="expandableItem8"
                 expand-icon-toggle
               class="q-mb-md"
              >
                <q-card>
                  <q-card-section style="background-color: #f6f9ff;">
                    <div class="q-ml-md font-16 row">
                        <div class="col-6 text-left">
                          <p class="q-mb-sm">{{ $t("start") }}</p>
                        </div>
                        <div class="col-6 text-right">
                          <p class="q-mb-sm">
                            {{
                              dateFormatter(project.plannedStart) ||
                              "No start date found"
                            }}
                          </p>
                        </div>
                        <div class="col-6 text-left">
                          <p class="q-mb-sm">{{ $t("end") }}</p>
                        </div>
                        <div class="col-6 text-right">
                          <p class="q-mb-sm">
                            {{
                              dateFormatter(project.plannedEnd) ||
                              "No end date found"
                            }}
                          </p>
                        </div>
                      </div>
                  </q-card-section>
                </q-card>
              </q-expansion-item>
              <q-expansion-item
                  switch-toggle-side
                  expand-separator
                  :default-opened="expandAll"
                  :label="$t('projectContent.links')"
                  header-style="color: #0050ff; font-weight: bold; background-color: #e7efff;"
                  dense
                  ref="expandableItem9"
                   expand-icon-toggle
               class="q-mb-md"
                >
                  <q-card>
                    <q-card-section style="background-color: #e7efff;">
                      <div v-if="project.links && project.links.length > 0">
                            <div
                              class="row"
                              v-for="(link, index) in project.links"
                              :key="index"
                            >
                              <p class="q-mb-none">{{ link.title }}</p>
                              <a
                                class="col-12 q-mb-sm text-blue block text-weight-600 text-overflow"
                                target="_blank"
                                rel="noopener noreferrer"
                                :href="link.link.split('://')[0].substring(0, 5) ===
                                    'https'
                                    ? link.link
                                    : link.link.split('://')[0].substring(0, 4) ===
                                      'http'
                                      ? link.link
                                      : `http://${link.link}`
                                  "
                              >
                                {{ link.link }}
                              </a>
                            </div>
                          </div>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { dateFormatter } from "src/boot/dateFormatter";
  export default {
    name: "InlineProjectView",
    props: {
      projectID: {
        type: Number,
        default: 0
      },
      expandAll: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        model: this.projectID,
        selectedProject: null,
        expanded: false,
      };
    },
  methods: {
    dateFormatter,
      async getProject() {
        await this.$store.dispatch("project/getSpecificProject", {
          id: Number(this.model)
        });
    },
    },
    computed: {
      project() {
      return this.$store.state.project.project;
    },
    
  },
    watch: {
    expanded() {
        for (let index = 1; index < 10; index++) {
          const item = this.$refs[`expandableItem${index}`];
          if (this.expanded) {
            item.show();
          } else {
            item.hide();
          }
        }
    },
  },
    mounted() {
      this.getProject();
    }
  }
</script>

<style lang="scss" scoped>

</style>
