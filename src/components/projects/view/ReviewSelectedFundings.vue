<template>
  <q-card class="shadow-1 radius-20">
    <q-expansion-item class="shadow-1 overflow-hidden radius-20" :label="$t('projectComponents.fundingCheck.title')"
      header-class="bg-white text-black" default-opened>
      <div v-if="!fundings.length" class="q-pa-md text-blue-grey-7">
        {{ $t('projectComponents.fundingCheck.noFundingData') }}
      </div>

      <div v-else class="q-pa-md column q-gutter-y-md">
        <div v-for="funding in fundings" :key="funding.id || funding.title" class="selected-funding radius-20">
          <div class="selected-funding-title text-weight-medium">{{ funding.title }}</div>

          <div class="selected-funding-grid">
            <div class="selected-funding-label">{{ $t('Funding rates') }}</div>
            <div>
              <span v-if="funding.fundingRates" class="pre-line">{{ funding.fundingRates }}</span>
              <span v-else class="text-blue-grey-6">{{ $t('projectComponents.contentDetailsView.notSpecified') }}</span>
            </div>

            <div class="selected-funding-label">{{ $t('Own contribution') }}</div>
            <div>
              <span v-if="funding.ownContribution" class="pre-line">{{ funding.ownContribution }}</span>
              <span v-else class="text-blue-grey-6">{{ $t('projectComponents.contentDetailsView.notSpecified') }}</span>
            </div>

            <div class="selected-funding-label">{{ $t('help.accumulability') }}</div>
            <div>
              <template v-if="typeof funding.accumulability === 'boolean'">
                {{ funding.accumulability ? $t('Yes') : $t('No') }}
              </template>
              <span v-else class="text-blue-grey-6">{{ $t('projectComponents.contentDetailsView.notSpecified') }}</span>
            </div>
          </div>
        </div>
      </div>
    </q-expansion-item>
  </q-card>
</template>

<script>
export default {
  name: "ReviewSelectedFundings",
  props: {
    fundings: {
      type: Array,
      default: () => []
    }
  }
};
</script>

<style lang="scss" scoped>
.selected-funding {
  border: 1px solid #e0e0e0;
  padding: 16px 20px;
}

.selected-funding-title {
  font-size: 17px;
  line-height: 1.3;
  color: #000055;
  margin-bottom: 12px;
}

.selected-funding-grid {
  display: grid;
  grid-template-columns: minmax(160px, 260px) 1fr;
  gap: 10px 24px;
  font-size: 15px;
}

.selected-funding-label {
  color: #546e7a;
}

.pre-line {
  white-space: pre-line;
}

@media (max-width: 599px) {
  .selected-funding-grid {
    grid-template-columns: 1fr;
    gap: 2px;
  }

  .selected-funding-label {
    margin-top: 8px;
  }
}
</style>
