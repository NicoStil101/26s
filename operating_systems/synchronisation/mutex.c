/*
 * Spinlock Mutex Exercise
 *
 * Build a working mutex from atomic operations.
 * Then prove it works with a multi-threaded counter test.
 *
 * Compile: gcc -Wall -Wextra -pthread -o mutex_test mutex_test.c
 * Run:     ./mutex_test
 *
 * STEP 1: Compile and run it BEFORE filling in any TODOs.
 *         The test will FAIL because the threads race on counter++
 *         with no protection. The counter will end up less than expected.
 *         This is the bug your mutex needs to fix.
 *
 * STEP 2: Fill in the TODOs. Run again. It should PASS.
 */

#include <stdatomic.h>
#include <pthread.h>
#include <stdio.h>
#include <stdbool.h>


/* ============================================================
 * TODO 1: Define the mutex struct.
 *
 * Hint: you need exactly ONE field, of type atomic_flag.
 *       atomic_flag lives in <stdatomic.h> and is the only type
 *       the C standard guarantees is always lock-free for
 *       test-and-set.
 *
 * Replace the placeholder field below.
 * ============================================================ */
typedef struct {
    atomic_flag flag;   /* DELETE THIS and add the real field */
} my_mutex_t;


/* ============================================================
 * TODO 2: Implement my_mutex_init.
 *
 * Goal: leave the mutex in the UNLOCKED state.
 *
 * Hint: atomic_flag_clear(&m->your_field)
 * ============================================================ */
void my_mutex_init(my_mutex_t *m) {
    atomic_flag_clear(&m->flag);
    return;
}

/* ============================================================
 * TODO 3: Implement my_mutex_lock.
 *
 * Goal: spin (busy wait) until this thread holds the lock.
 *
 * The primitive you need:
 *   atomic_flag_test_and_set(&m->your_field)
 * does TWO things atomically (as one indivisible CPU step):
 *   1. sets the flag to true
 *   2. returns the PREVIOUS value (true or false)
 *
 * Logic:
 *   if previous was false -> nobody held the lock, now WE do, exit loop
 *   if previous was true  -> someone else holds it, spin and try again
 *
 * A simple while-loop wraps this in a few characters.
 * ============================================================ */
void my_mutex_lock(my_mutex_t *m) {
    while(atomic_flag_test_and_set(&m->flag));
}


/* ============================================================
 * TODO 4: Implement my_mutex_unlock.
 *
 * Goal: release the lock so a waiting thread can take it.
 *
 * Hint: atomic_flag_clear(&m->your_field).
 *       This is one line.
 *
 * Question to ponder: what happens if a thread calls unlock
 * without ever calling lock first? (Real mutexes guard against
 * this; our spinlock does not.)
 * ============================================================ */
void my_mutex_unlock(my_mutex_t *m) {
    atomic_flag_clear(&m->flag);
}


/* ============================================================
 * Test harness below. Do not modify.
 *
 * Four threads each increment a shared counter 100,000 times.
 * Expected final value: 400,000.
 * Without a working mutex: less than 400,000 (lost updates from races).
 * ============================================================ */

#define NUM_THREADS 4
#define ITERATIONS_PER_THREAD 100000

static my_mutex_t test_lock;
static long counter = 0;

static void *worker(void *arg) {
    (void)arg;
    for (int i = 0; i < ITERATIONS_PER_THREAD; i++) {
        my_mutex_lock(&test_lock);
        counter++;                      /* critical section */
        my_mutex_unlock(&test_lock);
    }
    return NULL;
}

int main(void) {
    my_mutex_init(&test_lock);

    pthread_t threads[NUM_THREADS];
    for (int i = 0; i < NUM_THREADS; i++) {
        if (pthread_create(&threads[i], NULL, worker, NULL) != 0) {
            fprintf(stderr, "pthread_create failed\n");
            return 1;
        }
    }
    for (int i = 0; i < NUM_THREADS; i++) {
        pthread_join(threads[i], NULL);
    }

    long expected = (long)NUM_THREADS * ITERATIONS_PER_THREAD;
    printf("counter  = %ld\n", counter);
    printf("expected = %ld\n", expected);

    if (counter == expected) {
        printf("[PASS] mutex works, no lost updates\n");
        return 0;
    } else {
        printf("[FAIL] lost %ld increments to race conditions\n",
               expected - counter);
        return 1;
    }
}