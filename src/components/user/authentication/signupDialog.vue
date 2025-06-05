<template>
  <q-dialog v-model="$_options">
    <q-card
      class="radius-10 q-px-lg q-pt-lg q-pb-md"
      style="width: 570px; max-width: 80vw;"
    >
      <q-card-section>
        <q-form ref="signupForm" class="q-gutter-lg">
          <div class="row">
            <div class="col-12">
              <p class="q-mb-sm font-16">{{ $t("projectIdeaPlaceholder.name") }}</p>
              <q-input
                outlined
                dense
                class="no-shadow input-radius-6"
                v-model="form.name"
                :rules="[val => !!val || $t('Required')]"
              />
            </div>
          </div>
          <div class="row q-mt-none">
            <div class="col-12">
              <p class="q-mb-sm font-16">{{ $t("projectIdeaPlaceholder.email") }}</p>
              <q-input
                @keyup.enter="signup"
                outlined
                dense
                class="no-shadow input-radius-6"
                v-model="form.email"
                :rules="[val => !!val || $t('Required')]"
              />
            </div>
          </div>
          <div class="row q-mt-none">
            <div class="col-12">
              <Municipality :isRequired="true" @update:municipality="form.municipality = $event" />
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <MunicipalityCities
                :isRequired="true"
                @update:city="form.location = $event"
              />
            </div>
          </div>
          <div class="row q-mt-none">
            <div class="col-12">
               <Categories
                :requiresValidation="false"
                @update:category="form.categories = $event"
              />
            </div>
          </div>
          <div class="row q-mt-none">
            <p class="no-margin text-red text-center full-width">
              {{ errorMsg }}
            </p>
          </div>
          <div class="row justify-center">
            <div class="col-12 col-md-5 text-center">
              <q-btn
                @click="signup"
                class="radius-10 full-width"
                padding="12px 12px"
                color="yellow"
                text-color="black"
                unelevated
                :loading="isLoading"
              >
                Registrierung Gastzugang<template v-slot:loading>
                  <q-circular-progress
                    indeterminate
                    class="on-right"
                  /> </template
              ></q-btn>
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import MunicipalityCities from "components/Municipality/MunicipalityCities.vue";
import Municipality from "components/projects/create/Municipality.vue";
import Categories from "components/projects/create/Categories.vue";
export default {
  name: "signupDialog",
  props: {
    dialogState: { type: Boolean, default: false }
  },
  components: {
    MunicipalityCities,
    Municipality,
    Categories
  },
  data() {
    return {
      form: {
        name: "",
        email: "",
        location: "",
        municipality: null,
        categories: []
      },
      isLoading: false,
      errorMsg: ""
    };
  },
  methods: {
    async signup() {
      this.$refs.signupForm.validate().then(async success => {
        if (success) {
          this.isLoading = true;
          const res = await this.register(this.form);
        } else {
          const elements = this.$refs.signupForm.getValidationComponents();
          elements.map(el => {
            if (el.validate) {
              el.validate();
            }
          });
        }
      });
    },
    async register(form) {
      try {
        const res = await this.$api.post("/api/guest-requests", {
          data: {
            name: form.name,
            email: form.email,
            location: form.location,
            municipality: {
              id: form.municipality
            },
            categories: form.categories
          }
        });
        this.$_options = false;
        this.isLoading = false;
        this.errorMsg = "";
        this.$q.notify({
          type: "positive",
          message: "Die Beitrittsanfrage wurde gesendet"
        });
        return res.data;
      } catch (error) {
        this.$q.notify({
          type: "negative",
          message: error.response.data.error.message
        });
        this.errorMsg = error.response.data.error.message;
      }
      // const res = await this.$api.post("/api/guest-requests", {data:{
      //     email: form.email
      // }});
      // return res;
    }
  },
  computed: {
    $_options: {
      get: function() {
        return this.dialogState;
      },
      set: function(val) {
        this.$emit("update", val);
      }
    }
  },
  mounted() {
    this.$store.dispatch("municipality/getMunicipalitiesPublic");
  }
};
</script>

<style></style>
