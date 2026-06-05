import faiss
import numpy as np

dimension = 384

indexes_by_user = {}

chunks_by_user = {}


def add_to_index(user_id, chunks, embeddings):
    user_id = int(user_id)
    embeddings_array = np.asarray(embeddings, dtype="float32")

    if embeddings_array.size == 0:
        return

    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings_array)

    indexes_by_user[user_id] = index
    chunks_by_user[user_id] = list(chunks)


def semantic_search(user_id, query_embedding, top_k=5):
    user_id = int(user_id)
    index = indexes_by_user.get(user_id)
    document_chunks = chunks_by_user.get(user_id, [])

    if index is None or index.ntotal == 0:
        return []

    safe_top_k = min(top_k, index.ntotal)

    distances, indices = index.search(
        np.asarray([query_embedding], dtype="float32"),
        safe_top_k
    )

    results = []

    for i in indices[0]:

        if i < len(document_chunks):

            results.append(
                document_chunks[i]
            )

    return results
