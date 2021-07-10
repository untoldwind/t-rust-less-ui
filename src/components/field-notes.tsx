import * as React from "react";
import { Flex } from "./ui/flex";
import { Button } from "@blueprintjs/core";
import { FlexItem } from "./ui/flex-item";
import { css } from "@emotion/css";
import { NoWrap } from "./ui/nowrap";

export interface FieldNotesProps {
  label: string
  value: string
  onCopy: () => void
}

const notesClass = css({
  flexGrow: 1,
  whiteSpace: "pre",
});

export const FieldNotes: React.FunctionComponent<FieldNotesProps> = ({ label, value, onCopy }) => {
  if (value.length === 0) return null;

  return (
    <>
      <NoWrap>{label}</NoWrap>
      <Flex flexDirection="row" gap={5}>
        <div className={notesClass}>{value}</div>
        {onCopy && <FlexItem flexGrow={0}><Button icon="clipboard" minimal onClick={onCopy} /></FlexItem>}
      </Flex>
    </>
  )
}