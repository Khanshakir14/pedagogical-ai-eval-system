// lib/appwrite-server.ts
import { Client, Databases } from 'node-appwrite';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;

export function getAppwriteServer() {
    if (!projectId || !apiKey) {
        throw new Error("Appwrite credentials (NEXT_PUBLIC_APPWRITE_PROJECT_ID, APPWRITE_API_KEY) are missing in environment variables.");
    }

    const client = new Client();
    client
        .setEndpoint(endpoint)
        .setProject(projectId)
        .setKey(apiKey);

    const databases = new Databases(client);

    return { client, databases };
}
