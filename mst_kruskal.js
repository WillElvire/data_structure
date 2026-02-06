// Minimum Spanning Tree using Kruskal's Algorithm
// -------------------------------------------------
// Computers: vertices
// Cable connections: weighted edges { u, v, weight }
//
// This file implements:
//   - Disjoint Set (Union-Find)
//   - kruskalMST(vertices, edges)
//   - A small demo + optional simple CLI input

// ---------- Disjoint Set (Union-Find) ----------

class DisjointSet {
  constructor(elements) {
    this.parent = new Map();
    this.rank = new Map();
    for (const e of elements) {
      this.parent.set(e, e);
      this.rank.set(e, 0);
    }
  }

  find(x) {
    if (this.parent.get(x) !== x) {
      this.parent.set(x, this.find(this.parent.get(x))); // path compression
    }
    return this.parent.get(x);
  }

  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);
    if (rootX === rootY) return false; // already in same set

    const rankX = this.rank.get(rootX);
    const rankY = this.rank.get(rootY);

    if (rankX < rankY) {
      this.parent.set(rootX, rootY);
    } else if (rankX > rankY) {
      this.parent.set(rootY, rootX);
    } else {
      this.parent.set(rootY, rootX);
      this.rank.set(rootX, rankX + 1);
    }
    return true;
  }
}

// ---------- Kruskal's MST ----------

/**
 * Compute the Minimum Spanning Tree (MST) using Kruskal's Algorithm.
 *
 * @param {Array<string>} vertices - list of vertex identifiers
 * @param {Array<{u: string, v: string, weight: number}>} edges - list of edges
 * @returns {{ mstEdges: Array<{u: string, v: string, weight: number}>, totalCost: number }}
 */
function kruskalMST(vertices, edges) {
  // Sort all edges by increasing weight
  const sortedEdges = edges.slice().sort((a, b) => a.weight - b.weight);

  const ds = new DisjointSet(vertices);
  const mstEdges = [];
  let totalCost = 0;

  for (const edge of sortedEdges) {
    // If adding this edge doesn't form a cycle, include it
    if (ds.union(edge.u, edge.v)) {
      mstEdges.push(edge);
      totalCost += edge.weight;
    }
  }

  return { mstEdges, totalCost };
}

// ---------- Demo with a small office network ----------

function runDemo() {
  const vertices = ["A", "B", "C", "D", "E"];
  const edges = [
    { u: "A", v: "B", weight: 4 },
    { u: "A", v: "C", weight: 2 },
    { u: "B", v: "C", weight: 1 },
    { u: "B", v: "D", weight: 5 },
    { u: "C", v: "D", weight: 8 },
    { u: "C", v: "E", weight: 10 },
    { u: "D", v: "E", weight: 2 },
  ];

  const { mstEdges, totalCost } = kruskalMST(vertices, edges);

  console.log("=== MST (Kruskal) Demo ===");
  console.log("Vertices (computers):", vertices.join(", "));
  console.log("Selected connections (edges):");
  for (const e of mstEdges) {
    console.log(`${e.u} -- ${e.v}  (cost: ${e.weight})`);
  }
  console.log("Total network cost:", totalCost);
}

// ---------- Optional: Simple CLI for dynamic input ----------

function runCli() {
  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  function ask(q) {
    return new Promise((resolve) => rl.question(q, resolve));
  }

  (async () => {
    console.log("=== Build your own office network (Kruskal MST) ===");

    const vertexLine = await ask(
      "Enter computer names (vertices) separated by commas (e.g., A,B,C,D): "
    );
    const vertices = vertexLine
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v.length > 0);

    const mStr = await ask("How many possible connections (edges) will you enter? ");
    const m = parseInt(mStr, 10);
    const edges = [];

    console.log(
      "For each edge, enter in the format: u v weight  (e.g., A B 5)"
    );
    for (let i = 0; i < m; i++) {
      const line = await ask(`Edge ${i + 1}: `);
      const [u, v, wStr] = line.trim().split(/\s+/);
      const weight = Number(wStr);
      if (!u || !v || Number.isNaN(weight)) {
        console.log("Invalid input, skipping this edge.");
        continue;
      }
      edges.push({ u, v, weight });
    }

    const { mstEdges, totalCost } = kruskalMST(vertices, edges);

    console.log("\nMST Result:");
    if (mstEdges.length === 0) {
      console.log("No edges selected. Graph might be disconnected or input invalid.");
    } else {
      console.log("Selected connections (edges):");
      for (const e of mstEdges) {
        console.log(`${e.u} -- ${e.v}  (cost: ${e.weight})`);
      }
      console.log("Total network cost:", totalCost);
    }

    rl.close();
  })().catch((err) => {
    console.error("Error in CLI:", err);
    rl.close();
  });
}

if (require.main === module) {
  // By default run the demo; uncomment runCli() if you want interactive mode.
  runDemo();
  // runCli();
}

module.exports = {
  kruskalMST,
  DisjointSet,
};

