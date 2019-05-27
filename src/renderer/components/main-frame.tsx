import * as React from "react";
import { State } from "../reducers/state";
import { returntypeof } from "../helpers/returntypeof";
import { BoundActions, actionBinder } from "../actions/bindable";
import { connect } from "react-redux";
import { UnlockStore } from "./unlock-store";

const mapStateToProps = (state: State) => ({
  page: state.navigation.page,
});
const stateProps = returntypeof(mapStateToProps);

export type Props = typeof stateProps & BoundActions;

export class MainFrameImpl extends React.Component<Props, {}> {
  render() {
    switch (this.props.page) {
      case "UnlockStore":
        return (
          <UnlockStore />
        );
      default:
        return null;
    }
  }
}

export const MainFrame = connect(mapStateToProps, actionBinder)(MainFrameImpl);