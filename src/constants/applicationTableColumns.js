// Fixed pixel widths shared by the project-dashboard tables
// (Table.vue, PriorityTable.vue, ArchivedTable.vue) so their columns line up
// vertically even though each table renders its own independently-sized
// <table> with different row content.
export const APPLICATION_TABLE_COLUMN_WIDTHS = {
  updatedAt: "132px",
  location: "190px",
  applicationProcess: "210px",
  status: "210px",
  expand: "64px",
};
