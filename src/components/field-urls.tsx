import React, { useContext } from "react";
import { openExternal } from "../contexts/backend-tauri";
import { Flex } from "./ui/flex";
import { NoWrap } from "./ui/nowrap";
import { css } from "@emotion/css";
import { TranslationsContext } from "../i18n";

const linkClass = css({
  maxWidth: "100%",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

export interface FieldUrlsProps {
  urls: string[];
}

export const FieldUrls: React.FC<FieldUrlsProps> = ({ urls }) => {
  const translate = useContext(TranslationsContext);

  if (urls.length === 0) return null;

  return (
    <>
      <NoWrap>{translate.secret.urls}</NoWrap>
      <Flex flexDirection="column" gap={5} maxWidth={[100, "%"]}>
        {urls.map((url, idx) => (
          <a
            key={idx}
            className={linkClass}
            onClick={(event) => {
              event.preventDefault();
              openExternal(url);
            }}
          >
            {url}
          </a>
        ))}
      </Flex>
    </>
  );
};
