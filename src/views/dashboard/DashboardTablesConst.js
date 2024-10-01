export const columns = [
  { id: "company", columnKey: "Company", label: "Company Name" },
  { id: "batch_name", columnKey: "BatchName", label: "Batch Name" },
  { id: "total_records", columnKey: "total_records", label: "Total Records" },
  { id: "clustered_matches", columnKey: "total_clustered", label: "Clustered Matches" },
  { id: "exact_matches", columnKey: "total_exact", label: "Exact Matches" },
  { id: "approved_records", columnKey: "total_approved", label: "Approved Records" },
  { id: "published_records", columnKey: "total_published", label: "Published Records" },
  { id: "total_pending", columnKey: "total_pending", label: "Total Pending" },
];

export const FillAll_TotalR_Columns = [
  { id: "company", columnKey: "Company", label: "Company Name" },
  { id: "total_records", columnKey: "total_records", label: "Total Records" },
  { id: "clustered_matches", columnKey: "total_clustered", label: "Clustered Matches" },
  // { id: "approved_cluster", columnKey: "totalApprovedCluster", label: "Total Clustered" },
  { id: "exact_matches", columnKey: "total_exact", label: "Exact Matches" },
  { id: "fill_all", columnKey: "FillAllPercentage", label: "Fill All Percentage" },
];

export const FillAll_Inner_Columns = [
  { id: "batch_name", columnKey: "BatchName", label: "Batch Name" },
  { id: "total_records", columnKey: "total_records", label: "Total Records" },
  { id: "clustered_matches", columnKey: "total_clustered", label: "Clustered Matches" },
  { id: "exact_matches", columnKey: "total_exact", label: "Exact Matches" },
  { id: "fill_all", columnKey: "FillAllPercentage", label: "Fill All Percentage" },
];

export const User_Analytics_columns = [
  { id: "user", columnKey: "UserName", label: "User Name" },
  { id: "company", columnKey: "Company", label: "Company Name" },
  { id: "total_approved", columnKey: "total_approved", label: "Total Approved" },
  { id: "approved_cluster", columnKey: "totalApprovedCluster", label: "Total Clustered" },
  { id: "fill_all", columnKey: "FillAllPercentage", label: "Fill All Percentage" },
];

export const User_Analytics_Inner_Columns = [
  { id: "company", columnKey: "Company", label: "Company" },
  { id: "mf_id", columnKey: "ManufacturerId", label: "Manufacturer Id" },
  {
    id: "mf_catlog",
    columnKey: "ManufacturerCatalogNumber",
    label: "MCN",
  },
  {
    id: "item_desc",
    columnKey: "ItemDescription",
    label: "Item Description",
  },
  { id: "group", columnKey: "Group", label: "Group" },
  { id: "business", columnKey: "Business", label: "Business" },
  { id: "division", columnKey: "Division", label: "Division" },
  { id: "therapy", columnKey: "Therapy", label: "Therapy" },
  { id: "specialty", columnKey: "Specialty", label: "Specialty" },
  { id: "anatomy", columnKey: "Anatomy", label: "Anatomy" },
  { id: "sub_anatomy", columnKey: "SubAnatomy", label: "SubAnatomy" },
  {
    id: "prod_category",
    columnKey: "ProductCategory",
    label: "ProductCategory",
  },
  { id: "prod_family", columnKey: "ProductFamily", label: "ProductFamily" },
  { id: "model", columnKey: "Model", label: "Model" },
  { id: "prod_code", columnKey: "productCode", label: "ProductCode" },
  {
    id: "prod_code_name",
    columnKey: "productCodeName",
    label: "ProductCodeName",
  },
  { id: "comment", columnKey: "comment", label: "Notes" },
];
