import * as React from "react"
import { firestore } from "firebase"
import { Box, Button, ResponsiveContext, Image, Text, Stack } from "grommet"
import { Checkmark, Close } from "grommet-icons"
import "styled-components/macro"
import { CSSTransition } from "react-transition-group";
import { WithFirebaseProps, withFirebase } from "../Firebase"
import { withAuthentication, WithAuthProps } from "../Session"
import { formatSVG } from "./util";
import doodadLogo from './../../images/doodad.png'
import { Rnd } from "react-rnd";


type CreateWindowProps =  {
  showWindow: boolean
  setShowWindow: (show: boolean) => void
}

type WindowLocationState = {
  x: number
  y: number
  width: number | string
  height: number | string
}

const style = {
  display: "flex",
  padding: "10px",
  margin: "10px",
  // alignItems: "center",
  // justifyContent: "center",
  // border: "solid 1px #ddd",
  background: "rgba(255, 255, 255, 0.5)",
  boxShadow: "0px 8px 16px rgba(0,0,0,0.20)"
};

export const CreateWindow = ({ showWindow, setShowWindow }: CreateWindowProps) => {
  const [windowLocation, setWindowLocation] = React.useState<WindowLocationState>({
    width: window.innerWidth / 2,
    height: window.innerHeight/2,
    x: window.innerWidth / 4 - 40,
    y: 75
  })

  return (
    <Box css={`
      display: ${showWindow ? "flex" : "none"}
    `}>
      <Rnd
        style={style}
        bounds="window"
        size={{ width: windowLocation.width, height: windowLocation.height }}
        position={{ x: windowLocation.x, y: windowLocation.y }}
        onDragStop={(e, d) => {
          setWindowLocation({
            ...windowLocation,
            x: d.x,
            y: d.y
          })
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          setWindowLocation({
            width: ref.style.width,
            height: ref.style.height,
            ...position
          });
        }}
      >
        <Box width="100%" height="100%">
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
            <Button
              primary
              color="white"
              icon={<Close color="brand" />}
              css="
                box-shadow: 0px 8px 16px rgba(0,0,0,0.20);
                position: absolute;
                top: -10px;
                right: -10px;
                border-radius: 100%;
              "
              onClick={() => setShowWindow(false)}
            />
      </Rnd>
    </Box>
  );
}


type CreatePatternProps = WithAuthProps & WithFirebaseProps & {
  showCreate: boolean
  setShowCreate: (show: boolean) => void
}

type CreatePanelProps = {
  setShowPanel: (visible: boolean) => void
  showPanel: boolean
}

export const CreatePanel = ({ setShowPanel, showPanel }: CreatePanelProps) => {
  return (
    <CSSTransition
      in={showPanel}
      timeout={300}
      classNames="slide-in-out-right"
    >

      <Box height="100vh" css="position: fixed;" width={showPanel ? "30vw" : "0"}>
          <Box width="100%" height="100%" pad={{top: "80px"}}>
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
            <Box align="end" background="white" css="position: absolute; top: 80px; right: 80px">
              <Button icon={<Close color="text" />} onClick={() => setShowPanel(false)} />
            </Box>
      </Box>
    </CSSTransition>
  )
}

const Create = React.memo(({ authUser, firebase, showCreate, setShowCreate }: CreatePatternProps) => {
  const size = React.useContext(ResponsiveContext)

  const handleClickSavePattern = () => {
    navigator.clipboard.readText().then(text => {
      if (!text.startsWith("<svg")) {
        console.log(text)
        throw new Error("Uncable to save pattern. Make sure to copy inline svg code to clipboard before clicking save.");
      } else {
        console.log(formatSVG(text))

        if (authUser) {
          // save to the user patterns
          firebase.userPatternCollection(authUser.uid).add({
            hidden: false,
            markup: formatSVG(text),
            createdAt: firestore.Timestamp.now()
          })

          // also create a community pattern item
          firebase.patternCollection().add({
            hidden: false,
            markup: formatSVG(text),
            createdAt: firestore.Timestamp.now()
          })
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

export const CreatePattern = withAuthentication(withFirebase(Create))
