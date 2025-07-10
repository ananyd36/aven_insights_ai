// import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js"
// import { Client } from "@modelcontextprotocol/sdk/client/index.js"

// const transport = new StreamableHTTPClientTransport("https://server.smithery.ai/@flight505/mcp-think-tank/mcp?api_key=a07ae7e0-11dc-45ae-a981-69cc1dcf17ea&profile=cognitive-hornet-Re1JE1")

// // Create MCP client
// const client = new Client({
// 	name: "Think Tank",
// 	version: "1.0.0"
// })
// await client.connect(transport)

// // List available tools
// const tools = await client.listTools() as { name: string }[];
// console.log(`Available tools: ${tools.map(t => t.name).join(", ")}`)

// /* Call a tool (when LLM requests it) */
// const result = await client.callTool({
//   name: "exa",
//   arguments: { arg1: "value" }
// })
// console.log("Tool result:", result.content) 