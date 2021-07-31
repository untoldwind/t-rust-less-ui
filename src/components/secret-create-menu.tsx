import * as React from "react";
import { Button, Menu, MenuItem, PopoverPosition } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import { translations } from "../i18n";
import { mainInterpreter } from "../machines/main";
import { useActor } from "@xstate/react";
import { SecretType, SECRET_TYPES } from "../machines/backend-tauri";


export const SecretCreateMenu: React.FC = () => {
  const translate = React.useMemo(translations, [translations])
  const send = useActor(mainInterpreter)[1];

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
    <Popover2 content={popupMenu} position={PopoverPosition.RIGHT} positioningStrategy="fixed">
      <Button icon="add" large minimal />
    </Popover2>
  )
}