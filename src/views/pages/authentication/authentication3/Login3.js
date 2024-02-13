import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Divider, Grid, Stack, Typography, useMediaQuery } from '@mui/material';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthLogin from '../auth-forms/AuthLogin';
import Logo from 'ui-component/Logo';
import AuthFooter from 'ui-component/cards/AuthFooter';
import images from 'assets/images/images';

// assets

// ================================|| AUTH3 - LOGIN ||================================ //

const Login = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AuthWrapper1>
      <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper>
                <Grid  container spacing={2} alignItems="center" justifyContent="center">
                  {/* <div style={{width:"100%", textAlign:"center"}}> */}
                  <Grid  item sx={{ mb: 1 }}>
                    <Link to="#">
                      <img 
                      src={ images.Logo }
                      alt='Logo'
                      />
                    </Link>
                  </Grid>
                  {/* </div> */}
                  <Grid item xs={12}>
                    <Grid container direction={matchDownSM ? 'column-reverse' : 'row'} alignItems="center" justifyContent="center">
                      <Grid item>
                        <Stack alignItems="center" justifyContent="center" spacing={1}>
                          <Typography color={"#000"} gutterBottom variant={matchDownSM ? 'h3' : 'h2'}>
                            Login
                          </Typography>
                          <Typography variant="caption" color={'#E11927'} fontSize="16px" textAlign={matchDownSM ? 'center' : 'inherit'}>
                          Welcome to MedMine
                          </Typography>
                        </Stack> 
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <AuthLogin />
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                  {/* <Typography variant="subtitle2" component={Link} href="https://medminellc.com/" target="_blank" underline="hover">
                    &copy; medminellc.com
                  </Typography> */}
                  <AuthFooter />
                  </Grid>
                  {/* <Grid item xs={12}>
                    <Grid item container direction="column" alignItems="center" xs={12}>
                      <Typography component={Link} to="/register" variant="subtitle1" sx={{ textDecoration: 'none' }}>
                        Don&apos;t have an account?
                      </Typography>
                    </Grid>
                  </Grid> */}

                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
          {/* <AuthFooter /> */}
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default Login;