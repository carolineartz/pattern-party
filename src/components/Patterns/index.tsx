import * as React from "react"

import styled, { createGlobalStyle } from "styled-components"
import { Doodle } from "./doodle"
import { withFirebase, WithFirebaseProps } from "./../Firebase"
// import prettyFormat from 'pretty-format';

import { Box } from "grommet"



const Patterns = ({ firebase }: WithFirebaseProps) => {
  const [patterns, setPatterns] = React.useState<string[] | undefined>()

  const fetchPatterns = async () => {
    const pats = await firebase.patterns().get()
    const foo = pats.docs

    let patData: string[] = []

    foo.forEach((bar) => {
      const markupString = bar.data().markup

      patData.push(markupString)
    })

    setPatterns(patData)
  }

  React.useEffect(() => {
    if (!patterns) {
      fetchPatterns()
    }


    console.log("patterns", patterns)
  }, [patterns])

  return (
    <>
      <GlobalDoodleStyles />
      <PatternGrid pad="medium">
        {patterns && patterns.map((markup: string, i: number) => <Doodle key={`pat-${i}`} markup={markup} />)}
      </PatternGrid>
    </>
  )
}

const GlobalDoodleStyles = createGlobalStyle`
  css-doodle {
    height: 100%;
  }
`

const PatternGrid = styled(Box)`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: minmax(150px, 25vh);
`

export default withFirebase(Patterns)
