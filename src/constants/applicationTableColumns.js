// Column widths shared by the project-dashboard tables
// (Table.vue, PriorityTable.vue, ArchivedTable.vue). They are percentages of
// the table width (tables use table-layout: fixed and all sit in the same
// container), so columns line up vertically across tables and the table never
// overflows horizontally. The title column takes the remaining width.
export const APPLICATION_TABLE_COLUMN_WIDTHS = {
  action: "9%",
  updatedAt: "10%",
  location: "14%",
  applicationProcess: "15%",
  status: "15%",
  expand: "5%",
};
