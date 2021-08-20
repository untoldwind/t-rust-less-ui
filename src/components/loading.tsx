import React from "react"
import { Spinner, SpinnerSize } from "@blueprintjs/core"
import { Grid } from "./ui/grid"

export const Loading: React.FC = () => {
  return (
    <Grid height={[100, '%']} columnSpec={[[1, 'fr']]} rowSpec="1fr" alignItems="center" justifyItems="center">
      <Spinner size={SpinnerSize.LARGE} />
    </Grid>
  )
}