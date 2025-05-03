module suidubaireal::rwas;
use sui::coin;
use sui::coin::TreasuryCap;

public struct RWAS has drop {}


fun init (otw: RWAS, ctx: &mut TxContext) {
    // 初始化 RWAS token
    let (treasury_cap, metadata) = coin::create_currency(
        otw,
        9,
        b"RWAS",
        b"Rwas",
        b"Real World Asset Sui",
        option::none(),
        ctx,
    );
    // 将所有权都转移给管理员
    transfer::public_transfer(treasury_cap, @admin);
    transfer::public_transfer(metadata, @admin);
}

// test_mint 函数用于测试 mint 函数
entry fun test_mint(
    treasury_cap: &mut TreasuryCap<RWAS>,
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