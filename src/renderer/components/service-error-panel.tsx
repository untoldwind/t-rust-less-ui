import * as React from "react";
import { BoundActions, actionBinder } from "../actions/bindable";
import { State } from "../reducers/state";
import { connect } from "react-redux";
import { Toaster, Toast } from "@blueprintjs/core";

const mapStateToProps = (state: State) => ({
  error: state.service.error,
});

export type Props = ReturnType<typeof mapStateToProps> & BoundActions;

class ServiceErrorPanelImpl extends React.Component<Props, {}> {
  render(): React.ReactNode {
    const { error } = this.props;

    if (!error) return null;

    return (
      <Toaster>
        <Toast intent="danger" message={error.display} onDismiss={this.props.doDismissError} />
      </Toaster>
    )
  }
}

export const ServiceErrorPanel = connect(mapStateToProps, actionBinder)(ServiceErrorPanelImpl);
