import React from "react"
import { Toast } from "./Toast"
import { Box, Button, Text } from "grommet"
import { ColorType } from "grommet/utils"
import { Checkmark, Alert as AlertIcon, FormClose } from "grommet-icons"

type AlertProps = {
  dismiss: () => void
  message: string
}

export const AlertSuccess = ({ dismiss, message }: AlertProps) => (
  <Alert
    icon={Checkmark}
    color="status-ok"
    message={message}
    dismiss={dismiss}
  />
)

export const AlertError = ({ dismiss, message }: AlertProps) => (
  <Alert
    icon={AlertIcon}
    color="status-error"
    message={message}
    dismiss={dismiss}
  />
)

type BaseAlertProps = AlertProps & {
  icon: typeof Checkmark
  color: ColorType
  message: string
}

const Alert = ({ dismiss, icon: Icon, color, message }: BaseAlertProps) => (
  <Toast onClose={dismiss} duration={3} modal={false}>
    <Box direction="row" pad="small" fill="horizontal" justify="between" align="center" background={color}>
      {<Icon color="white" />}
      <Text color="white" size="large">{message}</Text>
      <Button icon={<FormClose color="white" />} onClick={() => dismiss()} />
    </Box>
  </Toast>
)
