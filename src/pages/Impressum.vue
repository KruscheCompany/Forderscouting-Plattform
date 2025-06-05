<template>
  <q-page class="bg-blue-1">
    <div class="container">
      <div class="row">
        <div class="col-12 text-center">
          <h1 class="font-50 text-weight-600">{{ $t("imprint") }}</h1>
        </div>
        <div class="col-12 q-mb-xl">
          <p class="font-16">{{ $t("impressum.tmgStatement") }}</p>
          <h2 class="font-28 text-weight-medium q-mb-sm">{{ $t("impressum.contentResponsible") }}</h2>
          <p class="font-16">{{ $t("impressum.amtVioel") }}</p>
          <p class="font-16">{{ $t("impressum.mayor") }}</p>
          <p class="font-16">{{ $t("impressum.address1") }}</p>
          <p class="font-16">{{ $t("impressum.postalCode") }}</p>
          <ul>
            <li>{{ $t("impressum.phone") }}</li>
            <li>{{ $t("impressum.fax") }}</li>
            <li>{{ $t("impressum.email") }}</li>
          </ul>
          <h2 class="font-28 text-weight-medium q-mb-sm">{{ $t("impressum.legalNotices") }}</h2>
          <p class="font-16">{{ $t("impressum.amtVioel") }}</p>
          <p class="font-16">{{ $t("impressum.mayor") }}</p>
          <p class="font-16">{{ $t("impressum.address1") }}</p>
          <p class="font-16">{{ $t("impressum.postalCode") }}</p>
          <ul>
            <li>{{ $t("impressum.phone") }}</li>
            <li>{{ $t("impressum.fax") }}</li>
            <li>{{ $t("impressum.email") }}</li>
          </ul>
          <h2 class="font-28 text-weight-medium q-mb-sm">
            {{ $t("impressum.operationProgrammingDesign") }}
          </h2>
          <p class="font-16">{{ $t("impressum.website") }}</p>
          <p class="font-16">{{ $t("impressum.company") }}</p>
          <p class="font-16">{{ $t("impressum.companyAddress1") }}</p>
          <p class="font-16">{{ $t("impressum.companyAddress2") }}</p>
          <p class="font-16">{{ $t("impressum.country") }}</p>
          <p class="font-16">{{ $t("impressum.companyPhone") }}</p>
          <p class="font-16">{{ $t("impressum.companyEmail") }}</p>
          <h2 class="font-28 text-weight-medium q-mb-sm">{{ $t("impressum.disclaimer") }}</h2>
          <p class="font-16">{{ $t("impressum.onlineContentTitle") }}</p>
          <p class="font-16">
            {{ $t("impressum.onlineContentText") }}
          </p>
          <p class="font-16">
            {{ $t("impressum.offersText") }}
          </p>
          <p class="font-16">{{ $t("impressum.linksTitle") }}</p>
          <p class="font-16">
            {{ $t("impressum.linksText") }}
          </p>
          <p class="font-16">
            {{ $t("impressum.linksDisclaimerText") }}
          </p>
          <p class="font-16">{{ $t("impressum.copyrightTitle") }}</p>
          <p class="font-16">
            {{ $t("impressum.copyrightText1") }}
          </p>
          <p class="font-16">
            {{ $t("impressum.copyrightText2") }}
          </p>
          <p class="font-16">
            {{ $t("impressum.copyrightText3") }}
          </p>
          <p class="font-16">{{ $t("impressum.dataProtectionTitle") }}</p>
          <p class="font-16">
            {{ $t("impressum.dataProtectionText") }}
          </p>
          <p class="font-16">{{ $t("impressum.legalValidityTitle") }}</p>
          <p class="font-16">
            {{ $t("impressum.legalValidityText") }}
          </p>

          <h2 class="font-28 text-weight-medium q-mb-sm">{{ $t("impressum.websiteNotesTitle") }}</h2>
          <h2 class="font-28 text-weight-medium q-mb-sm">{{ $t("impressum.vsbgTitle") }}</h2>
          <p class="font-16">
            {{ $t("impressum.vsbgText1") }}
          </p>
          <p class="font-16">
            {{ $t("impressum.vsbgText2") }}
          </p>
          <p class="font-16">
            <em
              >{{ $t("impressum.generatorText") }}
              <a
                href="https://www.activemind.de/datenschutz/impressums-generator/"
                target="_blank"
                >{{ $t("impressum.generatorLink") }}</a
              >
              {{ $t("impressum.generatorEnd") }}</em
            >
          </p>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "impressum",
  data() {
    return {};
  },
};
</script>
