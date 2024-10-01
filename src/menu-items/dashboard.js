// assets
import { IconDashboard } from '@tabler/icons';
import { AiOutlineCluster, AiOutlinePartition } from "react-icons/ai";
import { HiRefresh } from "react-icons/hi";
import { PiTargetBold } from "react-icons/pi";
import { MdOutlineDashboard } from "react-icons/md";
import VerifiedIcon from '@mui/icons-material/Verified';




// constant
const icons = { MdOutlineDashboard, VerifiedIcon, AiOutlineCluster, HiRefresh, PiTargetBold, AiOutlinePartition };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  // title: 'Dashboard',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      icon: icons.MdOutlineDashboard,
      breadcrumbs: false
    },
    {
      id: 'Clustered',
      title: 'Clustered Matches',
      type: 'item',
      url: '/clustered-matches',
      breadcrumbs: false,
      icon:icons.AiOutlineCluster,
    },
    {
      id: 'Exact_Matches',
      title: 'Exact Matches',
      type: 'item',
      url: '/exact-matches',
      breadcrumbs: false,
      icon: icons.PiTargetBold,
    },
    {
      id: 'Approved',
      title: 'Approved Matches',
      type: 'item',
      url: '/approved-matches',
      icon: icons.VerifiedIcon,
      breadcrumbs: false
    },
    {
      id: 'Reload_Data',
      title: 'Update Data',
      type: 'item',
      url: '/update-data',
      icon: icons.HiRefresh,
      breadcrumbs: false
    },
    {
      id: 'CurrentMapping',
      title: 'Current Mapping',
      type: 'item',
      url: '/current-mapping',
      icon: icons.AiOutlinePartition,
      breadcrumbs: false
    },
  ]
};

export default dashboard;
