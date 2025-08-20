<template>
  <q-card class="shadow-1 radius-20">
    <q-expansion-item class="shadow-1 overflow-hidden radius-20" :label="$t('projectComponents.fundingCheck.title')"
      header-class="bg-white text-black" v-model="expandedFundingCheck">

      <div class="row q-col-gutter-sm q-pa-md">
        <div class="col-12 col-sm-6 col-md-3 col-lg-2" v-for="(funding, index) in fundingMatches" :key="index">
          <div class="funding-card shadow-0 radius-20 q-pl-md q-pt-sm q-pb-md q-pr-sm cursor-pointer transition-all"
            :class="{ 'selected': selectedFundingIndex === index }" @mouseenter="hoveredCard = index"
            @mouseleave="hoveredCard = null">

            <!-- Card content with flex layout -->
            <div class="card-content">
              <!-- Top row with index and link button -->
              <div class="row items-center justify-between q-mb-sm">
                <div class="funding-index text-weight-bold text-primary">
                  {{ index + 1 }}
                </div>
                <q-btn flat dense round size="lg" icon="mdi-arrow-top-right-thin-circle-outline"
                  :color="selectedFundingIndex === index ? 'white' : 'black'"
                  @click.stop="openFundingLink(funding.link)" class="funding-link-btn" />
              </div>

              <!-- Spacer to push title to bottom -->
              <div class="flex-spacer"></div>

              <!-- Title at bottom -->
              <div class="funding-title font-16 text-weight-medium q-mb-md">
                {{ funding.title }}
              </div>
            </div>
          </div>
        </div>

        <!-- Fehlanzeige Card -->
        <div class="col-12 col-sm-6 col-md-3 col-lg-2">
          <div class="fehlanzeige-card shadow-0 radius-20 q-pl-md q-pt-sm q-pb-md q-pr-sm cursor-pointer transition-all"
            :class="{ 'selected': selectedFundingIndex === -1 }">

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
import funding from 'src/store/funding';


export default {
  name: "ProjectFundingCheck",
  data() {
    return {
      expandedFundingCheck: this.currentTab === 'fundingCheck', // Expand by default if currentTab is 'fundingCheck'
      selectedCard: null,
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
        (this.project && this.project.fundingMatches.filter((funding) => !funding.isFehlanzeige)) ||
        this.$t('projectComponents.fundingCheck.noFundingData')
      );
    },
    selectedFundingIndex() {
      if (!Array.isArray(this.fundingMatches)) return -1;
      return this.fundingMatches.findIndex(funding => funding.selected && !funding.isFehlanzeige);
    },
  },
  watch: {
    currentTab(newTab) {
      // Expand the section if the current tab is 'fundingCheck'
      this.expandedFundingCheck = newTab === "fundingCheck";
    }
  },
  methods: {
    openFundingLink(link) {
      if (link) {
        window.open(link, '_blank');
      }
    },
  },

}
</script>

<style lang="scss" scoped>
.funding-card {
  background: #f5f5f5;
  min-height: 160px;
  max-height: 160px;
  border: 2px solid transparent;
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
    border-color: #1976d2;
    transform: translateY(-2px);
  }

  &.selected {
    background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
    border: 0;
    box-shadow: none;
    color: white;

    .funding-index {
      background: white
    }

    .funding-title {
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
  background: rgba(25, 118, 210, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: $blue;
}

.funding-link-btn {
  opacity: 0.7;
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
  transition: all 0.3s ease;
}

// Fehlanzeige Card Styles
.fehlanzeige-card {
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  border: 2px dashed #ff9800;
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
    background: rgba(255, 152, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ff9800;
  }

  &:hover {
    border-color: #f57c00;
    transform: translateY(-2px);
    opacity: 1;
  }

  &.selected {
    background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
    border: 2px solid #ff9800;
    color: white;

    .fehlanzeige-icon {
      background: white;
      color: #ff9800;
    }
  }
}

// Responsive adjustments
@media (max-width: 1023px) {
  .funding-card {
    min-height: 140px;
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

  .fehlanzeige-card {
    min-height: 120px;
    max-height: 120px;
  }
}
</style>
