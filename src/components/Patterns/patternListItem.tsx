import * as React from 'react';
import "styled-components/macro"
import { Text, Box, Stack, Button, Card, CardBody, CardHeader, CardFooter, ButtonProps } from 'grommet';
import { CSSTransition } from "react-transition-group";
import { Close, Gallery, Code, Save, Hide } from "grommet-icons";
import styled from "styled-components"
import { formatSVG, animateClickPatternOption } from './util';

type PatternListItemProps = {
  markup: string
  key: string
  ident: string
  hidden?: boolean
  onClickSave?: (evt: React.MouseEvent) => void
  onClickDestroy?: (evt: React.MouseEvent) => void
  onClickHide?: (evt: React.MouseEvent) => void
  onClickUnhide?: (evt: React.MouseEvent) => void
  onClick?: (evt: React.MouseEvent) => void
  onClickCopyMarkup: (evt: React.MouseEvent) => void
  onClickCopyDataURL: (evt: React.MouseEvent) => void
}

export const PatternListItem = (props: PatternListItemProps): JSX.Element => {
  const [showOptions, setShowOptions] = React.useState<boolean>(false);
  const patternRef = React.useRef<HTMLDivElement | null>(null);

  const animateClick = (fn: Function) => {
    fn();

    if (patternRef.current) {
      animateClickPatternOption(patternRef.current, props.markup);
    }
  };

  return (
    <PatternCard
      key={props.ident}
      ref={patternRef}
      height="100%"
      round="xsmall"
      width="100%"
      markup={props.markup}
      overflow="visible"
      elevation={props.hidden ? undefined : "medium"}
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
    >
      <Stack guidingChild={0}>
        <CardBody width="100%" height="small">
          <css-doodle grid="1" use="var(--pattern)" />
        </CardBody>
        <Box fill direction="column" justify="between">
          {props.hidden ?
            <Box fill align="center" justify="center" title="Click to Unhide" onClick={props.onClickUnhide}>
              <Box gap="small" align="center">
                <Box background="white" css="border-radius: 100%" pad="medium">
                  <Hide size="large" color="text" />
                </Box>
                <Box background="white" pad="xsmall"><Text weight="bold">Unhide</Text></Box>
              </Box>
            </Box> :
            <>
              <CardHeader css="position: relative">
                <Box />
                {props.onClickDestroy &&
                  <Box
                    css={`
                    position: absolute;
                    top: -10px;
                    right: -10px;
                  `}
                  >
                    <CardButton
                      animateIn={showOptions}
                      icon={Close}
                      title="Remove Pattern"
                      onClick={props.onClickDestroy}
                    />
                  </Box>
                }
              </CardHeader>
              <CardFooter>
                <Box />
                <Box direction="row" pad="xsmall" align="center" gap="xxsmall">
                  <CardButton
                    animateIn={showOptions}
                    icon={Code}
                    title="Copy SVG Markup"
                    onClick={(evt: React.MouseEvent) => animateClick(props.onClickCopyMarkup.bind(null, evt))}
                  />
                  <CardButton
                    animateIn={showOptions}
                    icon={Gallery}
                    title="Copy Data URL"
                    onClick={(evt: React.MouseEvent) => animateClick(props.onClickCopyDataURL.bind(null, evt))}
                  />
                  {props.onClickSave &&
                    <CardButton
                      animateIn={showOptions}
                      icon={Save}
                      title="Save to My Patterns"
                      onClick={(evt: React.MouseEvent) => {
                        if (props.onClickSave) {
                          animateClick(props.onClickSave.bind(null, evt))
                        }
                      }}
                    />
                  }
                </Box>
              </CardFooter>
            </>
          }
        </Box>
      </Stack>
    </PatternCard>
  );
};

type PatternCardProps = {
  markup: string
}

const PatternCard = styled(Card)<PatternCardProps>`
  --pattern: ${props => "(background-image: @svg(" + formatSVG(props.markup) + "); border-radius: 6px;);"};
`

type CardButtonProps = Omit<ButtonProps, 'icon'> & {
  animateIn: boolean
  onClick: (evt: React.MouseEvent) => void
  icon: typeof Code
  title: string
  css?: any
}

const CardButton = ({ animateIn, onClick, title, icon: Icon, ...rest }: CardButtonProps) => {
  return (
    <CSSTransition
      in={animateIn}
      timeout={300}
      classNames="appear-zoom"
      unmountOnExit
    >
      <Button
        title={title}
        primary
        color="white"
        hoverIndicator
        icon={<Icon size="small" color="text" />}
        size="small"
        onClick={onClick}
        css={`
          padding: 6px;
          box-shadow: 0px 2px 4px rgba(0,0,0,0.20);
          &:hover {
            background-color: #EDEDED;
          }
      `} />
    </CSSTransition>
  )
}
