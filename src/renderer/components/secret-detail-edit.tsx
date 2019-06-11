import * as React from "react";
import { State } from "../reducers/state";
import { returntypeof } from "../helpers/returntypeof";
import { BoundActions, actionBinder } from "../actions/bindable";
import { connect } from "react-redux";

const mapStateToProps = (state: State) => ({
  currentSecret: state.store.currentSecret,
});
const stateProps = returntypeof(mapStateToProps);

export type Props = typeof stateProps & BoundActions;

interface ComponentState {

}

class SecretDetailEditImpl extends React.Component<Props, ComponentState> {
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  render(): React.ReactNode {
    return (
      <div />
    )
  }
}

export const SecretDetailEdit = connect(mapStateToProps, actionBinder)(SecretDetailEditImpl);