<template>
  <q-card class="shadow-1 radius-20">
    <q-expansion-item class="shadow-1 overflow-hidden radius-20" :label="$t('projectComponents.fundingCheck.title')"
      header-class="bg-white text-black" v-model="expandedFundingCheck">

      <div class="row q-col-gutter-sm q-pa-md">
        <div class="col-12 col-sm-6 col-md-3 col-lg-3" v-for="(funding, index) in fundingMatches" :key="index">
          <div class="funding-card shadow-0 radius-20 q-pl-md q-pt-sm q-pb-md q-pr-sm cursor-pointer transition-all"
            :class="{ 'selected': selectedFundingIndices.includes(index) }"
            :style="!selectedFundingIndices.includes(index) ? getFundingCardStyle(funding.score) : {}"
            @mouseenter="hoveredCard = index" @mouseleave="hoveredCard = null">

            <!-- Card content with flex layout -->
            <div class="card-content">
              <!-- Top row with index and link button -->
              <div class="row items-center justify-between q-mb-sm">
                <div class="col">
                  <div class="row items-center">
                    <div class="funding-index text-weight-bold q-mr-sm" :style="{
                      color: !selectedFundingIndices.includes(index) ? getFundingCardStyle(funding.score).color : 'white',
                      background: !selectedFundingIndices.includes(index)
                        ? (getFundingCardStyle(funding.score).color === 'white' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)')
                        : 'rgba(255,255,255,0.15)'
                    }">
                      {{ index + 1 }}
                    </div>
                    <div class="funding-score text-weight-bold">
                      <q-icon name="star" size="16px" class="q-mr-xs" color="amber" />
                      {{ (funding.score * 100).toFixed(2) }}%
                    </div>
                  </div>
                </div>
                <q-btn flat dense round size="lg" icon="mdi-arrow-top-right-thin-circle-outline"
                  :style="{ color: !selectedFundingIndices.includes(index) ? getFundingCardStyle(funding.score).color : 'white' }"
                  @click.stop="openFundingLink(funding.external_id)" class="funding-link-btn"
                  :disabled="!funding.external_id" />
              </div>

              <!-- Spacer to push title to bottom -->
              <div class="flex-spacer"></div>

              <!-- Title at bottom -->
              <div class="funding-title font-16 text-weight-medium q-mb-md">
                {{ funding.title }}
                <q-tooltip v-if="funding.title && funding.title.length > 72" anchor="bottom left" self="top left"
                  content-style="font-size: 14px; max-width: 300px; white-space: normal;">
                  {{ funding.title }}
                </q-tooltip>
              </div>
            </div>
          </div>
        </div>

        <!-- Fehlanzeige Card -->
        <div class="col-12 col-sm-6 col-md-3 col-lg-3">
          <div class="fehlanzeige-card shadow-0 radius-20 q-pl-md q-pt-sm q-pb-md q-pr-sm cursor-pointer transition-all"
            :class="{ 'selected': hasFehlanzeige }">

            <div class="card-content">
              <!-- Top row with icon -->
              <div class="row items-center justify-between q-mb-sm">
                <div class="fehlanzeige-icon">
                  <q-icon name="close" size="sm" />
                </div>
              </div>

              <!-- Spacer to push title to bottom -->
              <div class="flex-spacer"></div>

              <!-- Title at bottom -->
              <div class="funding-title font-16 text-weight-medium q-mb-md">
                {{ $t('projectComponents.fundingCheck.fehlanzeige') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-expansion-item>
  </q-card>
</template>

<script>

export default {
  name: "ProjectFundingCheck",
  data() {
    return {
      expandedFundingCheck: this.currentTab === 'fundingCheck', // Expand by default if currentTab is 'fundingCheck'
      hoveredCard: null,
    };
  },
  props: {
    project: {
      type: Object,
      required: true,
    },
    currentTab: {
      type: String,
      default: null,
      required: true
    }
  },
  computed: {
    fundingMatches() {
      return (
        (this.project && (this.project.fundingMatches || []).filter((funding) => !funding.isFehlanzeige)) ||
        this.$t('projectComponents.fundingCheck.noFundingData')
      );
    },
    selectedFundingIndices() {
      if (!Array.isArray(this.fundingMatches)) return [];

      // Return array of indices for all selected fundings
      return this.fundingMatches
        .map((funding, index) => funding.selected ? index : -1)
        .filter(index => index !== -1);
    },
    hasFehlanzeige() {
      return this.project &&
        this.project.fundingMatches &&
        this.project.fundingMatches.some(funding => funding.selected && funding.isFehlanzeige);
    }
  },
  watch: {
    currentTab(newTab) {
      // Expand the section if the current tab is 'fundingCheck'
      this.expandedFundingCheck = newTab === "fundingCheck";
    }
  },
  methods: {
    getFundingCardStyle(score) {
      const pct = score * 100;
      if (pct >= 90) return { background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)', color: 'white' };
      if (pct >= 80) return { background: 'linear-gradient(135deg, #388e3c 0%, #66bb6a 100%)', color: 'white' };
      if (pct >= 70) return { background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)', color: '#1b5e20' };
      if (pct >= 60) return { background: 'linear-gradient(135deg, #f1f8e9 0%, #dcedc8 100%)', color: '#33691e' };
      if (pct >= 50) return { background: 'linear-gradient(135deg, #f9fbe7 0%, #f1f8e9 100%)', color: '#558b2f' };
      return { background: 'linear-gradient(135deg, #fafafa 0%, #eeeeee 100%)', color: '#616161' };
    },
    openFundingLink(externalId) {
      if (externalId) {
        // Construct URL to funding details page
        const url = `/user/newFunding/${externalId}`;
        window.open(url, '_blank');
      }
    },
  },

}
</script>

<style lang="scss" scoped>
.funding-card {
  background: transparent;
  min-height: 160px;
  max-height: 160px;
  border: 2px solid white;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  .card-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 148px; // Account for padding
  }

  .flex-spacer {
    flex: 1;
  }

  &:hover {
    border-color: #000055;
    transform: translateY(-4px);
  }

  &.selected {
    background: #000055;
    border: 0;
    box-shadow: none;

    .funding-title {
      color: white;
    }

    .funding-score {
      color: white;
    }

    .funding-preview {
      color: rgba(255, 255, 255, 0.8);
    }

    .q-icon {
      color: rgba(255, 255, 255, 0.8);
    }
  }
}

.funding-index {
  font-size: 1.2em;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.funding-score {
  display: flex;
  align-items: center;
  font-size: 0.9em;

  .q-icon {
    margin-top: -2px;
  }
}

.funding-link-btn {
  opacity: 0.6;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
}

.funding-title {
  font-size: 14px;
  line-height: 1.3;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.funding-preview {
  font-size: 12px;
}

.expanded-content {
  border-left: 4px solid #1976d2;
  margin-left: 8px;
}

.transition-all {
  transition: all 0.2s ease;
}

// Refresh Card Styles
.refresh-card {
  background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
  border: 2px dashed #4caf50;
  opacity: 0.9;
  min-height: 160px;
  max-height: 160px;
  overflow: hidden;

  .card-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 148px; // Account for padding - same as funding cards
  }

  .flex-spacer {
    flex: 1;
  }

  .refresh-icon {
    font-size: 1.2em;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: rgba(76, 175, 80, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #4caf50;

    .rotating {
      animation: spin 2s linear infinite;
    }
  }

  &:hover {
    border-color: #388e3c;
    transform: translateY(-2px);
    opacity: 1;
  }

  &.selected {
    background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
    border: 2px solid #4caf50;
    color: white;

    .refresh-icon {
      background: white;
      color: #4caf50;
    }
  }

  &.loading {
    background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
    border: 2px solid #4caf50;
    color: white;
    cursor: not-allowed;

    .refresh-icon {
      background: white;
      color: #4caf50;
    }

    &:hover {
      transform: none;
    }
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

// Fehlanzeige Card Styles
.fehlanzeige-card {
  background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
  border: 2px dashed #f44336;
  opacity: 0.9;
  min-height: 160px;
  max-height: 160px;
  overflow: hidden;

  .card-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 148px; // Account for padding - same as funding cards
  }

  .flex-spacer {
    flex: 1;
  }

  .fehlanzeige-icon {
    font-size: 1.2em;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: rgba(244, 67, 54, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #f44336;
  }

  &:hover {
    border-color: #d32f2f;
    transform: translateY(-2px);
    opacity: 1;
  }

  &.selected {
    background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
    border: 2px solid #f44336;
    color: white;

    .fehlanzeige-icon {
      background: white;
      color: #f44336;
    }
  }
}

// Responsive adjustments
@media (max-width: 1023px) {
  .funding-card {
    min-height: 140px;
  }

  .refresh-card {
    min-height: 140px;
    max-height: 140px;
  }

  .fehlanzeige-card {
    min-height: 140px;
    max-height: 140px;
  }
}

@media (max-width: 767px) {
  .funding-card {
    min-height: 120px;
  }

  .funding-title {
    font-size: 13px;
    min-height: 35px;
  }

  .refresh-card {
    min-height: 140px;
    max-height: 140px;
  }

  .fehlanzeige-card {
    min-height: 140px;
    max-height: 140px;
  }
}
</style>
