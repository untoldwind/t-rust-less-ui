import { Grid } from "@mui/material";
import React from "react";
import { SecretList } from "./secret-list";

export const Lookup: React.FC = () => {
  return (
    <Grid container spacing={2} maxHeight="100%" height="100%">
      <Grid item xs={4} minHeight={0} maxHeight="100%" overflow="auto">
        <SecretList />
      </Grid>
      <Grid item xs={8} minHeight={0} maxHeight="100%" overflow="auto"></Grid>
    </Grid>
  );
};
