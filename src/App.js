import { useSelector } from "react-redux";

import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, StyledEngineProvider } from "@mui/material";

// routing
import Routes from "routes";

// defaultTheme
import themes from "themes";

// project imports
import NavigationScroll from "layout/NavigationScroll";
import { MsalProvider, MsalAuthenticationTemplate } from "@azure/msal-react";
import { loginRequest } from "authConfig";
import { InteractionType } from "@azure/msal-browser";

// ==============================|| APP ||============================== //

const App = ({ msalInstance }) => {
  const customization = useSelector((state) => state.customization);
  const authRequest = {
    ...loginRequest,
  };

  return (
    <MsalProvider instance={msalInstance}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={themes(customization)}>
          <CssBaseline />
          <NavigationScroll>
            <MsalAuthenticationTemplate
              interactionType={InteractionType.Redirect}
              authenticationRequest={authRequest}
              // errorComponent={ErrorComponent}
              // loadingComponent={Loading}
            >
              <Routes />
            </MsalAuthenticationTemplate>
          </NavigationScroll>
        </ThemeProvider>
      </StyledEngineProvider>
    </MsalProvider>
  );
};

export default App;
