class BubbleSort(object):
    def __init__(self, A) -> None:
        self.A = A

    def sort(self):
        print(A)
        print("-"*10)
        n = len(self.A)
        for i in range(0, n):
            for j in range(0, n - i - 1):
                if self.A[j] > self.A[j+1]:
                    temp = A[j]
                    self.A[j] = self.A[j+1]
                    self.A[j+1] = temp
            print(A)

A = [42, 7, 19, 88, 3, 56, 12, 1, 99, 24]
myobj = BubbleSort(A)
myobj.sort()


