import exitHook from 'async-exit-hook'
import { Block } from './types'
import { sleep } from './sleep'
import { getBlock, getBlockHeight, getCollection, getTransaction, handleEvent } from './util'
import { record } from './record'
import { getLastDatFromNowTimestamp } from './date'
import { setupFCL } from './config'

type Report = Record<string, number>

let report: Report = {}

const handleBlock: (block: Block, startTime: Date, endTime: Date) => Promise<Block> = async (block, startTime, endTime) => {
  record(`block: ${JSON.stringify(block, null, '\t')}`)
  await sleep(1000)
  if (startTime >= endTime) throw new Error('startTime should be less than endTime')
  if (block.timestamp > endTime) {
    const parentBlock = await getBlock(block.parentId)
    return await handleBlock(parentBlock, startTime, endTime)
  } else if (block.timestamp <= startTime) {
    return block
  } else {
    if (block.collectionGuarantees) {
      for (const collectionGuarantee of block.collectionGuarantees) {
        const collection = await getCollection(collectionGuarantee.collectionId)
        for (const transactionId of collection.transactionIds) {
          try {
            const transaction = await getTransaction(transactionId)
            report = handleEvent(report, transaction.events)
          } catch (error) {
            console.log(`💥 error: ${JSON.stringify(error, null, '\t')}`)
          }
        }
      }
    }
    const parentBlock = await getBlock(block.parentId)
    return await handleBlock(parentBlock, startTime, endTime)
  }
}

  ; (async () => {

    exitHook(() => {
      record(JSON.stringify(report, null, '\t'))
    })

    setupFCL()

    const referencedBlock = await getBlockHeight(29831662)
    console.log(`💥 referencedBlock: ${JSON.stringify(referencedBlock, null, '\t')}`)

    try {
      let startTime = getLastDatFromNowTimestamp(8.1)
      let endTime = getLastDatFromNowTimestamp(6)

      const oldestBlock = await handleBlock(referencedBlock, startTime, endTime)
      record(`oldestBlock: ${JSON.stringify(oldestBlock, null, '\t')}`)
    } catch (error) {
      console.log(`💥 error: ${JSON.stringify(error, null, '\t')}`)
    }
    record(JSON.stringify(report, null, '\t'))
  })()
