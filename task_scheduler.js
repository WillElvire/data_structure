// Lightweight task scheduler utilities for a to‑do app.
// Focus: sorting, grouping by priority, detecting overlaps, and complexity analysis.

// A task has:
// - name: string
// - start: number (e.g., minutes from start of day or a timestamp)
// - end: number   (must satisfy end >= start)
// - priority: "High" | "Medium" | "Low" (or any string)

/**
 * Sort tasks by start time (ascending).
 *
 * Time complexity:
 *   - O(n log n) due to sorting.
 * Space complexity:
 *   - O(n) if we return a new array (to avoid mutating input).
 */
function sortTasksByStartTime(tasks) {
  // Return a new sorted copy (non‑mutating).
  return tasks
    .slice()
    .sort((a, b) => a.start - b.start);
}

/**
 * Group tasks by priority using a hash map (Map).
 *
 * Returns: Map<priority, Task[]>
 *
 * Time complexity:
 *   - O(n), we iterate through the tasks once.
 * Space complexity:
 *   - O(n), we store references to all tasks in groups.
 */
function groupTasksByPriority(tasks) {
  const groups = new Map(); // priority -> array of tasks

  for (const task of tasks) {
    if (!groups.has(task.priority)) {
      groups.set(task.priority, []);
    }
    groups.get(task.priority).push(task);
  }

  return groups;
}

/**
 * Detect overlapping tasks.
 *
 * Two tasks (A, B) overlap if:
 *   A.start < B.end AND B.start < A.end
 * For efficiency, we sort by start time once, then scan linearly.
 *
 * Returns an array of overlapping pairs: [task1, task2].
 *
 * Time complexity:
 *   - Sorting: O(n log n)
 *   - Scan:    O(n)
 *   => Overall: O(n log n)
 *
 * Space complexity:
 *   - O(n) for the sorted copy + overlaps in the worst case.
 */
function detectOverlappingTasks(tasks) {
  if (tasks.length <= 1) return [];

  const sorted = sortTasksByStartTime(tasks); // O(n log n)
  const overlaps = [];

  // Compare each task with the previous one in sorted order.
  let prev = sorted[0];
  for (let i = 1; i < sorted.length; i++) {
    const curr = sorted[i];

    // Overlap condition on intervals [start, end)
    if (curr.start < prev.end && prev.start < curr.end) {
      overlaps.push([prev, curr]);
    }

    // Move the "prev" pointer forward.
    // If curr ends later than prev, it’s the better candidate
    // to compare with the next interval.
    if (curr.end > prev.end) {
      prev = curr;
    }
  }

  return overlaps;
}

/**
 * Optional: Estimate memory usage for storing tasks.
 *
 * This is a rough estimate, not exact.
 * We assume:
 *   - Each task has a name and priority strings plus two numbers.
 *   - We approximate a constant number of bytes per task.
 *
 * @param {number} numTasks
 * @param {number} bytesPerTask (optional override, default 128 bytes)
 * @returns {number} estimated bytes of memory used
 *
 * Time complexity: O(1)
 * Space complexity: O(1)
 */
function estimateMemoryUsage(numTasks, bytesPerTask = 128) {
  return numTasks * bytesPerTask;
}

// --- Simple demo / manual test ---

function runDemo() {
  const tasks = [
    { name: "Task A", start: 9, end: 11, priority: "High" },
    { name: "Task B", start: 10, end: 12, priority: "Medium" },
    { name: "Task C", start: 13, end: 14, priority: "Low" },
    { name: "Task D", start: 11, end: 13, priority: "High" },
    { name: "Task E", start: 15, end: 16, priority: "Medium" },
  ];

  console.log("Original tasks:");
  console.log(tasks);

  console.log("\nSorted by start time:");
  const sorted = sortTasksByStartTime(tasks);
  console.log(sorted);

  console.log("\nGrouped by priority:");
  const groups = groupTasksByPriority(tasks);
  for (const [priority, group] of groups.entries()) {
    console.log(priority, "=>", group.map((t) => t.name));
  }

  console.log("\nOverlapping tasks (pairs):");
  const overlaps = detectOverlappingTasks(tasks);
  for (const [t1, t2] of overlaps) {
    console.log(`${t1.name} overlaps with ${t2.name}`);
  }

  console.log(
    "\nEstimated memory usage for",
    tasks.length,
    "tasks:",
    estimateMemoryUsage(tasks.length),
    "bytes (approx.)"
  );
}

if (require.main === module) {
  runDemo();
}

module.exports = {
  sortTasksByStartTime,
  groupTasksByPriority,
  detectOverlappingTasks,
  estimateMemoryUsage,
};

