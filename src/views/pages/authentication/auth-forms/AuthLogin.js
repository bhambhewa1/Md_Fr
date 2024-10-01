import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  // useMediaQuery
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// third party
import * as Yup from "yup";
import { Formik } from "formik";

// assets
import useScriptRef from "hooks/useScriptRef";
import AnimateButton from "ui-component/extended/AnimateButton";
import Message from "ui-component/components/Snackbar/Snackbar";
import Axios from "api/Axios";
import axios from "axios";
import { API } from "api/API";
import Loading from "ui-component/components/Loading";
import { loginRequest } from "authConfig";
import { useMsal } from "@azure/msal-react";

// ============================|| FIREBASE - LOGIN ||============================ //

const FirebaseLogin = ({ ...others }) => {
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  // const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const customization = useSelector((state) => state.customization);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    // severity: "",
  });

  const handleCloseSnackbar = () => {
    setSnackbar({
      open: false,
      message: "",
      severity: snackbar.severity,
    });
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const navigate = useNavigate();
  const { instance } = useMsal();

  const handleSubmit = async (
    values,
    { setErrors, setStatus, setSubmitting }
  ) => {
    try {
      setIsLoading(true);
      await instance.loginRedirect({...loginRequest, prompt: 'create'}).catch((err) => console.log(err));
      setIsLoading(false);
      // const result = await axios.post(API.Login, values);
      // console.log("Res", result.data);
      // if (result?.status === 200) {
      //   setIsLoading(false);
      //   Cookies.set("userToken", result?.data?.accessToken, { expires: 1 });
      //   const data = JSON.stringify(result?.data?.userData);
      //   localStorage.setItem("Profile_Details", data);
      //   if (scriptedRef.current) {
      //     setStatus({ success: true });
      //     setSubmitting(false);
      //   }
      //   navigate("/");
      // }
    } catch (error) {
      setIsLoading(false);
      console.log(error, "Hello I am an Error ");
      if (scriptedRef.current) {
        setStatus({ success: false });
        setErrors({ submit: error?.message });
        setSubmitting(false);
      }
      setSnackbar({
        open: true,
        severity: "error",
        message: error?.response?.data?.error ?? error?.response?.data?.message ?? error?.message
      });
    }
  };

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        await instance.handleRedirectPromise();
      } catch (error) {
        // Handle redirect error
        console.error("Redirect error:", error);
      }
    };

    handleRedirect();
  }, [instance]);

  return (
    <>
      <Formik
        initialValues={{
          email: "",
          // password: "",
          // submit: null,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Must be a valid email")
            .max(255)
            .required("Email is required"),
          // password: Yup.string().max(255).required("Password is required"),
        })}
        onSubmit={handleSubmit}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
        }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            <FormControl
              fullWidth
              error={Boolean(touched.email && errors.email)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor="outlined-adornment-email-login">
                Email Address
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-login"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Email Address"
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text-email-login"
                >
                  {errors.email}
                </FormHelperText>
              )}
            </FormControl>

            {/* <FormControl
              fullWidth
              error={Boolean(touched.password && errors.password)}
              sx={{ ...theme.typography.customInput }}
            >
              <InputLabel htmlFor="outlined-adornment-password-login">
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-login"
                type={showPassword ? "text" : "password"}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                inputProps={{}}
              />
              {touched.password && errors.password && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text-password-login"
                >
                  {errors.password}
                </FormHelperText>
              )}
            </FormControl> */}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button
                  disableElevation
                  disabled={isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="secondary"
                  style={{
                    background: "#E11927",
                    color: isSubmitting && "#fff",
                  }}
                >
                  Sign in with Microsoft
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>
      <Loading isLoading={isLoading} height={80} width={80} color="#15223F" />
      <Message snackbar={snackbar} handleCloseSnackbar={handleCloseSnackbar} />
    </>
  );
};

export default FirebaseLogin;
