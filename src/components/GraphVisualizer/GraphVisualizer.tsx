
import { useRef } from "react";
import { useEffect, useState } from "react";

export default function GraphVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [graph, setGraph] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    (async () => {
      const res = await fetch("aachen.json");
      const rawCoordinates = await res.json();
      const normalizedCoordinates = normalizeGraphToCanvas(rawCoordinates, canvas.width, canvas.height);
      setGraph(normalizedCoordinates);
    })();
  }, []);

  useEffect(() => {
    if (!graph) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const nodes = graph.nodes;
    const edges = graph.edges;
    for (const edgeId in edges) {
      const { u, v, ...rest } = edges[edgeId];
      displayEdge(ctx, nodes[u], nodes[v]);
    }
    for (const nodeId in nodes) {
      const { x, y } = nodes[nodeId];
      displayNode(ctx, x, y);
    }
  }, [graph]);

  function normalizeGraphToCanvas(graph: any, width: number, height: number) {
    const nodes = graph.nodes ?? graph["nodes"];
    const vals = Object.values(nodes);

    const minX = Math.min(...vals.map((n: any) => n.x));
    const maxX = Math.max(...vals.map((n: any) => n.x));
    const minY = Math.min(...vals.map((n: any) => n.y));
    const maxY = Math.max(...vals.map((n: any) => n.y));

    const scale = Math.min(width / (maxX - minX), height / (maxY - minY));

    // Object.entries (Object => array)
    // .map (transform coords)
    // Object.fromEntries (array => Object)
    const normNodes = Object.fromEntries(
      Object.entries(nodes).map(([id, node]: [string, any]) => {
        const x = (node.x - minX) * scale;
        const y = height - (node.y - minY) * scale;
        return [id, { x, y }];
      })
    );

    return { ...graph, nodes: normNodes };
  }

  function displayNode(ctx: CanvasRenderingContext2D, nodeX: number, nodeY: number) {
    ctx.beginPath();
    ctx.arc(nodeX, nodeY, 2, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
  }

  function displayEdge(ctx: CanvasRenderingContext2D, nodeA, nodeB) {
    ctx.beginPath();
    ctx.moveTo(nodeA.x, nodeA.y);
    ctx.lineTo(nodeB.x, nodeB.y);
    ctx.strokeStyle = "gray"
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  return (
    <>
      {!graph && <span className="loading loading-spinner"></span>
      }

      <canvas
        ref={canvasRef}
        width={850}
        height={850}
        style={{ width: 850, height: 850, imageRendering: "crisp-edges" }}
      />
    </>
  );

}
