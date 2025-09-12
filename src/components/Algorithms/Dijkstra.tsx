export function getRandomNode(graph) {
  const ids = Object.keys(graph.nodes);
  return ids[Math.floor(Math.random() * ids.length)];
}

function getNeighbours(graph, node) {
  const list = graph.adjacencies?.[node];
  if (!list) return [];
  return Array.isArray(list) ? list : Object.entries(list);
}

export function initializeDijkstra(graph, sourceNode, distances, predecessors, priorityQueue) {
  for (const nodeID in graph.nodes) {
    distances[nodeID] = Infinity;
    predecessors[nodeID] = undefined;
    priorityQueue[nodeID] = graph.nodes[nodeID];
  }

  distances[sourceNode] = 0;
  predecessors[sourceNode] = sourceNode;
}

export function dijkstraOneStep(graph, sourceNode, distances, predecessors, priorityQueue) {
  if (Object.keys(priorityQueue).length === 0) return null;

  const u = Object.keys(priorityQueue).sort((a, b) => distances[a] - distances[b])[0];
  delete priorityQueue[u];

  const neighbours = getNeighbours(graph, u);
  for (const [v, edgeCost] of neighbours) {
    const alt = distances[u] + edgeCost;
    if (alt < distances[v]) {
      distances[v] = alt;
      predecessors[v] = u;
    }
  }
  return u; 
}