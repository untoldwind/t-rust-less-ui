import React, { useContext } from "react";
import { Button, IconName, MaybeElement, Popover } from "@blueprintjs/core";
import { Grid } from "./ui/grid";
import { NoWrap } from "./ui/nowrap";
import { TranslationsContext } from "../i18n";

export interface ConfirmActionProps {
  action: string;
  icon: IconName | MaybeElement;
  onConfirm: () => void;
}

export const ConfirmAction: React.FC<ConfirmActionProps> = ({
  action,
  icon,
  onConfirm,
}) => {
  const translate = useContext(TranslationsContext);
  const popoverContent = (
    <Grid columns={1} gap={10} padding={10}>
      <NoWrap>{action}</NoWrap>
      <Button intent="danger" icon={icon} onClick={onConfirm}>
        {translate.action.confirm}
      </Button>
    </Grid>
  );
  return (
    <Popover content={popoverContent}>
      <Button icon={icon} minimal large />
    </Popover>
  );
};
