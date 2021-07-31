import * as React from "react";
import { translations } from "../i18n";
import { SecretType } from "../machines/backend-tauri";
import { NoWrap } from "./ui/nowrap";

export interface FieldTypeProps {
  value: SecretType
}

export const FieldType: React.FC<FieldTypeProps> = props => {
  const translate = React.useMemo(translations, [translations]);
  const { value } = props;

  return (
    <>
      <NoWrap>{translate.secret.type}</NoWrap>
      <NoWrap>{translate.secret.typeName[value]}</NoWrap>
    </>
  )
}