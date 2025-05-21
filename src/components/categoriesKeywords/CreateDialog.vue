<template>
  <q-dialog @before-show="getItemInfo" v-model="$_options">
    <q-card class="q-pa-md radius-10" style="width: 532px; max-width: 90vw;">
      <q-form @submit.prevent="!!editingId ? editItem() : addItem()">
        <q-card-section class="q-pt-none" align="center">
          <h6 class="text-center font-20 q-mt-md q-mb-none">
            {{
              !!editingId
                ? tab == "New categories"
                  ? $t("categoriesKeywords.editCategory")
                  : $t("categoriesKeywords.editKeywordTags")
                : tab == "New Keywords/Tags"
                ? $t("categoriesKeywords.newKeywordTags")
                : $t("categoriesKeywords.newCategory")
            }}
          </h6>
        </q-card-section>
        <q-card-section class="q-pb-none">
          <div class=" items-center ">
            <div class="col-12 col-md-3">
              <p class="font-14 no-margin">
                {{
                  tab == "New categories"
                    ? $t("category&Keyword.categoryInputLabel")
                    : $t("category&Keyword.keywordInputLabel")
                }}
              </p>
            </div>
            <div class="col-12 col-md-9">
              <q-input
                outlined
                class="no-shadow input-radius-6"
                v-model="createDialogInput"
                :rules="[val => !!val || $t('Required')]"
                :placeholder="$t('myData.title')"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row justify-center">
            <div class="col-5 q-mr-sm">
              <q-btn
                :label="$t('category&Keyword.cancel')"
                v-close-popup
                outline
                size="14px"
                color="primary"
                no-caps
                class="q-py-xs radius-6 full-width"
              />
            </div>
            <div class="col-5 q-ml-sm">
              <q-btn
                :label="
                  !!editingId
                    ? $t('category&Keyword.edit')
                    : $t('category&Keyword.save')
                "
                type="submit"
                unelevated
                :loading="isLoading"
                size="14px"
                color="primary"
                no-caps
                class="q-py-xs radius-6 full-width"
              />
            </div>
          </div>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "createCategoryKeywordDialog",
  props: {
    dialogState: { type: Boolean, default: false },
    tab: { type: String, default: "" },
    editingId: { type: Number, default: null }
  },
  data() {
    return {
      createDialogInput: "",
      isLoading: false,
      item: {}
    };
  },
  methods: {
    async addItem() {
      if (!!this.createDialogInput) {
        let res = null;
        this.isLoading = true;
        if (this.tab === "New categories") {
          res = await this.$store.dispatch("category/addCategory", {
            name: this.createDialogInput
          });
        } else {
          res = await this.$store.dispatch("tag/addTag", {
            name: this.createDialogInput
          });
        }
        this.isLoading = false;
        if (res !== false) {
          this.$_options = false;
          this.createDialogInput = "";
        }
      }
    },
    async editItem() {
      if (!!this.createDialogInput && !!this.editingId) {
        if (this.createDialogInput !== this.item.title) {
          let res = null;
          this.isLoading = true;
          if (this.tab === "New categories") {
            res = await this.$store.dispatch("category/editCategory", {
              id: this.editingId,
              title: this.createDialogInput
            });
          } else {
            res = await this.$store.dispatch("tag/editTag", {
              id: this.editingId,
              title: this.createDialogInput
            });
          }
          this.isLoading = false;
          if (res !== false) {
            this.$_options = false;
            this.createDialogInput = "";
          }
        } else {
          this.$q.notify({
            type: "negative",
            message: "Bitte wählen Sie einen anderen Titel aus"
          });
        }
      }
    },
    async getItemInfo() {
      if (!!this.editingId) {
        let res = null;
        this.isLoading = true;
        if (this.tab === "New categories") {
          try {
            res = await this.$api.get(`api/categories/${this.editingId}`);
            this.item = res.data.data;
            this.createDialogInput = res.data.data && res.data.data.title;
            this.isLoading = false;
          } catch (error) {
            this.isLoading = false;
          }
        } else {
          try {
            res = await this.$api.get(`api/tags/${this.editingId}`);
            this.item = res.data.data;
            this.createDialogInput = res.data.data && res.data.data.title;
            this.isLoading = false;
          } catch (error) {
            this.isLoading = false;
          }
        }
      }
    }
  },
  computed: {
    $_options: {
      get: function() {
        return this.dialogState;
      },
      set: function(val) {
        this.createDialogInput = "";
        this.$emit("update", val);
      }
    }
  }
};
</script>
