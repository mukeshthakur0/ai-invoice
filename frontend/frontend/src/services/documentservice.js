import API from "../utils/axios";


// ==========================
// Index Documents
// ==========================

export const indexDocuments = async () => {

    const response = await API.post(
        "/semantic/index"
    );

    return response.data;
};


// ==========================
// Semantic Search
// ==========================

export const searchDocuments = async (query) => {

    const response = await API.post(
        "/semantic/search",
        {
            query
        }
    );

    return response.data;
};