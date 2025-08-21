import React, { useContext } from "react";
import { Button, MenuItem } from "@blueprintjs/core";
import { ItemPredicate, ItemRenderer, MultiSelect } from "@blueprintjs/select";
import { Identity } from "../contexts/backend-tauri";
import { NoWrap } from "./ui/nowrap";
import { TranslationsContext } from "../i18n";

export interface FieldEditRecipientsProps {
  identities: Identity[];
  recipients: string[];
  onChange: (recipients: string[]) => void;
}

const RecipientMultiSelect = MultiSelect.ofType<Identity>();

export const FieldEditRecipients: React.FC<FieldEditRecipientsProps> = ({
  identities,
  recipients,
  onChange,
}) => {
  const translate = useContext(TranslationsContext);
  const selectedIdentites: Identity[] = [];

  for (const recipient of recipients) {
    const identity = identities.find((identity) => identity.id === recipient);

    if (identity) selectedIdentites.push(identity);
  }

  const itemRenderer: ItemRenderer<Identity> = (
    identity,
    { modifiers, handleClick },
  ) => {
    if (!modifiers.matchesPredicate || recipients.indexOf(identity.id) >= 0) {
      return null;
    }
    return (
      <MenuItem
        active={modifiers.active}
        key={identity.id}
        text={`${identity.name} <${identity.email}>`}
        onClick={handleClick}
      />
    );
  };
  const handleItemRemove = (_: React.ReactNode, idx: number) => {
    onChange([...recipients.slice(0, idx), ...recipients.slice(idx + 1)]);
  };

  const handleItemSelect = (identity: Identity) => {
    if (recipients.indexOf(identity.id) < 0)
      onChange([...recipients, identity.id]);
  };

  const handleClear = () => onChange([]);

  const identityPredicate: ItemPredicate<Identity> = (
    query,
    identity,
    _index,
    exactMatch,
  ) => {
    const normalizedName = identity.name.toLowerCase();
    const normalizedEmail = identity.email.toLowerCase();
    const normalizedQuery = query.toLowerCase();
    return exactMatch
      ? normalizedQuery == normalizedName || normalizedQuery == normalizedEmail
      : normalizedEmail.startsWith(normalizedQuery) ||
          normalizedName.indexOf(normalizedQuery) >= 0;
  };

  return (
    <>
      <NoWrap>{translate.secret.recipients}</NoWrap>
      <RecipientMultiSelect
        fill
        resetOnSelect
        items={identities}
        selectedItems={selectedIdentites}
        itemRenderer={itemRenderer}
        tagRenderer={(identity) => `${identity.name} {<${identity.email}>`}
        itemPredicate={identityPredicate}
        onItemSelect={handleItemSelect}
        popoverProps={{ minimal: true }}
        tagInputProps={{
          onRemove: handleItemRemove,
          rightElement:
            recipients.length > 0 ? (
              <Button icon="cross" minimal={true} onClick={handleClear} />
            ) : undefined,
        }}
      />
    </>
  );
};
