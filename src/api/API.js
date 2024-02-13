const STAGING = false;
export const BASE_URL = STAGING
  ? // Please use Staging BASE_URL Here
    "http://192.168.75.204:3001/"
  : // Please Use Production BASE_URL Here
    "http://20.102.238.52:3002/";

export const API = {
  Login: `${BASE_URL}api/user_login`,
  Reload_Check: `${BASE_URL}api/check_data`,
  Download_blobs: `${BASE_URL}api/download_blobs`,
  Upload_all_blobs: `${BASE_URL}api/upload_all_blobs`,
  Give_UniqueID_Backend: `${BASE_URL}api/giveUniqueId`,
  File_Locked: `${BASE_URL}api/store_user_lock`,
  Delete_User_Locked: `${BASE_URL}api/delete_user_lock`,
  Companies_Name: `${BASE_URL}api/get_file_name`,
  Get_Company_Data: `${BASE_URL}api/get_file_data`,
  Save_Company_Data: `${BASE_URL}api/save_new_cluster`,
  Save_Edited_Company_Data: `${BASE_URL}api/edit_cluster`,
  Approve_OR_SaveApprove: `${BASE_URL}api/approve_cluster`,
  Delete_Row: `${BASE_URL}api/delete_cluster`,
  approve_file_list: `${BASE_URL}api/approve_file_list`,
  approve_file_data: `${BASE_URL}api/get_approve_file_data`,
};
