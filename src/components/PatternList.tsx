import * as React from 'react';
import { PatternGrid } from './Patterns/grid'
import { PatternListItem } from './Patterns/patternListItem'
import { formatSVG } from "./Patterns/util"
import svgToMiniDataURI from "mini-svg-data-uri"

type PatternData = {
  id: string
  markup: string
}

type PatternListProps = {
  patterns: PatternData[]
  onDestroy?: (pat: PatternData) => void
  onSave?: (data: PatternData) => void
  key?: string
}

export const PatternList = React.memo(({ patterns, onDestroy, onSave}: PatternListProps) => {
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

  return (
      <PatternGrid>
        {patterns.map((pattern: PatternData, i: number) => {
          return (
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
        })}
      </PatternGrid>

  )
})

export default PatternList
