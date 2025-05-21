<template>
  <div>
    <q-tabs
      v-if="isInPage"
      v-model="tab"
      align="justify"
      indicator-color="transparent"
      class="q-mb-lg text-black"
      active-bg-color="yellow"
      no-caps
    >
      <q-route-tab
        :to="{ query: { tab: 'categories' } }"
        exact
        replace
        class="q-py-xs q-mr-lg radius-10 border-yellow"
        :class="$q.screen.gt.sm ? 'q-pa-lg' : 'q-pa-sm q-px-lg'"
        name="categories"
      >
        <p class="font-20 no-margin">{{ $t("category&Keyword.category") }}</p>
      </q-route-tab>
      <q-route-tab
        :to="{ query: { tab: 'keywords/Tags' } }"
        exact
        replace
        class="q-py-xs radius-10 border-yellow"
        :class="$q.screen.gt.sm ? 'q-pa-lg' : 'q-pa-sm q-px-lg'"
        name="keywords/Tags"
      >
        <p class="font-20 no-margin">
          {{ $t("category&Keyword.keyword/Tags") }}
        </p>
      </q-route-tab>
    </q-tabs>
    <q-table
      class="radius-20 shadow-1 pagination-no-shadow"
      :data="apiData"
      :columns="columns"
      row-key="name"
      :hide-header="!isInPage"
      :visible-columns="isInPage ? visibleColumns : []"
      :filter="filter"
      :pagination="{
        sortBy: 'id',
        descending: true,
        page: 1,
        rowsPerPage: isInPage ? 10 : 5
      }"
      :rows-per-page-label="$t('Records per page')"
      :no-data-label="$t('No data')"
      :no-results-label="$t('No results')"
      ref="table"
    >
      <template v-slot:top>
        <div class="row full-width justify-between items-center">
          <div class="col-8 col-md-6">
            <q-input
              borderless
              outlined
              class="input-radius-6 no-shadow q-mb-sm q-mt-sm"
              v-model="filter"
              :placeholder="$t('Search')"
              dense
            >
              <template v-slot:before v-if="$q.screen.gt.sm">
                <div class="font-24 q-mr-lg text-black">
                  {{
                    tab == "categories"
                      ? $t("category&Keyword.category")
                      : $t("projectContent.tags")
                  }}
                </div>
              </template>
              <template v-slot:prepend>
                <q-icon color="blue-5" name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-2 col-md-4 text-right">
            <q-btn
              color="blue"
              icon="add"
              unelevated
              filled
              :round="$q.screen.lt.md"
              class="mr-0 text-weight-600"
              :class="$q.screen.gt.sm ? 'radius-6' : ''"
              no-caps
              @click="createDialog = true"
            >
              <p v-if="$q.screen.gt.sm" class="q-mb-none q-mx-md q-my-sm">
                {{
                  tab == "categories"
                    ? $t("category&Keyword.createCategoryBtn")
                    : tab == "keywords/Tags"
                    ? $t("category&Keyword.createKeywordBtn")
                    : $t("category&Keyword.createCategoryBtn")
                }}
              </p>
            </q-btn>
          </div>
        </div>
      </template>
      <template v-slot:header="props">
        <q-tr class="tableHeader" :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="font-14 text-black"
          >
            {{ col.label }}
          </q-th>
          <q-th auto-width />
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td
            auto-width
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="font-14"
          >
            {{ col.value }}
          </q-td>
          <q-td class="text-right" auto-width>
            <q-btn size="md" color="primary" round flat dense icon="more_vert" aria-label="Optionen">
              <q-menu transition-show="jump-down" transition-hide="jump-up">
                <q-list style="min-width: 140px">
                  <q-item
                    clickable
                    v-close-popup
                    @click="prepEditDialog(props.row)"
                  >
                    <q-item-section
                      ><span class="text-right font-14">
                        {{ $t("category&Keyword.edit") }}
                        <q-icon size="sm" class="text-blue" name="edit"/></span
                    ></q-item-section>
                  </q-item>

                  <q-item
                    clickable
                    v-close-popup
                    @click="prepDeleteDialog(props.row)"
                  >
                    <q-item-section
                      ><span class="text-right font-14 text-red">
                        {{ $t("category&Keyword.delete") }}
                        <q-icon size="sm" name="delete"/></span
                    ></q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <CreateDialog
      :editingId="itemId"
      :tab="tab === 'categories' ? 'New categories' : 'New Keywords/Tags'"
      :dialogState="createDialog"
      @update="(createDialog = $event), (itemId = null)"
    />
    <DeleteDialog
      :id="itemId"
      :tab="tab === 'categories' ? 'Delete category' : 'Delete Keyword/Tag'"
      :dialogState="deleteDialog"
      @update="(deleteDialog = $event), (itemId = null)"
    />
  </div>
</template>

<script>
import CreateDialog from "components/categoriesKeywords/CreateDialog.vue";
import DeleteDialog from "components/categoriesKeywords/DeleteDialog.vue";
export default {
  name: "categoriesKeyword",
  components: {
    CreateDialog,
    DeleteDialog
  },
  data() {
    return {
      tab: this.$router.currentRoute.query.tab || "categories",
      createDialog: false,
      deleteDialog: false,
      itemId: null,
      filter: "",
      visibleColumns: ["title", "projectIdeas", "fundings", "checklists"]
    };
  },
  methods: {
    prepDeleteDialog(row) {
      this.itemId = !!row.id ? row.id : "";
      this.deleteDialog = true;
    },
    prepEditDialog(row) {
      this.itemId = !!row.id ? row.id : "";
      this.createDialog = true;
    },
    getData(tab) {
      if (tab === "categories") {
        this.$store.dispatch("category/getCategories");
      } else {
        this.$store.dispatch("tag/getTags");
      }
    }
  },
  watch: {
    tab(val) {
      if (val === "categories") {
        this.getData("categories");
      } else {
        this.getData("keywords/Tags");
      }
    }
  },
  computed: {
    apiData() {
      return this.tab == "categories"
        ? this.$store.state.category.categories
        : this.$store.state.tag.tags;
    },
    isInPage() {
      // return this.$router.currentRoute.fullPath == "/catkeytags";
      return true;
    },
    columns() {
      return [
        {
          name: "id",
          label: "id",
          align: "left",
          field: row => row.id,
          sortable: true
        },
        {
          name: "title",
          label: this.$t("myData.title"),
          field: row => row.title,
          sortable: true,
          align: "left"
        },
        {
          name: "projectIdeas",
          align: "left",
          label: this.$t("myData.projectIdeas"),
          field: row => (!!row.dataSet.projects && row.dataSet.projects) || 0,
          sortable: true
        },
        {
          name: "fundings",
          align: "left",
          label: this.$t("myData.fundings"),
          field: row => (!!row.dataSet.fundings && row.dataSet.fundings) || 0,
          sortable: true
        },
        {
          name: "checklists",
          align: "left",
          label: this.$t("myData.implementationChecklist"),
          field: row => (!!row.dataSet.checklist && row.dataSet.checklist) || 0,
          sortable: true
        }
      ];
    }
  },
  mounted() {
    this.getData(this.tab);
    if (localStorage.getItem("pagination")) {
      const savedPagination = JSON.parse(localStorage.getItem("pagination"));

      this.$refs.table.setPagination({
          page: savedPagination.categoriesKeywordPage || 1,
          rowsPerPage: savedPagination.categoriesKeywordRowsPerPage || 10,
        });
    }
  },
  beforeDestroy() {
    const pagination = JSON.parse(localStorage.getItem("pagination"));
    const localPagination = {
      categoriesKeywordPage: this.$refs.table.computedPagination.page,
      categoriesKeywordRowsPerPage: this.$refs.table.computedPagination.rowsPerPage,
    };
    const filters = { ...pagination, ...localPagination };
    localStorage.setItem("pagination", JSON.stringify(filters));
  },
};
</script>
