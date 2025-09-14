import type { Descendant, Element as SlateElement } from "slate";
import type { Scene, ScriptElement } from "../models/screenplay";
import { NodeToText } from "./NodeToText";

const isBlock = (n: any): n is ScriptElement => n && typeof n.type === "string";

export function valueToScenes(value: Descendant[]): Scene[] {
  const scenes: Scene[] = [];
  let currentScene: Scene | null = null;
  let currentCharacter: string | null = null;

  for (const node of value) {
    if (!isBlock(node)) continue;
    switch (node.type) {
      case "slugline":
        if (currentScene) scenes.push(currentScene);
        currentScene = { slugline: NodeToText(node), action: [], dialogues: [] };
        currentCharacter = null;
        break;
      case "action":
        currentScene = currentScene || { action: [], dialogues: [] };
        currentScene.action = currentScene.action || [];
        currentScene.action.push(NodeToText(node));
        break;
      case "character":
        currentScene = currentScene || { action: [], dialogues: [] };
        currentCharacter = NodeToText(node).trim();
        currentScene.dialogues = currentScene.dialogues || [];
        currentScene.dialogues.push({ character: currentCharacter, text: "" });
        break;
      case "dialogue":
        if (!currentScene) currentScene = { action: [], dialogues: [] };
        const lastD = currentScene.dialogues![currentScene.dialogues!.length - 1];
        if (lastD) lastD.text += (lastD.text ? "\n" : "") + NodeToText(node);
        break;
      case "parenthetical":
        if (currentCharacter && currentScene?.dialogues?.length) {
          currentScene.dialogues[currentScene.dialogues.length - 1].parenthetical = NodeToText(node);
        }
        break;
      case "transition":
        currentScene = currentScene || { action: [], dialogues: [] };
        currentScene.action!.push(NodeToText(node));
        break;
      default:
        currentScene = currentScene || { action: [], dialogues: [] };
        currentScene.action!.push(NodeToText(node));
    }
  }
  if (currentScene) scenes.push(currentScene);
  return scenes;
}