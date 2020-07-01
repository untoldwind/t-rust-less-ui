import * as React from "react";
import { Grid } from "./ui/grid";
import { Tab, Tabs, NumericInput, Switch, InputGroup, Button } from "@blueprintjs/core";
import { PasswordGeneratorWordsParam, PasswordGeneratorCharsParam } from "../../../native";
import { translations } from "../i18n";
import { GridItem } from "./ui/grid-item";
import { generatePassword } from "../machines/backend-neon";

export interface PasswordGeneratorProps {
  onPasswordGenerated: (password: string) => void
}

const DEFAULT_CHARS_PARAM: PasswordGeneratorCharsParam = {
  num_chars: 16,
  include_uppers: true,
  include_numbers: true,
  include_symbols: true,
  require_upper: true,
  require_number: true,
  require_symbol: true,
  exlcude_similar: false,
  exclude_ambiguous: false,
};

const DEFAULT_WORDS_PARAM: PasswordGeneratorWordsParam = {
  num_words: 4,
  delim: '.',
}

export type Generator = "chars" | "words";

export const PasswordGenerator: React.FunctionComponent<PasswordGeneratorProps> = props => {
  const translate = React.useMemo(translations, [translations]);
  const [generator, setGenerator] = React.useState<Generator>("chars");
  const [charsParam, setCharsParam] = React.useState(DEFAULT_CHARS_PARAM);
  const [wordsParam, setWordsParam] = React.useState(DEFAULT_WORDS_PARAM);

  const charsPanel = (
    <Grid columnSpec="min-content 1fr" gap={10} alignItems="center">
      <div>{translate.passwordGenerator.numChars}</div>
      <NumericInput value={charsParam.num_chars} onValueChange={num_chars => setCharsParam({
        ...charsParam,
        num_chars,
      })} />
      <GridItem colSpan={2}>
        <Switch label={translate.passwordGenerator.includeUppers} checked={charsParam.include_uppers} onChange={event => setCharsParam({
          ...charsParam,
          include_uppers: event.currentTarget.checked,
        })} />
      </GridItem>
      <GridItem colSpan={2}>
        <Switch label={translate.passwordGenerator.includeNumbers} checked={charsParam.include_numbers} onChange={event => setCharsParam({
          ...charsParam,
          include_numbers: event.currentTarget.checked,
        })} />
      </GridItem>
      <GridItem colSpan={2}>
        <Switch label={translate.passwordGenerator.includeSymbols} checked={charsParam.include_symbols} onChange={event => setCharsParam({
          ...charsParam,
          include_symbols: event.currentTarget.checked,
        })} />
      </GridItem>
      <GridItem colSpan={2}>
        <Switch label={translate.passwordGenerator.requireUpper} checked={charsParam.require_upper} onChange={event => setCharsParam({
          ...charsParam,
          require_upper: event.currentTarget.checked,
        })} />
      </GridItem>
      <GridItem colSpan={2}>
        <Switch label={translate.passwordGenerator.requireNumber} checked={charsParam.require_number} onChange={event => setCharsParam({
          ...charsParam,
          require_number: event.currentTarget.checked,
        })} />
      </GridItem>
      <GridItem colSpan={2}>
        <Switch label={translate.passwordGenerator.requireSymbol} checked={charsParam.require_symbol} onChange={event => setCharsParam({
          ...charsParam,
          require_symbol: event.currentTarget.checked,
        })} />
      </GridItem>
      <GridItem colSpan={2}>
        <Switch label={translate.passwordGenerator.excludeSimilar} checked={charsParam.exlcude_similar} onChange={event => setCharsParam({
          ...charsParam,
          exlcude_similar: event.currentTarget.checked,
        })} />
      </GridItem>
      <GridItem colSpan={2}>
        <Switch label={translate.passwordGenerator.excludeAmbigous} checked={charsParam.exclude_ambiguous} onChange={event => setCharsParam({
          ...charsParam,
          exclude_ambiguous: event.currentTarget.checked,
        })} />
      </GridItem>
    </Grid>
  );

  const wordsPanel = (
    <Grid columnSpec="min-content 1fr" gap={10} alignItems="center">
      <div>{translate.passwordGenerator.numWords}</div>
      <NumericInput value={wordsParam.num_words} onValueChange={num_words => setWordsParam({
        ...wordsParam,
        num_words,
      })} />
      <div>{translate.passwordGenerator.delim}</div>
      <InputGroup value={wordsParam.delim} maxLength={1} onChange={(event: React.FormEvent<HTMLInputElement>) => setWordsParam({
        ...wordsParam,
        delim: event.currentTarget.value,
      })} />
    </Grid>
  );

  function onGenerate() {
    switch (generator) {
      case "chars":
        generatePassword({ chars: charsParam }).then(props.onPasswordGenerated, () => { })
        break;
      case "words":
        generatePassword({ words: wordsParam }).then(props.onPasswordGenerated, () => { })
        break;
    }
  }

  return (
    <Grid columns={1} padding={10}>
      <Tabs selectedTabId={generator} onChange={(generator: Generator) => setGenerator(generator)}>
        <Tab id="chars" title={translate.passwordGenerator.chars} panel={charsPanel} />
        <Tab id="words" title={translate.passwordGenerator.words} panel={wordsPanel} />
        <Tabs.Expander />
        <Button icon="repeat" minimal onClick={onGenerate} />
      </Tabs>
    </Grid>
  )
}