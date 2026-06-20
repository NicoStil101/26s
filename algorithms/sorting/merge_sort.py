class MergeSort(object):
    def __init__(self, A) -> None:
        self.A = A

    def sort(self):
        print(self.A)
        print("-" * 10)
        self._recursive_split(0, len(self.A))

    def _recursive_split(self, start, end):
        # Base case: a segment of 1 element is already sorted
        if end - start <= 1:
            return

        mid = (start + end) // 2
        
        # Recursively split
        self._recursive_split(start, mid)
        self._recursive_split(mid, end)

        # Merge and print the state of the main array
        self._merge(start, mid, end)
        print(self.A)

    def _merge(self, start, mid, end):
        left = self.A[start:mid]
        right = self.A[mid:end]
        
        i = j = 0
        k = start

        # Compare and place back into the original array self.A
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                self.A[k] = left[i]
                i += 1
            else:
                self.A[k] = right[j]
                j += 1
            k += 1

        # Collect remaining elements
        while i < len(left):
            self.A[k] = left[i]
            i += 1
            k += 1
        while j < len(right):
            self.A[k] = right[j]
            j += 1
            k += 1

A = [42, 7, 19, 88, 3, 56, 12, 1, 99, 24]
myobj = MergeSort(A)
myobj.sort()