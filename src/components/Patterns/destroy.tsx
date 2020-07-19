import * as React from 'react';

import styled from "styled-components"
import { withFirebase, WithFirebaseProps } from "./../Firebase"
import { Box, Layer, Button, Stack, BoxProps } from "grommet"
import { Hide, Trash, Close } from "grommet-icons"
import { formatSVG } from "../../util";

type DestroyDialogProps = {
  ident: string
  markup: string,
  onClickHide: any
  onClickDestroy: any
  onClickDismisss: any
  showDialog: (shouldShow: boolean) => void
}

class Dialog<T extends DestroyDialogProps> extends React.PureComponent<T & WithFirebaseProps> {
  removePattern = () => {
    this.props.firebase.pattern(this.props.ident).delete()
    this.props.showDialog(false)
  }

  handleClickHidePattern = () => {
    this.removePattern()
    this.props.firebase.hidden().add({ markup: formatSVG(this.props.markup) })
    this.props.showDialog(false)
  }

  public render() {
    const { ident, markup, firebase, showDialog } = this.props
    return (
    <Layer
      onEsc={() => showDialog(false)}
      onClickOutside={() => showDialog(false)}
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
              onClick={this.handleClickHidePattern}
              icon={<Hide color="text" />}
            />
            <Button
              primary
              color="status-error"
              label={<Box>Really Delete!</Box>}
              onClick={this.removePattern}
              icon={<Trash color="white" />}
            />
          </Box>
        </Box>
        <Button icon={<Close color="white" />} onClick={() => showDialog(false)} />
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
