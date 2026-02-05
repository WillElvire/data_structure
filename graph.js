// Simple Graph implementation using an adjacency list.
// Supports directed and undirected graphs plus DFS and BFS traversals.

class Graph {
  constructor(directed = false) {
    this.directed = directed;
    this.adj = new Map(); // vertex -> Set of neighbors
  }

  addVertex(v) {
    if (!this.adj.has(v)) {
      this.adj.set(v, new Set());
    }
  }

  addEdge(src, dest) {
    this.addVertex(src);
    this.addVertex(dest);

    this.adj.get(src).add(dest);
    if (!this.directed) {
      this.adj.get(dest).add(src);
    }
  }

  removeEdge(src, dest) {
    if (this.adj.has(src)) {
      this.adj.get(src).delete(dest);
    }
    if (!this.directed && this.adj.has(dest)) {
      this.adj.get(dest).delete(src);
    }
  }

  hasEdge(src, dest) {
    return this.adj.has(src) && this.adj.get(src).has(dest);
  }

  print() {
    console.log("Graph (adjacency list):");
    for (const [vertex, neighbors] of this.adj.entries()) {
      console.log(`${vertex} -> ${Array.from(neighbors).join(", ")}`);
    }
  }

  dfs(start) {
    if (!this.adj.has(start)) {
      console.log(`Start vertex '${start}' does not exist in the graph.`);
      return [];
    }

    const visited = new Set();
    const stack = [start];
    const order = [];

    while (stack.length > 0) {
      const v = stack.pop();
      if (!visited.has(v)) {
        visited.add(v);
        order.push(v);

        // Add neighbors in reverse order for more natural traversal order
        const neighbors = Array.from(this.adj.get(v) || []).reverse();
        for (const n of neighbors) {
          if (!visited.has(n)) {
            stack.push(n);
          }
        }
      }
    }

    console.log(`DFS from ${start}: ${order.join(" -> ")}`);
    return order;
  }

  bfs(start) {
    if (!this.adj.has(start)) {
      console.log(`Start vertex '${start}' does not exist in the graph.`);
      return [];
    }

    const visited = new Set([start]);
    const queue = [start];
    const order = [];

    while (queue.length > 0) {
      const v = queue.shift();
      order.push(v);

      for (const n of this.adj.get(v) || []) {
        if (!visited.has(n)) {
          visited.add(n);
          queue.push(n);
        }
      }
    }

    console.log(`BFS from ${start}: ${order.join(" -> ")}`);
    return order;
  }
}

// --- Simple test / demo ---

function runDemo() {
  console.log("=== Undirected Graph Demo ===");
  const g = new Graph(false); // undirected

  // At least 3 vertices; we'll use 4: A, B, C, D
  g.addEdge("A", "B");
  g.addEdge("A", "C");
  g.addEdge("B", "D");
  g.addEdge("C", "D");

  g.print();
  g.dfs("A");
  g.bfs("A");

  console.log("\nHas edge A-B?", g.hasEdge("A", "B"));
  console.log("Removing edge A-B...");
  g.removeEdge("A", "B");
  console.log("Has edge A-B?", g.hasEdge("A", "B"));
  g.print();

  console.log("\n=== Directed Graph Demo ===");
  const dg = new Graph(true); // directed
  dg.addEdge("1", "2");
  dg.addEdge("1", "3");
  dg.addEdge("2", "4");
  dg.addEdge("3", "4");
  dg.print();
  dg.dfs("1");
  dg.bfs("1");
}

if (require.main === module) {
  runDemo();
}

module.exports = { Graph };

