import { Button, MenuItem } from "@blueprintjs/core";
import { ItemPredicate, ItemRenderer, MultiSelect } from "@blueprintjs/select";
import * as React from "react";
import { translations } from "../i18n";
import { NoWrap } from "./ui/nowrap";

export interface FieldEditTagsProps {
  allTags: string[]
  tags: string[]
  onChange: (tags: string[]) => void
}

const TagMultiSelect = MultiSelect.ofType<string>();

export const FieldEditTags: React.FC<FieldEditTagsProps> = ({ allTags, tags, onChange }) => {
  const translate = React.useMemo(translations, [translations]);

  const itemRenderer: ItemRenderer<string> = (tag, { modifiers, handleClick }) => {
    if (!modifiers.matchesPredicate || tags.indexOf(tag) >= 0) {
      return null;
    }
    return (
      <MenuItem
        active={modifiers.active}
        key={tag}
        text={tag}
        onClick={handleClick} />
    )
  };

  const renderCreateTag = (query: string, active: boolean, handleClick: React.MouseEventHandler<HTMLElement>) => (
    <MenuItem icon="add" text={query} active={active} onClick={handleClick} />
  );

  const handleItemSelect = (tag: string) => {
    if (tags.indexOf(tag) < 0) onChange([...tags, tag]);
  };

  const handleItemRemove = (_: React.ReactNode, idx: number) => {
    onChange([...tags.slice(0, idx), ...tags.slice(idx + 1)]);
  }

  const tagPredicate: ItemPredicate<string> = (query, tag, _index, exactMatch) => {
    const normalizedTitle = tag.toLowerCase();
    const normalizedQuery = query.toLowerCase();
    return exactMatch ? normalizedQuery == normalizedTitle : normalizedTitle.startsWith(normalizedQuery)
  }

  const handleClear = () => onChange([]);

  return (
    <>
      <NoWrap>{translate.secret.tags}</NoWrap>
      <TagMultiSelect
        fill
        openOnKeyDown
        resetOnSelect
        items={allTags}
        selectedItems={tags}
        itemRenderer={itemRenderer}
        tagRenderer={tag => tag}
        itemPredicate={tagPredicate}
        onItemSelect={handleItemSelect}
        popoverProps={{ minimal: true }}
        createNewItemFromQuery={tag => tag}
        createNewItemRenderer={renderCreateTag}
        tagInputProps={{
          onRemove: handleItemRemove,
          rightElement: tags.length > 0 ? <Button icon="cross" minimal={true} onClick={handleClear} /> : undefined,
        }}
      />
    </>
  )
}