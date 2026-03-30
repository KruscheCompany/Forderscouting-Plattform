<template>
  <div v-if="isVisible" class="comparison-section q-px-md q-pb-lg">
    <div v-for="(cardIndex, idx) in selectedCardNumbers" :key="idx" class="q-mb-lg">
      <q-card class="shadow-0 radius-20 q-pa-md">
        <div class="row items-center q-mb-md">
          <div class="text-h6">{{ $t('projectComponents.fundingCheck.Project funding comparison') }}</div>
          <q-chip class="q-ml-md" color="primary" text-color="white" size="md">
            {{ fundingMatches[cardIndex]?.title || 'Förderung' }}
          </q-chip>
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
                <p class="q-mt-sm q-mb-sm text-block" v-html="getFundingDetails(cardIndex)?.details?.funded || 'Keine Förderinhalte verfügbar'"></p>
              </div>
            </q-card>
          </div>
        </div>
      </q-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FundingComparisonSection',
  props: {
    selectedCards: {
      type: Array,
      default: () => []
    },
    projectData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      fundingDetails: {}, // Cache for funding details
    };
  },
  computed: {
    funding() {
      return this.$store.state.funding.funding;
    },
    isVisible() {
      // Check if there's a regular funding card selected (not fehlanzeige)
      return this.selectedCards && this.selectedCards.length > 0 &&
        this.selectedCards.some(card => typeof card === 'number');
    },
    fundingMatches() {
      // Get the funding matches from the project data or from the store
      return !!this.projectData.fundingMatches && this.projectData.fundingMatches.length > 0
        ? this.projectData.fundingMatches.filter(funding => !funding.isFehlanzeige)
        : this.$store.getters['ai/getFundingMatches'] || [];
    },
    selectedCardNumbers() {
      // Filter to get only numeric indices (exclude 'fehlanzeige')
      return this.selectedCards.filter(card => typeof card === 'number');
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
    },
    async fetchFundingDetails(index) {
      if (!this.fundingMatches[index]) {
        return null;
      }

      // Check if we've already fetched this funding's details
      if (this.fundingDetails[index]) {
        return this.fundingDetails[index];
      }

      try {
        // Reset store and fetch funding details
        await this.$store.dispatch('funding/resetSelectedFunding');
        const fundingId = this.fundingMatches[index].external_id;

        // Call the store action to get specific funding data
        await this.$store.dispatch('funding/getSpecificFunding', { id: fundingId });

        // Store the funding details in our cache
        this.fundingDetails[index] = this.$store.state.funding.funding;

        return this.fundingDetails[index];
      } catch (error) {
        console.error(`Error fetching details for funding at index ${index}:`, error);
        return null;
      }
    },
    getFundingDetails(index) {
      // Return cached funding if available
      if (this.fundingDetails[index]) {
        return this.fundingDetails[index];
      }

      // Add a flag to prevent repeated API calls for the same index
      if (!this.fundingDetails[`${index}_loading`]) {
        this.fundingDetails[`${index}_loading`] = true;
        this.fetchFundingDetails(index).finally(() => {
          this.fundingDetails[`${index}_loading`] = false;
        });
      }

      // Return current store value in meantime
      return this.funding;
    }
  },
  watch: {
    selectedCardNumbers: {
      immediate: true,
      async handler(newSelectedCards) {
        // Prefetch details for all selected cards sequentially to avoid overloading
        if (newSelectedCards && newSelectedCards.length > 0) {
          for (const index of newSelectedCards) {
            // Skip if already in cache or currently loading
            if (!this.fundingDetails[index] && !this.fundingDetails[`${index}_loading`]) {
              this.fundingDetails[`${index}_loading`] = true;
              try {
                await this.fetchFundingDetails(index);
              } finally {
                this.fundingDetails[`${index}_loading`] = false;
              }
            }
          }
        }
      }
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
