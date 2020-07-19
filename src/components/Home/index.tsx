import React from 'react';
import { compose } from 'recompose';

import { withAuthorization, WithAuthProps } from '../Session';
import { WithFirebaseProps, withFirebase } from '../Firebase';
import { PatternGrid } from './../Patterns/grid'
import { PatternListItem } from './../Patterns/patternListItem'
import { formatSVG } from "../../util";
import svgToMiniDataURI from "mini-svg-data-uri"
import { DestroyDialog } from "./../Patterns/destroy"

type PatternData = {
  id: string
  markup: string
}

type HomePageProps = WithFirebaseProps & WithAuthProps

// USER HOME PAGE
const HomePage = ({ firebase, authUser }: WithFirebaseProps & WithAuthProps): JSX.Element => {
  const [patterns, setPatterns] = React.useState<PatternData[] | undefined>()

  const fetchPatterns = React.useCallback(async () => {
    const data = await firebase.userPatterns(authUser.uid).get()
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
  }, [firebase, authUser])

  const [destroyDialogPattern, setDestroyDialogPattern] = React.useState<PatternData | null>(null)

  const handleClickCopyPattern = (evt: React.MouseEvent, content: string) => {
    evt.stopPropagation()

    navigator.clipboard.writeText(content).then(text => {
      console.log("Successfully copied SVG markup")
    }).catch(err => {
      console.error('Failed to write clipboard contents: ', err);
    });
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
  }, [authUser, fetchPatterns, firebase])

  React.useEffect(() => {
    if (authUser && !patterns) {
      fetchPatterns()
    }
  }, [patterns, authUser, fetchPatterns])

  return (
    <>
      <PatternGrid key="user-home-grid">
        {patterns && patterns.map(({id, markup}) => {
          return (
            <PatternListItem
              key={`pat-${id}`}
              markup={markup}
              onClickDestroy={(evt: React.MouseEvent) => {
                evt.stopPropagation()
                setDestroyDialogPattern({id, markup})
              }}
              onClickCopyMarkup={(evt: React.MouseEvent) => handleClickCopyPattern(evt, formatSVG(markup))}
              onClickCopyDataUri={(evt: React.MouseEvent) => handleClickCopyPattern(evt, svgToMiniDataURI(formatSVG(markup)))}
            />
          )
        })}
      </PatternGrid>
      { destroyDialogPattern && <DestroyDialog
        key="destroy-dialog"
        ident={destroyDialogPattern.id}
        markup={destroyDialogPattern.markup}
        onClickDestroy={() => {
          firebase.userPattern(authUser.uid, destroyDialogPattern.id).delete()
          setDestroyDialogPattern(null)
        }}
        onClickHide={() => {
          firebase.userPattern(authUser.uid, destroyDialogPattern.id).set({hidden: true}, {merge: true})
          setDestroyDialogPattern(null)
        }}
        onClickDismiss={() => {
          setDestroyDialogPattern(null)
        }}
      />}
    </>
  )
}
const condition = (authUser?: firebase.User) => !!authUser;

export default compose<HomePageProps, any>(withFirebase, withAuthorization(condition))(HomePage);
