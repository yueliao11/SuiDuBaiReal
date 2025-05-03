module suidubaireal::stake;
use sui::balance::{Self, Balance};
use sui::clock::{Self, Clock};
use sui::coin::{Self, Coin};
use  sui::event;
use sui::table::{Self, Table};

use suidubaireal::rwas::RWAS;

const ENotStaked: u64 = 0;
const EInsufficientStakedAmount: u64 = 1;
const EInsufficientStakedPoolBalance: u64 = 2;



/// 用户质押信息对象
/// 每个质押用户拥有一个此对象
public struct StakeInfo has key, store {
    id: UID,
    owner: address,
    /// 用户质押的 RWAS 代币余额
    staked_amount: u64,
    /// 质押时间戳 (用于计算基于时间的奖励)
    stake_timestamp: u64,
    /// 累积的待领取奖励 (RWAS 代币)
    accumulated_rewards: u64,
    /// 上次奖励计算的时间戳 (用于增量计算奖励)
    last_reward_calculation: u64,
}

/// 质押池对象
/// 存储协议级别的质押状态和奖励资金
public struct StakePool has key {
    id: UID,
    /// 所有用户质押的总 RWAS 数量
    total_staked: Balance<RWAS>,
    /// 奖励率 (例如，每秒/每区块发放的奖励数量，需要根据实际奖励模型设计)
    /// 简化的示例中使用一个 u64，实际需要更精密的计算
    reward_rate: u64,
    /// 存储用于发放奖励的 RWAS 代币余额
    reward_treasury: Balance<RWAS>,
    /// 用户 StakeInfo 对象的存储 (使用 Table 按用户地址索引)
    user_stakes: Table<address, StakeInfo>,
}

/// 事件：用户质押
public struct StakedEvent has copy, drop {
    user: address,
    amount: u64,
}

/// 事件：用户解除质押
public struct UnstakedEvent has copy, drop {
    user: address,
    amount: u64,
}

fun init(ctx: &mut TxContext) {
    // 创建质押池对象
    let pool = StakePool {
        id: object::new(ctx),
        total_staked: balance::zero(),
        reward_rate: 1250, // 初始奖励率
        reward_treasury: balance::zero(), // 初始奖励资金为零
        user_stakes: table::new(ctx),
    };

    // 将质押池对象共享，使其可被其他用户调用入口函数
    transfer::share_object(pool);
}

/// 用户质押 RWAS 代币的入口函数
public entry fun stake(
    pool: &mut StakePool,
    rwas_coin: Coin<RWAS>,
    clock: &Clock,
    ctx: &mut TxContext
) {
    // 获取当前用户的地址
    let sender = tx_context::sender(ctx);
    let amount = rwas_coin.value();
    // 将用户发送的 RWAS Coin 转换为 Balance
    let rwas_balance = coin::into_balance(rwas_coin);
    let current_timestamp = clock::timestamp_ms(clock); // 获取当前时间戳 (毫秒)

    // 计算并累积用户已有的奖励 (如果在质押前有未领取的奖励)
    if (table::contains(&pool.user_stakes, sender)) {
        let stake_info = table::borrow_mut(&mut pool.user_stakes, sender);
        // TODO: 根据上次计算时间到当前时间，计算累积奖励并加到 stake_info.accumulated_rewards
        // 需要调用 calculate_pending_rewards 函数
        // let pending = calculate_pending_rewards(stake_info, pool.reward_rate, current_timestamp);
        // 将新的质押数量加到用户的 staked_amount 中
        stake_info.staked_amount = stake_info.staked_amount + amount;
        stake_info.last_reward_calculation = current_timestamp; // 更新上次计算时间
    } else {
        // 如果是第一次质押，创建新的 StakeInfo 对象
        let stake_info = StakeInfo {
            id: object::new(ctx),
            owner: sender,
            staked_amount: amount,
            stake_timestamp: current_timestamp,
            accumulated_rewards: 0,
            last_reward_calculation: current_timestamp,
        };
        // 将新的 StakeInfo 对象存入 Table
        table::add(&mut pool.user_stakes, sender, stake_info);
    };
    // 更新质押池的总质押数量
    pool.total_staked.join(rwas_balance); // 复制 Balance 加入总质押

    // 发出质押事件
    event::emit(StakedEvent {
        user: sender,
        amount
    });
}

/// 用户解除质押的入口函数
public entry fun unstake(
    pool: &mut StakePool,
    amount: u64, // 解除质押的数量
    clock: &Clock,
    ctx: &mut TxContext
) {
    let sender = tx_context::sender(ctx);
    let current_timestamp = clock::timestamp_ms(clock); // 获取当前时间戳 (毫秒)

    // 检查用户是否存在质押信息
    assert!(table::contains(&pool.user_stakes, sender), ENotStaked);

    let stake_info = table::borrow_mut(&mut pool.user_stakes, sender);

    // 计算并累积用户在解除质押前的奖励
    // TODO: 根据上次计算时间到当前时间，计算累积奖励并加到 stake_info.accumulated_rewards
    // let pending = calculate_pending_rewards(stake_info, pool.reward_rate, current_timestamp);
    // stake_info.accumulated_rewards = stake_info.accumulated_rewards + pending;
    stake_info.last_reward_calculation = current_timestamp; // 更新上次计算时间

    // 检查解除质押数量是否有效
    assert!(stake_info.staked_amount >= amount, EInsufficientStakedAmount);

    // 从用户的质押数量中减去要解除质押的数量
    stake_info.staked_amount = stake_info.staked_amount - amount;

    // 从质押池的总质押余额中分割出要解除质押的 Balance
    // 确保质押池有足够的余额 (理论上，如果 staked_amount 总和等于 total_staked，这里总是足够的)
    assert!(pool.total_staked.value() >= amount, EInsufficientStakedPoolBalance); // 额外的检查
    if (stake_info.staked_amount > amount){
        let unstaked_balance = pool.total_staked.split(amount);
        // 将解除质押的 RWAS Coin 转移给用户
        let unstaked_coin = coin::from_balance(unstaked_balance, ctx);
        transfer::public_transfer(unstaked_coin, sender);
    } else if (stake_info.staked_amount == amount) {
        let unstaked_balance = coin::take(&mut pool.total_staked, amount,  ctx);
        // 将解除质押的 RWAS Coin 转移给用户
        transfer::public_transfer(unstaked_balance, sender);
    };
    // 如果用户解除了所有质押，可以移除 StakeInfo 对象
    // if (stake_info.staked_amount == 0) {
    //     let removed_stake_info = table::remove(&mut pool.user_stakes, sender);
    //     // TODO: 处理移除的 StakeInfo 对象，例如销毁或转移给用户（如果 StakeInfo 本身有价值）
    //     object::delete(removed_stake_info.id); // 如果 StakeInfo 没有其他价值，可以删除
    // };

    // 发出解除质押事件
    event::emit(UnstakedEvent {
        user: sender,
        amount
    });
}

