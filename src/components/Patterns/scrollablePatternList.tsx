import * as React from 'react';
import { PatternListItem } from './patternListItem'
import { formatSVG } from "./util"
import svgToMiniDataURI from "mini-svg-data-uri"
import { InfiniteScroll } from './../InfiniteScroll';

type PatternListProps = {
  patterns: PatternType[]
  hasMore: boolean
  cursor: firebase.firestore.QueryDocumentSnapshot<PatternType>
  loadMore: (lv: firebase.firestore.QueryDocumentSnapshot<PatternType>) => LoadMoreResponse<PatternType>
  onDestroy?: (pat: PatternType) => void
  onSave?: (data: PatternType) => void
}

export const ScrollablePatternList = ({ onDestroy, patterns, loadMore, onSave, cursor, hasMore }: PatternListProps) => {
  const handleClickCopyPattern = (evt: React.MouseEvent, content: string) => {
    evt.stopPropagation()

    navigator.clipboard.writeText(content).then(text => {
      console.log("Successfully copied SVG markup")
    }).catch(err => {
      console.error('Failed to write clipboard contents: ', err);
    });
  }

  const handleClickSavePattern = (evt: React.MouseEvent, pattern: PatternType) => {
    evt.stopPropagation()
    onSave && onSave(pattern)
  }

  const renderPattern = (pattern: PatternType, i: number): JSX.Element => (
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
      items={patterns}
      cursor={cursor}
      loadMore={loadMore}
      renderFn={renderPattern}
      hasMore={hasMore}
    />
  )
}
