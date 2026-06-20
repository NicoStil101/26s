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
    p = [0] * (n + 1)
    a = {(i,j):0 for i in range(n) for j in range(i,n)}

    for i in range(n):
        p[i+1] = p[i] + A[i]
    
    print(p)

    for i in range(n):
        for j in range(i,n):
            k = j - i + 1
            subarray_sum = p[j] - p[i]

            print(f'k: {i,j}, sum: {subarray_sum}')
            a[(i,j)] = subarray_sum / math.sqrt(k)

    
    return max(a.values())




if __name__ == '__main__':
    A = [-8, 2, -3, 9, 8, 7, -4, 1, -6]
    print(prefix_sum(A))
