import type { Descendant } from "slate";

export type Dialogue = { 
    character: string; 
    parenthetical?: string; 
    text: string };

export type Scene = { 
    slugline?: string; 
    action?: string[]; 
    dialogues?: Dialogue[] };


export type ScreenplayDataDB = {
  screenplay_id: string,
  user_id: string,
  version: number,
  title: string,
  author: string,
  screenplay: string,
  outline: object,
  characters: object, 
  storylines: object, 
  locations: object, 
  props: object, 
  summary: string, 
}

export type SluglineElement = { type: "slugline"; children: Descendant[]; checked?: boolean; };
export type ActionElement = { type: "action"; children: Descendant[] };
export type CharacterElement = { type: "character"; children: Descendant[] };
export type DialogueElement = { type: "dialogue"; children: Descendant[] };
export type ParentheticalElement = { type: "parenthetical"; children: Descendant[] };
export type TransitionElement = { type: "transition"; children: Descendant[] };

export type ScriptElement = SluglineElement | ActionElement | CharacterElement | DialogueElement | ParentheticalElement | TransitionElement;
