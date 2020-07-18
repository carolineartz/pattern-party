import * as React from "react"

import Prism from 'prismjs';
// import clipboard from "clipboard"
import styled, { css } from "styled-components"
import "styled-components/macro"
import svgToMiniDataURI from "mini-svg-data-uri"


import { Stack, Box, Button } from "grommet"
import { ElevatedHoverBox } from "../elevatedBox"
import { DestroyDialog } from "./destroy"

import { Close, Expand, Gallery, Code } from "grommet-icons"
import { formatSVG } from "../../util";
import { CSSTransition, TransitionGroup } from "react-transition-group"

const Pizzaz = require("./../../libs/pizzaz")

const pizzazArgs = {
  size: 25,
  buffer: 5,
  spacing: 20,
  speed: 1,
  strokeWidth: 2.5
}

type PatternProps = {
  markup: string
  ident: string
  setActive: (pat?: string) => void
  active: boolean
  key: string
}

export const Pattern = React.memo(({ markup, ident, active, setActive }: PatternProps) => {
  const [showOptions, setShowOptions] = React.useState<boolean>(false)
  const [showDestroyDialog, setShowDestroyDialog] = React.useState<boolean>(false)
  const patternRef = React.useRef<HTMLDivElement | null>(null)
  // const sourceRef = React.useRef<HTMLPreElement | null>(null)

  const animateClickPatternOption = (el: Element) => {
    let color = "rgba(240, 101, 122, 1.000)"
    const regex = /fill="([r#].*?)"/gm;
    const found = Array.from(markup.matchAll(regex)).map((x: RegExpMatchArray) => x[1]);
    console.log(found)
    if (found.length) {
      color = found[1] || found[0] || color
    }
    console.log(color)

    const pizazz = new Pizzaz({
      stroke: color,
      ...pizzazArgs
    })

    pizazz.play(el)
  }

  const handleClickCopySVG = (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.stopPropagation()

    navigator.clipboard.writeText(markup).then(text => {
      console.log("Successfully copied SVG markup")
      if (patternRef.current) {
        const foo = patternRef.current.querySelector("css-doodle")
        if (foo) {
          animateClickPatternOption(foo)
        }
      }
    }).catch(err => {
      console.error('Failed to write clipboard contents: ', err);
    });
  }

  const handleClickCopyDataURI = (evt: React.MouseEvent) => {
    evt.stopPropagation()
    navigator.clipboard.writeText(svgToMiniDataURI(markup)).then(text => {
      console.log("Successfully copied DataUri markup")
      if (patternRef.current) {
        const foo = patternRef.current.querySelector("css-doodle")
        if (foo) {
          animateClickPatternOption(foo)
        }
      }
    }).catch(err => {
      console.error('Failed to write clipboard contents: ', err);
    });
  }

  const handleClickExpand = () => {

  }

  const handleClickPattern = () => {
    if (active) {
      setActive()
    } else {
      setActive(ident)
    }
  }

  const handleClickRemovePattern = (evt: React.MouseEvent) => {
    evt.stopPropagation()
    setShowDestroyDialog(true)
  }

  return (
    <>
      <Box id={`${ident}-container`} ref={patternRef}>
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
          key={ident}
          active={active}
          markup={markup}
          elevation="small"
          onMouseEnter={() => setShowOptions(true)}
          onMouseLeave={() => setShowOptions(false)}
          onClick={handleClickPattern}
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
              pad={{bottom: "xsmall", right: "xsmall"}}
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
                  onClick={handleClickCopySVG}
                  css={`
                    padding: 6px;
                    box-shadow: 0px 2px 4px rgba(0,0,0,0.20);
                  `}
                  />
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
                  onClick={handleClickCopyDataURI}
                />
                </CSSTransition>
                </Box>
            </Box>
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
              onClick={handleClickRemovePattern}
              css={`
                position: absolute;
                padding: 6px;
                top: -8px;
                right: -8px;
              `}
            />
            </CSSTransition>
            </Box>
            </Box>
          </Stack>
        </PatternContainer>
      </Box>
      {showDestroyDialog &&
        <DestroyDialog
        ident={ident}
        markup={markup}
        showDialog={setShowDestroyDialog}
        />
      }
    </>
  )
})

type PatternContainerProps = {
  active: boolean
  markup: string
}

const PatternContainer = styled(ElevatedHoverBox)<PatternContainerProps>`
  --pattern: ${props => "(background-image: @svg(" + formatSVG(props.markup) + "); border-radius: 6px;);"};
`
