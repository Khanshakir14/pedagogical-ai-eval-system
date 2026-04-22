require('dotenv').config({ path: '.env.local' });
const { Client, Databases, ID } = require("node-appwrite");

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || "main_db";
const COLLECTION_ID = process.env.APPWRITE_COLLECTION_ID || "feedback";

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
const databases = new Databases(client);

async function runTest() {
    console.log("Testing Appwrite Connection...");
    try {
        const doc = await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID,
            ID.unique(),
            {
                timestamp: new Date().toISOString(),
                problemTopic: "Test Topic",
                conversationId: "test-id",
                evaluationType: "auto",
                firstTutor: "GPT-4",
                secondTutor: "Claude",
                rating: "Good",
                preference: "first",
                module: "TestModule"
            }
        );
        console.log("✅ Successfully created document:", doc.$id);
        
        const docs = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
        console.log("✅ Successfully fetched documents. Total:", docs.total);
        console.log("Setup looks Perfect!");
    } catch(e) {
        console.error("❌ Error during test:", e);
    }
}
runTest();
