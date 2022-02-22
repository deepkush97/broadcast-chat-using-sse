import React, { useState, useEffect, useRef } from "react";
import { SendLogo } from "../components/SendLogo";
import { DummyUserLogo } from "../components/DummyUserLogo";

interface Message {
  id: string;
  senderId: string;
  message: string;
  senderName: string;
}

const Chat = () => {
  const [name, setName] = useState("");
  const [namedLocked, setNamedLocked] = useState(false);
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);
  const [clientId, setClientId] = useState("");
  const [listening, setListening] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (!listening) {
      const events = new EventSource("http://localhost:3001/connect");

      events.onmessage = (event) => {
        const newMessage = JSON.parse(event.data);
        if (newMessage.message) {
          setMessages((facts) => facts.concat(newMessage));
        } else {
          setClientId(newMessage.clientId);
        }
      };
      setListening(true);
    }
  }, [listening, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!name) return;
    fetch("http://localhost:3001/message", {
      method: "POST",
      body: JSON.stringify({
        senderId: clientId,
        senderName: name,
        message,
        id: Date.now().toString(),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        setMessage("");
      })
      .catch(console.error);
  };
  const handleNameSet: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!name) return;
    setListening(true);
    setNamedLocked(true);
  };
  return (
    <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen">
      <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
        <div className="relative flex items-center space-x-4">
          <div className="flex flex-col leading-tight">
            <form
              onSubmit={handleNameSet}
              className="relative h-10 flex space-x-2 input-component ml-4 md:ml-0"
            >
              <input
                id="name"
                type="text"
                disabled={namedLocked}
                name="name"
                placeholder="Name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-full w-full border border-gray-400 px-2 transition-all rounded"
              />
              <label
                htmlFor="name"
                className="absolute left-2 -top-3 transition-all bg-white px-1"
              >
                Name
              </label>
              <button
                disabled={namedLocked}
                type="submit"
                className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
              >
                <span className="font-bold">Set</span>
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
        {messages.map(({ message, senderId, senderName, id }) => {
          const same = senderId === clientId;
          return (
            <div
              key={id}
              className={`flex items-end ${same ? "justify-end" : ""}`}
            >
              <div
                className={`flex flex-col space-y-2 text-xs max-w-xs mx-2 ${
                  same ? "order-1 items-end" : "order-2 items-start"
                }`}
              >
                <div className={`${same ? "flex flex-col items-end" : ""}`}>
                  <p className="text-xs text-gray-400">{senderName}</p>

                  <span
                    className={`px-4 py-2 rounded-lg inline-block ${
                      same
                        ? " rounded-br-none bg-blue-600 text-white"
                        : " rounded-bl-none bg-gray-300 text-gray-600"
                    }`}
                  >
                    {message}
                  </span>
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-full order-1 flex items-center justify-center ${
                  same ? "bg-gray-300 " : "bg-green-300 "
                } `}
              >
                <DummyUserLogo className="w-4 h-4" />
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
        <form onSubmit={handleSubmit} className="relative flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message!"
            className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-4 bg-gray-200 rounded-md py-3"
          />
          <div className="absolute right-0 items-center inset-y-0 flex">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
            >
              <span className="font-bold">Send</span>
              <SendLogo className="h-6 w-6 ml-2 transform rotate-90" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Chat;
