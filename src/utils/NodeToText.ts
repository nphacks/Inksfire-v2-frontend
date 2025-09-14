// --- Parser (Slate value -> Scene JSON) ---
export function NodeToText(node: any): string {
  if (!node) return "";
  if (Array.isArray(node)) return node.map(NodeToText).join("");
  if (node.text !== undefined) return node.text;
  if (node.children) return node.children.map(NodeToText).join("");
  return "";
}