import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";
import client from "$lib/server/client";

export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const query = formData.get("query")?.toString();

        if (!query) return fail(400, { query, missing: true })
        const res = await client.graphql.get().withClassName("Snippet").withFields("episodeName episodeNo").withNearText({ concepts: [...query.split(" ")] }).do()
        let data = res.data.Get.Snippet;
        console.log(data)
        data = [...new Map(data.map((item: any) =>
            [item["episodeNo"], item])).values()]
        console.log(data)


        return { type: "success", data }
    }
} satisfies Actions;