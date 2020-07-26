import * as React from 'react';
import styled from "styled-components"
import { PatternListItem } from './Patterns/patternListItem'
import { formatSVG } from "./Patterns/util"
import { Box, BoxProps } from "grommet"
import svgToMiniDataURI from "mini-svg-data-uri"
import {InfiniteScroll} from './InfiniteScroll';


// const Scroller = InfiniteScroll<PatternData>

type PatternListProps = {
  patterns: PatternData[]
  setMore: (hasMore: boolean) => void
  more: boolean
  onDestroy?: (pat: PatternData) => void
  onSave?: (data: PatternData) => void
  cursor?: firebase.firestore.QueryDocumentSnapshot<PatternData>
  fetchPatterns: (startAfter?: firebase.firestore.QueryDocumentSnapshot<PatternData>) => Promise<PatternDataResponse>
  setPatterns: (data: PatternDataResponse) => void
  key?: string
}

export const ScrollablePatternList = React.memo(({onDestroy, ...props}: PatternListProps) => {
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
    props.onSave && props.onSave(pattern)
  }

  const renderPattern = (pattern: PatternData, i: number) => (
    <PatternListItem
      key={`pat-${pattern.id}-${i}`}
      ident={pattern.id}
      markup={pattern.markup}
      onClickCopyMarkup={(evt: React.MouseEvent) => handleClickCopyPattern(evt, formatSVG(pattern.markup))}
      onClickCopyDataUri={(evt: React.MouseEvent) => handleClickCopyPattern(evt, svgToMiniDataURI(formatSVG(pattern.markup)))}
      onClickSave={props.onSave ? (evt: React.MouseEvent) => handleClickSavePattern(evt, pattern) : undefined}
      onClickDestroy={onDestroy ? () => onDestroy(pattern) : undefined}
    />
  )

  return (
    <InfiniteScroll
      setMore={props.setMore}
      more={props.more}
      renderFn={renderPattern}
      cursor={props.cursor}
      items={props.patterns}
      fetch={props.fetchPatterns}
      set={props.setPatterns}
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
