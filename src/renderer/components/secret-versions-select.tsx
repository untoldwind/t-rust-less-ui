import * as React from "react";
import { State } from "../reducers/state";
import { returntypeof } from "../helpers/returntypeof";
import { BoundActions, actionBinder } from "../actions/bindable";
import { connect } from "react-redux";
import { FlexHorizontal } from "./ui/flex";
import { Button } from "@blueprintjs/core";

const mapStateToProps = (state: State) => ({
  currentSecret: state.store.currentSecret,
});
const stateProps = returntypeof(mapStateToProps);

export type Props = typeof stateProps & BoundActions;

class SecretVersionSelectImpl extends React.Component<Props, {}> {
  render(): React.ReactNode {
    return (
      <FlexHorizontal>
        <Button icon="chevron-backward" />
        <Button icon="chevron-forward" />
      </FlexHorizontal>
    )
  }
}

export const SecretVersionSelect = connect(mapStateToProps, actionBinder)(SecretVersionSelectImpl);