
class Solution(object):

    @staticmethod
    def find_peak(*, array, start, end):
        if start > end: 
            return -1

        mid = int((start + end) / 2)


        #search right
        if array[mid] < array[mid +1]: 
            return Solution.find_peak(array=array, start=mid + 1, end=end)
        #search left
        elif array[mid] < array[mid -1]:
            return Solution.find_peak(array=array, start=start, end=mid - 1)
        #element greater or equal to both elements left & right (-> peak found)
        elif array[mid] >= array[mid - 1] and array[mid] >= array[mid + 1]:
            return mid


    @staticmethod
    def get_peak_index(*, array = None):
        if array is None: 
            return -1
        
        return Solution.find_peak(array=array, start=0, end=len(array) - 1)


array_one = [10, 20, 35, 45, 60, 72, 80, 88, 92, 95, 100, 90, 85, 70, 50, 30, 15]
array_two = [12, 24, 36, 50, 48, 44, 40, 36, 32, 28, 24, 20, 16, 12, 8, 4]
array_three = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 88, 82, 75, 65]


print(f'{Solution.get_peak_index(array=array_one)}\n')
print(f'{Solution.get_peak_index(array=array_two)}\n')
print(f'{Solution.get_peak_index(array=array_three)}\n')
