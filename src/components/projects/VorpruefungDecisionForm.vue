<template>
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
        <div v-if="attemptedSubmit && contactOptionMissing" class="contact-options-error">
          {{ $t('reviewPage.contactOptionRequired') }}
        </div>

        <div class="contact-options-label q-mt-sm">{{ $t('reviewPage.suggestedDatesLabel') }}</div>
        <div v-for="(slot, index) in suggestedDates" :key="index" class="row q-col-gutter-sm q-mt-xs items-start">
          <div class="col">
            <q-input outlined readonly class="no-shadow input-radius-6"
              :value="slotDateDisplay(slot)" :label="$t('reviewPage.preferredDateLabel')"
              :error="attemptedSubmit && preferredContactAtMissing"
              @click="$refs['dateProxy' + index][0].show()">
              <template v-slot:append>
                <q-icon name="event" color="blue-5" class="cursor-pointer">
                  <q-popup-proxy :ref="'dateProxy' + index" transition-show="scale" transition-hide="scale">
                    <q-date v-model="slot.date" mask="YYYY-MM-DD" first-day-of-week="1"
                      :locale="datepickerLocale" @input="$refs['dateProxy' + index][0].hide()">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup no-caps :label="$t('Close')" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-narrow" style="width: 110px;">
            <q-input outlined readonly class="no-shadow input-radius-6"
              v-model="slot.time" :label="$t('reviewPage.preferredTimeLabel')"
              :error="attemptedSubmit && preferredContactAtMissing"
              @click="$refs['timeProxy' + index][0].show()">
              <template v-slot:append>
                <q-icon name="access_time" color="blue-5" class="cursor-pointer">
                  <q-popup-proxy :ref="'timeProxy' + index" transition-show="scale" transition-hide="scale">
                    <q-time v-model="slot.time" mask="HH:mm" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup no-caps :label="$t('Close')" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-auto">
            <q-btn v-if="suggestedDates.length > 1" flat round dense icon="close" color="grey-7"
              class="q-mt-xs" @click="removeDateSlot(index)" />
          </div>
        </div>
        <div v-if="attemptedSubmit && preferredContactAtMissing" class="contact-options-error">
          {{ $t('reviewPage.preferredDateTimeRequired') }}
        </div>
        <q-btn v-if="suggestedDates.length < maxSuggestedDates" flat no-caps dense color="primary"
          icon="add" class="q-mt-xs" :label="$t('reviewPage.addDate')" @click="addDateSlot" />
      </div>
    </q-slide-transition>

    <q-input outlined type="textarea" rows="5" class="no-shadow input-radius-6 q-mt-md"
      v-model="responseText" :label="$t('reviewPage.responseTextLabel')"
      :rules="[val => !!val || $t('Required')]" />

    <q-btn type="submit" unelevated no-caps color="primary" class="q-mt-md full-width" :loading="submitting"
      :label="submitLabel || $t('reviewPage.submit')" />
  </q-form>
</template>

<script>
import { date } from "quasar";

export default {
  name: "VorpruefungDecisionForm",
  props: {
    submitting: {
      type: Boolean,
      default: false
    },
    submitLabel: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      decisionType: "positiv",
      wantsPhoneCall: false,
      wantsOnsiteMeeting: false,
      suggestedDates: [{ date: "", time: "" }],
      maxSuggestedDates: 5,
      attemptedSubmit: false,
      responseText: ""
    };
  },
  watch: {
    decisionType(value) {
      if (value !== "ruecksprache") {
        this.wantsPhoneCall = false;
        this.wantsOnsiteMeeting = false;
        this.suggestedDates = [{ date: "", time: "" }];
        this.attemptedSubmit = false;
      }
    }
  },
  computed: {
    contactOptionMissing() {
      return this.decisionType === "ruecksprache" && !this.wantsPhoneCall && !this.wantsOnsiteMeeting;
    },
    completedSuggestedDates() {
      return this.suggestedDates
        .filter((slot) => slot.date && slot.time)
        .map((slot) => `${slot.date} ${slot.time}`);
    },
    preferredContactAtMissing() {
      return this.decisionType === "ruecksprache" && this.completedSuggestedDates.length < 1;
    },
    datepickerLocale() {
      return {
        days: [
          this.$t("Sunday"), this.$t("Monday"), this.$t("Tuesday"), this.$t("Wednesday"),
          this.$t("Thursday"), this.$t("Friday"), this.$t("Saturday")
        ],
        daysShort: [
          this.$t("Sun"), this.$t("Mon"), this.$t("Tue"), this.$t("Wed"),
          this.$t("Thu"), this.$t("Fri"), this.$t("Sat")
        ],
        months: [
          this.$t("January"), this.$t("February"), this.$t("March"), this.$t("April"),
          this.$t("May"), this.$t("June"), this.$t("July"), this.$t("August"),
          this.$t("September"), this.$t("October"), this.$t("November"), this.$t("December")
        ],
        monthsShort: [
          this.$t("Jan"), this.$t("Feb"), this.$t("Mar"), this.$t("Apr"),
          this.$t("May"), this.$t("Jun"), this.$t("Jul"), this.$t("Aug"),
          this.$t("Sep"), this.$t("Oct"), this.$t("Nov"), this.$t("Dec")
        ]
      };
    },
    decisionOptions() {
      return [
        { label: this.$t("reviewPage.decisionPositiv"), value: "positiv", icon: "check_circle" },
        { label: this.$t("reviewPage.decisionNegativ"), value: "negativ", icon: "cancel" },
        { label: this.$t("reviewPage.decisionRuecksprache"), value: "ruecksprache", icon: "forum" }
      ];
    }
  },
  methods: {
    slotDateDisplay(slot) {
      if (!slot.date) return "";
      return date.formatDate(new Date(slot.date), "DD.MM.YYYY");
    },
    addDateSlot() {
      if (this.suggestedDates.length < this.maxSuggestedDates) {
        this.suggestedDates.push({ date: "", time: "" });
      }
    },
    removeDateSlot(index) {
      if (this.suggestedDates.length > 1) {
        this.suggestedDates.splice(index, 1);
      }
    },
    submit() {
      this.attemptedSubmit = true;
      if (!this.responseText) return;
      if (this.contactOptionMissing || this.preferredContactAtMissing) return;

      this.$emit("submit", {
        decisionType: this.decisionType,
        responseText: this.responseText,
        wantsPhoneCall: this.wantsPhoneCall,
        wantsOnsiteMeeting: this.wantsOnsiteMeeting,
        suggestedDates: this.decisionType === "ruecksprache" ? this.completedSuggestedDates : null
      });
    }
  }
};
</script>

<style lang="scss" scoped>
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

.contact-options-error {
  font-size: 0.75rem;
  color: #d60000;
  margin-top: 2px;
  margin-bottom: 4px;
}

@media (max-width: 560px) {
  .decision-tiles {
    flex-direction: column;
  }
}
</style>
