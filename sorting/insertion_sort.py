class InsertionSort(object):
    def __init__(self, A) -> None:
        self.A = A

    def sort(self):
        print(A)
        print("-"*10)
        n = len(self.A)
        for j in range(1, n):
            key = self.A[j]
            i = j - 1 

            while i >= 0 and self.A[i] > key:
                self.A[i+1] = self.A[i]
                i -= 1
            self.A[i+1] = key
            print(f'{A}')


A = [42, 7, 19, 88, 3, 56, 12, 1, 99, 24]
myobj = InsertionSort(A)
myobj.sort()


