<template>
  <q-page class="q-mt-lg q-pb-md" :class="$q.screen.lt.md ? 'q-mx-md' : 'q-mx-xl'">
    <q-card
      v-if="Object.keys(data).length === 0"
      class="full-height full-width bg-white radius-20 shadow-1"
    >
      <q-card-section>
        <div class="row">
          <div class="col-12 text-center">
            <q-icon name="notifications_active" size="xl" />
          </div>
          <div class="col-12 text-center">
            <h3 class="font-16 text-weight-bold q-mb-none">
              {{ $t("noNotifications") }}
            </h3>
            <p class="q-mb-none textColor">
              {{ $t("noNotificationsDesc") }}
            </p>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <div v-for="(cluster, index) in data" :key="index">
      <p class="font-16" v-if="cluster.length > 0">{{ getIndex(index) }}</p>
      <q-card
        v-for="(noti, index) in cluster"
        :key="noti.id + noti.typeOfNoti"
        class="shadow-1 radius-20 q-mb-md q-pa-sm"
        flat
      >
        <q-card-section class="row">
          <q-icon
            :name="getIcon(noti.typeOfNoti)"
            size="md"
            color="blue-5"
            class="q-mr-sm"
          />
          <div class="col-12 col-md-4">
            <p class="font-16 text-weight-600 q-mb-none">
              {{
                noti.typeOfNoti == "fundingExpirey"
                  ? $t("Funding opportunity expires | ")
                  : noti.typeOfNoti == "guest"
                  ? $t("New user request access to the platform")
                  : noti.typeOfNoti == "fundingComments"
                  ? $t("Comment to a funding made by | ")
                  : noti.typeOfNoti == "requests"
                  ? $t(`Request to ${noti.type} a document made by | `)
                  : ""
              }}

              <span class="text-blue">{{
                noti.typeOfNoti == "fundingExpirey"
                  ? noti.plannedEnd
                  : noti.typeOfNoti == "fundingComments" && noti.owner != null
                  ? noti.owner.username
                  : noti.typeOfNoti == "requests" && noti.user != null
                  ? noti.user.username
                  : ""
              }}</span>
            </p>
            <p class="font-14 q-mb-none">
              {{
                noti.typeOfNoti == "fundingExpirey"
                  ? noti.title
                  : noti.typeOfNoti == "guest"
                  ? noti.email
                  : noti.typeOfNoti == "fundingComments"
                  ? noti.funding.title
                  : noti.typeOfNoti == "requests"
                  ? noti.project != null
                    ? noti.project.title
                    : noti.funding != null
                    ? noti.funding.title
                    : noti.checklist.title
                  : ""
              }}
            </p>
          </div>
          <div
            :class="
              $q.screen.lt.md
                ? 'text-center q-mt-md col-md col-12'
                : 'text-right col-md col-12'
            "
          >
            <q-btn
              @click="view(noti)"
              v-if="
                noti.typeOfNoti == 'fundingComments' ||
                noti.typeOfNoti == 'fundingExpirey' ||
                noti.typeOfNoti == 'requests'
              "
              color="
              blue"
              unelevated
              outline
              class="radius-6 text-weight-600"
              :class="$q.screen.lt.md ? 'full-width q-mb-md' : ''"
              no-caps
              dense
            >
              <p class="q-mb-none q-mx-md q-my-sm">
                {{ $t("notificationsUser.viewBtn") }}
              </p>
            </q-btn>
            <q-btn
              @click="view(noti, true)"
              v-if="noti.typeOfNoti == 'fundingComments'"
              color="
              blue"
              unelevated
              outline
              class="radius-6 text-weight-600 q-ml-md"
              :class="$q.screen.lt.md ? 'full-width q-mb-md' : ''"
              dense
              no-caps
            >
              <p class="q-mb-none q-mx-md q-my-sm">
                {{ $t("notificationsUser.viewFundingBtn") }}
              </p>
            </q-btn>
            <q-btn
              @click="acceptReq(noti, index)"
              v-if="noti.typeOfNoti == 'guest' || noti.typeOfNoti == 'requests'"
              color="blue"
              unelevated
              class="radius-6 q-ml-md text-weight-600"
              :class="$q.screen.lt.md ? 'full-width q-mb-md' : ''"
              dense
              no-caps
            >
              <p class="q-mb-none q-mx-md q-my-sm">
                {{ $t("notificationsUser.acceptBtn") }}
              </p>
            </q-btn>
            <q-btn
              @click="declineReq(noti, index)"
              v-if="noti.typeOfNoti == 'guest' || noti.typeOfNoti == 'requests'"
              color="red"
              unelevated
              class="radius-6 q-ml-md text-weight-600"
              :class="$q.screen.lt.md ? 'full-width q-mb-md' : ''"
              dense
              no-caps
            >
              <p class="q-mb-none q-mx-md q-my-sm">
                {{ $t("notificationsUser.declineBtn") }}
              </p>
            </q-btn>
            <q-btn
              @click="markAsRead(noti, index)"
              color=""
              unelevated
              class="radius-6 q-ml-md text-weight-600 text-blue"
              :class="$q.screen.lt.md ? 'full-width q-mb-md' : ''"
              dense
              no-caps
            >
              <p class="q-mb-none q-mx-md q-my-sm">
                <q-icon name="check" size="xs"> </q-icon>
                {{ $t("notificationsUser.markAsRead") }}
              </p>
            </q-btn>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <q-dialog v-if="dialog" v-model="dialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">
            {{ $t("New Comment on Funding") }} "{{ currentFundingComment.funding.title }}"
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ currentFundingComment.owner.username }} {{ $t("says") }}: <br />
          {{ currentFundingComment.comment }}
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="CLOSE" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <RequestAccessDialog
      :id="itemId"
      :tab="tab"
      :type="itemType"
      :dialogState="requestDialog"
      @update="(requestDialog = $event), (itemId = null), (itemType = null)"
    />
    <InviteUser
      :dialogState="inviteUserDialog"
      @update="inviteUserDialog = $event"
      :guestEmail="currentGuestEmail"
      :guestLocation="currentGuestLocation"
      :guestMunicipality="currentGuestMunicipality"
      :guestName="currentGuestName"
      :guestCategories="currentGuestCategories"
      :notification="currentNoti"
      @deltedNotification="updateNotifications"
    />
  </q-page>
</template>

<script>
import { date } from "quasar";
import InviteUser from "components/user/management/InviteUser.vue";
import RequestAccessDialog from "components/data/RequestAccessDialog.vue";
export default {
  name: "notifications",
  components: {
    InviteUser,
    RequestAccessDialog,
  },
  data() {
    return {
      data: [],
      dialog: false,
      currentFundingComment: null,
      inviteUserDialog: false,
      currentGuestEmail: "",
      currentGuestLocation: "",
      currentGuestMunicipality: null,
      currentGuestCategories: [],
      currentGuestName: "",
      currentNoti: null,
      itemId: null,
      tab: null,
      itemType: null,
      requestDialog: false,
    };
  },
  computed: {
    loggedInUser() {
      return (
        !!this.$store.state.userCenter.user && this.$store.state.userCenter.user.user
      );
    },
  },
  methods: {
    getIndex(index) {
      if (date.formatDate(new Date(), "YYYY-MM-DD") == index) return "Today";
      else return index;
    },
    prepData() {
      var data = [];
      for (const item in this.data) {
        if (item === "fundingComments") {
          this.data[item].forEach((funding) => {
            data.push({ ...funding, typeOfNoti: "fundingComments" });
          });
        } else if (item === "guest") {
          this.data[item].forEach((funding) => {
            data.push({ ...funding, typeOfNoti: "guest" });
          });
        } else if (item === "requests") {
          this.data[item].forEach((funding) => {
            data.push({ ...funding, typeOfNoti: "requests" });
          });
        } else if (item === "fundingExpirey") {
          this.data[item].forEach((funding) => {
            var plannedEnd = new Date(funding.plannedEnd);
            plannedEnd.setDate(plannedEnd.getDate() - 30);
            funding.createdAt = plannedEnd;
            funding.createdAt = plannedEnd.toISOString().split("T")[0];
            data.push({ ...funding, typeOfNoti: "fundingExpirey" });
          });
        }
      }
      data.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      var byDate = {};
      data.forEach((item) => {
        if (byDate[item.createdAt.split("T")[0]] == undefined) {
          byDate[item.createdAt.split("T")[0]] = [];
          byDate[item.createdAt.split("T")[0]].push(item);
        } else byDate[item.createdAt.split("T")[0]].push(item);
      });
      // byDate = byDate.reverse();
      this.data = byDate;
    },
    getData() {
      this.$api.get("/api/user/notification").then((response) => {
        this.data = response.data;
        this.prepData();
      });
    },
    getIcon(type) {
      if (type == "fundingExpirey") return "calendar_month";
      else if (type == "fundingComments") return "description";
      else if (type == "guest") return "person";
      else if (type == "requests") return "person_add";
    },
    async view(noti, isFunding = false) {
      console.log(this.loggedInUser);
      if (noti.typeOfNoti == "fundingComments" && isFunding) {
        this.$router.push({ path: `/user/newFunding/${noti.funding.id}` });
      } else if (noti.typeOfNoti == "fundingComments") {
        this.dialog = true;
        this.currentFundingComment = noti;
      } else if (noti.typeOfNoti == "fundingExpirey") {
        this.$router.push({ path: `/user/newFunding/${noti.id}` });
      } else if (noti.typeOfNoti == "requests") {
        if (noti.project != null) {
          if (noti.project.owner.id != this.loggedInUser.id) {
            this.tab = "projectIdeas";
            this.itemId = noti.project.id;
            this.itemType = "view";
            this.requestDialog = true;
          } else {
            this.$router.push({
              path: `/user/newProjectIdea/${noti.project.id}`,
            });
          }
        } else if (noti.funding != null) {
          if (noti.funding.owner.id != this.loggedInUser.id) {
            this.tab = "fundings";
            this.itemId = noti.funding.id;
            this.itemType = "view";
            this.requestDialog = true;
          } else {
            this.$router.push({ path: `/user/newFunding/${noti.funding.id}` });
          }
        } else if (noti.checklist != null) {
          if (noti.checklist.owner.id != this.loggedInUser.id) {
            this.tab = "implementationChecklist";
            this.itemId = noti.checklist.id;
            this.itemType = "view";
            this.requestDialog = true;
          } else {
            this.$router.push({
              path: `/user/newChecklist/${noti.checklist.id}`,
            });
          }
        }
      }
    },
    acceptReq(noti, index) {
      if (noti.typeOfNoti == "requests") {
        this.$store.dispatch("userCenter/manageRequest", {
          id: noti.id,
          val: true,
        });
        this.updateNotifications(noti, index);
      } else {
        this.currentNoti = noti;
        this.currentNoti.index = index;
        this.currentGuestEmail = noti.email;
        this.currentGuestLocation = noti.location;
        this.currentGuestMunicipality = noti.municipality;
        this.currentGuestName = noti.name;
        this.currentGuestCategories = noti.categories;
        this.inviteUserDialog = true;
      }
    },
    declineReq(noti, index) {
      if (noti.typeOfNoti == "requests")
        this.$store.dispatch("userCenter/manageRequest", {
          id: noti.id,
          val: false,
        });
      else {
        this.$store.dispatch("userCenter/deleteGuestRequest", {
          id: noti.id,
        });
      }
      this.updateNotifications(noti, index);
    },
    async markAsRead(noti) {
      const notificationType = noti.typeOfNoti;
      switch (notificationType) {
        case "fundingExpirey":
          await this.$api.post("/api/read-notifications", {
            data: {
              user: this.loggedInUser.id,
              funding_expirey: noti.id,
            },
          });
          break;
        case "fundingComments":
          await this.$api.post("/api/read-notifications", {
            data: {
              user: this.loggedInUser.id,
              funding_comment: noti.id,
            },
          });
          this.getData();
          break;
        case "guest":
          await this.$api.post("/api/read-notifications", {
            data: {
              user: this.loggedInUser.id,
              guest_request: noti.id,
            },
          });
          this.getData();
          break;
        case "requests":
          await this.$api.post("/api/read-notifications", {
            data: {
              user: this.loggedInUser.id,
              request: noti.id,
            },
          });
          this.getData();
          break;
        default:
          break;
      }
    },
    updateNotifications(noti, index) {
      this.data[noti.createdAt.split("T")[0]].splice(index, 1);
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style></style>
