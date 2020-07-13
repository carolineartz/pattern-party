import * as React from "react"

import styled, { createGlobalStyle } from "styled-components"
import { Doodle } from "./doodle"
import { withFirebase, WithFirebaseProps } from "./../Firebase"
import { Box, BoxProps } from "grommet"

type PatternData = {
  markup: string
  id: string
}

const Patterns = ({ firebase }: WithFirebaseProps) => {
  const [patterns, setPatterns] = React.useState<PatternData[] | undefined>()
  const [activePatternId, setActivePatternId] = React.useState<string | undefined>()
  const containerRef = React.useRef<HTMLDivElement | null>(null)

  const fetchPatterns = async () => {
    const pats = await firebase.patterns().get()
    const foo = pats.docs

    let patData: PatternData[] = []

    foo.forEach((bar) => {
      const markupString = bar.data().markup

      patData.push({
        id: bar.id,
        markup: markupString
      })
    })

    setPatterns(patData)
  }

  React.useEffect(() => {
    if (!patterns) {
      fetchPatterns()
    }
  }, [patterns])

  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({behavior: "smooth"})
    }
  }, [activePatternId])

  return (
    <>
      <GlobalDoodleStyles />
      <PatternGrid pad="medium" ref={containerRef}>
        {patterns && patterns.map((data: PatternData, i: number) => {
          return (
            <Doodle
              ident={data.id}
              key={`pat-${data.id}`}
              markup={data.markup}
              active={activePatternId === data.id}
              setActive={setActivePatternId}
            />
          )
        })}
      </PatternGrid>
    </>
  )
}

const GlobalDoodleStyles = createGlobalStyle`
  css-doodle {
    height: 100%;
  }

  span.inline-color {
    display: inline-block;
    height: 1.333ch;
    width: 1.333ch;
    margin: 0 .333ch;
    box-sizing: border-box;
    border: 1px solid white;
    outline: 1px solid black;
  }
`

const PatternGrid = styled(Box)<BoxProps & { ref: any }>`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: minmax(150px, 25vh);
`

export default withFirebase(Patterns)
