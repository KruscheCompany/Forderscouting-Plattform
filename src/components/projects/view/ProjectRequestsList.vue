<template>
  <div class="col-12" v-if="isAdmin && hasRequests">
    <div v-for="request in requests" :key="request.id" class="row">
      <q-card class="col-12 shadow-1 radius-20 q-mb-md q-pa-none">
        <q-card-section class="row items-center">
          <q-icon name="description" size="md" color="blue-5" class="q-mr-sm" />
          <div class="col">
            <p class="font-16 text-weight-600 q-mb-none">
              {{ getUserName(request) }} {{ $t("notificationsUser.documentAccessRequest") }}
            </p>
            <p class="font-14 q-mb-none">
              {{ getProjectTitle(request) }}
            </p>
          </div>
          <div class="text-right">
            <q-btn @click="handleRequest(true, request.id)" color="blue" unelevated
              class="radius-6 q-ml-md text-weight-600" no-caps>
              <p class="q-mb-none q-mx-xl q-my-sm">
                {{ $t("notificationsUser.acceptBtn") }}
              </p>
            </q-btn>
            <q-btn @click="handleRequest(false, request.id)" color="red" unelevated
              class="radius-6 q-ml-md text-weight-600" no-caps>
              <p class="q-mb-none q-mx-xl q-my-sm">
                {{ $t("notificationsUser.declineBtn") }}
              </p>
            </q-btn>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProjectRequestsList",
  props: {
    requests: {
      type: Array,
      default: () => []
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  emits: ['refresh-data'],
  computed: {
    hasRequests() {
      return this.requests && this.requests.length > 0;
    }
  },
  methods: {
    getUserName(request) {
      return (request.user && request.user.username) || '';
    },
    getProjectTitle(request) {
      return (request.project && request.project.title) || '';
    },

    async handleRequest(val, id) {
      const res = await this.$store.dispatch("userCenter/manageRequest", {
        id,
        val
      });
      this.$emit('refresh-data');
    }
  }
};
</script>
