import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, Typography } from '@mui/material';

// project imports
import LogoSection from '../LogoSection';
import SearchSection from './SearchSection';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';

// assets
import { IconMenu2 } from '@tabler/icons';
import { useLocation } from 'react-router';
import images from 'assets/images/images';
import { Link } from 'react-router-dom';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
  const theme = useTheme();
  const location = useLocation();

  return (
    <>
      {/* logo & toggler button */}
      <Box
        sx={{
          width: 228,
          display: 'flex',
          [theme.breakpoints.down('md')]: {
            width: 'auto'
          }
        }}
      >
        <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, textAlign:"center", flexGrow: 1 }}>
          <LogoSection />
        </Box>
        <ButtonBase disableRipple sx={{ borderRadius: '12px', overflow: 'hidden' }}>
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: 'all .2s ease-in-out',
              background: "#E11927",
              color: "#fff",
              '&:hover': {
                background: "#e1192754",
                color: "#000"
              }
            }}
            onClick={handleLeftDrawerToggle}
            color="inherit"
          >
            <IconMenu2 stroke={1.5} size="1.3rem" />
          </Avatar>
        </ButtonBase>
      </Box>

      {/* header search */}
      {/* <SearchSection /> */}
      <Box sx={{display:"flex", flexDirection:"column", pl: 7}}>
      <Typography variant="h2"> HEALTH CARE UI </Typography>
      <Typography variant="subtitle2" style={{display:'flex', alignItems:"flex-start", gap:"5px", mt:2}}>
      <Link to="/">
            <img src={images.home} alt="home" />
          </Link><Link to={location.pathname}>{location.pathname==='/' ? '/dashboard' : location.pathname}</Link>  </Typography>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />

      {/* notification & profile */}
      {/* <NotificationSection /> */}
      <ProfileSection />
    </>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func
};

export default Header;
