import React, { useContext } from "react";
import { FlexItem } from "./ui/flex-item";
import { Menu, MenuItem, H5 } from "@blueprintjs/core";
import { SECRET_TYPES } from "../contexts/backend-tauri";
import { TranslationsContext } from "../i18n";
import { BrowseStateContext } from "../contexts/browse-state";

export const ListSecretsSidebar: React.FC = () => {
  const browseState = useContext(BrowseStateContext);
  const translate = useContext(TranslationsContext);
  const tags = browseState.secretList.all_tags;

  return (
    <div className="bp6-dark browser-sidebar">
      <Menu>
        {SECRET_TYPES.map((secretType, idx) => (
          <MenuItem
            key={idx}
            text={translate.secret.typeName[secretType]}
            active={browseState.secretListFilter.type === secretType}
            onClick={() => browseState.setSecretListFilterType(secretType)}
          />
        ))}
      </Menu>

      <FlexItem padding={[10, 0, 0, 0]}>
        <H5>{translate.secret.tags}</H5>
        <Menu>
          {tags.map((tag, idx) => (
            <MenuItem
              key={idx}
              text={tag}
              active={browseState.secretListFilter.tag === tag}
              onClick={() => browseState.setSecretListFilterTag(tag)}
            />
          ))}
        </Menu>
      </FlexItem>
      <FlexItem flexGrow={1} />
      <Menu>
        <MenuItem
          text={translate.secret.archived}
          icon="box"
          active={browseState.secretListFilter.deleted}
          onClick={() => browseState.setSecretListFilterDeleted(true)}
        />
      </Menu>
    </div>
  );
};
