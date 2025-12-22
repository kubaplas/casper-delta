use anyhow::{Context, Result};
use chrono::Utc;
use regex::Regex;
use serde::{Deserialize, Serialize};
use sqlx::sqlite::SqlitePoolOptions;
use std::process::Command;
use std::time::Duration;
use tokio::time::interval;

#[derive(Debug, Serialize, Deserialize)]
struct MarketState {
    long_total_supply: String,
    short_total_supply: String,
    long_liquidity: String,
    short_liquidity: String,
    price: String,
}

#[tokio::main]
async fn main() -> Result<()> {
    // 1. Initialize SQLite database
    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(&format!("sqlite://market_data.db"))
        .await?;

    // Create table if not exists
    sqlx::query(
        "CREATE TABLE IF NOT EXISTS market_states (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            long_total_supply TEXT NOT NULL,
            short_total_supply TEXT NOT NULL,
            long_liquidity TEXT NOT NULL,
            short_liquidity TEXT NOT NULL,
            price TEXT NOT NULL
        )",
    )
    .execute(&pool)
    .await?;

    println!("Collector started. Polling market state every 5 minutes...");

    // 2. Poll every 5 minutes
    let mut poll_interval = interval(Duration::from_secs(300));
    let json_regex = Regex::new(r"(?s)\{.*\n\}")?;

    loop {
        poll_interval.tick().await;
        println!("Fetching market state at {}", Utc::now());

        match fetch_and_store_data(&pool, &json_regex).await {
            Ok(_) => println!("Successfully stored market state."),
            Err(e) => eprintln!("Error fetching/storing data: {:?}", e),
        }
    }
}

async fn fetch_and_store_data(pool: &sqlx::SqlitePool, regex: &Regex) -> Result<()> {
    // Run CLI command
    // cargo run --bin casper-delta-cli -- contract Market get_market_state
    let output = Command::new("cargo")
        .args([
            "run",
            "--bin",
            "casper-delta-cli",
            "--",
            "contract",
            "Market",
            "get_market_state",
        ])
        .output()
        .context("Failed to execute cargo command")?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    
    // Extract JSON from output
    // The output contains logs like "💁  INFO : Call result: { ... }"
    let json_str = regex
        .find(&stdout)
        .context("Could not find JSON in CLI output")?
        .as_str();

    let state: MarketState = serde_json::from_str(json_str).context("Failed to parse JSON")?;

    // Store in database
    sqlx::query(
        "INSERT INTO market_states (long_total_supply, short_total_supply, long_liquidity, short_liquidity, price)
         VALUES (?, ?, ?, ?, ?)"
    )
    .bind(&state.long_total_supply)
    .bind(&state.short_total_supply)
    .bind(&state.long_liquidity)
    .bind(&state.short_liquidity)
    .bind(&state.price)
    .execute(pool)
    .await?;

    Ok(())
}
