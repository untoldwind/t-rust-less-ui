import { TEXT_MUTED } from "@blueprintjs/core/lib/esm/common/classes";
import * as React from "react";
import { css, cx } from "@emotion/css";

const noWrapClass = css({
  whiteSpace: "nowrap",
});

export const Muted: React.FunctionComponent = ({ children }) => (
  <div className={cx(TEXT_MUTED, noWrapClass)}>{children}</div>
);
