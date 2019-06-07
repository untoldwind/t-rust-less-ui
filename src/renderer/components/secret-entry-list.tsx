import * as React from "react";
import { State } from "../reducers/state";
import { returntypeof } from "../helpers/returntypeof";
import { BoundActions, actionBinder } from "../actions/bindable";
import { connect } from "react-redux";
import { Grid } from "./ui/grid";
import { Spinner, Menu, MenuItem } from "@blueprintjs/core";
import { SecretEntryMatch } from "../../common/model";
import { bind } from "decko";

const mapStateToProps = (state: State) => ({
  selectedStore: state.service.selectedStore,
  listInProgress: state.store.listInProgress,
  list: state.store.list,
  currentSecret: state.store.currentSecret,
});
const stateProps = returntypeof(mapStateToProps);

export type Props = typeof stateProps & BoundActions;

class SecretEntryListImpl extends React.Component<Props, {}> {
  render(): React.ReactNode {
    const { listInProgress, list } = this.props;

    if (!list || listInProgress) {
      return (
        <Grid columns={1}>
          <Spinner />
        </Grid>
      );
    }
    return (
      <div style={{ overflowY: "auto" }}>
        <Menu>
          {list.entries.map(this.renderListEntry)}
        </Menu>
      </div>
    )
  }

  @bind
  private renderListEntry(entryMatch: SecretEntryMatch): React.ReactNode {
    const { currentSecret } = this.props;

    return (
      <MenuItem key={entryMatch.entry.id}
        text={entryMatch.entry.name}
        active={currentSecret !== null && currentSecret.id === entryMatch.entry.id}
        onClick={this.onEntrySelect(entryMatch.entry.id)} />
    )
  }

  @bind
  private onEntrySelect(secret_id: string) {
    return () => {
      const { selectedStore } = this.props;

      if (!selectedStore) return;
      this.props.doSelectEntry(selectedStore, secret_id)
    }
  }
}

export const SecretEntryList = connect(mapStateToProps, actionBinder)(SecretEntryListImpl);
