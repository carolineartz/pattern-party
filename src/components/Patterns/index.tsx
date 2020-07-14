import * as React from "react"

import "styled-components/macro"
import styled, { createGlobalStyle } from "styled-components"
import { Doodle } from "./doodle"
import { withFirebase, WithFirebaseProps } from "./../Firebase"
import { Box, BoxProps, Button } from "grommet"
import { CreatePatternIFrame } from "./create"
import { Add, Checkmark, Close } from "grommet-icons"

type PatternData = {
  markup: string
  id: string
}

const Patterns = ({ firebase }: WithFirebaseProps) => {
  const [patterns, setPatterns] = React.useState<PatternData[] | undefined>()
  const [activePatternId, setActivePatternId] = React.useState<string | undefined>()
  const [showCreate, setShowCreate] = React.useState<boolean>(false)

  const patternsContainerRef = React.useRef<HTMLDivElement | null>(null)
  const iFrameContainerRef = React.useRef<HTMLDivElement | null>(null)

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

  const handleClickCreate = () => {
    setActivePatternId(undefined)
    setShowCreate(true)
  }

  const handleSavePattern = () => {
    navigator.clipboard.readText().then(text => {
      if (!text.startsWith("<svg")) {
        console.log(text)
        throw new Error("Uncable to save pattern. Make sure to copy inline svg code to clipboard before clicking save.");
      } else {
        firebase.patterns().add({ markup: text })
      }
    }).catch(err => {
      console.error('Failed to read clipboard contents: ', err);
    });
  }

  React.useEffect(() => {
    if (!patterns) {
      fetchPatterns()
    }
  }, [patterns])

  React.useEffect(() => {
    if (activePatternId && patternsContainerRef.current) {
      if (!showCreate) {
        patternsContainerRef.current.scrollIntoView({behavior: "smooth"})
      } else {
        setShowCreate(false)
      }
    }

    if (!activePatternId && iFrameContainerRef.current) {
      iFrameContainerRef.current.scrollIntoView({behavior: "smooth"})
    }
  }, [activePatternId, showCreate])

  return (
    <>
      <GlobalDoodleStyles />
      <Box pad={{vertical: "medium", left: "medium"}} ref={iFrameContainerRef} direction="row" style={{ display: showCreate ? "flex" : "none" }}>
        <CreatePatternIFrame />
        <Box flex="shrink">
          <Button
            icon={<Close size="large" color="dark-1" />}
            size="large"
            onClick={() => setShowCreate(false)}
          />
          <Button
            icon={<Checkmark size="large" color="status-ok" />}
            size="large"
            onClick={handleSavePattern}
          />
        </Box>
      </Box>
      <PatternGrid pad="medium" ref={patternsContainerRef}>
        <Box elevation="small" align="center" justify="center" onClick={handleClickCreate}>
          <Add size="large" />
        </Box>
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

const NewPatternButton = () => {

}

export default withFirebase(Patterns)
