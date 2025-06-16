<template>
  <q-page class="q-my-lg" :class="$q.screen.gt.sm ? 'q-mx-xl' : 'q-mx-sm'">
    <roles />
  </q-page>
</template>

<script>
import roles from "components/user/management/Roles.vue";

export default {
  name: "AdminUserPage",
  components: {
    roles,
  },
};
</script>
