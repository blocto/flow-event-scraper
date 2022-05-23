import * as fcl from '@onflow/fcl'
import { record } from './record'
import { Block, Collection, Transaction, Event } from './types'

export const getLatestBlock: () => Promise<Block> = async () => {
  const blockResult: Block = await fcl.latestBlock(true)
  const latestBlock = {
    id: blockResult.id,
    parentId: blockResult.parentId,
    height: blockResult.height,
    timestamp: new Date(blockResult.timestamp),
    collectionGuarantees: blockResult.collectionGuarantees,
  }
  return latestBlock
}

export const getBlockHeight: (height: number) => Promise<Block> = async (height) => {
  let block = await fcl
    .send([
      fcl.getBlock(),
      fcl.atBlockHeight(height)
    ]).then(fcl.decode)

  return {
    id: block.id,
    parentId: block.parentId,
    height: block.height,
    timestamp: new Date(block.timestamp),
    collectionGuarantees: block.collectionGuarantees,
  }
}

export const getBlock: (id: string) => Promise<Block> = async (id) => {
  let block = await fcl
    .send([
      fcl.getBlock(),
      fcl.atBlockId(id)
    ]).then(fcl.decode)

  return {
    id: block.id,
    parentId: block.parentId,
    height: block.height,
    timestamp: new Date(block.timestamp),
    collectionGuarantees: block.collectionGuarantees,
  }
}

export const getCollection: (id: string) => Promise<Collection> = async (id) => {
  record(`get colletion by id ${id}`)
  const collection = await fcl
    .send([
      fcl.getCollection(id),
    ])
    .then(fcl.decode)
  return collection
}

export const getTransaction: (id: String) => Promise<Transaction> = async (id) => {
  record(`get transaction by id ${id}`)
  const transaction = await fcl
    .tx(id)
    .snapshot()
  return transaction
}

export const handleEvent: (report: Record<string, number>, events: Event[]) => Record<string, number> = (report, events) => {
  for (const event of events) {
    report[event.type] = report[event.type] ? report[event.type] + 1 : 1
  }
  return report
}