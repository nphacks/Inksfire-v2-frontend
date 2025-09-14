import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Descendant } from "slate";
import { fetchScreenplayByIdFromDB, submitScreenplayDataInDB, updateScreenplayDataInDB } from "../services/screenplay";
import "./styles/Screenplay.css";
import ScreenplayEditor from "../components/screenplay-editor/ScreenplayEditor";
import type { ScreenplayDataDB } from "../models/screenplay";


export default function Screenplay() {
  // const navigate = useNavigate();
  const { screenplay_id } = useParams();
  const [screenplay, setScreenplay] = useState<ScreenplayDataDB>();

  useEffect(() => {
    const loadScreenplay = async () => {
      if (screenplay_id) {
        const screenplayData = await fetchScreenplayByIdFromDB(screenplay_id);
        setScreenplay(screenplayData!);
        console.log(JSON.parse(screenplayData!.screenplay), screenplay)
      }
    };
    loadScreenplay();
  }, [screenplay_id]);

  // const initialValue: Descendant[] = [
  //   { type: "slugline", children: [{ text: "INT. COFFEE SHOP - DAY" }] } as any,
  //   { type: "action", children: [{ text: "A crowded café. Baristas rush between tables." }] } as any,
  //   { type: "character", children: [{ text: "JANE" }] } as any,
  //   { type: "parenthetical", children: [{ text: "(whispering)" }] } as any,
  //   { type: "dialogue", children: [{ text: "Did you see him?" }] } as any,
  // ];

  const handleSave = async (payload: { value: Descendant[]; scenes: any[] }) => {
    console.log("Slate Value:", payload.value);       // raw editor value
    console.log("Structured Scenes:", payload.scenes, typeof payload.scenes); // parsed JSON
    await updateScreenplayDataInDB(screenplay_id!, 'screenplay', { scenes: payload.value })
  };

  const handleSubmit = async (payload: { value: Descendant[]; scenes: any[] }) => {
    console.log("Slate Value:", payload.value);       // raw editor value
    console.log("Structured Scenes:", payload.scenes, typeof payload.scenes); // parsed JSON
    await submitScreenplayDataInDB(screenplay_id!, 'screenplay', { scenes: payload.value })
  };

  return (
    <>
      {screenplay && (
        <div>
          <pre>{JSON.stringify(screenplay, null, 2)}</pre>
        </div>
      )}
      {screenplay && (
        <ScreenplayEditor
          initialValue={JSON.parse(screenplay.screenplay).scenes}
          onSave={handleSave}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
}