import { css } from "@emotion/css";
import * as React from "react";

const noWrapClass = css({
  whiteSpace: "nowrap",
});

export const NoWrap: React.FunctionComponent = ({ children }) => (<div className={noWrapClass}>{children}</div>);
