<template>
  <div v-if="isVisible" class="comparison-section q-px-md q-pb-lg">
    <q-card class="shadow-0 radius-20 q-pa-md">
      <div class="text-h6 q-mb-md">{{ $t('projectComponents.fundingCheck.Project funding comparison') }}</div>

      <!-- Goals Comparison -->
      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-12 col-md-6">
          <q-card class="project-data-card q-pa-md full-height">
            <div class="text-subtitle1 text-primary">
              <q-icon name="description" class="q-mr-sm" />
              {{ $t('projectContent.projectGoals') }}
            </div>
            <div class="text-body1 q-mt-sm">{{ projectData.details.goals || 'Keine Projektziele angegeben' }}</div>
          </q-card>
        </div>
        <div class="col-12 col-md-6">
          <q-card class="funding-data-card q-pa-md full-height">
            <div class="text-subtitle1 text-secondary">
              <q-icon name="monetization_on" class="q-mr-sm" />
              {{ $t('Funding goal') }}
            </div>
            <div class="text-body1 q-mt-sm">{{ funding?.details?.goal || 'Keine Förderziele verfügbar' }}</div>
          </q-card>
        </div>
      </div>

      <!-- Content Comparison -->
      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-12 col-md-6">
          <q-card class="project-data-card q-pa-md full-height">
            <div class="text-subtitle1 text-primary">
              <q-icon name="description" class="q-mr-sm" />
              {{ $t('projectContent.projectContent') }}
            </div>
            <div class="text-body1 q-mt-sm">
              {{ projectData.details.content || 'Kein Projektinhalt angegeben' }}</div>
          </q-card>
        </div>
        <div class="col-12 col-md-6">
          <q-card class="funding-data-card q-pa-md full-height">
            <div class="text-subtitle1 text-secondary">
              <q-icon name="monetization_on" class="q-mr-sm" />
              {{ $t('What is funded?') }}
            </div>
            <div class="text-body1 q-mt-sm">
              {{ funding?.details?.funded || 'Keine Förderinhalte verfügbar' }}</div>
          </q-card>
        </div>
      </div>

      <!-- Budget & Financial Comparison -->
      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-12 col-md-6">
          <q-card class="project-data-card q-pa-md full-height">
            <div class="text-subtitle1 text-primary">
              <q-icon name="description" class="q-mr-sm" />
              {{ $t('ProjectDashboard.totalInvestment') }}
            </div>
            <div class="row q-col-gutter-sm q-mt-sm">
              <div class="col-12">
                <strong>{{ projectData.financialPlan?.costAndFinance.length ?
                  projectData.financialPlan?.costAndFinance[0].title : '' }}:</strong>
                {{ projectData.financialPlan?.costAndFinance.length ?
                  formatCurrency(projectData.financialPlan?.costAndFinance[0].value) : 'Nicht angegeben' }}
              </div>
            </div>
          </q-card>
        </div>
        <div class="col-12 col-md-6">
          <q-card class="funding-data-card q-pa-md full-height">
            <div class="text-subtitle1 text-secondary">
              <q-icon name="monetization_on" class="q-mr-sm" />
              {{ $t('Funding rates') }}
            </div>
            <div class="row q-col-gutter-sm q-mt-sm">
              <div class="col-12" v-for="rate in funding?.rates" :key="rate.id">
                <strong>{{ rate.content }}:</strong>
                {{ rate.amount }}%
              </div>
            </div>
          </q-card>
        </div>
      </div>

      <!-- End Date Comparison -->
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-card class="project-data-card q-pa-md full-height">
            <div class="text-subtitle1 text-primary">
              <q-icon name="description" class="q-mr-sm" />
              {{ $t('projectIdeaPlaceholder.plannedEndDate') }}
            </div>
            <div class="text-body1 q-mt-sm">
              {{ projectData.details?.startingCondition?.endDate ?
                formatDate(projectData.details?.startingCondition?.endDate) : 'Kein Enddatum angegeben' }}
            </div>
          </q-card>
        </div>
        <div class="col-12 col-md-6">
          <q-card class="funding-data-card q-pa-md full-height">
            <div class="text-subtitle1 text-secondary">
              <q-icon name="monetization_on" class="q-mr-sm" />
              {{ $t('projectIdeaPlaceholder.plannedEndDate') }}
            </div>
            <div class="text-body1 q-mt-sm">
              {{ funding?.plannedEnd ? funding?.plannedEnd : 'Kein Enddatum angegeben' }}
            </div>
          </q-card>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'FundingComparisonSection',
  props: {
    selectedCard: {
      type: [Number, String, null],
      default: null
    },
    projectData: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    funding() {
      return this.$store.state.funding.funding;
    },
    isVisible() {
      return this.selectedCard !== null && typeof this.selectedCard === 'number';
    }
  },
  methods: {
    formatCurrency(value) {
      if (!value || value === '') {
        return 0;
      }

      // Convert to number if it's a string
      const numValue = typeof value === 'string' ? parseFloat(value.replace(/[.,]/g, match => match === ',' ? '.' : '')) : value;

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
    },
    formatDate(date) {
      if (!date) return 'N/A';
      // Format date as dd.mm.yyyy
      return new Date(date).toLocaleDateString('de-DE');
    }
  }
};
</script>

<style lang="scss" scoped>
.comparison-section {
  margin-top: 2rem;

  .q-card {
    background: #FFFFFF;
  }

  .project-data-card {
    background: rgba(25, 118, 210, 0.05);
    border-left: 4px solid #1976d2;

    .text-subtitle1 {
      color: #1976d2;
    }
  }

  .funding-data-card {
    background: rgba(76, 175, 80, 0.05);
    border-left: 4px solid #4caf50;

    .text-subtitle1 {
      color: #4caf50;
    }
  }

  .full-height {
    height: 100%;
  }

  // Animation for the comparison section
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
