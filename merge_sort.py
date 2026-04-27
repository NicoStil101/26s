class MergeObject(object):
    def __init__(self, A) -> None:
        self.A = A

    def merge(self, A, p, q, r):
        L = self.A[:q]
        R = self.A[q:]

        i = 0
        j = 0
        
        if len(L) > 0 and len(R) > 0:
            for k in range(q, r):
                if L[i] < R[j]:
                    self.A[k] = L[i]
                    i += 1
                else:
                    self.A[k] = R[j]
                    j += 1

    def merge_sort(self, A, p, r):

        if p < r: 
            q = (p + r) // 2 

            self.merge_sort(self.A, p, q)
            self.merge_sort(self.A, q + 1, r)
            self.merge(self.A, p, q, r)

        return self.A



A = [10, 2, 5, 8, 1]
B = [14, 3, 7, 12, 9]

myobj = MergeObject(A)
print(myobj.merge_sort(A, 0, len(A)-1))



