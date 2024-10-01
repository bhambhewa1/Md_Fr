const STAGING = true;
export const BASE_URL = STAGING
  ? // Please use Staging BASE_URL Here
    "http://192.168.75.40:3005/"
  : // Please Use Production BASE_URL Here
    "https://app-dev-api.medminellc.com/";

export const API = {
  Download_blobs: `${BASE_URL}api/download_blobs`,
  Upload_all_blobs: `${BASE_URL}api/upload_all_blobs`,
  Give_UniqueID_Backend: `${BASE_URL}api/giveUniqueId`,
  Check_Reload_Status: `${BASE_URL}api/check_data`,
  Reload_Transfer_Data: `${BASE_URL}api/transferData`,
  Login: `${BASE_URL}api/user_login`,
  File_Locked: `${BASE_URL}api/store_user_lock`,
  Delete_User_Locked: `${BASE_URL}api/delete_user_lock`,
  Companies_Name: `${BASE_URL}api/get_file_name`,
  Get_Company_Data: `${BASE_URL}api/get_file_data`,
  Add_Edit_Copy_Company_Data: `${BASE_URL}api/add_edit_copy_cluster`,
  Approve_OR_SaveApprove: `${BASE_URL}api/save_approve_cluster`,
  Delete_Row: `${BASE_URL}api/delete_cluster`,
  approve_file_list: `${BASE_URL}api/approve_file_list`, 
  approve_file_data: `${BASE_URL}api/get_approve_file_data`,
  approve_data_edited: `${BASE_URL}api/edit_approve_data`,
  Exact_Edit_Data: `${BASE_URL}api/edit_exact_data`,
  Exact_Approve_Data: `${BASE_URL}api/approve_exact_data`,
  Current_Mapping_Companies: `${BASE_URL}api/get_all_tickers`,
  Current_Mapping_Data: `${BASE_URL}c_mapping/get_tickert_data`,
  
  ResetRow_Cancel_Exact: `${BASE_URL}api/cancleExactData`,
  DataRefresh_Companies: `${BASE_URL}api/data_refesh_ticker_listing`,
  DataRefresh_companiesData: `${BASE_URL}api/data_refesh_ticker_data`,
  DataRefresh_Approve: `${BASE_URL}api/approve_single_ticker`,
  DataRefresh_Disapprove: `${BASE_URL}api/disapprove_single_ticker`,
  Events_History: `${BASE_URL}api/eventsHistory`,
  Batches_Api:`${BASE_URL}api/get_batches_list`,
  Approve_BatchesApi:`${BASE_URL}api/approve_batches_list`,
  Dashboard_Interface_data_V1: `${BASE_URL}api/get_dashboard_data_v1`,
  Dashboard_Interface_data_V2: `${BASE_URL}api/get_dashboard_data_v2`,
  Dashboard_companies: `${BASE_URL}api/get_unique_ticker_all_company`,
  Dashboard_batches: `${BASE_URL}api/get_batch_name_with_ticker`,
  Dashboard_User_List: `${BASE_URL}api/get_users_listing`,
  All_Companies_GridData: `${BASE_URL}api/get_All_Companies_grid_Data`,
  Total_Records_GridData: `${BASE_URL}api/Total_Records_grid`,
  Approved_Matches_GridData: `${BASE_URL}api/get_approved_listing`,
  Fill_All_Perc_GridData: `${BASE_URL}api/get_fill_all_Percentage`,
  Active_Batches_GridData: `${BASE_URL}api/Active_Batches`,
  Published_Records_GridData: `${BASE_URL}api/Published_Records`,
  User_Analytics_GridData: `${BASE_URL}api/User_Analytics`,
};
