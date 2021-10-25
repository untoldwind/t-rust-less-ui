import { Alert } from "@blueprintjs/core";
import React from "react";
import { useRecoilState, useRecoilValueLoadable } from "recoil";
import { selectedSecretVersionState, zoomSecretPropertyState } from "../machines/state";
import { Flex } from "./ui/flex";
import { css } from "@emotion/css";

const charOuter = css({
  position: "relative",
  padding: "2px",
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
})
const charInner = css({
  fontFamily: "Hack",
  fontSize: "40px",
  fontWeight: 700,
});


export const ZoomDisplay: React.FC = () => {
  const currentSecretVersion = useRecoilValueLoadable(selectedSecretVersionState);
  const [zoomSecretProperty, setZoomSecretProperty] = useRecoilState(zoomSecretPropertyState);

  const chars = currentSecretVersion.state == "hasValue" && currentSecretVersion.contents !== undefined && zoomSecretProperty !== null ? Array.from(currentSecretVersion.contents.properties[zoomSecretProperty]) : [];

  return (
    <Alert isOpen={chars.length > 0} onClose={() => { setZoomSecretProperty(null) }} canEscapeKeyCancel canOutsideClickCancel>
      <Flex flexDirection="row" gap={5} flexWrap="wrap">
        {chars.map((ch, idx) => (
          <div key={idx} className={charOuter}>
            <div className={charInner}>{ch}</div>
            <div className={charMarker} />
          </div>
        ))}
      </Flex>
    </Alert>
  );
}
