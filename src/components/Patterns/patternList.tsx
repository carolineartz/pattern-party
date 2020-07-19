import * as React from 'react'
import { WithFirebaseProps, withFirebase } from '../Firebase'
import styled from 'styled-components';
import { Box } from 'grommet';
import { BoxProps } from 'grommet';
import { formatSVG } from './util';
import svgToMiniDataURI from "mini-svg-data-uri"
import { PatternListItem } from './patternListItem';

type PatternListPatternData = {
  markup: string
  id: string
  userId?: string
}

type PatternListProps = WithFirebaseProps & {
  patterns: PatternListPatternData[]
  authUser: firebase.User | null
}

class List extends React.Component<PatternListProps, {}> {
  handleClickCopyPattern = (evt: React.MouseEvent, content: string) => {
    evt.stopPropagation()

    navigator.clipboard.writeText(content).then(text => {
      console.log("Successfully copied SVG markup")
    }).catch(err => {
      console.error('Failed to write clipboard contents: ', err);
    });
  }

  handleClickSavePattern = (userId: string, markup: string) => {
    this.props.firebase.userPatterns(userId).add({
      markup: formatSVG(markup),
      hidden: false
    })
  }

  render() {
    const { patterns, authUser, firebase } = this.props

    return (
      <PatternGrid>
        {patterns.map(({id, markup, userId}) => {
          return (
            <PatternListItem
              key={`pat-${id}`}
              onClickSave={() => {
                // can save it if its a community pattern and logged in... maybe logic goes elsehwere
                if (!userId && authUser) {
                  this.handleClickSavePattern(authUser.uid, markup)
                }
              }}
              markup={markup}
              onClickDestroy={() => {
                if (userId) {
                  firebase.userPattern(userId, id).delete()
                } else {
                  firebase.pattern(id).delete()
                }
              }}
              onClickCopyMarkup={(evt: React.MouseEvent) => this.handleClickCopyPattern(evt, formatSVG(markup))}
              onClickCopyDataUri={(evt: React.MouseEvent) => this.handleClickCopyPattern(evt, svgToMiniDataURI(formatSVG(markup)))}
            />
          )
        })}
      </PatternGrid>
    )
  }
}

const PatternGrid = styled(Box)<BoxProps>`
  display: grid;
  grid-gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: minmax(150px, 25vh);
`

export const PatternList = withFirebase(List)
