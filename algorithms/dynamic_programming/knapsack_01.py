def knapsack(prices, weights, cap):
    # DP table
    n = len(weights)
    dp = [[0 for _ in range(cap+1)] for _ in range(n+1)]

    for i in range(1,n + 1): 
        for w in range(cap + 1):
            if weights[i-1] > w:
                dp[i][w] = dp[i-1][w]
            else:
                dp[i][w] = max(dp[i-1][w], dp[i-1][w-weights[i-1]] + prices[i-1])

    # backtrack 
    result = [0] * n
    w = cap
    for i in range(n,0,-1):
        if dp[i][w] != dp[i-1][w]:
            result[i-1] = 1
            w -= weights[i-1]

    
    return result


weights      = [12, 7, 11, 8, 9, 5, 14, 3, 6, 10]
prices       = [24, 13, 23, 15, 16, 9, 28, 7, 11, 20]
max_capacity = 30

result = knapsack(prices, weights, max_capacity)
print(result)

