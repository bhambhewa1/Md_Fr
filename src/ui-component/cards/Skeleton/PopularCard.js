// material-ui
import { Card, CardContent, Grid } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

// project imports
import { gridSpacing } from 'store/constant';

// ==============================|| SKELETON - POPULAR CARD ||============================== //

const PopularCard = () => (
  <Card>
    <CardContent>
    <Grid container spacing={gridSpacing} sx={{minHeight: "370px"}}>
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

        
        <Grid item xs={12}>
          <Grid container justifyContent="center">
                <Skeleton variant="circular" height={130} width={130} />
          </Grid>
        </Grid>

        <Grid item xs={12}>
        <Grid container justifyContent="space-around" sx={{mb:5}}>
       {[0,1,2].map((val) => (
        <Grid item >
                <Skeleton variant="rectangular" height={50} width={100} />
        </Grid>
       ))}
       </Grid>
       </Grid>

      </Grid>
    </CardContent>
  </Card>
);

export default PopularCard;
