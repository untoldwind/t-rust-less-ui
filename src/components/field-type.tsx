import React from "react";
import { SecretType } from "../machines/backend-tauri";
import { useTranslate } from "../machines/state";
import { NoWrap } from "./ui/nowrap";

export interface FieldTypeProps {
  value: SecretType
}

export const FieldType: React.FC<FieldTypeProps> = ({ value }) => {
  const translate = useTranslate();

  return (
    <>
      <NoWrap>{translate.secret.type}</NoWrap>
      <NoWrap>{translate.secret.typeName[value]}</NoWrap>
    </>
  )
}