export const stripeFee = (amount: number): number => {
    if (!amount) return 0;
    const myFee = 0.3;
    const stripeCharge = 0.3;
    const fee = myFee + stripeCharge;
    const p = (amount * 2.9) / 100 + fee;

    return +p.toFixed(2);
};
