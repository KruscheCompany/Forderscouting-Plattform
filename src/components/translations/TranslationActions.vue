<template>
  <div class="col">
    <q-btn
      :label="$t('notifications.saveChanges')"
      color="blue"
      unelevated
      class="mr-0 radius-6 text-weight-600"
      :loading="saving"
      :disable="!hasChanges"
      @click="onSave"
      no-caps
      icon="check"
    />
    <q-btn
      :label="$t('Create Missing Translations')"
      color="blue"
      outline
      icon="add"
      class="mr-0 radius-6 text-weight-600 q-ml-md"
      :loading="loading"
      @click="onCreateMissing"
      no-caps
    />
  </div>
</template>

<script>
export default {
  name: "TranslationActions",

  props: {
    saving: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    hasChanges: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    onSave() {
      this.$emit('save');
    },

    onCreateMissing() {
      this.$emit('create-missing');
    }
  }
};
</script>
