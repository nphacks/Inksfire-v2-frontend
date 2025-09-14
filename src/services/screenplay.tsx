import type { ScreenplayDataDB } from "../models/screenplay";

const API_BASE = import.meta.env.VITE_API_URL; 


export const fetchAllScreenplaysFromDB = async (): Promise<any[] | null> => {
    const res = await fetch(`${API_BASE}/screenplay/get-all-screenplays`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || `Error ${res.status}`);
    }

    const data = await res.json();
    return data.status_code === 200 ? data.screenplays : null;
};

export const fetchScreenplayByIdFromDB = async (screenplay_id: string): Promise<ScreenplayDataDB | null> => {
    const res = await fetch(`${API_BASE}/screenplay/get-screenplay-sid?screenplay_id=${screenplay_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || `Error ${res.status}`);
    }

    const data = await res.json();
    return data.status_code === 200 ? data.screenplay : null;
};

export const createScreenplayInDB = async (): Promise<string | null> => {
    const screenplayId = crypto.randomUUID();
    const agentSessionId = crypto.randomUUID();
    const userId = localStorage.getItem("inksfire_user_id");
    
    const res = await fetch(`${API_BASE}/screenplay/create-screenplay`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            screenplay_id: screenplayId,
            user_id: userId,
            agent_session_id: agentSessionId,
            version: 1,
            title: "Untitled"
        })
    });

    if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || `Error ${res.status}`);
    }

    const data = await res.json();
    return data.status_code === 200 ? screenplayId : null;
};

export const updateScreenplayDataInDB = async (screenplay_id: string, field: string, value: any): Promise<boolean | null> => {
    const res = await fetch(`${API_BASE}/screenplay/update-screenplay`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            screenplay_id: screenplay_id,
            column: field,
            value: value
        })
    });

    if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || `Error ${res.status}`);
    }

    const data = await res.json();
    return data.status_code === 200 ? true : false;
}

export const submitScreenplayDataInDB = async (screenplay_id: string, field: string, value: any): Promise<boolean | null> => {
     
    
    const res = await fetch(`${API_BASE}/screenplay/submit-screenplay`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            screenplay_id: screenplay_id,
            column: field,
            value: value
        })
    });

    if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || `Error ${res.status}`);
    }

    const data = await res.json();
    return data.status_code === 200 ? true : false;
}