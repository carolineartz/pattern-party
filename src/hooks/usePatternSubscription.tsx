import React from 'react';
import Firebase from "./../components/Firebase"
import { useSetDraft, CollectionType } from '../store';

const LIMIT = 10

export const usePatternSubscription = (firebase: Firebase, collection: CollectionType) => {
  const setDraft = useSetDraft();

  React.useEffect(() => {
    let unsubscribe: firebase.Unsubscribe
      switch (collection) {
        case "community":
          unsubscribe = firebase.patterns().onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
              if (change.type === "added") {
                setDraft(draft => {
                  draft.patterns.set([change.doc.id, "community"], change.doc.data())
                  // debugger
                })
              }
            })
          })
          break
        case "community":
          unsubscribe = firebase.featuredPatterns().onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
              if (change.type === "added") {
                setDraft(draft => {
                  draft.patterns.set([change.doc.id, "community"], change.doc.data())
                })
              } else if (change.type === "removed") {
                setDraft(draft => {
                  const pat = draft.patterns.get([change.doc.id, "community"])

                  if (pat) {
                    draft.patterns.set([change.doc.id, "community"], {...pat, featured: false})
                  }
                })
              }
            })
          })
      }

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])
};


// export const useUserPatternSubscription = (firebase: Firebase) => {
//   const setDraft = useSetDraft();

//   React.useEffect(() => {
//     let unsubscribe: firebase.Unsubscribe
//       switch (collection) {
//         case "community":
//           unsubscribe = firebase.patterns().onSnapshot(snapshot => {
//             snapshot.docChanges().forEach(change => {
//               if (change.type === "added") {
//                 setDraft(draft => {
//                   draft.patterns.set([change.doc.id, "community"], change.doc.data())
//                   // debugger
//                 })
//               }
//             })
//           })
//           break
//         case "community":
//           unsubscribe = firebase.featuredPatterns().onSnapshot(snapshot => {
//             snapshot.docChanges().forEach(change => {
//               if (change.type === "added") {
//                 setDraft(draft => {
//                   draft.patterns.set([change.doc.id, "community"], change.doc.data())
//                 })
//               } else if (change.type === "removed") {
//                 setDraft(draft => {
//                   const pat = draft.patterns.get([change.doc.id, "community"])

//                   if (pat) {
//                     draft.patterns.set([change.doc.id, "community"], {...pat, featured: false})
//                   }
//                 })
//               }
//             })
//           })
//       }

//     return () => {
//       if (unsubscribe) {
//         unsubscribe()
//       }
//     }
//   }, [])
// };




export const useUserPatternSubscription = (firebase: Firebase, user?: firebase.User) => {
  const setDraft = useSetDraft();

  React.useEffect(() => {
    let unsubscribe: firebase.Unsubscribe
    if (user) {
      unsubscribe = firebase.userPatterns(user.uid).onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === "added") {
            console.log("added", change.doc.data())
            setDraft(draft => {
              draft.patterns.set([change.doc.id, "user"], change.doc.data())
            })
          }
        })
      })
    }
    return (() => {
      if (unsubscribe) {
        unsubscribe()
      }
    })
  }, [user])
};