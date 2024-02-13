// assets
import { IconDashboard } from '@tabler/icons';
import { GrValidate } from "react-icons/gr";
import { AiOutlineCluster } from "react-icons/ai";

// constant
const icons = { IconDashboard, GrValidate, AiOutlineCluster };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  // title: 'Dashboard',
  type: 'group',
  children: [
    // {
    //   id: 'default',
    //   title: 'Dashboard',
    //   type: 'item',
    //   url: '/dashboard',
    //   icon: icons.IconDashboard,
    //   breadcrumbs: false
    // },
    {
      id: 'Clustered',
      title: 'Clustered Matches',
      type: 'item',
      url: '/clustered-matches',
      breadcrumbs: false,
      icon:icons.AiOutlineCluster,
    },
    {
      id: 'Approved',
      title: 'Approved Matches',
      type: 'item',
      url: '/approved-matches',
      icon: icons.GrValidate,
      breadcrumbs: false
    },
  ]
};

export default dashboard;
