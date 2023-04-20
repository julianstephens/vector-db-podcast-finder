import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";
import client from "$lib/server/client";

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const query = data.get("query")?.toString();

        if (!query) return fail(400, { query, missing: true })
        const res = await client.graphql.get().withClassName("Snippet").withFields("episodeName episodeNo").withNearText({ concepts: [...query.split(" ")] }).do()
        return { type: "success", data: res.data.Get.Snippet }
    }
} satisfies Actions;