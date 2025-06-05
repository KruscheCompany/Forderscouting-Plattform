<template>
  <q-page class="bg-blue-1">
    <div class="container">
      <div class="row">
        <div class="col-12 text-center">
          <h1 class="font-50 text-weight-600">{{ $t("dataProtectionDeclaration") }}</h1>
        </div>
        <div class="col-12 q-mb-xl privacyPolicy">
          <p>
            {{ $t("privacyPolicy.responsibleParty") }}
          </p>
          <p class="font-16">{{ $t("privacyPolicy.amtVioel") }}</p>
          <p class="font-16">{{ $t("privacyPolicy.mayor") }}</p>
          <p class="font-16">{{ $t("privacyPolicy.address") }}</p>
          <p class="font-16">{{ $t("privacyPolicy.postalCode") }}</p>
          <ul>
            <li>{{ $t("privacyPolicy.phone") }}</li>
            <li>{{ $t("privacyPolicy.fax") }}</li>
            <li>{{ $t("privacyPolicy.email") }}</li>
          </ul>
          <h2>{{ $t("privacyPolicy.dataSubjectRights") }}</h2>
          <p>
            {{ $t("privacyPolicy.contactDataProtectionOfficer") }}
          </p>
          <ul>
            <li>
              {{ $t("privacyPolicy.rightToInformation") }}
            </li>
            <li>{{ $t("privacyPolicy.rightToCorrection") }}</li>
            <li>{{ $t("privacyPolicy.rightToDeletion") }}</li>
            <li>
              {{ $t("privacyPolicy.rightToRestriction") }}
            </li>
            <li>
              {{ $t("privacyPolicy.rightToObjection") }}
            </li>
            <li>
              {{ $t("privacyPolicy.rightToDataPortability") }}
            </li>
          </ul>
          <p>
            {{ $t("privacyPolicy.consentRevocation") }}
          </p>
          <p>
            {{ $t("privacyPolicy.complaintRight") }}
          </p>
          <p>
            {{ $t("privacyPolicy.supervisoryAuthorityList") }}
            <a
              :href="$t('privacyPolicy.supervisoryAuthorityLink')"
              target="_blank"
              rel="noopener nofollow"
              >{{ $t("privacyPolicy.supervisoryAuthorityLink") }}</a
            >.
          </p>
          <p></p>
          <h2>{{ $t("privacyPolicy.generalInfoCollection") }}</h2>
          <h3>{{ $t("privacyPolicy.typeAndPurpose") }}</h3>
          <p>
            {{ $t("privacyPolicy.automaticInfoCollection") }}
          </p>
          <p>{{ $t("privacyPolicy.processingPurposes") }}</p>
          <ul>
            <li>{{ $t("privacyPolicy.connectionEstablishment") }}</li>
            <li>{{ $t("privacyPolicy.smoothUsage") }}</li>
            <li>{{ $t("privacyPolicy.systemSecurity") }}</li>
            <li>{{ $t("privacyPolicy.websiteOptimization") }}</li>
          </ul>
          <p>
            {{ $t("privacyPolicy.noPersonalConclusions") }}
          </p>
          <h3>{{ $t("privacyPolicy.legalBasisInterest") }}</h3>
          <p>
            {{ $t("privacyPolicy.legalBasisText") }}
          </p>
          <h3>{{ $t("privacyPolicy.recipients") }}</h3>
          <p>
            {{ $t("privacyPolicy.technicalServiceProviders") }}
          </p>
          <p></p>
          <h3>{{ $t("privacyPolicy.storageDuration") }}</h3>
          <p>
            {{ $t("privacyPolicy.sessionBasedDeletion") }}
          </p>
          <p>
            {{ $t("privacyPolicy.logFileStorage") }}
          </p>
          <p></p>
          <h3>{{ $t("privacyPolicy.provisionRequired") }}</h3>
          <p>
            {{ $t("privacyPolicy.ipAddressNecessity") }}
          </p>
          <p></p>
          <h2>{{ $t("privacyPolicy.cookiesTitle") }}</h2>
          <p>
            {{ $t("privacyPolicy.cookiesDescription") }}
          </p>
          <p>
            {{ $t("privacyPolicy.cookieManagement") }}
          </p>
          <ul>
            <li>
              {{ $t("privacyPolicy.mozillaFirefox") }}
              <a
                href="https://support.mozilla.org/de/kb/cookies-loeschen-daten-von-websites-entfernen"
                target="_blank"
                rel="nofollow noopener"
                >https://support.mozilla.org/de/kb/cookies-loeschen-daten-von-websites-entfernen</a
              >
            </li>
            <li>
              {{ $t("privacyPolicy.internetExplorer") }}
              <a
                href="https://support.microsoft.com/de-de/help/17442/windows-internet-explorer-delete-manage-cookies"
                target="_blank"
                rel="nofollow noopener"
                >https://support.microsoft.com/de-de/help/17442/windows-internet-explorer-delete-manage-cookies</a
              >
            </li>
            <li>
              {{ $t("privacyPolicy.googleChrome") }}
              <a
                href="https://support.google.com/accounts/answer/61416?hl=de"
                target="_blank"
                rel="nofollow noopener"
                >https://support.google.com/accounts/answer/61416?hl=de</a
              >
            </li>
            <li>
              {{ $t("privacyPolicy.opera") }}
              <a
                href="http://www.opera.com/de/help"
                target="_blank"
                rel="nofollow noopener"
                >http://www.opera.com/de/help</a
              >
            </li>
            <li>
              {{ $t("privacyPolicy.safari") }}
              <a
                href="https://support.apple.com/kb/PH17191?locale=de_DE&viewlocale=de_DE"
                target="_blank"
                rel="nofollow noopener"
                >https://support.apple.com/kb/PH17191?locale=de_DE&viewlocale=de_DE</a
              >
            </li>
          </ul>
          <h3>{{ $t("privacyPolicy.cookieStorageDuration") }}</h3>
          <p>
            {{ $t("privacyPolicy.cookieUsageDescription") }}
          </p>
          <p>
            {{ $t("privacyPolicy.cookieDetails") }}
            <br />{{ $t("privacyPolicy.localStorageDetails") }} <br />{{
              $t("privacyPolicy.sessionStorageDetails")
            }}
          </p>
          <h2>{{ $t("privacyPolicy.technicalCookies") }}</h2>
          <h3>{{ $t("privacyPolicy.typeAndPurpose") }}</h3>
          <p>
            {{ $t("privacyPolicy.technicalCookiesDescription") }}
          </p>
          <p>
            {{ $t("privacyPolicy.technicalCookiesPurpose") }}
          </p>
          <h3>{{ $t("privacyPolicy.legalBasisInterest") }}</h3>
          <p>
            {{ $t("privacyPolicy.technicalCookiesLegalBasis") }}
          </p>
          <h3>{{ $t("privacyPolicy.recipients") }}</h3>
          <p>
            {{ $t("privacyPolicy.technicalCookiesRecipients") }}
          </p>
          <p></p>
          <h3>{{ $t("privacyPolicy.provisionRequired") }}</h3>
          <p>
            {{ $t("privacyPolicy.technicalCookiesProvision") }}
          </p>
          <h3>{{ $t("privacyPolicy.objectionTitle") }}</h3>
          <p>
            {{ $t("privacyPolicy.objectionText") }}
          </p>
          <p></p>
          <h2>{{ $t("privacyPolicy.registrationTitle") }}</h2>
          <h3>{{ $t("privacyPolicy.typeAndPurpose") }}</h3>
          <p>
            {{ $t("privacyPolicy.registrationDescription") }}
          </p>
          <p>{{ $t("privacyPolicy.registrationDataCollected") }}</p>
          <p>{{ $t("privacyPolicy.registrationDataTypes") }}</p>
          <p>
            {{ $t("privacyPolicy.registrationPurpose") }}
          </p>
          <h3>{{ $t("privacyPolicy.legalBasisInterest") }}</h3>
          <p>
            {{ $t("privacyPolicy.registrationLegalBasis") }}
          </p>
          <h3>{{ $t("privacyPolicy.recipients") }}</h3>
          <p>
            {{ $t("privacyPolicy.registrationRecipients") }}
          </p>
          <p></p>
          <h3>{{ $t("privacyPolicy.storageDuration") }}</h3>
          <p>
            {{ $t("privacyPolicy.registrationStorageDuration") }}
          </p>
          <h3>{{ $t("privacyPolicy.provisionRequired") }}</h3>
          <p>
            {{ $t("privacyPolicy.registrationProvision") }}
          </p>
          <p></p>
          <h2>{{ $t("privacyPolicy.commentFunctionTitle") }}</h2>
          <h3>{{ $t("privacyPolicy.typeAndPurpose") }}</h3>
          <p>
            {{ $t("privacyPolicy.commentFunctionDescription") }}
          </p>
          <h3>{{ $t("privacyPolicy.legalBasisInterest") }}</h3>
          <p>
            {{ $t("privacyPolicy.commentFunctionLegalBasis") }}
          </p>
          <p>
            {{ $t("privacyPolicy.commentFunctionPurpose") }}
          </p>
          <h3>{{ $t("privacyPolicy.recipients") }}</h3>
          <p>{{ $t("privacyPolicy.commentFunctionRecipients") }}</p>
          <p></p>
          <h3>{{ $t("privacyPolicy.storageDuration") }}</h3>
          <p>
            {{ $t("privacyPolicy.commentFunctionStorageDuration") }}
          </p>
          <p>
            {{ $t("privacyPolicy.commentDeletion") }}
          </p>
          <h3>{{ $t("privacyPolicy.provisionRequired") }}</h3>
          <p>
            {{ $t("privacyPolicy.commentFunctionProvision") }}
          </p>
          <p></p>
          <h2>{{ $t("privacyPolicy.newsletterTitle") }}</h2>
          <h3>{{ $t("privacyPolicy.typeAndPurpose") }}</h3>
          <p>
            {{ $t("privacyPolicy.newsletterDescription") }}
          </p>
          <p>
            {{ $t("privacyPolicy.newsletterDoubleOptIn") }}
          </p>
          <h3>{{ $t("privacyPolicy.legalBasisInterest") }}</h3>
          <p>
            {{ $t("privacyPolicy.newsletterLegalBasis") }}
          </p>
          <p>
            {{ $t("privacyPolicy.newsletterRevocation") }}
          </p>
          <h3>{{ $t("privacyPolicy.recipients") }}</h3>
          <p>{{ $t("privacyPolicy.newsletterRecipients") }}</p>
          <p></p>
          <h3>{{ $t("privacyPolicy.storageDuration") }}</h3>
          <p>
            {{ $t("privacyPolicy.newsletterStorageDuration") }}
          </p>
          <h3>{{ $t("privacyPolicy.provisionRequired") }}</h3>
          <p>
            {{ $t("privacyPolicy.newsletterProvision") }}
          </p>
          <h3>{{ $t("privacyPolicy.newsletterRevocationRights") }}</h3>
          <p>
            {{ $t("privacyPolicy.newsletterRevocationRights") }}
          </p>
          <p></p>
          <h2>{{ $t("privacyPolicy.googleWebfontsTitle") }}</h2>
          <p>
            {{ $t("privacyPolicy.googleWebfontsDescription") }}
          </p>
          <p>
            {{ $t("privacyPolicy.googleWebfontsInfo") }}
            <a
              :href="$t('privacyPolicy.googleWebfontsLink')"
              rel="noopener nofollow"
              target="_blank"
              >{{ $t("privacyPolicy.googleWebfontsLink") }}</a
            >
            {{ $t("privacyPolicy.googleWebfontsPrivacy") }}
            <a
              :href="$t('privacyPolicy.googlePrivacyLink')"
              rel="noopener nofollow"
              target="_blank"
              >{{ $t("privacyPolicy.googlePrivacyLink") }}</a
            >.
          </p>
          <p></p>
          <h2>{{ $t("privacyPolicy.sslEncryptionTitle") }}</h2>
          <p>
            {{ $t("privacyPolicy.sslEncryptionDescription") }}
          </p>
          <p></p>
          <hr />
          <h2>{{ $t("privacyPolicy.objectionRightTitle") }}</h2>
          <h3>{{ $t("privacyPolicy.individualObjectionTitle") }}</h3>
          <p>
            {{ $t("privacyPolicy.objectionRightDescription") }}
          </p>
          <p>
            {{ $t("privacyPolicy.objectionConsequences") }}
          </p>
          <h3>{{ $t("privacyPolicy.objectionRecipientTitle") }}</h3>
          <p>{{ $t("privacyPolicy.dataProtectionOfficer") }}</p>
          <hr />
          <h2>{{ $t("privacyPolicy.policyChangesTitle") }}</h2>
          <p>
            {{ $t("privacyPolicy.policyChangesDescription") }}
          </p>
          <h2>{{ $t("privacyPolicy.questionsToOfficerTitle") }}</h2>
          <p>
            {{ $t("privacyPolicy.questionsToOfficerDescription") }}
          </p>
          <p>{{ $t("privacyPolicy.dataProtectionOfficerContact") }}</p>
          <p>
            <em
              >{{ $t("privacyPolicy.activeMindAttribution") }}
              <a
                :href="$t('privacyPolicy.activeMindLink')"
                target="_blank"
                rel="noopener"
                >{{ $t("privacyPolicy.externalDataProtectionOfficer") }}</a
              >
              {{ $t("privacyPolicy.versionInfo") }}</em
            >
          </p>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "datenschutzerklaerung",
  data() {
    return {};
  },
};
</script>

<style lang="scss">
.privacyPolicy > p {
  font-size: 16px;
}
.privacyPolicy > h1,
h2,
h3 {
  font-size: 28px;
  font-weight: 500;
  margin-bottom: 8px;
}
</style>
