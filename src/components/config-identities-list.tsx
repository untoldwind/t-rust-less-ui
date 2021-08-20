import React from "react";
import { Callout, H5, HTMLTable } from "@blueprintjs/core";
import { useRecoilValue } from "recoil";
import { identitiesState, useTranslate } from "../machines/state";
import { ConfigAddIdentity } from "./config-add-identity";
import { Grid } from "./ui/grid";

export const ConfigIdentitiesList: React.FC = () => {
  const translate = useTranslate();
  const identities = useRecoilValue(identitiesState);

  if (identities.length === 0) {
    return (
      <Grid columns={1}>
        <H5>{translate.storeConfig.identities}</H5>
        <Callout intent="warning">{translate.storeConfig.noIdentities}</Callout>
        <ConfigAddIdentity />
      </Grid>
    )
  }
  return (
    <Grid columns={1}>
      <H5>{translate.storeConfig.identities}</H5>
      <HTMLTable>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {identities.map((identity, idx) => (
            <tr key={idx}>
              <td style={{ whiteSpace: "nowrap" }}>{identity.name}</td>
              <td>{identity.email}</td>
            </tr>
          ))}
        </tbody>
      </HTMLTable>
      <ConfigAddIdentity />
    </Grid>
  )
}