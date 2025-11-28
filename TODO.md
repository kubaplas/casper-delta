## TODO v0.2

- [x] Upgrade to Odra 2.3.1.
- [x] Connect Styks.
- [x] Make Mock of Styks.
- [x] Make fee configurable.
- [x] Remove set_price, rebalance before every mutable operation.
- [x] Make `Config` just Var (now is Submodule).
- [x] Unify Long and Short token contracts (pass in init if is long or short) (maybe have different Config then Market).
- [x] Reuse WrappedCSPR from odra_modules.
- [x] Migrate to access_control modules. Make set_config behind ConfigRole.
- [ ] In CLI use set_config and set_permissions implementation pattern from Styks.
- [x] Make contract pauseable
- [x] Wrap WCSPR to include faucet and disable transfers between users.
- [x] For competition disable transfers between users in PositionToken.

--------------

## TODO v0.1

Website:
- Display the state of the system.
- Display the user's state.
- Use CasperWallet.
- Show whitepaper.
- Show trading rules.
- Display the leaderboard.

Bot:
- Write `casper-delta-bot` with at least three interesting strategies.

Market:
- Add `admin_cspr_withdraw` in case someone sends tokens directly to the
  contract. Or method to sync the balance of the contract with the balance of
  the contract's account.

WCSPR:
- Add `faucet()` to WCSPR contract, and turn off transfers.
- Transfer to itself generates new WCSPR tokens.

Other:
- Configure Telegram.


