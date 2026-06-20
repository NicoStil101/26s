
class CountingSort():
    def __init__(self) -> None:
        pass

    def counting_sort(A):
        k = max(A)
        n = len(A)
        # check if all elements in A in range (0, k)
        for i in range(A):
            if A[i] > k: 
                print(f'Element {A[i]} in A out of range ({min}, {max})')
                return False
            
        # Init C
        C = [0] * (k) 

        # ===== Init C with number of elements equal to i in A ===== 
        for i in range(k):
            C[A[i]] += 1

        # ===== Running sum: C[i] = # elements x in A s.t. x <= i  ===== 
        for i in range(1,k):
            C[i] += C[i - 1]

        # ===== Output Array B =====
        B = list()
        for i in reversed(range(n)):
            B[C[A[i]]] = A[i]
            C[A[i]] -= 1


        return B