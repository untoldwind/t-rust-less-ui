import React, { PropsWithChildren } from "react";
import { css } from "@emotion/css";

const noWrapClass = css({
  whiteSpace: "nowrap",
});

export const NoWrap: React.FC<PropsWithChildren<{}>> = React.memo(({ children }) => (<div className={noWrapClass}>{children}</div>));
