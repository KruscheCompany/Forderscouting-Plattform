<template>
  <q-dialog v-model="$_options">
    <q-card class="q-px-xl radius-10 column">
      <q-card-section align="center">
        <h6 class="text-center font-20 q-mt-md q-mb-none">
          {{
            tab == "projectIdeas"
              ? $t("You don't have access to this Project Idea")
              : tab === "fundings"
              ? $t("You don't have access to this Funding")
              : tab === "implementationChecklist"
              ? $t("You don't have access to this Checklist")
              : ""
          }}
        </h6>
      </q-card-section>
      <q-card-section align="left">
        <div class=" items-center text-center ">
          <p>
            {{
              type !== "duplicate"
                ? $t(`Would you like to request ${type} access?`)
                : $t("Would you like to request a duplication?")
            }}
          </p>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row justify-center q-ml-lg ">
          <q-btn
            :label="$t('category&Keyword.cancel')"
            outline
            v-close-popup
            size="14px"
            color="primary"
            no-caps
            class="no-shadow radius-6 q-px-xl  q-mr-sm "
          />
          <q-btn
            :label="$t('confirm')"
            unelevated
            :loading="isLoading"
            size="14px"
            color="primary"
            no-caps
            class="no-shadow radius-6 q-px-xl q-py-sm"
            @click="requestAccess"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "requestAccessDialog",
  props: {
    dialogState: { type: Boolean, default: false },
    tab: { type: String, default: "" },
    id: { type: Number, default: null },
    type: { type: String, default: "" }
  },
  data() {
    return {
      isLoading: false
    };
  },
  methods: {
    async requestAccess() {
      if (this.tab === "projectIdeas") {
        this.isLoading = true;
        const res = await this.$store.dispatch("project/requestAccess", {
          id: this.id,
          userId: !!this.loggedInUser && this.loggedInUser.id,
          type: this.type,
          guest: this.isGuest
        });
        this.isLoading = false;
        if (res !== false) {
          this.$_options = false;
        }
      } else if (this.tab === "fundings") {
        this.isLoading = true;
        const res = await this.$store.dispatch("funding/requestAccess", {
          id: this.id,
          userId: !!this.loggedInUser && this.loggedInUser.id,
          type: this.type,
          guest: this.isGuest
        });
        this.isLoading = false;
        if (res !== false) {
          this.$_options = false;
        }
      } else {
        this.isLoading = true;
        const res = await this.$store.dispatch(
          "implementationChecklist/requestAccess",
          {
            id: this.id,
            userId: !!this.loggedInUser && this.loggedInUser.id,
            type: this.type,
            guest: this.isGuest
          }
        );
        this.isLoading = false;
        if (res !== false) {
          this.$_options = false;
        }
      }
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
    },
    loggedInUser() {
      return (
        !!this.$store.state.userCenter.user &&
        this.$store.state.userCenter.user.user
      );
    },
    isGuest() {
      return this.$store.getters["userCenter/isGuest"];
    }
  }
};
</script>

<style></style>
