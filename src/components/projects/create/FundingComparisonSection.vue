<template>
  <div v-if="isVisible" class="comparison-section">

    <!-- Section Header -->
    <div class="section-header row items-center q-mb-lg">
      <div class="header-accent-bar" />
      <q-icon name="compare_arrows" class="q-mr-sm brand-icon" size="md" />
      <span class="text-h6 text-weight-bold text-grey-9">
        {{ $t('projectComponents.fundingCheck.Project funding comparison') }}
      </span>
      <q-badge v-if="selectedCardNumbers.length > 1" class="q-ml-sm brand-badge" :label="selectedCardNumbers.length"
        rounded />
    </div>

    <!-- Comparison Cards -->
    <div v-for="(cardIndex, idx) in selectedCardNumbers" :key="idx" class="comparison-card-wrapper q-mb-xl">
      <q-card class="comparison-card" flat bordered>

        <!-- Card Header -->
        <div class="card-header row items-center no-wrap q-px-lg q-py-md">
          <div class="index-badge q-mr-md">{{ idx + 1 }}</div>
          <div class="column">
            <div class="text-caption text-uppercase text-weight-bold letter-spacing-wide text-blue-grey-5">
              {{ $t('projectComponents.fundingCheck.Project funding comparison') }}
            </div>
            <div class="text-subtitle1 text-weight-bold text-grey-9 ellipsis">
              {{ fundingMatches[cardIndex]?.title || 'Förderung' }}
            </div>
          </div>
        </div>

        <q-separator />

        <!-- Comparison Grid -->
        <div class="q-pa-lg">
          <div class="row q-col-gutter-lg">

            <!-- Project Content Column -->
            <div class="col-12 col-md">
              <div class="comparison-panel project-panel full-height">
                <div class="panel-label row items-center q-mb-sm">
                  <div class="panel-dot panel-dot--project q-mr-sm" />
                  <span class="text-caption text-weight-bold text-uppercase letter-spacing-wide brand-text">
                    <q-icon name="folder_open" size="xs" class="q-mr-xs" />
                    {{ $t('projectContent.projectContent') }}
                  </span>
                </div>
                <div class="panel-body text-body2 text-grey-8"
                  v-html="formatBulletText(projectData.details.content) || 'Kein Projektinhalt angegeben'">
                </div>
              </div>
            </div>

            <!-- VS Divider (desktop only) -->
            <div class="col-auto gt-sm self-center">
              <div class="vs-badge">VS</div>
            </div>

            <!-- Funding Content Column -->
            <div class="col-12 col-md">
              <div class="comparison-panel funding-panel full-height">
                <div class="panel-label row items-center q-mb-sm">
                  <div class="panel-dot panel-dot--funding q-mr-sm" />
                  <span class="text-caption text-weight-bold text-uppercase letter-spacing-wide text-green-8">
                    <q-icon name="monetization_on" size="xs" class="q-mr-xs" />
                    {{ $t('What is funded?') }}
                  </span>
                </div>
                <div class="panel-body text-body2 text-grey-8 text-block"
                  v-html="getFundingDetails(cardIndex)?.details?.funded || 'Keine Förderinhalte verfügbar'">
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- AI Assessment Card -->
        <q-card class="ai-assessment-card q-mt-md" flat>
          <div class="ai-card-inner q-pa-lg">
            <div class="row items-start no-wrap">

              <!-- Icon Column -->
              <div class="ai-icon-wrapper q-mr-md">
                <q-icon name="auto_awesome" color="white" size="sm" />
              </div>

              <!-- Content Column -->
              <div class="col">
                <div class="row items-center no-wrap q-mb-xs">
                  <span class="text-subtitle1 text-weight-bold text-grey-8">
                    {{ $t('projectComponents.fundingCheck.aiAssessment') }}
                  </span>
                  <q-space />
                  <q-chip dense color="orange-3" text-color="orange-10" size="sm" icon="schedule"
                    class="coming-soon-chip text-weight-bold">
                    {{ $t('projectComponents.fundingCheck.comingSoon') }}
                  </q-chip>
                </div>
                <p class="text-body2 text-grey-6 q-mb-none">
                  {{ $t('projectComponents.fundingCheck.aiAssessmentTeaser') }}
                </p>
              </div>

            </div>
          </div>
        </q-card>

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
    formatBulletText(text) {
      if (!text) return '';
      const escape = (str) => str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      const lines = text.split('\n');
      let html = '';
      let inList = false;
      for (const line of lines) {
        // A bullet line: starts with "- " (dash + space)
        if (/^- /.test(line)) {
          if (!inList) { html += '<ul class="bullet-list">'; inList = true; }
          html += `<li>${escape(line.slice(2))}</li>`;
        } else {
          if (inList) { html += '</ul>'; inList = false; }
          const escaped = escape(line);
          html += escaped ? `<p class="q-mb-xs">${escaped}</p>` : '<br/>';
        }
      }
      if (inList) html += '</ul>';
      return html;
    },
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
  padding: 0 1rem 2rem;
  animation: fadeIn 0.4s ease-out;
}

// ── Section Header ────────────────────────────────────────────────────────────
.section-header {
  gap: 0;
}

.header-accent-bar {
  width: 4px;
  height: 22px;
  border-radius: 2px;
  background: linear-gradient(180deg, #000055, #2233aa);
  margin-right: 10px;
}

.letter-spacing-wide {
  letter-spacing: 0.06em;
}

// ── Comparison Card ───────────────────────────────────────────────────────────
.comparison-card-wrapper {
  position: relative;
}

.comparison-card {
  border-radius: 16px !important;
  border-color: #e0e0e0 !important;
  overflow: hidden;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08) !important;
  }
}

.card-header {
  background: linear-gradient(135deg, #f8f9fb 0%, #eef2f7 100%);
  border-bottom: 1px solid #e8edf3;
}

.index-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #000055, #2233aa);
  color: white;
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 85, 0.35);
}

// ── Comparison Panels ─────────────────────────────────────────────────────────
.comparison-panel {
  border-radius: 12px;
  padding: 1rem 1.25rem;
  min-height: 120px;
  display: flex;
  flex-direction: column;
}

.panel-label {
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  margin-bottom: 0.75rem !important;
}

.panel-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;

  &--project {
    background: #000055;
  }

  &--funding {
    background: #2e7d32;
  }
}

.panel-body {
  flex: 1;
  line-height: 1.65;
  overflow-wrap: break-word;

  :deep(.bullet-list) {
    margin: 0.25rem 0 0.25rem 1.25rem;
    padding: 0;

    li {
      margin-bottom: 0.2rem;
    }
  }

  :deep(p) {
    margin: 0 0 0.25rem;
  }
}

.project-panel {
  background: #f0f0ff;
  border: 1px solid rgba(0, 0, 85, 0.15);
}

.funding-panel {
  background: #f1faf2;
  border: 1px solid rgba(46, 125, 50, 0.15);
}

// ── Brand utilities ─────────────────────────────────────────────────────────
.brand-icon {
  color: #000055;
}

.brand-text {
  color: #000055;
}

.brand-badge {
  background: #000055 !important;
  color: white !important;
}

// ── VS Badge ──────────────────────────────────────────────────────────────────
.vs-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: white;
  border: 2px solid #e0e0e0;
  color: #9e9e9e;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  justify-content: center;
}

// ── AI Assessment Card ────────────────────────────────────────────────────────
.ai-assessment-card {
  border-radius: 14px !important;
  overflow: hidden;
  border: 1px dashed #bdbdbd !important;
  background: transparent !important;
}

.ai-card-inner {
  background: linear-gradient(135deg, #fafafa 0%, #f3f4f6 100%);
}

.ai-icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #757575, #9e9e9e);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.coming-soon-chip {
  animation: pulse 2.5s ease-in-out infinite;
  flex-shrink: 0;
}

.full-height {
  height: 100%;
}

// ── Animations ────────────────────────────────────────────────────────────────
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.55;
  }
}
</style>
