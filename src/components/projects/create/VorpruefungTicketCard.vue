<template>
  <div class="q-mb-md q-pa-md radius-10" style="border: 1px solid #e0e0e0;">
    <div class="row items-center no-wrap">
      <q-icon name="mdi-circle" :color="ticket ? statusColor : 'grey-5'" size="18px" class="q-mr-sm" />
      <div class="col font-16 text-weight-600">
        {{ $t(`projectComponents.aptitude.vorpruefung.${type}`) }}
      </div>
      <q-btn v-if="!ticket" :disable="!recipientEmail" :loading="sending" unelevated no-caps dense
        color="primary" class="q-px-md"
        :label="$t('projectComponents.aptitude.vorpruefung.send')" @click="send" />
      <q-btn v-else-if="!ticket.answeredAt" :loading="sending" unelevated no-caps dense outline color="primary"
        class="q-px-md" :label="$t('projectComponents.aptitude.vorpruefung.resend')" @click="resend" />
    </div>

    <div v-if="!ticket" class="font-14 q-mt-xs" :class="recipientEmail ? 'text-blue-grey-7' : 'text-negative'">
      <template v-if="recipientEmail">
        {{ $t('projectComponents.aptitude.vorpruefung.recipientEmail') }}: {{ recipientEmail }}
      </template>
      <template v-else>
        {{ $t('projectComponents.aptitude.vorpruefung.recipientMissing') }}
      </template>
    </div>

    <div v-if="ticket && ticket.sentAt" class="font-14 text-blue-grey-7 q-mt-xs">
      <template v-if="ticket.reviewerContact">
        {{ $t('projectComponents.aptitude.vorpruefung.recipientEmail') }}: {{ ticket.reviewerContact }}<br />
      </template>
      {{ $t('projectComponents.aptitude.vorpruefung.sentOn') }}: {{ formatDate(ticket.sentAt) }}
      <template v-if="ticket.answeredAt">
        &middot; {{ $t('projectComponents.aptitude.vorpruefung.answeredOn') }}: {{ formatDate(ticket.answeredAt) }}
      </template>
    </div>

    <div v-if="ticket && ticket.answeredAt" class="font-14 q-mt-sm">
      <div>{{ statusLabel }}</div>
      <div v-if="ticket.wantsPhoneCall">{{ $t('projectComponents.aptitude.vorpruefung.wantsPhoneCall') }}</div>
      <div v-if="ticket.wantsOnsiteMeeting">{{ $t('projectComponents.aptitude.vorpruefung.wantsOnsiteMeeting') }}</div>
      <div class="q-mt-xs">{{ ticket.responseText }}</div>
    </div>

    <q-expansion-item dense :label="$t('projectComponents.aptitude.vorpruefung.notesPlaceholder')" class="q-mt-sm">
      <q-input outlined type="textarea" rows="3" class="no-shadow input-radius-6 q-mt-sm" v-model="notes"
        :disable="!!(ticket && ticket.answeredAt)" @blur="saveNotes" />
    </q-expansion-item>
  </div>
</template>

<script>
export default {
  name: "VorpruefungTicketCard",
  props: {
    type: {
      type: String,
      required: true,
      validator: (v) => ["finanzen", "personal", "foerdermittelgeber"].includes(v)
    },
    projectId: {
      type: Number,
      required: true
    },
    ticket: {
      type: Object,
      default: null
    },
    recipientEmail: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      sending: false,
      notes: this.ticket ? this.ticket.notes || "" : ""
    };
  },
  watch: {
    ticket(newTicket) {
      this.notes = newTicket ? newTicket.notes || "" : "";
    }
  },
  computed: {
    statusColor() {
      if (!this.ticket.answeredAt) return "orange";
      if (this.ticket.status === "positiv") return "green";
      return "red";
    },
    statusLabel() {
      if (this.ticket.status === "positiv") return this.$t("projectComponents.aptitude.vorpruefung.statusPositiv");
      if (this.ticket.status === "negativ") return this.$t("projectComponents.aptitude.vorpruefung.statusNegativ");
      return this.$t("projectComponents.aptitude.vorpruefung.statusRuecksprache");
    }
  },
  methods: {
    formatDate(value) {
      return new Date(value).toLocaleDateString("de-DE");
    },
    async send() {
      this.sending = true;
      const created = await this.$store.dispatch("project/createVorpruefungTicket", {
        projectId: this.projectId,
        type: this.type,
        notes: this.notes
      });
      this.sending = false;
      if (created) {
        this.$emit("ticket-created");
      }
    },
    async resend() {
      this.sending = true;
      await this.$store.dispatch("project/resendVorpruefungTicket", { id: this.ticket.id });
      this.sending = false;
      this.$emit("ticket-created");
    },
    async saveNotes() {
      if (this.ticket && !this.ticket.answeredAt) {
        await this.$store.dispatch("project/updateVorpruefungTicketNotes", {
          id: this.ticket.id,
          notes: this.notes
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
