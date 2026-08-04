<template>
  <q-page class="q-pa-lg flex flex-center" style="min-height: 100vh;">
    <div style="max-width: 720px; width: 100%;">
      <div v-if="loading" class="text-center">{{ $t('reviewPage.loading') }}</div>

      <q-banner v-else-if="invalid" rounded class="bg-negative text-white">
        {{ $t('reviewPage.invalidLink') }}
      </q-banner>

      <q-banner v-else-if="alreadyAnswered" rounded class="bg-grey-3">
        {{ $t('reviewPage.alreadyAnswered', { date: answeredAtFormatted }) }}
      </q-banner>

      <q-banner v-else-if="submitted" rounded class="bg-positive text-white">
        {{ $t('reviewPage.submitSuccess') }}
      </q-banner>

      <div v-else-if="project">
        <q-card class="shadow-1 radius-20 q-mb-md">
          <q-card-section>
            <h4 class="font-24 q-mt-none q-mb-md">{{ project.title }}</h4>

            <ProjectContentDetails :project="project" current-tab="project" />
            <ProjectFundingCheck :project="project" current-tab="fundingCheck" />
            <ProjectQAndA :project="project" current-tab="qAndA" />

            <ProjectPrint :project="project" ref="printRef" />
            <q-btn outline no-caps color="primary" :label="$t('reviewPage.downloadPdf')"
              @click="$refs.printRef.$refs.html2Pdf.generatePdf()" />
          </q-card-section>
        </q-card>

        <q-card class="shadow-1 radius-20">
          <q-card-section>
            <h6 class="font-16 q-mb-sm">{{ $t('reviewPage.decisionLabel') }}</h6>
            <q-form @submit="submit">
              <q-option-group v-model="decisionType" type="radio" :options="decisionOptions" />

              <q-checkbox v-model="wantsPhoneCall" :label="$t('reviewPage.wantsPhoneCall')" />
              <q-checkbox v-model="wantsOnsiteMeeting" :label="$t('reviewPage.wantsOnsiteMeeting')" />

              <q-input outlined type="textarea" rows="5" class="no-shadow input-radius-6 q-mt-md"
                v-model="responseText" :label="$t('reviewPage.responseTextLabel')"
                :rules="[val => !!val || $t('Required')]" />

              <q-btn type="submit" unelevated no-caps color="primary" class="q-mt-md full-width"
                :loading="submitting" :label="$t('reviewPage.submit')" />
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { api } from "boot/axios";
import ProjectPrint from "src/components/projects/view/ProjectPrint.vue";
import ProjectContentDetails from "src/components/projects/view/ProjectContentDetails.vue";
import ProjectFundingCheck from "src/components/projects/view/ProjectFundingCheck.vue";
import ProjectQAndA from "src/components/projects/view/ProjectQAndA.vue";

export default {
  name: "ReviewProject",
  components: { ProjectPrint, ProjectContentDetails, ProjectFundingCheck, ProjectQAndA },
  data() {
    return {
      loading: true,
      invalid: false,
      alreadyAnswered: false,
      answeredAtFormatted: "",
      submitted: false,
      submitting: false,
      project: null,
      decisionType: "positiv",
      wantsPhoneCall: false,
      wantsOnsiteMeeting: false,
      responseText: ""
    };
  },
  computed: {
    decisionOptions() {
      return [
        { label: this.$t("reviewPage.decisionPositiv"), value: "positiv" },
        { label: this.$t("reviewPage.decisionNegativ"), value: "negativ" },
        { label: this.$t("reviewPage.decisionRuecksprache"), value: "ruecksprache" }
      ];
    }
  },
  methods: {
    async load() {
      try {
        const res = await api.get(`/api/vorpruefung-tickets/by-token/${this.$route.params.token}`);
        const data = res.data;
        if (data.alreadyAnswered) {
          this.alreadyAnswered = true;
          this.answeredAtFormatted = new Date(data.answeredAt).toLocaleDateString("de-DE");
        } else {
          this.project = data.project;
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

<style lang="scss" scoped></style>
