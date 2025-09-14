// import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import type { ScreenplayDataDB } from "../models/screenplay";
import { fetchScreenplayByIdFromDB } from "../services/screenplay";
import { getSelectedScenes } from "../utils/getSelectedScenes";

export default function Shotlist() {
//   const navigate = useNavigate();\
  const { search } = useLocation();
  const { screenplay_id } = useParams();
  const scene_indexes = (new URLSearchParams(search).get("scenes")?.split(",").map(Number)) || [];
  console.log(scene_indexes)

  const [screenplay, setScreenplay] = useState<ScreenplayDataDB>();
  let selectedScenes;

  useEffect(() => {
    const loadScreenplay = async () => {
      if (screenplay_id) {
        const screenplayData = await fetchScreenplayByIdFromDB(screenplay_id);
        setScreenplay(screenplayData!);
        console.log(JSON.parse(screenplayData!.screenplay), screenplay)
        selectedScenes = getSelectedScenes(JSON.parse(screenplayData!.screenplay).scenes, scene_indexes);
        console.log(selectedScenes)
      }
    };
    loadScreenplay();
  }, [screenplay_id]);

  return (
    <>
      <h1>Shot List</h1>
    </>
  );
}