# Casper Delta Example Client

A comprehensive example client for the Casper Delta trading platform, demonstrating how to integrate with the casper-delta WASM client library.

## 🚀 Features

- **Complete Trading Interface**: Long and short position management
- **Real-time Market Data**: Current price, liquidity, and market state
- **Wallet Integration**: Seamless connection with CSPR.click wallet  
- **Token Management**: WCSPR balance tracking and faucet functionality
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS
- **TypeScript Support**: Full type safety and IntelliSense
- **Request Throttling**: Built-in rate limiting to prevent 429 errors from RPC endpoints

## 📋 Prerequisites

Before running the example, ensure you have:

1. **Node.js** (v18 or higher)
2. **npm** or **yarn** package manager
3. **CSPR.click** wallet installed in your browser
4. **Built casper-delta-wasm-client** library

## 🛠️ Setup

### 1. Build the WASM Client Library

First, ensure the casper-delta WASM client is built:

```bash
cd ../casper_delta_client
cargo build --release --target wasm32-unknown-unknown
wasm-pack build --target web --out-dir pkg-web
```

### 2. Install Dependencies

```bash
cd casper-delta-example
npm install
```

### 3. Configure Contract Addresses

Edit `trading.ts` and update the `CONTRACT_ADDRESSES` object with your deployed contract addresses:

```typescript
const CONTRACT_ADDRESSES = {
    market: "hash-your-market-contract-hash",
    wcspr: "hash-your-wcspr-contract-hash", 
    longToken: "hash-your-long-token-contract-hash",
    shortToken: "hash-your-short-token-contract-hash",
};
```

### 4. Build and Run

```bash
npm run build
npm start
```

The application will be available at `http://localhost:3000`

## 🎯 Usage

### Connecting Your Wallet

1. Click **"Connect Wallet"** in the top-right corner
2. Approve the connection in your CSPR.click wallet
3. Your wallet address and balances will be displayed

### Trading Operations

#### Long Positions 🟢
- **Deposit Long**: Buy long tokens by depositing WCSPR
- **Withdraw Long**: Sell long tokens back to WCSPR

#### Short Positions 🔴  
- **Deposit Short**: Buy short tokens by depositing WCSPR
- **Withdraw Short**: Sell short tokens back to WCSPR

#### Trading Fees 💰
- **Fee Rate**: 0.5% (1/200) on all deposits and withdrawals
- **Fee Collection**: Fees are automatically deducted and sent to the designated fee collector
- **Fee Calculation**: For any amount, the fee is calculated as `amount / 200`
- **Net Amount**: The remaining amount after fee deduction is used for the actual trade

### Additional Features

- **Update Price**: Trigger a price update from the oracle
- **Faucet WCSPR**: Get test WCSPR tokens (testnet only)
- **Refresh Data**: Update all balances and market state

## 📖 Code Structure

```
casper-delta-example/
├── index.html          # Main HTML template with UI
├── trading.ts          # TypeScript client implementation
├── index.ts            # Express server with RPC proxies
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── README.md           # This file
```

### Key Components

#### `trading.ts`
- **Wallet Management**: Connection, disconnection, and state management
- **Contract Clients**: Initialization of Market, WCSPR, and Position Token clients
- **Trading Functions**: Implementation of all trading operations
- **UI Updates**: Real-time updates of balances and market data
- **Error Handling**: Comprehensive error management and user feedback

#### `index.html`
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Market Dashboard**: Real-time price and liquidity display
- **Trading Interface**: Separate sections for long and short positions
- **Status Indicators**: Connection status and transaction notifications

#### `index.ts`
- **Development Server**: Express server for serving the application
- **RPC Proxies**: Proxy configuration for Casper RPC endpoints
- **Static Assets**: Serving of built JavaScript and other assets

## 🔧 Development

### Building for Development

```bash
npm run build
```

### Running the Development Server

```bash
npm run dev
```

### Debugging

Enable browser developer tools to see:
- Console logs for all operations
- Network requests to RPC endpoints
- WASM module loading and initialization
- Transaction hashes and results

## 🌐 Network Configuration

The example is pre-configured for Casper testnet:
- **RPC Endpoint**: `https://testnet-rpc.odra.dev`
- **Speculative RPC**: `https://testnet-speculative-rpc.odra.dev`
- **Network**: `casper-test`
- **Explorer**: `https://testnet.cspr.live/`

To use with mainnet, update the endpoints in `trading.ts`:

```typescript
client = new OdraWasmClient(
    "https://mainnet-rpc.odra.dev", 
    "https://mainnet-speculative-rpc.odra.dev", 
    "casper"
);
```

## ⚡ Request Throttling

The example client includes an intelligent request throttling system to prevent rate limiting errors:

- **Queue Management**: All RPC requests are queued and processed sequentially
- **Rate Limiting**: Minimum 1-second delay between requests
- **Visual Feedback**: Real-time status indicator showing queue status and wait times
- **Error Prevention**: Prevents 429 "Too Many Requests" errors from RPC endpoints

The throttling status is displayed in the UI showing:
- Current processing state
- Number of queued requests
- Countdown timer for rate limiting delays

## 🔐 Security Considerations

- **Private Keys**: Never expose private keys in the client code
- **Contract Addresses**: Verify contract addresses before deployment
- **Transaction Signing**: All transactions require user approval via wallet
- **Input Validation**: Amount inputs are validated before submission
- **Error Handling**: Sensitive error information is not exposed to users

## 🐛 Troubleshooting

### Common Issues

#### "Failed to connect wallet"
- Ensure CSPR.click wallet is installed and enabled
- Check that you're on the correct network (testnet/mainnet)
- Try refreshing the page and reconnecting

#### "Contract not found" or similar errors
- Verify contract addresses are correct in `CONTRACT_ADDRESSES`
- Ensure contracts are deployed on the target network
- Check RPC endpoint connectivity

#### "Transaction failed"
- Verify sufficient WCSPR balance for the operation (including 0.5% trading fee)
- Check gas fees and account balance
- Ensure market is not paused (if applicable)
- Note: Trading fees (0.5%) are automatically deducted from your deposit/withdrawal amount

#### Build errors
- Ensure WASM client library is built: `cd ../casper_delta_client && wasm-pack build --target web --out-dir pkg-web`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check TypeScript version compatibility

### Getting Help

- Check browser console for detailed error messages
- Verify network connectivity to RPC endpoints
- Ensure all prerequisites are properly installed
- Review transaction hashes on the Casper explorer

## 📚 API Reference

### Market Operations
- `market.depositLong(amount)` - Deposit WCSPR for long tokens
- `market.withdrawLong(amount)` - Withdraw long tokens for WCSPR
- `market.depositShort(amount)` - Deposit WCSPR for short tokens  
- `market.withdrawShort(amount)` - Withdraw short tokens for WCSPR
- `market.updatePrice()` - Update price from oracle
- `market.getMarketState()` - Get current market state

### Token Operations
- `wcspr.balanceOf(address)` - Get WCSPR balance
- `wcspr.faucet()` - Request test tokens (testnet only)
- `longToken.balanceOf(address)` - Get long token balance
- `shortToken.balanceOf(address)` - Get short token balance

### Wallet Operations
- `wallet.connect()` - Connect to wallet
- `wallet.disconnect()` - Disconnect from wallet
- `wallet.isConnected()` - Check connection status
- `wallet.getActivePublicKey()` - Get wallet address

## 📄 License

This example is provided as-is for educational and development purposes. Please ensure compliance with all applicable licenses when using in production.

