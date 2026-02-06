// Queue and Priority Queue implementations with different internal structures.
// - Array-based Queue (fixed size, circular buffer)
// - Linked-list-based Queue (dynamic size)
// - Min-heap-based Priority Queue
// - Ordered-array-based Priority Queue

// ---------- 1. Array-based Queue (fixed size, circular buffer) ----------

class ArrayQueue {
  constructor(capacity) {
    if (capacity <= 0) {
      throw new Error("Capacity must be > 0");
    }
    this.capacity = capacity;
    this.data = new Array(capacity);
    this.frontIndex = 0;
    this.rearIndex = 0;
    this.size = 0;
  }

  enqueue(element) {
    if (this.size === this.capacity) {
      throw new Error("Queue is full");
    }
    this.data[this.rearIndex] = element;
    this.rearIndex = (this.rearIndex + 1) % this.capacity;
    this.size++;
  }

  dequeue() {
    if (this.isEmpty()) {
      throw new Error("Queue is empty");
    }
    const value = this.data[this.frontIndex];
    this.data[this.frontIndex] = undefined; // optional: help GC
    this.frontIndex = (this.frontIndex + 1) % this.capacity;
    this.size--;
    return value;
  }

  isEmpty() {
    return this.size === 0;
  }

  peek() {
    if (this.isEmpty()) {
      throw new Error("Queue is empty");
    }
    return this.data[this.frontIndex];
  }
}

// ---------- 2. Linked List-based Queue (dynamic size) ----------

class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedListQueue {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  enqueue(element) {
    const node = new ListNode(element);
    if (!this.head) {
      this.head = this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
  }

  dequeue() {
    if (this.isEmpty()) {
      throw new Error("Queue is empty");
    }
    const value = this.head.value;
    this.head = this.head.next;
    if (!this.head) {
      this.tail = null;
    }
    return value;
  }

  isEmpty() {
    return this.head === null;
  }

  peek() {
    if (this.isEmpty()) {
      throw new Error("Queue is empty");
    }
    return this.head.value;
  }
}

// ---------- 3. Min-Heap-based Priority Queue ----------
// Elements are assumed to be objects like { value, priority } with smaller
// priority numbers meaning higher priority.

class MinHeapPriorityQueue {
  constructor() {
    this.heap = []; // array of { value, priority }
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  peekMin() {
    if (this.isEmpty()) {
      throw new Error("Priority queue is empty");
    }
    return this.heap[0];
  }

  insert(element) {
    this.heap.push(element);
    this._heapifyUp(this.heap.length - 1);
  }

  extractMin() {
    if (this.isEmpty()) {
      throw new Error("Priority queue is empty");
    }
    const min = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._heapifyDown(0);
    }
    return min;
  }

  _heapifyUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.heap[index].priority >= this.heap[parent].priority) break;
      [this.heap[index], this.heap[parent]] = [this.heap[parent], this.heap[index]];
      index = parent;
    }
  }

  _heapifyDown(index) {
    const n = this.heap.length;
    while (true) {
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      let smallest = index;

      if (left < n && this.heap[left].priority < this.heap[smallest].priority) {
        smallest = left;
      }
      if (right < n && this.heap[right].priority < this.heap[smallest].priority) {
        smallest = right;
      }

      if (smallest === index) break;

      [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }
}

// ---------- 4. Ordered Array-based Priority Queue ----------
// Maintains an array sorted by priority ascending.

class OrderedArrayPriorityQueue {
  constructor() {
    this.items = []; // array of { value, priority }
  }

  isEmpty() {
    return this.items.length === 0;
  }

  peekMin() {
    if (this.isEmpty()) {
      throw new Error("Priority queue is empty");
    }
    return this.items[0];
  }

  insert(element) {
    // Insert while keeping array sorted by priority (ascending).
    // Simple linear insertion; could be optimized with binary search if needed.
    if (this.isEmpty()) {
      this.items.push(element);
      return;
    }

    let i = 0;
    while (i < this.items.length && this.items[i].priority <= element.priority) {
      i++;
    }
    this.items.splice(i, 0, element);
  }

  extractMin() {
    if (this.isEmpty()) {
      throw new Error("Priority queue is empty");
    }
    // Minimum is always at index 0.
    return this.items.shift();
  }
}

// ---------- Simple sanity tests (optional to run from Node) ----------

function runDemo() {
  console.log("=== ArrayQueue Demo ===");
  const aq = new ArrayQueue(3);
  aq.enqueue(1);
  aq.enqueue(2);
  aq.enqueue(3);
  console.log("peek:", aq.peek());
  console.log("dequeue:", aq.dequeue());
  console.log("dequeue:", aq.dequeue());
  console.log("isEmpty:", aq.isEmpty());

  console.log("\n=== LinkedListQueue Demo ===");
  const lq = new LinkedListQueue();
  lq.enqueue("a");
  lq.enqueue("b");
  console.log("peek:", lq.peek());
  console.log("dequeue:", lq.dequeue());
  console.log("dequeue:", lq.dequeue());
  console.log("isEmpty:", lq.isEmpty());

  console.log("\n=== MinHeapPriorityQueue Demo ===");
  const mh = new MinHeapPriorityQueue();
  mh.insert({ value: "task1", priority: 5 });
  mh.insert({ value: "task2", priority: 1 });
  mh.insert({ value: "task3", priority: 3 });
  console.log("peekMin:", mh.peekMin());
  console.log("extractMin:", mh.extractMin());
  console.log("extractMin:", mh.extractMin());

  console.log("\n=== OrderedArrayPriorityQueue Demo ===");
  const oq = new OrderedArrayPriorityQueue();
  oq.insert({ value: "job1", priority: 5 });
  oq.insert({ value: "job2", priority: 1 });
  oq.insert({ value: "job3", priority: 3 });
  console.log("peekMin:", oq.peekMin());
  console.log("extractMin:", oq.extractMin());
  console.log("extractMin:", oq.extractMin());
}

if (require.main === module) {
  runDemo();
}

module.exports = {
  ArrayQueue,
  LinkedListQueue,
  MinHeapPriorityQueue,
  OrderedArrayPriorityQueue,
};

