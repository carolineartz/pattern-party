import React from 'react';
import { compose } from 'recompose';

import { withAuthentication, WithAuthProps } from '../Session';
import { WithFirebaseProps, withFirebase } from '../Firebase';
import { PatternGrid } from '../Patterns/grid'
import { PatternListItem } from '../Patterns/patternListItem'
import { formatSVG } from "../../util";
import svgToMiniDataURI from "mini-svg-data-uri"
import { Box, Text } from 'grommet';

type PatternData = {
  id: string
  markup: string
}

type ExplorePageProps = WithFirebaseProps & WithAuthProps

const ExplorePage = ({ firebase, authUser }: ExplorePageProps): JSX.Element => {
  const [patterns, setPatterns] = React.useState<PatternData[] | undefined>()

  const fetchPatterns = async () => {
    const data = await firebase.patterns().get()
    const pats = data.docs

    let patData: PatternData[] = []

    pats.forEach((pattern) => {
      const markupString = pattern.data().markup

      patData.push({
        id: pattern.id,
        markup: markupString
      })
    })

    setPatterns(patData)
  }

  const handleClickCopyPattern = (evt: React.MouseEvent, content: string) => {
    evt.stopPropagation()

    navigator.clipboard.writeText(content).then(text => {
      console.log("Successfully copied SVG markup")
    }).catch(err => {
      console.error('Failed to write clipboard contents: ', err);
    });
  }

  const patternListItemProps = ({markup, id}: PatternData) => {
    const base = {
      key: `pat-${id}`,
      markup,
      onClickCopyMarkup: (evt: React.MouseEvent) => handleClickCopyPattern(evt, formatSVG(markup)),
      onClickCopyDataUri: (evt: React.MouseEvent) => handleClickCopyPattern(evt, svgToMiniDataURI(formatSVG(markup)))
    }

    if (authUser) {
      return {
        onClickSave: () => {
          firebase.userPatterns(authUser.uid).add({
            markup,
            hidden: false
          })
        },
        ...base
      }
    } else {
      return base
    }
  }

  React.useEffect(() => {
    if (authUser) {
      firebase.userPatterns(authUser.uid)
        .onSnapshot(function(snapshot) {
            snapshot.docChanges().forEach(function(change) {
              if (change.type === "added" || change.type === "removed") {
                  fetchPatterns()
              }
              else {
                console.log("change", change);
              }
            });
        });
    }
  }, [authUser])

  React.useEffect(() => {
    if (!patterns) {
      fetchPatterns()
    }
  }, [patterns])

  console.log("patterns", patterns)

  return (
    <>
      { authUser ? <Box><Text>Explore Page</Text></Box> : <Box><Text>Public Home Page</Text></Box> }
      <PatternGrid key="public-home-grid">
        { patterns && patterns.map((pattern) => {
          return (
            <PatternListItem {...patternListItemProps(pattern)}/>
          )
        })}
      </PatternGrid>
    </>
  )
}

export default compose<ExplorePageProps, any>(withFirebase, withAuthentication)(ExplorePage);
