import { Dialog } from "@blueprintjs/core";
import React from "react";
import { Flex } from "./ui/flex";
import { css } from "@emotion/css";
import { FlexItem } from "./ui/flex-item";
import { SecretVersion } from "../contexts/backend-tauri";

const charOuter = css({
  position: "relative",
});

const charMarker = css({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  height: "5px",
  borderLeft: "1px solid gray",
  borderRight: "1px solid gray",
  borderBottom: "1px solid gray",
});
const charInner = css({
  fontFamily: "Hack",
  fontSize: "40px",
  fontWeight: 700,
});

export interface ZoomDisplayProps {
  secretVersion: SecretVersion;
  property: string;
  onClose: () => void;
}

export const ZoomDisplay: React.FC<ZoomDisplayProps> = ({
  secretVersion,
  property,
  onClose,
}) => {
  const title = `${secretVersion.name}: ${property}`;
  const chars = Array.from(secretVersion.properties[property]);

  return (
    <Dialog
      isOpen={chars.length > 0}
      title={title}
      onClose={onClose}
      usePortal
      canEscapeKeyClose
      canOutsideClickClose
      shouldReturnFocusOnClose
    >
      <FlexItem alignSelf="center" padding={5}>
        <Flex flexDirection="row" gap={5} flexWrap="wrap">
          {chars.map((ch, idx) => (
            <div key={idx} className={charOuter}>
              <div className={charInner}>{ch}</div>
              <div className={charMarker} />
            </div>
          ))}
        </Flex>
      </FlexItem>
    </Dialog>
  );
};
