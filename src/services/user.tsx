const API_BASE = import.meta.env.VITE_API_URL; 

export const createUser = async () => {
    try {
        const newUserId = crypto.randomUUID();
        const response = await fetch(`${API_BASE}/user/create-user?user_storage_id=${newUserId}`);
        const data = await response.json();
        console.log(data)
        if (data.status_code === 200) {
            localStorage.setItem("inksfire_user_id", data.user.user_storage_id);
            console.log('User created!')
        }
    } catch (error) {
        console.error("Error creating user:", error);
    }
};