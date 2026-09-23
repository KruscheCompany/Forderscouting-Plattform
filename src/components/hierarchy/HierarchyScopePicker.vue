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
          :rules="atLeastOneRules"
          reactive-rules
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
          :rules="atLeastOneRules"
          @update:landkreis="onLandkreisSelect"
        />
      </label>

      <label class="hsp-field">
        <span class="hsp-field-label">{{ $t("userAdministration.administration") }}</span>
        <MunicipalitySelect
          :currentMunicipality="municipalityModel"
          :parentLandkreisId="landkreisModel && landkreisModel.id"
          :rules="municipalityOnly ? [val => !!val || $t('Required')] : atLeastOneRules"
          @update:municipality="onMunicipalitySelect"
        />
      </label>

      <label class="hsp-field">
        <span class="hsp-field-label">{{ $t("hierarchyScope.town") }}</span>
        <LocationSelect
          :currentLocation="locationModel"
          :parentMunicipalityId="municipalityModel && municipalityModel.id"
          :rules="atLeastOneRules"
          @update:location="onLocationSelect"
        />
      </label>
    </div>

    <div v-if="pathParts.length" class="hsp-path">
      <span class="hsp-path-label">{{ $t("hierarchyScope.path") }}</span>
      <span class="hsp-path-value">{{ pathParts.join(" › ") }}</span>
    </div>
  </div>
</template>

<script>
import LandkreisSelect from "components/Landkreise/LandkreisSelect.vue";
import MunicipalitySelect from "components/Municipality/MunicipalitySelect.vue";
import LocationSelect from "components/hierarchy/LocationSelect.vue";
import { emptyScope } from "components/hierarchy/scopePayload";

export default {
  name: "hierarchyScopePicker",
  components: { LandkreisSelect, MunicipalitySelect, LocationSelect },
  props: {
    // v-model: { anchorLevel: 'landkreis'|'municipality'|'location', anchorId: Number|null,
    //            levels: { federalStateId, landkreisId, municipalityId, locationId } }
    // The anchor is the most specific chosen level. `levels` holds every chosen
    // level, because a landkreis or municipality can belong to several parents
    // and only the stored choice says which one applies. Federal state is kept
    // as a level but is never the anchor.
    value: {
      type: Object,
      default: () => emptyScope(),
    },
    required: {
      type: Boolean,
      default: true,
    },
    // A coordinator (leader) always belongs to exactly one municipality: the
    // municipality is required and is always the emitted anchor. The other
    // levels can still be chosen and are kept alongside it.
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
      locationModel: null,
      dataLoaded: false,
    };
  },
  computed: {
    federalStateOptions() {
      const federalStates = this.$store.state.federalState.federalStates || [];
      return [...federalStates].sort((a, b) => a.title.localeCompare(b.title));
    },
    currentLevels() {
      const idOrNull = item => (item ? item.id : null);
      return {
        federalStateId: idOrNull(this.federalStateModel),
        landkreisId: idOrNull(this.landkreisModel),
        municipalityId: idOrNull(this.municipalityModel),
        locationId: idOrNull(this.locationModel),
      };
    },
    pathParts() {
      return [this.federalStateModel, this.landkreisModel, this.municipalityModel, this.locationModel]
        .filter(Boolean)
        .map(item => item.title);
    },
    // Non-leader roles can be scoped to any single level (state, landkreis,
    // municipality, or location) - not landkreis specifically. Applied to all
    // four fields so picking any one of them clears the error on the rest.
    atLeastOneRules() {
      if (!this.required || this.municipalityOnly) return [];
      return [
        () =>
          !!(this.federalStateModel || this.landkreisModel || this.municipalityModel || this.locationModel) ||
          this.$t("hierarchyScope.atLeastOneRequired"),
      ];
    },
  },
  watch: {
    value: {
      deep: true,
      handler() {
        if (this.dataLoaded) this.hydrateFromAnchor();
      },
    },
    municipalityOnly() {
      if (this.dataLoaded) this.hydrateFromAnchor();
    },
  },
  methods: {
    idOf(item) {
      return item && typeof item === "object" ? item.id : item;
    },
    findFederalState(id) {
      return (this.$store.state.federalState.federalStates || []).find(fs => fs.id === id) || null;
    },
    findLandkreis(id) {
      return (this.$store.state.landkreis.landkreise || []).find(lk => lk.id === id) || null;
    },
    findMunicipality(id) {
      return (this.$store.state.municipality.municipalities || []).find(m => m.id === id) || null;
    },
    findLocation(id) {
      return (this.$store.state.location.locations || []).find(l => l.id === id) || null;
    },
    // The single candidate of an ancestor lookup, or null when there is none or
    // more than one - an ambiguous parent is left for the admin to choose.
    onlyOne(list) {
      const ids = (list || []).map(item => this.idOf(item));
      return ids.length === 1 ? ids[0] : null;
    },
    // Fills every level that is still empty from the stored `levels`, then from
    // the anchor and its unambiguous ancestors - never overrides a choice the
    // user already made (e.g. a municipality that spans several landkreise keeps
    // whichever district was picked). Emits when this changed what the parent
    // holds, so the parent always sees exactly what is shown here.
    hydrateFromAnchor() {
      const { anchorLevel, anchorId, levels } = this.value || {};
      const hasLevels = !!levels && Object.values(levels).some(Boolean);
      if (!anchorId && !hasLevels) {
        this.federalStateModel = null;
        this.landkreisModel = null;
        this.municipalityModel = null;
        this.locationModel = null;
        return;
      }
      if (levels) {
        if (!this.federalStateModel && levels.federalStateId) this.federalStateModel = this.findFederalState(levels.federalStateId);
        if (!this.landkreisModel && levels.landkreisId) this.landkreisModel = this.findLandkreis(levels.landkreisId);
        if (!this.municipalityModel && levels.municipalityId) this.municipalityModel = this.findMunicipality(levels.municipalityId);
        if (!this.locationModel && levels.locationId) this.locationModel = this.findLocation(levels.locationId);
      }
      if (anchorLevel === "location" && anchorId && !this.locationModel) {
        this.locationModel = this.findLocation(anchorId);
      }
      if (anchorLevel === "municipality" && anchorId && !this.municipalityModel) {
        this.municipalityModel = this.findMunicipality(anchorId);
      }
      if (anchorLevel === "landkreis" && anchorId && !this.landkreisModel) {
        this.landkreisModel = this.findLandkreis(anchorId);
      }
      if (this.locationModel && !this.municipalityModel) {
        const muniId = this.onlyOne(this.$store.getters["location/parentMunicipality"](this.locationModel.id));
        if (muniId) this.municipalityModel = this.findMunicipality(muniId);
      }
      if (this.municipalityModel && !this.landkreisModel) {
        const lkId = this.onlyOne(this.$store.getters["municipality/parentLandkreise"](this.municipalityModel.id));
        if (lkId) this.landkreisModel = this.findLandkreis(lkId);
      }
      if (this.landkreisModel && !this.federalStateModel) {
        const fsId = this.onlyOne(this.$store.getters["landkreis/federalStatesOf"](this.landkreisModel.id));
        if (fsId) this.federalStateModel = this.findFederalState(fsId);
      }
      const anchorIsMunicipality = anchorLevel === "municipality" && anchorId === this.idOf(this.municipalityModel);
      const levelsChanged = Object.keys(this.currentLevels).some(key => this.currentLevels[key] !== ((levels || {})[key] || null));
      if (levelsChanged || (this.municipalityOnly && this.municipalityModel && !anchorIsMunicipality)) {
        this.emitAnchor();
      }
    },
    emitAnchor() {
      const levels = this.currentLevels;
      if (this.municipalityOnly) {
        if (this.municipalityModel) {
          this.$emit("input", { anchorLevel: "municipality", anchorId: this.municipalityModel.id, levels });
        }
        return;
      }
      let anchorLevel = "landkreis";
      let anchorId = null;
      if (this.locationModel) {
        anchorLevel = "location";
        anchorId = this.locationModel.id;
      } else if (this.municipalityModel) {
        anchorLevel = "municipality";
        anchorId = this.municipalityModel.id;
      } else if (this.landkreisModel) {
        anchorId = this.landkreisModel.id;
      }
      this.$emit("input", { anchorLevel, anchorId, levels });
    },
    onFederalStateSelect(item) {
      this.federalStateModel = item;
      this.landkreisModel = null;
      this.municipalityModel = null;
      this.locationModel = null;
      this.emitAnchor();
    },
    onLandkreisSelect(item) {
      this.landkreisModel = item;
      this.municipalityModel = null;
      this.locationModel = null;
      this.emitAnchor();
    },
    onMunicipalitySelect(item) {
      this.municipalityModel = item;
      this.locationModel = null;
      this.emitAnchor();
    },
    onLocationSelect(item) {
      this.locationModel = item;
      this.emitAnchor();
    },
  },
  async mounted() {
    await Promise.all([
      this.$store.dispatch("federalState/getFederalStates"),
      this.$store.dispatch("landkreis/getLandkreise"),
      this.$store.dispatch("municipality/getMunicipalities"),
      this.$store.dispatch("location/getLocations"),
    ]);
    this.dataLoaded = true;
    this.hydrateFromAnchor();
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
