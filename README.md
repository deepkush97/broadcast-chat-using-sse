# Broadcast Chat using SSE (Server Sent Event)

## Introduction

- Server Sent Event or SSE is when a web page automatically gets updates from a server.
- A browser can subscribe to a stream of events generated by a server, receiving updates whenever a new event occurs.
- SSE is designed to use the JavaScript EventSource API in order to subscribe to a stream of data in any popular browser. Through this interface a client requests a particular URL in order to receive an event stream.

## Project Details

- This project is divided into two parts: backend and frontend.
- The backend utilizes express to create an event stream which `EventSource` of the browser can connect to.
- Whenever an update is generated by server, it will push it to every client connected and everybody receives the broadcasted message.
- The frontend part is a simple Next.js project with tailwind CSS for styling.
- So, when client is rendered in browser, it will connect with the server using `EventSource` and listens to `onmessage` event.
- Whenever a message is received, it will be shown in the UI.
- With the help of this, I have created a working prototype of a broadcasting chat application where, if clients are connected to the server, a client can broadcast the message to everyone.

**NOTE 1: SSE is uni-directional, that is it sends data from server to client only. So, for sending the message from client to server, the post API endpoint is created.**
**NOTE 2: SSE is used to send string data only, not binary data, so if some objects or arrays needed to passed, it has to use `stringify` and `parse` JSON, which is acceptable for small application with low updates, but it receives a performance hit when traffic is huge, both in data and clients or if the data is too complicated.**

## Usage of SSE

- SSE can be used to develop application which needs realtime data from server and just display it on client browser, like certain dashboards, text broadcaster, and many more things.

**If the data seems to be very complicated, or data is in form of binary data, `Web Sockets` will be more viable option for that.**