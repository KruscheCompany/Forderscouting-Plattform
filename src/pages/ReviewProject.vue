<template>
  <q-page class="q-pa-md flex flex-center" style="min-height: 100vh;">
    <div class="no-print" style="max-width: 1020px; width: 100%;">
      <div v-if="loading" class="text-center q-py-xl">{{ $t('reviewPage.loading') }}</div>

      <div v-else-if="invalid" class="error-state">
        <div class="error-state-icon">
          <q-icon name="link_off" size="26px" />
        </div>
        <div class="error-state-title">{{ $t('reviewPage.invalidLinkTitle') }}</div>
        <div class="error-state-text">{{ $t('reviewPage.invalidLink') }}</div>
      </div>

      <template v-else>
        <div class="status-banner q-mb-md" :class="bannerClass">
          <q-icon :name="bannerIcon" size="18px" />
          <span>{{ bannerText }}</span>
        </div>

        <template v-if="project">
          <q-card class="review-card q-mb-md shadow-2">
            <div class="review-card-header">
              <span class="review-card-label">{{ $t('reviewPage.requestLabel') }}</span>
              <span v-if="ticket" class="type-badge">
                {{ $t(`projectComponents.aptitude.vorpruefung.${ticket.type}`) }}
              </span>
            </div>
            <q-card-section>
              <div class="meta-grid">
                <div>
                  <div class="meta-label">{{ $t('reviewPage.projectLabel') }}</div>
                  <div class="meta-value">{{ project.title }}</div>
                </div>
                <div v-if="fundingProgramTitle">
                  <div class="meta-label">{{ $t('reviewPage.fundingProgramLabel') }}</div>
                  <div class="meta-value">{{ fundingProgramTitle }}</div>
                </div>
                <div v-if="project.municipality">
                  <div class="meta-label">{{ $t('reviewPage.submittedByLabel') }}</div>
                  <div class="meta-value">{{ project.municipality.title }}</div>
                </div>
                <div v-if="ticket && ticket.sentAt">
                  <div class="meta-label">{{ $t('reviewPage.submittedOnLabel') }}</div>
                  <div class="meta-value">{{ formatDate(ticket.sentAt) }}</div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <q-card class="review-card q-mb-md shadow-2">
            <div class="review-card-header">
              <span class="review-card-label">{{ $t('reviewPage.projectDetailsLabel') }}</span>
            </div>
            <q-card-section class="details-stack">
              <ProjectContentDetails :project="project" current-tab="project" />
              <ProjectFundingCheck :project="project" current-tab="fundingCheck" />
              <ProjectQAndA :project="project" current-tab="qAndA" />

              <q-btn outline no-caps color="primary" class="q-mt-sm no-print" :label="$t('reviewPage.downloadPdf')"
                @click="print" />
            </q-card-section>
          </q-card>

          <q-card class="review-card shadow-2">
            <div class="review-card-header">
              <span class="review-card-label">{{ $t('reviewPage.decisionLabel') }}</span>
            </div>

            <q-card-section v-if="!alreadyAnswered && !submitted">
              <q-form @submit="submit">
                <div class="decision-tiles">
                  <button v-for="opt in decisionOptions" :key="opt.value" type="button" class="decision-tile"
                    :class="[opt.value, { active: decisionType === opt.value }]" @click="decisionType = opt.value">
                    <q-icon :name="opt.icon" size="22px" />
                    <span>{{ opt.label }}</span>
                  </button>
                </div>

                <q-slide-transition>
                  <div v-if="decisionType === 'ruecksprache'" class="contact-options">
                    <div class="contact-options-label">{{ $t('reviewPage.contactOptionsLabel') }}</div>
                    <q-checkbox v-model="wantsPhoneCall" :label="$t('reviewPage.wantsPhoneCall')" />
                    <q-checkbox v-model="wantsOnsiteMeeting" :label="$t('reviewPage.wantsOnsiteMeeting')" />
                  </div>
                </q-slide-transition>

                <q-input outlined type="textarea" rows="5" class="no-shadow input-radius-6 q-mt-md"
                  v-model="responseText" :label="$t('reviewPage.responseTextLabel')"
                  :rules="[val => !!val || $t('Required')]" />

                <q-btn type="submit" unelevated no-caps color="primary" class="q-mt-md full-width" :loading="submitting"
                  :label="$t('reviewPage.submit')" />
              </q-form>
            </q-card-section>

            <div v-else class="closed-notice">
              <div>{{ closedNoticeText }}</div>
              <div v-if="ticket && ticket.responseText" class="q-mt-sm text-left">
                <div class="meta-label">{{ $t('reviewPage.yourResponseLabel') }}</div>
                <div class="description-text">{{ ticket.responseText }}</div>
              </div>
            </div>
          </q-card>
        </template>
      </template>
    </div>

    <ReviewProjectPrint v-if="project" :project="project" :ticket="ticket" :status-text="bannerText" />
  </q-page>
</template>

<script>
import { api } from "boot/axios";
import ReviewProjectPrint from "src/components/projects/view/ReviewProjectPrint.vue";
import ProjectContentDetails from "src/components/projects/view/ProjectContentDetails.vue";
import ProjectFundingCheck from "src/components/projects/view/ProjectFundingCheck.vue";
import ProjectQAndA from "src/components/projects/view/ProjectQAndA.vue";

export default {
  name: "ReviewProject",
  components: { ReviewProjectPrint, ProjectContentDetails, ProjectFundingCheck, ProjectQAndA },
  data() {
    return {
      loading: true,
      invalid: false,
      alreadyAnswered: false,
      answeredAtFormatted: "",
      submitted: false,
      submitting: false,
      project: null,
      ticket: null,
      decisionType: "positiv",
      wantsPhoneCall: false,
      wantsOnsiteMeeting: false,
      responseText: ""
    };
  },
  watch: {
    decisionType(value) {
      if (value !== "ruecksprache") {
        this.wantsPhoneCall = false;
        this.wantsOnsiteMeeting = false;
      }
    }
  },
  computed: {
    decisionOptions() {
      return [
        { label: this.$t("reviewPage.decisionPositiv"), value: "positiv", icon: "check_circle" },
        { label: this.$t("reviewPage.decisionNegativ"), value: "negativ", icon: "cancel" },
        { label: this.$t("reviewPage.decisionRuecksprache"), value: "ruecksprache", icon: "forum" }
      ];
    },
    fundingProgramTitle() {
      return this.project?.fundingGuideline?.[0]?.title || null;
    },
    resolvedStatus() {
      if (this.submitted) return this.decisionType;
      if (this.alreadyAnswered && this.ticket) return this.ticket.status;
      return null;
    },
    bannerClass() {
      if (this.resolvedStatus === "positiv") return "approved";
      if (this.resolvedStatus === "negativ") return "declined";
      if (this.resolvedStatus === "ruecksprache") return "followup";
      return "pending";
    },
    bannerIcon() {
      if (this.resolvedStatus === "positiv") return "check_circle";
      if (this.resolvedStatus === "negativ") return "cancel";
      if (this.resolvedStatus === "ruecksprache") return "forum";
      return "hourglass_top";
    },
    bannerText() {
      if (this.resolvedStatus) {
        const date = this.submitted ? this.formatDate(new Date()) : this.answeredAtFormatted;
        return this.$t(`reviewPage.answeredBanner${this.capitalize(this.resolvedStatus)}`, { date });
      }
      return this.$t("reviewPage.pendingBanner");
    },
    closedNoticeText() {
      if (this.submitted) return this.$t("reviewPage.submitSuccess");
      return this.$t("reviewPage.alreadyAnswered", { date: this.answeredAtFormatted });
    }
  },
  methods: {
    capitalize(value) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
    formatDate(value) {
      return new Date(value).toLocaleDateString("de-DE");
    },
    print() {
      window.print();
    },
    async load() {
      try {
        const res = await api.get(`/api/vorpruefung-tickets/by-token/${this.$route.params.token}`);
        const data = res.data;
        this.project = data.project;
        this.ticket = data.ticket;
        this.alreadyAnswered = !!data.alreadyAnswered;
        if (this.alreadyAnswered) {
          this.answeredAtFormatted = this.formatDate(data.answeredAt);
        }
      } catch (error) {
        this.invalid = true;
      } finally {
        this.loading = false;
      }
    },
    async submit() {
      if (!this.responseText) return;
      this.submitting = true;
      try {
        await api.post(`/api/vorpruefung-tickets/by-token/${this.$route.params.token}/respond`, {
          decisionType: this.decisionType,
          responseText: this.responseText,
          wantsPhoneCall: this.wantsPhoneCall,
          wantsOnsiteMeeting: this.wantsOnsiteMeeting
        });
        this.submitted = true;
        this.ticket = { ...this.ticket, responseText: this.responseText };
      } catch (error) {
        this.$q.notify({
          type: "negative",
          message: error.response && error.response.data && error.response.data.error
            ? error.response.data.error.message
            : "Fehler beim Absenden."
        });
      } finally {
        this.submitting = false;
      }
    },
    setNoReferrerMeta() {
      const meta = document.createElement("meta");
      meta.name = "referrer";
      meta.content = "no-referrer";
      meta.setAttribute("data-vorpruefung-review", "true");
      document.head.appendChild(meta);
    },
    removeNoReferrerMeta() {
      const existing = document.head.querySelector('meta[data-vorpruefung-review="true"]');
      if (existing) document.head.removeChild(existing);
    }
  },
  mounted() {
    this.setNoReferrerMeta();
    this.load();
  },
  beforeDestroy() {
    this.removeNoReferrerMeta();
  }
};
</script>

<style lang="scss" scoped>
@media print {
  .no-print {
    display: none !important;
  }
}

.status-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 18px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid;
}

.status-banner.pending {
  background: rgba(255, 255, 100, 0.12);
  border-color: #cccc00;
  color: #6b6b00;
}

.status-banner.approved {
  background: rgba(73, 184, 18, 0.09);
  border-color: #49b812;
  color: #2a6b08;
}

.status-banner.declined {
  background: rgba(214, 0, 0, 0.07);
  border-color: #d60000;
  color: #d60000;
}

.status-banner.followup {
  background: rgba(22, 66, 139, 0.07);
  border-color: #16428b;
  color: #16428b;
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 4px;
  padding: 48px 32px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 20px rgba(18, 54, 115, 0.08);
}

.error-state-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(214, 0, 0, 0.09);
  color: #d60000;
  margin-bottom: 14px;
}

.error-state-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #1a1a1a;
}

.error-state-text {
  font-size: 0.85rem;
  color: #888888;
  max-width: 320px;
  margin-top: 4px;
}

.review-card {
  border-radius: 16px;
  overflow: hidden;
}

.review-card-header {
  padding: 16px 22px 13px;
  border-bottom: 1px solid rgba(18, 54, 115, 0.12);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.review-card-label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(22, 66, 139, 0.5);
}

.type-badge {
  display: inline-flex;
  align-items: center;
  background: #eff2f7;
  border: 1px solid #bfd3ff;
  color: #000055;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 20px;
  white-space: nowrap;
}

.meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 28px;
}

.meta-label {
  font-size: 0.67rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: #999999;
  margin-bottom: 2px;
}

.meta-value {
  font-size: 0.875rem;
  font-weight: 600;
}

.description-text {
  font-size: 0.9rem;
  line-height: 1.8;
  white-space: pre-wrap;
}

.decision-tiles {
  display: flex;
  gap: 10px;
  margin-bottom: 8px;
}

.decision-tile {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px 10px;
  border-radius: 12px;
  border: 1.5px solid rgba(18, 54, 115, 0.14);
  background: #fff;
  color: #555555;
  cursor: pointer;
  font-size: 0.82rem;
  font-weight: 600;
  transition: border-color 0.15s, background-color 0.15s, color 0.15s;
}

.decision-tile:hover {
  border-color: rgba(18, 54, 115, 0.3);
}

.decision-tile.positiv.active {
  border-color: #49b812;
  background: rgba(73, 184, 18, 0.09);
  color: #2a6b08;
}

.decision-tile.negativ.active {
  border-color: #d60000;
  background: rgba(214, 0, 0, 0.07);
  color: #d60000;
}

.decision-tile.ruecksprache.active {
  border-color: #16428b;
  background: rgba(22, 66, 139, 0.07);
  color: #16428b;
}

.contact-options {
  border: 1px solid rgba(18, 54, 115, 0.14);
  border-radius: 10px;
  background: #fafbfd;
  padding: 12px 14px 6px;
  margin-bottom: 12px;
}

.contact-options-label {
  font-size: 0.67rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: #999999;
  margin-bottom: 4px;
}

@media (max-width: 560px) {
  .decision-tiles {
    flex-direction: column;
  }
}

.closed-notice {
  padding: 20px 22px;
  font-size: 0.85rem;
  color: #999999;
  text-align: center;
}

@media (max-width: 560px) {
  .meta-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}

.details-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;

  :deep(.q-card) {
    border: 1px solid rgba(18, 54, 115, 0.14);
    box-shadow: none !important;
  }

  :deep(.q-expansion-item__container > .q-item) {
    background: #fafbfd;
  }
}
</style>
