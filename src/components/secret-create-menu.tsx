import React, { useContext } from "react";
import {
  Button,
  Menu,
  MenuItem,
  Popover,
  PopoverPosition,
} from "@blueprintjs/core";
import { TranslationsContext } from "../i18n";
import {
  generateId,
  SECRET_TYPES,
  SecretType,
} from "../contexts/backend-tauri";
import { BrowseStateContext } from "../contexts/browse-state";
import moment from "moment";

export const SecretCreateMenu: React.FC = () => {
  const browseState = useContext(BrowseStateContext);
  const translate = useContext(TranslationsContext);

  async function createSecret(secretType: SecretType) {
    const secret_id = await generateId();
    browseState.setEditSecretVersion({
      secret_id,
      type: secretType,
      name: "",
      timestamp: moment().format(),
      tags: [],
      urls: [],
      properties: {},
      deleted: false,
      attachments: [],
      recipients: [browseState.unlockedBy.id],
    });
  }

  const popupMenu = (
    <Menu>
      {SECRET_TYPES.map((secretType, idx) => (
        <MenuItem
          key={idx}
          text={translate.secret.typeName[secretType]}
          onClick={() => createSecret(secretType)}
        />
      ))}
    </Menu>
  );

  return (
    <Popover
      content={popupMenu}
      position={PopoverPosition.RIGHT}
      positioningStrategy="fixed"
    >
      <Button icon="add" large minimal />
    </Popover>
  );
};
