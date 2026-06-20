import math
import json
# Problem:
# Define the normalized sum of an array A of size n as:
#     (1 / sqrt(n)) * sum(A[i] for i in range(n))
#
# Given an array of n integers, find the contiguous subarray
# that maximizes the normalized sum, where the normalization
# factor uses the subarray's own length k (not the full array's n).
#
# That is, for a subarray A[i..j] of length k = j - i + 1, its
# normalized sum is:
#     (1 / sqrt(k)) * sum(A[i..j])
#
# Return the subarray (or its indices) achieving the maximum.
#
# Required time complexity: O(n^2)
def prefix_sum(A: list) -> int:
    n = len(A)
    p = [0] * n
    a = {(i,j):0 for i in range(n) for j in range(i,n)}

    for i in range(1,n):
        p[i] += A[i]

    for i in range(n):
        for j in range(i,n):
            k = 1 if j == i else (j - i)
            a[(i,j)] = (1/math.sqrt(k)) * p[j-i]

    
    return max(a.values())




if __name__ == '__main__':
    A = [2, 6, 3, -4, 5, 5]
    print(prefix_sum(A))
