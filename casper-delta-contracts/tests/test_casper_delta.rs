use crate::common::world::CasperShortsWorld;

mod common;
mod steps;

fn main() {
    odra_bdd::run::<CasperShortsWorld>("./tests/features/");
}
