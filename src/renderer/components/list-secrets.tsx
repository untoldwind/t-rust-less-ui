import * as React from "react";
import { BoundActions, actionBinder } from "../actions/bindable";
import { returntypeof } from "../helpers/returntypeof";
import { State } from "../reducers/state";
import { Panel } from "./ui/panel";
import { connect } from "react-redux";

const mapStateToProps = (state: State) => ({
  error: state.service.error,
});
const stateProps = returntypeof(mapStateToProps);

export type Props = typeof stateProps & BoundActions;

class ListSecretsImpl extends React.Component<Props, {}> {
  render() {
    const { error } = this.props;

    if (!error) return null;

    return (
      <Panel state="failure">
        {error.display}
      </Panel>
    )
  }
}

export const ListSecrets = connect(mapStateToProps, actionBinder)(ListSecretsImpl);
