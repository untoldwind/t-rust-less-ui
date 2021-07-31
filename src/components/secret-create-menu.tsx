import * as React from "react";
import { Button, Menu, MenuItem, Popover, PopoverPosition } from "@blueprintjs/core";
import { translations } from "../i18n";
import { mainInterpreter } from "../machines/main";
import { useService } from "@xstate/react";
import { SecretType, SECRET_TYPES } from "../machines/backend-tauri";


export const SecretCreateMenu: React.FunctionComponent = () => {
  const translate = React.useMemo(translations, [translations])
  const send = useService(mainInterpreter)[1];

  function onCreateSecret(secretType: SecretType): () => void {
    return () => {
      send({ type: "CREATE_SECRET", secretType })
    }
  }


  const popupMenu = (
    <Menu>
      {SECRET_TYPES.map((secretType, idx) => (
        <MenuItem key={idx}
          text={translate.secret.typeName[secretType]}
          onClick={onCreateSecret(secretType)} />
      ))}
    </Menu>
  );

  return (
    <Popover content={popupMenu} position={PopoverPosition.RIGHT}>
      <Button icon="add" large minimal />
    </Popover>
  )
}