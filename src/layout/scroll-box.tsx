import { styled } from "@mui/material";
import React, { PropsWithChildren } from "react";

const OuterDiv = styled("div")(() => ({
  position: "relative",
  height: "100%",
  width: "100%",
}));

const InnerDiv = styled("div")(() => ({
  overflow: "auto",
  position: "absolute",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
}));

export const ScrollBox: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <OuterDiv>
      <InnerDiv>{children}</InnerDiv>
    </OuterDiv>
  );
};
