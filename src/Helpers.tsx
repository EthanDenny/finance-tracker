export const moneyText = (amount: number, showPositive: boolean) => {
    return (amount < 0 ? '-' : (showPositive ? '+' : '')) + '$' + Math.abs(amount)
}
