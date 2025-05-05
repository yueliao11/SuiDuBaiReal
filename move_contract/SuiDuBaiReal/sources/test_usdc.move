module suidubaireal::usdc;

use sui::coin;
use sui::coin::TreasuryCap;
use sui::url::{Self, Url};

public struct USDC has drop {}

fun init(otw: USDC, ctx: &mut TxContext) {
    let usdc_uri = url::new_unsafe_from_bytes(b"https://s21.ax1x.com/2025/04/14/pEWa4Tf.png");
    // 初始化 RWAS token
    let (treasury_cap, metadata) = coin::create_currency(
        otw,
        9,
        b"USDC",
        b"Usd Coin",
        b"Test Usdc On Sui",
        option::some<Url>(usdc_uri),
        ctx,
    );
    // 将所有权都转移给管理员
    transfer::public_transfer(treasury_cap, @admin);
    transfer::public_transfer(metadata, @admin);
}

// test_mint 函数用于测试 mint 函数
entry fun test_mint(
    treasury_cap: &mut TreasuryCap<USDC>,
    amount: u64,
    receiver: address,
    ctx: &mut TxContext
) {
    // 调用原生的mint函数
    coin::mint_and_transfer(
        treasury_cap,
        amount,
        receiver,
        ctx,
    );
}
