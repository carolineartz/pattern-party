declare type PatternData = {
  id: string
  markup: string
  hidden?: boolean
  createdAt?: firebase.firestore.Timestamp
  featured?: boolean
}