import * as React from "react";
import { SecretType } from "../../../native";
import { translations } from "../i18n";
import { HTMLSelect } from "@blueprintjs/core";
import { SECRET_TYPES } from "../helpers/types";
import { NoWrap } from "./ui/nowrap";

export interface FieldEditTypeProps {
  value: SecretType,
  onChange: (newType: SecretType) => void
}

export const FieldEditType: React.FunctionComponent<FieldEditTypeProps> = ({ value, onChange }) => {
  const translate = React.useMemo(translations, [translations]);

  return (
    <>
      <NoWrap>{translate.secret.type}</NoWrap>
      <HTMLSelect value={value} onChange={event => onChange(event.currentTarget.value as SecretType)}>
        {SECRET_TYPES.map(secretType => (
          <option key={secretType} value={secretType}>{translate.secret.typeName[secretType]}</option>
        ))}
      </HTMLSelect>
    </>
  )
}