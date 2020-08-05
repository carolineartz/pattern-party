import * as React from 'react';
import svgToMiniDataURI from "mini-svg-data-uri"

import { formatSVG } from "./util"
import { PatternListItem } from "./patternListItem"

type PatternListProps = {
  patterns: PatternType[]
  onDestroy?: (pat: PatternType) => void
  onSave?: (data: PatternType) => void
  key?: string
}

export const PatternList = ({ patterns, onDestroy, onSave }: PatternListProps) => {
  console.log("rendering pattern list with", patterns)
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

  return (
    <>
      {patterns.map((pattern: PatternType, i: number) => {
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
    </>
  )
}

export default PatternList
