import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { createUser } from "../services/user";
import { createScreenplayInDB, fetchAllScreenplaysFromDB } from "../services/screenplay";

export default function Home() {
    const navigate = useNavigate();
     const [screenplays, setScreenplays] = useState<any[]>([]);

    useEffect(() => {
        const userId = localStorage.getItem("inksfire_user_id");
        if (!userId) {
            console.log("inksfire_user_id not found in localStorage");
            createUser();
        }

        const loadScreenplays = async () => {
            const screenplaysData = await fetchAllScreenplaysFromDB();
            if (screenplaysData) {
                setScreenplays(screenplaysData);
            }
        };
        loadScreenplays();
    }, []);


    const createScreenplay = async () => {
        const screenplayId = await createScreenplayInDB();
        if (screenplayId) {
            navigate(`/screenplay/${screenplayId}`);
        }
    }


    return (
        <>
            <h1>Home Page</h1>
            <div>
                {screenplays.map(screenplay => (
                    <div key={screenplay.screenplay_id} onClick={() => navigate(`/screenplay/${screenplay.screenplay_id}`)} style={{cursor: 'pointer'}}>
                        <h3>{screenplay.title}</h3>
                        <p>Author: {screenplay.author}</p>
                    </div>
                ))}
            </div>
            <button onClick={createScreenplay}>Create Screenplay</button>
        </>
    );
}