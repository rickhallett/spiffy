import fastify from "fastify";

interface IQuerystring {
  username: string;
  password: string;
}

interface IHeaders {
  "h-Custom": string;
}

interface IReply {
  200: { success: boolean };
  302: { url: string };
  "4xx": { error: string };
}

const server = fastify();

server.get("/ping", async (request, reply) => {
  return reply.send({ ping: "server running!" });
});

server.get<{
  path: string;
  Querystring: IQuerystring;
  Headers: IHeaders;
  Reply: IReply;
}>("/auth", async (request, reply) => {
  const { username, password } = request.query;
  const customerHeader = request.headers["h-Custom"];
  // do something with request data

  // chaining .statusCode/.code calls with .send allows type narrowing. For example:
  // this works
  reply.code(200).send({ success: true });
  // it even works for wildcards
  reply.code(404).send({ error: "Not found" });
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
