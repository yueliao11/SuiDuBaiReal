export type StakePool = {
    id: {id: string};
    total_staked: number;
    reward_rate: number;
    reward_treasury: number;
    user_stakes: {
        fields: {
            id: {id: string};
            size: number;
        };
    };
}