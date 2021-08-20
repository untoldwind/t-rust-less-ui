import React from "react";
import { SecretType, SECRET_TYPES } from "../machines/backend-tauri";
import { HTMLSelect } from "@blueprintjs/core";
import { NoWrap } from "./ui/nowrap";
import { useTranslate } from "../machines/state";

export interface FieldEditTypeProps {
  value: SecretType,
  onChange: (newType: SecretType) => void
}

export const FieldEditType: React.FC<FieldEditTypeProps> = ({ value, onChange }) => {
  const translate = useTranslate()

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