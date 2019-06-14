import * as React from "react";
import { BoundActions, actionBinder } from "../actions/bindable";
import { returntypeof } from "../helpers/returntypeof";
import { State } from "../reducers/state";
import { connect } from "react-redux";
import { Grid, GridItem } from "./ui/grid";
import { SecretEntryList } from "./secret-entry-list";
import { SecretDetailView } from "./secret-detail-view";
import { InputGroup, Button, ProgressBar, Menu, MenuItem } from "@blueprintjs/core";
import { bind } from "decko";
import { FlexHorizontal } from "./ui/flex";
import { translations } from "../i18n";
import moment from "moment";
import { SECRET_TYPES } from "../../common/model";

const mapStateToProps = (state: State) => ({
  listFilter: state.store.listFilter,
  selectedStore: state.service.selectedStore,
  status: state.store.status,
  error: state.service.error,
});
const stateProps = returntypeof(mapStateToProps);

export type Props = typeof stateProps & BoundActions;

class ListSecretsImpl extends React.Component<Props, {}> {
  private translate = translations();

  render() {
    return (
      <Grid height={[100, "vh"]} columns={[[200, 'px'], [1, 'fr'], [2, 'fr']]} rows={[[40, 'px'], [1, 'fr']]}>
        <GridItem colSpan={3}>
          {this.renderHeader()}
        </GridItem>
        {this.renderSideBar()}
        <SecretEntryList />
        <SecretDetailView />
      </Grid>
    )
  }

  private renderSideBar(): React.ReactNode {
    return (
      <div className="bp3-dark sidebar">
        <Menu>
          {SECRET_TYPES.map((t, i) => (
            <MenuItem key={i} text={this.translate.secret.typeName[t]} />
          ))}
        </Menu>
      </div>
    )
  }

  private renderHeader(): React.ReactNode {
    const { listFilter } = this.props;

    return (
      <Grid columns={[[1, 'fr'], [2, 'fr']]}>
        <GridItem padding={["base", "base"]}>
          <InputGroup leftIcon="search" autoFocus value={listFilter.name || ""} onChange={this.onChangeNameFilter} />
        </GridItem>
        <FlexHorizontal reverse>
          <Grid columns={1}>
            <Button onClick={this.onLock}>{this.translate.action.lock}</Button>
            <ProgressBar stripes={false} animate={false} value={this.autoLockProgress()} />
          </Grid>
        </FlexHorizontal>
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

  @bind
  private onLock() {
    const { selectedStore } = this.props;

    selectedStore && this.props.doLockStore(selectedStore);
  }

  private autoLockProgress(): number {
    const { status } = this.props;

    if (!status || status.locked) return 0;

    const autoLockIn = moment(status.autolock_at).diff(moment()) / 5.0 / 60.0 / 1000.0;

    return autoLockIn > 1 ? 1 : autoLockIn;
  }
}

export const ListSecrets = connect(mapStateToProps, actionBinder)(ListSecretsImpl);
