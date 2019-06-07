import * as React from "react";
import { BoundActions, actionBinder } from "../actions/bindable";
import { returntypeof } from "../helpers/returntypeof";
import { State } from "../reducers/state";
import { connect } from "react-redux";
import { Grid } from "./ui/grid";
import { SecretEntryList } from "./secret-entry-list";
import { SecretDetailView } from "./secret-detail-view";

const mapStateToProps = (state: State) => ({
  error: state.service.error,
});
const stateProps = returntypeof(mapStateToProps);

export type Props = typeof stateProps & BoundActions;

class ListSecretsImpl extends React.Component<Props, {}> {
  render() {
    return (
      <Grid height={[100, "vh"]} colSpec={[[1, 'fr'], [2, 'fr']]}>
        <SecretEntryList />
        <SecretDetailView />
      </Grid>
    )
  }
}

export const ListSecrets = connect(mapStateToProps, actionBinder)(ListSecretsImpl);
