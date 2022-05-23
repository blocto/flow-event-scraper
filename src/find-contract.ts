import * as fcl from '@onflow/fcl'
import exitHook from 'async-exit-hook'
import { Block } from './types'
import { sleep } from './sleep'
import { getBlock, getCollection, getTransaction, handleEvent } from './util'
import { record } from './record'
import { getLastDatFromNowTimestamp } from './date'

const URL_ACCESS_NODE = 'https://access-mainnet-beta.onflow.org'
// const URL_NODE = 'https://access-testnet.onflow.org'

type Report = Record<string, number>

const setupFCL: () => Promise<void> = async () => {
  fcl.config()
    // .put("env", "testnet")
    .put("accessNode.api", URL_ACCESS_NODE)
    .put("decoder.Enum", (val: any) => {
      const result: any = {
        type: val.id
      };

      for (let i = 0; i < val.fields.length; i++) {
        const field = val.fields[i];
        result[field.name] = field.value;
      }
      return result;
    })
    .put("decoder.Type", (val: any) => {
      return {}
    })
}

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

;(async () => {

    exitHook(() => {
      record(JSON.stringify(report, null, '\t'))
    })

    setupFCL()

    const referencedBlock = await getBlock('f06a08c224df00dd55724c583348ea2a79cfc11e6fd95b658e69e69ba9d37e10')
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
