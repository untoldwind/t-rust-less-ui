import * as React from "react";
import { BoundActions, actionBinder } from "../actions/bindable";
import { returntypeof } from "../helpers/returntypeof";
import { State } from "../reducers/state";
import { connect } from "react-redux";
import { Grid, GridItem } from "./ui/grid";
import { SecretEntryList } from "./secret-entry-list";
import { SecretDetailView } from "./secret-detail-view";
import { InputGroup } from "@blueprintjs/core";
import { bind } from "decko";

const mapStateToProps = (state: State) => ({
  listFilter: state.store.listFilter,
  error: state.service.error,
});
const stateProps = returntypeof(mapStateToProps);

export type Props = typeof stateProps & BoundActions;

class ListSecretsImpl extends React.Component<Props, {}> {
  render() {
    return (
      <Grid height={[100, "vh"]} colSpec={[[1, 'fr'], [2, 'fr']]} rowSpec={[[40, 'px'], [1, 'fr']]}>
        <GridItem colSpan={2}>
          {this.renderHeader()}
        </GridItem>
        <SecretEntryList />
        <SecretDetailView />
      </Grid>
    )
  }

  private renderHeader(): React.ReactNode {
    const { listFilter } = this.props;

    return (
      <Grid colSpec={[[1, 'fr'], [2, 'fr']]}>
        <InputGroup leftIcon="search" autoFocus value={listFilter.name || ""} onChange={this.onChangeNameFilter} />
      </Grid>
    )
    return null
  }

  @bind
  private onChangeNameFilter(event: React.FormEvent<HTMLElement>) {
    const { listFilter } = this.props;
    const value = (event.target as HTMLInputElement).value

    this.props.doUpdateListFilter({
      ...listFilter,
      name: value.length > 0 ? value : undefined,
    })
  }
}

export const ListSecrets = connect(mapStateToProps, actionBinder)(ListSecretsImpl);
