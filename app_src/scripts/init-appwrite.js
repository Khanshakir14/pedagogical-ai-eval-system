require("dotenv").config({ path: ".env.local" });
const { Client, Databases } = require("node-appwrite");

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;

if (!projectId || !apiKey) {
    console.error("Missing NEXT_PUBLIC_APPWRITE_PROJECT_ID or APPWRITE_API_KEY in .env.local");
    process.exit(1);
}

const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

const databases = new Databases(client);

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || "main_db";
const COLLECTION_ID = process.env.APPWRITE_COLLECTION_ID || "feedback";

async function init() {
    try {
        console.log(`Creating database: ${DATABASE_ID}...`);
        try {
            await databases.create(DATABASE_ID, "Main Database");
            console.log("Database created.");
        } catch (err) {
            if (err.code === 409) {
                console.log("Database already exists.");
            } else {
                throw err;
            }
        }

        console.log(`Creating collection: ${COLLECTION_ID}...`);
        try {
            await databases.createCollection(DATABASE_ID, COLLECTION_ID, "Feedback Data");
            console.log("Collection created.");
        } catch (err) {
            if (err.code === 409) {
                console.log("Collection already exists.");
            } else {
                throw err;
            }
        }

        console.log("Adding string attributes to collection...");
        const attributes = [
            "timestamp",
            "problemTopic",
            "conversationId",
            "evaluationType",
            "firstTutor",
            "secondTutor",
            "rating",
            "preference",
            "module"
        ];

        for (const attr of attributes) {
            try {
                // 1000 size for string fields should be generous
                await databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, attr, 1000, false);
                console.log(`Attribute added: ${attr}`);
            } catch (err) {
                if (err.code === 409) {
                    console.log(`Attribute ${attr} already exists.`);
                } else {
                    console.error(`Failed to add ${attr}:`, err.message);
                }
            }
        }

        console.log("\nSetup complete! You can now use Appwrite for your backend.");
    } catch (error) {
        console.error("Initialization error:", error);
    }
}

init();
