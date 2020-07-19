import * as React from "react"

import { Box } from "grommet"
import svgToMiniDataURI from "mini-svg-data-uri"
import { WithFirebaseProps, withFirebase } from "./../Firebase"
import Prism from 'prismjs';
import { addColors, createTreeWalker } from "./util"
import "styled-components/macro"

type PatternPreviewProps = {
  pattern: {
    markup: string
    id: string
  }
  onDismiss: (arg: any) => void
}

const Preview = ({pattern, onDismiss, firebase}: PatternPreviewProps & WithFirebaseProps) => {
  const sourceRef = React.useRef<HTMLPreElement | null>(null)
  const [highlighted, setHighlighted] = React.useState<boolean>(false)


  React.useEffect(() => {
    setHighlighted(false)
  }, [pattern])

  React.useEffect(() => {
    if (!sourceRef.current) {
      setHighlighted(false)
      return
    }

    if (sourceRef.current && !highlighted) {
      Prism.highlightAll(false, () => {
        setHighlighted(true)
      })
    }

    if (highlighted) {
      const colorizer = createTreeWalker(sourceRef.current)
      addColors(colorizer)
    }
  }, [pattern, sourceRef.current, highlighted])

  const dataUri = svgToMiniDataURI(pattern.markup)

  return (
    <Box
      direction="row"
      fill="horizontal"
      pad="large"
      height={{min: "medium"}}
      margin={{bottom: "large"}}
      css={`
        background: url("${dataUri}");
      `}
    >
        <Box>
          <pre ref={sourceRef} className="language-svg">
            <code>{pattern.markup}</code>
          </pre>
        </Box>
    </Box>
  )
}

export const PatternPreview = withFirebase(Preview)
