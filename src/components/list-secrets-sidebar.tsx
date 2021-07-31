import * as React from "react";
import { FlexItem } from "./ui/flex-item";
import { Menu, MenuItem, H5 } from "@blueprintjs/core";
import { translations } from "../i18n";
import { useActor } from "@xstate/react";
import { mainInterpreter } from "../machines/main";
import { SecretType, SECRET_TYPES } from "../machines/backend-tauri";

export const ListSecretsSidebar: React.FunctionComponent = () => {
  const translate = React.useMemo(translations, [translations])
  const [state, send] = useActor(mainInterpreter);

  function onFilterType(type: SecretType): () => void {
    return () => {
      send({
        type: "SET_SECRET_FILTER", secretFilter: {
          name: state.context.secretFilter.name,
          type,
        },
      });
    }
  }

  function onFilterTag(tag: string): () => void {
    return () => {
      send({
        type: "SET_SECRET_FILTER", secretFilter: {
          name: state.context.secretFilter.name,
          tag,
        },
      })
    }
  }

  function onFilterDeleted() {
    send({
      type: "SET_SECRET_FILTER", secretFilter: {
        name: state.context.secretFilter.name,
        deleted: true,
      },
    });
  }

  return (
    <div className="bp3-dark sidebar">
      <Menu>
        {SECRET_TYPES.map((secretType, idx) => (
          <MenuItem key={idx}
            text={translate.secret.typeName[secretType]}
            active={state.context.secretFilter.type === secretType}
            onClick={onFilterType(secretType)} />
        ))}
      </Menu>

      {state.context.secretList && state.context.secretList.all_tags && <FlexItem padding={[10, 0, 0, 0]}>
        <H5>{translate.secret.tags}</H5>
        <Menu>
          {state.context.secretList.all_tags.map((tag, idx) => (
            <MenuItem key={idx}
              text={tag}
              active={state.context.secretFilter.tag === tag}
              onClick={onFilterTag(tag)} />
          ))}
        </Menu>
      </FlexItem>}
      <FlexItem flexGrow={1} />
      <Menu>
        <MenuItem text={translate.secret.archived}
          icon="box"
          active={state.context.secretFilter.deleted}
          onClick={onFilterDeleted} />
      </Menu>
    </div>
  );
}