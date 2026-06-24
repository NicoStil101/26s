def longest_common_subsequence(A,B):
    m = len(A)
    n = len(B)
    c = [[0 for _ in range(n)] for _ in range(m)]
    
    for i in range(1,m):
        for j in range(1,n):
            if A[i] == B[j]:
                c[i][j] = c[i-1][j-1] + 1
            elif c[i-1][j] >= c[i][j-1]:
                c[i][j] = c[i-1][j]
            else:
                c[i][j] = c[i][j-1]

    return c

c = longest_common_subsequence('scholarly', 'heroically')
print(c)