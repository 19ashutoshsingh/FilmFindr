import {Client, Databases, ID, Query} from "appwrite"

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID=import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID=import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(PROJECT_ID)

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
    try {
        // Check if the movie already exists in the database
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('movie_id', movie.id), // ✅ Check by movie ID instead of search term
        ]);

        if (result.documents.length > 0) {
            const doc = result.documents[0];
            await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
                count: doc.count + 1,
            });
        } else {
            // Create a new record only if the movie does not exist
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            });
        }
    } catch (error) {
        console.error(error);
    }
};

export const getTrendingMovies = async () => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.orderDesc('count')
        ]);

        // Use a Map to ensure unique movies based on movie_id
        const uniqueMovies = new Map();
        result.documents.forEach((movie) => {
            if (!uniqueMovies.has(movie.movie_id)) {
                uniqueMovies.set(movie.movie_id, movie);
            }
        });

        return Array.from(uniqueMovies.values()).slice(0, 8); // Ensuring top 5 unique trending movies
    } catch (error) {
        console.error("Error fetching trending movies:", error);
        return [];
    }
};
