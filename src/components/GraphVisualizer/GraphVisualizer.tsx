import { useRef, useEffect, useState } from "react";
import { initializeDijkstra, getRandomNode, dijkstraOneStep } from "../Algorithms/Dijkstra";
import { drawNode, drawEdge } from "./drawHelpers";

const CHUNK_SIZE = 10;

export default function GraphVisualizer() {
  const svgRef = useRef<SVGSVGElement>(null);
  const distancesRef = useRef<Record<string, number>>({});
  const predecessorsRef = useRef<Record<string, string | undefined>>({});
  const pqRef = useRef<Record<string, any>>({});
  const visitedRef = useRef<Record<string, boolean>>({});
  const animRef = useRef<number | null>(null);

  const nodeElsRef = useRef<Record<string, SVGCircleElement>>({});
  const [graph, setGraph] = useState<any>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    (async () => {
      const res = await fetch("Aachen, Germany.json");
      const raw = await res.json();
      const width = svg.clientWidth;
      const height = svg.clientHeight;
      const normalized = normalizeGraphToCanvas(raw, width, height);
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      setGraph(normalized);
    })();
  }, []);

  useEffect(() => {
    if (!graph || !svgRef.current) return;

    const svg = svgRef.current;
    const edgesLayer = svg.querySelector("#edges") as SVGGElement;
    const processedEdgesLayer = svg.querySelector("#processedEdges") as SVGGElement;
    const nodesLayer = svg.querySelector("#nodes") as SVGGElement;

    const nodes = graph.nodes;
    const edges = graph.edges;
    const sourceNode = getRandomNode(graph);

    visitedRef.current = Object.fromEntries(Object.keys(nodes).map(k => [k, false])) as Record<string, boolean>;
    distancesRef.current = {};
    predecessorsRef.current = {};
    pqRef.current = {};
    nodeElsRef.current = {};

    initializeDijkstra(graph, sourceNode, distancesRef.current, predecessorsRef.current, pqRef.current);

    function clearLayer(layer: SVGGElement) {
      while (layer.firstChild) layer.removeChild(layer.firstChild);
    }

    function drawMap() {
      clearLayer(edgesLayer);
      clearLayer(nodesLayer);
      clearLayer(processedEdgesLayer);

      for (const edgeId in edges) {
        const { u, v } = edges[edgeId];
        const a = nodes[u], b = nodes[v];
        edgesLayer.appendChild(drawEdge(a, b, "lightgray", 2));
      }

      for (const nodeId in nodes) {
        const { x, y } = nodes[nodeId];
        const el = drawNode(x, y, 3, "lightgray");
        nodeElsRef.current[nodeId] = el;
        nodesLayer.appendChild(el);
      }
    }

    function drawProcessed(u: string) {
      const nodeEl = nodeElsRef.current[u];
      if (nodeEl) nodeEl.setAttribute("fill", "blue");

      const neighbors = graph.adjacencies?.[u];
      if (!neighbors) return;

      for (const [v] of neighbors) {
        if (visitedRef.current[v]) {
          const a = nodes[u], b = nodes[v];
          processedEdgesLayer.appendChild(drawEdge(a, b, "blue", 1));
        }
      }
    }

    function renderChunk() {
      for (let i = 0; i < CHUNK_SIZE; i++) {
        const u = dijkstraOneStep(graph, sourceNode, distancesRef.current, predecessorsRef.current, pqRef.current);
        if (!u) break;
        if (!visitedRef.current[u]) {
          visitedRef.current[u] = true;
          drawProcessed(u);
        }
      }
      const notFinished = Object.keys(pqRef.current).length > 0;
      animRef.current = notFinished ? requestAnimationFrame(renderChunk) : null;
    }

    drawMap();
    animRef.current = requestAnimationFrame(renderChunk);

    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
      animRef.current = null;
    };
  }, [graph]);



  function normalizeGraphToCanvas(graph: any, width: number, height: number) {
    const nodes = graph.nodes;
    const minX = Math.min(...nodes.map((n: any) => n.x));
    const maxX = Math.max(...nodes.map((n: any) => n.x));
    const minY = Math.min(...nodes.map((n: any) => n.y));
    const maxY = Math.max(...nodes.map((n: any) => n.y));
    const scale = Math.min(width / (maxX - minX), height / (maxY - minY));
    const normNodes = Object.fromEntries(
      nodes.map((n: any) => {
        const x = (n.x - minX) * scale;
        const y = height - (n.y - minY) * scale;
        return [n.id, { x, y }];
      })
    );
    return { ...graph, nodes: normNodes };
  }

  return (
    <>
      {!graph && <span>Loading...</span>}

      <svg ref={svgRef} width="90vh" height="90vh">
        <g id="edges" />
        <g id="processedEdges" />
        <g id="nodes" />
      </svg>
    </>
  );
}


