import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { ButtonBase } from '@mui/material';

// project imports
import config from 'config';
import { MENU_OPEN } from 'store/actions';
import images from 'assets/images/images';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => {
  const defaultId = useSelector((state) => state.customization.defaultId);
  const dispatch = useDispatch();
  return (
    <>
    {/* <ButtonBase disableRipple onClick={() => dispatch({ type: MENU_OPEN, id: defaultId })} component={Link} to={config.defaultPath}> */}
      {/* <Logo /> */}
      <img
       src={ images.Logo }
       alt='logo'
       />
    {/* </ButtonBase> */}
       </>
  );
};

export default LogoSection;
