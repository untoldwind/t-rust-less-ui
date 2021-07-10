import { Tag } from "@blueprintjs/core";
import * as React from "react";
import { translations } from "../i18n";
import { Flex } from "./ui/flex";
import { NoWrap } from "./ui/nowrap";

export interface FieldTagsProps {
  tags: string[]
}

export const FieldTags: React.FunctionComponent<FieldTagsProps> = ({ tags }) => {
  const translate = React.useMemo(translations, [translations]);

  if (tags.length === 0) return null;

  return (
    <>
      <NoWrap>{translate.secret.tags}</NoWrap>
      <Flex flexDirection="row" gap={5}>
        {tags.map((tag, idx) => (
          <Tag key={idx}>{tag}</Tag>
        ))}
      </Flex>
    </>
  )
}