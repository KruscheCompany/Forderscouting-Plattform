<template>
  <div class="cc-root">
    <div class="cc-chips">
      <div v-for="tag in model" :key="'sel-' + (tag.id !== null ? tag.id : tag.title)" class="cc-chip cc-chip--selected"
        @click="remove(tag)">
        {{ tag.title }}
        <span v-if="tag.status === 'pending'" class="cc-pending-icon">
          ⏳
          <q-tooltip>{{ $t("tagsSelector.pendingBadge") }}</q-tooltip>
        </span>
        <span class="cc-chip-x">×</span>
      </div>

      <div v-for="opt in suggestedOptions" :key="'sug-' + opt.id" class="cc-chip cc-chip--suggested"
        @click="toggle(opt)">
        <span class="cc-chip-star">✦</span>{{ opt.title }}
      </div>

      <div v-for="opt in generatedOptions" :key="'gen-' + opt.title" class="cc-chip cc-chip--suggested"
        @click="toggle(opt)">
        <span class="cc-chip-star">✦</span>{{ opt.title }}
      </div>

      <q-spinner-dots v-if="loading" size="16px" style="color: #4759c4" />

      <div class="cc-add-btn" :class="{ 'cc-add-btn--active': open }">
        <span class="cc-add-plus">+</span>{{ $t("tagsSelector.addMore") }}
        <q-menu anchor="bottom left" self="top left" :offset="[0, 8]" :content-style="{ boxShadow: 'none' }"
          @show="open = true" @hide="open = false">
          <div class="cc-picker">
            <div class="cc-picker-search">
              <span class="cc-picker-search-icon">⌕</span>
              <input v-model="query" :placeholder="$t('tagsSelector.searchPlaceholder')" />
            </div>
            <div class="cc-picker-list">
              <div v-for="opt in filteredOptions" :key="opt.id" class="cc-picker-row" @click="toggle(opt)">
                <div class="cc-checkbox" :class="{ 'cc-checkbox--on': isSelectedOption(opt) }">
                  <span v-if="isSelectedOption(opt)">✓</span>
                </div>
                <div class="cc-picker-row-label">{{ opt.title }}</div>
              </div>
              <div v-if="filteredOptions.length === 0" class="cc-picker-empty">
                {{ $t("tagsSelector.noResults") }}
              </div>
            </div>
          </div>
        </q-menu>
      </div>
    </div>

    <div v-if="suggestedOptions.length + generatedOptions.length > 0" class="cc-accept-all" @click="acceptAll">
      {{ $t("newProjectIdeaForm.acceptAllSuggestions") }}
    </div>

    <div v-if="model.some(tag => tag.status === 'pending')" class="cc-hint">
      {{ $t("tagsSelector.pendingNote") }}
    </div>

    <div v-if="requiresValidation === true && model.length === 0" class="cc-error">
      {{ $t("Required") }}
    </div>
  </div>
</template>

<script>
const MAX_TAGS = 50;

export default {
  name: "tags",
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
    generated: {
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
    isSelectedOption(opt) {
      if (opt.id !== null) return this.model.some(tag => tag.id === opt.id);
      return this.model.some(tag => tag.title.toLowerCase() === opt.title.toLowerCase());
    },
    toggle(opt) {
      if (this.isSelectedOption(opt)) {
        this.removeByOption(opt);
        return;
      }
      if (this.model.length >= MAX_TAGS) {
        this.$q.notify({ type: "warning", message: this.$t("tagsSelector.maxReached") });
        return;
      }
      if (opt.id === null) {
        // Not created in the backend yet - only happens once the form is saved/published,
        // so AI suggestions aren't submitted for admin review just by being selected here.
        this.model = [...this.model, { id: null, title: opt.title, status: "pending" }];
      } else {
        this.model = [...this.model, { id: opt.id, title: opt.title, status: "approved" }];
      }
      this.emitUpdate();
    },
    removeByOption(opt) {
      if (opt.id !== null) {
        this.model = this.model.filter(tag => tag.id !== opt.id);
      } else {
        this.model = this.model.filter(tag => tag.title.toLowerCase() !== opt.title.toLowerCase());
      }
      this.emitUpdate();
    },
    remove(tag) {
      if (tag.id !== null) {
        this.model = this.model.filter(item => item.id !== tag.id);
      } else {
        this.model = this.model.filter(item => !(item.id === null && item.title.toLowerCase() === tag.title.toLowerCase()));
      }
      this.emitUpdate();
    },
    async acceptAll() {
      const toAccept = [...this.suggestedOptions, ...this.generatedOptions];
      for (const opt of toAccept) {
        if (this.model.length >= MAX_TAGS) break;
        await this.toggle(opt);
      }
    },
    emitUpdate() {
      // Entries with id: null aren't created in the backend yet - they're resolved
      // (created as pending) by the parent form only when the form is saved/published.
      const tags = this.model.map(tag => (tag.id !== null ? { id: tag.id } : { id: null, title: tag.title }));
      this.$emit("update:tag", tags);
      this.setTempTags(tags.filter(tag => tag.id !== null));
    },
    //Set the selected tags temporarily in the store to be accessible in other components
    setTempTags(tags) {
      this.$store.commit("project/setTempTags", tags);
    }
  },
  computed: {
    existingTags() {
      const suggestedTitles = new Set((this.suggested || []).map(title => title.toLowerCase()));
      return this.$store.state.tag.tags.map(tag => ({
        id: tag.id,
        title: tag.title,
        isSuggested: suggestedTitles.has(tag.title.toLowerCase())
      }));
    },
    suggestedOptions() {
      return this.existingTags.filter(tag => tag.isSuggested && !this.isSelectedOption(tag));
    },
    generatedOptions() {
      const existingTitles = new Set(this.existingTags.map(tag => tag.title.toLowerCase()));
      return (this.generated || [])
        .filter(title => !existingTitles.has(title.toLowerCase()))
        .map(title => ({ id: null, title, isGenerated: true }))
        .filter(opt => !this.isSelectedOption(opt));
    },
    filteredOptions() {
      const needle = this.query.trim().toLowerCase();
      return this.existingTags.filter(tag => tag.title.toLowerCase().includes(needle));
    }
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

.cc-chip--disabled {
  opacity: .5;
  pointer-events: none;
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

.cc-pending-icon {
  font-size: 12px;
  line-height: 1;
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

.cc-picker {
  width: 340px;
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
  max-height: 214px;
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

.cc-accept-all {
  align-self: flex-start;
  font-size: 12.5px;
  font-weight: 700;
  color: #4759c4;
  cursor: pointer;
  margin-top: 8px;
  display: inline-block;

  &:hover {
    text-decoration: underline;
  }
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
