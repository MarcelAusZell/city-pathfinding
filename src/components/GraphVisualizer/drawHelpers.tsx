export function drawNode(x: number, y: number, r: number, fill: string) {
  const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  c.setAttribute("cx", String(x));
  c.setAttribute("cy", String(y));
  c.setAttribute("r", String(r));
  c.setAttribute("fill", fill);
  return c;
}

export function drawEdge(
  a: { x: number; y: number },
  b: { x: number; y: number },
  stroke: string,
  strokeWidth: number
) {
  const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
  l.setAttribute("x1", String(a.x));
  l.setAttribute("y1", String(a.y));
  l.setAttribute("x2", String(b.x));
  l.setAttribute("y2", String(b.y));
  l.setAttribute("stroke", stroke);
  l.setAttribute("stroke-width", String(strokeWidth));
  return l;
}