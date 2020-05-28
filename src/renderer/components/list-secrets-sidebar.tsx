import * as React from "react";
import { SECRET_TYPES } from "../../common/model";
import { FlexItem } from "./ui/flex-item";
import { Menu, MenuItem } from "@blueprintjs/core";
import { translations } from "../i18n";
import { useService } from "@xstate/react";
import { mainInterpreter } from "../machines/main";
import { SecretType } from "../../../native";

export const ListSecretsSidebar: React.FunctionComponent<{}> = props => {
  const translate = React.useMemo(translations, [translations])
  const [state, send] = useService(mainInterpreter);

  function onFilterType(secretType: SecretType): () => void {
    return () => {
      send({
        type: "SET_SECRET_FILTER", secretFilter: {
          name: state.context.secretFilter.name,
          type: secretType,
        },
      });
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
        {SECRET_TYPES.map((t, i) => (
          <MenuItem key={i}
            text={translate.secret.typeName[t]}
            active={state.context.secretFilter.type === t}
            onClick={onFilterType(t)} />
        ))}
      </Menu>
      <FlexItem flexGrow={1} />
      <Menu>
        <MenuItem text={translate.secret.deleted}
          icon="trash"
          active={state.context.secretFilter.deleted}
          onClick={onFilterDeleted} />
      </Menu>
    </div>
  );
}