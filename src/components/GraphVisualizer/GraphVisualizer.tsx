import { useRef, useEffect, useState } from "react";
import { initializeDijkstra, dijkstraOneStep } from "../Algorithms/Dijkstra";
import { drawNode, drawEdge } from "./drawHelpers";
import { useMap } from "../../stores/mapStore";
import { useToolMode } from "../../stores/toolMode";

const CHUNK_SIZE = 1;

export default function GraphVisualizer() {
  const svgRef = useRef<SVGSVGElement>(null);

  const distancesRef = useRef<Record<string, number>>({});
  const predecessorsRef = useRef<Record<string, string | undefined>>({});
  const pqRef = useRef<Record<string, any>>({});
  const visitedRef = useRef<Record<string, boolean>>({});
  const animRef = useRef<number | null>(null);

  const nodeElsRef = useRef<Record<string, SVGCircleElement>>({});
  const [graph, setGraph] = useState<any>(null);
  const [sourceNode, setSourceNode] = useState<string | undefined>(undefined);
  const [sinkNode, setSinkNode] = useState<string | undefined>(undefined);


  const { map } = useMap();
  const { mode } = useToolMode();
  const modeRef = useRef(mode);
  useEffect(() => { modeRef.current = mode; }, [mode]);



  // ---------- helpers ----------
  const getLayers = () => {
    const svg = svgRef.current!;
    return {
      edges: svg.querySelector("#edges") as SVGGElement,
      processed: svg.querySelector("#processedEdges") as SVGGElement,
      nodes: svg.querySelector("#nodes") as SVGGElement,
    };
  };

  const stopAnimation = () => {
    if (animRef.current != null) cancelAnimationFrame(animRef.current);
    animRef.current = null;
  };

  const clear = (g: SVGGElement) => g.replaceChildren();

  const drawGraph = (graph: any) => {
    const { edges, nodes } = graph;
    const { edges: E, nodes: N, processed: P } = getLayers();
    clear(E); clear(N); clear(P);
    nodeElsRef.current = {};

    // Edges
    for (const id in edges) {
      const { u, v } = edges[id];
      E.appendChild(drawEdge(nodes[u], nodes[v], "var(--color-neutral-content)", 2));
    }

    // Nodes (+ click -> pick source)
    for (const id in nodes) {
      const { x, y } = nodes[id];
      const el = drawNode(x, y, 3, "var(--color-neutral-content)");
      // 5) click handler: support both modes
      el.addEventListener("click", () => {
        const currentMode = modeRef.current;            
        console.log("node click:", id, "mode:", currentMode); 

        if (currentMode === "addSource") {
          resetDijkstraStates(graph);
          setSourceNode(id);
          Object.values(nodeElsRef.current).forEach(n => n.classList.remove("is-source"));
          el.classList.add("is-source");
        } else if (currentMode === "addSink") {
          setSinkNode(id);
          Object.values(nodeElsRef.current).forEach(n => n.classList.remove("is-sink"));
          el.classList.add("is-sink");
        }
      });


      nodeElsRef.current[id] = el;
      N.appendChild(el);
    }
  };

  const resetDijkstraStates = (graph: any) => {
    const nodeIDs = Object.keys(graph.nodes);
    visitedRef.current = Object.fromEntries(nodeIDs.map(k => [k, false])) as Record<string, boolean>;
    distancesRef.current = {};
    predecessorsRef.current = {};
    pqRef.current = {};
    const { processed } = getLayers();
    processed.replaceChildren();
    Object.values(nodeElsRef.current).forEach(el =>
      el.setAttribute("fill", "var(--color-neutral-content)")
    );
  };

  const drawProcessed = (graph: any, u: string) => {
    const { nodes, adjacencies } = graph;
    nodeElsRef.current[u]?.setAttribute("fill", "var(--color-primary)");
    const { processed } = getLayers();
    for (const [v] of adjacencies?.[u] ?? []) {
      if (visitedRef.current[v]) {
        processed.appendChild(drawEdge(nodes[u], nodes[v], "var(--color-primary)", 2));
      }
    }
  };

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
  // ---------- helpers ----------

  // 1) Load & normalize map
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    (async () => {
      const res = await fetch(map);
      const raw = await res.json();
      const width = svg.clientWidth;
      const height = svg.clientHeight;
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      setGraph(normalizeGraphToCanvas(raw, width, height));
    })();
    return stopAnimation;
  }, [map]);

  // 2) Draw static graph once it's available
  useEffect(() => {
    if (!graph || !svgRef.current) return;
    drawGraph(graph);
    stopAnimation();
    setSourceNode(undefined);
  }, [graph]);

  // 3) Run Dijkstra after user picks a source
  useEffect(() => {
    if (!graph || !sourceNode || !sinkNode) return;

    resetDijkstraStates(graph);
    initializeDijkstra(
      graph,
      sourceNode,
      distancesRef.current,
      predecessorsRef.current,
      pqRef.current
    );

    const renderChunk = () => {
      for (let i = 0; i < CHUNK_SIZE; i++) {
        const u = dijkstraOneStep(
          graph,
          sourceNode,
          distancesRef.current,
          predecessorsRef.current,
          pqRef.current
        );
        if (!u) break;
        if (!visitedRef.current[u]) {
          visitedRef.current[u] = true;
          drawProcessed(graph, u);
        }
      }
      const notFinished = Object.keys(pqRef.current).length > 0;
      animRef.current = notFinished ? requestAnimationFrame(renderChunk) : null;
    };

    stopAnimation();
    animRef.current = requestAnimationFrame(renderChunk);
    return stopAnimation;
  }, [graph, sourceNode, sinkNode]);

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
