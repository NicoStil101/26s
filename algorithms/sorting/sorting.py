# ============ 
# COUNTING SORT 
# ============
def counting_sort(A):
    print(f'CountingSort on array A: {A}')
    k = max(A)
    n = len(A)
    # check if all elements in A in range (0, k)
    for i in range(n):
        if A[i] > k: 
            print(f'Element {A[i]} in A out of range ({0}; {k}) for counting sort')
            return False
        
    # Init C
    C = [0] * (k + 1)

    # ===== Init C with number of elements equal to i in A ===== 
    for i in range(n):
        C[A[i]] += 1

    # ===== Running sum: C[i] = # elements x in A s.t. x <= i  ===== 
    for i in range(1,k + 1):
        C[i] += C[i-1] 

    # ===== Output Array B =====
    B = [0] * n
    for i in reversed(range(n)):
        B[C[A[i]] - 1] = A[i]
        C[A[i]] -= 1

    return B

# ============ 
# INSERTION SORT 
# ============
def insertion_sort(A):
    print(f'InsertionSort on array A: {A}')
    n = len(A)
    for j in range(1, n):
        key = A[j]
        i = j - 1 

        while i >= 0 and A[i] > key:
            A[i+1] = A[i]
            i -= 1
        A[i+1] = key
        print(f'{A}')
        
    return A


# ============ 
# SELECTION SORT
# ============
def selection_sort(A):
    print(f'SelectionSort on array A: {A}')
    n = len(A)
    
    for i in range(n):
        # Assume the first unsorted element is the minimum
        min_idx = i
        
        # Search the rest of the array for a smaller element
        for j in range(i + 1, n):
            if A[j] < A[min_idx]:
                min_idx = j
        print(A)
        # Swap the found minimum element with the first unsorted element
        A[i], A[min_idx] = A[min_idx], A[i]

    return A


# ============ 
# BUBBLE SORT 
# ============
def bubble_sort(A):
    print('BubbleSort on array A: {A}')
    n = len(A)
    for i in range(0, n):
        for j in range(0, n - i - 1):
            if A[j] > A[j+1]:
                temp = A[j]
                A[j] = A[j+1]
                A[j+1] = temp

    return A


