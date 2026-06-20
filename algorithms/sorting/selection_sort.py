class SelectionSort(object):
    def __init__(self, A) -> None:
        self.A = A

    def sort(self):
        print(A)
        print("-"*10)
        n = len(self.A)
        
        for i in range(n):
            # Assume the first unsorted element is the minimum
            min_idx = i
            
            # Search the rest of the array for a smaller element
            for j in range(i + 1, n):
                if self.A[j] < self.A[min_idx]:
                    min_idx = j
            print(self.A)
            # Swap the found minimum element with the first unsorted element
            self.A[i], self.A[min_idx] = self.A[min_idx], self.A[i]

A = [42, 7, 19, 88, 3, 56, 12, 1, 99, 24]
myobj = SelectionSort(A)
myobj.sort()