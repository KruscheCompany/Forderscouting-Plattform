<template>
  <q-dialog v-model="showDialog" persistent transition-show="scale" transition-hide="scale">
    <q-card class="radius-20 shadow-2 column" style="min-width: 500px;">
      <q-card-section class="q-pa-none warning-header">
        <q-icon class="warning-header-icon" name="mdi-alert-circle" color="orange" size="60px" />
      </q-card-section>
      <q-card-section align="left">
        <h6 class="text-center font-20 q-mt-md q-mb-none">
          {{ $t('warningMessage') }}
        </h6>
        <div class="items-center text-center">
          <p class="text-body2">
            {{ $t(`warningMessageDetail`) }}
          </p>
          <p class="text-body2">
            {{ $t('warningMessageAction') }}
          </p>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row justify-center q-gutter-md">
          <q-btn :label="$t('Cancel')" outline size="14px" color="primary" no-caps class="no-shadow radius-6 q-px-xl"
            @click="handleCancel" />
          <q-btn :label="$t('Continue')" unelevated :loading="loading" size="14px" color="orange" no-caps
            class="no-shadow radius-6 q-px-xl q-py-sm" @click="handleConfirm" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "StartingConditionWarningDialog",
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'confirm', 'cancel'],
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
  watch: {
    modelValue(newValue) {
      this.showDialog = newValue;
    }
  },
  methods: {
    handleConfirm() {
      this.$emit('confirm');
    },
    handleCancel() {
      this.$emit('cancel');
      this.showDialog = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.warning-header {
  background-color: rgba(255, 165, 0, 0.1);
  border-bottom: 1px solid rgba(255, 165, 0, 0.3);
  min-height: 140px;
  position: relative;
}

.warning-header-icon {
  position: absolute;
  bottom: -32.5px;
  left: 0;
  right: 0;
  margin: auto;
  background-color: white;
  border-radius: 50%;
  padding: 5px;
}
</style>
