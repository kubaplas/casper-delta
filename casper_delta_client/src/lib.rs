#![allow(unused_imports)]
use odra_wasm_client::wasm_bindgen;
use odra_wasm_client::wasm_bindgen_futures;
use odra_wasm_client::JsValueSerdeExt;
use wasm_bindgen::prelude::*;
#[wasm_bindgen]
pub struct PositionTokenWasmClient {
    wasm_client: odra_wasm_client::OdraWasmClient,
    address: odra_wasm_client::types::Address,
}
#[wasm_bindgen]
impl PositionTokenWasmClient {
    #[wasm_bindgen(constructor)]
    pub fn new(
        #[wasm_bindgen(js_name = "wasmClient")] wasm_client: &odra_wasm_client::OdraWasmClient,
        address: odra_wasm_client::types::Address,
    ) -> Self {
        PositionTokenWasmClient {
            wasm_client: wasm_client.clone(),
            address,
        }
    }
    #[doc = ""]
    #[wasm_bindgen(js_name = "transfer")]
    pub async fn transfer(
        &self,
        #[wasm_bindgen(js_name = "recipient")] recipient: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "amount")] amount: odra_wasm_client::types::U256,
    ) -> Result<odra_wasm_client::cspr_click::TransactionResult, JsError> {
        self . wasm_client . call_entry_point (* self . address , "transfer" , odra_wasm_client :: casper_types :: runtime_args ! { "recipient" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: OdraAddress > :: into_odra_value (recipient) ? , "amount" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: casper_types :: U256 > :: into_odra_value (amount) ? }) . await
    }
    #[doc = ""]
    #[wasm_bindgen(js_name = "transferFrom")]
    pub async fn transfer_from(
        &self,
        #[wasm_bindgen(js_name = "owner")] owner: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "recipient")] recipient: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "amount")] amount: odra_wasm_client::types::U256,
    ) -> Result<odra_wasm_client::cspr_click::TransactionResult, JsError> {
        self . wasm_client . call_entry_point (* self . address , "transfer_from" , odra_wasm_client :: casper_types :: runtime_args ! { "owner" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: OdraAddress > :: into_odra_value (owner) ? , "recipient" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: OdraAddress > :: into_odra_value (recipient) ? , "amount" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: casper_types :: U256 > :: into_odra_value (amount) ? }) . await
    }
    #[doc = "Burns the given amount of tokens from the given address."]
    #[wasm_bindgen(js_name = "burn")]
    pub async fn burn(
        &self,
        #[wasm_bindgen(js_name = "owner")] owner: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "amount")] amount: odra_wasm_client::types::U256,
    ) -> Result<odra_wasm_client::cspr_click::TransactionResult, JsError> {
        self . wasm_client . call_entry_point (* self . address , "burn" , odra_wasm_client :: casper_types :: runtime_args ! { "owner" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: OdraAddress > :: into_odra_value (owner) ? , "amount" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: casper_types :: U256 > :: into_odra_value (amount) ? }) . await
    }
    #[doc = ""]
    #[wasm_bindgen(js_name = "mint")]
    pub async fn mint(
        &self,
        #[wasm_bindgen(js_name = "to")] to: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "amount")] amount: odra_wasm_client::types::U256,
    ) -> Result<odra_wasm_client::cspr_click::TransactionResult, JsError> {
        self . wasm_client . call_entry_point (* self . address , "mint" , odra_wasm_client :: casper_types :: runtime_args ! { "to" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: OdraAddress > :: into_odra_value (to) ? , "amount" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: casper_types :: U256 > :: into_odra_value (amount) ? }) . await
    }
    #[doc = ""]
    #[wasm_bindgen(js_name = "longOrShort")]
    pub async fn long_or_short(&self) -> Result<LongOrShort, JsError> {
        self.wasm_client
            .call_entry_point_with_proxy::<LongOrShort, LongOrShort>(
                *self.address,
                "long_or_short",
                odra_wasm_client::casper_types::runtime_args! {},
            )
            .await
    }
    #[doc = ""]
    #[wasm_bindgen(js_name = "disablePeerTransfers")]
    pub async fn disable_peer_transfers(
        &self,
    ) -> Result<odra_wasm_client::cspr_click::TransactionResult, JsError> {
        self.wasm_client
            .call_entry_point(
                *self.address,
                "disable_peer_transfers",
                odra_wasm_client::casper_types::runtime_args! {},
            )
            .await
    }
    #[doc = ""]
    #[wasm_bindgen(js_name = "enablePeerTransfers")]
    pub async fn enable_peer_transfers(
        &self,
    ) -> Result<odra_wasm_client::cspr_click::TransactionResult, JsError> {
        self.wasm_client
            .call_entry_point(
                *self.address,
                "enable_peer_transfers",
                odra_wasm_client::casper_types::runtime_args! {},
            )
            .await
    }
    #[doc = "Returns the name of the token."]
    #[wasm_bindgen(js_name = "name")]
    pub async fn name(&self) -> Result<String, JsError> {
        self.wasm_client
            .call_entry_point_with_proxy::<String, String>(
                *self.address,
                "name",
                odra_wasm_client::casper_types::runtime_args! {},
            )
            .await
    }
    #[doc = "Returns the symbol of the token."]
    #[wasm_bindgen(js_name = "symbol")]
    pub async fn symbol(&self) -> Result<String, JsError> {
        self.wasm_client
            .call_entry_point_with_proxy::<String, String>(
                *self.address,
                "symbol",
                odra_wasm_client::casper_types::runtime_args! {},
            )
            .await
    }
    #[doc = "Returns the number of decimals the token uses."]
    #[wasm_bindgen(js_name = "decimals")]
    pub async fn decimals(&self) -> Result<u8, JsError> {
        self.wasm_client
            .call_entry_point_with_proxy::<u8, u8>(
                *self.address,
                "decimals",
                odra_wasm_client::casper_types::runtime_args! {},
            )
            .await
    }
    #[doc = "Returns the total supply of the token."]
    #[wasm_bindgen(js_name = "totalSupply")]
    pub async fn total_supply(&self) -> Result<odra_wasm_client::types::U256, JsError> {
        self . wasm_client . call_entry_point_with_proxy :: < odra_wasm_client :: types :: U256 , odra_wasm_client :: casper_types :: U256 > (* self . address , "total_supply" , odra_wasm_client :: casper_types :: runtime_args ! { }) . await
    }
    #[doc = "Returns the balance of the given address."]
    #[wasm_bindgen(js_name = "balanceOf")]
    pub async fn balance_of(
        &self,
        #[wasm_bindgen(js_name = "address")] address: odra_wasm_client::types::Address,
    ) -> Result<odra_wasm_client::types::U256, JsError> {
        self . wasm_client . call_entry_point_with_proxy :: < odra_wasm_client :: types :: U256 , odra_wasm_client :: casper_types :: U256 > (* self . address , "balance_of" , odra_wasm_client :: casper_types :: runtime_args ! { "address" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: OdraAddress > :: into_odra_value (address) ? }) . await
    }
    #[doc = "Returns the amount of tokens the owner has allowed the spender to spend."]
    #[wasm_bindgen(js_name = "allowance")]
    pub async fn allowance(
        &self,
        #[wasm_bindgen(js_name = "owner")] owner: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "spender")] spender: odra_wasm_client::types::Address,
    ) -> Result<odra_wasm_client::types::U256, JsError> {
        self . wasm_client . call_entry_point_with_proxy :: < odra_wasm_client :: types :: U256 , odra_wasm_client :: casper_types :: U256 > (* self . address , "allowance" , odra_wasm_client :: casper_types :: runtime_args ! { "owner" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: OdraAddress > :: into_odra_value (owner) ? , "spender" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: OdraAddress > :: into_odra_value (spender) ? }) . await
    }
    #[doc = "Approves the spender to spend the given amount of tokens on behalf of the caller."]
    #[wasm_bindgen(js_name = "approve")]
    pub async fn approve(
        &self,
        #[wasm_bindgen(js_name = "spender")] spender: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "amount")] amount: odra_wasm_client::types::U256,
    ) -> Result<odra_wasm_client::cspr_click::TransactionResult, JsError> {
        self . wasm_client . call_entry_point (* self . address , "approve" , odra_wasm_client :: casper_types :: runtime_args ! { "spender" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: OdraAddress > :: into_odra_value (spender) ? , "amount" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: casper_types :: U256 > :: into_odra_value (amount) ? }) . await
    }
    #[doc = "Decreases the allowance of the spender by the given amount."]
    #[wasm_bindgen(js_name = "decreaseAllowance")]
    pub async fn decrease_allowance(
        &self,
        #[wasm_bindgen(js_name = "spender")] spender: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "decrBy")] decr_by: odra_wasm_client::types::U256,
    ) -> Result<odra_wasm_client::cspr_click::TransactionResult, JsError> {
        self . wasm_client . call_entry_point (* self . address , "decrease_allowance" , odra_wasm_client :: casper_types :: runtime_args ! { "spender" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: OdraAddress > :: into_odra_value (spender) ? , "decr_by" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: casper_types :: U256 > :: into_odra_value (decr_by) ? }) . await
    }
    #[doc = "Increases the allowance of the spender by the given amount."]
    #[wasm_bindgen(js_name = "increaseAllowance")]
    pub async fn increase_allowance(
        &self,
        #[wasm_bindgen(js_name = "spender")] spender: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "incBy")] inc_by: odra_wasm_client::types::U256,
    ) -> Result<odra_wasm_client::cspr_click::TransactionResult, JsError> {
        self . wasm_client . call_entry_point (* self . address , "increase_allowance" , odra_wasm_client :: casper_types :: runtime_args ! { "spender" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: OdraAddress > :: into_odra_value (spender) ? , "inc_by" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: casper_types :: U256 > :: into_odra_value (inc_by) ? }) . await
    }
    #[doc = "Delegated. See `self.metadata.contract_name()` for details."]
    #[wasm_bindgen(js_name = "contractName")]
    pub async fn contract_name(&self) -> Result<Option<String>, JsError> {
        self.wasm_client
            .call_entry_point_with_proxy::<Option<String>, Option<String>>(
                *self.address,
                "contract_name",
                odra_wasm_client::casper_types::runtime_args! {},
            )
            .await
    }
    #[doc = "Delegated. See `self.metadata.contract_description()` for details."]
    #[wasm_bindgen(js_name = "contractDescription")]
    pub async fn contract_description(&self) -> Result<Option<String>, JsError> {
        self.wasm_client
            .call_entry_point_with_proxy::<Option<String>, Option<String>>(
                *self.address,
                "contract_description",
                odra_wasm_client::casper_types::runtime_args! {},
            )
            .await
    }
    #[doc = "Delegated. See `self.metadata.contract_icon_uri()` for details."]
    #[wasm_bindgen(js_name = "contractIconUri")]
    pub async fn contract_icon_uri(&self) -> Result<Option<String>, JsError> {
        self.wasm_client
            .call_entry_point_with_proxy::<Option<String>, Option<String>>(
                *self.address,
                "contract_icon_uri",
                odra_wasm_client::casper_types::runtime_args! {},
            )
            .await
    }
    #[doc = "Delegated. See `self.metadata.contract_project_uri()` for details."]
    #[wasm_bindgen(js_name = "contractProjectUri")]
    pub async fn contract_project_uri(&self) -> Result<Option<String>, JsError> {
        self.wasm_client
            .call_entry_point_with_proxy::<Option<String>, Option<String>>(
                *self.address,
                "contract_project_uri",
                odra_wasm_client::casper_types::runtime_args! {},
            )
            .await
    }
}
#[wasm_bindgen]
#[derive(Debug, Clone)]
pub enum PositionTokenErrors {
    #[doc = "The caller is not the new owner."]
    CallerNotTheNewOwner = 20002isize,
    #[doc = "The caller is not the owner."]
    CallerNotTheOwner = 20001isize,
    #[doc = "The user cannot target themselves."]
    CannotTargetSelfUser = 60003isize,
    #[doc = "Spender does not have enough allowance approved."]
    InsufficientAllowance = 60002isize,
    #[doc = "Spender does not have enough balance."]
    InsufficientBalance = 60001isize,
    #[doc = "The role is missing."]
    MissingRole = 20003isize,
    #[doc = "The owner is not set."]
    OwnerNotSet = 20000isize,
    #[doc = "The role cannot be renounced for another address."]
    RoleRenounceForAnotherAddress = 20004isize,
}
#[wasm_bindgen]
pub struct MarketWasmClient {
    wasm_client: odra_wasm_client::OdraWasmClient,
    address: odra_wasm_client::types::Address,
}
#[wasm_bindgen]
impl MarketWasmClient {
    #[wasm_bindgen(constructor)]
    pub fn new(
        #[wasm_bindgen(js_name = "wasmClient")] wasm_client: &odra_wasm_client::OdraWasmClient,
        address: odra_wasm_client::types::Address,
    ) -> Self {
        MarketWasmClient {
            wasm_client: wasm_client.clone(),
            address,
        }
    }
    #[doc = ""]
    #[wasm_bindgen(js_name = "pause")]
    pub async fn pause(&self) -> Result<odra_wasm_client::cspr_click::TransactionResult, JsError> {
        self.wasm_client
            .call_entry_point(
                *self.address,
                "pause",
                odra_wasm_client::casper_types::runtime_args! {},
            )
            .await
    }
    #[doc = ""]
    #[wasm_bindgen(js_name = "unpause")]
    pub async fn unpause(
        &self,
    ) -> Result<odra_wasm_client::cspr_click::TransactionResult, JsError> {
        self.wasm_client
            .call_entry_point(
                *self.address,
                "unpause",
                odra_wasm_client::casper_types::runtime_args! {},
            )
            .await
    }
    #[doc = ""]
    #[wasm_bindgen(js_name = "isPaused")]
    pub async fn is_paused(&self) -> Result<bool, JsError> {
        self.wasm_client
            .call_entry_point_with_proxy::<bool, bool>(
                *self.address,
                "is_paused",
                odra_wasm_client::casper_types::runtime_args! {},
            )
            .await
    }
    #[doc = ""]
    #[wasm_bindgen(js_name = "updatePrice")]
    pub async fn update_price(
        &self,
    ) -> Result<odra_wasm_client::cspr_click::TransactionResult, JsError> {
        self.wasm_client
            .call_entry_point(
                *self.address,
                "update_price",
                odra_wasm_client::casper_types::runtime_args! {},
            )
            .await
    }
    #[doc = ""]
    #[wasm_bindgen(js_name = "depositLong")]
    pub async fn deposit_long(
        &self,
        #[wasm_bindgen(js_name = "wcsprAmount")] wcspr_amount: odra_wasm_client::types::U256,
    ) -> Result<odra_wasm_client::cspr_click::TransactionResult, JsError> {
        self . wasm_client . call_entry_point (* self . address , "deposit_long" , odra_wasm_client :: casper_types :: runtime_args ! { "wcspr_amount" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: casper_types :: U256 > :: into_odra_value (wcspr_amount) ? }) . await
    }
    #[doc = ""]
    #[wasm_bindgen(js_name = "depositLongFrom")]
    pub async fn deposit_long_from(
        &self,
        #[wasm_bindgen(js_name = "sender")] sender: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "wcsprAmount")] wcspr_amount: odra_wasm_client::types::U256,
    ) -> Result<odra_wasm_client::cspr_click::TransactionResult, JsError> {
        self . wasm_client . call_entry_point (* self . address , "deposit_long_from" , odra_wasm_client :: casper_types :: runtime_args ! { "sender" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: OdraAddress > :: into_odra_value (sender) ? , "wcspr_amount" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: casper_types :: U256 > :: into_odra_value (wcspr_amount) ? }) . await
    }
    #[doc = ""]
    #[wasm_bindgen(js_name = "depositShort")]
    pub async fn deposit_short(
        &self,
        #[wasm_bindgen(js_name = "wcsprAmount")] wcspr_amount: odra_wasm_client::types::U256,
    ) -> Result<odra_wasm_client::cspr_click::TransactionResult, JsError> {
        self . wasm_client . call_entry_point (* self . address , "deposit_short" , odra_wasm_client :: casper_types :: runtime_args ! { "wcspr_amount" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: casper_types :: U256 > :: into_odra_value (wcspr_amount) ? }) . await
    }
    #[doc = ""]
    #[wasm_bindgen(js_name = "depositShortFrom")]
    pub async fn deposit_short_from(
        &self,
        #[wasm_bindgen(js_name = "sender")] sender: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "wcsprAmount")] wcspr_amount: odra_wasm_client::types::U256,
    ) -> Result<odra_wasm_client::cspr_click::TransactionResult, JsError> {
        self . wasm_client . call_entry_point (* self . address , "deposit_short_from" , odra_wasm_client :: casper_types :: runtime_args ! { "sender" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: OdraAddress > :: into_odra_value (sender) ? , "wcspr_amount" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: casper_types :: U256 > :: into_odra_value (wcspr_amount) ? }) . await
    }
    #[doc = ""]
    #[wasm_bindgen(js_name = "withdrawLong")]
    pub async fn withdraw_long(
        &self,
        #[wasm_bindgen(js_name = "longTokenAmount")]
        long_token_amount: odra_wasm_client::types::U256,
    ) -> Result<odra_wasm_client::cspr_click::TransactionResult, JsError> {
        self . wasm_client . call_entry_point (* self . address , "withdraw_long" , odra_wasm_client :: casper_types :: runtime_args ! { "long_token_amount" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: casper_types :: U256 > :: into_odra_value (long_token_amount) ? }) . await
    }
    #[doc = ""]
    #[wasm_bindgen(js_name = "withdrawLongFrom")]
    pub async fn withdraw_long_from(
        &self,
        #[wasm_bindgen(js_name = "sender")] sender: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "longTokenAmount")]
        long_token_amount: odra_wasm_client::types::U256,
    ) -> Result<odra_wasm_client::cspr_click::TransactionResult, JsError> {
        self . wasm_client . call_entry_point (* self . address , "withdraw_long_from" , odra_wasm_client :: casper_types :: runtime_args ! { "sender" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: OdraAddress > :: into_odra_value (sender) ? , "long_token_amount" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: casper_types :: U256 > :: into_odra_value (long_token_amount) ? }) . await
    }
    #[doc = ""]
    #[wasm_bindgen(js_name = "withdrawShort")]
    pub async fn withdraw_short(
        &self,
        #[wasm_bindgen(js_name = "shortTokenAmount")]
        short_token_amount: odra_wasm_client::types::U256,
    ) -> Result<odra_wasm_client::cspr_click::TransactionResult, JsError> {
        self . wasm_client . call_entry_point (* self . address , "withdraw_short" , odra_wasm_client :: casper_types :: runtime_args ! { "short_token_amount" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: casper_types :: U256 > :: into_odra_value (short_token_amount) ? }) . await
    }
    #[doc = ""]
    #[wasm_bindgen(js_name = "withdrawShortFrom")]
    pub async fn withdraw_short_from(
        &self,
        #[wasm_bindgen(js_name = "sender")] sender: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "shortTokenAmount")]
        short_token_amount: odra_wasm_client::types::U256,
    ) -> Result<odra_wasm_client::cspr_click::TransactionResult, JsError> {
        self . wasm_client . call_entry_point (* self . address , "withdraw_short_from" , odra_wasm_client :: casper_types :: runtime_args ! { "sender" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: OdraAddress > :: into_odra_value (sender) ? , "short_token_amount" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: casper_types :: U256 > :: into_odra_value (short_token_amount) ? }) . await
    }
    #[doc = ""]
    #[wasm_bindgen(js_name = "getMarketState")]
    pub async fn get_market_state(&self) -> Result<MarketState, JsError> {
        self.wasm_client
            .call_entry_point_with_proxy::<MarketState, MarketState>(
                *self.address,
                "get_market_state",
                odra_wasm_client::casper_types::runtime_args! {},
            )
            .await
    }
    #[doc = ""]
    #[wasm_bindgen(js_name = "setConfig")]
    pub async fn set_config(
        &self,
        #[wasm_bindgen(js_name = "cfg")] cfg: Config,
    ) -> Result<odra_wasm_client::cspr_click::TransactionResult, JsError> {
        self . wasm_client . call_entry_point (* self . address , "set_config" , odra_wasm_client :: casper_types :: runtime_args ! { "cfg" => odra_wasm_client :: types :: IntoOdraValue :: < Config > :: into_odra_value (cfg) ? }) . await
    }
    #[doc = ""]
    #[wasm_bindgen(js_name = "getConfig")]
    pub async fn get_config(&self) -> Result<Config, JsError> {
        self.wasm_client
            .call_entry_point_with_proxy::<Config, Config>(
                *self.address,
                "get_config",
                odra_wasm_client::casper_types::runtime_args! {},
            )
            .await
    }
    #[doc = ""]
    #[wasm_bindgen(js_name = "setPriceFeed")]
    pub async fn set_price_feed(
        &self,
        #[wasm_bindgen(js_name = "priceFeedAddress")]
        price_feed_address: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "priceFeedId")] price_feed_id: String,
    ) -> Result<odra_wasm_client::cspr_click::TransactionResult, JsError> {
        self . wasm_client . call_entry_point (* self . address , "set_price_feed" , odra_wasm_client :: casper_types :: runtime_args ! { "price_feed_address" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: OdraAddress > :: into_odra_value (price_feed_address) ? , "price_feed_id" => odra_wasm_client :: types :: IntoOdraValue :: < String > :: into_odra_value (price_feed_id) ? }) . await
    }
    #[doc = "Returns comprehensive market and user data in a single call for frontend efficiency."]
    #[wasm_bindgen(js_name = "getAddressMarketState")]
    pub async fn get_address_market_state(
        &self,
        #[wasm_bindgen(js_name = "address")] address: odra_wasm_client::types::Address,
    ) -> Result<AddressMarketState, JsError> {
        self . wasm_client . call_entry_point_with_proxy :: < AddressMarketState , AddressMarketState > (* self . address , "get_address_market_state" , odra_wasm_client :: casper_types :: runtime_args ! { "address" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: OdraAddress > :: into_odra_value (address) ? }) . await
    }
    #[doc = "Delegated. See `self.access_control.has_role()` for details."]
    #[wasm_bindgen(js_name = "hasRole")]
    pub async fn has_role(
        &self,
        #[wasm_bindgen(js_name = "role")] role: Vec<u8>,
        #[wasm_bindgen(js_name = "address")] address: odra_wasm_client::types::Address,
    ) -> Result<bool, JsError> {
        self . wasm_client . call_entry_point_with_proxy :: < bool , bool > (* self . address , "has_role" , odra_wasm_client :: casper_types :: runtime_args ! { "role" => odra_wasm_client :: types :: IntoOdraValue :: < Vec < u8 > > :: into_odra_value (role) ? , "address" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: OdraAddress > :: into_odra_value (address) ? }) . await
    }
    #[doc = "Delegated. See `self.access_control.grant_role()` for details."]
    #[wasm_bindgen(js_name = "grantRole")]
    pub async fn grant_role(
        &self,
        #[wasm_bindgen(js_name = "role")] role: Vec<u8>,
        #[wasm_bindgen(js_name = "address")] address: odra_wasm_client::types::Address,
    ) -> Result<odra_wasm_client::cspr_click::TransactionResult, JsError> {
        self . wasm_client . call_entry_point (* self . address , "grant_role" , odra_wasm_client :: casper_types :: runtime_args ! { "role" => odra_wasm_client :: types :: IntoOdraValue :: < Vec < u8 > > :: into_odra_value (role) ? , "address" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: OdraAddress > :: into_odra_value (address) ? }) . await
    }
    #[doc = "Delegated. See `self.access_control.revoke_role()` for details."]
    #[wasm_bindgen(js_name = "revokeRole")]
    pub async fn revoke_role(
        &self,
        #[wasm_bindgen(js_name = "role")] role: Vec<u8>,
        #[wasm_bindgen(js_name = "address")] address: odra_wasm_client::types::Address,
    ) -> Result<odra_wasm_client::cspr_click::TransactionResult, JsError> {
        self . wasm_client . call_entry_point (* self . address , "revoke_role" , odra_wasm_client :: casper_types :: runtime_args ! { "role" => odra_wasm_client :: types :: IntoOdraValue :: < Vec < u8 > > :: into_odra_value (role) ? , "address" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: OdraAddress > :: into_odra_value (address) ? }) . await
    }
    #[doc = "Delegated. See `self.access_control.get_role_admin()` for details."]
    #[wasm_bindgen(js_name = "getRoleAdmin")]
    pub async fn get_role_admin(
        &self,
        #[wasm_bindgen(js_name = "role")] role: Vec<u8>,
    ) -> Result<Vec<u8>, JsError> {
        self . wasm_client . call_entry_point_with_proxy :: < Vec < u8 > , Vec < u8 > > (* self . address , "get_role_admin" , odra_wasm_client :: casper_types :: runtime_args ! { "role" => odra_wasm_client :: types :: IntoOdraValue :: < Vec < u8 > > :: into_odra_value (role) ? }) . await
    }
    #[doc = "Delegated. See `self.access_control.renounce_role()` for details."]
    #[wasm_bindgen(js_name = "renounceRole")]
    pub async fn renounce_role(
        &self,
        #[wasm_bindgen(js_name = "role")] role: Vec<u8>,
        #[wasm_bindgen(js_name = "address")] address: odra_wasm_client::types::Address,
    ) -> Result<odra_wasm_client::cspr_click::TransactionResult, JsError> {
        self . wasm_client . call_entry_point (* self . address , "renounce_role" , odra_wasm_client :: casper_types :: runtime_args ! { "role" => odra_wasm_client :: types :: IntoOdraValue :: < Vec < u8 > > :: into_odra_value (role) ? , "address" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: OdraAddress > :: into_odra_value (address) ? }) . await
    }
    #[doc = "Delegated. See `self.metadata.contract_name()` for details."]
    #[wasm_bindgen(js_name = "contractName")]
    pub async fn contract_name(&self) -> Result<Option<String>, JsError> {
        self.wasm_client
            .call_entry_point_with_proxy::<Option<String>, Option<String>>(
                *self.address,
                "contract_name",
                odra_wasm_client::casper_types::runtime_args! {},
            )
            .await
    }
    #[doc = "Delegated. See `self.metadata.contract_description()` for details."]
    #[wasm_bindgen(js_name = "contractDescription")]
    pub async fn contract_description(&self) -> Result<Option<String>, JsError> {
        self.wasm_client
            .call_entry_point_with_proxy::<Option<String>, Option<String>>(
                *self.address,
                "contract_description",
                odra_wasm_client::casper_types::runtime_args! {},
            )
            .await
    }
    #[doc = "Delegated. See `self.metadata.contract_icon_uri()` for details."]
    #[wasm_bindgen(js_name = "contractIconUri")]
    pub async fn contract_icon_uri(&self) -> Result<Option<String>, JsError> {
        self.wasm_client
            .call_entry_point_with_proxy::<Option<String>, Option<String>>(
                *self.address,
                "contract_icon_uri",
                odra_wasm_client::casper_types::runtime_args! {},
            )
            .await
    }
    #[doc = "Delegated. See `self.metadata.contract_project_uri()` for details."]
    #[wasm_bindgen(js_name = "contractProjectUri")]
    pub async fn contract_project_uri(&self) -> Result<Option<String>, JsError> {
        self.wasm_client
            .call_entry_point_with_proxy::<Option<String>, Option<String>>(
                *self.address,
                "contract_project_uri",
                odra_wasm_client::casper_types::runtime_args! {},
            )
            .await
    }
}
#[wasm_bindgen]
#[derive(Debug, Clone)]
pub enum MarketErrors {
    #[doc = "The caller is not the new owner."]
    CallerNotTheNewOwner = 20002isize,
    #[doc = "The caller is not the owner."]
    CallerNotTheOwner = 20001isize,
    #[doc = ""]
    LastPriceNotSet = 8001isize,
    #[doc = ""]
    LongShareNotSet = 8004isize,
    #[doc = ""]
    LongTokenContractNotACallerOnDeposit = 8006isize,
    #[doc = ""]
    LongTokenContractNotACallerOnWithdrawal = 8008isize,
    #[doc = ""]
    Misconfigured = 8010isize,
    #[doc = "The role is missing."]
    MissingRole = 20003isize,
    #[doc = ""]
    NewPriceIsFromTheFuture = 8003isize,
    #[doc = ""]
    NewPriceIsTooOld = 8002isize,
    #[doc = "The owner is not set."]
    OwnerNotSet = 20000isize,
    #[doc = "Contract needs to be paused first."]
    PausedRequired = 21000isize,
    #[doc = ""]
    PriceFeedError = 8011isize,
    #[doc = "The role cannot be renounced for another address."]
    RoleRenounceForAnotherAddress = 20004isize,
    #[doc = ""]
    ShortTokenContractNotACallerOnDeposit = 8007isize,
    #[doc = ""]
    ShortTokenContractNotACallerOnWithdrawal = 8009isize,
    #[doc = ""]
    TotalDepositNotSet = 8005isize,
    #[doc = ""]
    Unauthorized = 8401isize,
    #[doc = "Contract needs to be unpaused first."]
    UnpausedRequired = 21001isize,
}
#[wasm_bindgen]
pub struct FaucetableWcsprWasmClient {
    wasm_client: odra_wasm_client::OdraWasmClient,
    address: odra_wasm_client::types::Address,
}
#[wasm_bindgen]
impl FaucetableWcsprWasmClient {
    #[wasm_bindgen(constructor)]
    pub fn new(
        #[wasm_bindgen(js_name = "wasmClient")] wasm_client: &odra_wasm_client::OdraWasmClient,
        address: odra_wasm_client::types::Address,
    ) -> Self {
        FaucetableWcsprWasmClient {
            wasm_client: wasm_client.clone(),
            address,
        }
    }
    #[doc = ""]
    #[wasm_bindgen(js_name = "transfer")]
    pub async fn transfer(
        &self,
        #[wasm_bindgen(js_name = "recipient")] recipient: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "amount")] amount: odra_wasm_client::types::U256,
    ) -> Result<odra_wasm_client::cspr_click::TransactionResult, JsError> {
        self . wasm_client . call_entry_point (* self . address , "transfer" , odra_wasm_client :: casper_types :: runtime_args ! { "recipient" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: OdraAddress > :: into_odra_value (recipient) ? , "amount" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: casper_types :: U256 > :: into_odra_value (amount) ? }) . await
    }
    #[doc = ""]
    #[wasm_bindgen(js_name = "transferFrom")]
    pub async fn transfer_from(
        &self,
        #[wasm_bindgen(js_name = "owner")] owner: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "recipient")] recipient: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "amount")] amount: odra_wasm_client::types::U256,
    ) -> Result<odra_wasm_client::cspr_click::TransactionResult, JsError> {
        self . wasm_client . call_entry_point (* self . address , "transfer_from" , odra_wasm_client :: casper_types :: runtime_args ! { "owner" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: OdraAddress > :: into_odra_value (owner) ? , "recipient" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: OdraAddress > :: into_odra_value (recipient) ? , "amount" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: casper_types :: U256 > :: into_odra_value (amount) ? }) . await
    }
    #[doc = ""]
    #[wasm_bindgen(js_name = "faucet")]
    pub async fn faucet(&self) -> Result<odra_wasm_client::cspr_click::TransactionResult, JsError> {
        self.wasm_client
            .call_entry_point(
                *self.address,
                "faucet",
                odra_wasm_client::casper_types::runtime_args! {},
            )
            .await
    }
    #[doc = ""]
    #[wasm_bindgen(js_name = "participants")]
    pub async fn participants(&self) -> Result<Vec<odra_wasm_client::types::Address>, JsError> {
        self . wasm_client . call_entry_point_with_proxy :: < Vec < odra_wasm_client :: types :: Address > , Vec < odra_wasm_client :: OdraAddress > > (* self . address , "participants" , odra_wasm_client :: casper_types :: runtime_args ! { }) . await
    }
    #[doc = "Add a new transfer manager (admin only)"]
    #[wasm_bindgen(js_name = "addTransferManager")]
    pub async fn add_transfer_manager(
        &self,
        #[wasm_bindgen(js_name = "address")] address: odra_wasm_client::types::Address,
    ) -> Result<odra_wasm_client::cspr_click::TransactionResult, JsError> {
        self . wasm_client . call_entry_point (* self . address , "add_transfer_manager" , odra_wasm_client :: casper_types :: runtime_args ! { "address" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: OdraAddress > :: into_odra_value (address) ? }) . await
    }
    #[doc = "Remove a transfer manager (admin only)"]
    #[wasm_bindgen(js_name = "removeTransferManager")]
    pub async fn remove_transfer_manager(
        &self,
        #[wasm_bindgen(js_name = "address")] address: odra_wasm_client::types::Address,
    ) -> Result<odra_wasm_client::cspr_click::TransactionResult, JsError> {
        self . wasm_client . call_entry_point (* self . address , "remove_transfer_manager" , odra_wasm_client :: casper_types :: runtime_args ! { "address" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: OdraAddress > :: into_odra_value (address) ? }) . await
    }
    #[doc = "Delegated. See `self.access_control.has_role()` for details."]
    #[wasm_bindgen(js_name = "hasRole")]
    pub async fn has_role(
        &self,
        #[wasm_bindgen(js_name = "role")] role: Vec<u8>,
        #[wasm_bindgen(js_name = "address")] address: odra_wasm_client::types::Address,
    ) -> Result<bool, JsError> {
        self . wasm_client . call_entry_point_with_proxy :: < bool , bool > (* self . address , "has_role" , odra_wasm_client :: casper_types :: runtime_args ! { "role" => odra_wasm_client :: types :: IntoOdraValue :: < Vec < u8 > > :: into_odra_value (role) ? , "address" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: OdraAddress > :: into_odra_value (address) ? }) . await
    }
    #[doc = "Delegated. See `self.access_control.grant_role()` for details."]
    #[wasm_bindgen(js_name = "grantRole")]
    pub async fn grant_role(
        &self,
        #[wasm_bindgen(js_name = "role")] role: Vec<u8>,
        #[wasm_bindgen(js_name = "address")] address: odra_wasm_client::types::Address,
    ) -> Result<odra_wasm_client::cspr_click::TransactionResult, JsError> {
        self . wasm_client . call_entry_point (* self . address , "grant_role" , odra_wasm_client :: casper_types :: runtime_args ! { "role" => odra_wasm_client :: types :: IntoOdraValue :: < Vec < u8 > > :: into_odra_value (role) ? , "address" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: OdraAddress > :: into_odra_value (address) ? }) . await
    }
    #[doc = "Delegated. See `self.access_control.revoke_role()` for details."]
    #[wasm_bindgen(js_name = "revokeRole")]
    pub async fn revoke_role(
        &self,
        #[wasm_bindgen(js_name = "role")] role: Vec<u8>,
        #[wasm_bindgen(js_name = "address")] address: odra_wasm_client::types::Address,
    ) -> Result<odra_wasm_client::cspr_click::TransactionResult, JsError> {
        self . wasm_client . call_entry_point (* self . address , "revoke_role" , odra_wasm_client :: casper_types :: runtime_args ! { "role" => odra_wasm_client :: types :: IntoOdraValue :: < Vec < u8 > > :: into_odra_value (role) ? , "address" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: OdraAddress > :: into_odra_value (address) ? }) . await
    }
    #[doc = "Delegated. See `self.access_control.get_role_admin()` for details."]
    #[wasm_bindgen(js_name = "getRoleAdmin")]
    pub async fn get_role_admin(
        &self,
        #[wasm_bindgen(js_name = "role")] role: Vec<u8>,
    ) -> Result<Vec<u8>, JsError> {
        self . wasm_client . call_entry_point_with_proxy :: < Vec < u8 > , Vec < u8 > > (* self . address , "get_role_admin" , odra_wasm_client :: casper_types :: runtime_args ! { "role" => odra_wasm_client :: types :: IntoOdraValue :: < Vec < u8 > > :: into_odra_value (role) ? }) . await
    }
    #[doc = "Delegated. See `self.access_control.renounce_role()` for details."]
    #[wasm_bindgen(js_name = "renounceRole")]
    pub async fn renounce_role(
        &self,
        #[wasm_bindgen(js_name = "role")] role: Vec<u8>,
        #[wasm_bindgen(js_name = "address")] address: odra_wasm_client::types::Address,
    ) -> Result<odra_wasm_client::cspr_click::TransactionResult, JsError> {
        self . wasm_client . call_entry_point (* self . address , "renounce_role" , odra_wasm_client :: casper_types :: runtime_args ! { "role" => odra_wasm_client :: types :: IntoOdraValue :: < Vec < u8 > > :: into_odra_value (role) ? , "address" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: OdraAddress > :: into_odra_value (address) ? }) . await
    }
    #[doc = "Delegated. See `self.wcspr.name()` for details."]
    #[wasm_bindgen(js_name = "name")]
    pub async fn name(&self) -> Result<String, JsError> {
        self.wasm_client
            .call_entry_point_with_proxy::<String, String>(
                *self.address,
                "name",
                odra_wasm_client::casper_types::runtime_args! {},
            )
            .await
    }
    #[doc = "Delegated. See `self.wcspr.symbol()` for details."]
    #[wasm_bindgen(js_name = "symbol")]
    pub async fn symbol(&self) -> Result<String, JsError> {
        self.wasm_client
            .call_entry_point_with_proxy::<String, String>(
                *self.address,
                "symbol",
                odra_wasm_client::casper_types::runtime_args! {},
            )
            .await
    }
    #[doc = "Delegated. See `self.wcspr.decimals()` for details."]
    #[wasm_bindgen(js_name = "decimals")]
    pub async fn decimals(&self) -> Result<u8, JsError> {
        self.wasm_client
            .call_entry_point_with_proxy::<u8, u8>(
                *self.address,
                "decimals",
                odra_wasm_client::casper_types::runtime_args! {},
            )
            .await
    }
    #[doc = "Delegated. See `self.wcspr.total_supply()` for details."]
    #[wasm_bindgen(js_name = "totalSupply")]
    pub async fn total_supply(&self) -> Result<odra_wasm_client::types::U256, JsError> {
        self . wasm_client . call_entry_point_with_proxy :: < odra_wasm_client :: types :: U256 , odra_wasm_client :: casper_types :: U256 > (* self . address , "total_supply" , odra_wasm_client :: casper_types :: runtime_args ! { }) . await
    }
    #[doc = "Delegated. See `self.wcspr.balance_of()` for details."]
    #[wasm_bindgen(js_name = "balanceOf")]
    pub async fn balance_of(
        &self,
        #[wasm_bindgen(js_name = "address")] address: odra_wasm_client::types::Address,
    ) -> Result<odra_wasm_client::types::U256, JsError> {
        self . wasm_client . call_entry_point_with_proxy :: < odra_wasm_client :: types :: U256 , odra_wasm_client :: casper_types :: U256 > (* self . address , "balance_of" , odra_wasm_client :: casper_types :: runtime_args ! { "address" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: OdraAddress > :: into_odra_value (address) ? }) . await
    }
    #[doc = "Delegated. See `self.wcspr.allowance()` for details."]
    #[wasm_bindgen(js_name = "allowance")]
    pub async fn allowance(
        &self,
        #[wasm_bindgen(js_name = "owner")] owner: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "spender")] spender: odra_wasm_client::types::Address,
    ) -> Result<odra_wasm_client::types::U256, JsError> {
        self . wasm_client . call_entry_point_with_proxy :: < odra_wasm_client :: types :: U256 , odra_wasm_client :: casper_types :: U256 > (* self . address , "allowance" , odra_wasm_client :: casper_types :: runtime_args ! { "owner" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: OdraAddress > :: into_odra_value (owner) ? , "spender" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: OdraAddress > :: into_odra_value (spender) ? }) . await
    }
    #[doc = "Delegated. See `self.wcspr.approve()` for details."]
    #[wasm_bindgen(js_name = "approve")]
    pub async fn approve(
        &self,
        #[wasm_bindgen(js_name = "spender")] spender: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "amount")] amount: odra_wasm_client::types::U256,
    ) -> Result<odra_wasm_client::cspr_click::TransactionResult, JsError> {
        self . wasm_client . call_entry_point (* self . address , "approve" , odra_wasm_client :: casper_types :: runtime_args ! { "spender" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: OdraAddress > :: into_odra_value (spender) ? , "amount" => odra_wasm_client :: types :: IntoOdraValue :: < odra_wasm_client :: casper_types :: U256 > :: into_odra_value (amount) ? }) . await
    }
    #[doc = "Delegated. See `self.metadata.contract_name()` for details."]
    #[wasm_bindgen(js_name = "contractName")]
    pub async fn contract_name(&self) -> Result<Option<String>, JsError> {
        self.wasm_client
            .call_entry_point_with_proxy::<Option<String>, Option<String>>(
                *self.address,
                "contract_name",
                odra_wasm_client::casper_types::runtime_args! {},
            )
            .await
    }
    #[doc = "Delegated. See `self.metadata.contract_description()` for details."]
    #[wasm_bindgen(js_name = "contractDescription")]
    pub async fn contract_description(&self) -> Result<Option<String>, JsError> {
        self.wasm_client
            .call_entry_point_with_proxy::<Option<String>, Option<String>>(
                *self.address,
                "contract_description",
                odra_wasm_client::casper_types::runtime_args! {},
            )
            .await
    }
    #[doc = "Delegated. See `self.metadata.contract_icon_uri()` for details."]
    #[wasm_bindgen(js_name = "contractIconUri")]
    pub async fn contract_icon_uri(&self) -> Result<Option<String>, JsError> {
        self.wasm_client
            .call_entry_point_with_proxy::<Option<String>, Option<String>>(
                *self.address,
                "contract_icon_uri",
                odra_wasm_client::casper_types::runtime_args! {},
            )
            .await
    }
    #[doc = "Delegated. See `self.metadata.contract_project_uri()` for details."]
    #[wasm_bindgen(js_name = "contractProjectUri")]
    pub async fn contract_project_uri(&self) -> Result<Option<String>, JsError> {
        self.wasm_client
            .call_entry_point_with_proxy::<Option<String>, Option<String>>(
                *self.address,
                "contract_project_uri",
                odra_wasm_client::casper_types::runtime_args! {},
            )
            .await
    }
}
#[wasm_bindgen]
#[derive(Debug, Clone)]
pub enum FaucetableWcsprErrors {
    #[doc = "The caller is not the new owner."]
    CallerNotTheNewOwner = 20002isize,
    #[doc = "The caller is not the owner."]
    CallerNotTheOwner = 20001isize,
    #[doc = "The user cannot target themselves."]
    CannotTargetSelfUser = 60003isize,
    #[doc = "Spender does not have enough allowance approved."]
    InsufficientAllowance = 60002isize,
    #[doc = "Spender does not have enough balance."]
    InsufficientBalance = 60001isize,
    #[doc = "The role is missing."]
    MissingRole = 20003isize,
    #[doc = "The owner is not set."]
    OwnerNotSet = 20000isize,
    #[doc = "The role cannot be renounced for another address."]
    RoleRenounceForAnotherAddress = 20004isize,
}
#[doc = ""]
#[derive(Debug, Clone, serde :: Serialize, serde :: Deserialize)]
#[wasm_bindgen(getter_with_clone)]
pub struct IncreaseAllowance {
    #[wasm_bindgen(js_name = "owner")]
    owner: odra_wasm_client::OdraAddress,
    #[wasm_bindgen(js_name = "spender")]
    spender: odra_wasm_client::OdraAddress,
    #[wasm_bindgen(js_name = "allowance")]
    allowance: odra_wasm_client::casper_types::U256,
    #[wasm_bindgen(js_name = "incBy")]
    inc_by: odra_wasm_client::casper_types::U256,
}
#[wasm_bindgen]
impl IncreaseAllowance {
    #[wasm_bindgen(constructor)]
    pub fn new(
        #[wasm_bindgen(js_name = "owner")] owner: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "spender")] spender: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "allowance")] allowance: odra_wasm_client::types::U256,
        #[wasm_bindgen(js_name = "incBy")] inc_by: odra_wasm_client::types::U256,
    ) -> Result<Self, JsError> {
        Ok(Self {
            owner: odra_wasm_client::types::IntoOdraValue::into_odra_value(owner)?,
            spender: odra_wasm_client::types::IntoOdraValue::into_odra_value(spender)?,
            allowance: odra_wasm_client::types::IntoOdraValue::into_odra_value(allowance)?,
            inc_by: odra_wasm_client::types::IntoOdraValue::into_odra_value(inc_by)?,
        })
    }
    #[wasm_bindgen(js_name = "toJson")]
    pub fn to_json(&self) -> JsValue {
        JsValue::from_serde(self).unwrap_or(JsValue::null())
    }
    #[wasm_bindgen(setter)]
    pub fn set_owner(&mut self, value: odra_wasm_client::types::Address) {
        self.owner = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn owner(&self) -> odra_wasm_client::types::Address {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.owner.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_spender(&mut self, value: odra_wasm_client::types::Address) {
        self.spender = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn spender(&self) -> odra_wasm_client::types::Address {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.spender.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_allowance(&mut self, value: odra_wasm_client::types::U256) {
        self.allowance = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn allowance(&self) -> odra_wasm_client::types::U256 {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.allowance.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_inc_by(&mut self, value: odra_wasm_client::types::U256) {
        self.inc_by = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn inc_by(&self) -> odra_wasm_client::types::U256 {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.inc_by.clone())
    }
}
impl odra_wasm_client::casper_types::bytesrepr::FromBytes for IncreaseAllowance {
    fn from_bytes(
        bytes: &[u8],
    ) -> Result<(Self, &[u8]), odra_wasm_client::casper_types::bytesrepr::Error> {
        let (owner, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (spender, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (allowance, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (inc_by, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        Ok((
            Self {
                owner,
                spender,
                allowance,
                inc_by,
            },
            bytes,
        ))
    }
}
impl odra_wasm_client::casper_types::bytesrepr::ToBytes for IncreaseAllowance {
    fn to_bytes(&self) -> Result<Vec<u8>, odra_wasm_client::casper_types::bytesrepr::Error> {
        let mut result = Vec::with_capacity(self.serialized_length());
        result.extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.owner)?);
        result.extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.spender)?);
        result
            .extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.allowance)?);
        result.extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.inc_by)?);
        Ok(result)
    }
    fn serialized_length(&self) -> usize {
        let mut result = 0;
        result += self.owner.serialized_length();
        result += self.spender.serialized_length();
        result += self.allowance.serialized_length();
        result += self.inc_by.serialized_length();
        result
    }
}
impl odra_wasm_client::casper_types::CLTyped for IncreaseAllowance {
    fn cl_type() -> odra_wasm_client::casper_types::CLType {
        odra_wasm_client::casper_types::CLType::Any
    }
}
impl odra_wasm_client::types::IntoOdraValue<IncreaseAllowance> for IncreaseAllowance {
    fn into_odra_value(self) -> Result<IncreaseAllowance, JsError> {
        Ok(self)
    }
}
impl odra_wasm_client::types::IntoWasmValue<IncreaseAllowance> for IncreaseAllowance {
    fn to_wasm_value(self) -> Self {
        self
    }
}
#[doc = ""]
#[derive(Debug, Clone, serde :: Serialize, serde :: Deserialize)]
#[wasm_bindgen(getter_with_clone)]
pub struct FeeCollected {
    #[wasm_bindgen(js_name = "amount")]
    amount: odra_wasm_client::casper_types::U256,
    #[wasm_bindgen(js_name = "feeCollector")]
    fee_collector: odra_wasm_client::OdraAddress,
}
#[wasm_bindgen]
impl FeeCollected {
    #[wasm_bindgen(constructor)]
    pub fn new(
        #[wasm_bindgen(js_name = "amount")] amount: odra_wasm_client::types::U256,
        #[wasm_bindgen(js_name = "feeCollector")] fee_collector: odra_wasm_client::types::Address,
    ) -> Result<Self, JsError> {
        Ok(Self {
            amount: odra_wasm_client::types::IntoOdraValue::into_odra_value(amount)?,
            fee_collector: odra_wasm_client::types::IntoOdraValue::into_odra_value(fee_collector)?,
        })
    }
    #[wasm_bindgen(js_name = "toJson")]
    pub fn to_json(&self) -> JsValue {
        JsValue::from_serde(self).unwrap_or(JsValue::null())
    }
    #[wasm_bindgen(setter)]
    pub fn set_amount(&mut self, value: odra_wasm_client::types::U256) {
        self.amount = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn amount(&self) -> odra_wasm_client::types::U256 {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.amount.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_fee_collector(&mut self, value: odra_wasm_client::types::Address) {
        self.fee_collector =
            odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn fee_collector(&self) -> odra_wasm_client::types::Address {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.fee_collector.clone())
    }
}
impl odra_wasm_client::casper_types::bytesrepr::FromBytes for FeeCollected {
    fn from_bytes(
        bytes: &[u8],
    ) -> Result<(Self, &[u8]), odra_wasm_client::casper_types::bytesrepr::Error> {
        let (amount, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (fee_collector, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        Ok((
            Self {
                amount,
                fee_collector,
            },
            bytes,
        ))
    }
}
impl odra_wasm_client::casper_types::bytesrepr::ToBytes for FeeCollected {
    fn to_bytes(&self) -> Result<Vec<u8>, odra_wasm_client::casper_types::bytesrepr::Error> {
        let mut result = Vec::with_capacity(self.serialized_length());
        result.extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.amount)?);
        result.extend(
            odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.fee_collector)?,
        );
        Ok(result)
    }
    fn serialized_length(&self) -> usize {
        let mut result = 0;
        result += self.amount.serialized_length();
        result += self.fee_collector.serialized_length();
        result
    }
}
impl odra_wasm_client::casper_types::CLTyped for FeeCollected {
    fn cl_type() -> odra_wasm_client::casper_types::CLType {
        odra_wasm_client::casper_types::CLType::Any
    }
}
impl odra_wasm_client::types::IntoOdraValue<FeeCollected> for FeeCollected {
    fn into_odra_value(self) -> Result<FeeCollected, JsError> {
        Ok(self)
    }
}
impl odra_wasm_client::types::IntoWasmValue<FeeCollected> for FeeCollected {
    fn to_wasm_value(self) -> Self {
        self
    }
}
#[doc = ""]
#[derive(Debug, Clone, serde :: Serialize, serde :: Deserialize)]
#[wasm_bindgen(getter_with_clone)]
pub struct TransferFrom {
    #[wasm_bindgen(js_name = "spender")]
    spender: odra_wasm_client::OdraAddress,
    #[wasm_bindgen(js_name = "owner")]
    owner: odra_wasm_client::OdraAddress,
    #[wasm_bindgen(js_name = "recipient")]
    recipient: odra_wasm_client::OdraAddress,
    #[wasm_bindgen(js_name = "amount")]
    amount: odra_wasm_client::casper_types::U256,
}
#[wasm_bindgen]
impl TransferFrom {
    #[wasm_bindgen(constructor)]
    pub fn new(
        #[wasm_bindgen(js_name = "spender")] spender: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "owner")] owner: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "recipient")] recipient: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "amount")] amount: odra_wasm_client::types::U256,
    ) -> Result<Self, JsError> {
        Ok(Self {
            spender: odra_wasm_client::types::IntoOdraValue::into_odra_value(spender)?,
            owner: odra_wasm_client::types::IntoOdraValue::into_odra_value(owner)?,
            recipient: odra_wasm_client::types::IntoOdraValue::into_odra_value(recipient)?,
            amount: odra_wasm_client::types::IntoOdraValue::into_odra_value(amount)?,
        })
    }
    #[wasm_bindgen(js_name = "toJson")]
    pub fn to_json(&self) -> JsValue {
        JsValue::from_serde(self).unwrap_or(JsValue::null())
    }
    #[wasm_bindgen(setter)]
    pub fn set_spender(&mut self, value: odra_wasm_client::types::Address) {
        self.spender = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn spender(&self) -> odra_wasm_client::types::Address {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.spender.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_owner(&mut self, value: odra_wasm_client::types::Address) {
        self.owner = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn owner(&self) -> odra_wasm_client::types::Address {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.owner.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_recipient(&mut self, value: odra_wasm_client::types::Address) {
        self.recipient = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn recipient(&self) -> odra_wasm_client::types::Address {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.recipient.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_amount(&mut self, value: odra_wasm_client::types::U256) {
        self.amount = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn amount(&self) -> odra_wasm_client::types::U256 {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.amount.clone())
    }
}
impl odra_wasm_client::casper_types::bytesrepr::FromBytes for TransferFrom {
    fn from_bytes(
        bytes: &[u8],
    ) -> Result<(Self, &[u8]), odra_wasm_client::casper_types::bytesrepr::Error> {
        let (spender, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (owner, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (recipient, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (amount, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        Ok((
            Self {
                spender,
                owner,
                recipient,
                amount,
            },
            bytes,
        ))
    }
}
impl odra_wasm_client::casper_types::bytesrepr::ToBytes for TransferFrom {
    fn to_bytes(&self) -> Result<Vec<u8>, odra_wasm_client::casper_types::bytesrepr::Error> {
        let mut result = Vec::with_capacity(self.serialized_length());
        result.extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.spender)?);
        result.extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.owner)?);
        result
            .extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.recipient)?);
        result.extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.amount)?);
        Ok(result)
    }
    fn serialized_length(&self) -> usize {
        let mut result = 0;
        result += self.spender.serialized_length();
        result += self.owner.serialized_length();
        result += self.recipient.serialized_length();
        result += self.amount.serialized_length();
        result
    }
}
impl odra_wasm_client::casper_types::CLTyped for TransferFrom {
    fn cl_type() -> odra_wasm_client::casper_types::CLType {
        odra_wasm_client::casper_types::CLType::Any
    }
}
impl odra_wasm_client::types::IntoOdraValue<TransferFrom> for TransferFrom {
    fn into_odra_value(self) -> Result<TransferFrom, JsError> {
        Ok(self)
    }
}
impl odra_wasm_client::types::IntoWasmValue<TransferFrom> for TransferFrom {
    fn to_wasm_value(self) -> Self {
        self
    }
}
#[doc = ""]
#[derive(Debug, Clone, serde :: Serialize, serde :: Deserialize)]
#[wasm_bindgen(getter_with_clone)]
pub struct RoleGranted {
    #[wasm_bindgen(js_name = "role")]
    pub role: Vec<u8>,
    #[wasm_bindgen(js_name = "address")]
    address: odra_wasm_client::OdraAddress,
    #[wasm_bindgen(js_name = "sender")]
    sender: odra_wasm_client::OdraAddress,
}
#[wasm_bindgen]
impl RoleGranted {
    #[wasm_bindgen(constructor)]
    pub fn new(
        #[wasm_bindgen(js_name = "role")] role: Vec<u8>,
        #[wasm_bindgen(js_name = "address")] address: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "sender")] sender: odra_wasm_client::types::Address,
    ) -> Result<Self, JsError> {
        Ok(Self {
            role,
            address: odra_wasm_client::types::IntoOdraValue::into_odra_value(address)?,
            sender: odra_wasm_client::types::IntoOdraValue::into_odra_value(sender)?,
        })
    }
    #[wasm_bindgen(js_name = "toJson")]
    pub fn to_json(&self) -> JsValue {
        JsValue::from_serde(self).unwrap_or(JsValue::null())
    }
    #[wasm_bindgen(setter)]
    pub fn set_address(&mut self, value: odra_wasm_client::types::Address) {
        self.address = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn address(&self) -> odra_wasm_client::types::Address {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.address.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_sender(&mut self, value: odra_wasm_client::types::Address) {
        self.sender = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn sender(&self) -> odra_wasm_client::types::Address {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.sender.clone())
    }
}
impl odra_wasm_client::casper_types::bytesrepr::FromBytes for RoleGranted {
    fn from_bytes(
        bytes: &[u8],
    ) -> Result<(Self, &[u8]), odra_wasm_client::casper_types::bytesrepr::Error> {
        let (role, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (address, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (sender, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        Ok((
            Self {
                role,
                address,
                sender,
            },
            bytes,
        ))
    }
}
impl odra_wasm_client::casper_types::bytesrepr::ToBytes for RoleGranted {
    fn to_bytes(&self) -> Result<Vec<u8>, odra_wasm_client::casper_types::bytesrepr::Error> {
        let mut result = Vec::with_capacity(self.serialized_length());
        result.extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.role)?);
        result.extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.address)?);
        result.extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.sender)?);
        Ok(result)
    }
    fn serialized_length(&self) -> usize {
        let mut result = 0;
        result += self.role.serialized_length();
        result += self.address.serialized_length();
        result += self.sender.serialized_length();
        result
    }
}
impl odra_wasm_client::casper_types::CLTyped for RoleGranted {
    fn cl_type() -> odra_wasm_client::casper_types::CLType {
        odra_wasm_client::casper_types::CLType::Any
    }
}
impl odra_wasm_client::types::IntoOdraValue<RoleGranted> for RoleGranted {
    fn into_odra_value(self) -> Result<RoleGranted, JsError> {
        Ok(self)
    }
}
impl odra_wasm_client::types::IntoWasmValue<RoleGranted> for RoleGranted {
    fn to_wasm_value(self) -> Self {
        self
    }
}
#[doc = ""]
#[derive(Debug, Clone, serde :: Serialize, serde :: Deserialize)]
#[wasm_bindgen(getter_with_clone)]
pub struct Transfer {
    #[wasm_bindgen(js_name = "sender")]
    sender: odra_wasm_client::OdraAddress,
    #[wasm_bindgen(js_name = "recipient")]
    recipient: odra_wasm_client::OdraAddress,
    #[wasm_bindgen(js_name = "amount")]
    amount: odra_wasm_client::casper_types::U256,
}
#[wasm_bindgen]
impl Transfer {
    #[wasm_bindgen(constructor)]
    pub fn new(
        #[wasm_bindgen(js_name = "sender")] sender: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "recipient")] recipient: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "amount")] amount: odra_wasm_client::types::U256,
    ) -> Result<Self, JsError> {
        Ok(Self {
            sender: odra_wasm_client::types::IntoOdraValue::into_odra_value(sender)?,
            recipient: odra_wasm_client::types::IntoOdraValue::into_odra_value(recipient)?,
            amount: odra_wasm_client::types::IntoOdraValue::into_odra_value(amount)?,
        })
    }
    #[wasm_bindgen(js_name = "toJson")]
    pub fn to_json(&self) -> JsValue {
        JsValue::from_serde(self).unwrap_or(JsValue::null())
    }
    #[wasm_bindgen(setter)]
    pub fn set_sender(&mut self, value: odra_wasm_client::types::Address) {
        self.sender = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn sender(&self) -> odra_wasm_client::types::Address {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.sender.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_recipient(&mut self, value: odra_wasm_client::types::Address) {
        self.recipient = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn recipient(&self) -> odra_wasm_client::types::Address {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.recipient.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_amount(&mut self, value: odra_wasm_client::types::U256) {
        self.amount = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn amount(&self) -> odra_wasm_client::types::U256 {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.amount.clone())
    }
}
impl odra_wasm_client::casper_types::bytesrepr::FromBytes for Transfer {
    fn from_bytes(
        bytes: &[u8],
    ) -> Result<(Self, &[u8]), odra_wasm_client::casper_types::bytesrepr::Error> {
        let (sender, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (recipient, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (amount, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        Ok((
            Self {
                sender,
                recipient,
                amount,
            },
            bytes,
        ))
    }
}
impl odra_wasm_client::casper_types::bytesrepr::ToBytes for Transfer {
    fn to_bytes(&self) -> Result<Vec<u8>, odra_wasm_client::casper_types::bytesrepr::Error> {
        let mut result = Vec::with_capacity(self.serialized_length());
        result.extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.sender)?);
        result
            .extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.recipient)?);
        result.extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.amount)?);
        Ok(result)
    }
    fn serialized_length(&self) -> usize {
        let mut result = 0;
        result += self.sender.serialized_length();
        result += self.recipient.serialized_length();
        result += self.amount.serialized_length();
        result
    }
}
impl odra_wasm_client::casper_types::CLTyped for Transfer {
    fn cl_type() -> odra_wasm_client::casper_types::CLType {
        odra_wasm_client::casper_types::CLType::Any
    }
}
impl odra_wasm_client::types::IntoOdraValue<Transfer> for Transfer {
    fn into_odra_value(self) -> Result<Transfer, JsError> {
        Ok(self)
    }
}
impl odra_wasm_client::types::IntoWasmValue<Transfer> for Transfer {
    fn to_wasm_value(self) -> Self {
        self
    }
}
#[doc = ""]
#[derive(Debug, Clone, serde :: Serialize, serde :: Deserialize)]
#[wasm_bindgen(getter_with_clone)]
pub struct MarketState {
    #[wasm_bindgen(js_name = "longTotalSupply")]
    long_total_supply: odra_wasm_client::casper_types::U256,
    #[wasm_bindgen(js_name = "shortTotalSupply")]
    short_total_supply: odra_wasm_client::casper_types::U256,
    #[wasm_bindgen(js_name = "longLiquidity")]
    long_liquidity: odra_wasm_client::casper_types::U256,
    #[wasm_bindgen(js_name = "shortLiquidity")]
    short_liquidity: odra_wasm_client::casper_types::U256,
    #[wasm_bindgen(js_name = "price")]
    price: odra_wasm_client::casper_types::U256,
}
#[wasm_bindgen]
impl MarketState {
    #[wasm_bindgen(constructor)]
    pub fn new(
        #[wasm_bindgen(js_name = "longTotalSupply")]
        long_total_supply: odra_wasm_client::types::U256,
        #[wasm_bindgen(js_name = "shortTotalSupply")]
        short_total_supply: odra_wasm_client::types::U256,
        #[wasm_bindgen(js_name = "longLiquidity")] long_liquidity: odra_wasm_client::types::U256,
        #[wasm_bindgen(js_name = "shortLiquidity")] short_liquidity: odra_wasm_client::types::U256,
        #[wasm_bindgen(js_name = "price")] price: odra_wasm_client::types::U256,
    ) -> Result<Self, JsError> {
        Ok(Self {
            long_total_supply: odra_wasm_client::types::IntoOdraValue::into_odra_value(
                long_total_supply,
            )?,
            short_total_supply: odra_wasm_client::types::IntoOdraValue::into_odra_value(
                short_total_supply,
            )?,
            long_liquidity: odra_wasm_client::types::IntoOdraValue::into_odra_value(
                long_liquidity,
            )?,
            short_liquidity: odra_wasm_client::types::IntoOdraValue::into_odra_value(
                short_liquidity,
            )?,
            price: odra_wasm_client::types::IntoOdraValue::into_odra_value(price)?,
        })
    }
    #[wasm_bindgen(js_name = "toJson")]
    pub fn to_json(&self) -> JsValue {
        JsValue::from_serde(self).unwrap_or(JsValue::null())
    }
    #[wasm_bindgen(setter)]
    pub fn set_long_total_supply(&mut self, value: odra_wasm_client::types::U256) {
        self.long_total_supply =
            odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn long_total_supply(&self) -> odra_wasm_client::types::U256 {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.long_total_supply.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_short_total_supply(&mut self, value: odra_wasm_client::types::U256) {
        self.short_total_supply =
            odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn short_total_supply(&self) -> odra_wasm_client::types::U256 {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.short_total_supply.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_long_liquidity(&mut self, value: odra_wasm_client::types::U256) {
        self.long_liquidity =
            odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn long_liquidity(&self) -> odra_wasm_client::types::U256 {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.long_liquidity.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_short_liquidity(&mut self, value: odra_wasm_client::types::U256) {
        self.short_liquidity =
            odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn short_liquidity(&self) -> odra_wasm_client::types::U256 {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.short_liquidity.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_price(&mut self, value: odra_wasm_client::types::U256) {
        self.price = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn price(&self) -> odra_wasm_client::types::U256 {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.price.clone())
    }
}
impl odra_wasm_client::casper_types::bytesrepr::FromBytes for MarketState {
    fn from_bytes(
        bytes: &[u8],
    ) -> Result<(Self, &[u8]), odra_wasm_client::casper_types::bytesrepr::Error> {
        let (long_total_supply, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (short_total_supply, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (long_liquidity, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (short_liquidity, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (price, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        Ok((
            Self {
                long_total_supply,
                short_total_supply,
                long_liquidity,
                short_liquidity,
                price,
            },
            bytes,
        ))
    }
}
impl odra_wasm_client::casper_types::bytesrepr::ToBytes for MarketState {
    fn to_bytes(&self) -> Result<Vec<u8>, odra_wasm_client::casper_types::bytesrepr::Error> {
        let mut result = Vec::with_capacity(self.serialized_length());
        result.extend(
            odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.long_total_supply)?,
        );
        result.extend(
            odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.short_total_supply)?,
        );
        result.extend(
            odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.long_liquidity)?,
        );
        result.extend(
            odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.short_liquidity)?,
        );
        result.extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.price)?);
        Ok(result)
    }
    fn serialized_length(&self) -> usize {
        let mut result = 0;
        result += self.long_total_supply.serialized_length();
        result += self.short_total_supply.serialized_length();
        result += self.long_liquidity.serialized_length();
        result += self.short_liquidity.serialized_length();
        result += self.price.serialized_length();
        result
    }
}
impl odra_wasm_client::casper_types::CLTyped for MarketState {
    fn cl_type() -> odra_wasm_client::casper_types::CLType {
        odra_wasm_client::casper_types::CLType::Any
    }
}
impl odra_wasm_client::types::IntoOdraValue<MarketState> for MarketState {
    fn into_odra_value(self) -> Result<MarketState, JsError> {
        Ok(self)
    }
}
impl odra_wasm_client::types::IntoWasmValue<MarketState> for MarketState {
    fn to_wasm_value(self) -> Self {
        self
    }
}
#[doc = ""]
#[derive(Debug, Clone, serde :: Serialize, serde :: Deserialize)]
#[wasm_bindgen(getter_with_clone)]
pub struct Burn {
    #[wasm_bindgen(js_name = "owner")]
    owner: odra_wasm_client::OdraAddress,
    #[wasm_bindgen(js_name = "amount")]
    amount: odra_wasm_client::casper_types::U256,
}
#[wasm_bindgen]
impl Burn {
    #[wasm_bindgen(constructor)]
    pub fn new(
        #[wasm_bindgen(js_name = "owner")] owner: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "amount")] amount: odra_wasm_client::types::U256,
    ) -> Result<Self, JsError> {
        Ok(Self {
            owner: odra_wasm_client::types::IntoOdraValue::into_odra_value(owner)?,
            amount: odra_wasm_client::types::IntoOdraValue::into_odra_value(amount)?,
        })
    }
    #[wasm_bindgen(js_name = "toJson")]
    pub fn to_json(&self) -> JsValue {
        JsValue::from_serde(self).unwrap_or(JsValue::null())
    }
    #[wasm_bindgen(setter)]
    pub fn set_owner(&mut self, value: odra_wasm_client::types::Address) {
        self.owner = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn owner(&self) -> odra_wasm_client::types::Address {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.owner.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_amount(&mut self, value: odra_wasm_client::types::U256) {
        self.amount = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn amount(&self) -> odra_wasm_client::types::U256 {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.amount.clone())
    }
}
impl odra_wasm_client::casper_types::bytesrepr::FromBytes for Burn {
    fn from_bytes(
        bytes: &[u8],
    ) -> Result<(Self, &[u8]), odra_wasm_client::casper_types::bytesrepr::Error> {
        let (owner, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (amount, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        Ok((Self { owner, amount }, bytes))
    }
}
impl odra_wasm_client::casper_types::bytesrepr::ToBytes for Burn {
    fn to_bytes(&self) -> Result<Vec<u8>, odra_wasm_client::casper_types::bytesrepr::Error> {
        let mut result = Vec::with_capacity(self.serialized_length());
        result.extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.owner)?);
        result.extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.amount)?);
        Ok(result)
    }
    fn serialized_length(&self) -> usize {
        let mut result = 0;
        result += self.owner.serialized_length();
        result += self.amount.serialized_length();
        result
    }
}
impl odra_wasm_client::casper_types::CLTyped for Burn {
    fn cl_type() -> odra_wasm_client::casper_types::CLType {
        odra_wasm_client::casper_types::CLType::Any
    }
}
impl odra_wasm_client::types::IntoOdraValue<Burn> for Burn {
    fn into_odra_value(self) -> Result<Burn, JsError> {
        Ok(self)
    }
}
impl odra_wasm_client::types::IntoWasmValue<Burn> for Burn {
    fn to_wasm_value(self) -> Self {
        self
    }
}
#[doc = ""]
#[derive(Debug, Clone, serde :: Serialize, serde :: Deserialize)]
#[wasm_bindgen(getter_with_clone)]
pub struct PriceUpdated {
    #[wasm_bindgen(js_name = "newPrice")]
    new_price: odra_wasm_client::casper_types::U256,
    #[wasm_bindgen(js_name = "previousPrice")]
    previous_price: odra_wasm_client::casper_types::U256,
    #[wasm_bindgen(js_name = "timestamp")]
    pub timestamp: u64,
}
#[wasm_bindgen]
impl PriceUpdated {
    #[wasm_bindgen(constructor)]
    pub fn new(
        #[wasm_bindgen(js_name = "newPrice")] new_price: odra_wasm_client::types::U256,
        #[wasm_bindgen(js_name = "previousPrice")] previous_price: odra_wasm_client::types::U256,
        #[wasm_bindgen(js_name = "timestamp")] timestamp: u64,
    ) -> Result<Self, JsError> {
        Ok(Self {
            new_price: odra_wasm_client::types::IntoOdraValue::into_odra_value(new_price)?,
            previous_price: odra_wasm_client::types::IntoOdraValue::into_odra_value(
                previous_price,
            )?,
            timestamp,
        })
    }
    #[wasm_bindgen(js_name = "toJson")]
    pub fn to_json(&self) -> JsValue {
        JsValue::from_serde(self).unwrap_or(JsValue::null())
    }
    #[wasm_bindgen(setter)]
    pub fn set_new_price(&mut self, value: odra_wasm_client::types::U256) {
        self.new_price = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn new_price(&self) -> odra_wasm_client::types::U256 {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.new_price.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_previous_price(&mut self, value: odra_wasm_client::types::U256) {
        self.previous_price =
            odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn previous_price(&self) -> odra_wasm_client::types::U256 {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.previous_price.clone())
    }
}
impl odra_wasm_client::casper_types::bytesrepr::FromBytes for PriceUpdated {
    fn from_bytes(
        bytes: &[u8],
    ) -> Result<(Self, &[u8]), odra_wasm_client::casper_types::bytesrepr::Error> {
        let (new_price, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (previous_price, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (timestamp, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        Ok((
            Self {
                new_price,
                previous_price,
                timestamp,
            },
            bytes,
        ))
    }
}
impl odra_wasm_client::casper_types::bytesrepr::ToBytes for PriceUpdated {
    fn to_bytes(&self) -> Result<Vec<u8>, odra_wasm_client::casper_types::bytesrepr::Error> {
        let mut result = Vec::with_capacity(self.serialized_length());
        result
            .extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.new_price)?);
        result.extend(
            odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.previous_price)?,
        );
        result
            .extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.timestamp)?);
        Ok(result)
    }
    fn serialized_length(&self) -> usize {
        let mut result = 0;
        result += self.new_price.serialized_length();
        result += self.previous_price.serialized_length();
        result += self.timestamp.serialized_length();
        result
    }
}
impl odra_wasm_client::casper_types::CLTyped for PriceUpdated {
    fn cl_type() -> odra_wasm_client::casper_types::CLType {
        odra_wasm_client::casper_types::CLType::Any
    }
}
impl odra_wasm_client::types::IntoOdraValue<PriceUpdated> for PriceUpdated {
    fn into_odra_value(self) -> Result<PriceUpdated, JsError> {
        Ok(self)
    }
}
impl odra_wasm_client::types::IntoWasmValue<PriceUpdated> for PriceUpdated {
    fn to_wasm_value(self) -> Self {
        self
    }
}
#[doc = ""]
#[derive(Debug, Clone, serde :: Serialize, serde :: Deserialize)]
#[wasm_bindgen]
pub enum LongOrShort {
    Long = 0isize,
    Short = 1isize,
}
impl odra_wasm_client::casper_types::bytesrepr::FromBytes for LongOrShort {
    fn from_bytes(
        bytes: &[u8],
    ) -> Result<(Self, &[u8]), odra_wasm_client::casper_types::bytesrepr::Error> {
        let (result, bytes): (u8, _) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        match result {
            0u8 => Ok((Self::Long, bytes)),
            1u8 => Ok((Self::Short, bytes)),
            _ => Err(odra_wasm_client::casper_types::bytesrepr::Error::Formatting),
        }
    }
}
impl odra_wasm_client::casper_types::bytesrepr::ToBytes for LongOrShort {
    fn to_bytes(&self) -> Result<Vec<u8>, odra_wasm_client::casper_types::bytesrepr::Error> {
        Ok(vec![(self.clone() as u8)])
    }
    fn serialized_length(&self) -> usize {
        odra_wasm_client::casper_types::bytesrepr::U8_SERIALIZED_LENGTH
    }
}
impl odra_wasm_client::casper_types::CLTyped for LongOrShort {
    fn cl_type() -> odra_wasm_client::casper_types::CLType {
        odra_wasm_client::casper_types::CLType::U8
    }
}
impl odra_wasm_client::types::IntoOdraValue<LongOrShort> for LongOrShort {
    fn into_odra_value(self) -> Result<LongOrShort, JsError> {
        Ok(self)
    }
}
impl odra_wasm_client::types::IntoWasmValue<LongOrShort> for LongOrShort {
    fn to_wasm_value(self) -> Self {
        self
    }
}
#[doc = ""]
#[derive(Debug, Clone, serde :: Serialize, serde :: Deserialize)]
#[wasm_bindgen(getter_with_clone)]
pub struct Config {
    #[wasm_bindgen(js_name = "longToken")]
    long_token: odra_wasm_client::OdraAddress,
    #[wasm_bindgen(js_name = "shortToken")]
    short_token: odra_wasm_client::OdraAddress,
    #[wasm_bindgen(js_name = "wcsprToken")]
    wcspr_token: odra_wasm_client::OdraAddress,
    #[wasm_bindgen(js_name = "feeCollector")]
    fee_collector: odra_wasm_client::OdraAddress,
}
#[wasm_bindgen]
impl Config {
    #[wasm_bindgen(constructor)]
    pub fn new(
        #[wasm_bindgen(js_name = "longToken")] long_token: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "shortToken")] short_token: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "wcsprToken")] wcspr_token: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "feeCollector")] fee_collector: odra_wasm_client::types::Address,
    ) -> Result<Self, JsError> {
        Ok(Self {
            long_token: odra_wasm_client::types::IntoOdraValue::into_odra_value(long_token)?,
            short_token: odra_wasm_client::types::IntoOdraValue::into_odra_value(short_token)?,
            wcspr_token: odra_wasm_client::types::IntoOdraValue::into_odra_value(wcspr_token)?,
            fee_collector: odra_wasm_client::types::IntoOdraValue::into_odra_value(fee_collector)?,
        })
    }
    #[wasm_bindgen(js_name = "toJson")]
    pub fn to_json(&self) -> JsValue {
        JsValue::from_serde(self).unwrap_or(JsValue::null())
    }
    #[wasm_bindgen(setter)]
    pub fn set_long_token(&mut self, value: odra_wasm_client::types::Address) {
        self.long_token = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn long_token(&self) -> odra_wasm_client::types::Address {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.long_token.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_short_token(&mut self, value: odra_wasm_client::types::Address) {
        self.short_token = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn short_token(&self) -> odra_wasm_client::types::Address {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.short_token.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_wcspr_token(&mut self, value: odra_wasm_client::types::Address) {
        self.wcspr_token = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn wcspr_token(&self) -> odra_wasm_client::types::Address {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.wcspr_token.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_fee_collector(&mut self, value: odra_wasm_client::types::Address) {
        self.fee_collector =
            odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn fee_collector(&self) -> odra_wasm_client::types::Address {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.fee_collector.clone())
    }
}
impl odra_wasm_client::casper_types::bytesrepr::FromBytes for Config {
    fn from_bytes(
        bytes: &[u8],
    ) -> Result<(Self, &[u8]), odra_wasm_client::casper_types::bytesrepr::Error> {
        let (long_token, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (short_token, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (wcspr_token, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (fee_collector, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        Ok((
            Self {
                long_token,
                short_token,
                wcspr_token,
                fee_collector,
            },
            bytes,
        ))
    }
}
impl odra_wasm_client::casper_types::bytesrepr::ToBytes for Config {
    fn to_bytes(&self) -> Result<Vec<u8>, odra_wasm_client::casper_types::bytesrepr::Error> {
        let mut result = Vec::with_capacity(self.serialized_length());
        result.extend(
            odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.long_token)?,
        );
        result.extend(
            odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.short_token)?,
        );
        result.extend(
            odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.wcspr_token)?,
        );
        result.extend(
            odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.fee_collector)?,
        );
        Ok(result)
    }
    fn serialized_length(&self) -> usize {
        let mut result = 0;
        result += self.long_token.serialized_length();
        result += self.short_token.serialized_length();
        result += self.wcspr_token.serialized_length();
        result += self.fee_collector.serialized_length();
        result
    }
}
impl odra_wasm_client::casper_types::CLTyped for Config {
    fn cl_type() -> odra_wasm_client::casper_types::CLType {
        odra_wasm_client::casper_types::CLType::Any
    }
}
impl odra_wasm_client::types::IntoOdraValue<Config> for Config {
    fn into_odra_value(self) -> Result<Config, JsError> {
        Ok(self)
    }
}
impl odra_wasm_client::types::IntoWasmValue<Config> for Config {
    fn to_wasm_value(self) -> Self {
        self
    }
}
#[doc = ""]
#[derive(Debug, Clone, serde :: Serialize, serde :: Deserialize)]
#[wasm_bindgen(getter_with_clone)]
pub struct ConfigUpdated {
    #[wasm_bindgen(js_name = "admin")]
    admin: odra_wasm_client::OdraAddress,
    #[wasm_bindgen(js_name = "longToken")]
    long_token: odra_wasm_client::OdraAddress,
    #[wasm_bindgen(js_name = "shortToken")]
    short_token: odra_wasm_client::OdraAddress,
    #[wasm_bindgen(js_name = "wcsprToken")]
    wcspr_token: odra_wasm_client::OdraAddress,
    #[wasm_bindgen(js_name = "feeCollector")]
    fee_collector: odra_wasm_client::OdraAddress,
}
#[wasm_bindgen]
impl ConfigUpdated {
    #[wasm_bindgen(constructor)]
    pub fn new(
        #[wasm_bindgen(js_name = "admin")] admin: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "longToken")] long_token: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "shortToken")] short_token: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "wcsprToken")] wcspr_token: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "feeCollector")] fee_collector: odra_wasm_client::types::Address,
    ) -> Result<Self, JsError> {
        Ok(Self {
            admin: odra_wasm_client::types::IntoOdraValue::into_odra_value(admin)?,
            long_token: odra_wasm_client::types::IntoOdraValue::into_odra_value(long_token)?,
            short_token: odra_wasm_client::types::IntoOdraValue::into_odra_value(short_token)?,
            wcspr_token: odra_wasm_client::types::IntoOdraValue::into_odra_value(wcspr_token)?,
            fee_collector: odra_wasm_client::types::IntoOdraValue::into_odra_value(fee_collector)?,
        })
    }
    #[wasm_bindgen(js_name = "toJson")]
    pub fn to_json(&self) -> JsValue {
        JsValue::from_serde(self).unwrap_or(JsValue::null())
    }
    #[wasm_bindgen(setter)]
    pub fn set_admin(&mut self, value: odra_wasm_client::types::Address) {
        self.admin = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn admin(&self) -> odra_wasm_client::types::Address {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.admin.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_long_token(&mut self, value: odra_wasm_client::types::Address) {
        self.long_token = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn long_token(&self) -> odra_wasm_client::types::Address {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.long_token.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_short_token(&mut self, value: odra_wasm_client::types::Address) {
        self.short_token = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn short_token(&self) -> odra_wasm_client::types::Address {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.short_token.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_wcspr_token(&mut self, value: odra_wasm_client::types::Address) {
        self.wcspr_token = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn wcspr_token(&self) -> odra_wasm_client::types::Address {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.wcspr_token.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_fee_collector(&mut self, value: odra_wasm_client::types::Address) {
        self.fee_collector =
            odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn fee_collector(&self) -> odra_wasm_client::types::Address {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.fee_collector.clone())
    }
}
impl odra_wasm_client::casper_types::bytesrepr::FromBytes for ConfigUpdated {
    fn from_bytes(
        bytes: &[u8],
    ) -> Result<(Self, &[u8]), odra_wasm_client::casper_types::bytesrepr::Error> {
        let (admin, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (long_token, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (short_token, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (wcspr_token, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (fee_collector, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        Ok((
            Self {
                admin,
                long_token,
                short_token,
                wcspr_token,
                fee_collector,
            },
            bytes,
        ))
    }
}
impl odra_wasm_client::casper_types::bytesrepr::ToBytes for ConfigUpdated {
    fn to_bytes(&self) -> Result<Vec<u8>, odra_wasm_client::casper_types::bytesrepr::Error> {
        let mut result = Vec::with_capacity(self.serialized_length());
        result.extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.admin)?);
        result.extend(
            odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.long_token)?,
        );
        result.extend(
            odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.short_token)?,
        );
        result.extend(
            odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.wcspr_token)?,
        );
        result.extend(
            odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.fee_collector)?,
        );
        Ok(result)
    }
    fn serialized_length(&self) -> usize {
        let mut result = 0;
        result += self.admin.serialized_length();
        result += self.long_token.serialized_length();
        result += self.short_token.serialized_length();
        result += self.wcspr_token.serialized_length();
        result += self.fee_collector.serialized_length();
        result
    }
}
impl odra_wasm_client::casper_types::CLTyped for ConfigUpdated {
    fn cl_type() -> odra_wasm_client::casper_types::CLType {
        odra_wasm_client::casper_types::CLType::Any
    }
}
impl odra_wasm_client::types::IntoOdraValue<ConfigUpdated> for ConfigUpdated {
    fn into_odra_value(self) -> Result<ConfigUpdated, JsError> {
        Ok(self)
    }
}
impl odra_wasm_client::types::IntoWasmValue<ConfigUpdated> for ConfigUpdated {
    fn to_wasm_value(self) -> Self {
        self
    }
}
#[doc = ""]
#[derive(Debug, Clone, serde :: Serialize, serde :: Deserialize)]
#[wasm_bindgen(getter_with_clone)]
pub struct ShortDeposited {
    #[wasm_bindgen(js_name = "user")]
    user: odra_wasm_client::OdraAddress,
    #[wasm_bindgen(js_name = "wcsprAmount")]
    wcspr_amount: odra_wasm_client::casper_types::U256,
    #[wasm_bindgen(js_name = "shortTokensMinted")]
    short_tokens_minted: odra_wasm_client::casper_types::U256,
    #[wasm_bindgen(js_name = "feeCollected")]
    fee_collected: odra_wasm_client::casper_types::U256,
}
#[wasm_bindgen]
impl ShortDeposited {
    #[wasm_bindgen(constructor)]
    pub fn new(
        #[wasm_bindgen(js_name = "user")] user: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "wcsprAmount")] wcspr_amount: odra_wasm_client::types::U256,
        #[wasm_bindgen(js_name = "shortTokensMinted")]
        short_tokens_minted: odra_wasm_client::types::U256,
        #[wasm_bindgen(js_name = "feeCollected")] fee_collected: odra_wasm_client::types::U256,
    ) -> Result<Self, JsError> {
        Ok(Self {
            user: odra_wasm_client::types::IntoOdraValue::into_odra_value(user)?,
            wcspr_amount: odra_wasm_client::types::IntoOdraValue::into_odra_value(wcspr_amount)?,
            short_tokens_minted: odra_wasm_client::types::IntoOdraValue::into_odra_value(
                short_tokens_minted,
            )?,
            fee_collected: odra_wasm_client::types::IntoOdraValue::into_odra_value(fee_collected)?,
        })
    }
    #[wasm_bindgen(js_name = "toJson")]
    pub fn to_json(&self) -> JsValue {
        JsValue::from_serde(self).unwrap_or(JsValue::null())
    }
    #[wasm_bindgen(setter)]
    pub fn set_user(&mut self, value: odra_wasm_client::types::Address) {
        self.user = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn user(&self) -> odra_wasm_client::types::Address {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.user.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_wcspr_amount(&mut self, value: odra_wasm_client::types::U256) {
        self.wcspr_amount = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn wcspr_amount(&self) -> odra_wasm_client::types::U256 {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.wcspr_amount.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_short_tokens_minted(&mut self, value: odra_wasm_client::types::U256) {
        self.short_tokens_minted =
            odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn short_tokens_minted(&self) -> odra_wasm_client::types::U256 {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.short_tokens_minted.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_fee_collected(&mut self, value: odra_wasm_client::types::U256) {
        self.fee_collected =
            odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn fee_collected(&self) -> odra_wasm_client::types::U256 {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.fee_collected.clone())
    }
}
impl odra_wasm_client::casper_types::bytesrepr::FromBytes for ShortDeposited {
    fn from_bytes(
        bytes: &[u8],
    ) -> Result<(Self, &[u8]), odra_wasm_client::casper_types::bytesrepr::Error> {
        let (user, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (wcspr_amount, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (short_tokens_minted, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (fee_collected, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        Ok((
            Self {
                user,
                wcspr_amount,
                short_tokens_minted,
                fee_collected,
            },
            bytes,
        ))
    }
}
impl odra_wasm_client::casper_types::bytesrepr::ToBytes for ShortDeposited {
    fn to_bytes(&self) -> Result<Vec<u8>, odra_wasm_client::casper_types::bytesrepr::Error> {
        let mut result = Vec::with_capacity(self.serialized_length());
        result.extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.user)?);
        result.extend(
            odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.wcspr_amount)?,
        );
        result.extend(
            odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(
                &self.short_tokens_minted,
            )?,
        );
        result.extend(
            odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.fee_collected)?,
        );
        Ok(result)
    }
    fn serialized_length(&self) -> usize {
        let mut result = 0;
        result += self.user.serialized_length();
        result += self.wcspr_amount.serialized_length();
        result += self.short_tokens_minted.serialized_length();
        result += self.fee_collected.serialized_length();
        result
    }
}
impl odra_wasm_client::casper_types::CLTyped for ShortDeposited {
    fn cl_type() -> odra_wasm_client::casper_types::CLType {
        odra_wasm_client::casper_types::CLType::Any
    }
}
impl odra_wasm_client::types::IntoOdraValue<ShortDeposited> for ShortDeposited {
    fn into_odra_value(self) -> Result<ShortDeposited, JsError> {
        Ok(self)
    }
}
impl odra_wasm_client::types::IntoWasmValue<ShortDeposited> for ShortDeposited {
    fn to_wasm_value(self) -> Self {
        self
    }
}
#[doc = ""]
#[derive(Debug, Clone, serde :: Serialize, serde :: Deserialize)]
#[wasm_bindgen(getter_with_clone)]
pub struct Paused {
    #[wasm_bindgen(js_name = "account")]
    account: odra_wasm_client::OdraAddress,
}
#[wasm_bindgen]
impl Paused {
    #[wasm_bindgen(constructor)]
    pub fn new(
        #[wasm_bindgen(js_name = "account")] account: odra_wasm_client::types::Address,
    ) -> Result<Self, JsError> {
        Ok(Self {
            account: odra_wasm_client::types::IntoOdraValue::into_odra_value(account)?,
        })
    }
    #[wasm_bindgen(js_name = "toJson")]
    pub fn to_json(&self) -> JsValue {
        JsValue::from_serde(self).unwrap_or(JsValue::null())
    }
    #[wasm_bindgen(setter)]
    pub fn set_account(&mut self, value: odra_wasm_client::types::Address) {
        self.account = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn account(&self) -> odra_wasm_client::types::Address {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.account.clone())
    }
}
impl odra_wasm_client::casper_types::bytesrepr::FromBytes for Paused {
    fn from_bytes(
        bytes: &[u8],
    ) -> Result<(Self, &[u8]), odra_wasm_client::casper_types::bytesrepr::Error> {
        let (account, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        Ok((Self { account }, bytes))
    }
}
impl odra_wasm_client::casper_types::bytesrepr::ToBytes for Paused {
    fn to_bytes(&self) -> Result<Vec<u8>, odra_wasm_client::casper_types::bytesrepr::Error> {
        let mut result = Vec::with_capacity(self.serialized_length());
        result.extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.account)?);
        Ok(result)
    }
    fn serialized_length(&self) -> usize {
        let mut result = 0;
        result += self.account.serialized_length();
        result
    }
}
impl odra_wasm_client::casper_types::CLTyped for Paused {
    fn cl_type() -> odra_wasm_client::casper_types::CLType {
        odra_wasm_client::casper_types::CLType::Any
    }
}
impl odra_wasm_client::types::IntoOdraValue<Paused> for Paused {
    fn into_odra_value(self) -> Result<Paused, JsError> {
        Ok(self)
    }
}
impl odra_wasm_client::types::IntoWasmValue<Paused> for Paused {
    fn to_wasm_value(self) -> Self {
        self
    }
}
#[doc = ""]
#[derive(Debug, Clone, serde :: Serialize, serde :: Deserialize)]
#[wasm_bindgen(getter_with_clone)]
pub struct RoleRevoked {
    #[wasm_bindgen(js_name = "role")]
    pub role: Vec<u8>,
    #[wasm_bindgen(js_name = "address")]
    address: odra_wasm_client::OdraAddress,
    #[wasm_bindgen(js_name = "sender")]
    sender: odra_wasm_client::OdraAddress,
}
#[wasm_bindgen]
impl RoleRevoked {
    #[wasm_bindgen(constructor)]
    pub fn new(
        #[wasm_bindgen(js_name = "role")] role: Vec<u8>,
        #[wasm_bindgen(js_name = "address")] address: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "sender")] sender: odra_wasm_client::types::Address,
    ) -> Result<Self, JsError> {
        Ok(Self {
            role,
            address: odra_wasm_client::types::IntoOdraValue::into_odra_value(address)?,
            sender: odra_wasm_client::types::IntoOdraValue::into_odra_value(sender)?,
        })
    }
    #[wasm_bindgen(js_name = "toJson")]
    pub fn to_json(&self) -> JsValue {
        JsValue::from_serde(self).unwrap_or(JsValue::null())
    }
    #[wasm_bindgen(setter)]
    pub fn set_address(&mut self, value: odra_wasm_client::types::Address) {
        self.address = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn address(&self) -> odra_wasm_client::types::Address {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.address.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_sender(&mut self, value: odra_wasm_client::types::Address) {
        self.sender = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn sender(&self) -> odra_wasm_client::types::Address {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.sender.clone())
    }
}
impl odra_wasm_client::casper_types::bytesrepr::FromBytes for RoleRevoked {
    fn from_bytes(
        bytes: &[u8],
    ) -> Result<(Self, &[u8]), odra_wasm_client::casper_types::bytesrepr::Error> {
        let (role, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (address, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (sender, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        Ok((
            Self {
                role,
                address,
                sender,
            },
            bytes,
        ))
    }
}
impl odra_wasm_client::casper_types::bytesrepr::ToBytes for RoleRevoked {
    fn to_bytes(&self) -> Result<Vec<u8>, odra_wasm_client::casper_types::bytesrepr::Error> {
        let mut result = Vec::with_capacity(self.serialized_length());
        result.extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.role)?);
        result.extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.address)?);
        result.extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.sender)?);
        Ok(result)
    }
    fn serialized_length(&self) -> usize {
        let mut result = 0;
        result += self.role.serialized_length();
        result += self.address.serialized_length();
        result += self.sender.serialized_length();
        result
    }
}
impl odra_wasm_client::casper_types::CLTyped for RoleRevoked {
    fn cl_type() -> odra_wasm_client::casper_types::CLType {
        odra_wasm_client::casper_types::CLType::Any
    }
}
impl odra_wasm_client::types::IntoOdraValue<RoleRevoked> for RoleRevoked {
    fn into_odra_value(self) -> Result<RoleRevoked, JsError> {
        Ok(self)
    }
}
impl odra_wasm_client::types::IntoWasmValue<RoleRevoked> for RoleRevoked {
    fn to_wasm_value(self) -> Self {
        self
    }
}
#[doc = ""]
#[derive(Debug, Clone, serde :: Serialize, serde :: Deserialize)]
#[wasm_bindgen(getter_with_clone)]
pub struct RoleAdminChanged {
    #[wasm_bindgen(js_name = "role")]
    pub role: Vec<u8>,
    #[wasm_bindgen(js_name = "previousAdminRole")]
    pub previous_admin_role: Vec<u8>,
    #[wasm_bindgen(js_name = "newAdminRole")]
    pub new_admin_role: Vec<u8>,
}
#[wasm_bindgen]
impl RoleAdminChanged {
    #[wasm_bindgen(constructor)]
    pub fn new(
        #[wasm_bindgen(js_name = "role")] role: Vec<u8>,
        #[wasm_bindgen(js_name = "previousAdminRole")] previous_admin_role: Vec<u8>,
        #[wasm_bindgen(js_name = "newAdminRole")] new_admin_role: Vec<u8>,
    ) -> Result<Self, JsError> {
        Ok(Self {
            role,
            previous_admin_role,
            new_admin_role,
        })
    }
    #[wasm_bindgen(js_name = "toJson")]
    pub fn to_json(&self) -> JsValue {
        JsValue::from_serde(self).unwrap_or(JsValue::null())
    }
}
impl odra_wasm_client::casper_types::bytesrepr::FromBytes for RoleAdminChanged {
    fn from_bytes(
        bytes: &[u8],
    ) -> Result<(Self, &[u8]), odra_wasm_client::casper_types::bytesrepr::Error> {
        let (role, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (previous_admin_role, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (new_admin_role, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        Ok((
            Self {
                role,
                previous_admin_role,
                new_admin_role,
            },
            bytes,
        ))
    }
}
impl odra_wasm_client::casper_types::bytesrepr::ToBytes for RoleAdminChanged {
    fn to_bytes(&self) -> Result<Vec<u8>, odra_wasm_client::casper_types::bytesrepr::Error> {
        let mut result = Vec::with_capacity(self.serialized_length());
        result.extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.role)?);
        result.extend(
            odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(
                &self.previous_admin_role,
            )?,
        );
        result.extend(
            odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.new_admin_role)?,
        );
        Ok(result)
    }
    fn serialized_length(&self) -> usize {
        let mut result = 0;
        result += self.role.serialized_length();
        result += self.previous_admin_role.serialized_length();
        result += self.new_admin_role.serialized_length();
        result
    }
}
impl odra_wasm_client::casper_types::CLTyped for RoleAdminChanged {
    fn cl_type() -> odra_wasm_client::casper_types::CLType {
        odra_wasm_client::casper_types::CLType::Any
    }
}
impl odra_wasm_client::types::IntoOdraValue<RoleAdminChanged> for RoleAdminChanged {
    fn into_odra_value(self) -> Result<RoleAdminChanged, JsError> {
        Ok(self)
    }
}
impl odra_wasm_client::types::IntoWasmValue<RoleAdminChanged> for RoleAdminChanged {
    fn to_wasm_value(self) -> Self {
        self
    }
}
#[doc = ""]
#[derive(Debug, Clone, serde :: Serialize, serde :: Deserialize)]
#[wasm_bindgen(getter_with_clone)]
pub struct PriceFeedUpdated {
    #[wasm_bindgen(js_name = "admin")]
    admin: odra_wasm_client::OdraAddress,
    #[wasm_bindgen(js_name = "priceFeedAddress")]
    price_feed_address: odra_wasm_client::OdraAddress,
    #[wasm_bindgen(js_name = "priceFeedId")]
    pub price_feed_id: String,
}
#[wasm_bindgen]
impl PriceFeedUpdated {
    #[wasm_bindgen(constructor)]
    pub fn new(
        #[wasm_bindgen(js_name = "admin")] admin: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "priceFeedAddress")]
        price_feed_address: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "priceFeedId")] price_feed_id: String,
    ) -> Result<Self, JsError> {
        Ok(Self {
            admin: odra_wasm_client::types::IntoOdraValue::into_odra_value(admin)?,
            price_feed_address: odra_wasm_client::types::IntoOdraValue::into_odra_value(
                price_feed_address,
            )?,
            price_feed_id,
        })
    }
    #[wasm_bindgen(js_name = "toJson")]
    pub fn to_json(&self) -> JsValue {
        JsValue::from_serde(self).unwrap_or(JsValue::null())
    }
    #[wasm_bindgen(setter)]
    pub fn set_admin(&mut self, value: odra_wasm_client::types::Address) {
        self.admin = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn admin(&self) -> odra_wasm_client::types::Address {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.admin.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_price_feed_address(&mut self, value: odra_wasm_client::types::Address) {
        self.price_feed_address =
            odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn price_feed_address(&self) -> odra_wasm_client::types::Address {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.price_feed_address.clone())
    }
}
impl odra_wasm_client::casper_types::bytesrepr::FromBytes for PriceFeedUpdated {
    fn from_bytes(
        bytes: &[u8],
    ) -> Result<(Self, &[u8]), odra_wasm_client::casper_types::bytesrepr::Error> {
        let (admin, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (price_feed_address, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (price_feed_id, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        Ok((
            Self {
                admin,
                price_feed_address,
                price_feed_id,
            },
            bytes,
        ))
    }
}
impl odra_wasm_client::casper_types::bytesrepr::ToBytes for PriceFeedUpdated {
    fn to_bytes(&self) -> Result<Vec<u8>, odra_wasm_client::casper_types::bytesrepr::Error> {
        let mut result = Vec::with_capacity(self.serialized_length());
        result.extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.admin)?);
        result.extend(
            odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.price_feed_address)?,
        );
        result.extend(
            odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.price_feed_id)?,
        );
        Ok(result)
    }
    fn serialized_length(&self) -> usize {
        let mut result = 0;
        result += self.admin.serialized_length();
        result += self.price_feed_address.serialized_length();
        result += self.price_feed_id.serialized_length();
        result
    }
}
impl odra_wasm_client::casper_types::CLTyped for PriceFeedUpdated {
    fn cl_type() -> odra_wasm_client::casper_types::CLType {
        odra_wasm_client::casper_types::CLType::Any
    }
}
impl odra_wasm_client::types::IntoOdraValue<PriceFeedUpdated> for PriceFeedUpdated {
    fn into_odra_value(self) -> Result<PriceFeedUpdated, JsError> {
        Ok(self)
    }
}
impl odra_wasm_client::types::IntoWasmValue<PriceFeedUpdated> for PriceFeedUpdated {
    fn to_wasm_value(self) -> Self {
        self
    }
}
#[doc = ""]
#[derive(Debug, Clone, serde :: Serialize, serde :: Deserialize)]
#[wasm_bindgen(getter_with_clone)]
pub struct LongDeposited {
    #[wasm_bindgen(js_name = "user")]
    user: odra_wasm_client::OdraAddress,
    #[wasm_bindgen(js_name = "wcsprAmount")]
    wcspr_amount: odra_wasm_client::casper_types::U256,
    #[wasm_bindgen(js_name = "longTokensMinted")]
    long_tokens_minted: odra_wasm_client::casper_types::U256,
    #[wasm_bindgen(js_name = "feeCollected")]
    fee_collected: odra_wasm_client::casper_types::U256,
}
#[wasm_bindgen]
impl LongDeposited {
    #[wasm_bindgen(constructor)]
    pub fn new(
        #[wasm_bindgen(js_name = "user")] user: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "wcsprAmount")] wcspr_amount: odra_wasm_client::types::U256,
        #[wasm_bindgen(js_name = "longTokensMinted")]
        long_tokens_minted: odra_wasm_client::types::U256,
        #[wasm_bindgen(js_name = "feeCollected")] fee_collected: odra_wasm_client::types::U256,
    ) -> Result<Self, JsError> {
        Ok(Self {
            user: odra_wasm_client::types::IntoOdraValue::into_odra_value(user)?,
            wcspr_amount: odra_wasm_client::types::IntoOdraValue::into_odra_value(wcspr_amount)?,
            long_tokens_minted: odra_wasm_client::types::IntoOdraValue::into_odra_value(
                long_tokens_minted,
            )?,
            fee_collected: odra_wasm_client::types::IntoOdraValue::into_odra_value(fee_collected)?,
        })
    }
    #[wasm_bindgen(js_name = "toJson")]
    pub fn to_json(&self) -> JsValue {
        JsValue::from_serde(self).unwrap_or(JsValue::null())
    }
    #[wasm_bindgen(setter)]
    pub fn set_user(&mut self, value: odra_wasm_client::types::Address) {
        self.user = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn user(&self) -> odra_wasm_client::types::Address {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.user.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_wcspr_amount(&mut self, value: odra_wasm_client::types::U256) {
        self.wcspr_amount = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn wcspr_amount(&self) -> odra_wasm_client::types::U256 {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.wcspr_amount.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_long_tokens_minted(&mut self, value: odra_wasm_client::types::U256) {
        self.long_tokens_minted =
            odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn long_tokens_minted(&self) -> odra_wasm_client::types::U256 {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.long_tokens_minted.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_fee_collected(&mut self, value: odra_wasm_client::types::U256) {
        self.fee_collected =
            odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn fee_collected(&self) -> odra_wasm_client::types::U256 {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.fee_collected.clone())
    }
}
impl odra_wasm_client::casper_types::bytesrepr::FromBytes for LongDeposited {
    fn from_bytes(
        bytes: &[u8],
    ) -> Result<(Self, &[u8]), odra_wasm_client::casper_types::bytesrepr::Error> {
        let (user, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (wcspr_amount, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (long_tokens_minted, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (fee_collected, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        Ok((
            Self {
                user,
                wcspr_amount,
                long_tokens_minted,
                fee_collected,
            },
            bytes,
        ))
    }
}
impl odra_wasm_client::casper_types::bytesrepr::ToBytes for LongDeposited {
    fn to_bytes(&self) -> Result<Vec<u8>, odra_wasm_client::casper_types::bytesrepr::Error> {
        let mut result = Vec::with_capacity(self.serialized_length());
        result.extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.user)?);
        result.extend(
            odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.wcspr_amount)?,
        );
        result.extend(
            odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.long_tokens_minted)?,
        );
        result.extend(
            odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.fee_collected)?,
        );
        Ok(result)
    }
    fn serialized_length(&self) -> usize {
        let mut result = 0;
        result += self.user.serialized_length();
        result += self.wcspr_amount.serialized_length();
        result += self.long_tokens_minted.serialized_length();
        result += self.fee_collected.serialized_length();
        result
    }
}
impl odra_wasm_client::casper_types::CLTyped for LongDeposited {
    fn cl_type() -> odra_wasm_client::casper_types::CLType {
        odra_wasm_client::casper_types::CLType::Any
    }
}
impl odra_wasm_client::types::IntoOdraValue<LongDeposited> for LongDeposited {
    fn into_odra_value(self) -> Result<LongDeposited, JsError> {
        Ok(self)
    }
}
impl odra_wasm_client::types::IntoWasmValue<LongDeposited> for LongDeposited {
    fn to_wasm_value(self) -> Self {
        self
    }
}
#[doc = ""]
#[derive(Debug, Clone, serde :: Serialize, serde :: Deserialize)]
#[wasm_bindgen(getter_with_clone)]
pub struct Unpaused {
    #[wasm_bindgen(js_name = "account")]
    account: odra_wasm_client::OdraAddress,
}
#[wasm_bindgen]
impl Unpaused {
    #[wasm_bindgen(constructor)]
    pub fn new(
        #[wasm_bindgen(js_name = "account")] account: odra_wasm_client::types::Address,
    ) -> Result<Self, JsError> {
        Ok(Self {
            account: odra_wasm_client::types::IntoOdraValue::into_odra_value(account)?,
        })
    }
    #[wasm_bindgen(js_name = "toJson")]
    pub fn to_json(&self) -> JsValue {
        JsValue::from_serde(self).unwrap_or(JsValue::null())
    }
    #[wasm_bindgen(setter)]
    pub fn set_account(&mut self, value: odra_wasm_client::types::Address) {
        self.account = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn account(&self) -> odra_wasm_client::types::Address {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.account.clone())
    }
}
impl odra_wasm_client::casper_types::bytesrepr::FromBytes for Unpaused {
    fn from_bytes(
        bytes: &[u8],
    ) -> Result<(Self, &[u8]), odra_wasm_client::casper_types::bytesrepr::Error> {
        let (account, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        Ok((Self { account }, bytes))
    }
}
impl odra_wasm_client::casper_types::bytesrepr::ToBytes for Unpaused {
    fn to_bytes(&self) -> Result<Vec<u8>, odra_wasm_client::casper_types::bytesrepr::Error> {
        let mut result = Vec::with_capacity(self.serialized_length());
        result.extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.account)?);
        Ok(result)
    }
    fn serialized_length(&self) -> usize {
        let mut result = 0;
        result += self.account.serialized_length();
        result
    }
}
impl odra_wasm_client::casper_types::CLTyped for Unpaused {
    fn cl_type() -> odra_wasm_client::casper_types::CLType {
        odra_wasm_client::casper_types::CLType::Any
    }
}
impl odra_wasm_client::types::IntoOdraValue<Unpaused> for Unpaused {
    fn into_odra_value(self) -> Result<Unpaused, JsError> {
        Ok(self)
    }
}
impl odra_wasm_client::types::IntoWasmValue<Unpaused> for Unpaused {
    fn to_wasm_value(self) -> Self {
        self
    }
}
#[doc = ""]
#[derive(Debug, Clone, serde :: Serialize, serde :: Deserialize)]
#[wasm_bindgen(getter_with_clone)]
pub struct LongWithdrawn {
    #[wasm_bindgen(js_name = "user")]
    user: odra_wasm_client::OdraAddress,
    #[wasm_bindgen(js_name = "longTokensBurned")]
    long_tokens_burned: odra_wasm_client::casper_types::U256,
    #[wasm_bindgen(js_name = "wcsprAmount")]
    wcspr_amount: odra_wasm_client::casper_types::U256,
    #[wasm_bindgen(js_name = "feeCollected")]
    fee_collected: odra_wasm_client::casper_types::U256,
}
#[wasm_bindgen]
impl LongWithdrawn {
    #[wasm_bindgen(constructor)]
    pub fn new(
        #[wasm_bindgen(js_name = "user")] user: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "longTokensBurned")]
        long_tokens_burned: odra_wasm_client::types::U256,
        #[wasm_bindgen(js_name = "wcsprAmount")] wcspr_amount: odra_wasm_client::types::U256,
        #[wasm_bindgen(js_name = "feeCollected")] fee_collected: odra_wasm_client::types::U256,
    ) -> Result<Self, JsError> {
        Ok(Self {
            user: odra_wasm_client::types::IntoOdraValue::into_odra_value(user)?,
            long_tokens_burned: odra_wasm_client::types::IntoOdraValue::into_odra_value(
                long_tokens_burned,
            )?,
            wcspr_amount: odra_wasm_client::types::IntoOdraValue::into_odra_value(wcspr_amount)?,
            fee_collected: odra_wasm_client::types::IntoOdraValue::into_odra_value(fee_collected)?,
        })
    }
    #[wasm_bindgen(js_name = "toJson")]
    pub fn to_json(&self) -> JsValue {
        JsValue::from_serde(self).unwrap_or(JsValue::null())
    }
    #[wasm_bindgen(setter)]
    pub fn set_user(&mut self, value: odra_wasm_client::types::Address) {
        self.user = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn user(&self) -> odra_wasm_client::types::Address {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.user.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_long_tokens_burned(&mut self, value: odra_wasm_client::types::U256) {
        self.long_tokens_burned =
            odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn long_tokens_burned(&self) -> odra_wasm_client::types::U256 {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.long_tokens_burned.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_wcspr_amount(&mut self, value: odra_wasm_client::types::U256) {
        self.wcspr_amount = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn wcspr_amount(&self) -> odra_wasm_client::types::U256 {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.wcspr_amount.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_fee_collected(&mut self, value: odra_wasm_client::types::U256) {
        self.fee_collected =
            odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn fee_collected(&self) -> odra_wasm_client::types::U256 {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.fee_collected.clone())
    }
}
impl odra_wasm_client::casper_types::bytesrepr::FromBytes for LongWithdrawn {
    fn from_bytes(
        bytes: &[u8],
    ) -> Result<(Self, &[u8]), odra_wasm_client::casper_types::bytesrepr::Error> {
        let (user, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (long_tokens_burned, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (wcspr_amount, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (fee_collected, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        Ok((
            Self {
                user,
                long_tokens_burned,
                wcspr_amount,
                fee_collected,
            },
            bytes,
        ))
    }
}
impl odra_wasm_client::casper_types::bytesrepr::ToBytes for LongWithdrawn {
    fn to_bytes(&self) -> Result<Vec<u8>, odra_wasm_client::casper_types::bytesrepr::Error> {
        let mut result = Vec::with_capacity(self.serialized_length());
        result.extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.user)?);
        result.extend(
            odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.long_tokens_burned)?,
        );
        result.extend(
            odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.wcspr_amount)?,
        );
        result.extend(
            odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.fee_collected)?,
        );
        Ok(result)
    }
    fn serialized_length(&self) -> usize {
        let mut result = 0;
        result += self.user.serialized_length();
        result += self.long_tokens_burned.serialized_length();
        result += self.wcspr_amount.serialized_length();
        result += self.fee_collected.serialized_length();
        result
    }
}
impl odra_wasm_client::casper_types::CLTyped for LongWithdrawn {
    fn cl_type() -> odra_wasm_client::casper_types::CLType {
        odra_wasm_client::casper_types::CLType::Any
    }
}
impl odra_wasm_client::types::IntoOdraValue<LongWithdrawn> for LongWithdrawn {
    fn into_odra_value(self) -> Result<LongWithdrawn, JsError> {
        Ok(self)
    }
}
impl odra_wasm_client::types::IntoWasmValue<LongWithdrawn> for LongWithdrawn {
    fn to_wasm_value(self) -> Self {
        self
    }
}
#[doc = ""]
#[derive(Debug, Clone, serde :: Serialize, serde :: Deserialize)]
#[wasm_bindgen(getter_with_clone)]
pub struct AddressMarketState {
    #[wasm_bindgen(js_name = "marketState")]
    pub market_state: MarketState,
    #[wasm_bindgen(js_name = "isPaused")]
    pub is_paused: bool,
    #[wasm_bindgen(js_name = "fee")]
    fee: odra_wasm_client::casper_types::U256,
    #[wasm_bindgen(js_name = "wcsprBalance")]
    wcspr_balance: odra_wasm_client::casper_types::U256,
    #[wasm_bindgen(js_name = "longTokenBalance")]
    long_token_balance: odra_wasm_client::casper_types::U256,
    #[wasm_bindgen(js_name = "shortTokenBalance")]
    short_token_balance: odra_wasm_client::casper_types::U256,
    #[wasm_bindgen(js_name = "marketAllowance")]
    market_allowance: odra_wasm_client::casper_types::U256,
    #[wasm_bindgen(js_name = "longPositionValue")]
    long_position_value: odra_wasm_client::casper_types::U256,
    #[wasm_bindgen(js_name = "shortPositionValue")]
    short_position_value: odra_wasm_client::casper_types::U256,
    #[wasm_bindgen(js_name = "totalPositionValue")]
    total_position_value: odra_wasm_client::casper_types::U256,
    #[wasm_bindgen(js_name = "longSharePercentage")]
    long_share_percentage: odra_wasm_client::casper_types::U256,
    #[wasm_bindgen(js_name = "shortSharePercentage")]
    short_share_percentage: odra_wasm_client::casper_types::U256,
    #[wasm_bindgen(js_name = "config")]
    pub config: Config,
}
#[wasm_bindgen]
impl AddressMarketState {
    #[wasm_bindgen(constructor)]
    pub fn new(
        #[wasm_bindgen(js_name = "marketState")] market_state: MarketState,
        #[wasm_bindgen(js_name = "isPaused")] is_paused: bool,
        #[wasm_bindgen(js_name = "fee")] fee: odra_wasm_client::types::U256,
        #[wasm_bindgen(js_name = "wcsprBalance")] wcspr_balance: odra_wasm_client::types::U256,
        #[wasm_bindgen(js_name = "longTokenBalance")]
        long_token_balance: odra_wasm_client::types::U256,
        #[wasm_bindgen(js_name = "shortTokenBalance")]
        short_token_balance: odra_wasm_client::types::U256,
        #[wasm_bindgen(js_name = "marketAllowance")]
        market_allowance: odra_wasm_client::types::U256,
        #[wasm_bindgen(js_name = "longPositionValue")]
        long_position_value: odra_wasm_client::types::U256,
        #[wasm_bindgen(js_name = "shortPositionValue")]
        short_position_value: odra_wasm_client::types::U256,
        #[wasm_bindgen(js_name = "totalPositionValue")]
        total_position_value: odra_wasm_client::types::U256,
        #[wasm_bindgen(js_name = "longSharePercentage")]
        long_share_percentage: odra_wasm_client::types::U256,
        #[wasm_bindgen(js_name = "shortSharePercentage")]
        short_share_percentage: odra_wasm_client::types::U256,
        #[wasm_bindgen(js_name = "config")] config: Config,
    ) -> Result<Self, JsError> {
        Ok(Self {
            market_state,
            is_paused,
            fee: odra_wasm_client::types::IntoOdraValue::into_odra_value(fee)?,
            wcspr_balance: odra_wasm_client::types::IntoOdraValue::into_odra_value(wcspr_balance)?,
            long_token_balance: odra_wasm_client::types::IntoOdraValue::into_odra_value(
                long_token_balance,
            )?,
            short_token_balance: odra_wasm_client::types::IntoOdraValue::into_odra_value(
                short_token_balance,
            )?,
            market_allowance: odra_wasm_client::types::IntoOdraValue::into_odra_value(
                market_allowance,
            )?,
            long_position_value: odra_wasm_client::types::IntoOdraValue::into_odra_value(
                long_position_value,
            )?,
            short_position_value: odra_wasm_client::types::IntoOdraValue::into_odra_value(
                short_position_value,
            )?,
            total_position_value: odra_wasm_client::types::IntoOdraValue::into_odra_value(
                total_position_value,
            )?,
            long_share_percentage: odra_wasm_client::types::IntoOdraValue::into_odra_value(
                long_share_percentage,
            )?,
            short_share_percentage: odra_wasm_client::types::IntoOdraValue::into_odra_value(
                short_share_percentage,
            )?,
            config,
        })
    }
    #[wasm_bindgen(js_name = "toJson")]
    pub fn to_json(&self) -> JsValue {
        JsValue::from_serde(self).unwrap_or(JsValue::null())
    }
    #[wasm_bindgen(setter)]
    pub fn set_fee(&mut self, value: odra_wasm_client::types::U256) {
        self.fee = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn fee(&self) -> odra_wasm_client::types::U256 {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.fee.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_wcspr_balance(&mut self, value: odra_wasm_client::types::U256) {
        self.wcspr_balance =
            odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn wcspr_balance(&self) -> odra_wasm_client::types::U256 {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.wcspr_balance.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_long_token_balance(&mut self, value: odra_wasm_client::types::U256) {
        self.long_token_balance =
            odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn long_token_balance(&self) -> odra_wasm_client::types::U256 {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.long_token_balance.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_short_token_balance(&mut self, value: odra_wasm_client::types::U256) {
        self.short_token_balance =
            odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn short_token_balance(&self) -> odra_wasm_client::types::U256 {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.short_token_balance.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_market_allowance(&mut self, value: odra_wasm_client::types::U256) {
        self.market_allowance =
            odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn market_allowance(&self) -> odra_wasm_client::types::U256 {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.market_allowance.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_long_position_value(&mut self, value: odra_wasm_client::types::U256) {
        self.long_position_value =
            odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn long_position_value(&self) -> odra_wasm_client::types::U256 {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.long_position_value.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_short_position_value(&mut self, value: odra_wasm_client::types::U256) {
        self.short_position_value =
            odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn short_position_value(&self) -> odra_wasm_client::types::U256 {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.short_position_value.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_total_position_value(&mut self, value: odra_wasm_client::types::U256) {
        self.total_position_value =
            odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn total_position_value(&self) -> odra_wasm_client::types::U256 {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.total_position_value.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_long_share_percentage(&mut self, value: odra_wasm_client::types::U256) {
        self.long_share_percentage =
            odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn long_share_percentage(&self) -> odra_wasm_client::types::U256 {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.long_share_percentage.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_short_share_percentage(&mut self, value: odra_wasm_client::types::U256) {
        self.short_share_percentage =
            odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn short_share_percentage(&self) -> odra_wasm_client::types::U256 {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.short_share_percentage.clone())
    }
}
impl odra_wasm_client::casper_types::bytesrepr::FromBytes for AddressMarketState {
    fn from_bytes(
        bytes: &[u8],
    ) -> Result<(Self, &[u8]), odra_wasm_client::casper_types::bytesrepr::Error> {
        let (market_state, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (is_paused, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (fee, bytes) = odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (wcspr_balance, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (long_token_balance, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (short_token_balance, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (market_allowance, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (long_position_value, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (short_position_value, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (total_position_value, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (long_share_percentage, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (short_share_percentage, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (config, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        Ok((
            Self {
                market_state,
                is_paused,
                fee,
                wcspr_balance,
                long_token_balance,
                short_token_balance,
                market_allowance,
                long_position_value,
                short_position_value,
                total_position_value,
                long_share_percentage,
                short_share_percentage,
                config,
            },
            bytes,
        ))
    }
}
impl odra_wasm_client::casper_types::bytesrepr::ToBytes for AddressMarketState {
    fn to_bytes(&self) -> Result<Vec<u8>, odra_wasm_client::casper_types::bytesrepr::Error> {
        let mut result = Vec::with_capacity(self.serialized_length());
        result.extend(
            odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.market_state)?,
        );
        result
            .extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.is_paused)?);
        result.extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.fee)?);
        result.extend(
            odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.wcspr_balance)?,
        );
        result.extend(
            odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.long_token_balance)?,
        );
        result.extend(
            odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(
                &self.short_token_balance,
            )?,
        );
        result.extend(
            odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.market_allowance)?,
        );
        result.extend(
            odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(
                &self.long_position_value,
            )?,
        );
        result.extend(
            odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(
                &self.short_position_value,
            )?,
        );
        result.extend(
            odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(
                &self.total_position_value,
            )?,
        );
        result.extend(
            odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(
                &self.long_share_percentage,
            )?,
        );
        result.extend(
            odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(
                &self.short_share_percentage,
            )?,
        );
        result.extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.config)?);
        Ok(result)
    }
    fn serialized_length(&self) -> usize {
        let mut result = 0;
        result += self.market_state.serialized_length();
        result += self.is_paused.serialized_length();
        result += self.fee.serialized_length();
        result += self.wcspr_balance.serialized_length();
        result += self.long_token_balance.serialized_length();
        result += self.short_token_balance.serialized_length();
        result += self.market_allowance.serialized_length();
        result += self.long_position_value.serialized_length();
        result += self.short_position_value.serialized_length();
        result += self.total_position_value.serialized_length();
        result += self.long_share_percentage.serialized_length();
        result += self.short_share_percentage.serialized_length();
        result += self.config.serialized_length();
        result
    }
}
impl odra_wasm_client::casper_types::CLTyped for AddressMarketState {
    fn cl_type() -> odra_wasm_client::casper_types::CLType {
        odra_wasm_client::casper_types::CLType::Any
    }
}
impl odra_wasm_client::types::IntoOdraValue<AddressMarketState> for AddressMarketState {
    fn into_odra_value(self) -> Result<AddressMarketState, JsError> {
        Ok(self)
    }
}
impl odra_wasm_client::types::IntoWasmValue<AddressMarketState> for AddressMarketState {
    fn to_wasm_value(self) -> Self {
        self
    }
}
#[doc = ""]
#[derive(Debug, Clone, serde :: Serialize, serde :: Deserialize)]
#[wasm_bindgen(getter_with_clone)]
pub struct Mint {
    #[wasm_bindgen(js_name = "recipient")]
    recipient: odra_wasm_client::OdraAddress,
    #[wasm_bindgen(js_name = "amount")]
    amount: odra_wasm_client::casper_types::U256,
}
#[wasm_bindgen]
impl Mint {
    #[wasm_bindgen(constructor)]
    pub fn new(
        #[wasm_bindgen(js_name = "recipient")] recipient: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "amount")] amount: odra_wasm_client::types::U256,
    ) -> Result<Self, JsError> {
        Ok(Self {
            recipient: odra_wasm_client::types::IntoOdraValue::into_odra_value(recipient)?,
            amount: odra_wasm_client::types::IntoOdraValue::into_odra_value(amount)?,
        })
    }
    #[wasm_bindgen(js_name = "toJson")]
    pub fn to_json(&self) -> JsValue {
        JsValue::from_serde(self).unwrap_or(JsValue::null())
    }
    #[wasm_bindgen(setter)]
    pub fn set_recipient(&mut self, value: odra_wasm_client::types::Address) {
        self.recipient = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn recipient(&self) -> odra_wasm_client::types::Address {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.recipient.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_amount(&mut self, value: odra_wasm_client::types::U256) {
        self.amount = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn amount(&self) -> odra_wasm_client::types::U256 {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.amount.clone())
    }
}
impl odra_wasm_client::casper_types::bytesrepr::FromBytes for Mint {
    fn from_bytes(
        bytes: &[u8],
    ) -> Result<(Self, &[u8]), odra_wasm_client::casper_types::bytesrepr::Error> {
        let (recipient, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (amount, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        Ok((Self { recipient, amount }, bytes))
    }
}
impl odra_wasm_client::casper_types::bytesrepr::ToBytes for Mint {
    fn to_bytes(&self) -> Result<Vec<u8>, odra_wasm_client::casper_types::bytesrepr::Error> {
        let mut result = Vec::with_capacity(self.serialized_length());
        result
            .extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.recipient)?);
        result.extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.amount)?);
        Ok(result)
    }
    fn serialized_length(&self) -> usize {
        let mut result = 0;
        result += self.recipient.serialized_length();
        result += self.amount.serialized_length();
        result
    }
}
impl odra_wasm_client::casper_types::CLTyped for Mint {
    fn cl_type() -> odra_wasm_client::casper_types::CLType {
        odra_wasm_client::casper_types::CLType::Any
    }
}
impl odra_wasm_client::types::IntoOdraValue<Mint> for Mint {
    fn into_odra_value(self) -> Result<Mint, JsError> {
        Ok(self)
    }
}
impl odra_wasm_client::types::IntoWasmValue<Mint> for Mint {
    fn to_wasm_value(self) -> Self {
        self
    }
}
#[doc = ""]
#[derive(Debug, Clone, serde :: Serialize, serde :: Deserialize)]
#[wasm_bindgen(getter_with_clone)]
pub struct SetAllowance {
    #[wasm_bindgen(js_name = "owner")]
    owner: odra_wasm_client::OdraAddress,
    #[wasm_bindgen(js_name = "spender")]
    spender: odra_wasm_client::OdraAddress,
    #[wasm_bindgen(js_name = "allowance")]
    allowance: odra_wasm_client::casper_types::U256,
}
#[wasm_bindgen]
impl SetAllowance {
    #[wasm_bindgen(constructor)]
    pub fn new(
        #[wasm_bindgen(js_name = "owner")] owner: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "spender")] spender: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "allowance")] allowance: odra_wasm_client::types::U256,
    ) -> Result<Self, JsError> {
        Ok(Self {
            owner: odra_wasm_client::types::IntoOdraValue::into_odra_value(owner)?,
            spender: odra_wasm_client::types::IntoOdraValue::into_odra_value(spender)?,
            allowance: odra_wasm_client::types::IntoOdraValue::into_odra_value(allowance)?,
        })
    }
    #[wasm_bindgen(js_name = "toJson")]
    pub fn to_json(&self) -> JsValue {
        JsValue::from_serde(self).unwrap_or(JsValue::null())
    }
    #[wasm_bindgen(setter)]
    pub fn set_owner(&mut self, value: odra_wasm_client::types::Address) {
        self.owner = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn owner(&self) -> odra_wasm_client::types::Address {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.owner.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_spender(&mut self, value: odra_wasm_client::types::Address) {
        self.spender = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn spender(&self) -> odra_wasm_client::types::Address {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.spender.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_allowance(&mut self, value: odra_wasm_client::types::U256) {
        self.allowance = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn allowance(&self) -> odra_wasm_client::types::U256 {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.allowance.clone())
    }
}
impl odra_wasm_client::casper_types::bytesrepr::FromBytes for SetAllowance {
    fn from_bytes(
        bytes: &[u8],
    ) -> Result<(Self, &[u8]), odra_wasm_client::casper_types::bytesrepr::Error> {
        let (owner, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (spender, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (allowance, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        Ok((
            Self {
                owner,
                spender,
                allowance,
            },
            bytes,
        ))
    }
}
impl odra_wasm_client::casper_types::bytesrepr::ToBytes for SetAllowance {
    fn to_bytes(&self) -> Result<Vec<u8>, odra_wasm_client::casper_types::bytesrepr::Error> {
        let mut result = Vec::with_capacity(self.serialized_length());
        result.extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.owner)?);
        result.extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.spender)?);
        result
            .extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.allowance)?);
        Ok(result)
    }
    fn serialized_length(&self) -> usize {
        let mut result = 0;
        result += self.owner.serialized_length();
        result += self.spender.serialized_length();
        result += self.allowance.serialized_length();
        result
    }
}
impl odra_wasm_client::casper_types::CLTyped for SetAllowance {
    fn cl_type() -> odra_wasm_client::casper_types::CLType {
        odra_wasm_client::casper_types::CLType::Any
    }
}
impl odra_wasm_client::types::IntoOdraValue<SetAllowance> for SetAllowance {
    fn into_odra_value(self) -> Result<SetAllowance, JsError> {
        Ok(self)
    }
}
impl odra_wasm_client::types::IntoWasmValue<SetAllowance> for SetAllowance {
    fn to_wasm_value(self) -> Self {
        self
    }
}
#[doc = ""]
#[derive(Debug, Clone, serde :: Serialize, serde :: Deserialize)]
#[wasm_bindgen(getter_with_clone)]
pub struct DecreaseAllowance {
    #[wasm_bindgen(js_name = "owner")]
    owner: odra_wasm_client::OdraAddress,
    #[wasm_bindgen(js_name = "spender")]
    spender: odra_wasm_client::OdraAddress,
    #[wasm_bindgen(js_name = "allowance")]
    allowance: odra_wasm_client::casper_types::U256,
    #[wasm_bindgen(js_name = "decrBy")]
    decr_by: odra_wasm_client::casper_types::U256,
}
#[wasm_bindgen]
impl DecreaseAllowance {
    #[wasm_bindgen(constructor)]
    pub fn new(
        #[wasm_bindgen(js_name = "owner")] owner: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "spender")] spender: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "allowance")] allowance: odra_wasm_client::types::U256,
        #[wasm_bindgen(js_name = "decrBy")] decr_by: odra_wasm_client::types::U256,
    ) -> Result<Self, JsError> {
        Ok(Self {
            owner: odra_wasm_client::types::IntoOdraValue::into_odra_value(owner)?,
            spender: odra_wasm_client::types::IntoOdraValue::into_odra_value(spender)?,
            allowance: odra_wasm_client::types::IntoOdraValue::into_odra_value(allowance)?,
            decr_by: odra_wasm_client::types::IntoOdraValue::into_odra_value(decr_by)?,
        })
    }
    #[wasm_bindgen(js_name = "toJson")]
    pub fn to_json(&self) -> JsValue {
        JsValue::from_serde(self).unwrap_or(JsValue::null())
    }
    #[wasm_bindgen(setter)]
    pub fn set_owner(&mut self, value: odra_wasm_client::types::Address) {
        self.owner = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn owner(&self) -> odra_wasm_client::types::Address {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.owner.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_spender(&mut self, value: odra_wasm_client::types::Address) {
        self.spender = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn spender(&self) -> odra_wasm_client::types::Address {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.spender.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_allowance(&mut self, value: odra_wasm_client::types::U256) {
        self.allowance = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn allowance(&self) -> odra_wasm_client::types::U256 {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.allowance.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_decr_by(&mut self, value: odra_wasm_client::types::U256) {
        self.decr_by = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn decr_by(&self) -> odra_wasm_client::types::U256 {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.decr_by.clone())
    }
}
impl odra_wasm_client::casper_types::bytesrepr::FromBytes for DecreaseAllowance {
    fn from_bytes(
        bytes: &[u8],
    ) -> Result<(Self, &[u8]), odra_wasm_client::casper_types::bytesrepr::Error> {
        let (owner, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (spender, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (allowance, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (decr_by, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        Ok((
            Self {
                owner,
                spender,
                allowance,
                decr_by,
            },
            bytes,
        ))
    }
}
impl odra_wasm_client::casper_types::bytesrepr::ToBytes for DecreaseAllowance {
    fn to_bytes(&self) -> Result<Vec<u8>, odra_wasm_client::casper_types::bytesrepr::Error> {
        let mut result = Vec::with_capacity(self.serialized_length());
        result.extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.owner)?);
        result.extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.spender)?);
        result
            .extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.allowance)?);
        result.extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.decr_by)?);
        Ok(result)
    }
    fn serialized_length(&self) -> usize {
        let mut result = 0;
        result += self.owner.serialized_length();
        result += self.spender.serialized_length();
        result += self.allowance.serialized_length();
        result += self.decr_by.serialized_length();
        result
    }
}
impl odra_wasm_client::casper_types::CLTyped for DecreaseAllowance {
    fn cl_type() -> odra_wasm_client::casper_types::CLType {
        odra_wasm_client::casper_types::CLType::Any
    }
}
impl odra_wasm_client::types::IntoOdraValue<DecreaseAllowance> for DecreaseAllowance {
    fn into_odra_value(self) -> Result<DecreaseAllowance, JsError> {
        Ok(self)
    }
}
impl odra_wasm_client::types::IntoWasmValue<DecreaseAllowance> for DecreaseAllowance {
    fn to_wasm_value(self) -> Self {
        self
    }
}
#[doc = ""]
#[derive(Debug, Clone, serde :: Serialize, serde :: Deserialize)]
#[wasm_bindgen(getter_with_clone)]
pub struct ShortWithdrawn {
    #[wasm_bindgen(js_name = "user")]
    user: odra_wasm_client::OdraAddress,
    #[wasm_bindgen(js_name = "shortTokensBurned")]
    short_tokens_burned: odra_wasm_client::casper_types::U256,
    #[wasm_bindgen(js_name = "wcsprAmount")]
    wcspr_amount: odra_wasm_client::casper_types::U256,
    #[wasm_bindgen(js_name = "feeCollected")]
    fee_collected: odra_wasm_client::casper_types::U256,
}
#[wasm_bindgen]
impl ShortWithdrawn {
    #[wasm_bindgen(constructor)]
    pub fn new(
        #[wasm_bindgen(js_name = "user")] user: odra_wasm_client::types::Address,
        #[wasm_bindgen(js_name = "shortTokensBurned")]
        short_tokens_burned: odra_wasm_client::types::U256,
        #[wasm_bindgen(js_name = "wcsprAmount")] wcspr_amount: odra_wasm_client::types::U256,
        #[wasm_bindgen(js_name = "feeCollected")] fee_collected: odra_wasm_client::types::U256,
    ) -> Result<Self, JsError> {
        Ok(Self {
            user: odra_wasm_client::types::IntoOdraValue::into_odra_value(user)?,
            short_tokens_burned: odra_wasm_client::types::IntoOdraValue::into_odra_value(
                short_tokens_burned,
            )?,
            wcspr_amount: odra_wasm_client::types::IntoOdraValue::into_odra_value(wcspr_amount)?,
            fee_collected: odra_wasm_client::types::IntoOdraValue::into_odra_value(fee_collected)?,
        })
    }
    #[wasm_bindgen(js_name = "toJson")]
    pub fn to_json(&self) -> JsValue {
        JsValue::from_serde(self).unwrap_or(JsValue::null())
    }
    #[wasm_bindgen(setter)]
    pub fn set_user(&mut self, value: odra_wasm_client::types::Address) {
        self.user = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn user(&self) -> odra_wasm_client::types::Address {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.user.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_short_tokens_burned(&mut self, value: odra_wasm_client::types::U256) {
        self.short_tokens_burned =
            odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn short_tokens_burned(&self) -> odra_wasm_client::types::U256 {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.short_tokens_burned.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_wcspr_amount(&mut self, value: odra_wasm_client::types::U256) {
        self.wcspr_amount = odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn wcspr_amount(&self) -> odra_wasm_client::types::U256 {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.wcspr_amount.clone())
    }
    #[wasm_bindgen(setter)]
    pub fn set_fee_collected(&mut self, value: odra_wasm_client::types::U256) {
        self.fee_collected =
            odra_wasm_client::types::IntoOdraValue::into_odra_value(value).unwrap();
    }
    #[wasm_bindgen(getter)]
    pub fn fee_collected(&self) -> odra_wasm_client::types::U256 {
        odra_wasm_client::types::IntoWasmValue::to_wasm_value(self.fee_collected.clone())
    }
}
impl odra_wasm_client::casper_types::bytesrepr::FromBytes for ShortWithdrawn {
    fn from_bytes(
        bytes: &[u8],
    ) -> Result<(Self, &[u8]), odra_wasm_client::casper_types::bytesrepr::Error> {
        let (user, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (short_tokens_burned, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (wcspr_amount, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        let (fee_collected, bytes) =
            odra_wasm_client::casper_types::bytesrepr::FromBytes::from_bytes(bytes)?;
        Ok((
            Self {
                user,
                short_tokens_burned,
                wcspr_amount,
                fee_collected,
            },
            bytes,
        ))
    }
}
impl odra_wasm_client::casper_types::bytesrepr::ToBytes for ShortWithdrawn {
    fn to_bytes(&self) -> Result<Vec<u8>, odra_wasm_client::casper_types::bytesrepr::Error> {
        let mut result = Vec::with_capacity(self.serialized_length());
        result.extend(odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.user)?);
        result.extend(
            odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(
                &self.short_tokens_burned,
            )?,
        );
        result.extend(
            odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.wcspr_amount)?,
        );
        result.extend(
            odra_wasm_client::casper_types::bytesrepr::ToBytes::to_bytes(&self.fee_collected)?,
        );
        Ok(result)
    }
    fn serialized_length(&self) -> usize {
        let mut result = 0;
        result += self.user.serialized_length();
        result += self.short_tokens_burned.serialized_length();
        result += self.wcspr_amount.serialized_length();
        result += self.fee_collected.serialized_length();
        result
    }
}
impl odra_wasm_client::casper_types::CLTyped for ShortWithdrawn {
    fn cl_type() -> odra_wasm_client::casper_types::CLType {
        odra_wasm_client::casper_types::CLType::Any
    }
}
impl odra_wasm_client::types::IntoOdraValue<ShortWithdrawn> for ShortWithdrawn {
    fn into_odra_value(self) -> Result<ShortWithdrawn, JsError> {
        Ok(self)
    }
}
impl odra_wasm_client::types::IntoWasmValue<ShortWithdrawn> for ShortWithdrawn {
    fn to_wasm_value(self) -> Self {
        self
    }
}
