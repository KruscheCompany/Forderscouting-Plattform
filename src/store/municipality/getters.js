import { relationsOf } from "../hierarchyHelpers";

export function parentLandkreise(state) {
  return (municipalityId) => relationsOf(state.municipalities, municipalityId, "landkreise");
}
