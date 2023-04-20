import * as fs from "fs";
import * as path from "path";
import * as csv from "@fast-csv/parse"
import type { WeaviateClass, WeaviateClient, WeaviateObject } from "weaviate-ts-client";
import weaviate from "weaviate-ts-client";

const client: WeaviateClient = weaviate.client({
    scheme: "http",
    host: "localhost:8080",
});

const schema: WeaviateClass = {
    class: "Snippet",
    description: "An snippet of an episode transcription from the VOX - Today Explained podcast",
    vectorizer: "text2vec-transformers",
    properties: [
        {
            name: "date",
            dataType: ["date"],
        },
        {
            name: "episodeName",
            dataType: ["text"],
        },
        {
            name: "episodeNo",
            dataType: ["number"],
        },
        {
            name: "text",
            dataType: ["text"],
            description: "Text to vectorize",
            moduleConfig: {
                "text2vec-transformers": {
                    skip: false,
                    vectorizePropertyName: false,
                },
            },
        },
    ],
};

const createSchema = async () => {
    const schemaRes = await client.schema.getter().do();
    const snippet = schemaRes.classes?.find((c) => c.class?.toLowerCase() === "snippet");
    if (!snippet) await client.schema.classCreator().withClass(schema).do();
    return schemaRes.classes ? schemaRes : await client.schema.getter().do();
};

const loc = path.resolve(__dirname, "../.", "VOX_today_explained_podcast_transcripts.csv")

const main = async () => {
    await createSchema();
    const rows: WeaviateObject[] = [];
    fs.createReadStream(loc)
        .pipe(csv.parse({ headers: ["date", "episodeName", undefined, "text", undefined, "episodeNo"], renameHeaders: true, ignoreEmpty: true, }))
        .on('error', error => console.error(error))
        .on('data', row => {
            rows.push({
                class: "Snippet",
                properties: {
                    ...row,
                    date: `${row.date.split(" ").join("T")}Z`,
                    episodeNo: Number.parseInt(row.episodeNo)
                }
            })
        })
        .on('end', async (rowCount: number) => {
            console.log(`Parsed ${rowCount} rows`)
            await client.batch.objectsBatcher().withObjects(...rows)
            console.log("COMPLETE")
        });
};
main();

