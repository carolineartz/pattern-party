import * as React from 'react';
import { Box, Stack, Button } from 'grommet';
import { animateClickPatternOption } from './util';
import { CSSTransition } from "react-transition-group";
import { Close, Gallery, Code, Save } from "grommet-icons";
import { ElevatedHoverBox } from '../elevatedBox';
import styled from "styled-components"
import { formatSVG } from './util';
import "styled-components/macro"

type PatternListItemProps = {
  markup: string
  key: string
  onClickSave?: (evt: React.MouseEvent) => void
  onClickDestroy?: (evt: React.MouseEvent) => void
  onClick?: (evt: React.MouseEvent) => void
  onClickCopyMarkup: (evt: React.MouseEvent) => void
  onClickCopyDataUri: (evt: React.MouseEvent) => void
}

export const PatternListItem = (props: PatternListItemProps) => {
  const [showOptions, setShowOptions] = React.useState<boolean>(false);
  const patternRef = React.useRef<HTMLDivElement | null>(null);

  const animateClick = (fn: Function) => {
    fn();

    if (patternRef.current) {
      animateClickPatternOption(patternRef.current, props.markup);
    }
  };

  return (
    <Box ref={patternRef}>
      <PatternContainer
        css={`
            [class*='StyledStackLayer'] {
              height: 100%;
            }
            > div {
              height: 100%;
            }
          `}
        height="100%"
        round="xsmall"
        width="100%"
        markup={props.markup}
        elevation="small"
        onMouseEnter={() => setShowOptions(true)}
        onMouseLeave={() => setShowOptions(false)}
      >
        <Stack
          anchor="top-right"
          css="height: 100% !important;"
        >
          <css-doodle grid="1" use="var(--pattern)" />
          <Box height="100%">
            <Box fill="vertical" justify="between" height="100%">
              <Box
                css={`
                  position: relative;
                  height: 100%;
                  width: 100%;
                `}
              >
                <Box
                  gap="xxsmall"
                  direction="row"
                  pad={{ bottom: "xsmall", right: "xsmall" }}
                  css={`
                  width: 100%;
                  height: 100%;
                  align-items: flex-end;
                `}
                >
                  <CSSTransition
                    in={showOptions}
                    timeout={300}
                    classNames="appear-zoom"
                    unmountOnExit
                  >
                    <Button
                      title="Copy SVG Markup"
                      primary
                      color="white"
                      hoverIndicator
                      icon={<Code size="small" color="text" />}
                      size="small"
                      onClick={() => animateClick(props.onClickCopyMarkup)}
                      css={`
                      padding: 6px;
                      box-shadow: 0px 2px 4px rgba(0,0,0,0.20);
                    `} />
                  </CSSTransition>
                  <CSSTransition
                    in={showOptions}
                    timeout={300}
                    classNames="appear-zoom"
                    unmountOnExit
                  >
                    <Button
                      title="Copy DataUri"
                      primary
                      color="white"
                      hoverIndicator
                      size="small"
                      css={`
                      padding: 6px;
                      box-shadow: 0px 2px 4px rgba(0,0,0,0.20);
                    `}
                      icon={<Gallery size="small" color="text" />}
                      onClick={() => animateClick(props.onClickCopyDataUri)} />
                  </CSSTransition>
                  { props.onClickSave &&
                    <CSSTransition
                      in={showOptions}
                      timeout={300}
                      classNames="appear-zoom"
                      unmountOnExit
                    >
                      <Button
                        title="Save to Patterns"
                        primary
                        color="white"
                        hoverIndicator
                        size="small"
                        css={`
                          padding: 6px;
                          box-shadow: 0px 2px 4px rgba(0,0,0,0.20);`}
                        icon={<Gallery size="small" color="text" />}
                        onClick={() => animateClick(props.onClickSave || (() => {}))}
                      />
                    </CSSTransition>
                  }
                </Box>
              </Box>
              { props.onClickDestroy &&
                <CSSTransition
                  in={showOptions}
                  timeout={300}
                  classNames="appear-zoom"
                  unmountOnExit
                >
                  <Button
                    icon={<Close size="small" />}
                    color="light-3"
                    primary
                    hoverIndicator
                    onClick={props.onClickDestroy}
                    css={`
                      position: absolute;
                      padding: 6px;
                      top: -8px;
                      right: -8px;`}
                  />
                </CSSTransition>
              }
            </Box>
          </Box>
        </Stack>
      </PatternContainer>
    </Box>
  );
};

type PatternContainerProps = {
  markup: string
}

const PatternContainer = styled(ElevatedHoverBox)<PatternContainerProps>`
  --pattern: ${props => "(background-image: @svg(" + formatSVG(props.markup) + "); border-radius: 6px;);"};
`
