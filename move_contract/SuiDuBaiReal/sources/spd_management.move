module suidubaireal::spd_management;
use std::string::String;
use sui::event;
use sui::clock::{Self, Clock};

// 错误码
const E_ADMIN_ONLY: u64 = 1;

public struct AdminCap has key {
    id: UID,                               // 对象唯一标识符 [cite: 2]
    admin_address: address,                // 管理员地址 [cite: 2]
}

public struct SPD has key {
    id: UID,                               // 对象唯一标识符 [cite: 2]
    spv_identifier: String,                // 链下法律实体/房产标识符 [cite: 2]
    profit_receiver_address: address,      // 接收年度稳定币利润的Sui地址 [cite: 2]
    yield_token_type: String,              // 关联的房产收益代币标识符 [cite: 2]
    distribution_module_id: ID,            // 分配逻辑模块的ID [cite: 2]
    property_name: String,                 // 房产名称 [cite: 2]
    property_location: String,             // 房产位置 [cite: 2]
    property_type: String,                 // 房产类型 [cite: 2]
    property_area: u64,                    // 房产面积（平方米） [cite: 3]
    expected_annual_yield: u64,            // 预期年化收益率（基点，10000=100%） [cite: 3]
    creation_timestamp: u64,               // 创建时间戳 [cite: 3]
    last_distribution_timestamp: u64,      // 上次分配时间戳 [cite: 3]
    metadata_uri: String,                  // // 元数据URI（指向房产详细信息） [cite: 3]
    status: bool,                        // SPD状态（"active"或"inactive"） [cite: 3]
}


// Spd创建事件
public struct SpdCreatedEvent has copy, drop {
    spd_id: address,                           // SPD对象的唯一标识符 [cite: 3]
    spv_identifier: String,                // 链下法律实体/房产标识符 [cite: 3]
    profit_receiver_address: address,      // 接收年度稳定币利润的Sui地址 [cite: 3]
    yield_token_type: String,              // 关联的房产收益代币标识符 [cite: 3]
    distribution_module_id: ID,            // 分配逻辑模块的ID [cite: 3]
    property_name: String,                 // 房产名称 [cite: 3]
    property_location: String,             // 房产位置 [cite: 3]
    property_type: String,                 // 房产类型 [cite: 3]
    property_area: u64,                    // 房产面积（平方米） [cite: 3]
    expected_annual_yield: u64,            // 预期年化收益率（基点，10000=100%） [cite: 3]
    creation_timestamp: u64,               // 创建时间戳 [cite: 3]
    last_distribution_timestamp: u64,      // 上次分配时间戳 [cite: 3]
    metadata_uri: String,                  // 元数据URI（指向房产详细信息） [cite: 3]
    status: bool,                        // SPD状态（"active"或"inactive"） [cite: 3]
}

fun init(ctx: &mut TxContext) {
    // 创建一个新的AdminCap
    let admin_cap = AdminCap {
        id: object::new(ctx),
        admin_address: @admin,
    };
    // 将AdminCap的所有权转移给管理员
    transfer::transfer(admin_cap, @admin);
}

// 创建新的SPD对象
public fun create_spd(
    admin_cap: &AdminCap,
    spv_identifier: String,
    profit_receiver_address: address,
    yield_token_type: String,
    distribution_module_id: ID,
    property_name: String,
    property_location: String,
    property_type: String,
    property_area: u64,
    expected_annual_yield: u64,
    metadata_uri: String,
    clock: &Clock,
    ctx: &mut TxContext
) {
    // 检查调用者是否是管理员
    if  (admin_cap.admin_address != ctx.sender()) {
        not_admin();
    };
    // 创建新的SPD对象
    let spd = SPD {
        id: object::new(ctx),
        spv_identifier,
        profit_receiver_address,
        yield_token_type,
        distribution_module_id,
        property_name,
        property_location,
        property_type,
        property_area,
        expected_annual_yield,
        creation_timestamp: clock::timestamp_ms(clock),
        last_distribution_timestamp: clock::timestamp_ms(clock),
        metadata_uri,
        status: true, // 默认状态为"active"
    };

    // 创建SpdCreatedEvent事件
    event::emit(SpdCreatedEvent {
        spd_id: object::uid_to_address(&spd.id),
        spv_identifier: spd.spv_identifier,
        profit_receiver_address: spd.profit_receiver_address,
        yield_token_type: spd.yield_token_type,
        distribution_module_id: spd.distribution_module_id,
        property_name: spd.property_name,
        property_location: spd.property_location,
        property_type: spd.property_type,
        property_area: spd.property_area,
        expected_annual_yield: spd.expected_annual_yield,
        creation_timestamp: spd.creation_timestamp,
        last_distribution_timestamp: spd.last_distribution_timestamp,
        metadata_uri: spd.metadata_uri,
        status: spd.status,
    });

    // 将SPD对象的设置为共享对象
    transfer::share_object(spd);
}

// 更新利润接收地址
public fun update_profit_receiver(
    admin_cap: &AdminCap,
    spd: &mut SPD,
    new_profit_receiver_address: address,
    ctx: &mut TxContext
) {
    // 检查调用者是否是管理员
    if (admin_cap.admin_address!= ctx.sender()) {
        not_admin();
    };
    // 更新SPD对象的利润接收地址
    spd.profit_receiver_address = new_profit_receiver_address;
}


// 更新预期收益率(由预言机动态调用并调控)


// view function

// 获取SPD对象的详细信息

public fun get_spd_details(spd: &SPD): SpdCreatedEvent {
    // 返回SPD对象的详细信息
    SpdCreatedEvent {
        spd_id: object::uid_to_address(&spd.id),
        spv_identifier: spd.spv_identifier,
        profit_receiver_address: spd.profit_receiver_address,
        yield_token_type: spd.yield_token_type,
        distribution_module_id: spd.distribution_module_id,
        property_name: spd.property_name,
        property_location: spd.property_location,
        property_type: spd.property_type,
        property_area: spd.property_area,
        expected_annual_yield: spd.expected_annual_yield,
        creation_timestamp: spd.creation_timestamp,
        last_distribution_timestamp: spd.last_distribution_timestamp,
        metadata_uri: spd.metadata_uri,
        status: spd.status,
    }
}

public fun get_spd_id(spd: &SPD): address {
    // 返回SPD对象的唯一标识符
    object::uid_to_address(&spd.id)
}

public(package) fun is_admin(admin_cap: &AdminCap, ctx: &TxContext): bool {
    // 检查调用者是否是管理员
    admin_cap.admin_address == ctx.sender()
}

/// error handling
public(package) fun not_admin() {
    abort(E_ADMIN_ONLY)
}

