<template>
  <div class="hsp">
    <div class="hsp-grid">
      <label class="hsp-field">
        <span class="hsp-field-label">{{ $t("hierarchyScope.state") }}</span>
        <q-select
          outlined
          dense
          v-model="federalStateModel"
          :options="federalStateOptions"
          options-selected-class="text-primary text-weight-600"
          class="no-shadow input-radius-6"
          hide-bottom-space
          @input="onFederalStateSelect"
        >
          <template v-slot:selected>
            <template v-if="federalStateModel">
              <span>{{ federalStateModel.title }}</span>
            </template>
            <template v-else>
              <span class="text-grey">{{ $t("hierarchyScope.selectState") }}</span>
            </template>
          </template>
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
              <q-item-section>
                <q-item-label>{{ scope.opt.title }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </label>

      <label class="hsp-field">
        <span class="hsp-field-label">{{ $t("landkreise.landkreisName") }}</span>
        <LandkreisSelect
          :currentLandkreis="landkreisModel"
          :parentFederalStateId="federalStateModel && federalStateModel.id"
          :rules="landkreisRules"
          @update:landkreis="onLandkreisSelect"
        />
      </label>

      <label class="hsp-field">
        <span class="hsp-field-label">{{ $t("userAdministration.administration") }}</span>
        <MunicipalitySelect
          :currentMunicipality="municipalityModel"
          :parentLandkreisId="landkreisModel && landkreisModel.id"
          :parentFederalStateId="federalStateModel && federalStateModel.id"
          :rules="municipalityRules"
          @update:municipality="onMunicipalitySelect"
        />
      </label>
    </div>

    <div v-if="pathText" class="hsp-path">
      <span class="hsp-path-label">{{ $t("hierarchyScope.path") }}</span>
      <span class="hsp-path-value">{{ pathText }}</span>
    </div>
  </div>
</template>

<script>
import LandkreisSelect from "components/Landkreise/LandkreisSelect.vue";
import MunicipalitySelect from "components/Municipality/MunicipalitySelect.vue";
import { relationId } from "src/store/hierarchyHelpers";
import {
  emptyScope,
  selectionToScope,
  reconcileSelection,
  filtersForAnchor,
  pathGroups,
  pathLabel,
} from "components/hierarchy/scopePayload";

export default {
  name: "hierarchyScopePicker",
  components: { LandkreisSelect, MunicipalitySelect },
  props: {
    // v-model: { anchorLevel: 'landkreis'|'municipality', anchorId: Number|null }
    // Only the anchor is stored: the municipality if chosen, else the landkreis.
    // The state and landkreis dropdowns narrow the choices; when a municipality
    // is the anchor they are shown for orientation and are never saved.
    value: {
      type: Object,
      default: () => emptyScope(),
    },
    required: {
      type: Boolean,
      default: true,
    },
    // A coordinator (leader) always belongs to exactly one municipality, so the
    // municipality is required and is the only possible anchor.
    municipalityOnly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      federalStateModel: null,
      landkreisModel: null,
      municipalityModel: null,
      dataLoaded: false,
      lastEmitted: null,
    };
  },
  computed: {
    federalStateOptions() {
      const federalStates = this.$store.state.federalState.federalStates || [];
      return [...federalStates].sort((a, b) => a.title.localeCompare(b.title));
    },
    currentSelection() {
      const idOrNull = item => (item ? item.id : null);
      return {
        federalStateId: idOrNull(this.federalStateModel),
        landkreisId: idOrNull(this.landkreisModel),
        municipalityId: idOrNull(this.municipalityModel),
      };
    },
    lookup() {
      const getters = this.$store.getters;
      const ids = list => (list || []).map(relationId);
      const titleOf = (items, id) => {
        const item = (items || []).find(entry => entry.id === id);
        return item ? item.title : null;
      };
      const { federalState, landkreis, municipality } = this.$store.state;
      return {
        landkreiseOfMunicipality: id => ids(getters["municipality/parentLandkreise"](id)),
        federalStatesOfLandkreis: id => ids(getters["landkreis/federalStatesOf"](id)),
        federalStatesOfMunicipality: id => getters["municipality/federalStatesOfMunicipality"](id),
        landkreisIdsUnderState: id => ids(getters["federalState/landkreiseUnder"](id)),
        municipalityIdsUnderState: id => getters["federalState/municipalitiesUnderState"](id),
        municipalityIdsUnderLandkreis: id => ids(getters["landkreis/municipalitiesUnder"](id)),
        title: (level, id) =>
          titleOf(
            { federalState: federalState.federalStates, landkreis: landkreis.landkreise, municipality: municipality.municipalities }[level],
            id
          ),
      };
    },
    pathText() {
      if (!this.dataLoaded) return "";
      return pathLabel(pathGroups(this.currentSelection, this.lookup));
    },
    // A state alone cannot be saved, so the landkreis or municipality is what
    // has to be chosen. A leader needs the municipality itself.
    landkreisRules() {
      if (!this.required || this.municipalityOnly) return [];
      return [
        () => !!(this.landkreisModel || this.municipalityModel) || this.$t("hierarchyScope.atLeastOneRequired"),
      ];
    },
    municipalityRules() {
      if (!this.required) return [];
      if (this.municipalityOnly) return [val => !!val || this.$t("Required")];
      return [
        () => !!(this.landkreisModel || this.municipalityModel) || this.$t("hierarchyScope.atLeastOneRequired"),
      ];
    },
  },
  watch: {
    value(scope) {
      if (this.dataLoaded && scope !== this.lastEmitted) this.hydrateFromScope();
    },
    municipalityOnly() {
      if (this.dataLoaded) this.emitScope();
    },
  },
  methods: {
    findFederalState(id) {
      return (this.$store.state.federalState.federalStates || []).find(fs => fs.id === id) || null;
    },
    findLandkreis(id) {
      return (this.$store.state.landkreis.landkreise || []).find(lk => lk.id === id) || null;
    },
    findMunicipality(id) {
      return (this.$store.state.municipality.municipalities || []).find(m => m.id === id) || null;
    },
    setSelection({ federalStateId, landkreisId, municipalityId }) {
      this.federalStateModel = federalStateId ? this.findFederalState(federalStateId) : null;
      this.landkreisModel = landkreisId ? this.findLandkreis(landkreisId) : null;
      this.municipalityModel = municipalityId ? this.findMunicipality(municipalityId) : null;
    },
    hydrateFromScope() {
      const scope = this.value || emptyScope();
      if (!scope.anchorId) {
        this.setSelection({});
        return;
      }
      const municipalityId = scope.anchorLevel === "municipality" ? scope.anchorId : null;
      const filters = filtersForAnchor(scope, this.currentSelection, this.lookup);
      this.setSelection({ ...filters, municipalityId });
    },
    emitScope() {
      const scope = selectionToScope(this.currentSelection, this.municipalityOnly);
      this.lastEmitted = scope;
      this.$emit("input", scope);
    },
    applySelection(selection) {
      const scope = selectionToScope(selection, this.municipalityOnly);
      const filters = filtersForAnchor(scope, selection, this.lookup);
      this.setSelection({ ...selection, ...filters });
      this.emitScope();
    },
    onFederalStateSelect(item) {
      const selection = { ...this.currentSelection, federalStateId: item ? item.id : null };
      this.applySelection(reconcileSelection(selection, "federalState", this.lookup));
    },
    onLandkreisSelect(item) {
      const selection = { ...this.currentSelection, landkreisId: item ? item.id : null };
      this.applySelection(reconcileSelection(selection, "landkreis", this.lookup));
    },
    onMunicipalitySelect(item) {
      this.applySelection({ ...this.currentSelection, municipalityId: item ? item.id : null });
    },
  },
  async mounted() {
    await Promise.all([
      this.$store.dispatch("federalState/getFederalStates"),
      this.$store.dispatch("landkreis/getLandkreise"),
      this.$store.dispatch("municipality/getMunicipalities"),
    ]);
    this.dataLoaded = true;
    this.hydrateFromScope();
  },
};
</script>

<style scoped>
.hsp-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 16px;
}

@media (max-width: 480px) {
  .hsp-grid {
    grid-template-columns: 1fr;
  }
}

.hsp-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.hsp-field-label {
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #46527f;
}

.hsp-path {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 6px;
  margin-top: 14px;
  padding-top: 10px;
  border-top: 1px dashed #dfe4f5;
}

.hsp-path-label {
  font-size: 11.5px;
  font-weight: 700;
  color: #7c86ae;
}

.hsp-path-value {
  font-size: 12.5px;
  color: #46527f;
}
</style>
