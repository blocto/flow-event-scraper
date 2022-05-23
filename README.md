# Flow Event Scraper

This project demonstrates how to use FCL to scrap event from Flow block.

## Getting Started

### Setting up environment

In order for this demo to work, you have to setup the dependencies first:

- **Install project dependencies**  
  Run `yarn` at project root.

### Starting the services

- **Start scraping flow transaction event**  
  Run `yarn start` at project root.

### Switch to Testnet

You can also test on Flow testnet instead of local emulator. To do so, simply update the FCL config inside `./src/config.ts`:

```
fcl.config()
  .put("env", "testnet")
  .put("accessNode.api", URL_TESTNET_ACCESS_NODE)
  ...
```

### Feature
- result will be output into file `events.json` at project root. 
- you can use `control + c` to stop task at any time and the report you get by then will still be recorded into file `events.json`.

### Known Issue
If you encounter decode error like this:
```
Error: Undefined Decoder Error: Type@nftType
    at recurseDecode (/Users/kidnapper/Documents/Bot/flow-event-scraper/node_modules/@onflow/sdk/src/decode/decode.js:113:5)
    at /Users/kidnapper/Documents/Bot/flow-event-scraper/node_modules/@onflow/sdk/src/decode/decode.js:57:25
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
    at async Promise.all (index 1)
```
Just use [testnet](https://testnet.flowscan.org/) or [mainnet-beta](https://flowscan.org/) explorer to find which event type that cause this issue.

For example: in this [case](https://testnet.flowscan.org/transaction/ead1ef8ffb0de08dfaf0ebc81ec38c364e179d83ccd7d7f5f56f4b31f1fa9b01)

Transaction has event type `ListingAvailable` and the fifth element type in fields is `Type` which is the type that Flow SDK's decoder can't recognize.

You can just add code below after the accessNode.api configuration to sovle this issue if you don't care about the content in this `Type`.
```
fcl.config()
    .put("accessNode.api", URL_ACCESS_NODE)
    .put("decoder.Type", (val: any) => {
      return {}
    })
```

### Tools Dependency
- yarn v1.22.10
- node v16.5.0