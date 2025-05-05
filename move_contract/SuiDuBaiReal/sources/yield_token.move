module suidubaireal::yield_token;

use sui::coin::{Self, TreasuryCap, CoinMetadata, Coin};
use sui::table::{Self, Table};

use suidubaireal::spd_management::{AdminCap, is_admin, not_admin};

public struct YieldTokenManager has key {
    id: UID,
    yield_token_table: Table<address, address>, // SPD ID -> Yield Token Address
}

public struct YieldTokenInfo<phantom T> has key {
    id: UID,
    spd_id: address,
    yield_token_treasury_cap: TreasuryCap<T>,
    yield_token_metadata: CoinMetadata<T>,
}

fun init(ctx: &mut TxContext) {
    // 初始化 YieldTokenManager
    let yield_token_manager = YieldTokenManager {
        id: object::new(ctx),
        yield_token_table: table::new(ctx),
    };
    // 将 YieldTokenManager 设置为共享对象
    transfer::share_object(yield_token_manager);
}

// 创建 yield token info
public fun create_yield_token_info<T>(
    admin_cap: &AdminCap,
    spd_id: address,
    yield_token_treasury_cap: TreasuryCap<T>,
    yield_token_metadata: CoinMetadata<T>,
    ctx: &mut TxContext
) {
    // 检查管理员权限
    if (!is_admin(admin_cap, ctx)) {
        not_admin();
    };
    // 创建 yield token info
    let yield_token_info = YieldTokenInfo {
        id: object::new(ctx),
        spd_id,
        yield_token_treasury_cap,
        yield_token_metadata,
    };
    // 将 yield token info 设置为共享对象
    transfer::share_object(yield_token_info);
}

// mint 某个项目的 yield token
public fun mint<T>(
    admin_cap: &AdminCap,
    yield_token_info: &mut YieldTokenInfo<T>,
    amount: u64,
    recipient: address,
    ctx: &mut TxContext
) {
    // 检查管理员权限
    if (!is_admin(admin_cap, ctx)) {
        not_admin();
    };
    // mint yield token
    coin::mint_and_transfer(&mut yield_token_info.yield_token_treasury_cap, amount, recipient, ctx);
}

// 使用 usdc 来直接购买 yield token
public fun purchase_yield_token<T, U>(
    yield_token_info: &mut YieldTokenInfo<T>,
    usdc: Coin<U>,
    recipient: address,
    ctx: &mut TxContext
) {
    // 获取传入的 usdc 余额
    let usdc_balance = usdc.value();
    // 将 usdc 数量按照 80% 的比例兑换为 yield token
    let yield_token_amount = usdc_balance * 4 / 5;
    // 接受发送的 usdc
    transfer::public_transfer(usdc, @admin);
    // mint yield token
    coin::mint_and_transfer(&mut yield_token_info.yield_token_treasury_cap, yield_token_amount, recipient, ctx);
}


