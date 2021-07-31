import { css } from "@emotion/css";
import * as React from "react";

const noWrapClass = css({
  whiteSpace: "nowrap",
});

export const NoWrap: React.FC = ({ children }) => (<div className={noWrapClass}>{children}</div>);
