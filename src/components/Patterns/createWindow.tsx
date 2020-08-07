import * as React from "react"
import "styled-components/macro"
import { Box, Button, Nav } from "grommet"
import { Checkmark, Close } from "grommet-icons"
import { WithFirebaseProps, withFirebase } from "../Firebase"
import { withAuthentication, WithAuthProps } from "../Session"
import { formatSVG } from "./util";
import { Rnd } from "react-rnd";
import { AlertError, AlertSuccess } from "../Notification"
import { useCreatePattern } from "./../../hooks/useCreatePattern"

type CreateWindowProps = WithAuthProps & WithFirebaseProps & {
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
  background: "rgba(255, 255, 255, 0.6)",
  boxShadow: "0px 8px 16px rgba(0,0,0,0.20)"
};

export const Window = ({ showWindow, setShowWindow, firebase, authUser }: CreateWindowProps) => {
  const createPattern = useCreatePattern(firebase, authUser)

  const [windowLocation, setWindowLocation] = React.useState<WindowLocationState>({
    width: window.innerWidth / 2,
    height: window.innerHeight/2,
    x: window.innerWidth / 4 - 40,
    y: 75
  })

  const [showError, setShowError] = React.useState<boolean>(false)
  const [showSuccess, setShowSuccess] = React.useState<boolean>(false)

  const handleClickCreatePattern = () => {
    navigator.clipboard.readText().then(text => {
      if (!text.startsWith("<svg")) {
        setShowError(true)
      } else {
        createPattern(formatSVG(text))
        setShowSuccess(true)
      }
    }).catch(err => {
      console.error('Failed to read clipboard contents: ', err);
    })
  }

  return (
    <Box>
      {showError && <AlertError message="Unable to save pattern. Make sure to copy inline svg code to clipboard before clicking save." dismiss={() => setShowError(false)}/>}
      {showSuccess && <AlertSuccess message="Pattern saved!" dismiss={() => setShowSuccess(false)}/>}
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
          onResizeStop={(_e, _direction, ref, _delta, position) => {
            setWindowLocation({
              width: ref.style.width,
              height: ref.style.height,
              ...position
            });
          }}
        >
          <Box width="100%" height="100%" direction="row">
            <Box flex="grow">
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
            <Nav align="center" pad={{left: "small"}}>
              <Button
                plain
                icon={<Close color="text" />}
                onClick={() => setShowWindow(false)}
              />
              <Button
                primary
                color="status-ok"
                css="border-radius: 100%"
                icon={<Checkmark color="white" />}
                onClick={handleClickCreatePattern}
              />
            </Nav>
        </Box>
      </Rnd>
    </Box>
  </Box>
  );
}
export const CreateWindow = React.memo((withAuthentication(withFirebase(Window))))
