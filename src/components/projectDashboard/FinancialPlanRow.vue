<template>
  <q-tr class="financial-plan-container" v-show="visible">
    <q-td colspan="100%">
      <div class="text-left q-pa-md">
        <template v-if="financialPlan && financialPlan.costAndFinance">
          <div class="financial-grid">
            <div v-for="(item, index) in financialPlan.costAndFinance" :key="index" class="financial-grid-row">
              <p class="font-14 text-weight-bold text-blue q-mb-none">{{ item.title }}: </p>
              <div class="row items-center">
                <p class="font-14 text-blue q-mb-none">{{ formatCurrency(item.value) }}</p>
                <p v-if="item.title === 'Fördermittel'" class="font-14 text-blue q-ml-sm q-mb-none text-weight-bold">
                  {{ selectedFundingTitle }}
                </p>
                <q-btn v-if="item.title === 'Fördermittel' && fundingMatches && fundingMatches.length" flat dense round
                  size="sm" icon="mdi-arrow-top-right-thin-circle-outline" @click.stop="openFundingLink"
                  class="funding-link-btn" :disabled="!externalId" />
              </div>
            </div>
          </div>
        </template>
        <div v-else class="text-black">{{ $t('ProjectDashboard.noFinancialData') }}</div>
      </div>
    </q-td>
  </q-tr>
</template>

<script>
export default {
  name: "FinancialPlanRow",
  props: {
    visible: { type: Boolean, default: false },
    financialPlan: { type: Object, default: null },
    fundingMatches: { type: Array, default: () => [] },
    externalId: { type: [String, Number], default: null },
  },
  computed: {
    selectedFundingTitle() {
      const funding = (this.fundingMatches || []).find((item) => item.selected);
      return funding ? funding.title : "";
    },
  },
  methods: {
    formatCurrency(value) {
      if (!value || value === '') {
        return 0;
      }

      const numValue = typeof value === 'string' ? parseFloat(value.replace(/[.,]/g, match => match === ',' ? '.' : '')) : value;

      if (isNaN(numValue)) {
        return value;
      }

      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numValue);
    },
    openFundingLink() {
      if (this.externalId) {
        window.open(`/user/newFunding/${this.externalId}`, '_blank');
      }
    },
  },
};
</script>

<style lang="scss">
.financial-plan-container {
  background-color: #f5f5f5;
}

.financial-grid {
  display: grid;
  grid-template-columns: max-content 1fr;
  align-items: center;
  column-gap: 12px;
  row-gap: 4px;

  .financial-grid-row {
    display: contents;
  }
}
</style>
