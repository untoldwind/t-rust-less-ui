import * as React from "react";
import { FlexItem } from "./ui/flex-item";
import { Menu, MenuItem } from "@blueprintjs/core";
import { translations } from "../i18n";
import { useService } from "@xstate/react";
import { mainInterpreter } from "../machines/main";
import { SecretType } from "../../../native";
import { SECRET_TYPES } from "../helpers/types";

export const ListSecretsSidebar: React.FunctionComponent = () => {
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
        {SECRET_TYPES.map((secretType, idx) => (
          <MenuItem key={idx}
            text={translate.secret.typeName[secretType]}
            active={state.context.secretFilter.type === secretType}
            onClick={onFilterType(secretType)} />
        ))}
      </Menu>
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