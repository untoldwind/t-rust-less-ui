import { Button, IconName, MaybeElement, Popover } from '@blueprintjs/core';
import * as React from 'react';
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
    <Popover content={popoverContent}>
      <Button icon={icon} minimal large />
    </Popover>
  )
}