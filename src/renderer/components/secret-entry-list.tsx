import * as React from "react";
import { State } from "../reducers/state";
import { returntypeof } from "../helpers/returntypeof";
import { BoundActions, actionBinder } from "../actions/bindable";
import { connect } from "react-redux";
import { Grid } from "./ui/grid";
import { Spinner, Menu, MenuItem } from "@blueprintjs/core";
import { SecretEntryMatch } from "../../common/model";

const mapStateToProps = (state: State) => ({
  listInProgress: state.store.listInProgress,
  list: state.store.list,
});
const stateProps = returntypeof(mapStateToProps);

export type Props = typeof stateProps & BoundActions;

class SecretEntryListImpl extends React.Component<Props, {}> {
  render(): React.ReactNode {
    const { listInProgress, list } = this.props;

    if (!list || listInProgress) {
      return (
        <Grid height={[100, 'vh']} columns={1}>
          <Spinner />
        </Grid>
      );
    }
    return (
      <Menu>
        {list.entries.map(this.renderListEntry)}
      </Menu>
    )
  }

  private renderListEntry(entryMatch: SecretEntryMatch): React.ReactNode {
    return (
      <MenuItem key={entryMatch.entry.id} text={entryMatch.entry.name} />
    )
  }
}

export const SecretEntryList = connect(mapStateToProps, actionBinder)(SecretEntryListImpl);
