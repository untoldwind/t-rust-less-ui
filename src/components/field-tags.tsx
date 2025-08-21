import React, { useContext } from "react";
import { Tag } from "@blueprintjs/core";
import { Flex } from "./ui/flex";
import { NoWrap } from "./ui/nowrap";
import { TranslationsContext } from "../i18n";

export interface FieldTagsProps {
  tags: string[];
}

export const FieldTags: React.FC<FieldTagsProps> = ({ tags }) => {
  const translate = useContext(TranslationsContext);

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
  );
};
