import React from 'react';
import { PatternList } from './PatternList';
import { PatternGrid } from "./Patterns/grid"
import { DestroyDialog } from "./Patterns/destroy"
import { Box, Heading } from "grommet"
import "styled-components/macro"
import { useDispatch, useTrackedState } from './../state';

import { userPatterns } from "./../util"

type UserPatternsProps = {
  location: any
}

const UserPatterns = (props: UserPatternsProps) => {
  const dispatch = useDispatch();
  const state = useTrackedState();

  const { authUser, patterns } = state
  const [patternForDestroy, setPatternForDestroy] = React.useState<PatternType | null>(null)

  return (
    <>
      <UserPatternsText key="text-user-patterns" />
      {userPatterns(patterns).length &&
        <Box pad={{horizontal: "medium", bottom: "medium"}} width={{max: "1080px"}} margin="auto" css='width: 100%'>
          <PatternGrid>
            <PatternList
              patterns={userPatterns(patterns)}
              onDestroy={authUser ? (pattern: PatternType) => {
                setPatternForDestroy(pattern)
              } : undefined}
            />
          </PatternGrid>
        </Box>}
      {authUser && patternForDestroy &&
        <DestroyDialog
          key="destroy-dialog"
          ident={patternForDestroy.id}
          markup={patternForDestroy.markup}
          onClickDestroy={() => {
            dispatch({type: "DELETE_PATTERN", id: [patternForDestroy.id, "user"]})
            setPatternForDestroy(null)
          }}
          onClickHide={() => {
            dispatch({type: "HIDE_PATTERN", id: [patternForDestroy.id, "user"]})
            setPatternForDestroy(null)
          }}
          closeDialog={() => setPatternForDestroy(null)}
        />}
      </>
  )
}

const UserPatternsText = () => (
  <TextBlock text="My Patterns"  />
)


const TextBlock = ({ text, children }: { text: string, children?: React.ReactNode }) => (
  <Box pad="large">
    <Heading level={1} color="text">{text}</Heading>
    {children}
  </Box>
)

export default UserPatterns




