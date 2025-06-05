<template>
  <q-page class="bg-blue-1">
    <div class="container">
      <div class="row">
        <div class="col-12 text-center">
          <h1 class="font-36 text-weight-600">{{ $t("documents") }}</h1>
        </div>
        <div class="col-12 q-mb-xl">
          <p>{{ $t("searchResult") }}: {{ documentsLength }} {{ $t("documents") }}</p>
          <DocumentsTable @update-data="setDocumentNumbers" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import DocumentsTable from "components/projects/search/DocumentsTable.vue";
export default {
  name: "documents",
  components: {
    DocumentsTable,
  },
  data() {
    return {
      documentsLength: 0,
    };
  },
  methods: {
    setDocumentNumbers(val) {
      if (!!val && val.length > 0) {
        this.documentsLength = val.length;
      } else {
        this.documentsLength = 0;
      }
    },
  },
};
</script>

<style></style>
