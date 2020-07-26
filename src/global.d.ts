declare type PatternData = {
  id: string
  markup: string
  createdAt?: firebase.firestore.Timestamp
  hidden?: boolean
  featured?: boolean
}


declare type PatternDataResponse = {
  items: PatternData[],
  lastVisible?: firebase.firestore.QueryDocumentSnapshot<PatternData>,
  more: boolean
}

declare type DataResponse<D> = {
  items: D[],
  lastVisible?: firebase.firestore.QueryDocumentSnapshot<D>,
  more: boolean
}

