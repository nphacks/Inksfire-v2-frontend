import type { Descendant } from "slate";
import type { Scene } from "../models/screenplay";

export function scenesToSlateValue(scenes: Scene[]): Descendant[] {
    const value: Descendant[] = [];
    for (const scene of scenes) {
      if (scene.slugline) value.push({ type: "slugline", children: [{ text: scene.slugline }] } as any);
      if (scene.action) {
        scene.action.forEach(a => value.push({ type: "action", children: [{ text: a }] } as any));
      }
      if (scene.dialogues) {
        scene.dialogues.forEach(d => {
          value.push({ type: "character", children: [{ text: d.character }] } as any);
          if (d.parenthetical) value.push({ type: "parenthetical", children: [{ text: d.parenthetical }] } as any);
          value.push({ type: "dialogue", children: [{ text: d.text }] } as any);
        });
      }
    }
    return value;
  }