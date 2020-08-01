import * as React from "react"

import "styled-components/macro"

import { Box, Button, ResponsiveContext, Image, Text } from "grommet"
import { Checkmark, Close } from "grommet-icons"
import { formatSVG } from "../../util";
import doodadLogo from './../../images/doodad.png'
import {useTrackedState, useDispatch} from "./../../state"

type CreatePatternProps = {
  showCreate: boolean
  setShowCreate: (show: boolean) => void
}

export const CreatePattern = React.memo(({ showCreate, setShowCreate }: CreatePatternProps) => {
  const size = React.useContext(ResponsiveContext)

  const { authUser, firebase} = useTrackedState();
  const dispatch = useDispatch()

  const handleClickSavePattern = () => {
    navigator.clipboard.readText().then(text => {
      if (!text.startsWith("<svg")) {
        throw new Error("Uncable to save pattern. Make sure to copy inline svg code to clipboard before clicking save.");
      } else {
        if (authUser) {
          dispatch({ type: "CREATE_PATTERN", markup: formatSVG(text), owner: "user" })
        }
      }
    }).catch(err => {
      console.error('Failed to read clipboard contents: ', err);
    })
  }


  return (
    <>
      {!showCreate &&
        <Box
          margin={{ top: 'xlarge' }}
          fill="horizontal"
          pad="large"
          align="center"
          direction="row"
          justify="center"
          gap="small"
        >
        <Box
          onClick={() => setShowCreate(true)}
          elevation="small"
          justify="center"
          alignContent="center"
          alignSelf="center"
          align="center"
          css="border-radius: 50%"
          pad="small"
          round
        >
          <Image
            height={50}
            width={50}
            css="border-radius: 50%"
            src={doodadLogo}
          />
          </Box>
          <Text>Generate a new Pattern with Doodad.Dev</Text>
      </Box>}
      <Box
        pad="large"
        margin={{top: 'xlarge'}}
        css={`display: ${showCreate ? 'flex' : 'none'}`}
        fill="horizontal" direction={size === "small" ? "column-reverse" : "row-responsive"}>
        <Box height="70vh" width="100%">
          <iframe
            title="Doodad.Dev"
            src="https://doodad.dev/pattern-generator/"
            seamless
            frameBorder={0}
            css={`
              height: 100%;
              width: 100%;`
            }
          />
        </Box>
        <Box>
          <Button
            icon={<Checkmark color="status-ok" />}
            onClick={handleClickSavePattern}
          />
          <Button
            icon={<Close color="text" />}
            onClick={() => setShowCreate(false)}
          />
        </Box>
      </Box>
    </>
  )
})
