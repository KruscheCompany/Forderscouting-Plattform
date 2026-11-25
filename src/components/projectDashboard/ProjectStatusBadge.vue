<template>
  <q-badge :color="getStatusColor(displayStatus)" :class="displayStatus === null ? 'text-black' : 'text-white'"
    class="q-py-sm q-px-md" :style="badgeStyle">
    {{ getStatusText(displayStatus) }}
  </q-badge>
</template>

<script>
import projectStatusLabels from "src/mixins/projectStatusLabels";

export default {
  name: "ProjectStatusBadge",
  mixins: [projectStatusLabels],
  props: {
    project: {
      type: Object,
      required: true
    },
    badgeStyle: {
      type: [String, Object],
      default: null
    }
  },
  computed: {
    displayStatus() {
      return this.getDisplayStatus(this.project);
    }
  }
};
</script>
