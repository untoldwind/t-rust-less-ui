import { Callout, H5, HTMLTable } from "@blueprintjs/core";
import { useActor } from "@xstate/react";
import * as React from "react";
import { translations } from "../i18n";
import { mainInterpreter } from "../machines/main";
import { ConfigAddIdentity } from "./config-add-identity";
import { Grid } from "./ui/grid";

export const ConfigIdentitiesList: React.FC = () => {
  const translate = React.useMemo(translations, [translations]);
  const [state] = useActor(mainInterpreter);

  if (!state.matches("config.show_stores")) return null;

  if (state.context.identities.length === 0) {
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
          {state.context.identities.map((identity, idx) => (
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