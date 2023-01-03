export const stripeFee = (amount: number): number => {
    if (!amount) return 0;
    const p = (amount * 2.9) / 100 + 0.3;
    return +p.toFixed(2);
};
