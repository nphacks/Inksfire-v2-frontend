import { useCallback, useEffect, useMemo, useState } from "react";
import { createEditor, Transforms, Editor, Range, Element as SlateElement } from "slate";
import type { Descendant } from "slate";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import { withHistory, HistoryEditor } from "slate-history";
import "./ScreenplayEditor.css";
import type { Scene } from "../../models/screenplay";
import { valueToScenes } from "../../utils/valueToScenes";
import AIHelpPopover from "../ai-help-popover/AIHelpPopover";

import type { BaseText, BaseElement, BaseEditor } from "slate";
import { useNavigate, useParams } from "react-router-dom";

type CustomText = BaseText & { isText?: string; color?: string };
type CustomElement = BaseElement & { type?: string; checked?: boolean; children: CustomText[] };

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const makeBlock = (type: string, text = ""): CustomElement => ({
  type,
  children: [{ text }],
});

// --- Component ---
export default function ScreenplayEditor({
  initialValue,
  onSave,
  onSubmit
}: {
  initialValue: Descendant[];
  onSave?: (payload: { value: Descendant[]; scenes: Scene[] }) => Promise<void> | void;
  onSubmit?: (payload: { value: Descendant[]; scenes: Scene[] }) => Promise<void> | void;
}) {
  const navigate = useNavigate();
  const editor = useMemo(() => withHistory(withReact(createEditor() as ReactEditor & HistoryEditor)), []);
  const { screenplay_id } = useParams();
  const { insertData } = editor;
  editor.insertData = (data: DataTransfer) => {
    const text = data.getData("text/plain");
    if (!text) return insertData(data);

    const lines = text.split("\n");
    Editor.withoutNormalizing(editor, () => {
      lines.forEach((line, i) => {
        if (i > 0) Transforms.splitNodes(editor, { always: true });
        Editor.insertText(editor, line);
      });
    });
  };


  const [value, setValue] = useState<Descendant[]>(initialValue);
  const [scenes, setScenes] = useState<Scene[]>([]);
  // const [showAIHelp, setShowAIHelp] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [showPopover, setShowPopover] = useState(false);
  const [savedSelection, setSavedSelection] = useState<Range | null>(null);


  useEffect(() => {
    // Update scenes
    const s = valueToScenes(value);
    setScenes(s);
  }, [value]);

  useEffect(() => {
    if (!editor.selection || Range.isCollapsed(editor.selection)) {
      // setShowAIHelp(false);
      setSelectedText("");
      return;
    }

    const text = Editor.string(editor, editor.selection);
    if (text.trim()) {
      console.log("Selecting: --- ", text);
      setSelectedText(text);
      // setShowAIHelp(true);
    } else {
      // setShowAIHelp(false);
      setSelectedText("");
    }
  }, [editor.selection]);

  const renderElement = useCallback((props: any) => {
    const { element, attributes, children } = props;
    switch (element.type) {
      case "slugline":
        return (
          <div {...attributes} className="slugline">
            <input
              type="checkbox"
              checked={element.checked || false}
              onChange={e => {
                Transforms.setNodes(
                  editor,
                  { checked: e.target.checked } as any, // cast to any
                  { at: ReactEditor.findPath(editor, element) }
                );
              }}
              className="slugline-checkbox"
            />
            {children}
          </div>
        );
      case "action": 
        return <p {...props.attributes}>{props.children}</p>;
      
      case "character": return <div {...attributes} className="character">{children}</div>;
      case "dialogue": return <div {...attributes} className="dialogue">{children}</div>;
      case "parenthetical": return <div {...attributes} className="parenthetical">{children}</div>;
      case "transition": return <div {...attributes} className="transition">{children} {children.length === 0 && <span>&#8203;</span>}</div>;
      default: return <div {...attributes}>{children}</div>;
    }
  }, []);

  // const insertBlock = useCallback((type: string) => {
  //   const block: CustomElement = { type, children: [{ text: "" }] };
  //   Transforms.insertNodes(editor, block);
  //   ReactEditor.focus(editor);
  // }, [editor]);

  const applyBlockType = useCallback((type: string) => {
    if (!editor.selection) return;

    const [match] = Editor.nodes(editor, {
      at: editor.selection,
      match: (n) =>
        !Editor.isEditor(n) && SlateElement.isElement(n), // only elements, not root
    });

    if (match) {
      console.log("applyBlockType called with:", type);
      Transforms.setNodes(
        editor,
        { type },
        { at: editor.selection } // use selection, not match[1]
      );
    } else {
      Transforms.insertNodes(editor, makeBlock(type));
    }

    ReactEditor.focus(editor);
  }, [editor]);


  const handleSave = async () => {
    const s = valueToScenes(value);
      if (onSave) await onSave({ value, scenes: s }); 
    };

    const handleSubmit = async () => {
      const s = valueToScenes(value);
      if (onSubmit) await onSubmit({ value, scenes: s }); 
    };

  const handleAddToPage = (aiResponse: string) => {
    if (!editor || !savedSelection) return;

    const { focus } = savedSelection;

    // Split current block at focus point to insert new node cleanly
    Transforms.splitNodes(editor, { at: focus, always: true });

    // Insert AI text block at the new split point
    Transforms.insertNodes(editor, {
      type: "action",
      children: [{ text: aiResponse, color: "green" }],
    }, { at: Editor.after(editor, focus) || undefined });

    // Remove green after 10s
    setTimeout(() => {
      Transforms.setNodes(editor, { color: undefined }, {
        match: n => n.text !== undefined && n.color === "green",
      });
    }, 10000);

    // Refocus editor
    ReactEditor.focus(editor);
  };


  const renderLeaf = (props: any) => {
    const { attributes, children, leaf } = props;
    return (
      <span
        {...attributes}
        style={{ color: leaf.color ?? "inherit" }} // <-- this applies green
      >
        {children}
      </span>
    );
  };

  const handlePlanShots = () => {
    // const selectedScenes = value.filter((n: any) => n.type === "slugline" && n.checked);
    // console.log("Selected Scenes:", selectedScenes);
    const selectedIndexes = value
                              .map((n: any, i) => (n.type === "slugline" && n.checked ? i : -1))
                              .filter(i => i !== -1);

    console.log("Selected scene indexes:", selectedIndexes, screenplay_id);
    navigate(`/shotlist/${screenplay_id}?scenes=${selectedIndexes.join(",")}`);
  }

  return (
    <div className="screenplay-app">
      <div className="toolbar">
        {["slugline","action","character","dialogue","parenthetical","transition"].map(t => (
          <button key={t} onClick={() => applyBlockType(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
        ))}
       
       <button onClick={handlePlanShots}>
          Plan Shots
        </button>
        <button onClick={() => setShowPopover(true)}>AI Help</button>
        {/* AI Help Popover */}
        {showPopover && (
          <AIHelpPopover
            selectedText={selectedText}
            onClose={() => setShowPopover(false)}
            onAddToPage={handleAddToPage}
            onSubmit={(instruction) => {
              console.log("Send to AI:", selectedText, instruction);
              setShowPopover(false);
            }}
          />
        )}
      </div>
      <Slate editor={editor} initialValue={value} onChange={(v) => setValue(v)}>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Write your screenplay..."
          spellCheck
          style={{ padding: "8px 12px", minHeight: "20px" }}
          onMouseUp={() => {
            const { selection } = editor;
            if (!selection || Range.isCollapsed(selection)) {
              // setShowAIHelp(false);
              
              setSelectedText("");
              return;
            }
            const text = Editor.string(editor, selection);
            if (text.trim()) {
              console.log("Selecting: --- ", text);
              setSelectedText(text);
              setSavedSelection(selection);
              // setShowAIHelp(true);
            }
          }}
        />
      </Slate>

      <button onClick={handleSave}>Save</button>
      <button onClick={handleSubmit}>Submit</button>
      <div className="json-output">
        <h4>Structured Scenes</h4>
        <pre>{JSON.stringify(scenes, null, 2)}</pre>
      </div>
    </div>
  );
}