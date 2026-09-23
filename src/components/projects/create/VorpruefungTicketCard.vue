<template>
  <div class="q-mb-md q-pa-md radius-10" style="border: 1px solid #e0e0e0;">
    <div class="row items-center no-wrap">
      <q-icon name="mdi-circle" :color="ticket ? statusColor : 'grey-5'" size="18px" class="q-mr-sm" />
      <div class="col font-16 text-weight-600">
        {{ $t(`projectComponents.aptitude.vorpruefung.${type}`) }}
      </div>
      <q-btn v-if="!ticket && canEdit" :disable="!recipientEmail" :loading="sending" unelevated no-caps dense
        color="primary" class="q-px-md"
        :label="$t('projectComponents.aptitude.vorpruefung.send')" @click="send" />
      <q-btn v-else-if="canResend" :loading="sending" unelevated no-caps dense outline color="primary"
        class="q-px-md" :label="resendLabel" @click="resend" />
      <q-btn v-if="canOverride" flat no-caps dense color="primary" class="q-ml-sm"
        icon="mdi-shield-account" :label="$t('projectComponents.aptitude.vorpruefung.override')"
        @click="showOverrideDialog = true" />
    </div>

    <div v-if="!ticket" class="font-14 q-mt-xs" :class="recipientEmail ? 'text-blue-grey-7' : 'text-negative'">
      <template v-if="recipientEmail">
        {{ $t('projectComponents.aptitude.vorpruefung.recipientEmail') }}: {{ recipientEmail }}
      </template>
      <template v-else>
        {{ $t('projectComponents.aptitude.vorpruefung.recipientMissing') }}
      </template>
    </div>

    <div v-if="ticket && (ticket.sentAt || ticket.answeredAt)" class="font-14 text-blue-grey-7 q-mt-xs">
      <template v-if="ticket.reviewerContact">
        {{ $t('projectComponents.aptitude.vorpruefung.recipientEmail') }}: {{ ticket.reviewerContact }}<br />
      </template>
      <template v-if="ticket.sentAt">
        {{ $t('projectComponents.aptitude.vorpruefung.sentOn') }}: {{ formatDate(ticket.sentAt) }}
      </template>
      <template v-if="ticket.sentAt && ticket.answeredAt">&middot;</template>
      <template v-if="ticket.answeredAt">
        {{ $t('projectComponents.aptitude.vorpruefung.answeredOn') }}: {{ formatDate(ticket.answeredAt) }}
      </template>
    </div>

    <div v-if="ticket && ticket.answeredAt" class="font-14 q-mt-sm">
      <div>{{ statusLabel }}</div>
      <div v-if="ticket.overriddenAt" class="text-blue-grey-7">
        {{ ticket.overriddenBy && ticket.overriddenBy.username
          ? $t('projectComponents.aptitude.vorpruefung.overriddenBy', { user: ticket.overriddenBy.username })
          : $t('projectComponents.aptitude.vorpruefung.overriddenByUnknown') }}
      </div>
      <div v-if="ticket.wantsPhoneCall">{{ $t('projectComponents.aptitude.vorpruefung.wantsPhoneCall') }}</div>
      <div v-if="ticket.wantsOnsiteMeeting">{{ $t('projectComponents.aptitude.vorpruefung.wantsOnsiteMeeting') }}</div>
      <div v-if="ticket.suggestedDates && ticket.suggestedDates.length">
        {{ $t('projectComponents.aptitude.vorpruefung.suggestedDates') }}:
        {{ ticket.suggestedDates.map(formatDateTime).join(', ') }}
      </div>
      <div class="q-mt-xs">{{ ticket.responseText }}</div>
    </div>

    <q-expansion-item dense :label="$t('projectComponents.aptitude.vorpruefung.notesPlaceholder')" class="q-mt-sm">
      <q-input outlined type="textarea" rows="3" class="no-shadow input-radius-6 q-mt-sm" v-model="notes"
        :disable="!canEdit || !!(ticket && ticket.answeredAt)" @blur="saveNotes" />
    </q-expansion-item>

    <q-expansion-item v-if="history.length" dense class="q-mt-sm"
      :label="$t('projectComponents.aptitude.vorpruefung.historyTitle', { count: history.length })">
      <div v-for="entry in history" :key="entry.id" class="q-mt-sm q-pa-sm radius-6 bg-blue-grey-1">
        <div class="row items-center no-wrap">
          <q-icon name="mdi-circle" :color="statusColorFor(entry, 'grey-5')" size="14px" class="q-mr-sm" />
          <div class="col font-14 text-weight-600">
            {{ $t('projectComponents.aptitude.vorpruefung.attemptLabel', { number: entry.attempt || 1 }) }}
          </div>
          <div class="font-13 text-blue-grey-7">
            {{ $t(`projectComponents.aptitude.vorpruefung.superseded_${entry.supersededReason}`) }}
          </div>
        </div>
        <div v-if="entry.reviewerContact" class="font-13 text-blue-grey-7 q-pl-lg">
          {{ $t('projectComponents.aptitude.vorpruefung.recipientEmail') }}: {{ entry.reviewerContact }}
        </div>
        <div class="font-13 text-blue-grey-7 q-pl-lg">
          <template v-if="entry.sentAt">
            {{ $t('projectComponents.aptitude.vorpruefung.sentOn') }}: {{ formatDate(entry.sentAt) }}
          </template>
          <template v-if="entry.sentAt && entry.answeredAt">&middot;</template>
          <template v-if="entry.answeredAt">
            {{ $t('projectComponents.aptitude.vorpruefung.answeredOn') }}: {{ formatDate(entry.answeredAt) }}
          </template>
        </div>
        <div v-if="entry.answeredAt" class="font-14 q-pl-lg q-mt-xs">
          <div>{{ statusLabelFor(entry) }}</div>
          <div v-if="entry.overriddenAt" class="text-blue-grey-7">
            {{ entry.overriddenBy && entry.overriddenBy.username
              ? $t('projectComponents.aptitude.vorpruefung.overriddenBy', { user: entry.overriddenBy.username })
              : $t('projectComponents.aptitude.vorpruefung.overriddenByUnknown') }}
          </div>
          <div v-if="entry.wantsPhoneCall">{{ $t('projectComponents.aptitude.vorpruefung.wantsPhoneCall') }}</div>
          <div v-if="entry.wantsOnsiteMeeting">{{ $t('projectComponents.aptitude.vorpruefung.wantsOnsiteMeeting') }}</div>
          <div v-if="entry.suggestedDates && entry.suggestedDates.length">
            {{ $t('projectComponents.aptitude.vorpruefung.suggestedDates') }}:
            {{ entry.suggestedDates.map(formatDateTime).join(', ') }}
          </div>
          <div class="q-mt-xs">{{ entry.responseText }}</div>
        </div>
      </div>
    </q-expansion-item>

    <VorpruefungOverrideDialog v-if="canOverride" :modelValue="showOverrideDialog" :project-id="projectId" :type="type"
      @update:modelValue="showOverrideDialog = $event" @overridden="$emit('ticket-created')" />
  </div>
</template>

<script>
import VorpruefungOverrideDialog from "src/components/dialogs/VorpruefungOverrideDialog.vue";

export default {
  name: "VorpruefungTicketCard",
  components: { VorpruefungOverrideDialog },
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
    tickets: {
      type: Array,
      default: () => []
    },
    recipientEmail: {
      type: String,
      default: null
    },
    canEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      sending: false,
      notes: "",
      showOverrideDialog: false
    };
  },
  watch: {
    ticket: {
      immediate: true,
      handler(newTicket) {
        this.notes = newTicket ? newTicket.notes || "" : "";
      }
    }
  },
  computed: {
    ticket() {
      return this.tickets.find(t => !t.supersededAt) || null;
    },
    history() {
      return this.tickets.filter(t => !!t.supersededAt);
    },
    resendLabel() {
      return this.ticket && this.ticket.answeredAt
        ? this.$t('projectComponents.aptitude.vorpruefung.reAsk')
        : this.$t('projectComponents.aptitude.vorpruefung.resend');
    },
    canResend() {
      if (!this.ticket || !this.canEdit) return false;
      if (!this.ticket.answeredAt) return true;
      return this.ticket.status !== "positiv";
    },
    statusColor() {
      return this.statusColorFor(this.ticket, "orange");
    },
    statusLabel() {
      return this.statusLabelFor(this.ticket);
    },
    // Admins may record a decision without asking anyone, as long as the
    // review is not already positive.
    canOverride() {
      if (!this.$store.getters["userCenter/isAdmin"]) return false;
      return !(this.ticket && this.ticket.answeredAt && this.ticket.status === "positiv");
    }
  },
  methods: {
    statusColorFor(ticket, unansweredColor) {
      if (!ticket.answeredAt) return unansweredColor;
      if (ticket.status === "positiv") return "green";
      if (ticket.status === "ruecksprache") return "orange";
      return "red";
    },
    statusLabelFor(ticket) {
      if (ticket.status === "positiv") return this.$t("projectComponents.aptitude.vorpruefung.statusPositiv");
      if (ticket.status === "negativ") return this.$t("projectComponents.aptitude.vorpruefung.statusNegativ");
      return this.$t("projectComponents.aptitude.vorpruefung.statusRuecksprache");
    },
    formatDate(value) {
      return new Date(value).toLocaleDateString("de-DE");
    },
    formatDateTime(value) {
      return new Date(value).toLocaleString("de-DE", { dateStyle: "medium", timeStyle: "short" });
    },
    async send() {
      this.sending = true;
      let created;
      try {
        created = await this.$store.dispatch("project/createVorpruefungTicket", {
          projectId: this.projectId,
          type: this.type,
          notes: this.notes
        });
      } finally {
        this.sending = false;
      }
      if (created) {
        this.$emit("ticket-created");
      }
    },
    async resend() {
      this.sending = true;
      try {
        await this.$store.dispatch("project/resendVorpruefungTicket", { id: this.ticket.id });
      } finally {
        this.sending = false;
      }
      this.$emit("ticket-created");
    },
    async saveNotes() {
      if (this.canEdit && this.ticket && !this.ticket.answeredAt) {
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
