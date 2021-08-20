import React from "react";
import { openExternal } from "../machines/backend-tauri";
import { useTranslate } from "../machines/state";
import { Flex } from "./ui/flex";
import { NoWrap } from "./ui/nowrap";
import { css } from "@emotion/css";

const linkClass = css({
  maxWidth: "100%",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

export interface FieldUrlsProps {
  urls: string[]
}

export const FieldUrls: React.FC<FieldUrlsProps> = ({ urls }) => {
  const translate = useTranslate()

  if (urls.length === 0) return null;

  return (
    <>
      <NoWrap>{translate.secret.urls}</NoWrap>
      <Flex flexDirection="column" gap={5} maxWidth={[100, "%"]}>
        {urls.map((url, idx) => (
          <a key={idx} className={linkClass} onClick={event => {
            event.preventDefault();
            openExternal(url);
          }}>{url}</a>
        ))}
      </Flex>
    </>
  )
}