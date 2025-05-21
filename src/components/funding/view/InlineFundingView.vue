<template>
    <div>
      <div
        class="bg-white radius-20"
      >
        <div class="row" v-if="!!funding">
          <!-- Funding idea title -->
          <div class="col-12 col-md-4">
            <strong style="color: #0050ff; background-color: 'inheret'">
              {{ funding.title }}
            </strong>
          </div>
          <!-- Funding info -->
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
            :label="$t('Funding goal')"
            header-style="color: #0050ff; font-weight: bold; background-color: #e7efff;"
            dense
            ref="expandableItem1"
            :default-opened="expandAll"
            expand-icon-toggle
            class="q-mb-md"
          >
            <q-card>
              <q-card-section style="background-color: #e7efff;">
                {{funding.details.goal}}
              </q-card-section>
            </q-card>
          </q-expansion-item>
          <q-expansion-item
              switch-toggle-side
              expand-separator
              :default-opened="expandAll"
              :label="$t('What is funded?')"
              header-style="color: #0050ff; font-weight: bold; background-color: #f6f9ff;"
              dense
              ref="expandableItem2"
               expand-icon-toggle
               class="q-mb-md"
            >
              <q-card>
                <q-card-section style="background-color: #f6f9ff;">
                   {{ funding.details.funded }}
                </q-card-section>
              </q-card>
          </q-expansion-item>

          <q-expansion-item
          switch-toggle-side
          expand-separator
          :default-opened="expandAll"
          :label="$t('What is not funded?')"
          header-style="color: #0050ff; font-weight: bold; background-color: #e7efff;"
          dense
          ref="expandableItem3"
            expand-icon-toggle
              class="q-mb-md"
        >
          <q-card>
            <q-card-section style="background-color: #e7efff;">
              {{ funding.details.notFunded }}
            </q-card-section>
          </q-card>
          </q-expansion-item>
          <q-expansion-item
            switch-toggle-side
            expand-separator
            :default-opened="expandAll"
            :label="$t('Who will be funded?')"
            header-style="color: #0050ff; font-weight: bold; background-color: #f6f9ff;"
            dense
            ref="expandableItem4"
              expand-icon-toggle
              class="q-mb-md"
          >
            <q-card>
              <q-card-section style="background-color: #f6f9ff;">
                {{ funding.details.willBeFunded }}
              </q-card-section>
            </q-card>
          </q-expansion-item>
  
          <q-expansion-item
            switch-toggle-side
            expand-separator
            :default-opened="expandAll"
            :label="$t('Conditions for Applicants')"
            header-style="color: #0050ff; font-weight: bold; background-color: #e7efff;"
            dense
            ref="expandableItem5"
              expand-icon-toggle
                class="q-mb-md"
          >
            <q-card>
              <q-card-section style="background-color: #e7efff;">
                {{ funding.details.condition }}
              </q-card-section>
            </q-card>
          </q-expansion-item>
          <q-expansion-item
              switch-toggle-side
              expand-separator
              :default-opened="expandAll"
              :label="$t('Funding rates')"
              header-style="color: #0050ff; font-weight: bold; background-color: #f6f9ff;"
              dense
              ref="expandableItem6"
                expand-icon-toggle
                class="q-mb-md"
            >
              <q-card>
                <q-card-section style="background-color: #f6f9ff;">
                  <div
                    v-if="funding.rates && funding.rates.length > 0"
                  >
                    <div
                      v-for="(rate, index) in funding.rates"
                      :key="index"
                      class="row"
                      :class="
                        $q.screen.gt.sm
                          ? 'q-col-gutter-x-xl'
                          : 'q-col-gutter-x-sm'
                      "
                    >
                      <div class="col-10 col-md-auto">
                        <p class="q-mt-sm q-mb-sm inline-block">
                          {{ rate.content || "" }}
                        </p>
                      </div>
                      <div class="col-auto col-md-auto">
                        <p class="q-mt-sm q-mb-sm inline-block">
                          {{ rate.amount || "" }}%
                        </p>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
          </q-expansion-item>
          <q-expansion-item
          switch-toggle-side
          :default-opened="expandAll"
          expand-separator
          :label="$t('Basis for assessment')"
          header-style="color: #0050ff; font-weight: bold; background-color: #e7efff;"
          dense
          ref="expandableItem7"
            expand-icon-toggle
          class="q-mb-md"
        >
          <q-card>
            <q-card-section style="background-color: #e7efff;">
              <p
                class="q-mt-sm q-mb-sm text-block"
                v-html="
                  !!funding.assessment ? funding.assessment : ''
                "
              ></p>
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
      name: "InlineFundingView",
      props: {
        fundingId: {
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
          model: this.fundingId,
          selectedFunding: null,
          expanded: false
        };
      },
    methods: {
        dateFormatter,
        async getFunding() {
          await this.$store.dispatch("funding/getSpecificFunding", {
            id: Number(this.model)
          });
      }
      },
      computed: {
        funding() {
        return this.$store.state.funding.funding;
      }
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
      }
    },
    mounted() {
      this.getFunding();
    }
    }
  </script>
  
  <style lang="scss" scoped>
  
  </style>
  