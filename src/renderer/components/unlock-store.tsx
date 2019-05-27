import * as React from "react";
import { returntypeof } from "../helpers/returntypeof";
import { State } from "../reducers/state";
import { BoundActions, actionBinder } from "../actions/bindable";
import { connect } from "react-redux";
import { Grid, GridItem } from "./ui/grid";
import { FlexVertical } from "./ui/flex";
import { SelectField } from "./ui/select-field";
import { PasswordField } from "./ui/password-field";

const mapStateToProps = (state: State) => ({
  error: state.service.error,
  stores: state.service.stores,
  selectedStore: state.service.selectedStore,
  identities: state.store.identities,
});
const stateProps = returntypeof(mapStateToProps);

export type Props = typeof stateProps & BoundActions;

interface ComponentState {
  selectedIdentity: string
  passpharse: string
}

class UnlockStoreImpl extends React.Component<Props, ComponentState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      selectedIdentity: props.identities.length > 0 ? props.identities[0].id : "",
      passpharse: "",
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
    const { selectedIdentity, passpharse } = this.state;

    return (
      <Grid height={[100, '%']} colSpec={[[1, 'fr'], [1, 'fr'], [1, 'fr']]} rowSpec={[[1, 'fr'], [1, 'fr'], [1, 'fr']]}>
        <GridItem colStart={2} rowStart={2}>
          <FlexVertical>
            <SelectField value={selectedStore || ""} options={stores.map(store => ({ label: store, value: store }))} />
            <SelectField value={selectedIdentity} options={identities.map(identity => ({ label: `${identity.name} <${identity.email}>`, value: identity.id }))} />
            <PasswordField value={passpharse} autoFocus />
          </FlexVertical>
        </GridItem>
      </Grid>
    )
  }
}

export const UnlockStore = connect(mapStateToProps, actionBinder)(UnlockStoreImpl);