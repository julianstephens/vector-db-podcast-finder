import type { WeaviateClass, WeaviateClient } from "weaviate-ts-client";
import weaviate from "weaviate-ts-client";

const client: WeaviateClient = weaviate.client({
  scheme: "http",
  host: "localhost:8080",
});

export default client;
