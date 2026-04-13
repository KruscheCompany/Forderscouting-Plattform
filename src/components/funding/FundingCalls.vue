<template>
  <div>
    <div class="row">
      <div v-for="(call, index) in calls" :key="index" class="col-12 q-mb-sm">
        <div class="row items-baseline" :class="{ 'q-col-gutter-x-md': $q.screen.gt.sm }">
          <div class="col-11">
            <div class="row q-col-gutter-x-md">
              <div class="col-6">
                <q-input :rules="[val => !!val || $t('Required')]" outlined dense class="no-shadow input-radius-6"
                  :placeholder="$t('Label')" v-model="call.label" @input="onInput(index)" />
              </div>
              <div class="col-6">
                <q-input outlined dense class="no-shadow input-radius-6" :value="call.date" readonly
                  :placeholder="$t('projectIdeaPlaceholder.plannedStartDate')" @click="openDateProxy(index)">
                  <template v-slot:append>
                    <q-icon name="event" color="blue-5" class="cursor-pointer" @click="openDateProxy(index)">
                      <q-popup-proxy :ref="`callDateProxy_${index}`" transition-show="scale" transition-hide="scale">
                        <q-date v-model="call.date" mask="YYYY-MM-DD" @input="closeDateProxy(index)"
                          first-day-of-week="1">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup no-caps :label="$t('Close')" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
          </div>
          <div class="col-1">
            <q-btn @click="removeCall(index)" icon="delete" flat round color="red" size="md" />
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <q-btn @click="addCall()" outline class="radius-6" icon="add" size="md" color="primary"
        :label="$t('fundingCalls.addCall')" no-caps />
    </div>
  </div>
</template>

<script>
export default {
  name: "FundingCalls",
  props: {
    editing: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      calls: this.editing && this.editing.length > 0 ? this.editing : []
    };
  },
  methods: {
    openDateProxy(index) {
      const ref = this.$refs[`callDateProxy_${index}`];
      if (ref && ref[0]) ref[0].show();
      else if (ref) ref.show();
    },
    closeDateProxy(index) {
      const ref = this.$refs[`callDateProxy_${index}`];
      if (ref && ref[0]) ref[0].hide();
      else if (ref) ref.hide();
      this.onInput(index);
    },
    onInput(index) {
      this.$emit("update:fundingCalls", this.calls.length > 0 ? this.calls : []);
    },
    addCall() {
      this.calls.push({ label: "", date: "" });
    },
    removeCall(index) {
      this.calls.splice(index, 1);
      this.$emit("update:fundingCalls", this.calls.length > 0 ? this.calls : []);
    }
  }
};
</script>
