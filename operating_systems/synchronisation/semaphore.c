/*
 * Semaphore Exercise: Bounded Parking Lot
 *
 * A parking lot has N spots. Many cars (threads) try to park at the
 * same time. Only N can be parked simultaneously; the rest wait
 * outside until a spot frees up. Your job: enforce this with a
 * counting semaphore.
 *
* gcc -Wall -Wextra -pthread -o semaphore semaphore.c
*     ./semaphore
 *
 * Suggested workflow:
 *   STEP 1: Fill in TODO 1 (init) only. Leave TODO 2 and TODO 3 empty.
 *           Run. The test will FAIL because cars are not waiting at all
 *           and you'll see more than N parked at once.
 *
 *   STEP 2: Fill in TODO 2 and TODO 3 (wait and post). Run again.
 *           The test should PASS: max simultaneous is between 2 and N.
 *
 * POSIX semaphores cheatsheet (header: <semaphore.h>):
 *   sem_t                       the semaphore type
 *   sem_init(&s, 0, n)          start the semaphore with count = n
 *                               (the 0 means thread-shared, not process-shared)
 *   sem_wait(&s)                decrement count by 1.
 *                               If count is already 0, BLOCK until someone posts.
 *   sem_post(&s)                increment count by 1.
 *                               If anyone is blocked in sem_wait, wake one of them.
 *   sem_destroy(&s)             clean up
 *
 * Mental model:
 *   The semaphore is a box of N tickets.
 *   sem_wait takes one ticket out; if the box is empty, you wait.
 *   sem_post puts a ticket back in.
 *
 * Note: On macOS sem_init is not supported for unnamed semaphores.
 *       Use Linux (or WSL) for this exercise.
 */

#include <stdio.h>
#include <pthread.h>
#include <semaphore.h>
#include <stdatomic.h>
#include <unistd.h>

#define POOL_CAPACITY 3     /* N: the number of parking spots */
#define NUM_WORKERS   20    /* how many cars will try to park */

/* The semaphore, shared by all threads. */
static sem_t parking_spots;

/* Internal counters that the test harness uses to verify your work.
   You do not touch these. */
static atomic_int currently_parked = 0;
static atomic_int max_observed     = 0;


static void *worker(void *arg) {
    (void)arg;

    /* ============================================================
     * TODO 2: Acquire a parking spot BEFORE entering.
     *
     * Use: sem_wait(&parking_spots);
     *
     * This decrements the semaphore. If no spots are free (count = 0),
     * the thread blocks here until another thread releases a spot.
     * ============================================================ */
    /* YOUR CODE HERE */


    /* --- inside the critical section --- */
    /* Multiple cars (up to POOL_CAPACITY) may be in this block
       at the same time. That is the whole point of a semaphore:
       it allows up to N concurrent users, not just one. */

    int now = atomic_fetch_add(&currently_parked, 1) + 1;

    /* update max_observed = max(max_observed, now) using a CAS loop */
    int prev = atomic_load(&max_observed);
    while (now > prev &&
           !atomic_compare_exchange_weak(&max_observed, &prev, now)) {
        /* retry */
    }

    usleep(10000);   /* simulate the car being parked for 10 ms */

    atomic_fetch_sub(&currently_parked, 1);

    /* --- end critical section --- */


    /* ============================================================
     * TODO 3: Release the spot when leaving.
     *
     * Use: sem_post(&parking_spots);
     *
     * This increments the semaphore. If any threads are waiting in
     * sem_wait, one of them is woken up and may now enter.
     * ============================================================ */
    /* YOUR CODE HERE */

    return NULL;
}


int main(void) {
    /* ============================================================
     * TODO 1: Initialize the semaphore.
     *
     * Use:  sem_init(&parking_spots, 0, ??? );
     *
     *   1st arg &parking_spots : pointer to the semaphore
     *   2nd arg 0              : thread-shared (not process-shared)
     *   3rd arg ???            : the STARTING TICKET COUNT.
     *
     * Question: what value here corresponds to "N parking spots
     * available at the start"? Think about the mental model:
     * count = "how many tickets are in the box right now."
     *
     * Common wrong answer: 1 (that would make it behave like a mutex).
     * Common wrong answer: 0 (the lot would start full, deadlocking
     *                          every worker forever).
     * ============================================================ */
    /* YOUR CODE HERE */


    pthread_t threads[NUM_WORKERS];
    for (int i = 0; i < NUM_WORKERS; i++) {
        if (pthread_create(&threads[i], NULL, worker, NULL) != 0) {
            fprintf(stderr, "pthread_create failed\n");
            return 1;
        }
    }
    for (int i = 0; i < NUM_WORKERS; i++) {
        pthread_join(threads[i], NULL);
    }

    sem_destroy(&parking_spots);

    int max = atomic_load(&max_observed);
    printf("POOL_CAPACITY    = %d\n", POOL_CAPACITY);
    printf("NUM_WORKERS      = %d\n", NUM_WORKERS);
    printf("max simultaneous = %d\n", max);

    if (max > POOL_CAPACITY) {
        printf("[FAIL] capacity violated: %d cars parked at once "
               "(max allowed %d)\n", max, POOL_CAPACITY);
        return 1;
    }
    if (max < 2) {
        printf("[FAIL] only %d car(s) ever parked simultaneously.\n"
               "       Did you initialize the semaphore to 1 instead of %d?\n",
               max, POOL_CAPACITY);
        return 1;
    }
    printf("[PASS] capacity respected and concurrency happened\n");
    return 0;
}   