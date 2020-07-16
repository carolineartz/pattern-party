import * as React from "react"
import "styled-components/macro"

import { withFirebase, WithFirebaseProps } from "./../Firebase"
import { useDeviceDetect } from "./../../hooks/useDeviceDetect"
import { Box, Button, Text, Nav, Anchor } from "grommet"


export const GoogleAuth = ( {firebase }: WithFirebaseProps) => {
  const { isMobile } = useDeviceDetect();


}
