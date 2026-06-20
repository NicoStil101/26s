 # Suppose we are given an array A of n elements, each of which is an integer in the range [0, n2 − 1]. 
 # Design and analyze a simple method for sorting A in O(n) time. 
 # (Hint: Think of a different way of viewing the elements of A.)7

import random
import math
from sorting import counting_sort

def get_digit(x, i):
    return x//pow(10,i) % 10



arr_5digit = [73045, 41209, 91038, 50671, 56324,
              33018, 18990, 99042, 42107, 70561]
B = sort(arr_5digit)
print(B)