import * as React from "react";
import { BoundActions, actionBinder } from "../actions/bindable";
import { State } from "../reducers/state";
import { connect } from "react-redux";
import { Grid, GridItem } from "./ui/grid";
import { SecretEntryList } from "./secret-entry-list";
import { SecretDetailView } from "./secret-detail-view";
import { InputGroup, Button, ProgressBar, Menu, MenuItem, Navbar } from "@blueprintjs/core";
import { bind } from "decko";
import { FlexItem } from "./ui/flex";
import { translations } from "../i18n";
import moment from "moment";
import { SECRET_TYPES, SecretType } from "../../common/model";
import Mousetrap from "mousetrap";

const mapStateToProps = (state: State) => ({
  listFilter: state.store.listFilter,
  list: state.store.list,
  selectedStore: state.service.selectedStore,
  currentSecret: state.store.currentSecret,
  status: state.store.status,
  error: state.service.error,
});

export type Props = ReturnType<typeof mapStateToProps> & BoundActions;

class ListSecretsImpl extends React.Component<Props, {}> {
  private searchInput: HTMLElement | null = null;
  private translate = translations();

  componentDidMount() {
    Mousetrap.bind("up", this.onSelectUp);
    Mousetrap.bind("down", this.onSelectDown);
    this.searchInput && Mousetrap(this.searchInput).bind("up", this.onSelectUp);
    this.searchInput && Mousetrap(this.searchInput).bind("down", this.onSelectDown);
  }

  componentWillUnmount() {
    Mousetrap.unbind("up");
    Mousetrap.unbind("down");
    this.searchInput && Mousetrap(this.searchInput).unbind("up");
    this.searchInput && Mousetrap(this.searchInput).unbind("down");
  }

  render() {
    return (
      <Grid height={[100, "vh"]} columns={[[200, 'px'], [1, 'fr'], [2, 'fr']]} rows={["min-content", [1, 'fr']]}>
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
    const { listFilter } = this.props;

    return (
      <div className="bp3-dark sidebar">
        <Menu>
          {SECRET_TYPES.map((t, i) => (
            <MenuItem key={i}
              text={this.translate.secret.typeName[t]}
              active={listFilter.type === t}
              onClick={this.onFilterType(t)} />
          ))}
        </Menu>
        <FlexItem grow={1} />
        <Menu>
          <MenuItem text={this.translate.secret.deleted}
            icon="trash"
            active={listFilter.deleted}
            onClick={this.onFilterDeleted} />
        </Menu>
      </div>
    )
  }

  private renderHeader(): React.ReactNode {
    const { listFilter } = this.props;

    return (
      <Navbar>
        <Navbar.Group align="left">
          <InputGroup leftIcon="search" autoFocus value={listFilter.name || ""} onChange={this.onChangeNameFilter} inputRef={el => this.searchInput = el} />
        </Navbar.Group>
        <Navbar.Group align="right">
          <Grid columns={1}>
            <Button onClick={this.onLock}>{this.translate.action.lock}</Button>
            <ProgressBar stripes={false} animate={false} value={this.autoLockProgress()} />
          </Grid>
        </Navbar.Group>
      </Navbar>
    )
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

  @bind
  private onFilterType(secretType: SecretType): () => void {
    const { listFilter } = this.props;

    return () => {
      this.props.doUpdateListFilter({
        ...listFilter,
        type: secretType,
        deleted: undefined,
      })
    }
  }

  @bind
  private onFilterDeleted() {
    const { listFilter } = this.props;

    this.props.doUpdateListFilter({
      ...listFilter,
      type: undefined,
      deleted: true,
    })
  }

  @bind
  private onSelectUp(event: KeyboardEvent) {
    const { selectedStore, list, currentSecret } = this.props;

    if (!selectedStore || !list) return;

    event.preventDefault();
    event.stopPropagation();
    this.props.doSelectUp(selectedStore, list, currentSecret);
  }

  @bind
  private onSelectDown(event: KeyboardEvent) {
    const { selectedStore, list, currentSecret } = this.props;

    if (!selectedStore || !list) return;

    event.preventDefault();
    event.stopPropagation();
    this.props.doSelectDown(selectedStore, list, currentSecret);
  }
}

export const ListSecrets = connect(mapStateToProps, actionBinder)(ListSecretsImpl);
