Feature: Casper Shorts Competition tests

    Background: Setting up competition
        Given Admin changed the wcspr to faucetable wcspr
        And Admin paused the market
        And Admin disabled peer transfers

    Scenario: Check configuration
        Then market is paused

    Scenario: Peer transfers disabled
        Given Admin unpaused the market
        When Alice uses the faucet
        And Alice allows MarketContract to spend 1000 WCSPR
        When Alice goes long with 300 WCSPR
        Then Alice cannot transfer 100 LONG to Bob
        Given Admin enabled peer transfers
        Then Alice transfers 100 LONG to Bob

    Scenario: Using faucet
        When Alice uses the faucet
        Then Alice has 1000 WCSPR
        When Alice uses the faucet
        Then Alice has 1000 WCSPR

    Scenario: Using market in competition, by going long and withdrawing
        Given Admin unpaused the market
        When Alice uses the faucet
        And Alice allows MarketContract to spend 1000 WCSPR
        When Alice goes long with 300 WCSPR
        When Alice withdraws 200 LONG
        Then Alice has 98.5 LONG
        Then FeeCollector has 2.5 WCSPR
        Then Alice has 899 WCSPR
        Then MarketContract has 98.5 WCSPR
