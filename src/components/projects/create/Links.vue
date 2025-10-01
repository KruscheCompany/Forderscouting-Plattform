<template>
  <div>
    <div class="row">
      <div v-for="(link, index) in links" :key="index" class="col-12">
        <div class="row items-baseline" :class="{ 'q-col-gutter-x-md': $q.screen.gt.sm }">
          <div class="col-11">
            <div class="row q-col-gutter-x-md">
              <div class="col-6">
                <q-input :rules="[val => !!val || $t('Required')]" outlined dense class="no-shadow input-radius-6"
                  placeholder="Titel" v-model="link.title" @input="onInput(index)" />
              </div>
              <div class="col-6">
                <q-input outlined dense class="no-shadow input-radius-6" placeholder="https://"
                  v-model.number="link.link" :rules="[val => !!val || $t('Required')]" @input="onInput(index)" />
              </div>
            </div>
          </div>
          <div class="col-1 ">
            <q-btn @click="removeLink(index)" icon="delete" flat round color="red" size="md" />
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <q-btn @click="addLink()" outline class="radius-6" icon="add" size="md" color="primary"
        :label="$t('links.linkAdd')" no-caps />
    </div>
  </div>
</template>

<script>
export default {
  name: "links",
  props: {
    editing: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      links: this.editing
    };
  },
  methods: {
    onInput(index) {
      if (!!this.links[index].title && !!this.links[index].link) {
        this.$emit("update:link", this.links.length > 0 ? this.links : []);
      }
    },
    addLink() {
      this.links.push({
        title: "",
        link: ""
      });
    },
    removeLink(index) {
      this.links.splice(index, 1);
      this.$emit("update:link", this.links.length > 0 ? this.links : []);
    }
  }
};
</script>

<style></style>
