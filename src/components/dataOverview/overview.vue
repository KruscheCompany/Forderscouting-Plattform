<template>
  <div class="q-my-lg">
    <q-table
      class="radius-20 shadow-1 pagination-no-shadow"
      :class="expanded ? 'yellowBg' : ''"
      :data="data"
      :columns="columns"
      row-key="name"
      :hide-bottom="!isInPage && data.length > 0"
      :hide-header="!isInPage"
      :visible-columns="isInPage ? visibleColumns : ['title']"
      :filter="filter"
      :filter-method="filterTable"
      :pagination="{
        sortBy: 'id',
        descending: true,
        page: 1,
        rowsPerPage: isInPage ? 10 : 5,
      }"
      :rows-per-page-label="$t('Records per page')"
      :no-data-label="$t('No data')"
      :no-results-label="$t('No results')"
      ref="table"
    >
      <template v-slot:top>
        <div class="col-12">
          <q-expansion-item
            header-class="no-padding items-center"
            expand-icon-class="hidden"
            v-model="expanded"
            expand-icon-toggle
          >
            <template v-slot:header>
              <div v-if="isInPage" class="col-8 col-md-4">
                <q-input
                  borderless
                  outlined
                  class="bg-white input-radius-6 no-shadow q-mb-sm q-mt-sm"
                  v-model="search"
                  :placeholder="$t('Search')"
                  dense
                  role="searcbox"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <q-space />
              <div class="col-md-4 text-right">
                <q-btn
                  @click="expanded = !expanded"
                  icon="filter_alt"
                  color="primary"
                  class="radius-6"
                  flat
                  label="Filter"
                >
                </q-btn>
              </div>
            </template>
            <div class="row q-px-xs q-mt-md q-col-gutter-x-lg">
              <div class="col-6 col-md-3">
                <p class="text-black q-mb-xs font-16">
                  {{ $t("statsTable.type") }}
                </p>
                <q-select
                  clearable
                  class="no-shadow q-mb-lg input-radius-4"
                  options-selected-class="text-primary text-weight-600"
                  color="primary"
                  bg-color="white"
                  multiple
                  emit-value
                  filled
                  :options="typeOptions"
                  v-model="type"
                >
                  <template v-slot:selected>
                    <template v-if="!!type && type.length > 0">
                      <span v-for="(item, index) in type" :key="index">
                        {{ index > 0 ? ", " : "" }}
                        {{ $t(item) }}
                      </span>
                    </template>
                    <template v-else>
                      <span class="text-grey font-16">
                        {{ $t("Search") }}
                      </span>
                    </template>
                  </template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                      <q-item-section>
                        <q-item-label>{{ scope.opt.label }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div class="col-6 col-md-3">
                <p class="text-black q-mb-xs font-16">
                  {{ $t("statsTable.categories") }}
                </p>
                <q-select
                  class="no-shadow q-mb-lg input-radius-4"
                  color="primary"
                  bg-color="white"
                  :label="$t('Search')"
                  filled
                  multiple
                  clearable
                  :options="categoryOptions"
                  v-model="category"
                >
                </q-select>
              </div>
              <div class="col-6 col-md-3">
                <p class="text-black q-mb-xs font-16">
                  {{ $t("Tags") }}
                </p>
                <q-select
                  class="no-shadow q-mb-lg input-radius-4"
                  color="primary"
                  bg-color="white"
                  :label="$t('Search')"
                  filled
                  multiple
                  clearable
                  :options="tagKeywordsOptions"
                  v-model="tagsKeywords"
                >
                </q-select>
              </div>
              <div class="col-6 col-md-3">
                <p class="text-black q-mb-xs font-16">
                  {{ $t("statsTable.projectCoordinator") }}
                </p>
                <q-select
                  class="no-shadow q-mb-lg input-radius-4"
                  options-selected-class="text-primary text-weight-600"
                  color="primary"
                  clearable
                  bg-color="white"
                  filled
                  multiple
                  :options="projectCoordinatorOptions"
                  v-model="projectCoordinator"
                >
                  <template v-slot:selected>
                    <template
                      v-if="!!projectCoordinator && projectCoordinator.length > 0"
                    >
                      <span v-for="(item, index) in projectCoordinator" :key="index">
                        {{ index > 0 ? ", " : "" }}
                        {{ item.user }}
                      </span>
                    </template>
                    <template v-else>
                      <span class="text-grey font-16">
                        {{ $t("Search") }}
                      </span>
                    </template>
                  </template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                      <q-item-section>
                        <q-item-label
                          ><span class="text-grey-7">{{ scope.opt.location }}</span> -
                          {{ scope.opt.user }}</q-item-label
                        >
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div class="col-6 col-md-3">
                <p class="text-black q-mb-xs font-16">
                  {{ $t("fundingsCol.created_at") }}
                </p>
                <q-input
                  filled
                  clearable
                  v-model="createdAtStart"
                  class="no-shadow q-mb-lg input-radius-4"
                  color="primary"
                  bg-color="white"
                  :placeholder="$t('From')"
                  @click="$refs.createdAtStart.show()"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        ref="createdAtStart"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          @input="$refs.createdAtStart.hide()"
                          v-model="createdAtStart"
                          mask="DD.MM.YYYY"
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
              <div class="col-6 col-md-3 q-mt-lg">
                <p class="text-black q-mb-xs font-16"></p>
                <q-input
                  clearable
                  filled
                  :disable="!createdAtStart"
                  v-model="createdAtEnd"
                  class="no-shadow q-mb-lg input-radius-4"
                  color="primary"
                  bg-color="white"
                  :placeholder="$t('Until')"
                  @click="$refs.createdAtEnd.show()"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        ref="createdAtEnd"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          @input="$refs.createdAtEnd.hide()"
                          v-model="createdAtEnd"
                          mask="DD.MM.YYYY"
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

              <div class="col-6 col-md-3">
                <q-btn
                  @click="clearFilters"
                  color="primary"
                  class="radius-6"
                  style="margin-top: 40px; font-size: 12px"
                  unelevated
                  :label="$t('Clear filters')"
                  :aria-label="$t('Clear filters')"
                >
                </q-btn>
              </div>

              <!-- <div class="col-6 col-md-3">
                <p class="text-black q-mb-xs font-16">
                  {{ $t("statsTable.endDate") }}
                </p>
                <q-input
                  clearable
                  filled
                  v-model="endDateStart"
                  class="no-shadow q-mb-lg input-radius-4"
                  color="primary"
                  bg-color="white"
                  :placeholder="$t('From')"
                  @click="$refs.endDateStart.show()"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        ref="endDateStart"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          @input="$refs.endDateStart.hide()"
                          v-model="endDateStart"
                          mask="DD.MM.YYYY"
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
              <div class="col-6 col-md-3 q-mt-lg">
                <p class="text-black q-mb-xs font-16"></p>
                <q-input
                  clearable
                  filled
                  :disable="!endDateStart"
                  v-model="endDateEnd"
                  class="no-shadow q-mb-lg input-radius-4"
                  color="primary"
                  bg-color="white"
                  :placeholder="$t('Until')"
                  @click="$refs.endDateEnd.show()"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        ref="endDateEnd"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          @input="$refs.endDateEnd.hide()"
                          v-model="endDateEnd"
                          mask="DD.MM.YYYY"
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
              </div> -->
            </div>
          </q-expansion-item>
        </div>
      </template>
      <template v-slot:header="props">
        <q-tr class="tableHeader" :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="font-14 text-black"
          >
            {{ col.label }}
          </q-th>
          <q-th auto-width />
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td
            @click="view(props.row)"
            auto-width
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="font-14 cursor-pointer"
          >
            {{
              col.value && col.value.length > 48
                ? col.value.substring(0, 48) + "..."
                : col.value
            }}
          </q-td>
          <q-td class="text-right" auto-width>
            <q-btn
              size="md"
              color="primary"
              round
              flat
              dense
              icon="more_vert"
              aria-label="Optionen"
            >
              <q-menu transition-show="jump-down" transition-hide="jump-up">
                <q-list style="min-width: 140px">
                  <q-item clickable @click="view(props.row)">
                    <q-item-section
                      ><span class="text-right font-14">
                        {{ $t("myDataTableOptions.view") }}
                        <q-icon
                          v-if="!viewIsLoading"
                          size="sm"
                          class="text-blue"
                          name="visibility"
                        />
                        <q-spinner
                          v-else
                          color="primary"
                          size="sm"
                          :thickness="2"
                        /> </span
                    ></q-item-section>
                  </q-item>
                  <q-item
                    v-if="
                      isAdmin || (props.row && props.row.type !== 'funding' && !isGuest)
                    "
                    clickable
                    @click="editItem(props.row)"
                  >
                    <q-item-section
                      ><span class="text-right font-14">
                        {{ $t("myDataTableOptions.edit") }}

                        <q-icon
                          v-if="!editIsLoading"
                          size="sm"
                          class="text-blue"
                          name="edit"
                        />
                        <q-spinner
                          v-else
                          color="primary"
                          size="sm"
                          :thickness="2"
                        /> </span
                    ></q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="addToWatchlist(props.row)">
                    <q-item-section
                      ><span class="text-right font-14">
                        {{ $t("myDataTableOptions.bookmark") }}

                        <q-icon
                          v-if="!watchlistIsLoading"
                          size="sm"
                          class="text-blue"
                          name="star_rate"
                        />
                        <q-spinner
                          v-else
                          color="primary"
                          size="sm"
                          :thickness="2"
                        /> </span
                    ></q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    v-close-popup
                    @click="archiveItem(props.row)"
                    v-if="
                      isAdmin ||
                      (props.row &&
                        props.row.type !== 'funding' &&
                        (!!props.row.owner && props.row.owner.id) ===
                          (!!loggedInUser && loggedInUser.id))
                    "
                  >
                    <q-item-section
                      ><span class="text-right font-14">
                        {{ $t("myDataTableOptions.archive") }}

                        <q-icon
                          v-if="!archiveIsLoading"
                          size="sm"
                          class="text-blue"
                          name="inventory"
                        />
                        <q-spinner v-else color="red" size="sm" :thickness="2" /> </span
                    ></q-item-section>
                  </q-item>
                  <q-item
                    v-if="isAdmin"
                    clickable
                    v-close-popup
                    @click="deleteItem(props.row)"
                  >
                    <q-item-section
                      ><span class="text-right font-14 text-red">
                        {{ $t("myDataTableOptions.delete") }}

                        <q-icon
                          v-if="!deleteIsLoading"
                          size="sm"
                          class="text-red"
                          name="delete"
                        />
                        <q-spinner v-else color="red" size="sm" :thickness="2" /> </span
                    ></q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <DeleteDialog
      :id="itemId"
      :tab="tab"
      :dialogState="deleteDialog"
      @update="closeDialog($event), (itemId = null), (tab = null)"
    />
    <RequestAccessDialog
      :id="itemId"
      :tab="tab"
      :type="itemType"
      :dialogState="requestDialog"
      @update="(requestDialog = $event), (itemId = null), (itemType = null)"
    />
  </div>
</template>

<script>
import { dateFormatter } from "src/boot/dateFormatter";
import DeleteDialog from "components/data/DeleteDialog.vue";
import RequestAccessDialog from "components/data/RequestAccessDialog.vue";

export default {
  name: "dataOverview",
  components: {
    DeleteDialog,
    RequestAccessDialog,
  },
  data() {
    return {
      deleteDialog: false,
      itemId: null,
      tab: null,
      itemType: null,
      expanded: false,
      search: "",
      type: null,
      category: null,
      tagsKeywords: null,
      projectCoordinator: null,
      publishDateStart: "",
      publishDateEnd: "",
      endDateStart: "",
      endDateEnd: "",
      createdAtStart: "",
      createdAtEnd: "",
      visibleColumns: [
        "title",
        "type",
        "categories",
        "user",
        // "plannedStart",
        // "plannedEnd",
        "createdAtStart",
      ],
      viewIsLoading: false,
      editIsLoading: false,
      deleteIsLoading: false,
      archiveIsLoading: false,
      watchlistIsLoading: false,
      requestDialog: false,
    };
  },
  methods: {
    closeDialog(val) {
      this.deleteDialog = val;
      this.getData();
    },
    filterTable(rows, terms) {
      let search = terms.name ? terms.name.toLowerCase() : "";
      let category = terms.category ? terms.category : null;
      let type = terms.type ? terms.type : null;
      let tagsKeywords = terms.tagsKeywords ? terms.tagsKeywords : null;
      let projectCoordinator = terms.projectCoordinator ? terms.projectCoordinator : null;
      let publishDateStart = terms.publishDateStart ? terms.publishDateStart : "";
      let publishDateEnd = terms.publishDateEnd ? terms.publishDateEnd : "";
      let endDateStart = terms.endDateStart ? terms.endDateStart : "";
      let endDateEnd = terms.endDateEnd ? terms.endDateEnd : "";
      let createdAtStart = terms.createdAtStart ? terms.createdAtStart : "";
      let createdAtEnd = terms.createdAtEnd ? terms.createdAtEnd : "";
      let filteredRows = rows;
      if (!!search) {
        filteredRows = filteredRows.filter((row) => {
          return (
            row.title.toLowerCase().includes(search) ||
            row.tags.find((tag) => tag.title.toLowerCase().includes(search))
          );
        });
      }
      if (!!type && type.length > 0) {
        filteredRows = filteredRows.filter((row) => {
          return type.includes(row.type.toLowerCase());
        });
      }
      if (!!category && category.length > 0) {
        filteredRows = filteredRows.filter((row) => {
          return row.categories.find((cat) => category.includes(cat.title));
        });
      }
      if (!!tagsKeywords && tagsKeywords.length > 0) {
        filteredRows = filteredRows.filter((row) => {
          return row.tags.find((tag) => tagsKeywords.includes(tag.title));
        });
      }
      if (!!projectCoordinator && projectCoordinator.length > 0) {
        filteredRows = filteredRows.filter((row) => {
          return projectCoordinator.find((item) => {
            return item.user.includes(!!row.owner && row.owner.username);
          });
        });
      }
      if (!!publishDateStart || !!publishDateEnd) {
        const publishDateStartParts = publishDateStart.split(".");
        const startDate = new Date(
          publishDateStartParts[2],
          publishDateStartParts[1] - 1,
          publishDateStartParts[0]
        );
        const publishDateEndParts = publishDateEnd.split(".");
        const endDate = new Date(
          publishDateEndParts[2],
          publishDateEndParts[1] - 1,
          publishDateEndParts[0]
        );
        filteredRows = rows.filter((row) => {
          if (!!row.plannedStart && !!row.plannedEnd) {
            if (
              endDate instanceof Date &&
              !isNaN(endDate) &&
              startDate instanceof Date &&
              !isNaN(startDate)
            ) {
              return (
                new Date(row.plannedStart) >= startDate &&
                new Date(row.plannedStart) <= endDate
              );
            } else if (endDate instanceof Date && !isNaN(endDate)) {
              return new Date(row.plannedStart) <= endDate;
            } else if (startDate instanceof Date && !isNaN(startDate)) {
              return new Date(row.plannedStart) >= startDate;
            }
          }
        });
      }
      if (!!endDateStart || !!endDateEnd) {
        const endDateStartParts = endDateStart.split(".");
        const startDate = new Date(
          endDateStartParts[2],
          endDateStartParts[1] - 1,
          endDateStartParts[0]
        );
        const endDateEndParts = endDateEnd.split(".");
        const endDate = new Date(
          endDateEndParts[2],
          endDateEndParts[1] - 1,
          endDateEndParts[0]
        );
        filteredRows = rows.filter((row) => {
          if (!!row.plannedStart && !!row.plannedEnd) {
            if (
              endDate instanceof Date &&
              !isNaN(endDate) &&
              startDate instanceof Date &&
              !isNaN(startDate)
            ) {
              return (
                new Date(row.plannedEnd) >= startDate &&
                new Date(row.plannedEnd) <= endDate
              );
            } else if (endDate instanceof Date && !isNaN(endDate)) {
              return new Date(row.plannedEnd) <= endDate;
            } else if (startDate instanceof Date && !isNaN(startDate)) {
              return new Date(row.plannedEnd) >= startDate;
            }
          }
        });
      }
      if (!!createdAtStart || !!createdAtEnd) {
        const createdAtStartParts = createdAtStart.split(".");
        const startDate = new Date(
          createdAtStartParts[2],
          createdAtStartParts[1] - 1,
          createdAtStartParts[0]
        );
        const createdAtEndParts = createdAtEnd.split(".");
        const endDate = new Date(
          createdAtEndParts[2],
          createdAtEndParts[1] - 1,
          createdAtEndParts[0]
        );
        filteredRows = rows.filter((row) => {
          if (!!row.createdAt) {
            if (
              endDate instanceof Date &&
              !isNaN(endDate) &&
              startDate instanceof Date &&
              !isNaN(startDate)
            ) {
              return (
                new Date(row.createdAt) >= startDate && new Date(row.createdAt) <= endDate
              );
            } else if (endDate instanceof Date && !isNaN(endDate)) {
              return new Date(row.createdAt) <= endDate;
            } else if (startDate instanceof Date && !isNaN(startDate)) {
              return new Date(row.createdAt) >= startDate;
            }
          }
        });
      }
      return filteredRows;
    },
    dateFormatter,
    async view(row) {
      const userMunicipality = this.$store.state.userCenter.user.userDetails.municipality
        .id;
      const id = row && row.id;
      this.itemId = row && row.id;
      this.viewIsLoading = true;
      if (row.type === "project") {
        this.tab = "projectIdeas";
        if (
          row.visibility === "listed only" &&
          (!!row.owner && row.owner.id) !==
            (!!this.loggedInUser && this.loggedInUser.id) &&
          !this.isAdmin
        ) {
          // if (this.isGuest && userMunicipality != row.municipality.id) {
          //   const hasReaderAccess =
          //     !!row.readers &&
          //     row.readers.filter(
          //       user => user.id === (!!this.loggedInUser && this.loggedInUser.id)
          //     );
          //   const hasEditorAccess =
          //     !!row.editors &&
          //     row.editors.filter(
          //       user => user.id === (!!this.loggedInUser && this.loggedInUser.id)
          //     );
          //   if (hasReaderAccess.length > 0 || hasEditorAccess.length > 0) {
          //     this.$router.push({ path: `/user/newProjectIdea/${id}` });
          //   } else {
          //     this.itemId = row && row.id;
          //     this.itemType = "view";
          //     this.requestDialog = true;
          //   }
          // } else if (this.isGuest && userMunicipality == row.municipality.title) {
          //   this.$router.push({ path: `/user/newProjectIdea/${id}` });
          // }
          const hasReaderAccess =
            !!row.readers &&
            row.readers.filter(
              (user) => user.id === (!!this.loggedInUser && this.loggedInUser.id)
            );
          const hasEditorAccess =
            !!row.editors &&
            row.editors.filter(
              (user) => user.id === (!!this.loggedInUser && this.loggedInUser.id)
            );
          if (hasReaderAccess.length > 0 || hasEditorAccess.length > 0) {
            this.$router.push({ path: `/user/newProjectIdea/${id}` });
          } else {
            this.itemId = row && row.id;
            this.itemType = "view";
            this.requestDialog = true;
          }
        } else {
          this.$router.push({ path: `/user/newProjectIdea/${id}` });
        }
      } else if (row.type === "funding") {
        this.tab = "fundings";
        if (
          row.visibility === "listed only" &&
          (!!row.owner && row.owner.id) !==
            (!!this.loggedInUser && this.loggedInUser.id) &&
          !this.isAdmin
        ) {
          // if (this.isGuest) {
          //   this.$router.push({ path: `/user/newFunding/${id}` });
          // } else {
          //   const hasReaderAccess =
          //     !!row.readers &&
          //     row.readers.filter(
          //       user => user.id === (!!this.loggedInUser && this.loggedInUser.id)
          //     );
          //   const hasEditorAccess =
          //     !!row.editors &&
          //     row.editors.filter(
          //       user => user.id === (!!this.loggedInUser && this.loggedInUser.id)
          //     );
          //   if (hasReaderAccess.length > 0 || hasEditorAccess.length > 0) {
          //     this.$router.push({ path: `/user/newFunding/${id}` });
          //   } else {
          //     this.itemId = row && row.id;
          //     this.itemType = "view";
          //     this.requestDialog = true;
          //   }
          // }
          const hasReaderAccess =
            !!row.readers &&
            row.readers.filter(
              (user) => user.id === (!!this.loggedInUser && this.loggedInUser.id)
            );
          const hasEditorAccess =
            !!row.editors &&
            row.editors.filter(
              (user) => user.id === (!!this.loggedInUser && this.loggedInUser.id)
            );
          if (hasReaderAccess.length > 0 || hasEditorAccess.length > 0) {
            this.$router.push({ path: `/user/newFunding/${id}` });
          } else {
            this.itemId = row && row.id;
            this.itemType = "view";
            this.requestDialog = true;
          }
        } else {
          this.$router.push({ path: `/user/newFunding/${id}` });
        }
      } else {
        this.tab = "implementationChecklist";
        if (
          row.visibility === "listed only" &&
          (!!row.owner && row.owner.id) !==
            (!!this.loggedInUser && this.loggedInUser.id) &&
          !this.isAdmin
        ) {
          // if (this.isGuest && userMunicipality != row.municipality.id) {
          //   const hasReaderAccess =
          //     !!row.readers &&
          //     row.readers.filter(
          //       user => user.id === (!!this.loggedInUser && this.loggedInUser.id)
          //     );
          //   const hasEditorAccess =
          //     !!row.editors &&
          //     row.editors.filter(
          //       user => user.id === (!!this.loggedInUser && this.loggedInUser.id)
          //     );
          //   if (hasReaderAccess.length > 0 || hasEditorAccess.length > 0) {
          //     this.$router.push({ path: `/user/newChecklist/${id}` });
          //   } else {
          //     this.itemId = row && row.id;
          //     this.itemType = "view";
          //     this.requestDialog = true;
          //   }
          // } else if (this.isGuest && userMunicipality == row.municipality.title) {
          //   this.$router.push({ path: `/user/newChecklist/${id}` });
          // }
          const hasReaderAccess =
            !!row.readers &&
            row.readers.filter(
              (user) => user.id === (!!this.loggedInUser && this.loggedInUser.id)
            );
          const hasEditorAccess =
            !!row.editors &&
            row.editors.filter(
              (user) => user.id === (!!this.loggedInUser && this.loggedInUser.id)
            );
          if (hasReaderAccess.length > 0 || hasEditorAccess.length > 0) {
            this.$router.push({ path: `/user/newChecklist/${id}` });
          } else {
            this.itemId = row && row.id;
            this.itemType = "view";
            this.requestDialog = true;
          }
        } else {
          this.$router.push({ path: `/user/newChecklist/${id}` });
        }
      }
      this.viewIsLoading = false;
    },
    async editItem(row) {
      const id = row && row.id;
      this.itemId = row && row.id;
      this.editIsLoading = true;
      if (row.type === "project") {
        this.tab = "projectIdeas";
        if (
          (!!row.owner && row.owner.id) !==
            (!!this.loggedInUser && this.loggedInUser.id) &&
          !this.isAdmin
        ) {
          const hasEditorAccess =
            !!row.editors &&
            row.editors.filter(
              (user) => user.id === (!!this.loggedInUser && this.loggedInUser.id)
            );
          if (hasEditorAccess.length > 0) {
            this.$router.push({ path: `/user/newProjectIdea/edit/${id}` });
          } else {
            this.itemId = row && row.id;
            this.itemType = "edit";
            this.requestDialog = true;
          }
        } else {
          this.$router.push({ path: `/user/newProjectIdea/edit/${id}` });
        }
      } else if (row.type === "funding") {
        this.tab = "fundings";
        if (
          (!!row.owner && row.owner.id) !==
            (!!this.loggedInUser && this.loggedInUser.id) &&
          !this.isAdmin
        ) {
          const hasEditorAccess =
            !!row.editors &&
            row.editors.filter(
              (user) => user.id === (!!this.loggedInUser && this.loggedInUser.id)
            );
          if (hasEditorAccess.length > 0) {
            this.$router.push({ path: `/user/newFunding/edit/${id}` });
          } else {
            this.itemId = row && row.id;
            this.itemType = "edit";
            this.requestDialog = true;
          }
        } else {
          this.$router.push({ path: `/user/newFunding/edit/${id}` });
        }
      } else {
        this.tab = "implementationChecklist";
        if (
          (!!row.owner && row.owner.id) !==
            (!!this.loggedInUser && this.loggedInUser.id) &&
          !this.isAdmin
        ) {
          const hasEditorAccess =
            !!row.editors &&
            row.editors.filter(
              (user) => user.id === (!!this.loggedInUser && this.loggedInUser.id)
            );
          if (hasEditorAccess.length > 0) {
            this.$router.push({ path: `/user/newChecklist/edit/${id}` });
          } else {
            this.itemId = row && row.id;
            this.itemType = "edit";
            this.requestDialog = true;
          }
        } else {
          this.$router.push({ path: `/user/newChecklist/edit/${id}` });
        }
      }
      this.editIsLoading = false;
    },
    async deleteItem(row) {
      if (row.type === "project") {
        this.tab = "projectIdeas";
        this.itemId = row && row.id;
      } else if (row.type === "funding") {
        this.tab = "fundings";
        this.itemId = row && row.id;
      } else {
        this.tab = "implementationChecklist";
        this.itemId = row && row.id;
      }
      this.deleteDialog = true;
    },
    async archiveItem(row) {
      if (row.type === "project") {
        this.archiveIsLoading = true;
        const id = row && row.id;
        await this.$store.dispatch("project/archiveProjectIdea", {
          id: id,
        });
        this.archiveIsLoading = false;
        this.getData();
      } else if (row.type === "funding") {
        this.archiveIsLoading = true;
        const id = row && row.id;
        await this.$store.dispatch("funding/archiveFunding", {
          id: id,
        });
        this.archiveIsLoading = false;
        this.getData();
      } else {
        this.archiveIsLoading = true;
        const id = row && row.id;
        await this.$store.dispatch("implementationChecklist/archiveChecklist", {
          id: id,
        });
        this.archiveIsLoading = false;
        this.getData();
      }
    },
    async addToWatchlist(row) {
      if (row.type === "project") {
        this.watchlistIsLoading = true;
        const id = row && row.id;
        await this.$store.dispatch("project/addToWatchlist", {
          id: id,
        });
        this.watchlistIsLoading = false;
        this.getData();
      } else if (row.type === "funding") {
        this.watchlistIsLoading = true;
        const id = row && row.id;
        await this.$store.dispatch("funding/addToWatchlist", {
          id: id,
        });
        this.watchlistIsLoading = false;
        this.getData();
      } else {
        this.watchlistIsLoading = true;
        const id = row && row.id;
        await this.$store.dispatch("implementationChecklist/addToWatchlist", {
          id: id,
        });
        this.watchlistIsLoading = false;
        this.getData();
      }
    },

    async clearFilters() {
      this.search = "";
      this.type = null;
      this.category = null;
      this.tagsKeywords = null;
      this.projectCoordinator = null;
      this.publishDateStart = "";
      this.publishDateEnd = "";
      this.endDateStart = "";
      this.endDateEnd = "";
      this.createdAtStart = "";
      this.createdAtEnd = "";
    },
    // goToPage(page) {
    //   if (page === "projectIdeas") {
    //     this.$store.commit("project/setSpecificProject", null);
    //     this.$router.push({ path: "/user/newProjectIdea" });
    //   } else if (page === "fundings") {
    //     this.$store.commit("funding/setSpecificFunding", null);
    //     this.$router.push({ path: "/user/newFunding" });
    //   } else {
    //     this.$router.push({ path: "/user/newChecklist" });
    //   }
    // },
    getData() {
      this.$store.dispatch("userCenter/getDataOverview");
    },
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
          this.$t("Saturday"),
        ],
        daysShort: [
          this.$t("Sun"),
          this.$t("Mon"),
          this.$t("Tue"),
          this.$t("Wed"),
          this.$t("Thu"),
          this.$t("Fri"),
          this.$t("Sat"),
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
          this.$t("December"),
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
          this.$t("Dec"),
        ],
      };
    },
    typeOptions() {
      return [
        {
          value: "project",
          label: this.$t("project"),
        },
        {
          value: "funding",
          label: this.$t("funding"),
        },
        {
          value: "checklist",
          label: this.$t("checklist"),
        },
      ];
    },
    categoryOptions() {
      const categories = [];
      this.data.map((item) =>
        item.categories.map((cat) => (!!cat.title ? categories.push(cat.title) : null))
      );
      return [...new Set(categories)].sort();
    },
    tagKeywordsOptions() {
      const tagsKeywords = [];
      this.data.map((item) =>
        item.tags.map((tag) => (!!tag.title ? tagsKeywords.push(tag.title) : null))
      );
      return [...new Set(tagsKeywords)].sort();
    },
    projectCoordinatorOptions() {
      const users = [];
      this.data.map((item) =>
        !!item.owner && !!item.owner.username
          ? users.push({
              user: item.owner.username,
              location:
                !!item.owner &&
                !!item.owner.user_detail &&
                !!item.owner.user_detail.municipality &&
                item.owner.user_detail.municipality.title,
            })
          : null
      );
      return [...new Map(users.map((item) => [item["user"], item])).values()];
    },
    filter() {
      // return object that contains all v-models. This will be passed to the filter method
      const filters = {
        name: this.search,
        type: this.type,
        category: this.category,
        tagsKeywords: this.tagsKeywords,
        projectCoordinator: this.projectCoordinator,
        publishDateStart: this.publishDateStart,
        publishDateEnd: this.publishDateEnd,
        endDateStart: this.endDateStart,
        endDateEnd: this.endDateEnd,
        createdAtStart: this.createdAtStart,
        createdAtEnd: this.createdAtEnd,
      };

      return filters;
    },
    isAdmin() {
      return this.$store.getters["userCenter/isAdmin"];
    },
    isGuest() {
      return this.$store.getters["userCenter/isGuest"];
    },
    isLeader() {
      return this.$store.getters["userCenter/isLeader"];
    },
    loggedInUser() {
      return (
        !!this.$store.state.userCenter.user && this.$store.state.userCenter.user.user
      );
    },
    isInPage() {
      return true;
    },
    columns() {
      return [
        {
          name: "id",
          label: "id",
          align: "left",
          field: (row) => row.id,
          sortable: true,
        },
        {
          name: "title",
          label: this.$t("myData.title"),
          align: "left",
          field: (row) => row.title,
          sortable: true,
        },
        {
          name: "type",
          label: this.$t("statsTable.type"),
          align: "left",
          field: (row) => this.$t(row.type),
          sortable: true,
        },
        {
          name: "categories",
          align: "left",
          label: this.$t("myData.categories"),
          field: (row) =>
            (!!row.categories &&
              row.categories.map((category) => category.title).join(", ")) ||
            this.$t("NoCategories"),
          sortable: true,
        },
        {
          name: "plannedStart",
          label: this.$t("fundingsCol.start"),
          align: "left",
          field: (row) => {
            return dateFormatter(row.plannedStart);
          },
          sortable: true,
          sort: (a, b, rowA, rowB) => {
            const dateA = new Date(rowA.plannedStart);
            const dateB = new Date(rowB.plannedStart);
            return dateB - dateA;
          },
        },
        {
          name: "plannedEnd",
          label: this.$t("fundingsCol.end"),
          align: "left",
          field: (row) => dateFormatter(row.plannedEnd),
          sortable: true,
          sort: (a, b, rowA, rowB) => {
            const dateA = new Date(rowA.plannedEnd);
            const dateB = new Date(rowB.plannedEnd);
            return dateB - dateA;
          },
        },
        {
          name: "createdAtStart",
          label: this.$t("fundingsCol.created_at"),
          align: "left",
          field: (row) => {
            return dateFormatter(row.createdAt);
          },
          sortable: true,
          sort: (a, b, rowA, rowB) => {
            const dateA = new Date(rowA.createdAt);
            const dateB = new Date(rowB.createdAt);
            return dateB - dateA;
          },
        },
        {
          name: "user",
          label: this.$t("User"),
          align: "left",
          field: (row) => row.owner && row.owner.username,
          sortable: true,
        },
      ];
    },
    data() {
      return (
        !!this.$store.state.userCenter.dataOverview &&
        this.$store.state.userCenter.dataOverview
      );
    },
  },
  mounted() {
    this.getData();

    if (localStorage.getItem("filters") !== null) {
      const savedFilters = JSON.parse(localStorage.getItem("filters"));

      this.search = savedFilters.name;
      this.type = savedFilters.type;
      this.category = savedFilters.category;
      this.tagsKeywords = savedFilters.tagsKeywords;
      this.projectCoordinator = savedFilters.projectCoordinator;
      this.publishDateStart = savedFilters.publishDateStart;
      this.publishDateEnd = savedFilters.publishDateEnd;
      this.endDateStart = savedFilters.endDateStart;
      this.endDateEnd = savedFilters.endDateEnd;
      this.createdAtStart = savedFilters.createdAtStart;
      this.createdAtEnd = savedFilters.createdAtEnd;
      setTimeout(() => {
        this.$refs.table.setPagination({
          page: savedFilters.page || 1,
          rowsPerPage: savedFilters.rowsPerPage || 10,
        });
      }, 100);
    }
  },
  beforeDestroy() {
    const filters = {
      ...this.filter,
      page: this.$refs.table.computedPagination.page,
      rowsPerPage: this.$refs.table.computedPagination.rowsPerPage,
    };
    localStorage.setItem("filters", JSON.stringify(filters));
  },
};
</script>

<style lang="scss">
.yellowBg .q-table__top {
  background: $yellow-10;
  transition: all 0.2s ease-in-out;
}
</style>
