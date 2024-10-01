import React from 'react';
import AuthFooter from 'ui-component/cards/AuthFooter';
import AuthWrapper1 from '../authentication/AuthWrapper1';
import AuthCardWrapper from '../authentication/AuthCardWrapper';
import AuthLogin from '../authentication/auth-forms/AuthLogin';
import Logo from 'ui-component/Logo';
import { Box, Button, Divider, Grid, Stack, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { useNavigate } from 'react-router-dom';

const PageNotFound = () => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();

    const handleDashboard = () => {
        navigate('/clustered-matches');
    };
    return (
        <div>
            <AuthWrapper1>
                <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
                    <Grid item xs={12}>
                        <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
                            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                                <AuthCardWrapper>
                                    <Grid container spacing={0} alignItems="center" justifyContent="center">
                                        <Grid item>
                                            <Link to="#">
                                                {/* <Logo /> */}
                                            </Link>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Grid
                                                container
                                                direction={matchDownSM ? 'column-reverse' : 'row'}
                                                alignItems="center"
                                                justifyContent="center"
                                            >
                                                <Grid item>
                                                    <Stack alignItems="center" justifyContent="center" spacing={0}>
                                                        <Typography
                                                            color={theme.palette.secondary.main}
                                                            gutterBottom
                                                            variant={matchDownSM ? 'h3' : 'h2'}
                                                        >
                                                            <h1 style={{color:"#121926"}}>Page Not Found</h1>
                                                            <Box sx={{ mt: 2 }}>
                                                                <AnimateButton>
                                                                    <Button
                                                                        // disableElevation
                                                                        // disabled={isSubmitting}
                                                                        onClick={handleDashboard}
                                                                        fullWidth
                                                                        size="large"
                                                                        variant="contained"
                                                                        // color="secondary"
                                                                        style={{color:"#fff", background:"#e11927"}}

                                                                    >
                                                                        Go Back
                                                                    </Button>
                                                                </AnimateButton>
                                                            </Box>
                                                        </Typography>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        {/* <Grid item xs={12}>
                                            <AuthLogin />
                                        </Grid> */}
                                        {/* <Grid item xs={12}>
                                            <Divider />
                                        </Grid> */}
                                        <Grid item xs={12}></Grid>
                                    </Grid>
                                </AuthCardWrapper>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
                        <AuthFooter />
                    </Grid>
                </Grid>
            </AuthWrapper1>
        </div>
    );
};

export default PageNotFound;
