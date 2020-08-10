import React from "react"

import { CollectionType } from "./../../store"
import { ResponsiveContext, Box, Heading, Text } from "grommet"
import { randomIcon } from "./../Icon"

type HeadlineProps = {
  collection: CollectionType
  subtitle?: JSX.Element
}

export const Headline = ({ collection, subtitle }: HeadlineProps) => {
  const size = React.useContext(ResponsiveContext)
  const isSmall = size === "small"
  const isMedium = size === "medium"
  const isDesktop = !isSmall && !isMedium

  // don't want to update the headline icon unless swithching to viewing a different set of patterns.
  // eslint-disable-next-line
  const HeaderIcon = React.useMemo(() => randomIcon()!, [collection])

  const headerText = React.useCallback((kind: CollectionType) => (
    <Heading size={isDesktop ? "medium" : "large"} level={1} color="text">
      {kind === "featured" ? "Featured" : kind === "user" ? "My" : "Community"} Patterns
    </Heading>
  ), [isDesktop])

  const headerBlurb = React.useCallback((kind: CollectionType) => (
    <>
      <Text size="large">
        {kind === "featured" ?
          "A curated selection of awesome patterns by community members." :
            kind === "community" && "Browse patterns by community members."}
      </Text>
      {subtitle}
    </>
  ), [subtitle])

  return (
    React.useMemo(() => {
      return (
        <Box
          pad={isSmall ? { top: "xlarge", horizontal: "large", bottom: "large" } : { horizontal: "xlarge", vertical: "large" }}
          margin={isSmall ? {vertical: "large"} : undefined}
        >
          <Box direction="row" gap={isSmall ? "small" : "medium"} align="center" pad={{bottom: "small"}}>
            {<HeaderIcon color="plain" size={isSmall ? "medium-large" : "xlarge"} />}
            <Box>
              {!isSmall &&
                <>
                  {headerText(collection)}
                  {headerBlurb(collection)}
                </>
                }
            </Box>
            {isSmall && headerText(collection)}
          </Box>
          {isSmall && headerBlurb(collection)}
        </Box>
      )
    }, [collection, headerBlurb, headerText, isSmall])
  )
}
