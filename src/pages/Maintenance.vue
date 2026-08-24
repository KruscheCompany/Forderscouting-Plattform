<template>
  <div class="maintenance-page">
    <div class="maintenance-card">
      <q-icon name="mdi-hammer-wrench" size="64px" color="primary" />
      <h1>Wartungsarbeiten</h1>
      <p>Die Plattform ist vorübergehend nicht erreichbar.</p>
      <p v-if="message" class="maintenance-message">{{ message }}</p>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Maintenance",
  computed: {
    ...mapState("general", {
      message: (state) => state.maintenanceMessage
    })
  }
};
</script>

<style scoped>
.maintenance-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
}
.maintenance-card {
  max-width: 480px;
}
.maintenance-message {
  white-space: pre-line;
  margin-top: 16px;
}
</style>
