import * as React from 'react';
import styled from "styled-components"
import svgToMiniDataURI from "mini-svg-data-uri"
import { Box, BoxProps } from "grommet"
import { formatSVG } from "./Patterns/util"
import { PatternListItem } from './Patterns/patternListItem'

type PatternListProps = {
  patterns: PatternType[]
  onClickDestroy?: (pat: PatternType) => void
  onClickSave?: (data: PatternType) => Promise<any>
}

export const PatternList = ({ patterns, onClickDestroy, onClickSave}: PatternListProps) => {
  const handleClickCopyPattern = (content: string) => {
    // evt.stopPropagation()
    return navigator.clipboard.writeText(content).then(text => {
      console.log("Successfully copied SVG markup")
    }).catch(err => {
      console.error('Failed to write clipboard contents: ', err);
    });
  }

  const handleClickSavePattern = (pattern: PatternType) => {
    // evt.stopPropagation()
    // console.log("evt", evt, "pattern", pattern)
    if (onClickSave) {
      return onClickSave(pattern)
    } else {
      return Promise.resolve()
    }
    // onClickSave && onClickSave(pattern).then(() => {
    //   debugger
    // }).catch(() => {
    //   debugger
    // })
  }

  return (
    <>
      {patterns.map((pattern: PatternType, i: number) => {
        return (
          <PatternListItem
            key={`pat-${pattern.id}-${i}`}
            ident={pattern.id}
            markup={pattern.markup}
            onClickCopyMarkup={() => handleClickCopyPattern(formatSVG(pattern.markup))}
            onClickCopyDataUri={() => handleClickCopyPattern(svgToMiniDataURI(formatSVG(pattern.markup)))}
            onClickSave={onClickSave ? () => handleClickSavePattern(pattern) : undefined}
            onClickDestroy={onClickDestroy ? () => onClickDestroy(pattern) : undefined}
          />
        )
      })}
    </>
  )
}

export const PatternGrid = styled(Box)<BoxProps>`
  display: grid;
  grid-gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: minmax(150px, 25vh);
`

export default PatternList
