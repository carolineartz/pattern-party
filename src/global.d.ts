declare type PatternType = {
  id: string
  markup: string
  featured: boolean
  hidden: boolean
  createdAt?: firebase.firestore.Timestamp
}

type LoadMoreData<D> = [firebase.firestore.QueryDocumentSnapshot<D>, boolean]
type LoadMoreResponse<D> = Promise<[firebase.firestore.QueryDocumentSnapshot<D>, boolean]>
