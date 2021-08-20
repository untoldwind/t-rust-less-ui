import React from "react";
import { TEXT_MUTED } from "@blueprintjs/core/lib/esm/common/classes";
import { css, cx } from "@emotion/css";

const noWrapClass = css({
  whiteSpace: "nowrap",
});

export const Muted: React.FC = React.memo(({ children }) => (
  <div className={cx(TEXT_MUTED, noWrapClass)}>{children}</div>
));
