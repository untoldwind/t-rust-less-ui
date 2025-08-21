import React, { useContext } from "react";
import { SecretType, SECRET_TYPES } from "../contexts/backend-tauri";
import { HTMLSelect } from "@blueprintjs/core";
import { NoWrap } from "./ui/nowrap";
import { TranslationsContext } from "../i18n";

export interface FieldEditTypeProps {
  value: SecretType;
  onChange: (newType: SecretType) => void;
}

export const FieldEditType: React.FC<FieldEditTypeProps> = ({
  value,
  onChange,
}) => {
  const translate = useContext(TranslationsContext);

  return (
    <>
      <NoWrap>{translate.secret.type}</NoWrap>
      <HTMLSelect
        value={value}
        onChange={(event) => onChange(event.currentTarget.value as SecretType)}
      >
        {SECRET_TYPES.map((secretType) => (
          <option key={secretType} value={secretType}>
            {translate.secret.typeName[secretType]}
          </option>
        ))}
      </HTMLSelect>
    </>
  );
};
