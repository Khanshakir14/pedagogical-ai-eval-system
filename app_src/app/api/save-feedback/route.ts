// app/api/save-feedback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAppwriteServer } from "@/lib/appwrite-server";
import { ID, Query } from "node-appwrite";

export const runtime = "nodejs";

const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || "main_db";
const COLLECTION_ID = process.env.APPWRITE_COLLECTION_ID || "feedback";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            problemTopic,
            conversationId,
            evaluationType,
            firstTutor,
            secondTutor,
            rating,
            preference,
            module,
            timestamp: clientTs,
        } = body;

        const timestamp = clientTs || new Date().toISOString();

        const { databases } = getAppwriteServer();

        const document = await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID,
            ID.unique(),
            {
                timestamp,
                problemTopic: problemTopic || null,
                conversationId: conversationId || null,
                evaluationType: evaluationType || null,
                firstTutor: firstTutor || null,
                secondTutor: secondTutor || null,
                rating: rating || null,
                preference: preference || null,
                module: module || null,
            }
        );

        return NextResponse.json(
            { success: true, message: "Feedback saved successfully!", feedbackId: document.$id },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error saving feedback to Appwrite:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to save feedback",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const module = searchParams.get("module");
        const problemTopic = searchParams.get("problemTopic");
        const tutor = searchParams.get("tutor");

        const { databases } = getAppwriteServer();

        const queries = [];
        if (module) queries.push(Query.equal("module", module));
        if (problemTopic) queries.push(Query.equal("problemTopic", problemTopic));
        if (tutor) {
             // Appwrite doesn't easily do OR queries across different fields in a simple list without Query.or()
             // So we just fetch all or we can use Query.or
             queries.push(
               Query.or([
                 Query.equal("firstTutor", tutor),
                 Query.equal("secondTutor", tutor)
               ])
             );
        }

        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            queries.length > 0 ? queries : undefined
        );

        return NextResponse.json(
            {
                feedbacks: response.documents,
                metadata: { totalFeedbacks: response.total, lastUpdated: new Date().toISOString() },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error retrieving feedback from Appwrite:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to retrieve feedback",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
