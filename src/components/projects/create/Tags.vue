<template>
  <div>
    <q-select outlined dense :rules="requiresValidation === true
        ? [val => (!!val && val.length > 0) || $t('Required')]
        : []
      " v-model="model" multiple :options="tags" options-selected-class="text-primary text-weight-600"
      class="no-shadow input-radius-6" @input="onSelect">
      <template v-slot:selected>
        <template v-if="model && model.length > 0">
          <span v-for="(tag, index) in model" :key="index">
            {{ index > 0 ? ", " : "" }}
            {{ tag.title }}
          </span>
        </template>
        <template v-else>
          <span class="text-grey">
            {{ $t("tagsSelector.title") }}
          </span>
        </template>
      </template>
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
          <q-item-section>
            <q-item-label>{{ scope.opt.title }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script>
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
    }
  },
  data() {
    return {
      model: this.editing
    };
  },
  watch: {
    editing(newVal) {
      this.model = newVal;
    }
  },
  methods: {
    onSelect(value) {
      const tags = [];
      value.forEach(element => {
        tags.push({ id: element.id });
      });
      this.$emit("update:tag", tags.length > 0 ? tags : []);
      this.setTempTags(tags);
    },

    setTags() {
      this.model = this.editing
        ? JSON.parse(JSON.stringify(this.$store.state.project.project.tags))
        : null;
    },

    //Set the selected tags temporarily in the store to be accessible in other components
    setTempTags(tags) {
      this.$store.commit("project/setTempTags", tags);
    }
  },
  computed: {
    tags() {
      return this.$store.state.tag.tags
        .map(tag => {
          return {
            id: tag.id,
            title: tag.title
          };
        })
        .sort((a, b) => a.title.localeCompare(b.title));
    }
  }
  // mounted() {
  //   this.model = this.editing
  //     ? JSON.parse(JSON.stringify(this.$store.state.project.project.tags))
  //     : null;
  // }
};
</script>

<style></style>
