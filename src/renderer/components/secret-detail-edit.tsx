import * as React from "react";
import { State } from "../reducers/state";
import { BoundActions, actionBinder } from "../actions/bindable";
import { connect } from "react-redux";

const mapStateToProps = (state: State) => ({
  currentSecret: state.store.currentSecret,
});

export type Props = ReturnType<typeof mapStateToProps> & BoundActions;

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