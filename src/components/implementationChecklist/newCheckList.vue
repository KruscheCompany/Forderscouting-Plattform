<template>
  <q-page class="q-mt-lg" :class="$q.screen.gt.sm ? 'q-mx-xl' : 'q-mx-sm'">
    <div v-if="dataLoaded">
      <p class="text-center font-36 text-weight-regular q-my-lg ppeditorial">
        {{ $t("Implementation checklist") }}
      </p>
      <div
        class="bg-white radius-20 q-py-lg"
        :class="{ 'q-px-md': $q.screen.gt.sm }"
      >
        <q-form
          ref="newChecklistForm"
          @validation-error="scrollToInvalidElement"
          class="q-gutter-lg q-px-md q-mb-md"
        >
          <div class="row items-baseline">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">
                {{ $t("Project Name") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <q-input
                outlined
                dense
                class="no-shadow input-radius-6"
                :placeholder="$t('title')"
                v-model="form.title"
                :rules="[val => !!val || $t('Required')]"
              />
            </div>
          </div>
          <div class="row items-center">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">
                {{ $t("Idea provider") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <q-btn-toggle
                v-model="form.ideaProvider"
                spread
                no-caps
                toggle-color="yellow"
                padding="12px 10px"
                color="transparent"
                toggle-text-color="black"
                text-color="black"
                class="no-shadow toggleGap"
                :options="ideaProviderOptions"
              />
            </div>
          </div>
          <div class="row items-center">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">
                {{ $t("Contact person checklist") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <div class="row q-col-gutter-x-md q-col-gutter-y-lg">
                <div class="col-12 col-md-6">
                  <q-input
                    outlined
                    dense
                    class="no-shadow input-radius-6 disabledClass"
                    :placeholder="$t('projectIdeaPlaceholder.nameSurname')"
                    :value="
                      !!checklist
                        ? form.info.contactName
                        : !!userDetails && userDetails.fullName
                    "
                    :rules="[]"
                    disable
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    outlined
                    dense
                    disable
                    class="no-shadow input-radius-6 disabledClass"
                    placeholder="Gemeinde/Verwaltung"
                    :value="
                      !!checklist
                        ? form.municipality.title
                        : !!userDetails && userDetails.municipality.title
                    "
                    :rules="[]"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="row items-baseline">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">
                {{ $t("Contact Details (optional)") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <div class="row q-col-gutter-x-md q-col-gutter-y-lg">
                <div class="col-12 col-md-6">
                  <q-input
                    outlined
                    disable
                    dense
                    class="no-shadow input-radius-6 disabledClass"
                    :placeholder="$t('projectIdeaPlaceholder.streetNr')"
                    :value="
                      !!checklist
                        ? form.info.streetNo
                        : !!userDetails && userDetails.streetNo
                    "
                    :rules="[]"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    outlined
                    dense
                    disable
                    class="no-shadow input-radius-6 disabledClass"
                    :placeholder="$t('projectIdeaPlaceholder.postalCity/place')"
                    :value="
                      !!checklist
                        ? form.info.postalCode
                        : !!userDetails && userDetails.postalCode
                    "
                    :rules="[]"
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    outlined
                    dense
                    class="no-shadow input-radius-6 disabledClass"
                    :placeholder="$t('projectIdeaPlaceholder.telephone')"
                    :value="
                      !!checklist
                        ? form.info.phone
                        : !!userDetails && userDetails.phone
                    "
                    :rules="[]"
                    disable
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    outlined
                    dense
                    class="no-shadow input-radius-6 disabledClass"
                    :placeholder="$t('projectIdeaPlaceholder.email')"
                    :value="
                      !!checklist ? form.info.email : !!user && user.email
                    "
                    :rules="[]"
                    disable
                  />
                </div>
                <div class="col-12">
                  <MunicipalityCities
                    :currentMunicipality="form.info.location"
                    @update:city="form.info.location = $event"
                    />
                </div>
              </div>
            </div>
          </div>
          <div class="row items-center">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">
                {{ $t("Link for Project Idea") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <ProjectIdeas ref="projectidea"
                :isInChecklist="true"
                :editing="!!checklist ? checklist.project : null"
                @update:linkToProject="changeProject($event)"
              />
            </div>
          </div>

          <div class="row items-center">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">
                {{ $t("Invite Editor") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <UserSelect ref="userSelect"
                :editing="!!checklist ? checklist.editors : []"
                @update:user="form.editors = $event"
              />
            </div>
          </div>
          <div class="row items-baseline">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">
                {{ $t("newProjectIdeaForm.visibility") }}
              </p>
            </div>
            <div class="col-12 col-md-8">
              <q-select
                outlined
                dense
                emit-value
                :rules="[val => !!val || $t('Required')]"
                v-model="form.visibility"
                :options="visibilityOptions"
                class="no-shadow input-radius-6"
                options-selected-class="text-primary"
              >
                <template v-slot:selected>
                  <template v-if="form.visibility">
                    {{
                      form.visibility === "only for me"
                        ? $t("visibility.onlyMe")
                        : form.visibility === "all users"
                        ? $t("visibility.allUsers")
                        : form.visibility === "listed only"
                        ? $t("visibility.listedOnly")
                        : ""
                    }}
                  </template>
                  <template v-else>
                    <span class="text-grey">
                      {{ $t("select") }}
                    </span>
                  </template>
                </template>
              </q-select>
              <p class="font-16 q-mb-none q-mt-md text-grey">
                {{
                  form.visibility === "only for me"
                    ? $t("visibility.docOnlyMe")
                    : form.visibility === "all users"
                    ? $t("visibility.docAllUsers")
                    : form.visibility === "listed only"
                    ? $t("visibility.docListedOnly")
                    : ""
                }}
              </p>
            </div>
          </div>
          <div class="no-margin row">
            <div class="col-12">
              <q-separator class="bg-blue opacity-10" />
            </div>
          </div>
          <div class="row items-baseline">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">{{ $t("Filter Categories") }}</p>
            </div>
            <div class="col-12 col-md-8">
              <Categories ref="categories"
                :requiresValidation="true"
                :editing="!!checklist ? checklist.categories : []"
                @update:category="form.categories = $event"
              />
            </div>
          </div>
          <div class="row items-baseline">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">{{ $t("Tags") }}</p>
            </div>
            <div class="col-12 col-md-8">
              <Tags ref="tags"
                :requiresValidation="true"
                :editing="!!checklist ? checklist.tags : []"
                @update:tag="form.tags = $event"
              />
            </div>
          </div>
          <div class="row items-center">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">
                Uploads
              </p>
            </div>
            <div class="col-12 col-md-8">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-file
                    flat
                    v-model="form.media"
                    class="uploadInput input-radius-6 text-white"
                    label-color="white"
                    dark
                    bg-color="primary"
                    :label="
                      !!form.media && form.media.length > 0
                        ? $t('Add Images')
                        : $t('Select Images')
                    "
                    multiple
                    display-value=""
                    append
                  >
                    <template v-slot:prepend>
                      <q-icon color="white" class="on-right" name="upload" />
                    </template>
                  </q-file>
                  <div
                    class="q-mt-sm"
                    v-if="form.media && form.media.length > 0"
                  >
                    <div
                      class="q-col-gutter-x-sm row radius-6 shadow-1 q-mt-sm items-center q-pa-sm"
                      v-for="(image, index) in form.media"
                      :key="index"
                    >
                      <div class="col-auto">
                        <q-avatar rounded size="48px">
                          <q-img
                            :ratio="1"
                            contain
                            :src="imgPreview(image).url"
                          />
                        </q-avatar>
                      </div>
                      <div class="col-8">
                        <q-item-label class="ellipsis" caption>{{
                          imgPreview(image).name
                        }}</q-item-label>
                      </div>
                      <div class="col-auto text-right">
                        <q-btn
                          icon="delete"
                          @click.prevent.stop="removeImg(index)"
                          size="sm"
                          round
                          text-color="red"
                          dense
                        >
                        </q-btn>
                      </div>
                      <div class="col-12 q-mt-sm">
                        <q-btn
                          :label="
                            !!imgPreview(image).caption
                              ? $t('Edit caption')
                              : $t('Add Caption')
                          "
                          @click.prevent.stop="addCaption(image, index)"
                          text-color="primary"
                          dense
                          class="radius-6 "
                          no-caps
                          flat
                        >
                        </q-btn>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Inline project view start -->
          <div class="row" v-if="form.project && form.project.id">
            <div class="col-12">
              <q-separator class="bg-blue opacity-10" />
            </div>
          </div>
          <div class="row item-center" v-if="form.project && form.project.id">
            <div class="col-12 col-md-4">
              <p class="font-16 no-margin">
                {{
                  $t("project Idea")
                }}
              </p>
            </div>
            <div class="col-12 q-mt-sm" v-if="form.project && form.project.id">
              <InlineProjectView :projectID="form.project.id" />
            </div>
          </div>
          <!-- Inline project view end -->
          <q-card style="background:#16428B1A" class="q-pa-none shadow-0">
            <q-card-section class="q-pa-md font-16 text-weight-600">{{
              $t("Project activity")
            }}</q-card-section>
          </q-card>

          <div
            v-for="(card, index) in form.items"
            :key="index"
            class="row items-start"
          >

            <div class="col-12 col-md-4 q-pr-sm">
              <p class="font-16 no-margin text-weight-600">
                {{ card.cardTitle }}
              </p>
              <!-- responsiblePerson -->
              <!-- <div class="flex items-baseline row q-mt-lg q-col-gutter-x-md justify-between">
                <div class="col-3">
                  <p class="font-14 no-margin">{{ $t("responsiblePerson") }}</p>
                </div>
                <div style="width: 225px;">
                  <q-input
                    outlined
                    dense
                    class="no-shadow input-radius-6"
                    color="primary"
                    bg-color="white"
                    :placeholder="$t('responsiblePerson')"
                    ref="responsiblePerson"
                    v-model="card.responsiblePerson"
                    :value="card.responsiblePerson"
                  >
                  </q-input>
                </div>
              </div> -->
              <div class="flex items-baseline row q-mt-md q-col-gutter-x-md justify-between" style="margin-top: 35px;">
                <div class="col-3">
                  <p class="font-14 no-margin">{{ $t("start") }}</p>
                </div>
                <div>
                  <q-input
                    outlined
                    dense
                    :disable="disableDate(index)"
                    :rules="[val => !!val || $t('Required')]"
                    class="no-shadow input-radius-6"
                    :value="disableDate(index) ? '' : dateFormatter(card.start)"
                    readonly
                    color="primary"
                    bg-color="white"
                    :placeholder="$t('projectIdeaPlaceholder.plannedStartDate')"
                    @click="
                      $refs.startDateProxy[index].show();
                      dateValidationIndex = index;
                    "
                    ref="startDate"
                  >
                    <template v-slot:append>
                      <q-icon
                        name="event"
                        color="blue-5"
                        class="cursor-pointer"
                      >
                        <q-popup-proxy
                          :ref="'startDateProxy'"
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            :options="plannedStartOptions"
                            v-model="card.start"
                            mask="YYYY-MM-DD"
                            @input="$refs.startDateProxy[index].hide()"
                            @click="dateValidationIndex = index"
                            first-day-of-week="1"
                            :locale="datepickerLocale"
                          >
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                no-caps
                                :label="$t('Close')"
                                color="primary"
                                flat
                              />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
              </div>
              <div class="flex items-baseline row q-mt-md q-col-gutter-x-md justify-between">
                <div class="col-3">
                  <p class="font-14 no-margin">{{ $t("end") }}</p>
                </div>
                <div>
                  <q-input
                    outlined
                    dense
                    :disable="disableDate(index)"
                    :rules="[val => !!val || $t('Required')]"
                    class="no-shadow input-radius-6"
                    :value="disableDate(index) ? '' : dateFormatter(card.end)"
                    color="primary"
                    readonly
                    bg-color="white"
                    :placeholder="$t('projectIdeaPlaceholder.plannedEndDate')"
                    @click="
                      $refs.endDateProxy[index].show();
                      dateValidationIndex = index;
                    "
                    ref="endDate"
                  >
                    <template v-slot:append>
                      <q-icon
                        name="event"
                        color="blue-5"
                        class="cursor-pointer"
                      >
                        <q-popup-proxy
                          :ref="'endDateProxy'"
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            :options="plannedEndOptions"
                            v-model="card.end"
                            mask="YYYY-MM-DD"
                            @input="$refs.endDateProxy[index].hide()"
                            @click="dateValidationIndex = index"
                            first-day-of-week="1"
                            :locale="datepickerLocale"
                          >
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                no-caps
                                :label="$t('Close')"
                                color="primary"
                                flat
                              />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
              </div>
            </div>
            <div class="col-12 col-md-8">
              <draggable
                handle=".handle"
                class="col-12 col-md-8"
                v-model="card.items"
                ghost-class="movingClass"
                @change="onChange($event, card.items)"
                :force-fallback="true"
                :move="onMove"
              >
                <transition-group type="transition" tag="div" name="flip-list">
                  <q-card
                    v-for="(element, secondIndex) in card.items"
                    :key="element.objectId"
                    class="q-pa-none shadow-0"
                    :class="secondIndex > 0 ? 'q-mt-xs' : ''"
                  >
                    <div style="background:#16428B1A">
                      <q-card-section
                        horizontal
                        class="items-center justify-between q-pa-sm"
                      >
                        <div class="col-auto">
                          <q-icon
                            size="sm"
                            color="blue-5"
                            class="handle q-mr-md q-py-sm bg-white radius-6 cursor-pointer"
                            :name="!!element.fixed ? 'lock' : 'reorder'"
                          />
                        </div>
                        <div class="col-8 col-md-10">
                          <div class="row items-center">
                            <div class="col-11 q-pr-sm">
                              <div class="row">
                                <div class="col-12">
                                  <p
                                    class="no-margin font-18 text-blue text-weight-600"
                                  >
                                    {{ element.objectTitle }}
                                  </p>
                                </div>
                                <div v-show="!!element.desc" class="col-12">
                                  <p class="no-margin font-14 text-italic">
                                    {{ element.desc }}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div class="col-1">
                              <div
                                v-show="
                                  !!element.info && element.info.length > 0
                                "
                                class="col-auto"
                              >
                                <q-btn
                                  flat
                                  round
                                  class="q-pa-none"
                                  icon="help_outline"
                                  color="primary"
                                  aria-label="help"
                                >
                                  <q-tooltip
                                    content-class="bg-transparent shadow-2 text-black q-pa-none"
                                    content-style="min-width: 600px; max-width: 600px; max-height: 400px;"
                                    anchor="top left"
                                    self="bottom right"
                                    :offset="[-50, 10]"
                                  >
                                    <q-card>
                                      <q-card-section class="q-pb-xs">
                                        <p
                                          class="no-margin font-16 text-weight-600"
                                        >
                                          Prüffrage:
                                        </p>
                                      </q-card-section>
                                      <q-card-section
                                        horizontal
                                        class="q-pr-md"
                                      >
                                        <ul class="listClass">
                                          <li
                                            v-for="(info,
                                            index) in element.info"
                                            :key="index"
                                          >
                                            {{ info }}
                                          </li>
                                        </ul>
                                      </q-card-section>
                                    </q-card>
                                  </q-tooltip>
                                </q-btn>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-auto">
                          <q-toggle
                            size="lg"
                            color="primary"
                            class="customToggle"
                            @input="disableDate(index)"
                            v-model="element.active"
                            aria-label="toggle"
                          />
                          <q-tooltip :offset="[10, 10]">
                            {{ element.active ? $t("Done") : $t("notDone") }}
                          </q-tooltip>
                        </div>
                      </q-card-section>

                      <q-card-section v-if="!element.hasOwnProperty('funding')" >
                        <div class="row q-col-gutter-md">
                          <div class="col-12">
                            <q-input
                              outlined
                              bg-color="white"
                              dense
                              class="no-shadow input-radius-6"
                              placeholder="Name"
                              v-model="element.name"
                            />
                          </div>

                          <div
                            v-if="element.hasOwnProperty('project')"
                            class="col-12"
                          >
                            <ProjectIdeas

                              :isInChecklist="true"
                              :editing="
                                !!checklist
                                  ? form.items
                                      .find(
                                        item =>
                                          item.cardName === 'initialContact'
                                      )
                                      .items.find(
                                        item =>
                                          item.objectName === 'captureIdea'
                                      ).project
                                  : null
                              "
                              @update:linkToProject="element.project = $event"
                            />
                          </div>

                          <div class="col-12">
                            <q-input
                              outlined
                              type="textarea"
                              rows="10"
                              bg-color="white"
                              class="no-shadow input-radius-6"
                              placeholder="Text"
                              v-model="element.text"
                            />
                          </div>
                          <div class="col-12">
                            <div class="row items-center q-col-gutter-x-sm">
                              <div class="col-12 col-md-4">
                                <q-file
                                  outlined
                                  bg-color="transparent"
                                  v-model="element.file"
                                  class="uploadInput input-radius-6"
                                  label-color="primary"
                                  :label="
                                    !!element.file && element.file.length > 0
                                      ? $t('Add file')
                                      : $t('Upload file')
                                  "
                                  multiple
                                  display-value=""
                                  append
                                >
                                  <template v-slot:prepend>
                                    <q-icon
                                      color="primary"
                                      class="on-right"
                                      name="upload"
                                    />
                                  </template>
                                </q-file>
                              </div>
                              <div
                                class="col-12 q-mt-sm"
                                v-if="element.file && element.file.length > 0"
                              >
                                <q-item
                                  class="q-py-none q-pl-none inline radius-6 items-center"
                                  v-for="(file, index) in element.file"
                                  :key="index"
                                  clickable
                                >
                                  <q-item-section side class="col-auto q-pr-xs">
                                    <q-avatar rounded size="48px">
                                      <p class="font-16 no-margin">
                                        {{
                                          imgPreview(file).name.split(".")[1]
                                        }}
                                      </p>
                                    </q-avatar>
                                  </q-item-section>
                                  <q-item-section class="col-auto ">
                                    <q-item-label class="ellipsis" caption>{{
                                      imgPreview(file).name
                                    }}</q-item-label>
                                  </q-item-section>
                                  <q-item-section side>
                                    <q-btn
                                      icon="delete"
                                      @click.prevent.stop="
                                        removeFile(card, element, index)
                                      "
                                      size="sm"
                                      round
                                      text-color="red"
                                      dense
                                    >
                                    </q-btn>
                                  </q-item-section>
                                </q-item>
                              </div>
                            </div>
                          </div>
                        </div>
                      </q-card-section>

                      <!-- Funding selection  -->
                      <q-card-section v-if="element.hasOwnProperty('funding')">
                        <div class="row q-col-gutter-md">
                          <div class="col-12">
                            <Funding ref="fundings" :isInChecklist="true" :editing="!!checklist ? checklist.funding : null"
                              @update:linkToChecklist="changeFunding($event)" />
                          </div>
                        </div>
                      </q-card-section>
                      <!-- Funding selection end -->
                       
                    </div>
                    <!-- Inline funding view start -->
                      <div class="row" v-if="form.funding && form.funding.id && element.objectTitle === 'Förderrichtlinie'">
                        <div class="col-12">
                          <q-separator class="bg-blue opacity-10" />
                        </div>
                      </div>
                      <div class="row item-center" v-if="form.funding && form.funding.id && element.objectTitle === 'Förderrichtlinie'">
                        <!-- <div class="col-12 col-md-4">
                          <p class="font-16 no-margin">
                            {{
                              $t("Funding")
                            }}
                          </p>
                        </div> -->
                        <div class="col-12 q-mt-xl" v-if="form.funding && form.funding.id && element.objectTitle === 'Förderrichtlinie'">
                          <InlineFundingView :fundingId="form.funding.id" />
                        </div>
                      </div>
                    <!-- Inline funding view end -->
                    <draggable
                      v-if="element.active === true"
                      handle=".handle"
                      class="col-8"
                      v-model="element.tasks"
                      ghost-class="movingClass"
                      @change="onChange($event, element.tasks)"
                      :force-fallback="true"
                    >
                      <transition-group
                        type="transition"
                        tag="div"
                        name="flip-list"
                      >
                        <q-card
                          v-for="item in element.tasks"
                          :key="item.objectId"
                          class="shadow-0 q-my-xs"
                        >
                          <q-card-section
                            style="background:#FDD50033"
                            class="q-pa-sm items-center justify-between"
                            horizontal
                          >
                            <div class="col-auto">
                              <q-icon
                                size="sm"
                                color="blue-5"
                                class="handle q-mr-md q-py-sm bg-white radius-6 cursor-pointer"
                                name="reorder"
                              />
                            </div>
                            <div class="col-10">
                              <div class="row items-center">
                                <div class="col-11 q-pr-sm">
                                  <div class="row">
                                    <div class="col-12">
                                      <p
                                        class="no-margin font-18 text-blue text-weight-600"
                                      >
                                        {{ item.name }}
                                      </p>
                                    </div>
                                    <div v-show="!!item.desc" class="col-12">
                                      <p class="no-margin font-14 text-italic">
                                        {{ item.desc }}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div class="col-1">
                                  <div
                                    v-show="!!item.info && item.info.length > 0"
                                    class="col-auto"
                                  >
                                    <q-btn
                                      flat
                                      round
                                      class="q-pa-none"
                                      icon="help_outline"
                                      color="primary"
                                      aria-label="help"
                                    >
                                      <q-tooltip
                                        content-class="bg-transparent shadow-2 text-black q-pa-none"
                                        content-style="min-width: 600px; max-width: 600px; max-height: 400px;"
                                        anchor="top left"
                                        self="bottom right"
                                        :offset="[-50, 10]"
                                      >
                                        <q-card>
                                          <q-card-section class="q-pb-xs">
                                            <p
                                              class="no-margin font-16 text-weight-600"
                                            >
                                              Prüffrage:
                                            </p>
                                          </q-card-section>
                                          <q-card-section
                                            horizontal
                                            class="q-pr-md"
                                          >
                                            <ul class="listClass">
                                              <li
                                                v-for="(info,
                                                index) in item.info"
                                                :key="index"
                                              >
                                                {{ info }}
                                              </li>
                                            </ul>
                                          </q-card-section>
                                        </q-card>
                                      </q-tooltip>
                                    </q-btn>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="col-auto">
                              <q-toggle
                                size="lg"
                                color="primary"
                                class="customToggle"
                                v-model="item.active"
                                aria-label="toggle"
                              />
                              <q-tooltip :offset="[10, 10]">
                                {{ item.active ? $t("Done") : $t("notDone") }}
                              </q-tooltip>
                            </div>
                          </q-card-section>

                          <draggable
                            v-if="item.active === true"
                            handle=".handle"
                            class="col-8 q-ml-lg"
                            v-model="item.children"
                            ghost-class="movingClass"
                            @change="onChange($event, item.children)"
                            :force-fallback="true"
                          >
                            <transition-group
                              type="transition"
                              tag="div"
                              name="flip-list"
                            >
                              <q-card
                                v-for="child in item.children"
                                :key="child.objectId"
                                class="shadow-0"
                              >
                                <q-card-section
                                  horizontal
                                  class="items-center q-pa-xs justify-evenly"
                                >
                                  <div class="col-auto ">
                                    <q-icon
                                      size="sm"
                                      color="blue-5"
                                      class="handle q-mr-md q-py-sm bg-white radius-6 cursor-pointer"
                                      name="reorder"
                                    />
                                  </div>
                                  <div class="col-10">
                                    <div class="row items-center">
                                      <div class="col-11">
                                        <p
                                          class="no-margin font-14 text-overflow"
                                        >
                                          {{ child.name }}
                                        </p>
                                      </div>
                                      <div class="col-1">
                                        <div
                                          v-show="
                                            !!child.info &&
                                              child.info.length > 0
                                          "
                                          class="col-auto"
                                        >
                                          <q-btn
                                            flat
                                            round
                                            class="q-pa-none"
                                            icon="help_outline"
                                            color="primary"
                                            aria-label="help"
                                          >
                                            <q-tooltip
                                              content-class="bg-transparent shadow-2 text-black q-pa-none"
                                              content-style="min-width: 600px; max-width: 600px; max-height: 400px;"
                                              anchor="top left"
                                              self="bottom right"
                                              :offset="[-50, 10]"
                                            >
                                              <q-card>
                                                <q-card-section class="q-pb-xs">
                                                  <p
                                                    class="no-margin font-16 text-weight-600"
                                                  >
                                                    Prüffrage:
                                                  </p>
                                                </q-card-section>
                                                <q-card-section
                                                  horizontal
                                                  class="q-pr-md"
                                                >
                                                  <ul class="listClass">
                                                    <li
                                                      v-for="(info,
                                                      index) in child.info"
                                                      :key="index"
                                                    >
                                                      {{ info }}
                                                    </li>
                                                  </ul>
                                                </q-card-section>
                                              </q-card>
                                            </q-tooltip>
                                          </q-btn>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="col-auto">
                                    <q-toggle
                                      size="lg"
                                      color="primary"
                                      class="customToggle"
                                      v-model="child.active"
                                      aria-label="toggle"
                                    />
                                    <q-tooltip :offset="[10, 10]">
                                      {{ child.active ? $t("Done") : $t("notDone") }}
                                    </q-tooltip>
                                  </div>
                                </q-card-section>
                                <q-separator
                                  class="bg-blue q-mb-sm opacity-10"
                                />
                              </q-card>
                            </transition-group>
                          </draggable>
                        </q-card>
                      </transition-group>
                    </draggable>
                  </q-card>
                </transition-group>
              </draggable>
            </div>
            <div class="col-12">
              <q-separator class="bg-blue q-mt-md opacity-10" />
            </div>
          </div>
          <div class="row justify-center">
            <div class="col-5 col-md-3 q-ml-sm">
              <q-btn
                :label="$t('publishButton.publish')"
                @click="
                  !!checklist ? editChecklist(true) : submitNewChecklist(true)
                "
                size="16px"
                color="primary"
                :loading="isLoading"
                no-caps
                class="radius-6 q-py-xs full-width"
              />
            </div>
          </div>
        </q-form>
      </div>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-fab
          :loading="isLoading"
          icon="keyboard_arrow_left"
          direction="left"
          color="primary"
          aria-label="Save"
        >
          <q-fab-action
            @click="
              !!checklist ? editChecklist(true) : submitNewChecklist(true)
            "
            color="primary"
            icon="add"
            :label="$t('publishButton.publish')"
          />
        </q-fab>
      </q-page-sticky>
    </div>
    <ImageDialog
      :imageIndex="imageIndex"
      :image="image"
      type="checklist"
      :document="!!checklist ? checklist : null"
      :dialogState="imageDialog"
      @update="(imageDialog = false), (imageIndex = null), (image = null)"
      @add-caption="updateCaption"
    />
  </q-page>
</template>

<script>
import { scroll } from "quasar";
const { getScrollTarget, setScrollPosition } = scroll;
import ProjectIdeas from "components/funding/ProjectIdeas.vue";
import Funding from "components/implementationChecklist/Funding.vue";
import UserSelect from "components/user/UserSelect.vue";
import Categories from "components/projects/create/Categories.vue";
import Tags from "components/projects/create/Tags.vue";
import InlineProjectView from "components/projects/view/InlineProjectView.vue";
import InlineFundingView from "components/funding/view/InlineFundingView.vue";
import draggable from "vuedraggable";
import ImageDialog from "components/ImageDialog.vue";
import { dateFormatter } from "src/boot/dateFormatter";
import MunicipalityCities from "components/Municipality/MunicipalityCities.vue";
export default {
  name: "newCheckList",
  components: {
    draggable,
    ProjectIdeas,
    Funding,
    UserSelect,
    MunicipalityCities,
    Categories,
    Tags,
    InlineProjectView,
    ImageDialog,
    InlineFundingView
  },
  data() {
    return {
      projectView: null,
      imageIndex: null,
      image: null,
      imageDialog: false,
      projectIdea: true,

      form: {
        title: "",
        ideaProvider: "volunteering",
        project: null,
        funding: null,
        visibility: "",
        items: [
          {
            cardName: "initialContact",
            cardTitle: "Bedarfsklärung: Erstgespräch...",
            start: "",
            end: "",
            // responsiblePerson: "",
            items: [
              // captureIdea
              {
                objectName: "captureIdea",
                objectTitle: "Erfassung der Projektidee (Themen, Inhalte)",
                desc:
                  "Wie kann eine potenzielle Projektidee vor einem Erstgespräch ermittelt werden?",
                name: "",
                text: "",
                sortPosition: 1,
                active: false,
                project: null,
                objectId: 1,
                file: null,
                tasks: [
                  {
                    name: "Projektidee-Quellen Nutzen",
                    sortPosition: 1,
                    objectId: 1,
                    active: false,
                    children: [
                      {
                        name:
                          "Projektidee aus bestehenden kommunalen Entwicklungskonzept entnommen ",
                        sortPosition: 1,
                        active: false,
                        objectId: 1,
                        info: ["Sind Entwicklungskonzepte noch gültig?"]
                      },
                      {
                        name: "Projektidee aus Antrag der Politik entnommen",
                        sortPosition: 2,
                        active: false,
                        objectId: 2
                      },
                      {
                        name: "Projektidee aus lokalem Arbeitskreis entnommen",
                        sortPosition: 3,
                        active: false,
                        objectId: 3
                      },
                      {
                        name:
                          "Projektidee im Erstgespräch (Einzelgemeinde oder Zusammenschluss) entwickelt",
                        sortPosition: 4,
                        active: false,
                        objectId: 4
                      },
                      {
                        name:
                          "Projektidee aus Vernetzungsgespräch mit anderen Kommunen oder Institutionen (z.B. Hochschulen, Privatwirtschaft, Vereine) entnommen",
                        sortPosition: 5,
                        active: false,
                        objectId: 5,
                        info: [
                          "Umgang mit Projektideen von Seiten des nicht-politischen Ehrenamtes klären?"
                        ]
                      },
                      {
                        name:
                          "Projektidee durch externe Dienstleister/ Produktanbieter in Beratungsgespräch eingebracht",
                        sortPosition: 6,
                        active: false,
                        objectId: 6
                      },
                      {
                        name:
                          "Veröffentlichung von Förderprogrammen als Basis für Projektidee",
                        sortPosition: 7,
                        active: false,
                        objectId: 7
                      }
                    ]
                  },
                  {
                    name: "Allgemeine Rahmenbedingungen ermitteln",
                    sortPosition: 2,
                    objectId: 2,
                    active: false,
                    children: [
                      {
                        name: "Ziel und Nutzen der Projektidee definieren",
                        sortPosition: 1,
                        active: false,
                        objectId: 1
                      },
                      {
                        name:
                          "Bedarfe der Bürger*innen ermitteln (z.B. über Abfrage über der Homepage)",
                        sortPosition: 2,
                        active: false,
                        objectId: 2
                      },
                      {
                        name: "Projektinitiator festlegen",
                        sortPosition: 3,
                        active: false,
                        objectId: 3,
                        info: [
                          "Wer ist inhaltlicher Ansprechpartner*in für die Projektkoordination?"
                        ]
                      },
                      {
                        name:
                          "Finanzielle Rahmenbedingungen im Bauamt und der Kämmerei prüfen (u.a. Kostenschätzung und Liquidität der Kommune",
                        sortPosition: 4,
                        active: false,
                        objectId: 4
                      }
                    ]
                  }
                ]
              },
              // caputreContect
              {
                objectName: "caputreContect",
                objectTitle:
                  "Erfassung Kontext (Themen, Inhalte, Mehrwert, Nutzen)",
                desc:
                  "Wie kann der Kontext einer Projektidee im Erstgespräch skizziert und im Nachgang konkretisiert werden?",
                name: "",
                text: "",
                active: false,
                sortPosition: 2,
                file: null,
                objectId: 2,
                info: [
                  "Könnte die Idee genehmigungspflichtig sein?",
                  "Sind die Eigentumsverhältnisse geklärt?",
                  "Könnte es weitere Hürden und Hindernisse geben?"
                ],
                tasks: [
                  {
                    name:
                      "Erste Einschätzungen zu den allgemeinen Rahmenbedingungen dokumentieren",
                    sortPosition: 1,
                    objectId: 1,
                    active: false,
                    children: [
                      {
                        name:
                          "Offene Abfrage der kommunalen Rahmenbedingungen im Erstgespräch dokumentieren",
                        sortPosition: 1,
                        active: false,
                        objectId: 1
                      },
                      {
                        name:
                          "Bestehende Dokumente (Konzepte, Planungen, Strategien) analysieren",
                        sortPosition: 2,
                        active: false,
                        objectId: 2
                      },
                      {
                        name:
                          "Diskussion zu weiteren wichtigen Gesprächspartnern führen und dokumentieren",
                        sortPosition: 3,
                        active: false,
                        objectId: 3
                      },
                      {
                        name:
                          "Produktrecherche, Kostenplanung und Wirtschaftlichkeitsprüfung skizzieren",
                        sortPosition: 4,
                        active: false,
                        objectId: 4
                      }
                    ]
                  },
                  {
                    name:
                      "Input von weiteren Akteur*innen ermitteln und dokumentieren (z.B. Fachbereiche der Verwaltung, existierende Projektideen/ Referenzprojekte)",
                    sortPosition: 2,
                    objectId: 2,
                    active: false,
                    children: [
                      {
                        name:
                          "Best-Practice-Beispiele zu existierende Projektideen/ Referenzprojekte finden und mit kommunalen Rahmenbedingungen abgleichen",
                        sortPosition: 1,
                        active: false,
                        objectId: 1
                      },
                      {
                        name:
                          "Input wichtiger Akteure im Nachgang über Workshopformat dokumentieren",
                        sortPosition: 2,
                        active: false,
                        objectId: 2
                      },
                      {
                        name:
                          "Input wichtiger Akteure im Nachgang über Interviewformat dokumentieren",
                        sortPosition: 3,
                        active: false,
                        objectId: 3
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            cardName: "preparation",
            cardTitle: "Projektentwicklung: Erstellung...",
            start: "",
            end: "",
            // responsiblePerson: "",
            items: [
              {
                objectName: "inspection",
                objectTitle: "Ggf. Begehung (Abschätzung Projektumfang)",
                name: "",
                text: "",
                sortPosition: 1,
                objectId: 1,
                active: false,
                fixed: true,
                file: null,
                info: [
                  "Sind Gutachten/Vorstudien nötig?",
                  "Müssen externe Dienstleister beauftragt werden?"
                ],
                tasks: [
                  {
                    name: "Begehung zielgerichtet vorbereiten",
                    sortPosition: 1,
                    objectId: 1,
                    active: false,
                    children: [
                      {
                        name:
                          "Alle relevanten Akteure (z.B. Bauamt, externe Akteure) zur Begehung einladen",
                        sortPosition: 1,
                        active: false,
                        objectId: 1
                      },
                      {
                        name:
                          "Allgemeine Blickwinkel der Fachabteilungen der Verwaltung einholen (Kämmerei, Bauamt, etc.)",
                        sortPosition: 2,
                        active: false,
                        objectId: 2
                      },
                      {
                        name:
                          "Investitionskosten anhand von Projektideen/ Referenzprojekten grob ermitteln",
                        sortPosition: 3,
                        active: false,
                        objectId: 3
                      },
                      {
                        name:
                          "Erweiterten Prüfauftrag an die Verwaltung (kein endgültiger Beschluss) mit Entscheider*innen abstimmen und veranlassen",
                        sortPosition: 4,
                        active: false,
                        objectId: 4
                      },
                      {
                        name:
                          "Bedarfe der Bürger*innen einfließen lassen, bspw. über Mängel-Melder (digital, Telefon, Bürgerservice, Bürgermeister etc.), Workshops, Entwicklungskonzepte",
                        sortPosition: 5,
                        active: false,
                        objectId: 5
                      },
                      {
                        name:
                          "Kurzinfos zu potenziellen Fördermöglichkeiten vorbereiten",
                        sortPosition: 6,
                        active: false,
                        objectId: 6
                      }
                    ]
                  },
                  {
                    name:
                      "Weitere Rahmenbedingungen beim Vor-Ort-Termin sondieren",
                    sortPosition: 2,
                    objectId: 2,
                    active: false,
                    children: [
                      {
                        name:
                          "Besprechung durchführen samt Dokumentation des Gesprächsverlauf, Anfertigung einer Planskizze etc.",
                        sortPosition: 1,
                        active: false,
                        objectId: 1
                      },
                      {
                        name:
                          "Besprechung im Büro anhand von Projektideen-Skizze, Bildern, Karten und Planskizzen etc.",
                        sortPosition: 2,
                        active: false,
                        objectId: 2
                      },
                      {
                        name:
                          "Finanzielle Spielräume mit der Kämmerei anhand der Projektideen-Skizze und den Kurzinfos zu Fördermöglichkeiten besprechen",
                        sortPosition: 3,
                        active: false,
                        objectId: 3
                      }
                    ]
                  }
                ]
              },
              {
                objectName: "captureRequirements",
                objectTitle: "Erfassung Bedarfe/ Ziel",
                name: "",
                text: "",
                desc: "Wie können Anforderungen erfasst werden?",
                sortPosition: 2,
                objectId: 2,
                active: false,
                fixed: true,
                file: null,
                tasks: [
                  {
                    name:
                      "Projektentwicklung partizipativ gestalten und konkretisieren",
                    sortPosition: 1,
                    objectId: 1,
                    active: false,
                    children: [
                      {
                        name: "Arbeitsgruppe einrichten",
                        sortPosition: 1,
                        active: false,
                        objectId: 1
                      },
                      {
                        name:
                          "Strukturiertes Brainstorming mit entsprechenden Fragestellungen und geeigneter Methodik durchführen",
                        sortPosition: 2,
                        active: false,
                        objectId: 2
                      },
                      {
                        name:
                          "Offenes Brainstorming mit entsprechenden Fragestellungen durchführen",
                        sortPosition: 3,
                        active: false,
                        objectId: 3
                      },
                      {
                        name:
                          "Ideen werden auch aus der Bürgerschaft mit entsprechenden Fragestellungen und geeigneter Methodik mitgenommen– nicht nur Politik",
                        sortPosition: 4,
                        active: false,
                        objectId: 4
                      },
                      {
                        name: "Genehmigung bei der Kommunalaufsicht prüfen",
                        sortPosition: 5,
                        active: false,
                        objectId: 5
                      }
                    ]
                  },
                  {
                    name:
                      "Projektsteckbrief für die weiteren Schritte dokumentieren",
                    sortPosition: 2,
                    objectId: 2,
                    active: false,
                    children: [
                      {
                        name:
                          "Bedarfsanalyse aus den vorherigen Schritten dokumentieren (Phase 0)",
                        sortPosition: 1,
                        active: false,
                        objectId: 1
                      },
                      {
                        name:
                          "Recherche zu Projektideen/ Referenzprojekten samt Abstimmung mit Kommune dokumentieren",
                        sortPosition: 2,
                        active: false,
                        objectId: 2
                      },
                      {
                        name: "Fragebogen-Abfrage durchführen (Zielgruppen)",
                        sortPosition: 3,
                        active: false,
                        objectId: 3
                      },
                      {
                        name:
                          "Interview-Abfrage durchführen (Kooperationspartner)",
                        sortPosition: 4,
                        active: false,
                        objectId: 4
                      },
                      {
                        name:
                          "Genehmigungen prüfen, ggf. schon einholen und dokumentieren (Zeitvorlauf, Voranfragen, Gutachten)",
                        sortPosition: 5,
                        active: false,
                        objectId: 5
                      }
                    ]
                  }
                ]
              },
              {
                objectName: "captureNeeds",
                objectTitle: "Erfassung Bedarfe/Ziele",
                name: "",
                text: "",
                desc: "Wie können Ziele und Bedarfe erfasst werden?",
                sortPosition: 3,
                objectId: 3,
                active: false,
                fixed: true,
                file: null,
                tasks: [
                  {
                    name: "Erwartungen an das Projekt definieren",
                    sortPosition: 1,
                    objectId: 1,
                    active: false,
                    children: [
                      {
                        name: "Alle Beteiligten auf einen Nenner bringen",
                        sortPosition: 1,
                        active: false,
                        objectId: 1
                      },
                      {
                        name:
                          "Erwartungshaltung transparent machen und konsolidieren",
                        sortPosition: 2,
                        active: false,
                        objectId: 2,
                        info: [
                          "Mit welchen Methoden-Formaten kann man das am besten machen?"
                        ]
                      },
                      {
                        name:
                          "Offenes Sammlung von Zielen (und Zwischenzielen) und Bedarfen in einer Gruppendiskussion",
                        sortPosition: 3,
                        active: false,
                        objectId: 3
                      },
                      {
                        name: "Fragebogen-Abfrage (Zielgruppen)",
                        sortPosition: 4,
                        active: false,
                        objectId: 4
                      }
                    ]
                  },
                  {
                    name: "Ressourcen der Akteure bündeln",
                    sortPosition: 2,
                    objectId: 2,
                    active: false,
                    children: [
                      {
                        name:
                          "Kommunikation und Absprache im eigenen Haus koordinieren",
                        sortPosition: 1,
                        active: false,
                        objectId: 1
                      },
                      {
                        name: "Zeitschiene abstimmen",
                        sortPosition: 2,
                        active: false,
                        objectId: 2
                      },
                      {
                        name: "Ressourcen und Aufgaben zielgerichtet verteilen",
                        sortPosition: 3,
                        active: false,
                        objectId: 3
                      },
                      {
                        name:
                          "Kommunikation mit Bürger*innen (Homepage, Gemeindebrief, Presse) ermöglichen",
                        sortPosition: 4,
                        active: false,
                        objectId: 4
                      },
                      {
                        name:
                          "Strukturierte Sammlung von Zielen und Bedarfen in einer Gruppendiskussion",
                        sortPosition: 5,
                        active: false,
                        objectId: 5
                      },
                      {
                        name:
                          "Interview-Abfrage durchführen (Kooperationspartner)",
                        sortPosition: 6,
                        active: false,
                        objectId: 6
                      },
                      {
                        name:
                          "Recherche zu Projekten mit ähnlichen Zielen und Bedarfen",
                        sortPosition: 7,
                        active: false,
                        objectId: 7
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            cardName: "fundingResearch",
            cardTitle: "Fördermittelrecherche: Fördermittelcheck",
            start: "",
            end: "",
            // responsiblePerson: "",
            items: [
              {
                objectName: "checkDatabase",
                objectTitle: "Check Datenbank „Fördermittel“",
                name: "",
                text: "",
                desc: "Welche grundlegenden Informationen werden benötigt?",
                sortPosition: 1,
                objectId: 1,
                active: false,
                fixed: true,
                file: null,
                tasks: [
                  {
                    name: "Zeitschiene und Inhalte abgleichen",
                    sortPosition: 1,
                    objectId: 1,
                    active: false,
                    children: [
                      {
                        name:
                          "Eigene Zeitplanung mit zeitlichem Rahmen des Fördertopfes abgleichen",
                        sortPosition: 1,
                        active: false,
                        objectId: 1
                      },
                      {
                        name: "Themenkategorien abgleichen",
                        sortPosition: 2,
                        active: false,
                        objectId: 2
                      },
                      {
                        name: "Projektinhalte aus User Aktivität 2 abgleichen",
                        sortPosition: 3,
                        active: false,
                        objectId: 3
                      },
                      {
                        name:
                          "Projektnutzen und Kosten aus User Aktivität 2 abgleichen",
                        sortPosition: 4,
                        active: false,
                        objectId: 4
                      },
                      {
                        name:
                          "Akteurskonstellation/ Kooperationsbedarf abgleichen, u.a. auch zwecks inhaltlicher und/ oder finanzieller Anpassungen",
                        sortPosition: 5,
                        active: false,
                        objectId: 5
                      }
                    ]
                  },
                  {
                    name: "Kosten- und Finanzierungsplan aufstellen",
                    sortPosition: 2,
                    objectId: 2,
                    active: false,
                    children: [
                      {
                        name:
                          "Projektmehrwert/ -nutzen mit Kosten- und Finanzierungsplan verknüpfen",
                        sortPosition: 1,
                        active: false,
                        objectId: 1
                      },
                      {
                        name: "Kostenschätzung einholen",
                        sortPosition: 2,
                        active: false,
                        objectId: 2
                      },
                      {
                        name:
                          "Akteurskonstellation bzgl. Fördermittel/ Inhalte bewerten und prüfen",
                        sortPosition: 3,
                        active: false,
                        objectId: 3
                      }
                    ]
                  }
                ]
              },
              {
                objectName: "checkForFunding",
                objectTitle: "Check über Förderscouting",
                name: "",
                text: "",
                desc:
                  "Welche grundlegenden Informationen werden benötigt? Kann ggf. schon ab User Aktivität 2 mit dem Förderscouting erfolgen (2.1 oder 2.2)",
                sortPosition: 2,
                objectId: 2,
                active: false,
                fixed: true,
                file: null,
                tasks: [
                  {
                    name:
                      "Gemeinsame Fördermittelrecherche bzw. Check der Projektidee durchführen",
                    sortPosition: 1,
                    objectId: 1,
                    active: false,
                    children: [
                      {
                        name: "Förderscouting prüft Themenkategorien gegen",
                        sortPosition: 1,
                        active: false,
                        objectId: 1
                      },
                      {
                        name: "Förderscouting hinterfragt Projektziele",
                        sortPosition: 2,
                        active: false,
                        objectId: 2
                      },
                      {
                        name:
                          "Förderscouting hinterfragt Projektmehrwert/ -nutzen",
                        sortPosition: 3,
                        active: false,
                        objectId: 3
                      },
                      {
                        name: "Förderscouting hinterfragt Kostenschätzung",
                        sortPosition: 4,
                        active: false,
                        objectId: 4
                      },
                      {
                        name:
                          "Förderscouting hinterfragt Kooperationspartner*innen",
                        sortPosition: 5,
                        active: false,
                        objectId: 5
                      },
                      {
                        name:
                          "Projektkoordinator holt erste Kostenangebote (über Fachamt) ein",
                        sortPosition: 6,
                        active: false,
                        objectId: 6
                      },
                      {
                        name:
                          "Protokollauszüge relevanter Ausschüsse im Projektsteckbrief dokumentieren",
                        sortPosition: 7,
                        active: false,
                        objectId: 7
                      }
                    ]
                  }
                ]
              },
              {
                objectName: "checkWithFunding",
                objectTitle: "Check beim Fördermittelgeber*in",
                name: "",
                text: "",
                desc:
                  "Welche Informationen müssen für ein zielführendes Gespräch ermittelt werden?",
                sortPosition: 3,
                objectId: 3,
                active: false,
                fixed: false,
                file: null,
                tasks: [
                  {
                    name:
                      "Worauf muss im Gespräch mit dem Fördermittelgeber*in geachtet werden?",
                    sortPosition: 1,
                    objectId: 1,
                    active: false,
                    children: [
                      {
                        name: "Fristen beachten",
                        sortPosition: 1,
                        active: false,
                        objectId: 1
                      },
                      {
                        name:
                          "Check des Projektsteckbriefes mit dem Fördermittelgeber*in",
                        sortPosition: 2,
                        active: false,
                        objectId: 2,
                        info: [
                          "Passen die Projektziele mit den Förderzielen zusammen?",
                          "Sind alle relevanten Themenkategorien in die Projektidee integriert?",
                          "Passt der Projektinhalte zum Förderzweck?",
                          "Passt der Projektmehrwert/ -nutzen zum Förderzweck?",
                          "Passen die Kostenschätzungen (Eigenmittel, Folgekosten) in das Fördervolumen?",
                          "Was ist hinsichtlich der Besitzverhältnisse zu beachten?",
                          "Was ist hinsichtlich der Kooperationspartner*innen zu beachten?"
                        ]
                      },
                      {
                        name:
                          "Check Rahmenbedingungen (allgemein) mit Projektplanung",
                        sortPosition: 3,
                        active: false,
                        objectId: 3,
                        info: ["Welchen Planungsstand sollte das Projekt haben"]
                      },
                      {
                        name:
                          "Check alternative Finanzierungs-/ Fördermöglichkeiten ",
                        sortPosition: 4,
                        active: false,
                        objectId: 4,
                        info: [
                          "Welche Möglichkeiten der Kumulierung gibt es?",
                          "Wie hoch muss der Eigenanteil sein"
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                objectName: "checkGuildlines",
                objectTitle: "Check Richtlinie (Langfassung)",
                name: "",
                text: "",
                desc:
                  "Worauf muss bei der Durchsicht von Langfassungen geachtet werden?",
                sortPosition: 4,
                objectId: 4,
                active: false,
                fixed: false,
                file: null,
                tasks: [
                  {
                    name:
                      "Worauf muss beim Abgleich des Projektsteckbriefes mit der Richtlinie geachtet werden?",
                    sortPosition: 1,
                    objectId: 1,
                    active: false,
                    children: [
                      {
                        name: "Fristen beachten",
                        sortPosition: 1,
                        active: false,
                        objectId: 1
                      },
                      {
                        name: "Check des Projektsteckbriefes mit Richtlinie",
                        sortPosition: 2,
                        active: false,
                        objectId: 2,
                        info: [
                          "Passen die Projektziele mit den Förderzielen zusammen?",
                          "Sind alle relevanten Themenkategorien in die Projektidee integriert?",
                          "Passt der Projektinhalte zum Förderzweck?",
                          "Passt der Projektmehrwert/ -nutzen zum Förderzweck?",
                          "Passen die Kostenschätzungen (Eigenmittel, Folgekosten) in das Fördervolumen?",
                          "Was ist hinsichtlich der Besitzverhältnisse zu beachten?",
                          "Was ist hinsichtlich der Kooperationspartner*innen zu beachten?"
                        ]
                      }
                    ]
                  },
                  {
                    name: "Grundlegende Förderbedingungen prüfen",
                    sortPosition: 2,
                    objectId: 2,
                    active: false,
                    children: [
                      {
                        name: "Antragsberechtigung prüfen",
                        sortPosition: 1,
                        active: false,
                        objectId: 1
                      },
                      {
                        name: "Brutto/netto Förderung prüfen",
                        sortPosition: 2,
                        active: false,
                        objectId: 2
                      },
                      {
                        name: "Schwellenwerte/Bagatellgrenze prüfen",
                        sortPosition: 3,
                        active: false,
                        objectId: 3
                      },
                      {
                        name:
                          "Spezielle Rahmenbedingungen und Bedeutung (z.B. AZA-Richtlinie) prüfen",
                        sortPosition: 4,
                        active: false,
                        objectId: 4
                      },
                      {
                        name:
                          "Projektsteckbrief ggf. nachjustieren/ Passgenauigkeit zum Förderprogramm herstellen",
                        sortPosition: 5,
                        active: false,
                        objectId: 5
                      },
                      {
                        name:
                          "Die richtigen Schlagwörter definieren/ adressieren",
                        sortPosition: 6,
                        active: false,
                        objectId: 6
                      },
                      {
                        name:
                          "Bei Unsicherheit weitere Rücksprache mit dem Fördermittelgeber*in",
                        sortPosition: 7,
                        active: false,
                        objectId: 7
                      },
                      {
                        name:
                          "Alternative Finanzierungs- und Fördermöglichkeiten prüfen",
                        sortPosition: 8,
                        active: false,
                        objectId: 8
                      }
                    ]
                  }
                ]
              },
              //Select Funding Information
              {
                objectName: "selectFunding",
                objectTitle: "Förderrichtlinie",
                name: "",
                text: "",
                funding: null,
                desc:
                  "Mit welcher Förderrichtlinie wurde das Projekt gefördert?",
                sortPosition: 5,
                objectId: 5,
                active: false,
                fixed: false,
                file: null,
              },
              //End Select Funding Information
            ]
          },
          {
            cardName: "preparationOfProject",
            cardTitle: "Antragsstellung: Ausarbeitung Antragsunterlagen",
            start: "",
            end: "",
            responsiblePerson: "",
            items: [
              {
                objectName: "checkContent",
                objectTitle: "Check Inhalt mit Richtlinie",
                name: "",
                text: "",
                desc:
                  "Welche inhaltlichen Hinweise gibt die Richtlinie, um die Förderfähigkeit des Projektantrages zu verbessern/zu erreichen?",
                sortPosition: 1,
                objectId: 1,
                active: false,
                fixed: false,
                file: null,
                tasks: [
                  {
                    name:
                      "Projektsteckbrief anhand der Richtlinien-Hinweise überarbeiten",
                    sortPosition: 1,
                    objectId: 1,
                    active: false,
                    children: [
                      {
                        name:
                          "Inhaltliche Anpassung des Projektsteckbriefes anhand User Aktivität 3",
                        sortPosition: 1,
                        active: false,
                        objectId: 1
                      },
                      {
                        name:
                          "Überführung des Projektsteckbriefes in den Projektantrag",
                        sortPosition: 2,
                        active: false,
                        objectId: 2
                      },
                      {
                        name: "Kostenschätzungen mit Fachamt präzisieren",
                        sortPosition: 3,
                        active: false,
                        objectId: 3
                      },
                      {
                        name:
                          "Budgetsituation beim Fördermittelgeber*in erfragen",
                        sortPosition: 4,
                        active: false,
                        objectId: 4
                      },
                      {
                        name:
                          "Klärung letzter offener Fragen nach der Bearbeitung (telefonisch, E-Mail",
                        sortPosition: 5,
                        active: false,
                        objectId: 5
                      }
                    ]
                  }
                ]
              },
              {
                objectName: "checkCooperations",
                objectTitle: "Ggf. Check Kooperationen",
                name: "",
                text: "",
                desc:
                  "Welche weiteren Kooperationen sind zielführend, um die Projektqualität nachhaltig zu verbessern?",
                sortPosition: 2,
                objectId: 2,
                active: false,
                fixed: false,
                file: null,
                tasks: [
                  {
                    name: "Weitere zielführende Kooperationen identifizieren",
                    sortPosition: 1,
                    objectId: 1,
                    active: false,
                    children: [
                      {
                        name:
                          "Beteiligte=Zielgruppe; PR/ÖA, Fachexperten, Kämmerei (hier breit denken)",
                        sortPosition: 1,
                        active: false,
                        objectId: 1
                      },
                      {
                        name:
                          "ggf. Kontaktaufnahme mit weiteren Kooperationspartnern via Mail, Telefon, Gespräch",
                        sortPosition: 2,
                        active: false,
                        objectId: 2
                      },
                      {
                        name: "Beteiligte aus allen Bereichen zusammenbringen",
                        sortPosition: 3,
                        active: false,
                        objectId: 3
                      },
                      {
                        name:
                          "Private und Öffentliche Akteure (Vereine, Verbände etc.)",
                        sortPosition: 4,
                        active: false,
                        objectId: 4
                      }
                    ]
                  },
                  {
                    name:
                      "Projektqualität durch weitere Kooperationspartner nachhaltig verbessern",
                    sortPosition: 2,
                    objectId: 2,
                    active: false,
                    children: [
                      {
                        name: "Abfrage von weiteren Bedarfen bei Zielgruppe",
                        sortPosition: 1,
                        active: false,
                        objectId: 1
                      },
                      {
                        name:
                          "Reflektion des Projektinhaltes und Auslotung der Kooperationsmöglichkeiten",
                        sortPosition: 2,
                        active: false,
                        objectId: 2
                      },
                      {
                        name:
                          "Vereinbarung der Zusammenarbeit und ggf. Schließung einer Kooperationsvereinbarung",
                        sortPosition: 3,
                        active: false,
                        objectId: 3
                      }
                    ]
                  }
                ]
              },
              {
                objectName: "checkSimilarProejcts",
                objectTitle: "Ggf. Check vergleichbare Projekte",
                name: "",
                text: "",
                desc:
                  "Wie findet man vergleichbare Projekte und nutzt die Informationen für die Verbesserung der Projektqualität?",
                sortPosition: 3,
                objectId: 3,
                active: false,
                fixed: true,
                file: null,
                tasks: [
                  {
                    name: "Vergleichbare Projekte identifizieren",
                    sortPosition: 1,
                    objectId: 1,
                    active: false,
                    children: [
                      {
                        name: "Suche im Internet",
                        sortPosition: 1,
                        active: false,
                        objectId: 1
                      },
                      {
                        name:
                          "Kontaktaufnahme und Austausch mit Projektinitiatoren",
                        sortPosition: 2,
                        active: false,
                        objectId: 2
                      },
                      {
                        name: "Suche über Netzwerkpartner und Kollegium",
                        sortPosition: 3,
                        active: false,
                        objectId: 3
                      },
                      {
                        name:
                          "Akteure mit Erfahrung mit Fördermittelgeber*in kontaktieren",
                        sortPosition: 4,
                        active: false,
                        objectId: 4
                      }
                    ]
                  },
                  {
                    name:
                      "Projektqualität durch Abgleich mit vergleichbaren Projekten nachhaltig verbessern",
                    sortPosition: 2,
                    objectId: 2,
                    active: false,
                    children: [
                      {
                        name:
                          "Transfer in den eigenen Projektkontext (Nachnutzung)",
                        sortPosition: 1,
                        active: false,
                        objectId: 1
                      }
                    ]
                  }
                ]
              },
              {
                objectName: "checkPlanning",
                objectTitle:
                  "Check Planung und Fördermittel mit allen relevanten Fachämtern",
                name: "",
                text: "",
                desc:
                  "Wie kann die interne Zusammenarbeit effizient koordiniert werden?",
                sortPosition: 4,
                objectId: 4,
                active: false,
                fixed: true,
                file: null,
                tasks: [
                  {
                    name: "Interne Fachabteilungen konkret einbeziehen",
                    sortPosition: 1,
                    objectId: 1,
                    active: false,
                    children: [
                      {
                        name:
                          "Vorherige Abstimmungen mit einzelnen Fachleuten zusammenfügen",
                        sortPosition: 1,
                        active: false,
                        objectId: 1
                      },
                      {
                        name: "Mögliche Einwände/ Projektsinn prüfen ",
                        sortPosition: 2,
                        active: false,
                        objectId: 2
                      },
                      {
                        name:
                          "Besprechung der formalen Anforderungen an die Projektunterlagen",
                        sortPosition: 3,
                        active: false,
                        objectId: 3
                      },
                      {
                        name:
                          "Abstimmung der Aufgaben/ ToDos mit den Fachämtern",
                        sortPosition: 4,
                        active: false,
                        objectId: 4
                      },
                      {
                        name:
                          "Koordination der Aufgaben mit zentralem Ansprechpartner*innen",
                        sortPosition: 5,
                        active: false,
                        objectId: 5
                      },
                      {
                        name:
                          "Beschlüsse zur Gestaltung des Projektes müssen getroffen werden",
                        sortPosition: 6,
                        active: false,
                        objectId: 6
                      },
                      {
                        name:
                          "Alternativen prüfen, ggf. ohne Förderung bei zu geringer Fördersumme",
                        sortPosition: 7,
                        active: false,
                        objectId: 7
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            cardName: "legitimation",
            cardTitle: "Antragsstellung: Beschlussfassung",
            start: "",
            end: "",
            responsiblePerson: "",
            items: [
              {
                objectName: "template",
                objectTitle: "Vorlage/ Diskussion der Projektunterlagen",
                name: "",
                text: "",
                desc:
                  "Was muss erarbeitet werden, um einen breiten Konsens herbei zu führen?",
                sortPosition: 1,
                objectId: 1,
                active: false,
                fixed: true,
                file: null,
                tasks: [
                  {
                    name:
                      "Projektantrag zielführend in Gemeindevertretung einbringen",
                    sortPosition: 1,
                    objectId: 1,
                    active: false,
                    children: [
                      {
                        name:
                          "Rechtzeitige Infos an Ausschüsse/ Gemeindevertretung/ Bürgermeister geben",
                        sortPosition: 1,
                        active: false,
                        objectId: 1,
                        info: ["Zusätzliche Gremien einbinden?"]
                      },
                      {
                        name:
                          "Schlüssiger Projektantrag -> transparent, nachvollziehbar, kurz, prägnant",
                        sortPosition: 2,
                        active: false,
                        objectId: 2
                      },
                      {
                        name: "Vollständige Projektunterlagen (möglichst)",
                        sortPosition: 3,
                        active: false,
                        objectId: 3
                      },
                      {
                        name: "Projekt-Informationsblatt/ One-Pager",
                        sortPosition: 4,
                        active: false,
                        objectId: 4
                      },
                      {
                        name:
                          "Kostenschätzungen, Kosten- und Finanzierungsplan und Folgekosten",
                        sortPosition: 5,
                        active: false,
                        objectId: 5
                      },
                      {
                        name:
                          "Präsentation durch Funktionsträger/ Projektkoordinator",
                        sortPosition: 6,
                        active: false,
                        objectId: 6
                      },
                      {
                        name:
                          "Moderation der finalen Diskussion zum Projektantrag",
                        sortPosition: 7,
                        active: false,
                        objectId: 7
                      },
                      {
                        name:
                          "Ggf. Umlaufbeschluss falls Entscheidungsgremium zu spät tagt",
                        sortPosition: 8,
                        active: false,
                        objectId: 8
                      }
                    ]
                  },
                  {
                    name: "Beschlussfassung vorbereiten und herbeiführen",
                    sortPosition: 2,
                    objectId: 2,
                    active: false,
                    info: [
                      "Wann und wie müssen Gemeindevertreter involviert werden? >> Mehrfach im Prozess"
                    ],
                    children: [
                      {
                        name:
                          "Beschlussvorlage auf Basis der Projektunterlagen anfertigen",
                        sortPosition: 1,
                        active: false,
                        objectId: 1
                      },
                      {
                        name: "Abstimmung der Beschlussvorlage",
                        sortPosition: 2,
                        active: false,
                        objectId: 2
                      },
                      {
                        name: "Anhörung Experten",
                        sortPosition: 3,
                        active: false,
                        objectId: 3
                      },
                      {
                        name: "Protokollauszug den Projektunterlagen beifügen",
                        sortPosition: 4,
                        active: false,
                        objectId: 4
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            cardName: "finalExamination",
            cardTitle: "Antragsstellung: Finale Antragseinreichun",
            start: "",
            end: "",
            responsiblePerson: "",
            items: [
              {
                objectName: "revision",
                objectTitle: "Überarbeitung Projektunterlagen",
                name: "",
                text: "",
                desc:
                  "Was muss bei der finalen Überarbeitung aller Projektunterlagen beachtet werden?",
                sortPosition: 1,
                objectId: 1,
                active: false,
                fixed: false,
                file: null,
                tasks: [
                  {
                    name: "Überarbeitung der Projektunterlagen",
                    sortPosition: 1,
                    objectId: 1,
                    active: false,
                    info: [
                      "Ist das Geld beim Projektträger vorhanden? (Budget pro Aufruf)"
                    ],
                    children: [
                      {
                        name:
                          "Diese Aktivität muss frühzeitig koordiniert werden",
                        sortPosition: 1,
                        active: false,
                        objectId: 1
                      },
                      {
                        name: "Zeit einplanen",
                        sortPosition: 2,
                        active: false,
                        objectId: 2
                      },
                      {
                        name:
                          "Einreichungsmodalitäten und technische Rahmenbedingungen (siehe EasyOnline)",
                        sortPosition: 3,
                        active: false,
                        objectId: 3
                      },
                      {
                        name:
                          "Inhaltliche Durchsicht aller Unterlagen (inklusive Anlagen, eigene Checkliste ob alles da ist)",
                        sortPosition: 4,
                        active: false,
                        objectId: 4
                      },
                      {
                        name: "Formale Durchsicht aller Unterlagen",
                        sortPosition: 5,
                        active: false,
                        objectId: 5
                      },
                      {
                        name: "Check Kostenplan mit Angeboten",
                        sortPosition: 6,
                        active: false,
                        objectId: 6
                      },
                      {
                        name: "Bei gravierenden Änderungen neuer Beschluss",
                        sortPosition: 7,
                        active: false,
                        objectId: 7
                      },
                      {
                        name: "Finale Besprechung mit dem Projektträger",
                        sortPosition: 8,
                        active: false,
                        objectId: 8
                      }
                    ]
                  }
                ]
              },
              {
                objectName: "signatures",
                objectTitle: "Einholung von Unterschriften",
                name: "",
                text: "",
                desc:
                  "Was muss bei der Einholung von Unterschriften beachtet werden?",
                sortPosition: 2,
                objectId: 2,
                active: false,
                fixed: false,
                file: null,
                tasks: [
                  {
                    name: "Koordination der Unterschriftensammlung",
                    sortPosition: 1,
                    objectId: 1,
                    active: false,
                    children: [
                      {
                        name:
                          "Rechtzeitige Informationen zu weitere Ablauf an alle Unterzeichner (Wann? Nach Antragstellung?)",
                        sortPosition: 1,
                        active: false,
                        objectId: 1
                      },
                      {
                        name: "Richtlinie geändert? -> Anpassung",
                        sortPosition: 2,
                        active: false,
                        objectId: 2
                      },
                      {
                        name:
                          "Rechtzeitige Übermittelung der Vorlagen (Antrag, Kooperationsvereinbarungen etc.)",
                        sortPosition: 3,
                        active: false,
                        objectId: 3
                      },
                      {
                        name:
                          "Abstimmung der finalen Sammlung von Unterschriften (Zeit und Postweg einplanen)",
                        sortPosition: 4,
                        active: false,
                        objectId: 4
                      },
                      {
                        name: "Prüfung der Unterschriften",
                        sortPosition: 5,
                        active: false,
                        objectId: 5
                      },
                      {
                        name: "Digitalisierung Archiv/ Ablage",
                        sortPosition: 6,
                        active: false,
                        objectId: 6
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        info: {
          contactName: "",
          phone: "",
          email: "",
          streetNo: "",
          postalCode: "",
          location: "",
        },
        municipality: "",
        editors: [],
        categories: [],
        tags: [],
        media: null
      },

      isLoading: false,
      dataLoaded: true,
      dateValidationIndex: 0
    };
  },
  computed: {
    datepickerLocale() {
      return {
        days: [
          this.$t("Sunday"),
          this.$t("Monday"),
          this.$t("Tuesday"),
          this.$t("Wednesday"),
          this.$t("Thursday"),
          this.$t("Friday"),
          this.$t("Saturday")
        ],
        daysShort: [
          this.$t("Sun"),
          this.$t("Mon"),
          this.$t("Tue"),
          this.$t("Wed"),
          this.$t("Thu"),
          this.$t("Fri"),
          this.$t("Sat")
        ],
        months: [
          this.$t("January"),
          this.$t("February"),
          this.$t("March"),
          this.$t("April"),
          this.$t("May"),
          this.$t("June"),
          this.$t("July"),
          this.$t("August"),
          this.$t("September"),
          this.$t("October"),
          this.$t("November"),
          this.$t("December")
        ],
        monthsShort: [
          this.$t("Jan"),
          this.$t("Feb"),
          this.$t("Mar"),
          this.$t("Apr"),
          this.$t("May"),
          this.$t("Jun"),
          this.$t("Jul"),
          this.$t("Aug"),
          this.$t("Sep"),
          this.$t("Oct"),
          this.$t("Nov"),
          this.$t("Dec")
        ]
      };
    },
    visibilityOptions() {
      return [
        {
          value: "only for me",
          label: this.$t("visibility.onlyMe")
        },
        {
          value: "all users",
          label: this.$t("visibility.allUsers")
        },
        {
          value: "listed only",
          label: this.$t("visibility.listedOnly")
        }
      ];
    },
    ideaProviderOptions() {
      return [
        { label: this.$t("Volunteering"), value: "volunteering" },
        { label: this.$t("Main Office"), value: "mainOffice" }
      ];
    },
    appUrl() {
      return process.env.VUE_APP_MAIN_URL;
    },
    userDetails() {
      return (
        this.$store.state.userCenter.user &&
        this.$store.state.userCenter.user.userDetails
      );
    },
    user() {
      return (
        !!this.$store.state.userCenter.user &&
        this.$store.state.userCenter.user.user
      );
    },
    checklist() {
      return (
        !!this.$route.params.id &&
        JSON.parse(
          JSON.stringify(this.$store.state.implementationChecklist.checklist)
        )
      );
    }
  },
  methods: {
    //Method to get project data
    async getProject() {
      await this.$store.dispatch("project/getSpecificProject", {
        id: Number(this.form.project.id)
      });
      this.setFunding();
    },
    updateCaption(value, index) {
      this.form.media[index].caption = value;
    },

    addCaption(image, index) {
      this.imageDialog = true;
      this.imageIndex = index;
      this.image = image;
    },
    changeProject(val) {
      this.form.project = val;
      //Call method to get project data when project is selected/onchange project to autofill the form
      this.getProject();
    },
    changeFunding(val) {
      this.form.funding = val;
    },
    disableDate(index) {
      if (index !== null || index !== undefined) {
        const disabledItems = this.form.items[index].items.map(item => {
          return item.active === true;
        });
        return !disabledItems.includes(true);
      }
    },
    dateFormatter,
    plannedEndOptions(date) {
      if (
        this.dateValidationIndex !== undefined ||
        this.dateValidationIndex !== null
      ) {
        if (!!this.form.items[this.dateValidationIndex].start) {
          const calendarDate = date.replace(/\//g, "-");
          return (
            calendarDate >= this.form.items[this.dateValidationIndex].start
          );
        } else {
          return true;
        }
      }
    },
    plannedStartOptions(date) {
      if (
        this.dateValidationIndex !== undefined ||
        this.dateValidationIndex !== null
      ) {
        if (!!this.form.items[this.dateValidationIndex].end) {
          const calendarDate = date.replace(/\//g, "-");
          return calendarDate <= this.form.items[this.dateValidationIndex].end;
        } else {
          return true;
        }
      }
    },
    imgPreview(val) {
      return {
        url: !!val.id ? `${this.appUrl}${val.url}` : URL.createObjectURL(val),
        name: val.name,
        caption: val.caption
      };
    },
    removeFile(card, element, index) {
      if (!!card && !!element) {
        this.form.items
          .find(item => item.cardName === card.cardName)
          .items.find(item => item.objectName === element.objectName)
          .file.splice(index, 1);
      }
    },
    removeImg(index) {
      this.form.media.splice(index, 1);
    },
    scrollToInvalidElement(ref) {
      const el = ref.$el;
      const target = getScrollTarget(el);
      const offset = el.offsetTop;
      const duration = 500;
      setScrollPosition(target, offset, duration);
    },
    onMove({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element;
      const draggedElement = draggedContext.element;
      return (
        (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      );
    },
    onChange({ moved }, items) {
      items.map((item, index) => {
        item.sortPosition = index + 1;
      });
    },
    // async validateDates() {
    //   const form = this.form.items.map((item, index) => {
    //     console.log("item", item, index);
    //     item.items.map((nestedItem, indexTwo) => {
    //       console.log("nestedItem", nestedItem, indexTwo);
    //       if (
    //         (item.start === "" || item.end === "") &&
    //         nestedItem.active === true
    //       ) {
    //         this.$refs.startDate[index].validate();
    //         this.$refs.startDate[index].validate();
    //       } else {
    //         console.log("No need to validate");
    //       }
    //     });
    //   });
    // },
    async submitNewChecklist(val) {
      const published = val;
      this.$refs.newChecklistForm.validate().then(async success => {
        if (success) {
          this.isLoading = true;
          const res = await this.$store.dispatch(
            "implementationChecklist/createNewChecklist",
            {
              data: {
                ...this.form,
                published: published,
                info: {
                  ...this.form.info,
                  contactName: this.userDetails.fullName,
                  phone: this.userDetails.phone,
                  email: this.user.email,
                  streetNo: this.userDetails.streetNo,
                  postalCode: this.userDetails.postalCode
                },
                municipality: {
                  id:
                    this.userDetails.municipality &&
                    this.userDetails.municipality.id
                },
                owner: {
                  id: this.user && this.user.id
                }
              }
            }
          );
          this.isLoading = false;
        } else {
          const elements = this.$refs.newChecklistForm.getValidationComponents();
          elements.map(el => {
            if (el.validate) {
              el.validate();
            }
          });
        }
      });
    },
    editChecklist(val) {
      const published = val;
      this.$refs.newChecklistForm.validate().then(async success => {
        if (success) {
          this.isLoading = true;
          const res = await this.$store.dispatch(
            "implementationChecklist/editChecklist",
            {
              data: {
                ...this.form,
                published: published
              }
            }
          );
          this.isLoading = false;
        } else {
          const elements = this.$refs.newChecklistForm.getValidationComponents();
          elements.map(el => {
            if (el.validate) {
              el.validate();
            }
          });
        }
      });
    },
    async setData() {
      if (!!this.$route.params && this.$route.params.id) {
        this.dataLoaded = false;
        this.$q.loading.show();
        await this.$store.dispatch(
          "implementationChecklist/getSpecificChecklist",
          {
            id: Number(this.$route.params.id)
          }
        );
        this.form = {
          ...this.form,
          ...this.checklist
        };
        await this.setItems(this.checklist);
        this.$q.loading.hide();
        this.dataLoaded = true;
      }
      this.$store.dispatch("userCenter/getUsers");
    },
    async setItems(checklist) {
      this.form.items = [
        {
          ...(await this.setInitialContact(checklist))
        },
        {
          ...(await this.setPreparation(checklist))
        },
        {
          ...(await this.setFundingResearch(checklist))
        },
        {
          ...(await this.setPreparationOfProject(checklist))
        },
        {
          ...(await this.setLegitimation(checklist))
        },
        {
          ...(await this.setFinalExamination(checklist))
        }
      ];
    },
    async setInitialContact(checklist) {
      const initialContactItem = this.form.items.find(item => item.cardName === "initialContact");
      const items = initialContactItem.items.map(item => {
        const newItem = { ...item };

        if (checklist.initialContact.hasOwnProperty(newItem.objectName)) {
          newItem.name = checklist.initialContact[newItem.objectName].name;
          newItem.text = checklist.initialContact[newItem.objectName].text;
          newItem.active = checklist.initialContact[newItem.objectName].active;
          newItem.tasks = checklist.initialContact[newItem.objectName].tasks;
          newItem.file = checklist.initialContact[newItem.objectName].file;
          newItem.id = checklist.initialContact[newItem.objectName].id;
          newItem.sortPosition = checklist.initialContact[newItem.objectName].sortPosition;
        }
        return newItem;
      });

      const sortedItems = items.sort((a, b) => (a.sortPosition - b.sortPosition));
      return {
        ...initialContactItem,
        start: checklist.initialContact.start,
        end: checklist.initialContact.end,
        id: checklist.initialContact.id,
        responsiblePerson: checklist.initialContact.responsiblePerson,
        items: sortedItems
      };
    },
    async setPreparation(checklist) {
      const preparationItem = this.form.items.find(item => item.cardName === "preparation");

      const items = preparationItem.items.map(item => {
        const newItem = { ...item };

        if (checklist.preparation.hasOwnProperty(newItem.objectName)) {
          newItem.name = checklist.preparation[newItem.objectName].name;
          newItem.text = checklist.preparation[newItem.objectName].text;
          newItem.active = checklist.preparation[newItem.objectName].active;
          newItem.tasks = checklist.preparation[newItem.objectName].tasks;
          newItem.file = checklist.preparation[newItem.objectName].file;
          newItem.id = checklist.preparation[newItem.objectName].id;
          newItem.sortPosition = checklist.preparation[newItem.objectName].sortPosition;
        }
        return newItem;
      });

      const sortedItems = items.sort((a, b) => (a.sortPosition - b.sortPosition));

      return {
        ...preparationItem,
        start: checklist.preparation.start,
        end: checklist.preparation.end,
        id: checklist.preparation.id,
        responsiblePerson: checklist.preparation.responsiblePerson,
        items: sortedItems
      };
    },
    async setFundingResearch(checklist) {
      const fundingResearchItem = this.form.items.find(item => item.cardName === "fundingResearch");

      const items = fundingResearchItem.items.map(item => {
        const newItem = { ...item };

        if (checklist.fundingResearch.hasOwnProperty(newItem.objectName)) {
          newItem.name = checklist.fundingResearch[newItem.objectName].name;
          newItem.text = checklist.fundingResearch[newItem.objectName].text;
          newItem.active = checklist.fundingResearch[newItem.objectName].active;
          newItem.tasks = checklist.fundingResearch[newItem.objectName].tasks;
          newItem.file = checklist.fundingResearch[newItem.objectName].file;
          newItem.id = checklist.fundingResearch[newItem.objectName].id;
          newItem.sortPosition = checklist.fundingResearch[newItem.objectName].sortPosition;
        }
        return newItem;
      });

      const sortedItems = items.sort((a, b) => (a.sortPosition - b.sortPosition));

      return {
        ...fundingResearchItem,
        start: checklist.fundingResearch.start,
        end: checklist.fundingResearch.end,
        id: checklist.fundingResearch.id,
        responsiblePerson: checklist.fundingResearch.responsiblePerson,
        items: sortedItems
      };
    },
    async setPreparationOfProject(checklist) {
      const preparationOfProjectItem = this.form.items.find(item => item.cardName === "preparationOfProject");

      const items = preparationOfProjectItem.items.map(item => {
        const newItem = { ...item };

        if (checklist.preparationOfProject.hasOwnProperty(newItem.objectName)) {
          newItem.name = checklist.preparationOfProject[newItem.objectName].name;
          newItem.text = checklist.preparationOfProject[newItem.objectName].text;
          newItem.active = checklist.preparationOfProject[newItem.objectName].active;
          newItem.tasks = checklist.preparationOfProject[newItem.objectName].tasks;
          newItem.file = checklist.preparationOfProject[newItem.objectName].file;
          newItem.id = checklist.preparationOfProject[newItem.objectName].id;
          newItem.sortPosition = checklist.preparationOfProject[newItem.objectName].sortPosition;
        }
        return newItem;
      });

      const sortedItems = items.sort((a, b) => (a.sortPosition - b.sortPosition));

      return {
        ...preparationOfProjectItem,
        start: checklist.preparationOfProject.start,
        end: checklist.preparationOfProject.end,
        id: checklist.preparationOfProject.id,
        responsiblePerson: checklist.preparationOfProject.responsiblePerson,
        items: sortedItems
      };
    },
    async setLegitimation(checklist) {
      const legitimationItem = this.form.items.find(item => item.cardName === "legitimation");

      const items = legitimationItem.items.map(item => {
        const newItem = { ...item };

        if (checklist.legitimation.hasOwnProperty(newItem.objectName)) {
          newItem.name = checklist.legitimation[newItem.objectName].name;
          newItem.text = checklist.legitimation[newItem.objectName].text;
          newItem.active = checklist.legitimation[newItem.objectName].active;
          newItem.tasks = checklist.legitimation[newItem.objectName].tasks;
          newItem.file = checklist.legitimation[newItem.objectName].file;
          newItem.id = checklist.legitimation[newItem.objectName].id;
          newItem.sortPosition = checklist.legitimation[newItem.objectName].sortPosition;
        }
        return newItem;
      });

      const sortedItems = items.sort((a, b) => (a.sortPosition - b.sortPosition));

      return {
        ...legitimationItem,
        start: checklist.legitimation.start,
        end: checklist.legitimation.end,
        id: checklist.legitimation.id,
        responsiblePerson: checklist.legitimation.responsiblePerson,
        items: sortedItems
      };
    },
    async setFinalExamination(checklist) {
      const finalExaminationItem = this.form.items.find(item => item.cardName === "finalExamination");

      const items = finalExaminationItem.items.map(item => {
        const newItem = { ...item };

        if (checklist.finalExamination.hasOwnProperty(newItem.objectName)) {
          newItem.name = checklist.finalExamination[newItem.objectName].name;
          newItem.text = checklist.finalExamination[newItem.objectName].text;
          newItem.active = checklist.finalExamination[newItem.objectName].active;
          newItem.tasks = checklist.finalExamination[newItem.objectName].tasks;
          newItem.file = checklist.finalExamination[newItem.objectName].file;
          newItem.id = checklist.finalExamination[newItem.objectName].id;
          newItem.sortPosition = checklist.finalExamination[newItem.objectName].sortPosition;
        }
        return newItem;
      });

      const sortedItems = items.sort((a, b) => (a.sortPosition - b.sortPosition));

      return {
        ...finalExaminationItem,
        start: checklist.finalExamination.start,
        end: checklist.finalExamination.end,
        id: checklist.finalExamination.id,
        responsiblePerson: checklist.finalExamination.responsiblePerson,
        items: sortedItems
      };
    },
    //Autofill form with selected project funding info
    setFunding() {
      this.$refs.userSelect.setUsers();
      this.$refs.categories.setCategories();
      this.$refs.tags.setTags();
      this.$refs.projectidea.setProject();
      this.$refs.fundings[0].setFunding();
      this.form.title = this.$store.state.project.project.title;
      this.form.project = { id: this.$store.state.project.project.id, title: this.$store.state.project.project.title };
      this.form.categories = this.$store.state.project.project.categories;
      this.form.editors = this.$store.state.project.project.editors;
      this.form.tags = this.$store.state.project.project.tags;
      this.form.funding = this.$store.state.project.project.fundingGuideline;

      if (this.form.funding[0]) {
        const fundingResearchItem = this.form.items.find(item => item.cardName === "fundingResearch");
        const selectFunding = fundingResearchItem.items.find(item => item.objectName === "selectFunding");
        selectFunding.active = true;
      }
    }
  },
  mounted() {
    //If redirected from project idea creation page, auto fills form.
    if (this.$route.query.red) {
      this.setFunding();
    }
    this.setData();
  },
  beforeDestroy() {
    this.$q.loading.hide();
  }
};
</script>

<style lang="scss">
.toggleGap {
  gap: 15px;
  > button {
    border-radius: 10px !important;
    border: 1px solid $yellow;
  }
}
.flip-list-move {
  transition: transform 0.5s;
}
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
.movingClass {
  background: $blue-1;
}
.listClass {
  list-style: none;
  li {
    font-size: 14px;
    margin-block: 0.5em;
  }
  li::before {
    content: "\2022";
    color: $primary;
    font-weight: bold;
    display: inline-block;
    width: 2em;
    margin-left: -1em;
    margin-right: -1em;
  }
}
.disabledClass {
  .q-field__inner .q-field__control input {
    color: black;
    opacity: 1 !important;
  }
  .q-field__inner .q-field__control:before {
    border-color: $primary;
  }
}
.text-grey {
  color: #5d5a5a !important;
}
</style>
