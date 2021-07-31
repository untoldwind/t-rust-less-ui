import { Button, InputGroup } from "@blueprintjs/core";
import * as React from "react";
import { translations } from "../i18n";
import { Grid } from "./ui/grid";
import { NoWrap } from "./ui/nowrap";

export interface FieldEditUrlsProps {
  urls: string[]
  onChange: (urls: string[]) => void
}

export const FieldEditUrls: React.FC<FieldEditUrlsProps> = ({ urls, onChange }) => {
  const translate = React.useMemo(translations, [translations]);

  const activeUrls = urls.length === 0 || urls[urls.length - 1].length > 0 ? [...urls, ""] : [...urls];

  function handleDelete(idx: number) {
    const len = activeUrls[activeUrls.length - 1].length === 0 ? activeUrls.length - 1 : activeUrls.length;
    onChange([...activeUrls.slice(0, idx), ...activeUrls.slice(idx + 1, len)]);
  }

  function handleChange(idx: number, value: string) {
    const len = activeUrls[activeUrls.length - 1].length === 0 ? activeUrls.length - 1 : activeUrls.length;
    onChange([...activeUrls.slice(0, idx), value, ...activeUrls.slice(idx + 1, len)]);
  }

  function handleCleanup(idx: number) {
    if (activeUrls[idx].length === 0) handleDelete(idx);
  }

  return (
    <>
      <NoWrap>{translate.secret.urls}</NoWrap>
      <Grid columns={1} gap={5}>
        {activeUrls.map((url, idx) => (
          <InputGroup key={idx} value={url} fill
            onBlur={() => handleCleanup(idx)}
            onChange={(event: React.FormEvent<HTMLInputElement>) => handleChange(idx, event.currentTarget.value)}
            rightElement={idx < activeUrls.length - 1 ? <Button intent="danger" minimal icon="remove" onClick={() => handleDelete(idx)} /> : undefined} />
        ))}
      </Grid>
    </>
  )
}