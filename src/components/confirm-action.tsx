import * as React from 'react';
import { Button, IconName, MaybeElement } from '@blueprintjs/core';
import { Popover2 } from "@blueprintjs/popover2";
import { translations } from '../i18n';
import { Grid } from './ui/grid';
import { NoWrap } from './ui/nowrap';

export interface ConfirmActionProps {
  action: string
  icon: IconName | MaybeElement
  onConfirm: () => void
};

export const ConfirmAction: React.FunctionComponent<ConfirmActionProps> = ({ action, icon, onConfirm }) => {
  const translate = React.useMemo(translations, [translations]);
  const popoverContent = (
    <Grid columns={1} gap={10} padding={10}>
      <NoWrap>{action}</NoWrap>
      <Button intent="danger" icon={icon} onClick={onConfirm}>{translate.action.confirm}</Button>
    </Grid>
  );
  return (
    <Popover2 content={popoverContent}>
      <Button icon={icon} minimal large />
    </Popover2>
  )
}