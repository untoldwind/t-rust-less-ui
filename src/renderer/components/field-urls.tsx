import * as React from "react";
import { translations } from "../i18n";
import { openExternal } from "../machines/backend-neon";
import { Flex } from "./ui/flex";
import { NoWrap } from "./ui/nowrap";

export interface FieldUrlsProps {
  urls: string[]
}

export const FieldUrls: React.FunctionComponent<FieldUrlsProps> = ({ urls }) => {
  const translate = React.useMemo(translations, [translations]);

  if (urls.length === 0) return null;

  return (
    <>
      <NoWrap>{translate.secret.urls}</NoWrap>
      <Flex flexDirection="column" gap={5}>
        {urls.map((url, idx) => (
          <a key={idx} onClick={event => {
            event.preventDefault();
            openExternal(url);
          }}>{url}</a>
        ))}
      </Flex>
    </>
  )
}