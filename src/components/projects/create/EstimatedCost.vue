<template>
  <div>
    <div class="row q-col-gutter-y-lg q-mb-lg">
      <div v-for="(cost, index) in estimatedCosts" :key="index" class="col-12">
        <div
          class="row items-baseline"
          :class="{ 'q-col-gutter-x-md': $q.screen.gt.sm }"
        >
          <div class="col-11">
            <div class="row q-col-gutter-x-md ">
              <div class="col-6">
                <q-input
                  outlined
                  dense
                  class="no-shadow input-radius-6"
                  :placeholder="$t('estimatedCost.costName')"
                  @input="onInput(index)"
                  v-model="cost.name"
                  :rules="[val => !!val || 'Please enter cost name']"
                />
              </div>
              <div class="col-6">
                <q-input
                  outlined
                  :rules="[val => !!val || 'Please enter cost amount']"
                  dense
                  class="no-shadow input-radius-6"
                  :placeholder="$t('estimatedCost.costAmount')"
                  v-model.lazy="cost.price"
                  @input="onInput(index)"
                  suffix="€"
                  v-money="money"
                />
              </div>
            </div>
          </div>
          <div class="col-1">
            <q-btn
              @click="removeEstimatedCost(index)"
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
        @click="addEstimatedCost()"
        outline
        class="radius-6"
        icon="add"
        size="md"
        color="primary"
        :label="$t('estimatedCost.addCost')"
      />
    </div>
  </div>
</template>

<script>
import { VMoney } from "v-money";

export default {
  directives: {
    money: VMoney
  },
  name: "estimatedCost",
  props: {
    editing: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      money: {
        thousands: ".",
        decimal: ",",
        suffix: "",
        precision: 2,
        masked: false /* doesn't work with directive */
      },
      estimatedCosts: this.editing
    };
  },
  methods: {
    onInput(index) {
      // console.log(index, type);
      // let formattedNumber = new Intl.NumberFormat("de-DE").format(
      //   this.estimatedCosts[index].price
      // );
      // console.log(formattedNumber);
      if (
        !!this.estimatedCosts[index].name &&
        !!this.estimatedCosts[index].price
      ) {
        // this.estimatedCosts.map(item => {
        //   item.price = new Intl.NumberFormat("de-DE").format(
        //     parseFloat(item.price)
        //   );
        // });
        this.$emit(
          "update:cost",
          this.estimatedCosts.length > 0 ? this.estimatedCosts : []
        );
      }
    },
    addEstimatedCost() {
      this.estimatedCosts.push({
        name: "",
        price: ""
      });
    },
    removeEstimatedCost(index) {
      this.estimatedCosts.splice(index, 1);
      this.$emit(
        "update:cost",
        this.estimatedCosts.length > 0 ? this.estimatedCosts : []
      );
    }
  }
};
</script>

<style></style>
