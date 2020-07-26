import * as React from 'react';
import styled from "styled-components"
import { PatternListItem } from './Patterns/patternListItem'
import { formatSVG } from "./Patterns/util"
import { Box, BoxProps } from "grommet"
import svgToMiniDataURI from "mini-svg-data-uri"
import { InfiniteScroll } from './InfiniteScroll';

type PatternListProps = {
  patterns: PatternData[]
  onDestroy?: (pat: PatternData) => void
  onSave?: (data: PatternData) => void
  fetch: any,
  more: boolean
  key?: string
}

export const ScrollablePatternList = React.memo(({ patterns, onDestroy, onSave, fetch, more}: PatternListProps) => {
  const handleClickCopyPattern = (evt: React.MouseEvent, content: string) => {
    evt.stopPropagation()

    navigator.clipboard.writeText(content).then(text => {
      console.log("Successfully copied SVG markup")
    }).catch(err => {
      console.error('Failed to write clipboard contents: ', err);
    });
  }

  const handleClickSavePattern = (evt: React.MouseEvent, pattern: PatternData) => {
    evt.stopPropagation()
    onSave && onSave(pattern)
  }

  const renderPattern = (pattern: PatternData, i: number) => (
    <PatternListItem
      key={`pat-${pattern.id}-${i}`}
      ident={pattern.id}
      markup={pattern.markup}
      onClickCopyMarkup={(evt: React.MouseEvent) => handleClickCopyPattern(evt, formatSVG(pattern.markup))}
      onClickCopyDataUri={(evt: React.MouseEvent) => handleClickCopyPattern(evt, svgToMiniDataURI(formatSVG(pattern.markup)))}
      onClickSave={onSave ? (evt: React.MouseEvent) => handleClickSavePattern(evt, pattern) : undefined}
      onClickDestroy={onDestroy ? () => onDestroy(pattern) : undefined}
    />
  )

  return (
    <InfiniteScroll
      renderFn={renderPattern}
      more={more}
      items={patterns}
      fetch={fetch}
    />
  )
})

export const PatternGrid = styled(Box)<BoxProps>`
  display: grid;
  grid-gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: minmax(150px, 25vh);
`

export default ScrollablePatternList
