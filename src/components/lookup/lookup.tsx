import { Grid } from "@mui/material";
import React from "react";
import { SecretList } from "./secret-list";
import { ScrollBox } from "../../layout/scroll-box";

export const Lookup: React.FC = () => {
  return (
    <Grid container spacing={2} height="100vh">
      <Grid item xs={4}>
        <ScrollBox>
          <SecretList />
        </ScrollBox>
      </Grid>
      <Grid item xs={8}></Grid>
    </Grid>
  );
};
