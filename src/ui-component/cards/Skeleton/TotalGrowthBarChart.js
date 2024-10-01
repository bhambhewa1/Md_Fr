// material-ui
import { Card, CardContent, Grid } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";

// project imports
import { gridSpacing } from "store/constant";

// ==============================|| SKELETON TOTAL GROWTH BAR CHART ||============================== //

const TotalGrowthBarChart = () => (
  <Card>
    <CardContent>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container justifyContent="space-between">
                <Grid item>
                  <Skeleton variant="rectangular" height={50} width={150} />
                </Grid>

                <Grid item>
                  <Skeleton variant="rectangular" height={50} width={80} />
                </Grid>
          </Grid>
        </Grid>

       {[0,1,2,3].map((val) => (
        <Grid item xs={12}>
                <Skeleton variant="rectangular" height={50} width={"100%"} />
        </Grid>
       ))}

      </Grid>
    </CardContent>
  </Card>
);

export default TotalGrowthBarChart;
