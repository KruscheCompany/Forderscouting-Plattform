<template>
  <q-dialog v-model="showDialog" persistent transition-show="scale" transition-hide="scale">
    <q-card class="radius-20 shadow-2" style="min-width: 560px; max-width: 700px;">
      <q-card-section class="row items-center no-wrap">
        <div class="col font-18 text-weight-600">
          {{ $t('projectComponents.aptitude.vorpruefung.overrideTitle') }}
        </div>
        <q-btn flat round dense icon="close" color="grey-7" @click="close" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="font-14 text-blue-grey-7">
          {{ $t('projectComponents.aptitude.vorpruefung.overrideHint', { type: $t(`projectComponents.aptitude.vorpruefung.${type}`) }) }}
        </div>
      </q-card-section>

      <q-card-section>
        <VorpruefungDecisionForm :submitting="submitting"
          :submit-label="$t('projectComponents.aptitude.vorpruefung.overrideSubmit')" @submit="submit" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import VorpruefungDecisionForm from "src/components/projects/VorpruefungDecisionForm.vue";

export default {
  name: "VorpruefungOverrideDialog",
  components: { VorpruefungDecisionForm },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    projectId: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      submitting: false
    };
  },
  computed: {
    showDialog: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      }
    }
  },
  methods: {
    close() {
      this.showDialog = false;
    },
    async submit(payload) {
      this.submitting = true;
      let ok = false;
      try {
        ok = await this.$store.dispatch("project/overrideVorpruefungTicket", {
          projectId: this.projectId,
          type: this.type,
          ...payload
        });
      } finally {
        this.submitting = false;
      }
      if (ok) {
        this.showDialog = false;
        this.$emit("overridden");
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
