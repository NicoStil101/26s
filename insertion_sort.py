class InsertionSort(object):
    def __init__(self, A) -> None:
        self.A = A

    def sort(self):#
        n = len(self.A)
        for j in range(1, n):
            key = self.A[j]
            i = j - 1 

            while i >= 0 & self.A[i] > key:
                self.A[i+1] = self.A[i]
                i -= 1
                print[self.A]
            self.A[i+1] = key

A = [10, 2, 5, 8, 1]
