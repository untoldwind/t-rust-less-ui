import * as React from "react";
import { returntypeof } from "../helpers/returntypeof";
import { State } from "../reducers/state";
import { BoundActions, actionBinder } from "../actions/bindable";
import { connect } from "react-redux";

const mapStateToProps = (state: State) => ({
    error: state.service.error,
    stores: state.service.stores,
});
const stateProps = returntypeof(mapStateToProps);

export type Props = typeof stateProps & BoundActions;

class UnlockStoreImpl extends React.Component<Props, {}> {
    render() {
        return (
            <div>Unlock</div>
        )
    }
}

export const UnlockStore = connect(mapStateToProps, actionBinder)(UnlockStoreImpl);