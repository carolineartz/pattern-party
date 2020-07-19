import React from 'react';
import { compose } from 'recompose';

import { WithAuthProps } from '../Session';
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
  console.log("rendering Exploore Page Component", authUser)
  const [patterns, setPatterns] = React.useState<PatternData[] | undefined>()
  // const [patUser, setPatUser] = React.useState<firebase.User | null>(authUser)

  const fetchPatterns =  React.useCallback(async () => {
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
  }, [firebase])

  const handleClickCopyPattern = (evt: React.MouseEvent, content: string) => {
    evt.stopPropagation()

    navigator.clipboard.writeText(content).then(text => {
      console.log("Successfully copied SVG markup")
    }).catch(err => {
      console.error('Failed to write clipboard contents: ', err);
    });
  }

  const handleClickDestroyPattern = (patId: string) => {
    firebase.pattern(patId).delete()
  }

  const patternListItemProps = ({markup, id}: PatternData) => {
    let base: any = {
      key: `pat-${id}`,
      markup,
      onClickCopyMarkup: (evt: React.MouseEvent) => handleClickCopyPattern(evt, formatSVG(markup)),
      onClickCopyDataUri: (evt: React.MouseEvent) => handleClickCopyPattern(evt, svgToMiniDataURI(formatSVG(markup)))
    }

    if (authUser) {
      base = {
        onClickSave: () => {
          firebase.userPatterns(authUser.uid).add({
            markup,
            hidden: false
          })
        },
        ...base
      }
    }

    if (authUser && (authUser as any).roles.admin) {
      base = {
        onClickDestroy: () => handleClickDestroyPattern(id)
        ,
        ...base
      }
    }

    return base
  }

  // React.useEffect(() => {
  //   if (authUser) {
  //     firebase.userPatterns(authUser.uid)
  //       .onSnapshot(function(snapshot) {
  //           snapshot.docChanges().forEach(function(change) {
  //             if (change.type === "added" || change.type === "removed") {
  //                 fetchPatterns()
  //             }
  //             else {
  //               console.log("change", change);
  //             }
  //           });
  //       });
  //   }
  // }, [authUser, fetchPatterns, firebase])

  React.useEffect(() => {
    if (!patterns) {
      fetchPatterns()
    }
  }, [patterns, fetchPatterns])

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

export default withFirebase(ExplorePage);
