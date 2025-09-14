import { useRef, useState } from "react";
import Draggable from "react-draggable";

export default function AIHelpPopover({
  selectedText,
  onClose,
  onSubmit,
  onAddToPage
}: {
  selectedText: string;
  onClose: () => void;
  onSubmit: (instruction: string) => void;
  onAddToPage: (text: string) => void;
}) {
    const [instruction, setInstruction] = useState("");
    const nodeRef = useRef<HTMLDivElement>(null);
    const [aiResponse, setAIResponse] = useState<string | null>(null);
    // const [added, setAdded] = useState(false);

    const handleDummyAI = () => {
    // Dummy backend response
    setAIResponse("This is a suggested rewrite/idea from AI.");
    };
    

    return (
        <Draggable handle=".handle" nodeRef={nodeRef}>
            <div
                ref={nodeRef}
                style={{
                position: "absolute",
                top: "50px",
                left: "50px",
                background: "#fff",
                border: "1px solid #ccc",
                padding: "12px",
                borderRadius: "8px",
                zIndex: 1000,
                width: "300px",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                }}
            >
                <div className="handle" style={{ marginBottom: "8px", fontWeight: "bold", cursor: "move" }}>
                    {selectedText || "AI Help"}
                </div>
                    <textarea
                        value={instruction}
                        onChange={(e) => setInstruction(e.target.value)}
                        placeholder="Type instruction..."
                        style={{ width: "100%", height: "80px", marginBottom: "8px" }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={() => onSubmit(instruction)}>Submit</button>
                    <div style={{ marginTop: 8 }}>
                    <button onClick={handleDummyAI}>Get AI Response</button>

                    {aiResponse && (
                        <div>
                            <p>{aiResponse}</p>
                            <button onClick={() => onAddToPage(aiResponse!)}>Add Text to Page</button>
                        </div>
                    )}
                    </div>
                </div>
            </div>
        </Draggable>
    );
}
