// Dijkstra's Algorithm - Shortest path in a weighted graph
// -------------------------------------------------------
// graph: { vertex: { neighbor: weight, ... } }
// start: starting vertex
// Returns: { vertex: shortestDistance, ... }

function dijkstra(graph, start) {
  // Collect all vertices (keys + neighbors)
  const vertices = new Set(Object.keys(graph));
  for (const v of Object.keys(graph)) {
    for (const n of Object.keys(graph[v] || {})) {
      vertices.add(n);
    }
  }

  const distances = {};
  const visited = new Set();

  for (const v of vertices) {
    distances[v] = v === start ? 0 : Infinity;
  }

  while (visited.size < vertices.size) {
    let minVertex = null;
    let minDist = Infinity;

    for (const v of vertices) {
      if (!visited.has(v) && distances[v] < minDist) {
        minDist = distances[v];
        minVertex = v;
      }
    }

    if (minVertex === null || minDist === Infinity) break;
    visited.add(minVertex);

    const neighbors = graph[minVertex] || {};
    for (const [neighbor, weight] of Object.entries(neighbors)) {
      const newDist = distances[minVertex] + weight;
      const currentDist = distances[neighbor] ?? Infinity;
      if (newDist < currentDist) {
        distances[neighbor] = newDist;
      }
    }
  }

  return distances;
}

// ---- Test with the provided example ----

const graph = {
  A: { B: 4, C: 2 },
  B: { A: 4, C: 5, D: 10 },
  C: { A: 2, B: 5, D: 3 },
  D: { B: 10, C: 3 },
};

console.log("dijkstra(graph, 'A'):", dijkstra(graph, "A"));
// Expected: { A: 0, B: 4, C: 2, D: 5 }

module.exports = { dijkstra };
