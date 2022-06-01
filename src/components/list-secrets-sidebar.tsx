import React from "react";
import { FlexItem } from "./ui/flex-item";
import { Menu, MenuItem, H5 } from "@blueprintjs/core";
import { SECRET_TYPES } from "../machines/backend-tauri";
import { secretListFilterDeletedState, secretListFilterTagState, secretListFilterTypeState, secretListState, useTranslate } from "../machines/state";
import { useRecoilState, useRecoilValueLoadable } from "recoil";

export const ListSecretsSidebar: React.FC = () => {
  const translate = useTranslate();
  const [secretListFilterType, setSecretListFilterType] = useRecoilState(secretListFilterTypeState);
  const [secretListFilterTag, setSecretListFilterTag] = useRecoilState(secretListFilterTagState);
  const [secretListFilterDeleted, setSecretListFilterDeleted] = useRecoilState(secretListFilterDeletedState);
  const secretList = useRecoilValueLoadable(secretListState);
  const [tags, setTags] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (secretList.state == "hasValue")
      setTags(secretList.contents.all_tags);
  }, [secretList]);

  return (
    <div className="bp4-dark browser-sidebar">
      <Menu>
        {SECRET_TYPES.map((secretType, idx) => (
          <MenuItem key={idx} text={translate.secret.typeName[secretType]} active={secretListFilterType === secretType} onClick={() => setSecretListFilterType(secretType)} />
        ))}
      </Menu>

      <FlexItem padding={[10, 0, 0, 0]}>
        <H5>{translate.secret.tags}</H5>
        <Menu>
          {tags.map((tag, idx) => (
            <MenuItem key={idx} text={tag} active={secretListFilterTag === tag} onClick={() => setSecretListFilterTag(tag)} />
          ))}
        </Menu>
      </FlexItem>
      <FlexItem flexGrow={1} />
      <Menu>
        <MenuItem text={translate.secret.archived} icon="box" active={secretListFilterDeleted} onClick={() => setSecretListFilterDeleted(true)} />
      </Menu>
    </div>
  );
}