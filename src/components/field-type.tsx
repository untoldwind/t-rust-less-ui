import React, { useContext } from "react";
import { SecretType } from "../contexts/backend-tauri";
import { NoWrap } from "./ui/nowrap";
import { TranslationsContext } from "../i18n";

export interface FieldTypeProps {
  value: SecretType;
}

export const FieldType: React.FC<FieldTypeProps> = ({ value }) => {
  const translate = useContext(TranslationsContext);

  return (
    <>
      <NoWrap>{translate.secret.type}</NoWrap>
      <NoWrap>{translate.secret.typeName[value]}</NoWrap>
    </>
  );
};
