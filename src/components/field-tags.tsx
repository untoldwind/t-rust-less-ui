import React from "react";
import { Tag } from "@blueprintjs/core";
import { useTranslate } from "../machines/state";
import { Flex } from "./ui/flex";
import { NoWrap } from "./ui/nowrap";

export interface FieldTagsProps {
  tags: string[]
}

export const FieldTags: React.FC<FieldTagsProps> = ({ tags }) => {
  const translate = useTranslate()

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