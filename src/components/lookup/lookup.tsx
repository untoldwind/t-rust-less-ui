import { Grid } from "@mui/material";
import React from "react";
import { SecretList } from "./secret-list";
import { ScrollBox } from "../../layout/scroll-box";

export interface LookupProps {
  search: string;
}

export const Lookup: React.FC<LookupProps> = ({ search }) => {
  return (
    <Grid container spacing={2} height="100vh">
      <Grid item xs={4}>
        <ScrollBox>
          <SecretList search={search} />
        </ScrollBox>
      </Grid>
      <Grid item xs={8}></Grid>
    </Grid>
  );
};
