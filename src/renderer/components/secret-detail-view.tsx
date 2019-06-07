import * as React from "react";
import { State } from "../reducers/state";
import { returntypeof } from "../helpers/returntypeof";
import { BoundActions, actionBinder } from "../actions/bindable";
import { connect } from "react-redux";
import { Grid } from "./ui/grid";

const mapStateToProps = (state: State) => ({
  currentSecret: state.store.currentSecret,
});
const stateProps = returntypeof(mapStateToProps);

export type Props = typeof stateProps & BoundActions;

class SecretDetailViewImpl extends React.Component<Props, {}> {
  render(): React.ReactNode {
    const { currentSecret } = this.props;

    if (!currentSecret) return null;

    return (
      <div style={{ overflowY: "auto" }}>
        <Grid columns={2}>
          <div>Name:</div>
          <div>{currentSecret.current.name}</div>
          <div>Type:</div>
          <div>{currentSecret.current.secret_type}</div>
        </Grid>
      </div>
    )
  }
}

export const SecretDetailView = connect(mapStateToProps, actionBinder)(SecretDetailViewImpl);
