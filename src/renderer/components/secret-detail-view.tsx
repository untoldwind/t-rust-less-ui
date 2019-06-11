import * as React from "react";
import { State } from "../reducers/state";
import { returntypeof } from "../helpers/returntypeof";
import { BoundActions, actionBinder } from "../actions/bindable";
import { connect } from "react-redux";
import { FlexVertical, FlexItem } from "./ui/flex";
import { FieldText } from "./field-text";
import { translations } from "../i18n";
import { FieldPassword } from "./field-password";
import { FieldNote } from "./field-note";

const mapStateToProps = (state: State) => ({
  currentSecret: state.store.currentSecret,
});
const stateProps = returntypeof(mapStateToProps);

export type Props = typeof stateProps & BoundActions;

class SecretDetailViewImpl extends React.Component<Props, {}> {
  private translate = translations();

  render(): React.ReactNode {
    const { currentSecret } = this.props;

    if (!currentSecret) return null;

    return (
      <div style={{ overflowY: "auto" }}>
        <FlexVertical gap="md">
          <FlexItem grow={0}>
            <FieldText label={this.translate.secret.name} value={currentSecret.current.name} />
          </FlexItem>
          <FlexItem grow={0}>
            <FieldText label={this.translate.secret.type} value={currentSecret.current.secret_type} />
          </FlexItem>
          {Object.keys(currentSecret.current.properties).map(name => {
            const value = currentSecret.current.properties[name];
            { this.renderProperty(name, value) }
          })}
        </FlexVertical>
      </div>
    )
  }

  private renderProperty(name: string, value: string): React.ReactNode {
    switch (name) {
      case "note":
        return (
          <FieldNote key={name} label={this.translate.secret.property(name)} value={value} />
        );
      case "password":
        return (
          <FieldPassword key={name} label={this.translate.secret.property(name)} value={value} />
        );
      default:
        return (
          <FieldText key={name} label={this.translate.secret.property(name)} value={value} />
        );
    }
  }
}

export const SecretDetailView = connect(mapStateToProps, actionBinder)(SecretDetailViewImpl);
