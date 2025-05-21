<template>
  <div>
    <h6 class="text-center font-24 q-mt-md">
      {{ $t("notifications.notifications") }}
    </h6>
    <q-form ref="notificationsDataForn" class="q-gutter-lg q-px-md q-mb-md">
      <h2 class="text-left font-16 text-weight-bold q-mb-none text-grey">
        {{ $t("notifications.inThePlatform") }}
      </h2>
      <q-separator inset class="bg-blue-5 q-mt-none" />

      <div class="row items-center q-mt-xs q-pl-md">
        <div class="col-10">
          <p class="font-16 no-margin">
            {{ $t("notifications.updateRequest") }}
          </p>
        </div>
        <div class="col-2 text-right">
          <q-toggle
            size="lg"
            color="primary"
            class="customToggle"
            v-model="form.notifications.app.fundingComments"
            aria-label="toggle"
          />
        </div>
      </div>
      <q-separator inset class="bg-blue opacity-10 q-mt-xs" />

      <div class="row items-center q-mt-xs q-pl-md">
        <div class="col-10">
          <p class="font-16 no-margin">
            {{ $t("notifications.invitations") }}
          </p>
        </div>
        <div class="col-2 text-right">
          <q-toggle
            size="lg"
            color="primary"
            class="customToggle"
            v-model="form.notifications.app.userJoinRequest"
            aria-label="toggle"
          />
        </div>
      </div>
      <q-separator inset class="bg-blue opacity-10 q-mt-xs" />
      <div class="row items-center q-mt-xs q-pl-md">
        <div class="col-10">
          <p class="font-16 no-margin">
            {{ $t("notifications.FundingOpportunityExpires") }}
          </p>
        </div>
        <div class="col-2 text-right">
          <q-toggle
            size="lg"
            color="primary"
            class="customToggle"
            v-model="form.notifications.app.fundingExpiry"
            aria-label="toggle"
          />
        </div>
      </div>
      <q-separator inset class="bg-blue opacity-10 q-mt-xs" />
      <div class="row items-center q-mt-xs q-pl-md">
        <div class="col-10">
          <p class="font-16 no-margin">
            {{ $t("notifications.viewEditRequest") }}
          </p>
        </div>
        <div class="col-2 text-right">
          <q-toggle
            size="lg"
            color="primary"
            class="customToggle"
            v-model="form.notifications.app.dataRequests"
            aria-label="toggle"
          />
        </div>
      </div>
      <q-separator inset class="bg-blue opacity-10 q-mt-xs" />

      <h2
        class="text-left font-16 text-weight-bold q-mb-none q-mt-md text-grey"
      >
        {{ $t("notifications.viaEmail") }}
      </h2>
      <q-separator inset class="bg-blue-5 q-mt-none" />

      <div class="row items-center q-mt-xs q-pl-md">
        <div class="col-10">
          <p class="font-16 no-margin">
            {{ $t("notifications.updateRequest") }}
          </p>
        </div>
        <div class="col-2 text-right">
          <q-toggle
            size="lg"
            color="primary"
            class="customToggle"
            v-model="form.notifications.email.fundingComments"
            aria-label="toggle"
          />
        </div>
      </div>
      <q-separator inset class="bg-blue opacity-10 q-mt-xs" />

      <div class="row items-center q-mt-xs q-pl-md">
        <div class="col-10">
          <p class="font-16 no-margin">
            {{ $t("notifications.invitations") }}
          </p>
        </div>
        <div class="col-2 text-right">
          <q-toggle
            size="lg"
            color="primary"
            class="customToggle"
            v-model="form.notifications.email.userJoinRequest"
            aria-label="toggle"
          />
        </div>
      </div>
      <q-separator inset class="bg-blue opacity-10 q-mt-xs" />
      <div class="row items-center q-mt-xs q-pl-md">
        <div class="col-10">
          <p class="font-16 no-margin">
            {{ $t("notifications.FundingOpportunityExpires") }}
          </p>
        </div>
        <div class="col-2 text-right">
          <q-toggle
            size="lg"
            color="primary"
            class="customToggle"
            v-model="form.notifications.email.fundingExpiry"
            aria-label="toggle"
          />
        </div>
      </div>
      <q-separator inset class="bg-blue opacity-10 q-mt-xs" />
      <div class="row items-center q-mt-xs q-pl-md">
        <div class="col-10">
          <p class="font-16 no-margin">
            {{ $t("notifications.viewEditRequest") }}
          </p>
        </div>
        <div class="col-2 text-right">
          <q-toggle
            size="lg"
            color="primary"
            class="customToggle"
            v-model="form.notifications.email.dataRequests"
            aria-label="toggle"
          />
        </div>
      </div>
      <q-separator inset class="bg-blue opacity-10 q-mt-xs" />
      <div class="row justify-center">
        <q-btn
          @click="saveNotificationsData"
          :loading="isLoading"
          size="16px"
          color="primary"
          no-caps
          class="radius-6 q-px-xl q-py-sm"
          >{{ $t("notifications.saveChanges") }}</q-btn
        >
      </div>
    </q-form>
  </div>
</template>

<script>
export default {
  name: "NotificationsTab",
  data() {
    return {
      isLoading: false,
      form: {
        notifications: {
          app: {
            dataRequests: true,
            inquiry: true,
            newProjects: true,
            fundingExpiry: true,
            newChecklists: true,
            networkRequest: true
          },
          email: {
            dataRequests: true,
            inquiry: true,
            newProjects: true,
            fundingExpiry: true,
            newChecklists: true,
            networkRequests: true,
            saveEmails: true
          }
        }
      }
    };
  },
  methods: {
    saveNotificationsData() {
      this.$refs.notificationsDataForn.validate().then(async success => {
        if (success) {
          this.isLoading = true;
          const res = await this.$store.dispatch(
            "userCenter/updatePersonalData",
            {
              data: this.form
            }
          );
          this.isLoading = false;
          if (res !== false) {
          }
        } else {
          console.log("error");
        }
      });
    },
    setData() {
      this.form.notifications = {
        ...this.form.notifications,
        ...JSON.parse(
          JSON.stringify(
            this.$store.state.userCenter.user.userDetails.notifications
          )
        )
      };
    }
  },
  mounted() {
    this.setData();
  },
  computed: {
    userDetails() {
      return (
        this.$store.state.userCenter.user &&
        this.$store.state.userCenter.user.userDetails
      );
    }
  }
};
</script>

<style lang="scss">
.customToggle .q-toggle__track {
  height: 0.4em;
  border-radius: 0.2em;
}
.customToggle .q-toggle__inner--truthy .q-toggle__track {
  background: $primary;
  opacity: 1;
}
.customToggle .q-toggle__thumb {
  color: white;
  transform: scale(0.64);
  top: 0.27em;
}
</style>
