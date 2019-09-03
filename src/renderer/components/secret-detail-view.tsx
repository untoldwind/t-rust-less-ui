import * as React from "react";
import { State } from "../reducers/state";
import { BoundActions, actionBinder } from "../actions/bindable";
import { connect } from "react-redux";
import { FlexVertical, FlexItem } from "./ui/flex";
import { FieldText } from "./field-text";
import { translations } from "../i18n";
import { FieldPassword } from "./field-password";
import { FieldNote } from "./field-note";
import { PasswordStrength } from "../../common/model";

const mapStateToProps = (state: State) => ({
  selectedStore: state.service.selectedStore,
  currentSecret: state.store.currentSecret,
});

export type Props = ReturnType<typeof mapStateToProps> & BoundActions;

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
            const strength = currentSecret.password_strengths[name];
            return (
              <FlexItem grow={0}>
                {this.renderProperty(name, value, strength)}
              </FlexItem>
            )
          })}
        </FlexVertical>
      </div>
    )
  }

  private renderProperty(name: string, value: string, strength?: PasswordStrength): React.ReactNode {
    switch (name) {
      case "note":
        return (
          <FieldNote key={name} label={this.translate.secret.property(name)} value={value} onCopy={this.onCopyProperty(name)}/>
        );
      case "password":
        return (
          <FieldPassword key={name} label={this.translate.secret.property(name)} value={value} strength={strength} onCopy={this.onCopyProperty(name)}/>
        );
      default:
        return (
          <FieldText key={name} label={this.translate.secret.property(name)} value={value} onCopy={this.onCopyProperty(name)}/>
        );
    }
  }

  private onCopyProperty(name: string) : () => void {
    return () => {
      const { selectedStore, currentSecret } = this.props;

      if (!selectedStore || !currentSecret) return;

      this.props.doSecretToClipboard(selectedStore, currentSecret.id, [name]);
    }
  }
}

export const SecretDetailView = connect(mapStateToProps, actionBinder)(SecretDetailViewImpl);
