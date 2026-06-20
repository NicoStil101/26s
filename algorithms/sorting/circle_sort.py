#PROBLEM STATEMENT
# We are given n points in the unit circle, pi = (xi, yi),such that 0 < x2 i + y2 i ≤ 1 for i = 1, 2, . . . , n. Suppose that the points are uniformly distributed; that is, the probability of finding a point in any region of the circle is proportional to the area of that region. Design an algorithm with an average-case running time of O(n) to sort the n points by their distances di = px2 i + y2 i from the origin.
from sorting import insertion_sort
import math

points = [
    (0.453, 0.211), 
    (-0.120, 0.784), 
    (0.632, -0.412), 
    (-0.051, -0.098), 
    (0.881, 0.115), 
    (-0.342, -0.556), 
    (0.201, 0.902), 
    (-0.714, 0.321), 
    (0.098, -0.812), 
    (0.554, 0.443)
]

def circle_sort(A):
    # A: points in the unit circle
    # B: array of buckets

    n = len(A) 

    # Initialize Buckets and corresponding lists inside buckets
    B = list()
    [B.append(list()) for x in range(n)]        

    #fill buckets
    for i in range(n):
        #calculate distance of point 
        xi = pow(A[i][0],2)
        yi = pow(A[i][1],2)
        distance = round(math.sqrt(xi + yi),4)

        B[math.floor(n * distance)].append(distance)
    
    #sort buckets
    for i in range(n):
        B[i] = insertion_sort(B[i])

    B = [x[y] for x in B for y in range(len(x))]

    return B

if __name__ == '__main__':
    B = circle_sort(points)
    print(f'List B = {B}')




