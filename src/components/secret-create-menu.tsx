import React from "react";
import { Button, Menu, MenuItem, PopoverPosition } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import { translations } from "../i18n";
import { SECRET_TYPES } from "../machines/backend-tauri";
import { useCreateSecret } from "../machines/actions";


export const SecretCreateMenu: React.FC = () => {
  const translate = React.useMemo(translations, [translations])
  const createSecret = useCreateSecret();

  const popupMenu = (
    <Menu>
      {SECRET_TYPES.map((secretType, idx) => (
        <MenuItem key={idx}
          text={translate.secret.typeName[secretType]}
          onClick={() => createSecret(secretType)} />
      ))}
    </Menu>
  );

  return (
    <Popover2 content={popupMenu} position={PopoverPosition.RIGHT} positioningStrategy="fixed">
      <Button icon="add" large minimal />
    </Popover2>
  )
}