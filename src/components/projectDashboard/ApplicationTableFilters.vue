<template>
  <div class="col-12">
    <q-expansion-item header-class="no-padding items-center" expand-icon-class="hidden"
      :value="expanded" @input="$emit('update:expanded', $event)" expand-icon-toggle>
      <template v-slot:header>
        <div class="col-8 col-md-4">
          <q-input clearable borderless outlined class="bg-white input-radius-6 no-shadow q-mb-sm q-mt-sm"
            :value="search" @input="$emit('update:search', $event)" :placeholder="$t('Search')" dense role="searchbox">
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
        <q-space />
        <div class="col-md-4 text-right">
          <q-btn no-caps @click="$emit('update:expanded', !expanded)" icon="filter_alt" color="primary" class="radius-6"
            :flat="!expanded" :unelevated="expanded" label="Filter">
          </q-btn>
        </div>
      </template>

      <q-separator class="q-mb-md" />
      <div class="row q-px-md q-py-md q-col-gutter-x-lg bg-yellow-2"
        style="margin-left: -16px; margin-right: -16px; margin-bottom: -16px; border-radius: 0 0 20px 20px;">

        <div class="col-6 col-md-4" v-if="isAdmin && showMunicipalityFilter">
          <p class="text-black q-mb-xs font-16">
            {{ $t("ProjectDashboard.municipalities") }}
          </p>
          <q-select clearable class="no-shadow q-mb-lg input-radius-4" color="primary" bg-color="white"
            :label="$t('Search')" multiple filled :options="municipalityOptions"
            :value="selectedMunicipalities" @input="$emit('update:selectedMunicipalities', $event)"
            option-value="id" option-label="title">
          </q-select>
        </div>

        <div class="col-6 col-md-4">
          <p class="text-black q-mb-xs font-16">
            {{ $t("ProjectDashboard.applicationProcess") }}
          </p>
          <q-select clearable class="no-shadow q-mb-lg input-radius-4" color="primary" bg-color="white"
            :label="$t('Search')" multiple filled :options="applicationStepOptions"
            :value="selectedApplicationSteps" @input="$emit('update:selectedApplicationSteps', $event)"
            option-value="value" option-label="title">
          </q-select>
        </div>

        <div class="col-6 col-md-4">
          <p class="text-black q-mb-xs font-16">
            {{ $t("ProjectDashboard.status") }}
          </p>
          <q-select clearable class="no-shadow q-mb-lg input-radius-4" color="primary" bg-color="white"
            :label="$t('Search')" multiple filled :options="statusOptions"
            :value="selectedStatus" @input="$emit('update:selectedStatus', $event)"
            option-value="value" option-label="title">
          </q-select>
        </div>

        <div class="col-6" :class="isAdmin && showMunicipalityFilter ? 'col-md-3' : 'col-md-4'" v-if="showLocationFilter">
          <p class="text-black q-mb-xs font-16">
            {{ $t("ProjectDashboard.locations") }}
          </p>
          <q-select clearable class="no-shadow q-mb-lg input-radius-4" color="primary" bg-color="white"
            :label="$t('Search')" multiple filled :options="locationOptions"
            :value="selectedLocations" @input="$emit('update:selectedLocations', $event)"
            option-value="title" option-label="title">
          </q-select>
        </div>

        <div class="col-6" :class="isAdmin && showMunicipalityFilter ? 'col-md-3' : 'col-md-4'" v-if="showInvestiveFilter">
          <p class="text-black q-mb-xs font-16">
            {{ $t("ProjectDashboard.investive") }}
          </p>
          <q-select clearable class="no-shadow q-mb-lg input-radius-4" color="primary" bg-color="white"
            :label="$t('Search')" multiple filled :options="investiveOptions"
            :value="selectedInvestive" @input="$emit('update:selectedInvestive', $event)"
            option-value="value" option-label="title">
          </q-select>
        </div>

        <div class="col-6" :class="isAdmin && showMunicipalityFilter ? 'col-md-3' : 'col-md-4'">
          <p class="text-black q-mb-xs font-16">
            {{ $t("ProjectDashboard.categories") }}
          </p>
          <q-select clearable class="no-shadow q-mb-lg input-radius-4" color="primary" bg-color="white"
            :label="$t('Search')" multiple filled :options="categoryOptions"
            :value="selectedCategories" @input="$emit('update:selectedCategories', $event)"
            option-value="id" option-label="title">
          </q-select>
        </div>

        <div class="col-6" :class="isAdmin && showMunicipalityFilter ? 'col-md-3' : 'col-md-4'">
          <p class="text-black q-mb-xs font-16">
            {{ $t("Tags") }}
          </p>
          <q-select clearable class="no-shadow q-mb-lg input-radius-4" color="primary" bg-color="white"
            :label="$t('Search')" multiple filled :options="tagKeywordsOptions"
            :value="tagsKeywords" @input="$emit('update:tagsKeywords', $event)"
            option-value="id" option-label="title">
          </q-select>
        </div>

      </div>
    </q-expansion-item>
  </div>
</template>

<script>
export default {
  name: "ApplicationTableFilters",
  props: {
    expanded: { type: Boolean, default: false },
    search: { type: String, default: "" },
    isAdmin: { type: Boolean, default: false },
    showMunicipalityFilter: { type: Boolean, default: true },
    showLocationFilter: { type: Boolean, default: true },
    showInvestiveFilter: { type: Boolean, default: true },
    municipalityOptions: { type: Array, default: () => [] },
    applicationStepOptions: { type: Array, default: () => [] },
    statusOptions: { type: Array, default: () => [] },
    investiveOptions: { type: Array, default: () => [] },
    categoryOptions: { type: Array, default: () => [] },
    tagKeywordsOptions: { type: Array, default: () => [] },
    locationOptions: { type: Array, default: () => [] },
    selectedMunicipalities: { type: Array, default: null },
    selectedApplicationSteps: { type: Array, default: null },
    selectedStatus: { type: Array, default: null },
    selectedLocations: { type: Array, default: null },
    selectedInvestive: { type: Array, default: null },
    selectedCategories: { type: Array, default: null },
    tagsKeywords: { type: Array, default: null },
  },
};
</script>
