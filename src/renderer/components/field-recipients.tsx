import { Tag } from "@blueprintjs/core";
import * as React from "react";
import { Identity } from "../../../native";
import { translations } from "../i18n";
import { Flex } from "./ui/flex";
import { NoWrap } from "./ui/nowrap";

export interface FieldRecipientsProps {
  identities: Identity[]
  recipients: string[]
}

export const FieldRecipients: React.FunctionComponent<FieldRecipientsProps> = ({ recipients, identities }) => {
  const translate = React.useMemo(translations, [translations]);

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