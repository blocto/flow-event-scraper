
export type Block = {
  id: string;
  parentId: string;
  height: number,
  timestamp: Date,
  collectionGuarantees: CollectionGuarantee[],
}

export type CollectionGuarantee = {
  collectionId: string
}

export type Collection = {
  transactionIds: string[]
}

export type Transaction = {
  events: Event[]
}

export type Event = {
  type: string
}