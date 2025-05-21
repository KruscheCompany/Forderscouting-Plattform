<template>
  <div>
    <h6 class="text-center font-24 q-mt-md">
      {{ $t("personalData.personalData") }}
    </h6>
    <q-form
      ref="personalDataForm"
      @submit.prevent="savePersonalData"
      class="q-gutter-lg q-px-md q-mb-md"
    >
      <div class="row justify-center">
        <div class="col-12 text-center">
          <q-img
            v-if="!!userDetails && userDetails.profile"
            class="radius-10 profileImage"
            spinner-color="primary"
            :src="
              `${appUrl}${!!userDetails &&
                !!userDetails.profile &&
                userDetails.profile.url}`
            "
            style="height: 160px; max-width: 160px"
          />
          <div class="flex flex-center" v-else style="height: 160px">
            <h6 class="text-grey">{{ $t("No Profile Image") }}</h6>
          </div>
        </div>
      </div>
      <div class="row justify-center q-mt-sm">
        <div
          class="flex justify-between"
          style="width: 160px; max-width: 160px"
        >
          <a
            @click.prevent="changeImage()"
            class="font-16 text-primary text-weight-600 cursor-pointer text-underline"
            >{{ $t("personalData.change") }}</a
          >
          <a
            @click.prevent="deleteImage()"
            class="font-16 text-red text-weight-600 cursor-pointer text-underline"
          >
            {{ $t("personalData.delete") }}</a
          >
        </div>
        <div class=""></div>
      </div>
      <q-file
        class="hidden"
        ref="profileImg"
        outlined
        v-model="newImg"
        label="Outlined"
        @input="uploadImage"
        accept="image/*"
        @rejected="rejected"
      />
      <div class="row items-center">
        <div class="col-12 col-md-3">
          <p class="font-16 no-margin">
            Name
          </p>
        </div>
        <div class="col-12 col-md-9">
          <q-input
            outlined
            class="no-shadow input-radius-6"
            v-model="form.fullName"
            :rules="[]"
          />
        </div>
      </div>
      <div class="row items-center">
        <div class="col-12 col-md-3">
          <p class="font-16 no-margin">
            {{ $t("personalData.administration") }}
          </p>
        </div>
        <div class="col-12 col-md-9">
          <q-input
            disable
            outlined
            class="no-shadow input-radius-6"
            v-model="form.administration"
            :rules="[]"
          />
        </div>
      </div>
      <div class="row items-center">
        <div class="col-12 col-md-3">
          <p class="font-16 no-margin">
            Email
          </p>
        </div>
        <div class="col-12 col-md-9">
          <q-input
            disable
            outlined
            class="no-shadow input-radius-6"
            v-model="form.email"
            :rules="[]"
          />
        </div>
      </div>
      <div class="row items-center">
        <div class="col-12 col-md-3">
          <p class="font-16 no-margin">
            {{ $t("personalData.telephone") }}
          </p>
        </div>
        <div class="col-12 col-md-9">
          <q-input
            outlined
            class="no-shadow input-radius-6"
            v-model="form.telephone"
            :rules="[]"
          />
        </div>
      </div>
      <div class="row items-center">
        <div class="col-12 col-md-3">
          <p class="font-16 no-margin">
            {{ $t("personalData.location") }}
          </p>
        </div>
        <div class="col-12 col-md-9">
          <!-- <q-input
            outlined
            class="no-shadow input-radius-6"
            v-model="form.location"
            :rules="[]"
          /> -->

          <MunicipalityCities
          :currentMunicipality="form.location"
          @update:city="form.location = $event"
          />
        </div>
      </div>
      <div class="row items-center">
        <div class="col-12 col-md-3">
          <p class="font-16 no-margin">
            {{ $t("projectIdeaPlaceholder.streetNr") }}
          </p>
        </div>
        <div class="col-12 col-md-9">
          <q-input
            outlined
            class="no-shadow input-radius-6"
            v-model="form.streetNo"
            :rules="[]"
          />
        </div>
      </div>
      <div class="row items-center">
        <div class="col-12 col-md-3">
          <p class="font-16 no-margin">
            {{ $t("projectIdeaPlaceholder.postalCity/place") }}
          </p>
        </div>
        <div class="col-12 col-md-9">
          <q-input
            outlined
            class="no-shadow input-radius-6"
            v-model="form.postalCode"
            :rules="[]"
          />
        </div>
      </div>
      <!-- <div class="row items-center">
        <div class="col-12 bg-yellow-10 radius-6">
          <q-checkbox
            color="primary"
            class="dataVisible font-16 q-py-sm"
            right-label
            v-model="form.contactPrivacy"
          >
            {{ $t("personalData.contactUser") }}
          </q-checkbox>
        </div>
      </div> -->
      <div class="row justify-center">
        <q-btn
          type="submit"
          :loading="isLoading"
          size="16px"
          color="primary"
          no-caps
          class="radius-6 q-px-xl q-py-sm"
        >
          {{ $t("personalData.saveChanges") }}
        </q-btn>
      </div>
    </q-form>
  </div>
</template>

<script>
import MunicipalityCities from "components/Municipality/MunicipalityCities.vue";
export default {
  name: "personalDataTab",
  components: {
    MunicipalityCities
  },
  data() {
    return {
      profileImage: null,
      form: {
        fullName: "",
        administration: "",
        email: "",
        telephone: "",
        location: "",
        streetNo: "",
        postalCode: "",
        contactPrivacy: false
      },
      isLoading: false,
      newImg: null
    };
  },
  methods: {
    rejected() {
      this.$q.notify({
        color: "negative",
        textColor: "white",
        message: "Bitte stellen Sie sicher, dass Sie ein Bild hochladen"
      });
    },
    async uploadImage() {
      if (this.newImg != null) {
        this.isLoading = true;
        if (this.profileImage != null) await this.deleteImage();
        await this.$store.dispatch("userCenter/uploadProfile", {
          id: this.userDetails.id,
          img: this.newImg
        });
        this.isLoading = false;
      }
    },
    setData() {
      this.profileImage = this.userDetails?.profile?.url || null;
      this.form.email = (!!this.user && this.user.email) || "";
      this.form.fullName =
        (!!this.userDetails && this.userDetails.fullName) || "";
      this.form.telephone =
        (!!this.userDetails && this.userDetails.phone) || "";
      this.form.location =
        (!!this.userDetails && this.userDetails.location) || "";
      this.form.administration =
        (!!this.userDetails &&
          !!this.userDetails.municipality &&
          this.userDetails.municipality.title) ||
        "";
      this.form.streetNo =
        (!!this.userDetails && this.userDetails.streetNo) || "";
      this.form.postalCode =
        (!!this.userDetails && this.userDetails.postalCode) || "";
      this.form.contactPrivacy =
        (!!this.userDetails && this.userDetails.contactPrivacy) || false;
      this.newImg = null;
    },
    changeImage() {
      this.$refs.profileImg.pickFiles();
    },
    async deleteImage() {
      if (this.profileImage != null) {
        await this.$store.dispatch(
          "userCenter/deleteProfile",
          this.userDetails.profile.id
        );
      }
    },
    savePersonalData() {
      console.log(this.form);
      this.$refs.personalDataForm.validate().then(async success => {
        if (success) {
          this.isLoading = true;
          const res = await this.$store.dispatch(
            "userCenter/updatePersonalData",
            {
              data: {
                fullName: this.form.fullName,
                phone: this.form.telephone,
                location: this.form.location,
                streetNo: this.form.streetNo,
                postalCode: this.form.postalCode,
                contactPrivacy: this.form.contactPrivacy
              }
            }
          );
          this.isLoading = false;
          if (res !== false) {
            this.$store.dispatch("userCenter/getUserDetails");
          }
        } else {
          console.log("error");
        }
      });
    }
  },
  mounted() {
    this.setData();
  },
  watch: {
    userDetails: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.setData();
        }
      },
      deep: true
    },
    user: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.setData();
        }
      },
      deep: true
    }
  },
  computed: {
    appUrl() {
      return process.env.VUE_APP_MAIN_URL;
    },
    userDetails() {
      return (
        !!this.$store.state.userCenter.user &&
        this.$store.state.userCenter.user.userDetails
      );
    },
    user() {
      return (
        !!this.$store.state.userCenter.user &&
        this.$store.state.userCenter.user.user
      );
    }
  }
};
</script>

<style lang="scss">
.dataVisible .q-checkbox__bg {
  background: transparent;
}
.dataVisible .q-checkbox__bg svg {
  color: $primary;
  padding: 2px;
}
.profileImage div.q-img__image {
  background-size: contain !important;
  background-repeat: no-repeat !important;
}
</style>
