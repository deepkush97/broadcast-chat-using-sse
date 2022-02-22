import { Request, Response, Router } from "express";
import { state, addUser, removeUser } from "./state";

export const router = Router();

router.get("/connect", (req: Request, res: Response) => {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  res.writeHead(200, headers);
  const clientId = Date.now().toString();

  const data = `data: ${JSON.stringify({ clientId })}\n\n`;
  res.write(data);
  addUser({
    id: clientId,
    response: res,
  });

  req.on("close", () => {
    console.log(`${clientId} Connection closed`);
    removeUser(clientId);
  });
});

router.post("/message", (req: Request, res: Response) => {
  const message = req.body;
  console.log(message);
  state.clients.forEach((client) =>
    client.response.write(`data: ${JSON.stringify(message)}\n\n`)
  );
  res.status(201).send();
});

router.get("/clients", (request: Request, response: Response) =>
  response.json({ clients: state.clients.map((c) => c.id) })
);
