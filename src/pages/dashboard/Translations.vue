<template>
  <q-page padding>
    <div class="q-mb-md">
      <h5 class="q-my-none">{{ $t("Translation Management") }}</h5>
    </div>

    <TranslationTable
      :columns="columns"
      :loading="loading"
      :translations="translations"
      :filter="searchText"
      @update-translation="updateTranslation"
    >
      <template v-slot:search>
        <TranslationSearch v-model="searchText" />
      </template>
    </TranslationTable>

    <div class="q-mt-md row q-col-gutter-md">
      <TranslationActions
        :saving="saving"
        :loading="loading"
        :has-changes="hasChanges"
        @save="saveChanges"
        @create-missing="createMissingTranslations"
      />
    </div>
  </q-page>
</template>

<script>
import TranslationSearch from "../../components/translations/TranslationSearch.vue";
import TranslationTable from "../../components/translations/TranslationTable.vue";
import TranslationActions from "../../components/translations/TranslationActions.vue";
import translationService from "../../services/translationService";

export default {
  name: "TranslationsPage",

  components: {
    TranslationSearch,
    TranslationTable,
    TranslationActions,
  },

  data() {
    return {
      loading: true,
      saving: false,
      translations: {},
      changedKeys: [],
      originalData: {},
      searchText: "",
      columns: [
        {
          name: "key",
          align: "left",
          label: "Translation Key",
          field: "key",
          sortable: true,
        },
        { name: "en", align: "left", label: "English", field: "en", sortable: true },
        { name: "de", align: "left", label: "German", field: "de", sortable: true },
      ],
    };
  },

  computed: {
    hasChanges() {
      return this.changedKeys.length > 0;
    },
  },

  methods: {
    async loadTranslations() {
      this.loading = true;
      try {
        const [enData, deData] = await Promise.all([
          translationService.fetchTranslationsByLocale("en"),
          translationService.fetchTranslationsByLocale("de"),
        ]);

        const translations = {};
        const originalData = {};

        // Process English translations
        enData.forEach((item) => {
          const key = item.attributes.key;

          if (!translations[key]) {
            translations[key] = { key };
            originalData[key] = {};
          }

          translations[key].en = item.attributes.value;
          translations[key].id_en = item.id;
          originalData[key].en = item.attributes.value;
        });

        // Process German translations
        deData.forEach((item) => {
          const key = item.attributes.key;

          if (!translations[key]) {
            translations[key] = { key };
            originalData[key] = {};
          }

          translations[key].de = item.attributes.value;
          translations[key].id_de = item.id;
          originalData[key].de = item.attributes.value;
        });

        this.translations = translations;
        this.originalData = originalData;
        // Clear changed keys when loading data
        this.changedKeys = [];
      } catch (error) {
        console.error("Failed to load translations:", error);
        this.$q.notify({
          type: "negative",
          message: "Failed to load translations",
        });
      } finally {
        this.loading = false;
      }
    },

    updateTranslation({ key, locale, value }) {
      if (this.translations[key]) {
        // Update the translation
        this.$set(this.translations[key], locale, value);

        // Compare with original to determine if changed
        const originalValue = this.originalData[key]
          ? this.originalData[key][locale]
          : "";
        const entryKey = `${key}:${locale}`;

        if (value !== originalValue) {
          // Add to changed keys if not already present
          if (!this.changedKeys.includes(entryKey)) {
            this.changedKeys.push(entryKey);
          }
        } else {
          // Remove from changed keys if present
          const index = this.changedKeys.indexOf(entryKey);
          if (index !== -1) {
            this.changedKeys.splice(index, 1);
          }
        }
      }
    },

    async saveChanges() {
      if (!this.hasChanges) return;

      this.saving = true;
      const updatePromises = [];
      const failedUpdates = [];

      try {
        for (const entry of this.changedKeys) {
          const [key, locale] = entry.split(":");
          const translationObj = this.translations[key];

          if (!translationObj) {
            failedUpdates.push(`Key "${key}" not found`);
            continue;
          }

          // Get the ID based on locale
          const id = locale === "en" ? translationObj.id_en : translationObj.id_de;

          if (!id) {
            // This might be a new translation that needs to be created instead of updated
            console.log(`Creating new ${locale} translation for key: ${key}`);

            // Try to create a new translation entry instead
            try {
              const response = await translationService.createTranslation(
                key,
                translationObj[locale],
                locale
              );

              console.log(`Created new translation with ID: ${response.data.id}`);

              // Update ID in our local data
              if (locale === "en") {
                this.$set(translationObj, "id_en", response.data.id);
              } else {
                this.$set(translationObj, "id_de", response.data.id);
              }

              continue;
            } catch (createError) {
              failedUpdates.push(
                `Failed to create ${locale} translation for "${key}": ${createError.message}`
              );
              continue;
            }
          }

          // Normal update process for existing translations
          updatePromises.push(
            translationService
              .updateTranslation(id, translationObj[locale], locale)
              .catch((error) => {
                failedUpdates.push(
                  `Failed to update ${locale} translation for "${key}": ${error.message}`
                );
                return null; // Return null so Promise.all doesn't fail completely
              })
          );
        }

        // Wait for all update operations
        await Promise.all(updatePromises.filter((p) => p !== null));

        // Handle results
        if (failedUpdates.length > 0) {
          console.warn("Some translations couldn't be updated:", failedUpdates);
          this.$q.notify({
            type: "warning",
            message: `${failedUpdates.length} translations couldn't be updated.`,
            multiLine: true,
            actions: [
              {
                label: "Details",
                color: "white",
                handler: () => {
                  console.log("Failed updates:", failedUpdates);
                },
              },
            ],
          });
        } else {
          this.$q.notify({
            type: "positive",
            message: "Translations saved successfully",
          });
        }

        // Refresh data after save
        await this.loadTranslations();
      } catch (error) {
        console.error("Failed to save translations:", error);
        this.$q.notify({
          type: "negative",
          message: "Failed to save changes",
        });
      } finally {
        this.saving = false;
      }
    },

    // Added helper method to create missing translations
    async createMissingTranslations() {
      this.loading = true;
      const created = [];

      try {
        // Find keys that exist in one language but not the other
        for (const key in this.translations) {
          const entry = this.translations[key];

          // If English exists but German doesn't
          if (entry.id_en && !entry.id_de && entry.en) {
            try {
              const response = await translationService.createTranslation(
                key,
                entry.en, // Use English value as default
                "de"
              );

              entry.id_de = response.data.id;
              entry.de = entry.en; // Default to English value
              created.push(`Created German translation for "${key}"`);
            } catch (error) {
              console.error(`Failed to create German translation for "${key}":`, error);
            }
          }

          // If German exists but English doesn't
          if (entry.id_de && !entry.id_en && entry.de) {
            try {
              const response = await translationService.createTranslation(
                key,
                entry.de, // Use German value as default
                "en"
              );

              entry.id_en = response.data.id;
              entry.en = entry.de; // Default to German value
              created.push(`Created English translation for "${key}"`);
            } catch (error) {
              console.error(`Failed to create English translation for "${key}":`, error);
            }
          }
        }

        if (created.length > 0) {
          console.log("Created missing translations:", created);
          this.$q.notify({
            type: "positive",
            message: `Created ${created.length} missing translations`,
          });
        }
      } catch (error) {
        console.error("Error creating missing translations:", error);
      } finally {
        this.loading = false;
      }
    },
  },

  mounted() {
    this.loadTranslations();
  },
};
</script>

<style scoped>
.q-table th {
  font-weight: bold;
}
</style>
