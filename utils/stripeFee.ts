export const stripeFee = (amount: number) => {
    if (!amount) return 0;

    const p = (amount * 2.9) / 100 + 0.3;

    console.log((amount * 100 * 0.08).toFixed(0));

    return +p.toFixed(2);
};
