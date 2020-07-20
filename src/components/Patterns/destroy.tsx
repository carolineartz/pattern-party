import * as React from 'react';

import styled from "styled-components"
import { withFirebase } from "./../Firebase"
import { Box, Layer, Button, Stack, BoxProps } from "grommet"
import { Hide, Trash, Close } from "grommet-icons"
import { formatSVG } from "../../util";

type DestroyDialogProps = {
  ident: string
  markup: string,
  onClickHide: any
  onClickDestroy: any
  closeDialog: () => void
  // showDialog: (shouldShow: boolean) => void
}

class Dialog<T extends DestroyDialogProps> extends React.PureComponent<T> {
  // removePattern = () => {
  //   this.props.firebase.pattern(this.props.ident).delete()
  //   this.props.closeDialog()
  // }

  // handleClickHidePattern = () => {
  //   this.props.firebase.pattern(this.props.ident).set({ hidden: true }, { merge: true })
  //   this.props.closeDialog()
  // }

  public render() {
    const { markup, closeDialog, onClickDestroy, onClickHide } = this.props

    return (
    <Layer
      onEsc={closeDialog}
      onClickOutside={closeDialog}
    >
      <Stack anchor="top-right">
        <Box>
          {/* preview */}
          <Preview height="medium" width="100%" markup={markup}>
            <css-doodle grid="1" use="var(--pattern)" />
          </Preview>
          {/* controls */}
          <Box as="footer" align="end" direction="row" gap="medium" pad="medium">
            <Button
              label={<Box>Hide Pattern</Box>}
              color="text"
              onClick={onClickHide}
              icon={<Hide color="text" />}
            />
            <Button
              primary
              color="status-error"
              label={<Box>Really Delete!</Box>}
              onClick={onClickDestroy}
              icon={<Trash color="white" />}
            />
          </Box>
        </Box>
        <Button icon={<Close color="white" />} onClick={closeDialog} />
      </Stack>
    </Layer>
    );
  }
}

type PreviewProps = {
  markup: string
}

const Preview = styled(Box) <BoxProps & PreviewProps>`
  --pattern: ${props => {
  console.log(props);
    return "(background-image: @svg(" + formatSVG(props.markup) + "));"
  }};
`

export const DestroyDialog = withFirebase(Dialog)
