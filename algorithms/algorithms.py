#!/usr/bin/env python3
import random as rd
class Array:
    def __init__(self) -> None:
        pass

    @staticmethod
    def rand_array():
        n = int(input('Array Size n: '))
        if n < 1: return []

        A = []
        for i in range(0,n):
            A.append(rd.randint(1,25))
        
        return A


if __name__ == '__main__':
    A = Array.rand_array()
    print(A)



