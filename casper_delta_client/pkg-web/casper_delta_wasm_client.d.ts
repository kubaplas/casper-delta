/* tslint:disable */
/* eslint-disable */
/**
 * Returns the gas limit for the client for the next calls.
 */
export function gas(): bigint;
/**
 * Sets the gas limit for the client for the next calls.
 */
export function setGas(gas: bigint): void;
/**
 * Returns the default payment amount for transactions.
 */
export function DEFAULT_PAYMENT_AMOUNT(): bigint;
export function getCurrentAccount(): AccountInfo;
export function run(): void;
export enum FaucetableWcsprErrors {
  /**
   * The caller is not the new owner.
   */
  CallerNotTheNewOwner = 20002,
  /**
   * The caller is not the owner.
   */
  CallerNotTheOwner = 20001,
  /**
   * The user cannot target themselves.
   */
  CannotTargetSelfUser = 60003,
  /**
   * Spender does not have enough allowance approved.
   */
  InsufficientAllowance = 60002,
  /**
   * Spender does not have enough balance.
   */
  InsufficientBalance = 60001,
  /**
   * The role is missing.
   */
  MissingRole = 20003,
  /**
   * The owner is not set.
   */
  OwnerNotSet = 20000,
  /**
   * The role cannot be renounced for another address.
   */
  RoleRenounceForAnotherAddress = 20004,
}
export enum LongOrShort {
  Long = 0,
  Short = 1,
}
export enum MarketErrors {
  /**
   * The caller is not the new owner.
   */
  CallerNotTheNewOwner = 20002,
  /**
   * The caller is not the owner.
   */
  CallerNotTheOwner = 20001,
  LastPriceNotSet = 8001,
  LongShareNotSet = 8004,
  LongTokenContractNotACallerOnDeposit = 8006,
  LongTokenContractNotACallerOnWithdrawal = 8008,
  Misconfigured = 8010,
  /**
   * The role is missing.
   */
  MissingRole = 20003,
  NewPriceIsFromTheFuture = 8003,
  NewPriceIsTooOld = 8002,
  /**
   * The owner is not set.
   */
  OwnerNotSet = 20000,
  /**
   * Contract needs to be paused first.
   */
  PausedRequired = 21000,
  PriceFeedError = 8011,
  /**
   * The role cannot be renounced for another address.
   */
  RoleRenounceForAnotherAddress = 20004,
  ShortTokenContractNotACallerOnDeposit = 8007,
  ShortTokenContractNotACallerOnWithdrawal = 8009,
  TotalDepositNotSet = 8005,
  Unauthorized = 8401,
  /**
   * Contract needs to be unpaused first.
   */
  UnpausedRequired = 21001,
}
export enum PositionTokenErrors {
  /**
   * The caller is not the new owner.
   */
  CallerNotTheNewOwner = 20002,
  /**
   * The caller is not the owner.
   */
  CallerNotTheOwner = 20001,
  /**
   * The user cannot target themselves.
   */
  CannotTargetSelfUser = 60003,
  /**
   * Spender does not have enough allowance approved.
   */
  InsufficientAllowance = 60002,
  /**
   * Spender does not have enough balance.
   */
  InsufficientBalance = 60001,
  /**
   * The role is missing.
   */
  MissingRole = 20003,
  /**
   * The owner is not set.
   */
  OwnerNotSet = 20000,
  /**
   * The role cannot be renounced for another address.
   */
  RoleRenounceForAnotherAddress = 20004,
}
export enum TransactionStatus {
  /**
   * The transaction has been signed and successfully deployed to a Casper node.
   */
  SENT = 0,
  /**
   * The transaction has been processed by the network. May result in success or failure.
   */
  PROCESSED = 1,
  /**
   * The transaction’s time-to-live (TTL) elapsed before execution.
   */
  EXPIRED = 2,
  /**
   * The user rejected the signature request.
   */
  CANCELLED = 3,
  /**
   * The SDK stopped listening for updates before the transaction was finalized. A custom timeout can be specified (default: 120 seconds).
   */
  TIMEOUT = 4,
  /**
   * An unexpected error occurred while submitting or monitoring the transaction.
   */
  ERROR = 5,
  /**
   * A heartbeat event sent periodically to indicate that the connection is still active.
   */
  PING = 6,
}
export enum Verbosity {
  Low = 0,
  Medium = 1,
  High = 2,
}
export enum WrappedNativeTokenErrors {
  /**
   * The user cannot target themselves.
   */
  CannotTargetSelfUser = 60003,
  /**
   * Spender does not have enough allowance approved.
   */
  InsufficientAllowance = 60002,
  /**
   * Spender does not have enough balance.
   */
  InsufficientBalance = 60001,
}
export class AccountInfo {
  private constructor();
/**
** Return copy of self without private attributes.
*/
  toJSON(): Object;
/**
* Return stringified version of self.
*/
  toString(): string;
  free(): void;
  /**
   * The provider to which the account belongs to.
   */
  readonly provider: string;
  /**
   * An array of supported capabilities in the connected wallet.
   * Possible values: "sign-deploy", "sign-transactionv1", "sign-message".
   */
  readonly providerSupports: string[] | undefined;
  /**
   * CSPR.name name
   */
  readonly csprName: string | undefined;
  /**
   * The account public key in hex format.
   */
  readonly publicKey: string;
  /**
   * Timestamp for the initial connection of the account
   */
  readonly connectedAt: bigint;
  /**
   * URL to the account avatar/logo.
   */
  readonly logo: string | undefined;
  /**
   * The account address derived from the public key.
   */
  readonly address: Address;
  /**
   * Total balance of the account in CSPR motes (includes liquid +staked balance).
   */
  readonly balance: U512;
  /**
   * Liquid balance of the account in CSPR motes (includes liquid +staked balance)
   */
  readonly liquidBalance: U512;
}
export class Address {
/**
** Return copy of self without private attributes.
*/
  toJSON(): Object;
/**
* Return stringified version of self.
*/
  toString(): string;
  free(): void;
  constructor(address: string);
  static fromHtmlInput(input: HTMLInputElement): Address;
  static fromPublicKey(input: string): Address;
  readonly value: string;
}
export class AddressMarketState {
  free(): void;
  constructor(marketState: MarketState, isPaused: boolean, fee: U256, wcsprBalance: U256, longTokenBalance: U256, shortTokenBalance: U256, marketAllowance: U256, longPositionValue: U256, shortPositionValue: U256, totalPositionValue: U256, longSharePercentage: U256, shortSharePercentage: U256, config: Config);
  toJson(): any;
  marketState: MarketState;
  isPaused: boolean;
  config: Config;
  fee: U256;
  wcspr_balance: U256;
  long_token_balance: U256;
  short_token_balance: U256;
  market_allowance: U256;
  long_position_value: U256;
  short_position_value: U256;
  total_position_value: U256;
  long_share_percentage: U256;
  short_share_percentage: U256;
}
export class BalanceFormatter {
  private constructor();
  free(): void;
  fmt(): string;
  fmtWithPrecision(precision: number): string;
}
export class Burn {
  free(): void;
  constructor(owner: Address, amount: U256);
  toJson(): any;
  owner: Address;
  amount: U256;
}
export class Bytes {
  free(): void;
  constructor();
  static fromUint8Array(uint8_array: Uint8Array): Bytes;
  toString(): string;
  readonly value: string;
}
export class Config {
  free(): void;
  constructor(longToken: Address, shortToken: Address, wcsprToken: Address, feeCollector: Address);
  toJson(): any;
  long_token: Address;
  short_token: Address;
  wcspr_token: Address;
  fee_collector: Address;
}
export class ConfigUpdated {
  free(): void;
  constructor(admin: Address, longToken: Address, shortToken: Address, wcsprToken: Address, feeCollector: Address);
  toJson(): any;
  admin: Address;
  long_token: Address;
  short_token: Address;
  wcspr_token: Address;
  fee_collector: Address;
}
/**
 * Information about a specific smart contract.
 *
 * Contains essential metadata for identifying and interacting with a deployed
 * smart contract, including its name and package hash used for addressing.
 */
export class ContractInfo {
  private constructor();
/**
** Return copy of self without private attributes.
*/
  toJSON(): Object;
/**
* Return stringified version of self.
*/
  toString(): string;
  free(): void;
  /**
   * Human-readable name of the contract
   */
  name: string;
  /**
   * Unique hash identifier for the contract package
   */
  package_hash: string;
  /**
   * Gets the contract's address derived from its package hash.
   *
   * Converts the package hash into an Address instance that can be used
   * for contract interactions.
   *
   * # Returns
   * * `Address` - Contract address derived from the package hash
   *
   * # Panics
   * Panics if the package hash is invalid and cannot be converted to an Address.
   */
  readonly address: Address;
}
/**
 * Container for multiple smart contract definitions with metadata.
 *
 * This structure holds a collection of contract information along with
 * a timestamp indicating when the data was last updated. It can be
 * serialized/deserialized to/from JSON and is exposed to JavaScript.
 */
export class Contracts {
/**
** Return copy of self without private attributes.
*/
  toJSON(): Object;
/**
* Return stringified version of self.
*/
  toString(): string;
  free(): void;
  /**
   * Creates a new `Contracts` instance from a JavaScript value.
   *
   * # Arguments
   * * `js` - JavaScript value containing contract data in JSON format
   *
   * # Returns
   * * `Result<Self, JsError>` - New Contracts instance or error if parsing fails
   *
   * # Errors
   * Returns `JsError` if the JavaScript value cannot be deserialized into a Contracts struct.
   */
  constructor(js: any);
  /**
   * Asynchronously loads contract information from a remote JSON file.
   *
   * This method fetches contract data from the specified URL path using the browser's
   * fetch API, parses the JSON response, and creates a new Contracts instance.
   *
   * # Arguments
   * * `path` - URL path to the JSON file containing contract information
   *
   * # Returns
   * * `Result<Self, JsError>` - New Contracts instance or error if loading fails
   *
   * # Errors
   * Returns `JsError` if:
   * - No window object is available (not in browser environment)
   * - Network request fails
   * - Response cannot be parsed as JSON
   * - JSON structure doesn't match expected Contracts format
   */
  static fromPath(path: string): Promise<Contracts>;
  /**
   * Retrieves contract information by name.
   *
   * Searches through the contracts collection for a contract with the specified name
   * and returns its information if found.
   *
   * # Arguments
   * * `name` - Name of the contract to find
   *
   * # Returns
   * * `Result<ContractInfo, JsError>` - Contract information or error if not found
   *
   * # Errors
   * Returns `JsError` if no contract with the specified name exists.
   */
  get(name: string): ContractInfo;
}
export class CsprClickCallbacks {
  private constructor();
  free(): void;
  static onSignedIn(callback: Function): void;
  static onSwitchedAccount(callback: Function): void;
  static onUnsolicitedAccountChange(callback: Function): void;
  static onSignedOut(callback: Function): void;
  static onDisconnected(callback: Function): void;
  static onTransactionStatusUpdate(callback: Function): void;
}
export class DecreaseAllowance {
  free(): void;
  constructor(owner: Address, spender: Address, allowance: U256, decrBy: U256);
  toJson(): any;
  owner: Address;
  spender: Address;
  allowance: U256;
  decr_by: U256;
}
export class Deposit {
  free(): void;
  constructor(account: Address, value: U256);
  toJson(): any;
  account: Address;
  value: U256;
}
export class FaucetableWcsprWasmClient {
  free(): void;
  constructor(wasmClient: OdraWasmClient, address: Address);
  transfer(recipient: Address, amount: U256): Promise<TransactionResult>;
  transferFrom(owner: Address, recipient: Address, amount: U256): Promise<TransactionResult>;
  faucet(): Promise<TransactionResult>;
  participants(): Promise<Address[]>;
  /**
   * Add a new transfer manager (admin only)
   */
  addTransferManager(address: Address): Promise<TransactionResult>;
  /**
   * Remove a transfer manager (admin only)
   */
  removeTransferManager(address: Address): Promise<TransactionResult>;
  /**
   * Delegated. See `self.access_control.has_role()` for details.
   */
  hasRole(role: Uint8Array, address: Address): Promise<boolean>;
  /**
   * Delegated. See `self.access_control.grant_role()` for details.
   */
  grantRole(role: Uint8Array, address: Address): Promise<TransactionResult>;
  /**
   * Delegated. See `self.access_control.revoke_role()` for details.
   */
  revokeRole(role: Uint8Array, address: Address): Promise<TransactionResult>;
  /**
   * Delegated. See `self.access_control.get_role_admin()` for details.
   */
  getRoleAdmin(role: Uint8Array): Promise<Uint8Array>;
  /**
   * Delegated. See `self.access_control.renounce_role()` for details.
   */
  renounceRole(role: Uint8Array, address: Address): Promise<TransactionResult>;
  /**
   * Delegated. See `self.wcspr.name()` for details.
   */
  name(): Promise<string>;
  /**
   * Delegated. See `self.wcspr.symbol()` for details.
   */
  symbol(): Promise<string>;
  /**
   * Delegated. See `self.wcspr.decimals()` for details.
   */
  decimals(): Promise<number>;
  /**
   * Delegated. See `self.wcspr.total_supply()` for details.
   */
  totalSupply(): Promise<U256>;
  /**
   * Delegated. See `self.wcspr.balance_of()` for details.
   */
  balanceOf(address: Address): Promise<U256>;
  /**
   * Delegated. See `self.wcspr.allowance()` for details.
   */
  allowance(owner: Address, spender: Address): Promise<U256>;
  /**
   * Delegated. See `self.wcspr.approve()` for details.
   */
  approve(spender: Address, amount: U256): Promise<TransactionResult>;
  /**
   * Delegated. See `self.metadata.contract_name()` for details.
   */
  contractName(): Promise<string | undefined>;
  /**
   * Delegated. See `self.metadata.contract_description()` for details.
   */
  contractDescription(): Promise<string | undefined>;
  /**
   * Delegated. See `self.metadata.contract_icon_uri()` for details.
   */
  contractIconUri(): Promise<string | undefined>;
  /**
   * Delegated. See `self.metadata.contract_project_uri()` for details.
   */
  contractProjectUri(): Promise<string | undefined>;
}
export class FeeCollected {
  free(): void;
  constructor(amount: U256, feeCollector: Address);
  toJson(): any;
  amount: U256;
  fee_collector: Address;
}
export class IncreaseAllowance {
  free(): void;
  constructor(owner: Address, spender: Address, allowance: U256, incBy: U256);
  toJson(): any;
  owner: Address;
  spender: Address;
  allowance: U256;
  inc_by: U256;
}
export class LongDeposited {
  free(): void;
  constructor(user: Address, wcsprAmount: U256, longTokensMinted: U256, feeCollected: U256);
  toJson(): any;
  user: Address;
  wcspr_amount: U256;
  long_tokens_minted: U256;
  fee_collected: U256;
}
export class LongWithdrawn {
  free(): void;
  constructor(user: Address, longTokensBurned: U256, wcsprAmount: U256, feeCollected: U256);
  toJson(): any;
  user: Address;
  long_tokens_burned: U256;
  wcspr_amount: U256;
  fee_collected: U256;
}
export class MarketState {
  free(): void;
  constructor(longTotalSupply: U256, shortTotalSupply: U256, longLiquidity: U256, shortLiquidity: U256, price: U256);
  toJson(): any;
  long_total_supply: U256;
  short_total_supply: U256;
  long_liquidity: U256;
  short_liquidity: U256;
  price: U256;
}
export class MarketWasmClient {
  free(): void;
  constructor(wasmClient: OdraWasmClient, address: Address);
  pause(): Promise<TransactionResult>;
  unpause(): Promise<TransactionResult>;
  isPaused(): Promise<boolean>;
  updatePrice(): Promise<TransactionResult>;
  depositLong(wcsprAmount: U256): Promise<TransactionResult>;
  depositLongFrom(sender: Address, wcsprAmount: U256): Promise<TransactionResult>;
  depositShort(wcsprAmount: U256): Promise<TransactionResult>;
  depositShortFrom(sender: Address, wcsprAmount: U256): Promise<TransactionResult>;
  withdrawLong(longTokenAmount: U256): Promise<TransactionResult>;
  withdrawLongFrom(sender: Address, longTokenAmount: U256): Promise<TransactionResult>;
  withdrawShort(shortTokenAmount: U256): Promise<TransactionResult>;
  withdrawShortFrom(sender: Address, shortTokenAmount: U256): Promise<TransactionResult>;
  getMarketState(): Promise<MarketState>;
  setConfig(cfg: Config): Promise<TransactionResult>;
  getConfig(): Promise<Config>;
  setPriceFeed(priceFeedAddress: Address, priceFeedId: string): Promise<TransactionResult>;
  /**
   * Returns comprehensive market and user data in a single call for frontend efficiency.
   */
  getAddressMarketState(address: Address): Promise<AddressMarketState>;
  /**
   * Delegated. See `self.access_control.has_role()` for details.
   */
  hasRole(role: Uint8Array, address: Address): Promise<boolean>;
  /**
   * Delegated. See `self.access_control.grant_role()` for details.
   */
  grantRole(role: Uint8Array, address: Address): Promise<TransactionResult>;
  /**
   * Delegated. See `self.access_control.revoke_role()` for details.
   */
  revokeRole(role: Uint8Array, address: Address): Promise<TransactionResult>;
  /**
   * Delegated. See `self.access_control.get_role_admin()` for details.
   */
  getRoleAdmin(role: Uint8Array): Promise<Uint8Array>;
  /**
   * Delegated. See `self.access_control.renounce_role()` for details.
   */
  renounceRole(role: Uint8Array, address: Address): Promise<TransactionResult>;
  /**
   * Delegated. See `self.metadata.contract_name()` for details.
   */
  contractName(): Promise<string | undefined>;
  /**
   * Delegated. See `self.metadata.contract_description()` for details.
   */
  contractDescription(): Promise<string | undefined>;
  /**
   * Delegated. See `self.metadata.contract_icon_uri()` for details.
   */
  contractIconUri(): Promise<string | undefined>;
  /**
   * Delegated. See `self.metadata.contract_project_uri()` for details.
   */
  contractProjectUri(): Promise<string | undefined>;
}
export class Mint {
  free(): void;
  constructor(recipient: Address, amount: U256);
  toJson(): any;
  recipient: Address;
  amount: U256;
}
/**
 * A client for interacting with the Casper blockchain and CSPR.click.
 *
 * The `OdraWasmClient` struct provides methods to interact with the Casper blockchain,
 * including querying balances, transferring tokens, and calling smart contract entry points.
 * It also integrates with CSPR.click for account management and transaction signing.
 */
export class OdraWasmClient {
  free(): void;
  constructor(node_address: string, speculative_node_address: string, chain_name?: string | null, ttl?: number | null, verbosity?: Verbosity | null);
  /**
   * Returns the balance of the specified address.
   */
  getBalance(address: Address): Promise<U512>;
  /**
   * Returns the balance of the specified address.
   */
  caller(): Promise<Address>;
  /**
   * Transfers the specified amount to the given address.
   */
  transfer(to: Address, amount: U512): Promise<TransactionResult>;
  /**
   * Call the connect() method using a provider name as the first parameter to request a connection using that wallet
   * or login mechanism.
   *
   * Some providers may need an options argument to indicate the connection behavior requested.
   */
  connect(provider: string): Promise<AccountInfo>;
  /**
   * Triggers a request to a UI library to show a sign-in dialog.
   */
  signIn(): Promise<void>;
  /**
   * Closes an active session in your dApp.
   *
   * Triggers the [Event::SignedOut](crate::cspr_click::event::Event::SignedOut) event.
   */
  signOut(): Promise<void>;
  /**
   * Usually you will call signOut() method to close a user session. Use disconnect() when you want to clear
   * the connection between the wallet and your app. Next time the user signs in with that wallet, he'll
   * must grant connection permission again.
   */
  disconnect(): Promise<boolean>;
  /**
   * Starts a session with the indicated account. This account must be one of the accounts returned
   * in getKnownAccounts or getSignInOptions.
   *
   * Note that no interaction with the account provider is required to sign-in. CSPR.click will check and restore
   * the connection if needed when there's a transaction or message to sign.
   */
  signInWithAccount(account: AccountInfo): Promise<AccountInfo>;
  /**
   * Returns true if the provider is unlocked. false if the provider is locked.
   */
  isUnlocked(provider: string): Promise<boolean>;
  /**
   * Gets the public key for the current session (if any).
   */
  getActivePublicKey(): Promise<string>;
  /**
   * Gets the account for the current session (if any).
   */
  getActiveAccount(): Promise<AccountInfo>;
  /**
   * Call this method to request CSPR.click UI to show the Switch Account modal window.
   */
  switchAccount(): Promise<void>;
  /**
   * Triggers the mechanisms to request your user to sign a text message with the active wallet.
   */
  signMessage(message: string): Promise<SignResult>;
}
export class OverflowingResultU128 {
  private constructor();
  free(): void;
  readonly result: U128;
  readonly overflow: boolean;
}
export class OverflowingResultU256 {
  private constructor();
  free(): void;
  readonly result: U256;
  readonly overflow: boolean;
}
export class OverflowingResultU512 {
  private constructor();
  free(): void;
  readonly result: U512;
  readonly overflow: boolean;
}
export class Paused {
  free(): void;
  constructor(account: Address);
  toJson(): any;
  account: Address;
}
export class PositionTokenWasmClient {
  free(): void;
  constructor(wasmClient: OdraWasmClient, address: Address);
  transfer(recipient: Address, amount: U256): Promise<TransactionResult>;
  transferFrom(owner: Address, recipient: Address, amount: U256): Promise<TransactionResult>;
  /**
   * Burns the given amount of tokens from the given address.
   */
  burn(owner: Address, amount: U256): Promise<TransactionResult>;
  mint(to: Address, amount: U256): Promise<TransactionResult>;
  longOrShort(): Promise<LongOrShort>;
  disablePeerTransfers(): Promise<TransactionResult>;
  enablePeerTransfers(): Promise<TransactionResult>;
  /**
   * Returns the name of the token.
   */
  name(): Promise<string>;
  /**
   * Returns the symbol of the token.
   */
  symbol(): Promise<string>;
  /**
   * Returns the number of decimals the token uses.
   */
  decimals(): Promise<number>;
  /**
   * Returns the total supply of the token.
   */
  totalSupply(): Promise<U256>;
  /**
   * Returns the balance of the given address.
   */
  balanceOf(address: Address): Promise<U256>;
  /**
   * Returns the amount of tokens the owner has allowed the spender to spend.
   */
  allowance(owner: Address, spender: Address): Promise<U256>;
  /**
   * Approves the spender to spend the given amount of tokens on behalf of the caller.
   */
  approve(spender: Address, amount: U256): Promise<TransactionResult>;
  /**
   * Decreases the allowance of the spender by the given amount.
   */
  decreaseAllowance(spender: Address, decrBy: U256): Promise<TransactionResult>;
  /**
   * Increases the allowance of the spender by the given amount.
   */
  increaseAllowance(spender: Address, incBy: U256): Promise<TransactionResult>;
  /**
   * Delegated. See `self.metadata.contract_name()` for details.
   */
  contractName(): Promise<string | undefined>;
  /**
   * Delegated. See `self.metadata.contract_description()` for details.
   */
  contractDescription(): Promise<string | undefined>;
  /**
   * Delegated. See `self.metadata.contract_icon_uri()` for details.
   */
  contractIconUri(): Promise<string | undefined>;
  /**
   * Delegated. See `self.metadata.contract_project_uri()` for details.
   */
  contractProjectUri(): Promise<string | undefined>;
}
export class PriceFeedUpdated {
  free(): void;
  constructor(admin: Address, priceFeedAddress: Address, priceFeedId: string);
  toJson(): any;
  priceFeedId: string;
  admin: Address;
  price_feed_address: Address;
}
export class PriceUpdated {
  free(): void;
  constructor(newPrice: U256, previousPrice: U256, timestamp: bigint);
  toJson(): any;
  timestamp: bigint;
  new_price: U256;
  previous_price: U256;
}
export class PublicKey {
  free(): void;
  constructor(public_key_hex_str: string);
  static fromUint8Array(bytes: Uint8Array): PublicKey;
  toJson(): any;
}
export class RoleAdminChanged {
  free(): void;
  constructor(role: Uint8Array, previousAdminRole: Uint8Array, newAdminRole: Uint8Array);
  toJson(): any;
  role: Uint8Array;
  previousAdminRole: Uint8Array;
  newAdminRole: Uint8Array;
}
export class RoleGranted {
  free(): void;
  constructor(role: Uint8Array, address: Address, sender: Address);
  toJson(): any;
  role: Uint8Array;
  address: Address;
  sender: Address;
}
export class RoleRevoked {
  free(): void;
  constructor(role: Uint8Array, address: Address, sender: Address);
  toJson(): any;
  role: Uint8Array;
  address: Address;
  sender: Address;
}
export class SetAllowance {
  free(): void;
  constructor(owner: Address, spender: Address, allowance: U256);
  toJson(): any;
  owner: Address;
  spender: Address;
  allowance: U256;
}
export class ShortDeposited {
  free(): void;
  constructor(user: Address, wcsprAmount: U256, shortTokensMinted: U256, feeCollected: U256);
  toJson(): any;
  user: Address;
  wcspr_amount: U256;
  short_tokens_minted: U256;
  fee_collected: U256;
}
export class ShortWithdrawn {
  free(): void;
  constructor(user: Address, shortTokensBurned: U256, wcsprAmount: U256, feeCollected: U256);
  toJson(): any;
  user: Address;
  short_tokens_burned: U256;
  wcspr_amount: U256;
  fee_collected: U256;
}
export class SignResult {
  private constructor();
  free(): void;
  /**
   * true when the user has declined the signature of the transaction. false otherwise
   */
  readonly isCancelled: boolean;
  /**
   * An hexadecimal string with the crytpographic signature of the deploy.
   */
  readonly signatureHex: string | undefined;
  /**
   * A byte array with the cryptographic signature of the deploy.
   */
  readonly signature: Uint8Array;
  /**
   * None if the deploy has been successfully signed. It contains an error message otherwise.
   */
  readonly error: string | undefined;
  readonly transaction: any;
}
export class TransactionData {
  private constructor();
  free(): void;
  /**
   * Hash of the block containing the transaction represented as a hexadecimal string.
   */
  readonly blockHash: string;
  /**
   * Height of the block containing the transaction.
   */
  readonly blockHeight: bigint;
  /**
   * Hash of the transaction caller account represented as a hexademical string.
   */
  readonly callerHash: string;
  /**
   * Public key of the transaction caller account represented as a hexademical string.
   * May be null if the public key is not known, but the callerHash will still be present.
   */
  readonly callerPublicKey: string | undefined;
  /**
   * Represents the total amount of gas consumed during the execution of the transaction.
   */
  readonly consumedGas: string;
  /**
   * Hash of the contract called by the transaction represented as a hexadecimal string.
   * null if the transaction had no contract call.
   */
  readonly contractHash: string;
  /**
   * Hash of the contract package called by the transaction represented as a hexadecimal string.
   * null if the transaction had no contract call.
   */
  readonly contractPackageHash: string;
  /**
   * Transaction execution cost. The type is string to avoid overflow in languages that don't support uint64,
   * which is the correct type.
   */
  readonly cost: string;
  /**
   * Transaction hash represented as a hexadecimal string. Primary transaction identifier.
   */
  readonly transactionHash: string;
  /**
   * Identifier of the ContractEntrypoint called by transaction. null if the transaction had no contract call.
   */
  readonly entryPointId: bigint;
  /**
   * Error message in case of a failed transaction. null for a successful transaction.
   */
  readonly errorMessage: string | undefined;
  /**
   * Identifier, that tells what type of the transaction was executed
   */
  readonly executionTypeId: bigint;
  /**
   * Maximum allowed gas price that was specified by the caller (used only in Limited(0) pricing mode)
   */
  readonly gasPriceLimit: bigint;
  /**
   * Indicates whether the transaction uses the standard payment mechanism or a custom payment contract
   */
  readonly isStandardPayment: boolean;
  /**
   * Payment amount provided by the caller in motes. The type is string to avoid overflow in languages
   * that don't support uint64, which is the correct type. null if a custom payment contract was provided
   * to the transaction instead of the value in motes.
   */
  readonly paymentAmount: string;
  /**
   * Pricing mode identifier. Indicates which pricing model applies to the transaction
   */
  readonly pricingModeId: bigint;
  /**
   * The amount of gas cost that was refunded to the caller account. In the current Mainnet configuration,
   * 75% of unused payment amount is refunded.
   */
  readonly refundAmount: string;
  /**
   * Identifies how the transaction was executed: 0 for native execution, 1 for VM version 1, and 2 for VM version 2
   */
  readonly runtimeTypeId: bigint;
  /**
   * Transaction status (pending, expired, or processed).
   */
  readonly status: TransactionStatus;
  /**
   * Transaction creation timestamp in the ISO 8601 format.
   */
  readonly timestamp: string;
  /**
   * Transaction version identifier: 0 for Casper 1.X transactions, 1 for Casper 2.0 transactions, and 2 for Casper 2.0 transactions.
   */
  readonly versionId: bigint;
  readonly args: any;
}
export class TransactionResult {
  private constructor();
  free(): void;
  /**
   * Transaction status (pending, expired, or processed).
   */
  readonly status: TransactionStatus | undefined;
  /**
   * true when the user has declined the signature of the transaction. false otherwise
   */
  readonly isCancelled: boolean;
  /**
   * None if the deploy has been successfully executed. It contains an error message otherwise.
   */
  readonly error: string | undefined;
  /**
   * Error code extracted from the error message, if available.
   */
  readonly errorCode: number | undefined;
  /**
   * Transaction details from CSPR Cloud API. null if the transaction is not found or not processed yet.
   */
  readonly data: TransactionData | undefined;
  /**
   * If transactionHash is null, returns deployHash. Otherwise, returns transactionHash.
   */
  readonly txHash: string | undefined;
}
export class Transfer {
  free(): void;
  constructor(sender: Address, recipient: Address, amount: U256);
  toJson(): any;
  sender: Address;
  recipient: Address;
  amount: U256;
}
export class TransferFrom {
  free(): void;
  constructor(spender: Address, owner: Address, recipient: Address, amount: U256);
  toJson(): any;
  spender: Address;
  owner: Address;
  recipient: Address;
  amount: U256;
}
export class U128 {
/**
** Return copy of self without private attributes.
*/
  toJSON(): Object;
/**
* Return stringified version of self.
*/
  toString(): string;
  free(): void;
  constructor(value: string);
  static fromNumber(value: number): U128;
  static fromHtmlInput(input: HTMLInputElement): U128;
  static fromBigInt(value: bigint): U128;
  toString(): string;
  toJson(): any;
  formatter(decimals: number): BalanceFormatter;
  mul(other: U128): U128;
  mulBigInt(other: bigint): U128;
  div(other: U128): U128;
  divBigInt(other: bigint): U128;
  add(other: U128): U128;
  addBigInt(other: bigint): U128;
  sub(other: U128): U128;
  subBigInt(other: bigint): U128;
  checkedMul(other: U128): U128 | undefined;
  checkedAdd(other: U128): U128 | undefined;
  checkedSub(other: U128): U128 | undefined;
  checkedDiv(other: U128): U128 | undefined;
  checkedRem(other: U128): U128 | undefined;
  checkedPow(exp: number): U128 | undefined;
  toBigInt(): bigint;
  lt(other: U128): boolean;
  le(other: U128): boolean;
  gt(other: U128): boolean;
  ge(other: U128): boolean;
  static MAX(): U128;
  static zero(): U128;
  overflowingMul(other: U128): OverflowingResultU128;
  overflowingAdd(other: U128): OverflowingResultU128;
  overflowingSub(other: U128): OverflowingResultU128;
  overflowingPow(exp: number): OverflowingResultU128;
  static fromU512(value: U512): U128;
  toU512(): U512;
  static fromU256(value: U256): U128;
  toU256(): U256;
  readonly value: string;
}
export class U256 {
/**
** Return copy of self without private attributes.
*/
  toJSON(): Object;
/**
* Return stringified version of self.
*/
  toString(): string;
  free(): void;
  constructor(value: string);
  static fromNumber(value: number): U256;
  static fromHtmlInput(input: HTMLInputElement): U256;
  static fromBigInt(value: bigint): U256;
  toString(): string;
  toJson(): any;
  formatter(decimals: number): BalanceFormatter;
  mul(other: U256): U256;
  mulBigInt(other: bigint): U256;
  div(other: U256): U256;
  divBigInt(other: bigint): U256;
  add(other: U256): U256;
  addBigInt(other: bigint): U256;
  sub(other: U256): U256;
  subBigInt(other: bigint): U256;
  checkedMul(other: U256): U256 | undefined;
  checkedAdd(other: U256): U256 | undefined;
  checkedSub(other: U256): U256 | undefined;
  checkedDiv(other: U256): U256 | undefined;
  checkedRem(other: U256): U256 | undefined;
  checkedPow(exp: number): U256 | undefined;
  toBigInt(): bigint;
  lt(other: U256): boolean;
  le(other: U256): boolean;
  gt(other: U256): boolean;
  ge(other: U256): boolean;
  static MAX(): U256;
  static zero(): U256;
  overflowingMul(other: U256): OverflowingResultU256;
  overflowingAdd(other: U256): OverflowingResultU256;
  overflowingSub(other: U256): OverflowingResultU256;
  overflowingPow(exp: number): OverflowingResultU256;
  static fromU512(value: U512): U256;
  toU512(): U512;
  readonly value: string;
}
export class U512 {
/**
** Return copy of self without private attributes.
*/
  toJSON(): Object;
/**
* Return stringified version of self.
*/
  toString(): string;
  free(): void;
  constructor(value: string);
  static fromNumber(value: number): U512;
  static fromHtmlInput(input: HTMLInputElement): U512;
  static fromBigInt(value: bigint): U512;
  toString(): string;
  toJson(): any;
  formatter(decimals: number): BalanceFormatter;
  mul(other: U512): U512;
  mulBigInt(other: bigint): U512;
  div(other: U512): U512;
  divBigInt(other: bigint): U512;
  add(other: U512): U512;
  addBigInt(other: bigint): U512;
  sub(other: U512): U512;
  subBigInt(other: bigint): U512;
  checkedMul(other: U512): U512 | undefined;
  checkedAdd(other: U512): U512 | undefined;
  checkedSub(other: U512): U512 | undefined;
  checkedDiv(other: U512): U512 | undefined;
  checkedRem(other: U512): U512 | undefined;
  checkedPow(exp: number): U512 | undefined;
  toBigInt(): bigint;
  lt(other: U512): boolean;
  le(other: U512): boolean;
  gt(other: U512): boolean;
  ge(other: U512): boolean;
  static MAX(): U512;
  static zero(): U512;
  overflowingMul(other: U512): OverflowingResultU512;
  overflowingAdd(other: U512): OverflowingResultU512;
  overflowingSub(other: U512): OverflowingResultU512;
  overflowingPow(exp: number): OverflowingResultU512;
  readonly value: string;
}
export class URef {
  free(): void;
  constructor(uref_hex_str: string, access_rights: number);
  static fromFormattedStr(formatted_str: string): URef;
  static fromUint8Array(bytes: Uint8Array, access_rights: number): URef;
  toFormattedString(): string;
  toJson(): any;
}
export class Unpaused {
  free(): void;
  constructor(account: Address);
  toJson(): any;
  account: Address;
}
export class Withdrawal {
  free(): void;
  constructor(account: Address, value: U256);
  toJson(): any;
  account: Address;
  value: U256;
}
export class WrappedNativeTokenWasmClient {
  free(): void;
  constructor(wasmClient: OdraWasmClient, address: Address);
  /**
   * Deposits native tokens into the contract.
   */
  deposit(attachedValue: U512): Promise<TransactionResult>;
  /**
   * Withdraws native tokens from the contract.
   */
  withdraw(amount: U256): Promise<TransactionResult>;
  /**
   * Withdraws native tokens from the contract to a specific recipient.
   */
  withdrawTo(recipient: Address, amount: U256): Promise<TransactionResult>;
  /**
   * Sets the allowance for `spender` to spend `amount` of the caller's tokens.
   */
  allowance(owner: Address, spender: Address): Promise<U256>;
  /**
   * Returns the balance of `address`.
   */
  balanceOf(address: Address): Promise<U256>;
  /**
   * Returns the total supply of the token.
   */
  totalSupply(): Promise<U256>;
  /**
   * Returns the number of decimals used by the token.
   */
  decimals(): Promise<number>;
  /**
   * Returns the symbol of the token.
   */
  symbol(): Promise<string>;
  /**
   * Returns the name of the token.
   */
  name(): Promise<string>;
  /**
   * Approves `spender` to spend `amount` of the caller's tokens.
   */
  approve(spender: Address, amount: U256): Promise<TransactionResult>;
  /**
   * Transfers `amount` of the owners tokens to `recipient` using allowance.
   */
  transferFrom(owner: Address, recipient: Address, amount: U256): Promise<TransactionResult>;
  /**
   * Transfers `amount` of the caller's tokens to `recipient`.
   */
  transfer(recipient: Address, amount: U256): Promise<TransactionResult>;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly positiontokenwasmclient_transfer: (a: number, b: number, c: number) => number;
  readonly positiontokenwasmclient_transferFrom: (a: number, b: number, c: number, d: number) => number;
  readonly positiontokenwasmclient_burn: (a: number, b: number, c: number) => number;
  readonly positiontokenwasmclient_mint: (a: number, b: number, c: number) => number;
  readonly positiontokenwasmclient_longOrShort: (a: number) => number;
  readonly positiontokenwasmclient_disablePeerTransfers: (a: number) => number;
  readonly positiontokenwasmclient_enablePeerTransfers: (a: number) => number;
  readonly positiontokenwasmclient_name: (a: number) => number;
  readonly positiontokenwasmclient_symbol: (a: number) => number;
  readonly positiontokenwasmclient_decimals: (a: number) => number;
  readonly positiontokenwasmclient_totalSupply: (a: number) => number;
  readonly positiontokenwasmclient_balanceOf: (a: number, b: number) => number;
  readonly positiontokenwasmclient_allowance: (a: number, b: number, c: number) => number;
  readonly positiontokenwasmclient_approve: (a: number, b: number, c: number) => number;
  readonly positiontokenwasmclient_decreaseAllowance: (a: number, b: number, c: number) => number;
  readonly positiontokenwasmclient_increaseAllowance: (a: number, b: number, c: number) => number;
  readonly positiontokenwasmclient_contractName: (a: number) => number;
  readonly positiontokenwasmclient_contractDescription: (a: number) => number;
  readonly positiontokenwasmclient_contractIconUri: (a: number) => number;
  readonly positiontokenwasmclient_contractProjectUri: (a: number) => number;
  readonly marketwasmclient_pause: (a: number) => number;
  readonly marketwasmclient_unpause: (a: number) => number;
  readonly marketwasmclient_isPaused: (a: number) => number;
  readonly marketwasmclient_updatePrice: (a: number) => number;
  readonly marketwasmclient_depositLong: (a: number, b: number) => number;
  readonly marketwasmclient_depositLongFrom: (a: number, b: number, c: number) => number;
  readonly marketwasmclient_depositShort: (a: number, b: number) => number;
  readonly marketwasmclient_depositShortFrom: (a: number, b: number, c: number) => number;
  readonly marketwasmclient_withdrawLong: (a: number, b: number) => number;
  readonly marketwasmclient_withdrawLongFrom: (a: number, b: number, c: number) => number;
  readonly marketwasmclient_withdrawShort: (a: number, b: number) => number;
  readonly marketwasmclient_withdrawShortFrom: (a: number, b: number, c: number) => number;
  readonly marketwasmclient_getMarketState: (a: number) => number;
  readonly marketwasmclient_setConfig: (a: number, b: number) => number;
  readonly marketwasmclient_getConfig: (a: number) => number;
  readonly marketwasmclient_setPriceFeed: (a: number, b: number, c: number, d: number) => number;
  readonly marketwasmclient_getAddressMarketState: (a: number, b: number) => number;
  readonly marketwasmclient_hasRole: (a: number, b: number, c: number, d: number) => number;
  readonly marketwasmclient_grantRole: (a: number, b: number, c: number, d: number) => number;
  readonly marketwasmclient_revokeRole: (a: number, b: number, c: number, d: number) => number;
  readonly marketwasmclient_getRoleAdmin: (a: number, b: number, c: number) => number;
  readonly marketwasmclient_renounceRole: (a: number, b: number, c: number, d: number) => number;
  readonly marketwasmclient_contractName: (a: number) => number;
  readonly marketwasmclient_contractDescription: (a: number) => number;
  readonly marketwasmclient_contractIconUri: (a: number) => number;
  readonly marketwasmclient_contractProjectUri: (a: number) => number;
  readonly __wbg_faucetablewcsprwasmclient_free: (a: number, b: number) => void;
  readonly faucetablewcsprwasmclient_new: (a: number, b: number) => number;
  readonly faucetablewcsprwasmclient_transfer: (a: number, b: number, c: number) => number;
  readonly faucetablewcsprwasmclient_transferFrom: (a: number, b: number, c: number, d: number) => number;
  readonly faucetablewcsprwasmclient_faucet: (a: number) => number;
  readonly faucetablewcsprwasmclient_participants: (a: number) => number;
  readonly faucetablewcsprwasmclient_addTransferManager: (a: number, b: number) => number;
  readonly faucetablewcsprwasmclient_removeTransferManager: (a: number, b: number) => number;
  readonly faucetablewcsprwasmclient_hasRole: (a: number, b: number, c: number, d: number) => number;
  readonly faucetablewcsprwasmclient_grantRole: (a: number, b: number, c: number, d: number) => number;
  readonly faucetablewcsprwasmclient_revokeRole: (a: number, b: number, c: number, d: number) => number;
  readonly faucetablewcsprwasmclient_getRoleAdmin: (a: number, b: number, c: number) => number;
  readonly faucetablewcsprwasmclient_renounceRole: (a: number, b: number, c: number, d: number) => number;
  readonly faucetablewcsprwasmclient_name: (a: number) => number;
  readonly faucetablewcsprwasmclient_symbol: (a: number) => number;
  readonly faucetablewcsprwasmclient_decimals: (a: number) => number;
  readonly faucetablewcsprwasmclient_totalSupply: (a: number) => number;
  readonly faucetablewcsprwasmclient_balanceOf: (a: number, b: number) => number;
  readonly faucetablewcsprwasmclient_allowance: (a: number, b: number, c: number) => number;
  readonly faucetablewcsprwasmclient_approve: (a: number, b: number, c: number) => number;
  readonly faucetablewcsprwasmclient_contractName: (a: number) => number;
  readonly faucetablewcsprwasmclient_contractDescription: (a: number) => number;
  readonly faucetablewcsprwasmclient_contractIconUri: (a: number) => number;
  readonly faucetablewcsprwasmclient_contractProjectUri: (a: number) => number;
  readonly wrappednativetokenwasmclient_deposit: (a: number, b: number) => number;
  readonly wrappednativetokenwasmclient_withdraw: (a: number, b: number) => number;
  readonly wrappednativetokenwasmclient_withdrawTo: (a: number, b: number, c: number) => number;
  readonly wrappednativetokenwasmclient_allowance: (a: number, b: number, c: number) => number;
  readonly wrappednativetokenwasmclient_balanceOf: (a: number, b: number) => number;
  readonly wrappednativetokenwasmclient_totalSupply: (a: number) => number;
  readonly wrappednativetokenwasmclient_decimals: (a: number) => number;
  readonly wrappednativetokenwasmclient_symbol: (a: number) => number;
  readonly wrappednativetokenwasmclient_name: (a: number) => number;
  readonly wrappednativetokenwasmclient_approve: (a: number, b: number, c: number) => number;
  readonly wrappednativetokenwasmclient_transferFrom: (a: number, b: number, c: number, d: number) => number;
  readonly wrappednativetokenwasmclient_transfer: (a: number, b: number, c: number) => number;
  readonly __wbg_get_rolegranted_role: (a: number, b: number) => void;
  readonly rolegranted_new: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly rolegranted_toJson: (a: number) => number;
  readonly rolegranted_set_address: (a: number, b: number) => void;
  readonly rolegranted_set_sender: (a: number, b: number) => void;
  readonly shortdeposited_toJson: (a: number) => number;
  readonly shortdeposited_set_user: (a: number, b: number) => void;
  readonly shortdeposited_set_wcspr_amount: (a: number, b: number) => void;
  readonly shortdeposited_set_short_tokens_minted: (a: number, b: number) => void;
  readonly shortdeposited_set_fee_collected: (a: number, b: number) => void;
  readonly __wbg_configupdated_free: (a: number, b: number) => void;
  readonly configupdated_new: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly configupdated_toJson: (a: number) => number;
  readonly configupdated_set_admin: (a: number, b: number) => void;
  readonly configupdated_admin: (a: number) => number;
  readonly configupdated_set_long_token: (a: number, b: number) => void;
  readonly configupdated_long_token: (a: number) => number;
  readonly configupdated_set_short_token: (a: number, b: number) => void;
  readonly configupdated_short_token: (a: number) => number;
  readonly configupdated_set_wcspr_token: (a: number, b: number) => void;
  readonly configupdated_wcspr_token: (a: number) => number;
  readonly configupdated_set_fee_collector: (a: number, b: number) => void;
  readonly configupdated_fee_collector: (a: number) => number;
  readonly unpaused_set_account: (a: number, b: number) => void;
  readonly deposit_toJson: (a: number) => number;
  readonly deposit_set_account: (a: number, b: number) => void;
  readonly deposit_set_value: (a: number, b: number) => void;
  readonly increaseallowance_toJson: (a: number) => number;
  readonly increaseallowance_set_owner: (a: number, b: number) => void;
  readonly increaseallowance_set_spender: (a: number, b: number) => void;
  readonly increaseallowance_set_allowance: (a: number, b: number) => void;
  readonly increaseallowance_set_inc_by: (a: number, b: number) => void;
  readonly __wbg_burn_free: (a: number, b: number) => void;
  readonly burn_new: (a: number, b: number, c: number) => void;
  readonly burn_toJson: (a: number) => number;
  readonly burn_set_owner: (a: number, b: number) => void;
  readonly burn_owner: (a: number) => number;
  readonly burn_set_amount: (a: number, b: number) => void;
  readonly burn_amount: (a: number) => number;
  readonly __wbg_get_rolerevoked_role: (a: number, b: number) => void;
  readonly rolerevoked_set_address: (a: number, b: number) => void;
  readonly rolerevoked_set_sender: (a: number, b: number) => void;
  readonly __wbg_decreaseallowance_free: (a: number, b: number) => void;
  readonly decreaseallowance_new: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly decreaseallowance_toJson: (a: number) => number;
  readonly decreaseallowance_set_owner: (a: number, b: number) => void;
  readonly decreaseallowance_owner: (a: number) => number;
  readonly decreaseallowance_set_spender: (a: number, b: number) => void;
  readonly decreaseallowance_spender: (a: number) => number;
  readonly decreaseallowance_set_allowance: (a: number, b: number) => void;
  readonly decreaseallowance_allowance: (a: number) => number;
  readonly decreaseallowance_set_decr_by: (a: number, b: number) => void;
  readonly decreaseallowance_decr_by: (a: number) => number;
  readonly __wbg_config_free: (a: number, b: number) => void;
  readonly config_new: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly config_toJson: (a: number) => number;
  readonly config_set_long_token: (a: number, b: number) => void;
  readonly config_long_token: (a: number) => number;
  readonly config_set_short_token: (a: number, b: number) => void;
  readonly config_short_token: (a: number) => number;
  readonly config_set_wcspr_token: (a: number, b: number) => void;
  readonly config_wcspr_token: (a: number) => number;
  readonly config_set_fee_collector: (a: number, b: number) => void;
  readonly config_fee_collector: (a: number) => number;
  readonly __wbg_setallowance_free: (a: number, b: number) => void;
  readonly setallowance_new: (a: number, b: number, c: number, d: number) => void;
  readonly setallowance_toJson: (a: number) => number;
  readonly setallowance_set_owner: (a: number, b: number) => void;
  readonly setallowance_owner: (a: number) => number;
  readonly setallowance_set_spender: (a: number, b: number) => void;
  readonly setallowance_spender: (a: number) => number;
  readonly setallowance_set_allowance: (a: number, b: number) => void;
  readonly setallowance_allowance: (a: number) => number;
  readonly longdeposited_new: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly longdeposited_toJson: (a: number) => number;
  readonly longdeposited_set_user: (a: number, b: number) => void;
  readonly longdeposited_user: (a: number) => number;
  readonly longdeposited_set_wcspr_amount: (a: number, b: number) => void;
  readonly longdeposited_set_long_tokens_minted: (a: number, b: number) => void;
  readonly longdeposited_set_fee_collected: (a: number, b: number) => void;
  readonly longdeposited_fee_collected: (a: number) => number;
  readonly withdrawal_set_account: (a: number, b: number) => void;
  readonly withdrawal_set_value: (a: number, b: number) => void;
  readonly feecollected_new: (a: number, b: number, c: number) => void;
  readonly feecollected_toJson: (a: number) => number;
  readonly feecollected_set_amount: (a: number, b: number) => void;
  readonly feecollected_set_fee_collector: (a: number, b: number) => void;
  readonly __wbg_addressmarketstate_free: (a: number, b: number) => void;
  readonly __wbg_get_addressmarketstate_marketState: (a: number) => number;
  readonly __wbg_set_addressmarketstate_marketState: (a: number, b: number) => void;
  readonly __wbg_get_addressmarketstate_isPaused: (a: number) => number;
  readonly __wbg_set_addressmarketstate_isPaused: (a: number, b: number) => void;
  readonly __wbg_get_addressmarketstate_config: (a: number) => number;
  readonly __wbg_set_addressmarketstate_config: (a: number, b: number) => void;
  readonly addressmarketstate_new: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number) => void;
  readonly addressmarketstate_toJson: (a: number) => number;
  readonly addressmarketstate_set_fee: (a: number, b: number) => void;
  readonly addressmarketstate_fee: (a: number) => number;
  readonly addressmarketstate_set_wcspr_balance: (a: number, b: number) => void;
  readonly addressmarketstate_wcspr_balance: (a: number) => number;
  readonly addressmarketstate_set_long_token_balance: (a: number, b: number) => void;
  readonly addressmarketstate_long_token_balance: (a: number) => number;
  readonly addressmarketstate_set_short_token_balance: (a: number, b: number) => void;
  readonly addressmarketstate_short_token_balance: (a: number) => number;
  readonly addressmarketstate_set_market_allowance: (a: number, b: number) => void;
  readonly addressmarketstate_market_allowance: (a: number) => number;
  readonly addressmarketstate_set_long_position_value: (a: number, b: number) => void;
  readonly addressmarketstate_long_position_value: (a: number) => number;
  readonly addressmarketstate_set_short_position_value: (a: number, b: number) => void;
  readonly addressmarketstate_short_position_value: (a: number) => number;
  readonly addressmarketstate_set_total_position_value: (a: number, b: number) => void;
  readonly addressmarketstate_total_position_value: (a: number) => number;
  readonly addressmarketstate_set_long_share_percentage: (a: number, b: number) => void;
  readonly addressmarketstate_long_share_percentage: (a: number) => number;
  readonly addressmarketstate_set_short_share_percentage: (a: number, b: number) => void;
  readonly addressmarketstate_short_share_percentage: (a: number) => number;
  readonly __wbg_paused_free: (a: number, b: number) => void;
  readonly paused_new: (a: number, b: number) => void;
  readonly paused_toJson: (a: number) => number;
  readonly paused_set_account: (a: number, b: number) => void;
  readonly paused_account: (a: number) => number;
  readonly __wbg_get_priceupdated_timestamp: (a: number) => bigint;
  readonly __wbg_set_priceupdated_timestamp: (a: number, b: bigint) => void;
  readonly priceupdated_new: (a: number, b: number, c: number, d: bigint) => void;
  readonly priceupdated_toJson: (a: number) => number;
  readonly priceupdated_set_new_price: (a: number, b: number) => void;
  readonly priceupdated_set_previous_price: (a: number, b: number) => void;
  readonly priceupdated_previous_price: (a: number) => number;
  readonly __wbg_marketstate_free: (a: number, b: number) => void;
  readonly marketstate_new: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly marketstate_toJson: (a: number) => number;
  readonly marketstate_set_long_total_supply: (a: number, b: number) => void;
  readonly marketstate_long_total_supply: (a: number) => number;
  readonly marketstate_set_short_total_supply: (a: number, b: number) => void;
  readonly marketstate_short_total_supply: (a: number) => number;
  readonly marketstate_set_long_liquidity: (a: number, b: number) => void;
  readonly marketstate_long_liquidity: (a: number) => number;
  readonly marketstate_set_short_liquidity: (a: number, b: number) => void;
  readonly marketstate_short_liquidity: (a: number) => number;
  readonly marketstate_set_price: (a: number, b: number) => void;
  readonly marketstate_price: (a: number) => number;
  readonly shortwithdrawn_toJson: (a: number) => number;
  readonly shortwithdrawn_set_user: (a: number, b: number) => void;
  readonly shortwithdrawn_set_short_tokens_burned: (a: number, b: number) => void;
  readonly shortwithdrawn_set_wcspr_amount: (a: number, b: number) => void;
  readonly shortwithdrawn_set_fee_collected: (a: number, b: number) => void;
  readonly longwithdrawn_toJson: (a: number) => number;
  readonly longwithdrawn_set_user: (a: number, b: number) => void;
  readonly longwithdrawn_set_long_tokens_burned: (a: number, b: number) => void;
  readonly longwithdrawn_set_wcspr_amount: (a: number, b: number) => void;
  readonly longwithdrawn_set_fee_collected: (a: number, b: number) => void;
  readonly __wbg_roleadminchanged_free: (a: number, b: number) => void;
  readonly __wbg_get_roleadminchanged_role: (a: number, b: number) => void;
  readonly __wbg_get_roleadminchanged_previousAdminRole: (a: number, b: number) => void;
  readonly __wbg_set_roleadminchanged_previousAdminRole: (a: number, b: number, c: number) => void;
  readonly __wbg_get_roleadminchanged_newAdminRole: (a: number, b: number) => void;
  readonly __wbg_set_roleadminchanged_newAdminRole: (a: number, b: number, c: number) => void;
  readonly roleadminchanged_new: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
  readonly roleadminchanged_toJson: (a: number) => number;
  readonly transfer_toJson: (a: number) => number;
  readonly transfer_set_sender: (a: number, b: number) => void;
  readonly transfer_set_recipient: (a: number, b: number) => void;
  readonly transfer_set_amount: (a: number, b: number) => void;
  readonly __wbg_pricefeedupdated_free: (a: number, b: number) => void;
  readonly __wbg_get_pricefeedupdated_priceFeedId: (a: number, b: number) => void;
  readonly __wbg_set_pricefeedupdated_priceFeedId: (a: number, b: number, c: number) => void;
  readonly pricefeedupdated_new: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly pricefeedupdated_toJson: (a: number) => number;
  readonly pricefeedupdated_set_admin: (a: number, b: number) => void;
  readonly pricefeedupdated_admin: (a: number) => number;
  readonly pricefeedupdated_set_price_feed_address: (a: number, b: number) => void;
  readonly pricefeedupdated_price_feed_address: (a: number) => number;
  readonly mint_toJson: (a: number) => number;
  readonly mint_set_recipient: (a: number, b: number) => void;
  readonly mint_set_amount: (a: number, b: number) => void;
  readonly transferfrom_new: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly transferfrom_toJson: (a: number) => number;
  readonly transferfrom_set_spender: (a: number, b: number) => void;
  readonly transferfrom_spender: (a: number) => number;
  readonly transferfrom_set_owner: (a: number, b: number) => void;
  readonly transferfrom_owner: (a: number) => number;
  readonly transferfrom_set_recipient: (a: number, b: number) => void;
  readonly transferfrom_recipient: (a: number) => number;
  readonly transferfrom_set_amount: (a: number, b: number) => void;
  readonly __wbg_set_rolerevoked_role: (a: number, b: number, c: number) => void;
  readonly __wbg_set_rolegranted_role: (a: number, b: number, c: number) => void;
  readonly __wbg_set_roleadminchanged_role: (a: number, b: number, c: number) => void;
  readonly rolerevoked_new: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly unpaused_new: (a: number, b: number) => void;
  readonly positiontokenwasmclient_new: (a: number, b: number) => number;
  readonly mint_new: (a: number, b: number, c: number) => void;
  readonly deposit_new: (a: number, b: number, c: number) => void;
  readonly longwithdrawn_new: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly withdrawal_new: (a: number, b: number, c: number) => void;
  readonly transfer_new: (a: number, b: number, c: number, d: number) => void;
  readonly shortdeposited_new: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly wrappednativetokenwasmclient_new: (a: number, b: number) => number;
  readonly shortwithdrawn_new: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly marketwasmclient_new: (a: number, b: number) => number;
  readonly increaseallowance_new: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly __wbg_transferfrom_free: (a: number, b: number) => void;
  readonly __wbg_rolegranted_free: (a: number, b: number) => void;
  readonly __wbg_withdrawal_free: (a: number, b: number) => void;
  readonly __wbg_positiontokenwasmclient_free: (a: number, b: number) => void;
  readonly __wbg_increaseallowance_free: (a: number, b: number) => void;
  readonly __wbg_marketwasmclient_free: (a: number, b: number) => void;
  readonly __wbg_longwithdrawn_free: (a: number, b: number) => void;
  readonly __wbg_transfer_free: (a: number, b: number) => void;
  readonly __wbg_unpaused_free: (a: number, b: number) => void;
  readonly __wbg_rolerevoked_free: (a: number, b: number) => void;
  readonly __wbg_deposit_free: (a: number, b: number) => void;
  readonly __wbg_priceupdated_free: (a: number, b: number) => void;
  readonly __wbg_longdeposited_free: (a: number, b: number) => void;
  readonly __wbg_shortdeposited_free: (a: number, b: number) => void;
  readonly __wbg_wrappednativetokenwasmclient_free: (a: number, b: number) => void;
  readonly __wbg_shortwithdrawn_free: (a: number, b: number) => void;
  readonly __wbg_feecollected_free: (a: number, b: number) => void;
  readonly __wbg_mint_free: (a: number, b: number) => void;
  readonly transferfrom_amount: (a: number) => number;
  readonly rolegranted_sender: (a: number) => number;
  readonly rolegranted_address: (a: number) => number;
  readonly withdrawal_value: (a: number) => number;
  readonly withdrawal_account: (a: number) => number;
  readonly withdrawal_toJson: (a: number) => number;
  readonly increaseallowance_inc_by: (a: number) => number;
  readonly increaseallowance_allowance: (a: number) => number;
  readonly increaseallowance_spender: (a: number) => number;
  readonly increaseallowance_owner: (a: number) => number;
  readonly longwithdrawn_wcspr_amount: (a: number) => number;
  readonly longwithdrawn_long_tokens_burned: (a: number) => number;
  readonly transfer_amount: (a: number) => number;
  readonly transfer_recipient: (a: number) => number;
  readonly transfer_sender: (a: number) => number;
  readonly unpaused_account: (a: number) => number;
  readonly unpaused_toJson: (a: number) => number;
  readonly rolerevoked_sender: (a: number) => number;
  readonly rolerevoked_address: (a: number) => number;
  readonly rolerevoked_toJson: (a: number) => number;
  readonly deposit_value: (a: number) => number;
  readonly deposit_account: (a: number) => number;
  readonly priceupdated_new_price: (a: number) => number;
  readonly longwithdrawn_fee_collected: (a: number) => number;
  readonly longdeposited_long_tokens_minted: (a: number) => number;
  readonly longdeposited_wcspr_amount: (a: number) => number;
  readonly longwithdrawn_user: (a: number) => number;
  readonly shortdeposited_fee_collected: (a: number) => number;
  readonly shortdeposited_short_tokens_minted: (a: number) => number;
  readonly shortdeposited_wcspr_amount: (a: number) => number;
  readonly shortdeposited_user: (a: number) => number;
  readonly shortwithdrawn_fee_collected: (a: number) => number;
  readonly shortwithdrawn_wcspr_amount: (a: number) => number;
  readonly shortwithdrawn_short_tokens_burned: (a: number) => number;
  readonly shortwithdrawn_user: (a: number) => number;
  readonly feecollected_fee_collector: (a: number) => number;
  readonly feecollected_amount: (a: number) => number;
  readonly mint_amount: (a: number) => number;
  readonly mint_recipient: (a: number) => number;
  readonly gas: () => bigint;
  readonly setGas: (a: bigint) => void;
  readonly DEFAULT_PAYMENT_AMOUNT: () => bigint;
  readonly __wbg_odrawasmclient_free: (a: number, b: number) => void;
  readonly odrawasmclient_new: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => number;
  readonly odrawasmclient_getBalance: (a: number, b: number) => number;
  readonly odrawasmclient_caller: (a: number) => number;
  readonly odrawasmclient_transfer: (a: number, b: number, c: number) => number;
  readonly odrawasmclient_connect: (a: number, b: number, c: number) => number;
  readonly odrawasmclient_signIn: (a: number) => number;
  readonly odrawasmclient_signOut: (a: number) => number;
  readonly odrawasmclient_disconnect: (a: number) => number;
  readonly odrawasmclient_signInWithAccount: (a: number, b: number) => number;
  readonly odrawasmclient_isUnlocked: (a: number, b: number, c: number) => number;
  readonly odrawasmclient_getActivePublicKey: (a: number) => number;
  readonly odrawasmclient_getActiveAccount: (a: number) => number;
  readonly odrawasmclient_switchAccount: (a: number) => number;
  readonly odrawasmclient_signMessage: (a: number, b: number, c: number) => number;
  readonly __wbg_contracts_free: (a: number, b: number) => void;
  readonly contracts_new: (a: number, b: number) => void;
  readonly contracts_fromPath: (a: number, b: number) => number;
  readonly contracts_get: (a: number, b: number, c: number, d: number) => void;
  readonly __wbg_contractinfo_free: (a: number, b: number) => void;
  readonly __wbg_get_contractinfo_name: (a: number, b: number) => void;
  readonly __wbg_set_contractinfo_name: (a: number, b: number, c: number) => void;
  readonly __wbg_get_contractinfo_package_hash: (a: number, b: number) => void;
  readonly __wbg_set_contractinfo_package_hash: (a: number, b: number, c: number) => void;
  readonly contractinfo_address: (a: number, b: number) => void;
  readonly __wbg_csprclickcallbacks_free: (a: number, b: number) => void;
  readonly csprclickcallbacks_onSignedIn: (a: number) => void;
  readonly csprclickcallbacks_onSwitchedAccount: (a: number) => void;
  readonly csprclickcallbacks_onUnsolicitedAccountChange: (a: number) => void;
  readonly csprclickcallbacks_onSignedOut: (a: number) => void;
  readonly csprclickcallbacks_onDisconnected: (a: number) => void;
  readonly csprclickcallbacks_onTransactionStatusUpdate: (a: number) => void;
  readonly __wbg_signresult_free: (a: number, b: number) => void;
  readonly __wbg_get_signresult_isCancelled: (a: number) => number;
  readonly __wbg_get_signresult_signatureHex: (a: number, b: number) => void;
  readonly __wbg_get_signresult_signature: (a: number, b: number) => void;
  readonly __wbg_get_signresult_error: (a: number, b: number) => void;
  readonly signresult_transaction: (a: number) => number;
  readonly __wbg_accountinfo_free: (a: number, b: number) => void;
  readonly __wbg_get_accountinfo_provider: (a: number, b: number) => void;
  readonly __wbg_get_accountinfo_providerSupports: (a: number, b: number) => void;
  readonly __wbg_get_accountinfo_csprName: (a: number, b: number) => void;
  readonly __wbg_get_accountinfo_publicKey: (a: number, b: number) => void;
  readonly __wbg_get_accountinfo_connectedAt: (a: number) => bigint;
  readonly __wbg_get_accountinfo_logo: (a: number, b: number) => void;
  readonly accountinfo_address: (a: number, b: number) => void;
  readonly accountinfo_balance: (a: number) => number;
  readonly accountinfo_liquidBalance: (a: number) => number;
  readonly __wbg_transactionresult_free: (a: number, b: number) => void;
  readonly __wbg_get_transactionresult_status: (a: number) => number;
  readonly __wbg_get_transactionresult_isCancelled: (a: number) => number;
  readonly __wbg_get_transactionresult_error: (a: number, b: number) => void;
  readonly __wbg_get_transactionresult_errorCode: (a: number) => number;
  readonly __wbg_get_transactionresult_data: (a: number) => number;
  readonly transactionresult_txHash: (a: number, b: number) => void;
  readonly __wbg_transactiondata_free: (a: number, b: number) => void;
  readonly __wbg_get_transactiondata_blockHash: (a: number, b: number) => void;
  readonly __wbg_get_transactiondata_blockHeight: (a: number) => bigint;
  readonly __wbg_get_transactiondata_callerHash: (a: number, b: number) => void;
  readonly __wbg_get_transactiondata_callerPublicKey: (a: number, b: number) => void;
  readonly __wbg_get_transactiondata_consumedGas: (a: number, b: number) => void;
  readonly __wbg_get_transactiondata_contractHash: (a: number, b: number) => void;
  readonly __wbg_get_transactiondata_contractPackageHash: (a: number, b: number) => void;
  readonly __wbg_get_transactiondata_cost: (a: number, b: number) => void;
  readonly __wbg_get_transactiondata_transactionHash: (a: number, b: number) => void;
  readonly __wbg_get_transactiondata_entryPointId: (a: number) => bigint;
  readonly __wbg_get_transactiondata_errorMessage: (a: number, b: number) => void;
  readonly __wbg_get_transactiondata_executionTypeId: (a: number) => bigint;
  readonly __wbg_get_transactiondata_gasPriceLimit: (a: number) => bigint;
  readonly __wbg_get_transactiondata_isStandardPayment: (a: number) => number;
  readonly __wbg_get_transactiondata_paymentAmount: (a: number, b: number) => void;
  readonly __wbg_get_transactiondata_pricingModeId: (a: number) => bigint;
  readonly __wbg_get_transactiondata_refundAmount: (a: number, b: number) => void;
  readonly __wbg_get_transactiondata_runtimeTypeId: (a: number) => bigint;
  readonly __wbg_get_transactiondata_status: (a: number) => number;
  readonly __wbg_get_transactiondata_timestamp: (a: number, b: number) => void;
  readonly __wbg_get_transactiondata_versionId: (a: number) => bigint;
  readonly transactiondata_args: (a: number) => number;
  readonly getCurrentAccount: (a: number) => void;
  readonly __wbg_address_free: (a: number, b: number) => void;
  readonly address_new: (a: number, b: number, c: number) => void;
  readonly address_fromHtmlInput: (a: number, b: number) => void;
  readonly address_fromPublicKey: (a: number, b: number, c: number) => void;
  readonly address_value: (a: number, b: number) => void;
  readonly __wbg_u128_free: (a: number, b: number) => void;
  readonly u128_from_dec_str: (a: number, b: number, c: number) => void;
  readonly u128_fromNumber: (a: number) => number;
  readonly u128_fromHtmlInput: (a: number, b: number) => void;
  readonly u128_fromBigInt: (a: number, b: number) => void;
  readonly u128_toString: (a: number, b: number) => void;
  readonly u128_toJson: (a: number) => number;
  readonly u128_formatter: (a: number, b: number) => number;
  readonly u128_mul: (a: number, b: number) => number;
  readonly u128_mulBigInt: (a: number, b: number, c: number) => void;
  readonly u128_div: (a: number, b: number) => number;
  readonly u128_divBigInt: (a: number, b: number, c: number) => void;
  readonly u128_add: (a: number, b: number) => number;
  readonly u128_addBigInt: (a: number, b: number, c: number) => void;
  readonly u128_sub: (a: number, b: number) => number;
  readonly u128_subBigInt: (a: number, b: number, c: number) => void;
  readonly u128_checkedMul: (a: number, b: number) => number;
  readonly u128_checkedAdd: (a: number, b: number) => number;
  readonly u128_checkedSub: (a: number, b: number) => number;
  readonly u128_checkedDiv: (a: number, b: number) => number;
  readonly u128_checkedRem: (a: number, b: number) => number;
  readonly u128_checkedPow: (a: number, b: number) => number;
  readonly u128_toBigInt: (a: number) => number;
  readonly u128_lt: (a: number, b: number) => number;
  readonly u128_le: (a: number, b: number) => number;
  readonly u128_gt: (a: number, b: number) => number;
  readonly u128_ge: (a: number, b: number) => number;
  readonly u128_value: (a: number, b: number) => void;
  readonly u128_MAX: () => number;
  readonly u128_zero: () => number;
  readonly __wbg_u256_free: (a: number, b: number) => void;
  readonly u256_from_dec_str: (a: number, b: number, c: number) => void;
  readonly u256_fromNumber: (a: number) => number;
  readonly u256_fromHtmlInput: (a: number, b: number) => void;
  readonly u256_fromBigInt: (a: number, b: number) => void;
  readonly u256_toString: (a: number, b: number) => void;
  readonly u256_toJson: (a: number) => number;
  readonly u256_formatter: (a: number, b: number) => number;
  readonly u256_mul: (a: number, b: number) => number;
  readonly u256_mulBigInt: (a: number, b: number, c: number) => void;
  readonly u256_div: (a: number, b: number) => number;
  readonly u256_divBigInt: (a: number, b: number, c: number) => void;
  readonly u256_add: (a: number, b: number) => number;
  readonly u256_addBigInt: (a: number, b: number, c: number) => void;
  readonly u256_sub: (a: number, b: number) => number;
  readonly u256_subBigInt: (a: number, b: number, c: number) => void;
  readonly u256_checkedMul: (a: number, b: number) => number;
  readonly u256_checkedAdd: (a: number, b: number) => number;
  readonly u256_checkedSub: (a: number, b: number) => number;
  readonly u256_checkedDiv: (a: number, b: number) => number;
  readonly u256_checkedRem: (a: number, b: number) => number;
  readonly u256_checkedPow: (a: number, b: number) => number;
  readonly u256_toBigInt: (a: number) => number;
  readonly u256_lt: (a: number, b: number) => number;
  readonly u256_le: (a: number, b: number) => number;
  readonly u256_gt: (a: number, b: number) => number;
  readonly u256_ge: (a: number, b: number) => number;
  readonly u256_value: (a: number, b: number) => void;
  readonly u256_MAX: () => number;
  readonly u256_zero: () => number;
  readonly __wbg_u512_free: (a: number, b: number) => void;
  readonly u512_from_dec_str: (a: number, b: number, c: number) => void;
  readonly u512_fromNumber: (a: number) => number;
  readonly u512_fromHtmlInput: (a: number, b: number) => void;
  readonly u512_fromBigInt: (a: number, b: number) => void;
  readonly u512_toString: (a: number, b: number) => void;
  readonly u512_toJson: (a: number) => number;
  readonly u512_formatter: (a: number, b: number) => number;
  readonly u512_mul: (a: number, b: number) => number;
  readonly u512_mulBigInt: (a: number, b: number, c: number) => void;
  readonly u512_div: (a: number, b: number) => number;
  readonly u512_divBigInt: (a: number, b: number, c: number) => void;
  readonly u512_add: (a: number, b: number) => number;
  readonly u512_addBigInt: (a: number, b: number, c: number) => void;
  readonly u512_sub: (a: number, b: number) => number;
  readonly u512_subBigInt: (a: number, b: number, c: number) => void;
  readonly u512_checkedMul: (a: number, b: number) => number;
  readonly u512_checkedAdd: (a: number, b: number) => number;
  readonly u512_checkedSub: (a: number, b: number) => number;
  readonly u512_checkedDiv: (a: number, b: number) => number;
  readonly u512_checkedRem: (a: number, b: number) => number;
  readonly u512_checkedPow: (a: number, b: number) => number;
  readonly u512_toBigInt: (a: number) => number;
  readonly u512_lt: (a: number, b: number) => number;
  readonly u512_le: (a: number, b: number) => number;
  readonly u512_gt: (a: number, b: number) => number;
  readonly u512_ge: (a: number, b: number) => number;
  readonly u512_value: (a: number, b: number) => void;
  readonly u512_MAX: () => number;
  readonly u512_zero: () => number;
  readonly __wbg_overflowingresultu128_free: (a: number, b: number) => void;
  readonly __wbg_get_overflowingresultu128_result: (a: number) => number;
  readonly __wbg_get_overflowingresultu128_overflow: (a: number) => number;
  readonly __wbg_overflowingresultu256_free: (a: number, b: number) => void;
  readonly __wbg_get_overflowingresultu256_result: (a: number) => number;
  readonly __wbg_get_overflowingresultu256_overflow: (a: number) => number;
  readonly __wbg_overflowingresultu512_free: (a: number, b: number) => void;
  readonly __wbg_get_overflowingresultu512_result: (a: number) => number;
  readonly __wbg_get_overflowingresultu512_overflow: (a: number) => number;
  readonly u128_overflowingMul: (a: number, b: number) => number;
  readonly u128_overflowingAdd: (a: number, b: number) => number;
  readonly u128_overflowingSub: (a: number, b: number) => number;
  readonly u128_overflowingPow: (a: number, b: number) => number;
  readonly u128_fromU512: (a: number, b: number) => void;
  readonly u128_toU512: (a: number) => number;
  readonly u128_fromU256: (a: number, b: number) => void;
  readonly u128_toU256: (a: number) => number;
  readonly u256_overflowingMul: (a: number, b: number) => number;
  readonly u256_overflowingAdd: (a: number, b: number) => number;
  readonly u256_overflowingSub: (a: number, b: number) => number;
  readonly u256_overflowingPow: (a: number, b: number) => number;
  readonly u256_fromU512: (a: number, b: number) => void;
  readonly u256_toU512: (a: number) => number;
  readonly u512_overflowingMul: (a: number, b: number) => number;
  readonly u512_overflowingAdd: (a: number, b: number) => number;
  readonly u512_overflowingSub: (a: number, b: number) => number;
  readonly u512_overflowingPow: (a: number, b: number) => number;
  readonly __wbg_bytes_free: (a: number, b: number) => void;
  readonly bytes_new: () => number;
  readonly bytes_fromUint8Array: (a: number) => number;
  readonly bytes_toString: (a: number, b: number) => void;
  readonly __wbg_publickey_free: (a: number, b: number) => void;
  readonly publickey_new_js_alias: (a: number, b: number, c: number) => void;
  readonly publickey_fromUint8Array: (a: number, b: number, c: number) => void;
  readonly publickey_toJson: (a: number, b: number) => void;
  readonly uref_new_js_alias: (a: number, b: number, c: number, d: number) => void;
  readonly uref_fromFormattedStr: (a: number, b: number, c: number) => void;
  readonly uref_fromUint8Array: (a: number, b: number, c: number, d: number) => void;
  readonly uref_toFormattedString: (a: number, b: number) => void;
  readonly uref_toJson: (a: number) => number;
  readonly __wbg_balanceformatter_free: (a: number, b: number) => void;
  readonly balanceformatter_fmt: (a: number, b: number) => void;
  readonly balanceformatter_fmtWithPrecision: (a: number, b: number, c: number) => void;
  readonly run: () => void;
  readonly bytes_value: (a: number, b: number) => void;
  readonly __wbg_uref_free: (a: number, b: number) => void;
  readonly __wbindgen_export_0: (a: number) => void;
  readonly __wbindgen_export_1: (a: number, b: number) => number;
  readonly __wbindgen_export_2: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_3: WebAssembly.Table;
  readonly __wbindgen_export_4: (a: number, b: number, c: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_export_5: (a: number, b: number, c: number, d: number) => void;
  readonly __wbindgen_export_6: (a: number, b: number) => void;
  readonly __wbindgen_export_7: (a: number, b: number) => void;
  readonly __wbindgen_export_8: (a: number, b: number, c: number) => void;
  readonly __wbindgen_export_9: (a: number, b: number, c: number, d: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
