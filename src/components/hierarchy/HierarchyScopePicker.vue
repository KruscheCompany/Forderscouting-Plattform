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
          :rules="required ? [val => !!val || $t('Required')] : []"
          @update:landkreis="onLandkreisSelect"
        />
      </label>

      <label class="hsp-field">
        <span class="hsp-field-label">{{ $t("userAdministration.administration") }}</span>
        <MunicipalitySelect
          :currentMunicipality="municipalityModel"
          :parentLandkreisId="landkreisModel && landkreisModel.id"
          @update:municipality="onMunicipalitySelect"
        />
      </label>

      <label class="hsp-field">
        <span class="hsp-field-label">{{ $t("hierarchyScope.town") }}</span>
        <LocationSelect
          :currentLocation="locationModel"
          :parentMunicipalityId="municipalityModel && municipalityModel.id"
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

export default {
  name: "hierarchyScopePicker",
  components: { LandkreisSelect, MunicipalitySelect, LocationSelect },
  props: {
    // v-model: { anchorLevel: 'landkreis'|'municipality'|'location', anchorId: Number|null }
    // State is display/filtering only - it never becomes the anchor, since the
    // backend has no concept of scoping a user to a whole federal state.
    value: {
      type: Object,
      default: () => ({ anchorLevel: "landkreis", anchorId: null }),
    },
    required: {
      type: Boolean,
      default: true,
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
    pathParts() {
      return [this.federalStateModel, this.landkreisModel, this.municipalityModel, this.locationModel]
        .filter(Boolean)
        .map(item => item.title);
    },
  },
  watch: {
    value: {
      deep: true,
      handler() {
        if (this.dataLoaded) this.hydrateFromAnchor();
      },
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
    // Fills in the anchor's own field and its ancestors, but only where a
    // field is still empty - never overrides a choice the user already made
    // (e.g. a municipality that spans several landkreise keeps whichever
    // district the user picked, instead of snapping to the first parent).
    hydrateFromAnchor() {
      const { anchorLevel, anchorId } = this.value || {};
      if (!anchorId) {
        this.federalStateModel = null;
        this.landkreisModel = null;
        this.municipalityModel = null;
        this.locationModel = null;
        return;
      }
      if (anchorLevel === "location" && !this.locationModel) {
        this.locationModel = this.findLocation(anchorId);
      }
      if (anchorLevel === "municipality" && !this.municipalityModel) {
        this.municipalityModel = this.findMunicipality(anchorId);
      }
      if (anchorLevel === "landkreis" && !this.landkreisModel) {
        this.landkreisModel = this.findLandkreis(anchorId);
      }
      if (this.locationModel && !this.municipalityModel) {
        const muniId = this.idOf((this.$store.getters["location/parentMunicipality"](this.locationModel.id) || [])[0]);
        if (muniId) this.municipalityModel = this.findMunicipality(muniId);
      }
      if (this.municipalityModel && !this.landkreisModel) {
        const lkId = this.idOf((this.$store.getters["municipality/parentLandkreise"](this.municipalityModel.id) || [])[0]);
        if (lkId) this.landkreisModel = this.findLandkreis(lkId);
      }
      if (this.landkreisModel && !this.federalStateModel) {
        const fsId = this.idOf((this.$store.getters["landkreis/federalStatesOf"](this.landkreisModel.id) || [])[0]);
        if (fsId) this.federalStateModel = this.findFederalState(fsId);
      }
    },
    emitAnchor() {
      let anchorLevel = null;
      let anchorId = null;
      if (this.locationModel) {
        anchorLevel = "location";
        anchorId = this.locationModel.id;
      } else if (this.municipalityModel) {
        anchorLevel = "municipality";
        anchorId = this.municipalityModel.id;
      } else if (this.landkreisModel) {
        anchorLevel = "landkreis";
        anchorId = this.landkreisModel.id;
      }
      this.$emit("input", { anchorLevel: anchorLevel || "landkreis", anchorId });
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
