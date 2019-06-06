import * as React from "react";
import { returntypeof } from "../helpers/returntypeof";
import { State } from "../reducers/state";
import { BoundActions, actionBinder } from "../actions/bindable";
import { connect } from "react-redux";
import { Grid, GridItem } from "./ui/grid";
import { Button, InputGroup, HTMLSelect } from "@blueprintjs/core";
import { bind } from "decko";
import { ServiceErrorPanel } from "./service-error-panel";

const mapStateToProps = (state: State) => ({
  stores: state.service.stores,
  selectedStore: state.service.selectedStore,
  identities: state.store.identities,
});
const stateProps = returntypeof(mapStateToProps);

export type Props = typeof stateProps & BoundActions;

interface ComponentState {
  selectedIdentity: string
  passphrase: string
}

class UnlockStoreImpl extends React.Component<Props, ComponentState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selectedIdentity: props.identities.length > 0 ? props.identities[0].id : "",
      passphrase: "",
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.identities !== prevProps.identities && this.props.identities.length > 0 && this.state.selectedIdentity === "") {
      this.setState({
        selectedIdentity: this.props.identities[0].id,
      })
    }
  }

  render() {
    const { selectedStore, stores, identities } = this.props;
    const { selectedIdentity, passphrase } = this.state;

    return (
      <Grid height={[100, '%']} colSpec={[[1, 'fr'], [1, 'fr'], [1, 'fr']]} rowSpec={[[1, 'fr'], [1, 'fr'], [1, 'fr']]}>
        <GridItem colSpan={3}>
          <ServiceErrorPanel />
        </GridItem>
        <GridItem colStart={2}>
          <form onSubmit={this.onUnlock}>
            <Grid columns={1} rowGap="md">
              <HTMLSelect value={selectedStore || ""} large>
                {stores.map(store => (
                  <option key={store} value={store}>{store}</option>
                ))}
              </HTMLSelect>
              <HTMLSelect value={selectedIdentity} large>
                {identities.map(identity => (
                  <option key={identity.id} value={identity.id}>{identity.name} {`<${identity.email}>`}</option>
                ))}
              </HTMLSelect>
              <InputGroup value={passphrase} type="password" leftIcon="key" large onChange={(event: React.FormEvent<HTMLElement>) => this.setState({ passphrase: (event.target as HTMLInputElement).value })} />
              <Button type="submit" icon="log-in" intent="success" large disabled={!this.isValid()}>Unlock</Button>
            </Grid>
          </form>
        </GridItem>
      </Grid>
    )
  }

  private isValid() {
    const { selectedStore } = this.props;
    const { selectedIdentity, passphrase } = this.state;

    return selectedStore && selectedIdentity.length > 0 && passphrase.length > 0;
  }

  @bind
  private onUnlock(event: React.FormEvent<HTMLElement>) {
    event.preventDefault();
    event.stopPropagation();

    const { selectedStore } = this.props;
    const { selectedIdentity, passphrase } = this.state;

    if (selectedStore && selectedIdentity.length > 0 && passphrase.length > 0) {
      this.props.doUnlockStore(selectedStore, selectedIdentity, passphrase)
    }
  }
}

export const UnlockStore = connect(mapStateToProps, actionBinder)(UnlockStoreImpl);