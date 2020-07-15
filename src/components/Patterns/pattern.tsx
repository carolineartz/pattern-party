import * as React from "react"

import Prism from 'prismjs';
import clipboard from "clipboard"
import styled, { css } from "styled-components"
import "styled-components/macro"

import { Box, Stack } from "grommet"
import { ElevatedHoverBox } from "../elevatedBox"
import { DestroyDialog } from "./destroy"

import { Close } from "grommet-icons"
import { formatSVG } from "../../util";

type PatternProps = {
  markup: string
  ident: string
  setActive: (pat?: string) => void
  active: boolean
  key: string
}

export const Pattern = React.memo(({ markup, ident, active, setActive }: PatternProps) => {
  const [highlighted, setHighlighted] = React.useState<boolean>(false)
  const [showElevated, setShowElevated] = React.useState<boolean>(true)
  const [showDestroyDialog, setShowDestroyDialog] = React.useState<boolean>(false)
  const sourceRef = React.useRef<HTMLPreElement | null>(null)

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

  React.useEffect(() => {
    if (!sourceRef.current) {
      setHighlighted(false)
      return
    }

    if (!highlighted) {
      Prism.plugins.toolbar.registerButton('copy-to-clipboard', function (env: any) {
        var linkCopy = document.createElement('button');
        linkCopy.textContent = 'Copy';

        var element = env.element;

        registerClipboard();
        return linkCopy;

        function registerClipboard() {
          var clip = new clipboard(linkCopy, {
            'text': function () {
              return element.textContent;
            }
          });

          clip.on('success', function () {
            linkCopy.textContent = 'Copied!';

            resetText();
          });
          clip.on('error', function () {
            linkCopy.textContent = 'Press Ctrl+C to copy';

            resetText();
          });
        }

        function resetText() {
          setTimeout(function () {
            linkCopy.textContent = 'Copy';
          }, 5000);
        }
      });

      Prism.highlightAll(false, () => {
        setHighlighted(true)
      })
    }

    if (highlighted) {
      const colorizer = createTreeWalker(sourceRef.current)
      addColors(colorizer)
    }
  }, [active, sourceRef.current, highlighted])


  return (
    <>
      <PatternContainer
        id={`${ident}-container`}
        css={`
          overflow: hidden;
          > div {
            height: 100% !important;
            div:first-child, & {
              height: 100% !important;
            }
          }
        `}
        height="100%"
        round="xsmall"
        width="100%"
        key={ident}
        active={active}
        markup={markup}
        elevation="small"
        onClick={handleClickPattern}
        disableHoverElevation={!showElevated}
      >
        <Stack
          anchor="top-right"
          css="height: 100% !important;"
        >
          <css-doodle grid="1" use="var(--pattern)" />
          <ElevatedHoverBox
            margin="xxsmall"
            elevation="medium"
            pad="xxsmall"
            background="white"
            round="1.5px"
            onClick={handleClickRemovePattern}
            onMouseOver={() => setShowElevated(false)}
            onMouseLeave={() => setShowElevated(true)}
          >
            <Close size="medium-small" color="text" onClick={() => setShowDestroyDialog(true)} />
          </ElevatedHoverBox>
        </Stack>
      </PatternContainer>
      {showDestroyDialog &&
        <DestroyDialog
        ident={ident}
        markup={markup}
        showDialog={setShowDestroyDialog}
        />
      }
      {active && <SVGMarkupContainer key={`${ident}-markup`}>
        <pre ref={sourceRef} className="language-svg" id={`code-block-${ident}`}>
          <code>{markup}</code>
        </pre>
      </SVGMarkupContainer>}
    </>
  )
})



type PatternContainerProps = {
  active: boolean
  markup: string
}

const PatternContainer = styled(ElevatedHoverBox)<PatternContainerProps>`
  --pattern: ${props => "(background-image: @svg(" + formatSVG(props.markup) + "));"};
  ${props => props.active && css`
    grid-column: 1;
    grid-row: 1 / 3;
  `}
`


const SVGMarkupContainer = styled(Box)`
  grid-column: 2 / -1;
  grid-row: 1 / 3;
`

const createTreeWalker = (el: HTMLElement) => document.createTreeWalker(
  el,
  NodeFilter.SHOW_TEXT,
  {
    acceptNode: function (node) {
      if (node.textContent && (node.textContent.startsWith("#") || node.textContent.startsWith("rg"))) {
        return NodeFilter.FILTER_ACCEPT;
      } else {
        return NodeFilter.FILTER_REJECT
      }
    }
  },
  false
);

function addColors(treeWalker: TreeWalker) {
  const nodeList: Node[] = [];
  let currentNode: Node | null = treeWalker.currentNode;

  while(currentNode) {
    nodeList.push(currentNode);
    currentNode = treeWalker.nextNode();
  }

  nodeList.forEach((node: Node) => {
    const parent = node.parentNode
    if (parent && !parent.querySelector(".inline-color")) {
      if (parent instanceof HTMLElement && parent.classList.contains("attr-value")) {
        const newNode = document.createElement("span")
        newNode.classList.add("inline-color")
        newNode.style.backgroundColor = node.textContent || "transparent"
        parent.insertBefore(newNode, node)
      }
    }
  })
}

