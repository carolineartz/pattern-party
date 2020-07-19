import * as React from "react"

import "styled-components/macro"
import styled, { createGlobalStyle } from "styled-components"
import { Pattern } from "./pattern"
import { withFirebase, WithFirebaseProps } from "./../Firebase"
import { Box, BoxProps, Button } from "grommet"
import { CreatePatternIFrame } from "./create"
import { Add, Checkmark, Close } from "grommet-icons"
import Firebase from "./../Firebase"
import { PatternPreview } from './preview'

import { formatSVG } from "../../util";

type PatternData = {
  markup: string
  id: string
}

const Patterns = ({ firebase }: { firebase: Firebase}) => {
  const [patterns, setPatterns] = React.useState<PatternData[] | undefined>()
  const [activePatternId, setActivePatternId] = React.useState<string | undefined>()
  const [activePattern, setActivePattern] = React.useState<PatternData | undefined>()
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
        console.log(formatSVG(text))
        firebase.patterns().add({ markup: formatSVG(text) })
      }
    }).catch(err => {
      console.error('Failed to read clipboard contents: ', err);
    });
  }

  React.useEffect(() => {
    firebase.patterns()
    .onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
          if (change.type === "added" || change.type === "removed") {
              fetchPatterns()
          }
          else {
            console.log("change", change);
          }
        });
    });
  }, [])

  React.useEffect(() => {
    if (!patterns) {
      fetchPatterns()
    }
  }, [patterns])

  React.useEffect(() => {
    if (patterns && activePatternId) {
      setActivePattern(patterns.find((pat: PatternData) => pat.id === activePatternId))
    }

    if (activePatternId && patternsContainerRef.current) {
      if (!showCreate) {
      } else {
        setShowCreate(false)
      }
    }
  }, [patterns, activePatternId, showCreate])

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
      {activePattern && <PatternPreview pattern={activePattern} onDismiss={() => setActivePattern(undefined)} /> }
      <Box css="align-self: center; width: 100%;" width={{max: "1080px" }} pad={{ horizontal: "medium" }}>
        <PatternGrid ref={patternsContainerRef}>
          <Box elevation="small" align="center" justify="center" onClick={handleClickCreate}>
            <Add size="large" color="text" />
          </Box>
          {patterns && patterns.map((data: PatternData, i: number) => {
            return (
              <Pattern
                ident={data.id}
                key={`pat-${data.id}`}
                markup={data.markup}
                active={activePatternId === data.id}
                setActive={setActivePatternId}
              />
            )
          })}
        </PatternGrid>
      </Box>
    </>
  )
}

const GlobalDoodleStyles = createGlobalStyle`
  body {
    margin: 0;
  }
  css-doodle {
    height: 100%;
  }

  code[class*="language-"], pre[class*="language-"] {
    font-size: 0.8em;
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
  grid-gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: minmax(150px, 25vh);
`

const NewPatternButton = () => {

}

export default withFirebase(Patterns)