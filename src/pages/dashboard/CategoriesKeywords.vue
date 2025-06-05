<template>
  <q-page class="q-my-lg" :class="$q.screen.gt.sm ? 'q-mx-xl' : 'q-mx-sm'">
    <categoriesKeyword />
  </q-page>
</template>

<script>
import categoriesKeyword from "src/components/categoriesKeywords/categoriesKeyword.vue";

export default {
  name: "CategoriesKeywords",
  components: {
    categoriesKeyword,
  },
};
</script>
