<template>
  <q-card class="shadow-1 radius-20">
    <q-expansion-item class="shadow-1 overflow-hidden radius-20" :label="$t('projectComponents.financingCheck.title')"
      header-class="bg-white text-black" v-model="expandedFinancingCheck">
      <q-card-section class="q-pt-none">
        <div class="row">
          <div class="col-8 q-pr-sm">
            <h4 class="font-16 text-blue-grey-10 q-my-none">
              {{ $t('projectComponents.contentDetails.financingOverview') }}
            </h4>
            <q-banner rounded class="bg-grey-3 font-16">
              <p class="q-my-sm text-block" v-html="financialPlanDescription"></p>
            </q-banner>
          </div>
          <div class="col-4">

            <h4 class="font-16 text-blue-grey-10 q-my-none">
              {{ $t('projectComponents.contentDetails.financialPlanTitle') }}
            </h4>
            <div class="col-12 col-md-4 q-mb-xs" v-for="(plan, index) in costAndFinance" :key="index">
              <div class="q-py-sm q-pl-md bg-grey-3" style="height: 40.5px">
                <p class="font-14 text-weight-bold q-my-none text-blue">{{ plan.title }}:
                  <span class="font-16 text-weight-regular">
                    {{ formatCurrency(plan.value) }}
                  </span>
                </p>
              </div>
            </div>

          </div>
        </div>
      </q-card-section>
    </q-expansion-item>
  </q-card>
</template>

<script>
export default {
  name: "ProjectFinancingCheck",
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
      expandedFinancingCheck: this.currentTab === "financingCheck",
    };
  },
  computed: {
    financialPlan() {
      return this.project && this.project.financialPlan
        ? this.project.financialPlan
        : { description: '', costAndFinance: [] };
    },
    financialPlanDescription() {
      return this.financialPlan.description || this.$t('projectComponents.financingCheck.noContent');
    },
    costAndFinance() {
      return this.financialPlan.costAndFinance || [];
    }
  },
  methods: {
    formatCurrency(value) {
      if (!value) return '0,00 €';

      // Convert to number if it's a string
      const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.')) : value;

      if (isNaN(numValue)) {
        return value; // Return original value if not a number
      }

      // Format using German locale (thousands: ".", decimal: ",")
      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(numValue);
    }
  },
  watch: {
    currentTab(newTab) {
      // Expand the section if the current tab is 'financingCheck'
      this.expandedFinancingCheck = newTab === "financingCheck";
    }
  }
}
</script>

<style lang="scss" scoped>
.text-block {
  white-space: pre-line;
  min-height: 144px
}
</style>
