<template>
  <div>
    <div class="row q-col-gutter-y-lg q-mb-lg">
      <div v-for="(funding, index) in fundingRates" :key="index" class="col-12">
        <div class="row items-baseline q-col-gutter-x-md">
          <div class="col-11">
            <div class="row q-col-gutter-x-md ">
              <div class="col-6">
                <q-input
                  outlined
                  dense
                  class="no-shadow input-radius-6"
                  :placeholder="$t('Content')"
                  v-model="funding.content"
                  :rules="[val => !!val || $t('Required')]"
                  @input="onInput(index)"
                />
              </div>
              <div class="col-6">
                <q-input
                  outlined
                  dense
                  class="no-shadow input-radius-6"
                  :placeholder="$t('Amount')"
                  v-model="funding.amount"
                  :rules="[val => !!val || $t('Required')]"
                  @input="onInput(index)"
                  suffix="%"
                />
              </div>
            </div>
          </div>
          <div class="col-1">
            <q-btn
              @click="removeFundingRate(index)"
              icon="delete"
              flat
              round
              color="red"
              size="md"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <q-btn
        no-caps
        @click="addFundingRate()"
        outline
        class="radius-6"
        icon="add"
        size="md"
        color="primary"
        :label="$t('Add funding rate')"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "fundingRates",
  props: {
    editing: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      fundingRates: this.editing
    };
  },
  methods: {
    onInput(index) {
      if (
        !!this.fundingRates[index].content &&
        !!this.fundingRates[index].amount
      ) {
        this.$emit(
          "update:fundingRate",
          this.fundingRates.length > 0 ? this.fundingRates : []
        );
      }
    },
    addFundingRate() {
      this.fundingRates.push({
        content: "",
        amount: ""
      });
    },
    removeFundingRate(index) {
      this.fundingRates.splice(index, 1);
      this.$emit(
        "update:fundingRate",
        this.fundingRates.length > 0 ? this.fundingRates : []
      );
    }
  }
  // mounted() {
  //   this.fundingRates = this.editing
  //     ? JSON.parse(
  //         JSON.stringify(this.$store.state.project.project.estimatedCosts)
  //       )
  //     : [];
  // }
};
</script>

<style></style>
