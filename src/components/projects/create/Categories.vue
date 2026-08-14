<template>
  <div class="cc-root">
    <div class="cc-chips">
      <div v-for="cat in model" :key="'sel-' + cat.id" class="cc-chip cc-chip--selected" @click="remove(cat)">
        {{ cat.title }}
        <span class="cc-chip-x">×</span>
      </div>

      <div v-for="opt in suggestedOptions" :key="'sug-' + opt.id" class="cc-chip cc-chip--suggested"
        @click="toggle(opt)">
        <span class="cc-chip-star">✦</span>{{ opt.title }}
      </div>

      <q-spinner-dots v-if="loading" size="16px" style="color: #4759c4" />

      <div class="cc-add-btn" :class="{ 'cc-add-btn--active': open }">
        <span class="cc-add-plus">+</span>{{ $t("categorySelector.addMore") }}
        <q-menu anchor="bottom left" self="top left" :offset="[0, 8]" :content-style="{ boxShadow: 'none' }"
          @show="open = true" @hide="open = false">
          <div class="cc-picker">
            <div class="cc-picker-search">
              <span class="cc-picker-search-icon">⌕</span>
              <input v-model="query" :placeholder="$t('categorySelector.searchPlaceholder')" />
            </div>
            <div class="cc-picker-list">
              <div v-for="opt in filteredOptions" :key="opt.id" class="cc-picker-row" @click="toggle(opt)">
                <div class="cc-checkbox" :class="{ 'cc-checkbox--on': isSelected(opt.id) }">
                  <span v-if="isSelected(opt.id)">✓</span>
                </div>
                <div class="cc-picker-row-label">{{ opt.title }}</div>
                <div v-if="opt.isSuggested" class="cc-ai-tag">✦ {{ $t("categorySelector.aiTag") }}</div>
              </div>
              <div v-if="filteredOptions.length === 0" class="cc-picker-empty">
                {{ $t("categorySelector.noResults") }}
              </div>
            </div>
          </div>
        </q-menu>
      </div>
    </div>

    <div class="cc-hint">
      {{ model.length > 0 ? $t("categorySelector.hintWithSelection") : $t("categorySelector.hintEmpty") }}
    </div>

    <div v-if="requiresValidation === true && model.length === 0" class="cc-error">
      {{ $t("Required") }}
    </div>
  </div>
</template>

<script>
export default {
  name: "categories",
  props: {
    requiresValidation: {
      type: Boolean,
      default: false
    },
    editing: {
      type: Array,
      default: () => []
    },
    suggested: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      model: this.editing,
      query: "",
      open: false
    };
  },
  watch: {
    editing(newVal) {
      this.model = newVal;
    }
  },
  methods: {
    isSelected(id) {
      return this.model.some(cat => cat.id === id);
    },
    toggle(opt) {
      if (this.isSelected(opt.id)) {
        this.remove(opt);
      } else {
        this.model = [...this.model, { id: opt.id, title: opt.title }];
        this.emitUpdate();
      }
    },
    remove(opt) {
      this.model = this.model.filter(cat => cat.id !== opt.id);
      this.emitUpdate();
    },
    emitUpdate() {
      const categories = this.model.map(cat => ({ id: cat.id }));
      this.$emit("update:category", categories.length > 0 ? categories : []);
      this.setTempCategories(categories);
    },
    //Set the selected categories temporarily in the store to be accessible in other components
    setTempCategories(categories) {
      this.$store.commit("project/setTempCategories", categories);
    }
  },
  computed: {
    allCategories() {
      const suggestedTitles = new Set((this.suggested || []).map(title => title.toLowerCase()));
      return this.$store.state.category.categories.map(cat => ({
        id: cat.id,
        title: cat.title,
        isSuggested: suggestedTitles.has(cat.title.toLowerCase())
      }));
    },
    suggestedOptions() {
      const suggestedIds = new Set(this.allCategories.filter(cat => cat.isSuggested).map(cat => cat.id));
      return this.allCategories.filter(cat => suggestedIds.has(cat.id) && !this.isSelected(cat.id));
    },
    filteredOptions() {
      const needle = this.query.trim().toLowerCase();
      return this.allCategories.filter(cat => cat.title.toLowerCase().includes(needle));
    }
  },
  mounted() {
    this.$store.state.category.categories.length === 0 ? this.$store.dispatch("category/getCategories") : null;
  }
};
</script>

<style lang="scss" scoped>
@keyframes ccIn {
  from {
    opacity: 0;
    transform: translateY(4px) scale(.96);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

.cc-root {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.cc-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.cc-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 34px;
  padding: 0 9px 0 14px;
  border-radius: 17px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  animation: ccIn .18s ease both;
  white-space: nowrap;
}

.cc-chip--selected {
  background: #1b2a78;
  color: #fff;
  padding: 0 9px 0 14px;

  &:hover {
    background: #152163;
  }
}

.cc-chip--suggested {
  background: transparent;
  border: 1.5px dashed #b8c2ee;
  color: #5b6592;
  padding: 0 14px;
  gap: 7px;

  &:hover {
    border-style: solid;
    border-color: #1b2a78;
    color: #1b2a78;
    background: #f7f8fe;
  }
}

.cc-chip-x {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(255, 255, 255, .18);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  line-height: 1;
}

.cc-chip-star {
  font-size: 11px;
  color: #4759c4;
}

.cc-add-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 34px;
  padding: 0 14px;
  border-radius: 17px;
  border: 1.5px solid #e0e5f5;
  color: #6b74a0;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  background: #fff;
  position: relative;

  &--active {
    border: 1.5px solid #1b2a78;
    background: #1b2a78;
    color: #fff;
  }
}

.cc-add-plus {
  font-size: 15px;
  line-height: 1;
}

::v-deep .q-menu {
  box-shadow: none;
}

.cc-picker {
  width: 330px;
  background: #fff;
  border: 1px solid #dfe4f5;
  border-radius: 12px;
  overflow: hidden;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.cc-picker-search {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 12px 14px;
  border-bottom: 1px solid #eef0f8;

  input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 14px;
    color: #1b2a78;
    background: transparent;
    font-family: inherit;

    &::placeholder {
      color: #9aa3c6;
    }
  }
}

.cc-picker-search-icon {
  font-size: 14px;
  color: #9aa3c6;
}

.cc-picker-list {
  max-height: 232px;
  overflow: auto;
}

.cc-picker-row {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 10px 14px;
  cursor: pointer;
  font-size: 13.5px;
  color: #1b2a78;

  &:hover {
    background: #f7f8fe;
  }
}

.cc-picker-row-label {
  flex: 1;
}

.cc-picker-empty {
  padding: 16px 14px;
  font-size: 13px;
  color: #9aa3c6;
}

.cc-checkbox {
  width: 18px;
  height: 18px;
  border-radius: 5px;
  border: 1.5px solid #c3cbe8;
  background: #fff;
  flex: 0 0 auto;

  &--on {
    border: 1.5px solid #1b2a78;
    background: #1b2a78;
    color: #fff;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.cc-ai-tag {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: #4759c4;
  margin-left: auto;
}

.cc-picker-footer {
  padding: 10px 14px;
  border-top: 1px solid #eef0f8;
  background: #fbfcff;
  font-size: 12px;
  color: #8791b8;
}

.cc-hint {
  font-size: 12.5px;
  color: #8791b8;
  margin-top: 8px;
}

.cc-error {
  font-size: 12px;
  color: #d60000;
  margin-top: 4px;
}
</style>
