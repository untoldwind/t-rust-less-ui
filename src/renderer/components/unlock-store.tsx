import * as React from "react";
import { returntypeof } from "../helpers/returntypeof";
import { State } from "../reducers/state";
import { BoundActions, actionBinder } from "../actions/bindable";
import { connect } from "react-redux";
import { Grid, GridItem } from "./ui/grid";
import { SelectField } from "./ui/select-field";
import { PasswordField } from "./ui/password-field";
import { Button } from "./ui/button";
import { bind } from "decko";
import { Form } from "./ui/form";
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
        <GridItem colStart={2} rowStart={2}>
          <Form onSubmit={this.onUnlock}>
            <Grid columns={1} rowGap="md">
              <SelectField value={selectedStore || ""} options={stores.map(store => ({ label: store, value: store }))} />
              <SelectField value={selectedIdentity} options={identities.map(identity => ({ label: `${identity.name} <${identity.email}>`, value: identity.id }))} />
              <PasswordField value={passphrase} autoFocus onValueChange={passphrase => this.setState({ passphrase })} />
              <Button type="submit" state="primary" disabled={!this.isValid()}>Unlock</Button>
            </Grid>
          </Form>
        </GridItem>
        <GridItem colSpan={3} colStart={1} rowStart={3}>
          <ServiceErrorPanel />
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
  private onUnlock() {
    const { selectedStore } = this.props;
    const { selectedIdentity, passphrase } = this.state;

    if (selectedStore && selectedIdentity.length > 0 && passphrase.length > 0) {
      this.props.doUnlockStore(selectedStore, selectedIdentity, passphrase)
    }
  }
}

export const UnlockStore = connect(mapStateToProps, actionBinder)(UnlockStoreImpl);