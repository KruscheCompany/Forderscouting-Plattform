<template>
  <q-expansion-item default-opened
    class="cc-card overflow-hidden radius-20 col-12 q-mt-md bg-white" :class="{ 'shadow-1': !noShadow }"
    header-class="cc-card-header bg-white" v-model="expanded" :hide-expand-icon="!collapsible"
    :expand-icon-toggle="!collapsible">
    <template v-slot:header>
      <q-item-section>
        <div class="cc-header-row">
          <q-item-label>{{ $t("newProjectIdeaForm.categorizationCard") }}</q-item-label>
          <div class="cc-badge">
            <span class="cc-badge-star">✦</span>{{ badgeText }}
          </div>
        </div>
      </q-item-section>
    </template>

    <div class="cc-body">
      <div class="cc-field-row cc-field-row--bordered">
        <div class="cc-field-label-col">
          <div class="cc-field-label">{{ $t("newProjectIdeaForm.filterCategories") }}</div>
          <div class="cc-field-desc">{{ $t("newProjectIdeaForm.filterCategoriesHint") }}</div>
        </div>
        <div class="cc-field-content-col">
          <Categories :requiresValidation="requiresValidation" :editing="editingCategories" :suggested="suggested"
            :loading="loading" @update:category="$emit('update:category', $event)" />
        </div>
      </div>

      <div class="cc-field-row" :class="showInvestive ? 'cc-field-row--bordered' : 'cc-field-row--last'">
        <div class="cc-field-label-col">
          <div class="cc-field-label">{{ $t("Tags") }}</div>
          <div class="cc-field-desc">{{ $t("newProjectIdeaForm.tagsHint") }}</div>
        </div>
        <div class="cc-field-content-col">
          <Tags :requiresValidation="requiresValidation" :editing="editingTags" :suggested="tagsSuggested"
            :generated="tagsGenerated" :loading="loading" @update:tag="$emit('update:tag', $event)" />
        </div>
      </div>

      <div v-if="showInvestive" class="cc-field-row cc-field-row--last">
        <div class="cc-field-label-col">
          <div class="cc-field-label">{{ $t("newProjectIdeaForm.investive/non-investive") }}</div>
          <div class="cc-field-desc">{{ $t("newProjectIdeaForm.investiveHint") }}</div>
        </div>
        <div class="cc-field-content-col">
          <div class="cc-inv-grid">
            <div class="cc-inv-card" :class="{ 'cc-inv-card--active': investive === true }"
              @click="$emit('update:investive', !investive)">
              <div class="cc-inv-card-top">
                <div class="cc-inv-checkbox" :class="{ 'cc-inv-checkbox--active': investive === true }" />
                <div class="cc-inv-title">{{ $t("Investive") }}</div>
              </div>
              <div class="cc-inv-desc">{{ $t("newProjectIdeaForm.investiveDescription") }}</div>
            </div>
            <div class="cc-inv-card" :class="{ 'cc-inv-card--active': nonInvestive === true }"
              @click="$emit('update:nonInvestive', !nonInvestive)">
              <div class="cc-inv-card-top">
                <div class="cc-inv-checkbox" :class="{ 'cc-inv-checkbox--active': nonInvestive === true }" />
                <div class="cc-inv-title">{{ $t("Non-Investive") }}</div>
              </div>
              <div class="cc-inv-desc">{{ $t("newProjectIdeaForm.nonInvestiveDescription") }}</div>
            </div>
          </div>
          <div v-if="requiresValidation === true && !investive && !nonInvestive" class="cc-error">
            {{ $t("Required") }}
          </div>
        </div>
      </div>
    </div>
  </q-expansion-item>
</template>

<script>
import Categories from "components/projects/create/Categories.vue";
import Tags from "components/projects/create/Tags.vue";

export default {
  name: "CategorizationCard",
  emits: ["update:category", "update:tag", "update:investive", "update:nonInvestive"],
  components: {
    Categories,
    Tags
  },
  props: {
    currentTab: {
      type: String,
      default: null
    },
    collapsible: {
      type: Boolean,
      default: true
    },
    noShadow: {
      type: Boolean,
      default: false
    },
    badgeSource: {
      type: String,
      default: "projectDescription"
    },
    requiresValidation: {
      type: Boolean,
      default: false
    },
    editingCategories: {
      type: Array,
      default: () => []
    },
    editingTags: {
      type: Array,
      default: () => []
    },
    suggested: {
      type: Array,
      default: () => []
    },
    tagsSuggested: {
      type: Array,
      default: () => []
    },
    tagsGenerated: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    investive: {
      type: Boolean,
      default: null
    },
    nonInvestive: {
      type: Boolean,
      default: null
    }
  },
  data() {
    return {
      expanded: this.currentTab === null || this.currentTab === "project"
    };
  },
  computed: {
    showInvestive() {
      return this.investive !== null || this.nonInvestive !== null;
    },
    badgeText() {
      return this.badgeSource === "fundingGoal"
        ? this.$t("newProjectIdeaForm.categorizationBadgeFundingGoal")
        : this.$t("newProjectIdeaForm.categorizationBadge");
    }
  },
  watch: {
    currentTab(newTab) {
      if (newTab !== null) this.expanded = newTab === "project";
    }
  }
};
</script>

<style lang="scss" scoped>
.cc-card {
  width: 100%;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.cc-header-row {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 12px;
}

.cc-badge {
  margin-left: auto;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  font-weight: 600;
  color: #4759c4;
  background: #f0f3fe;
  border-radius: 7px;
  padding: 6px 11px;
}

.cc-badge-star {
  font-size: 12px;
}

.cc-body {
  padding: 16px;
}

.cc-field-row {
  display: grid;
  grid-template-columns: minmax(180px, 25%) 1fr;
  gap: 0 28px;
  align-items: start;
  padding: 18px 0;

  &--bordered {
    border-bottom: 1px solid #eef0f8;
  }

  &--last {
    padding: 18px 0 20px;
  }
}

.cc-field-label-col {
  padding-top: 4px;
}

.cc-field-label {
  font-size: 16px;
}

.cc-field-desc {
  font-size: 12.5px;
  color: #8791b8;
  margin-top: 5px;
  line-height: 1.5;
}

.cc-inv-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.cc-inv-card {
  border: 1.5px solid #e0e5f5;
  background: #fff;
  border-radius: 12px;
  padding: 16px 18px;
  cursor: pointer;

  &--active {
    border: 1.5px solid #1b2a78;
    background: #f7f8fe;
    box-shadow: 0 0 0 3px rgba(27, 42, 120, .10);
  }
}

.cc-inv-card-top {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cc-inv-checkbox {
  width: 18px;
  height: 18px;
  border-radius: 5px;
  border: 1.5px solid #c3cbe8;
  background: #fff;
  box-sizing: border-box;
  flex: 0 0 auto;

  &--active {
    border: 1.5px solid #1b2a78;
    background: #f2ec4a;
  }
}

.cc-error {
  font-size: 12px;
  color: #d60000;
  margin-top: 10px;
}

.cc-inv-title {
  font-size: 14.5px;
  font-weight: 700;
  color: #1b2a78;
}

.cc-inv-desc {
  font-size: 12.5px;
  color: #6b74a0;
  line-height: 1.5;
  margin-top: 8px;
}
</style>
