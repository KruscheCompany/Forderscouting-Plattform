<template>
  <q-page class="q-mx-xl q-mt-lg ">
    <div class="row justify-center">
      <div class="col-12 col-lg-5">
        <!-- User Info -->
        <UserCard />
      </div>
      <div class="col-12 q-mt-lg">
        <overview />
      </div>
    </div>
  </q-page>
</template>

<script>
import overview from "components/data/overview.vue";
import UserCard from "components/network/UserCard.vue";

export default {
  name: "networkPage",
  components: {
    overview,
    UserCard
  },
  data() {
    return {
      search: ""
    };
  }
};
</script>

<style lang="scss"></style>
