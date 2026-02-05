// Interval Scheduling: Brute-Force vs Greedy
// -------------------------------------------------
// Goal: Select the maximum number of non-overlapping tasks
// that a single driver can perform.
//
// Each task has:
//   { start: number, end: number }
//
// We implement:
//   - bruteForceSelect(tasks)
//   - greedySelect(tasks)
// and compare them.

// ---------- Helper ----------

function tasksOverlap(a, b) {
  // Overlap if intervals [a.start, a.end) and [b.start, b.end) intersect
  return a.start < b.end && b.start < a.end;
}

// ---------- 1. Brute-force solution ----------
// Explore all combinations using backtracking.
//
// Time complexity:
//   - O(2^n * n) in worst case (try all subsets, check compatibility).
// Space complexity:
//   - O(n) recursion depth + O(n) for current subset.

function bruteForceSelect(tasks) {
  const sorted = tasks.slice().sort((a, b) => a.start - b.start);

  let best = [];

  function backtrack(index, current) {
    if (index === sorted.length) {
      if (current.length > best.length) {
        best = current.slice();
      }
      return;
    }

    // Option 1: skip current task
    backtrack(index + 1, current);

    // Option 2: try to include current task if it doesn't overlap
    const candidate = sorted[index];
    let compatible = true;
    for (let i = 0; i < current.length; i++) {
      if (tasksOverlap(current[i], candidate)) {
        compatible = false;
        break;
      }
    }
    if (compatible) {
      current.push(candidate);
      backtrack(index + 1, current);
      current.pop();
    }
  }

  backtrack(0, []);
  return best;
}

// ---------- 2. Greedy solution ----------
// Classic activity-selection algorithm:
//   1. Sort tasks by end time ascending.
//   2. Always pick the task that finishes earliest
//      among those compatible with the last chosen one.
//
// Time complexity:
//   - O(n log n) for sort + O(n) scan.
// Space complexity:
//   - O(n) for the sorted copy and result.

function greedySelect(tasks) {
  if (tasks.length === 0) return [];

  const sorted = tasks.slice().sort((a, b) => a.end - b.end);
  const result = [];

  let lastEnd = -Infinity;
  for (const task of sorted) {
    if (task.start >= lastEnd) {
      result.push(task);
      lastEnd = task.end;
    }
  }

  return result;
}

// ---------- 3. Sample input for validation ----------

const sampleTasks = [
  { start: 1, end: 3 },
  { start: 2, end: 5 },
  { start: 4, end: 6 },
  { start: 6, end: 7 },
  { start: 5, end: 9 },
  { start: 8, end: 10 },
];

// ---------- 4. Benchmark utilities ----------

function generateRandomTasks(count) {
  const tasks = [];
  for (let i = 0; i < count; i++) {
    const start = Math.floor(Math.random() * 10000);
    const duration = 1 + Math.floor(Math.random() * 100); // at least 1
    const end = start + duration;
    tasks.push({ start, end });
  }
  return tasks;
}

function benchmark() {
  console.log("=== Correctness on sample tasks ===");
  console.log("Sample tasks:", sampleTasks);

  const brute = bruteForceSelect(sampleTasks);
  const greedy = greedySelect(sampleTasks);

  console.log("Brute-force result:", brute);
  console.log("Greedy result:     ", greedy);
  console.log(
    "Same length?",
    brute.length === greedy.length,
    "| length:",
    brute.length
  );

  // For thousands of tasks, brute force is infeasible in practice.
  // We time greedy on 10,000 tasks and brute-force on a small subset.

  const largeTasks = generateRandomTasks(10000);

  console.log("\n=== Performance comparison ===");

  console.time("Greedy (10,000 tasks)");
  const greedyLarge = greedySelect(largeTasks);
  console.timeEnd("Greedy (10,000 tasks)");
  console.log("Greedy selected (large):", greedyLarge.length);

  const smallSubset = largeTasks.slice(0, 20); // reduce to keep brute-force feasible
  console.time("Brute-force (20 tasks)");
  const bruteSmall = bruteForceSelect(smallSubset);
  console.timeEnd("Brute-force (20 tasks)");
  console.log("Brute-force selected (subset):", bruteSmall.length);
}

// ---------- 5. Stress tests (Bonus) ----------

function stressTests() {
  console.log("\n=== Stress Tests ===");

  // All tasks overlapping (only 1 can be chosen)
  const allOverlapping = [
    { start: 1, end: 10 },
    { start: 2, end: 9 },
    { start: 3, end: 8 },
    { start: 4, end: 7 },
  ];
  console.log("\nAll overlapping:");
  console.log("Brute:", bruteForceSelect(allOverlapping));
  console.log("Greedy:", greedySelect(allOverlapping));

  // All tasks non-overlapping (all can be chosen)
  const allNonOverlapping = [
    { start: 1, end: 2 },
    { start: 2, end: 3 },
    { start: 3, end: 4 },
    { start: 4, end: 5 },
  ];
  console.log("\nAll non-overlapping:");
  console.log("Brute:", bruteForceSelect(allNonOverlapping));
  console.log("Greedy:", greedySelect(allNonOverlapping));

  // Tasks with same start or end times
  const sameStartEnd = [
    { start: 1, end: 3 },
    { start: 1, end: 2 },
    { start: 2, end: 3 },
    { start: 3, end: 5 },
    { start: 3, end: 4 },
  ];
  console.log("\nSame start/end times:");
  console.log("Brute:", bruteForceSelect(sameStartEnd));
  console.log("Greedy:", greedySelect(sameStartEnd));
}

// ---------- 6. High-level analysis (summary) ----------
//
// Which algorithm is faster for large inputs and why?
// - Greedy is much faster for large inputs: O(n log n) vs brute force O(2^n).
//   For thousands of tasks per second, brute force is completely impractical.
//
// Which algorithm is easier to maintain and scale?
// - Greedy is simpler (sort + single pass), easier to read, reason about,
//   and scale as n grows. Brute-force backtracking is more complex and
//   inherently unscalable due to exponential growth.
//
// Memory trade-offs:
// - Both store the tasks plus a result set, so baseline is O(n).
// - Brute force needs extra recursion stack + temporary subsets, and can
//   consume much more memory as n grows.
// - Greedy only tracks the current best end time and result array.
//
// Recommendation:
// - For a real-time delivery backend handling thousands of tasks per second,
//   the GREEDY algorithm (earliest finishing time) is the clear choice:
//   it is optimal for this problem, fast, and memory-efficient.
// - Brute force is only useful for:
//   * Educational purposes (verifying correctness on small inputs),
//   * Very small datasets where n is tiny and performance is irrelevant.

function main() {
  benchmark();
  stressTests();
}

if (require.main === module) {
  main();
}

module.exports = {
  bruteForceSelect,
  greedySelect,
};

