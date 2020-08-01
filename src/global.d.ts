// import firebase from "./firebase"
// export { firebase }
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

declare type PatternType = {
  id: string
  markup: string
  featured: boolean
  hidden: boolean
  createdAt?: firebase.firestore.Timestamp
}
// declare module firebase {}
