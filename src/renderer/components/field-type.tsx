import * as React from "react";
import { SecretType } from "../../../native";
import { translations } from "../i18n";

export interface FieldTypeProps {
  value: SecretType
}

export const FieldType: React.FunctionComponent<FieldTypeProps> = props => {
  const translate = React.useMemo(translations, [translations]);
  const { value } = props;

  return (
    <>
      <div>{translate.secret.type}</div>
      <div>{translate.secret.typeName[value]}</div>
    </>
  )
}