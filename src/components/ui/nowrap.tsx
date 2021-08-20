import React from "react";
import { css } from "@emotion/css";

const noWrapClass = css({
  whiteSpace: "nowrap",
});

export const NoWrap: React.FC = React.memo(({ children }) => (<div className={noWrapClass}>{children}</div>));
