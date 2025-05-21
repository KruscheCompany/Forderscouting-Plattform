<template>
  <q-page class="q-mt-lg" :class="$q.screen.gt.sm ? 'q-mx-xl' : 'q-mx-sm'">
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <div class="row q-col-gutter-md justify-end">
          <div class="col-12 col-md-auto">
            <q-btn
              color="blue"
              icon="add"
              unelevated
              outline
              class="q-mb-md radius-6 text-weight-600"
              :class="{ 'full-width': $q.screen.lt.md }"
              no-caps
              @click="dialogState = true"
            >
              <p class="q-mb-none q-mx-md q-my-sm">
                {{ $t("projectIdeaPlaceholder.email") }}
              </p>
            </q-btn>

            <!-- New Email Dialog -->
            <q-dialog v-model="$_options">
              <q-card
                class="q-px-md q-py-xs radius-10"
                style="padding: 20px; min-width: 70%"
              >
                <h5 style="margin: 5px 0 15px 5px">
                  {{ $t("sendEmail") }}
                </h5>
                <q-card-section>
                  <q-select
                    v-model="form.userGroup"
                    behavior="default"
                    :options="userGroupsOptions"
                    :label="$t('generalData.selectUserGroup')"
                    outlined
                    :rules="[(val) => !!val || $t('Required')]"
                    dense
                    class="no-shadow radius-6"
                    multiple
                    use-chips
                  />
                </q-card-section>

                <!-- Email subject -->
                <q-card-section>
                  <q-input
                    borderless
                    outlined
                    class="input-radius-6 no-shadow q-mb-sm q-mt-sm"
                    v-model="form.subject"
                    :rules="[(val) => !!val || $t('Required')]"
                    :placeholder="$t('Subject')"
                    dense
                  >
                  </q-input>
                </q-card-section>

                <!-- Email body -->
                <q-card-section>
                  <q-editor
                    borderless
                    outlined
                    class="input-radius-6 no-shadow q-mb-sm q-mt-sm"
                    v-model="form.body"
                    :rules="[(val) => !!val || $t('Required')]"
                    type="textarea"
                    :dense="$q.screen.lt.md"
                    :toolbar="[
                      [
                        {
                          label: $q.lang.editor.align,
                          icon: $q.iconSet.editor.align,
                          fixedLabel: true,
                          list: 'only-icons',
                          options: ['left', 'center', 'right', 'justify'],
                        },
                      ],
                      [
                        'bold',
                        'italic',
                        'strike',
                        'underline',
                        'subscript',
                        'superscript',
                      ],
                      ['token', 'hr', 'link', 'custom_btn'],
                      ['print', 'fullscreen'],
                      [
                        {
                          label: $q.lang.editor.formatting,
                          icon: $q.iconSet.editor.formatting,
                          list: 'no-icons',
                          options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code'],
                        },
                        {
                          label: $q.lang.editor.fontSize,
                          icon: $q.iconSet.editor.fontSize,
                          fixedLabel: true,
                          fixedIcon: true,
                          list: 'no-icons',
                          options: [
                            'size-1',
                            'size-2',
                            'size-3',
                            'size-4',
                            'size-5',
                            'size-6',
                            'size-7',
                          ],
                        },
                        {
                          label: $q.lang.editor.defaultFont,
                          icon: $q.iconSet.editor.font,
                          fixedIcon: true,
                          list: 'no-icons',
                          options: [
                            'default_font',
                            'arial',
                            'arial_black',
                            'comic_sans',
                            'courier_new',
                            'impact',
                            'lucida_grande',
                            'times_new_roman',
                            'verdana',
                          ],
                        },
                        'removeFormat',
                      ],
                      ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

                      ['undo', 'redo'],
                      ['viewsource'],
                    ]"
                    :fonts="{
                      arial: 'Arial',
                      arial_black: 'Arial Black',
                      comic_sans: 'Comic Sans MS',
                      courier_new: 'Courier New',
                      impact: 'Impact',
                      lucida_grande: 'Lucida Grande',
                      times_new_roman: 'Times New Roman',
                      verdana: 'Verdana',
                    }"
                  />
                </q-card-section>

                <!-- Email attachments -->
                <q-card-section>
                  <q-file
                    flat
                    v-model="form.attachments"
                    class="uploadInput input-radius-6 text-white"
                    label-color="white"
                    dark
                    bg-color="primary"
                    :label="$t('attach files')"
                    multiple
                    display-value=""
                    append
                  >
                    <template v-slot:prepend>
                      <q-icon color="white" class="on-right" name="upload" />
                    </template>
                  </q-file>
                </q-card-section>

                <!-- Action buttons -->
                <q-card-section>
                  <div class="row justify-center">
                    <q-btn
                      :label="$t('category&Keyword.cancel')"
                      outline
                      v-close-popup
                      size="14px"
                      color="primary"
                      no-caps
                      class="no-shadow radius-6 q-px-md q-mr-sm"
                      :loading="isLoading"
                      @click="cancelDialog()"
                    />
                    <q-btn
                      :label="$t('confirm')"
                      unelevated
                      :loading="isLoading"
                      size="14px"
                      color="primary"
                      no-caps
                      class="no-shadow radius-6 q-px-md q-py-sm"
                      @click="sendEmail()"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </q-dialog>

            <!-- View Email Dialog -->
            <q-dialog v-model="$_viewOptions" v-if="viewDialogState">
              <q-card
                class="q-px-md q-py-xs radius-10"
                style="padding: 20px; min-width: 70%"
              >
                <h5 style="margin: 5px 0 15px 5px">
                  {{ viewDetails.subject }}
                </h5>
                <q-separator spaced></q-separator>
                <q-card-section>
                  <div class="q-mb-sm q-mt-sm flex justify-between">
                    <div>
                      <span class="text-weight-600 q-mr-xs font-14"
                        >{{ $t("Recipient") }}:</span
                      >
                      <span class="text-black q-mb-sm font-14">{{
                        viewDetails.userGroup[0].value
                      }}</span>
                    </div>
                    <span>
                      <span class="text-black font-14 text-italic">
                        {{ viewDetails.createdAt }}
                      </span>
                    </span>
                  </div>
                </q-card-section>
                <q-separator spaced></q-separator>
                <!-- Email body -->
                <q-card-section
                  style="
                    border: 1px solid lightgray;
                    border-radius: 5px;
                    padding: 15px;
                    line-height: 2;
                  "
                >
                  <div>
                    <div v-html="viewDetails.body" class="font-14 text-black"></div>
                  </div>
                </q-card-section>

                <!-- Email attachments -->
                <q-card-section>
                  <!-- Show urls of attachments -->
                  <q-list>
                    <q-item
                      v-for="(attachment, index) in viewDetails.attachments.data"
                      :key="index"
                    >
                      <q-item-section>
                        <q-item-label>
                          <a
                            class="q-mb-sm text-blue block text-weight-600 font-14"
                            target="_blank"
                            rel="noopener noreferrer"
                            :href="`${appUrl}${attachment.attributes.url}`"
                            >{{ attachment.attributes.name }}</a
                          >
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>

                <!-- Action buttons -->
                <q-card-section>
                  <div class="row justify-center">
                    <q-btn
                      :label="$t('Close')"
                      outline
                      v-close-popup
                      size="14px"
                      color="primary"
                      no-caps
                      class="no-shadow radius-6 q-px-md q-mr-sm"
                      :loading="isLoading"
                      @click="cancelViewDialog()"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </q-dialog>
          </div>
        </div>
      </div>
    </div>

    <!-- Emails table  -->
    <q-table
      class="radius-20 shadow-1 pagination-no-shadow"
      :title="$t('E-Mails')"
      :data="this.emails"
      :visible-columns="visibleColumns"
      :columns="columns"
      row-key="name"
      :pagination="{
        sortBy: 'id',
        descending: true,
        page: 1,
        rowsPerPage: 10,
      }"
      :rows-per-page-label="$t('Records per page')"
      :no-data-label="$t('No data')"
      :no-results-label="$t('No results')"
      ref="table"
    >
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
            <span v-if="col.name === 'status'">
              <q-chip
                :label="props.row[col.name] === true ? $t('Sent') : $t('NotSent')"
                class="text-white"
                style="height: 20px; margin-bottom: 7px"
                :color="props.row[col.name] === true ? 'positive' : 'negative'"
              />
            </span>
            <span v-else>{{
              props.row[col.name].length > 48
                ? props.row[col.name].substring(0, 25) + " ..."
                : props.row[col.name]
            }}</span>
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
                  <q-item clickable v-close-popup @click="view(props.row)">
                    <q-item-section
                      ><span class="text-right font-14">
                        {{ $t("fundingTableOptions.view") }}
                        <q-icon size="sm" class="text-blue" name="visibility" /> </span
                    ></q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { dateFormatter } from "src/boot/dateFormatter";
import { date } from "quasar";
export default {
  name: "EmailCenter",
  data() {
    return {
      isLoading: false,
      dialogState: false,
      viewDialogState: false,
      groups: [],
      emails: [],
      visibleColumns: ["subject", "status", "createdAt"],
      form: {
        userGroup: [],
        subject: "",
        body: "",
        attachments: [],
      },
      viewDetails: {
        userGroup: "",
        subject: "",
        body: "",
        attachments: [],
      },
    };
  },
  methods: {
    dateFormatter,
    cancelDialog() {
      this.dialogState = false;
      this.form = {
        userGroup: [],
        subject: "",
        body: "",
        attachments: [],
      };
    },
    cancelViewDialog() {
      this.viewDialogState = false;
      this.viewDetails = {
        userGroup: [],
        subject: "",
        body: "",
        attachments: [],
      };
    },
    async sendEmail() {
      this.isLoading = true;
      const { userGroup, subject, body, attachments } = this.form;
      const data = {
        groupName: String(userGroup.map((group) => group.label)),
        group: String(userGroup.map((group) => group.value)),
        subject,
        body,
      };

      let files = [];

      if (attachments.length > 0) {
        files = attachments.map((file) => file);
      } else {
        files = [];
      }

      if (!userGroup || !subject || !body) {
        this.$q.notify({
          message: this.$t("Bitte füllen Sie alle Felder aus"),
          color: "negative",
          position: "top",
          timeout: 2000,
        });
        this.isLoading = false;
        return;
      }

      try {
        let formData = new FormData();
        formData.append("data", JSON.stringify(data));
        files.forEach((file) => {
          formData.append("files.attachments", file);
        });

        try {
          const res = await this.$api.post("api/emailing-centers", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        } catch (error) {
          console.error("Error sending email:", error);
          return false;
        }
        this.$q.notify({
          message: this.$t("emailSent"),
          color: "positive",
          position: "top",
          timeout: 2000,
        });
        this.cancelDialog();
      } catch (error) {
        console.error("Error sending email:", error);
        this.$q.notify({
          message: this.$t("emailNotSent"),
          color: "negative",
          position: "top",
          timeout: 2000,
        });
      } finally {
        this.isLoading = false;
        this.getData();
      }
    },
    async getUserGroupOptions() {
      const labelMapping = {
        user: "Users",
        Admin: "Administrators",
        Leader: "Municipality Leaders",
        Guest: "Guest Users",
      };

      try {
        const {
          data: { roles },
        } = await this.$api.get("/api/users-permissions/roles");

        const userGroupsOptions = roles
          .filter((role) => role.nb_users > 0)
          .map(({ name, id }) => ({
            label: this.$t(labelMapping[name] || name),
            value: id,
          }));

        // translate user groups
        const userGroupsOptionsTranslated = userGroupsOptions.map((group) => ({
          ...group,
          label: this.$t(group.label),
        }));

        this.groups = userGroupsOptionsTranslated;
        return userGroupsOptions;
      } catch (error) {
        console.error("Error fetching user groups:", error);
        return [];
      }
    },
    async getData() {
      try {
        const { data } = await this.$api.get("api/emailing-centers");
        console.log("!!!", data);
        this.emails = data;
        let emailData = [];
        this.emails.forEach((email) => {
          emailData.push({
            id: email.id,
            subject: email.subject,
            status: email.status,
            createdAt: this.dateFormatter(email.createdAt),
          });
        });

        this.emails = emailData;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    async view(row) {
      const { data } = await this.$api.get(
        `api/emailing-centers/${row.id}?populate[0]=attachments`
      );
      const labelMapping = this.getUserGroupOptions();

      this.viewDetails = {
        userGroup: [
          {
            label: data.data.attributes.group,
            value: data.data.attributes.groupName,
          },
        ],
        subject: data.data.attributes.subject,
        body: data.data.attributes.body,
        attachments: data.data.attributes.attachments,
        createdAt: date.formatDate(
          data.data.attributes.createdAt,
          "DD.MM.YYYY HH:mm:ss A"
        ),
      };

      this.viewDialogState = true;
    },
  },
  computed: {
    $_options: {
      get: function () {
        return this.dialogState;
      },
      set: function (val) {
        this.$emit("update", val);
      },
    },
    $_viewOptions: {
      get: function () {
        return this.viewDialogState;
      },
      set: function (val) {
        this.$emit("update", val);
      },
    },
    userGroupsOptions() {
      return this.groups;
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
          name: "subject",
          align: "left",
          label: this.$t("Subject"),
          field: (row) => row.subject,
          sortable: true,
        },
        {
          name: "status",
          align: "left",
          label: this.$t("Status"),
          field: (row) => row.status,
          sortable: true,
        },
        {
          name: "createdAt",
          align: "left",
          label: this.$t("fundingsCol.created_at"),
          field: (row) => row.createdAt,
          sortable: true,
        },
      ];
    },
    appUrl() {
      return process.env.VUE_APP_MAIN_URL;
    },
  },

  mounted() {
    this.getData();
    this.getUserGroupOptions();
    if (localStorage.getItem("pagination")) {
      const savedPagination = JSON.parse(localStorage.getItem("pagination"));

      this.$refs.table.setPagination({
          page: savedPagination.emailCenterPage || 1,
          rowsPerPage: savedPagination.emailCenterRowsPerPage || 10,
        });
    }
  },
  beforeDestroy() {
    const pagination = JSON.parse(localStorage.getItem("pagination"));
    const localPagination = {
      emailCenterPage: this.$refs.table.computedPagination.page,
      emailCenterRowsPerPage: this.$refs.table.computedPagination.rowsPerPage,
    };
    const filters = { ...pagination, ...localPagination };
    localStorage.setItem("pagination", JSON.stringify(filters));
  },
};
</script>
<style lang="scss">
.disabledClass {
  .q-field__inner .q-field__control input {
    color: black;
    opacity: 1 !important;
  }
  .q-field__inner .q-field__control:before {
    border-color: $primary;
  }
}

.q-card__section--vert {
  padding: 7px;
}
.q-item--active .q-item__label {
  color: $primary;
}
</style>
