import * as React from "react";
import { SecretType } from "../../../native";
import { translations } from "../i18n";
import { NoWrap } from "./ui/nowrap";

export interface FieldTypeProps {
  value: SecretType
}

export const FieldType: React.FunctionComponent<FieldTypeProps> = props => {
  const translate = React.useMemo(translations, [translations]);
  const { value } = props;

  return (
    <>
      <NoWrap>{translate.secret.type}</NoWrap>
      <NoWrap>{translate.secret.typeName[value]}</NoWrap>
    </>
  )
}