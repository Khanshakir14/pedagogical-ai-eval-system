import { getAppwriteServer } from "../lib/appwrite-server";
import { ID } from "node-appwrite";

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function runTest() {
    console.log("Testing Appwrite Connection...");
    const { databases } = getAppwriteServer();
    
    try {
        const doc = await databases.createDocument(
            "main_db",
            "feedback",
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
        
        const docs = await databases.listDocuments("main_db", "feedback");
        console.log("✅ Successfully fetched documents. Total:", docs.total);
        console.log("Setup looks Perfect!");
    } catch(e) {
        console.error("❌ Error during test:", e);
    }
}
runTest();
