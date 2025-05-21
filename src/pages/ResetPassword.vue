<template>
  <q-page class="bg-white q-pa-md flex flex-center">
    <q-card class="q-pa-lg radius-10 shadow-1" style="width: 600px;">
      <div>
        <h6 class="text-center font-24 q-mt-md">Passwort zurücksetzen</h6>
        <q-form
          @submit.prevent.stop="resetPassword"
          class="q-gutter-md q-px-md q-mb-md "
        >
          <div class="row items-baseline">
            <div class="col-3">
              <p class="font-14 no-margin">
                Passwort
              </p>
            </div>
            <div class="col-9">
              <q-input
                outlined
                class="no-shadow input-radius-6"
                v-model="form.password"
                :rules="[
                  val =>
                    validatePassword(val) ||
                    'Passwort muss alle Kriterien erfüllen'
                ]"
                placeholder="Passwort"
                type="password"
                ref="password"
              />
            </div>
          </div>
          <div class="row ">
            <div class="col-12">
              <div class="password-criteria q-pa-sm">
                <div class="text-subtitle2 q-mb-sm">Passwort-Kriterien:</div>
                <div>
                  <q-icon
                    :name="validPassword.length ? 'check_circle' : 'cancel'"
                    :color="validPassword.length ? 'positive' : 'negative'"
                  ></q-icon>
                  Muss mindestens 8 Zeichen lang sein.
                </div>
                <div>
                  <q-icon
                    :name="validPassword.capital ? 'check_circle' : 'cancel'"
                    :color="validPassword.capital ? 'positive' : 'negative'"
                  ></q-icon>
                  Muss mindestens einen Großbuchstaben enthalten.
                </div>
                <div>
                  <q-icon
                    :name="validPassword.number ? 'check_circle' : 'cancel'"
                    :color="validPassword.number ? 'positive' : 'negative'"
                  ></q-icon>
                  Muss mindestens eine Zahl enthalten.
                </div>
                <div>
                  <q-icon
                    :name="validPassword.symbol ? 'check_circle' : 'cancel'"
                    :color="validPassword.symbol ? 'positive' : 'negative'"
                  ></q-icon>
                  Muss mindestens ein Sonderzeichen enthalten: !@#$%^&*()-_+=
                </div>
              </div>
            </div>
          </div>
          <div class="row items-start">
            <div class="col-3">
              <p class="font-14 no-margin q-pr-md">
                Passwort bestätigen
              </p>
            </div>
            <div class="col-9">
              <q-input
                outlined
                class="no-shadow input-radius-6"
                v-model="form.passwordConfirm"
                :rules="[
                  val =>
                    (!!val && val === form.password) ||
                    'Passwörter stimmen nicht überein'
                ]"
                placeholder="Passwort bestätigen"
                type="password"
                ref="passwordConfirm"
              />
            </div>
          </div>

          <div class="row justify-center q-ml-lg ">
            <q-btn
              label="Passwort zurücksetzen"
              type="submit"
              unelevated
              size="16px"
              color="primary"
              no-caps
              :loading="isLoading"
              class="no-shadow radius-6 q-px-xl full-width"
            />
          </div>
        </q-form>
      </div>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: "resetPassword",
  data() {
    return {
      form: {
        password: "",
        passwordConfirm: ""
      },
      isLoading: false,
      validPassword: {
        length: false,
        capital: false,
        number: false,
        symbol: false
      }
    };
  },
  methods: {
    validatePassword(password) {
      // Test length
      this.validPassword.length = this.form.password.length >= 8;
      // Test capital
      this.validPassword.capital = /^(?=.*[A-Z]).*$/.test(password);
      // Test number
      this.validPassword.number = /^(?=.*[0-9]).*$/.test(password);
      // Test symbol
      this.validPassword.symbol = /^(?=.*[!@#$%^&*()\-_+=]).*$/.test(password);
      return (
        this.validPassword.length &&
        this.validPassword.capital &&
        this.validPassword.number &&
        this.validPassword.symbol
      );
    },
    async resetPassword() {
      const { code } = this.$route.query;
      if (this.form.password && this.form.passwordConfirm && code) {
        this.isLoading = true;
        const res = await this.$store.dispatch("userCenter/resetPassword", {
          data: {
            password: this.form.password,
            passwordConfirmation: this.form.passwordConfirm,
            code
          }
        });
        this.isLoading = false;
        if (res !== false) {
          this.$refs.password.resetValidation();
          this.$refs.passwordConfirm.resetValidation();
        }
      }
    }
  }
};
</script>

<style lang="scss">
.password-criteria {
  background-color: #efefef;
  border-radius: 0.5rem;
}
</style>
