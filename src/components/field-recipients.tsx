import React from "react";
import { Tag } from "@blueprintjs/core";
import { Identity } from "../machines/backend-tauri";
import { Flex } from "./ui/flex";
import { NoWrap } from "./ui/nowrap";
import { useTranslate } from "../machines/state";

export interface FieldRecipientsProps {
  identities: Identity[]
  recipients: string[]
}

export const FieldRecipients: React.FC<FieldRecipientsProps> = ({ recipients, identities }) => {
  const translate = useTranslate()

  return (
    <>
      <NoWrap>{translate.secret.recipients}</NoWrap>
      <Flex flexDirection="row" gap={5}>
        {recipients.map((recipient, idx) => {
          const identity = identities.find(identity => identity.id === recipient);

          if (identity)
            return (<Tag key={idx}>{identity.name} {`<${identity.email}>`}</Tag>)
          else
            return (<Tag key={idx}>Unknown ({recipient})</Tag>)
        })}
      </Flex>
    </>
  )
}