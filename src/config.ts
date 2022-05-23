import * as fcl from '@onflow/fcl'

// testnet
const URL_TESTNET_ACCESS_NODE = 'https://access-testnet.onflow.org'
// mainnet-beta
const URL_ACCESS_NODE = 'https://access-mainnet-beta.onflow.org'

export const setupFCL: () => Promise<void> = async () => {
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