/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaMicrophone } from "react-icons/fa6";
import { users, data } from "@/lib/database/dummy_db";
import dynamic from "next/dynamic";
import { whereAmI } from "@/lib/getLocation";
import MapComponent from "@/ui/map";
import {
  Send,
  Phone,
  MapPin,
  BadgeIcon as Police,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatChatMessage } from "@/lib/parse";
import { getData } from "@/lib/temp";

import WavEncoder from "wav-encoder";

import markdownit from "markdown-it";

import DOMPurify from "dompurify";

import MapDynamic from "@/ui/index";


const md = markdownit();

type PoliceUnit = {
  id: number;
  latitude: number;
  longitude: number;
  eta: number;
};

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

function sendToBackend(encodedData: string) {
  fetch("/api/speech", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ transcript: encodedData }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

type Position = {
  latitude: number;
  longitude: number;
};

function Page() {
  let position: Position = { latitude: 0, longitude: 0 };
  const [location, setLocation] = useState<Position | null>(null);

  useEffect(() => {
    async function get() {
      const r = await whereAmI();
      console.log(r);
       position = { latitude: r[0], longitude: r[1] };
      // 28.9985° N, 83.8473° E mustang
      // 26.8065° N, 87.2847° E dharan
      // 28.2964° N, 84.8568° E gorkha
      // position = { latitude: 26.8065, longitude: 87.2847 }
      setLocation(position);

    }
    get();
  }, []);

  // Function to render sanitized HTML from Markdown
  const renderMarkdown = (text: any) => {
    const renderedHtml = md?.render(text || ""); // Convert Markdown to HTML
    const sanitizedHtml = DOMPurify.sanitize(renderedHtml); // Sanitize for safety
    return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
  };

  const [ws, setWs] = useState<WebSocket | null>(null);
  const [sessionId, setSessionId] = useState(() =>
    localStorage.getItem("session_id")
  );
  const [newMessage, setNewMessage] = useState("");

  type Message = {
    id: number;
    text?: string;
    audio?: Blob;
    sender: "user" | "ai";
    timestamp: Date;
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "100, what's your emergency?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);

  useEffect(() => {
    const websocket = new WebSocket(
      "wss://brave-titmouse-primary.ngrok-free.app/prompt-ws"
    );

    websocket.onopen = () => {
      console.log("connected");
      if (sessionId) {
        websocket.send(
          JSON.stringify({ type: "RECONNECT_SESSION", session: sessionId })
        );
      } else {
        console.log("posi", position);
        websocket.send(
          JSON.stringify({ type: "REQUEST_SESSION", located_at: position })
        );
        
      }
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received:", data);

      const receivedMessage: Message = {
        id: Date.now(),
        text: data.msg,
        sender: "ai",
        timestamp: new Date(),
      };

      switch (data.type) {
        case "SESSION_CREATED":
          localStorage.setItem("session_id", data.session);
          setSessionId(data.session);
          break;

        case "SESSION_RECONNECTED":
          setMessages(data.messages || []);
          break;

        case "COMMUNICATE_ACK":
          setMessages((prev) => [...prev, receivedMessage]);
          break;

        case "ANY_ERROR":
          console.error("Error:", data.error);
          break;

        default:
          console.warn("Unhandled message type:", data.type);
      }
    };

    websocket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws && sessionId) {
      ws.send(
        JSON.stringify({
          type: "COMMUNICATE",
          session: sessionId,
          msg: newMessage,
          author: "user",
          audio: null,
        })
      );
      setNewMessage("");

      if (newMessage.trim()) {
        const userMessage: Message = {
          id: messages.length + 1,
          text: newMessage,
          sender: "user",
          timestamp: new Date(),
        };
        setMessages([...messages, userMessage]);
        setNewMessage("");
      }
    }
  };

  const [isTyping, setIsTyping] = useState(false);
  const [policeUnits, setPoliceUnits] = useState<PoliceUnit[]>([
    { id: 1, latitude: 40.7128, longitude: -74.006, eta: 0 },
    { id: 2, latitude: 40.7138, longitude: -74.007, eta: 0 },
    { id: 3, latitude: 40.7118, longitude: -74.005, eta: 0 },
  ]);

  useEffect(() => {
    const data = getData();
    if(data){
      setPoliceUnits([{ id: 1, latitude: 40.7128, longitude: -74.006, eta: 10 }]);
    }

  }, []);


  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (newMessage.trim()) {
      const userMessage: Message = {
        id: messages.length + 1,
        text: newMessage,
        sender: "user",
        timestamp: new Date(),
      };
      setMessages([...messages, userMessage]);
      setNewMessage("");
      simulateAIResponse(userMessage);
    }
  };

  const simulateAIResponse = (userMessage: Message) => {
    setIsTyping(true);
    setTimeout(() => {
      const aiMessage: Message = {
        id: messages.length + 2,
        text: generateAIResponse("fire"),
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
      setIsTyping(false);
      updatePoliceUnits();
    }, 1500);
  };

  const generateAIResponse = (userMessage: string) => {
    // This is a simple simulation. In a real scenario, you'd use a more sophisticated AI model.
    if (userMessage.toLowerCase().includes("fire")) {
      return "I understand there's a fire. Can you provide the exact location? I'm dispatching firefighters to your area.";
    } else if (userMessage.toLowerCase().includes("medical")) {
      return "I'm sending an ambulance to your location. Can you describe the medical emergency?";
    } else {
      return "I've alerted the police. They're on their way. Can you provide more details about the situation?";
    }
  };

  const updatePoliceUnits = () => {
    setPoliceUnits((prevUnits) =>
      prevUnits.map((unit) => ({
        ...unit,
        eta: Math.max(0, unit.eta - 1),
      }))
    );
  };

  const formatTime = (date: Date | undefined) => {
    if (!date || !(date instanceof Date)) return "Invalid Time";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const placeholder1 = ["Message"];
  const [MessageArray, setMessageArray] = useState<
    { msg: Message[]; time: string }[]
  >([]);
  const [recognizing, setRecognizing] = useState<boolean>(false);
  const micRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState<boolean>(false);

  function handleSpeechRecognition(target_elm: any) {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(
        "Speech Recognition is not supported in this browser. Try a different one, like Google Chrome."
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "ne-NP";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    let mediaRecorder: MediaRecorder | null = null;
    let audioChunks: Blob[] = [];
    let recognizedText: string | null = null;

    // Start Recording Audio
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {
          console.log("Data available:", event.data);
          audioChunks.push(event.data);
          console.log("Current audioChunks size:", audioChunks.length);
        };

        mediaRecorder.onstop = () => {
          // Combine all chunks into one Blob
          const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
          console.log("Audio blob created:", audioBlob);
          console.log(recognizedText);
          convertToWavAndSend(audioBlob, recognizedText);

          const newMessage: Message = {
            id: messages.length + 1,
            audio: audioBlob,
            sender: "user",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, newMessage]);

          simulateAIResponse(newMessage);

          audioChunks = [];
        };

        mediaRecorder.start();

        // Stop recording after recognition ends
        recognition.onspeechend = function () {
          console.log("Speech recognition ended");
          recognition.stop();
          mediaRecorder?.stop();
          target_elm
            .querySelector(".mic_itself")
            ?.classList.remove("animate-bounce");
          micRef.current?.classList.remove("animate-bounce");
          setRecognizing(false);
        };

        recognition.onerror = (event: any) => {
          console.error(`Error occurred in recognition: ${event.error}`);
          mediaRecorder?.stop();
        };
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });

    recognition.onstart = function () {
      console.log("Speech recognition started");
      setRecognizing(true);
    };

    recognition.onresult = function (event: any) {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          const data = event.results[i][0].transcript;
          console.log("Recognized text:", data);
          recognizedText = data;
        }
      }
    };

    recognition.start();
  }

  async function convertToWavAndSend(audioBlob: Blob, text: string | null) {
    try {
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioContext = new AudioContext();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const wavData = WavEncoder.encode({
        sampleRate: audioBuffer.sampleRate,
        channelData: [audioBuffer.getChannelData(0)], // Single channel for mono
      });

      const wavDataBuffer = await wavData;
      const wavBlob = new Blob([wavDataBuffer], { type: "audio/wav" });

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Audio = reader.result?.toString().split(",")[1];
        sendAudioAndTextToBackend(base64Audio, text);
      };
      reader.readAsDataURL(wavBlob);
    } catch (error) {
      console.error("Error converting to WAV:", error);
    }
  }

  function sendAudioAndTextToBackend(
    base64Audio: string | undefined,
    text: string | null
  ) {
    if (!base64Audio) {
      console.error("No audio data to send");
      return;
    }

    console.log(base64Audio);
    console.log(text);

    if (ws && sessionId) {
      ws.send(
        JSON.stringify({
          type: "COMMUNICATE",
          session: sessionId,
          msg: text,
          author: "user",
          audio: base64Audio,
        })
      );
    }
  }

  function handleMicVoice(event: any) {
    event.preventDefault();
    micRef.current?.classList.add("animate-bounce");
    handleSpeechRecognition(event.target);
  }

  function handleButtonClicked(event: any) {
    event.preventDefault();
    const time = new Intl.DateTimeFormat("en-GB", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date());

    setMessageArray((prev) => [...prev, { msg: messages, time }]);
    setMessages([]);
  }

  useEffect(() => {
    setIsClient(true);
  }, []);


  return (
    isClient && (
      <div
        style={{ height: "100vh" }}
        className="flex space-x-5 w-full p-5  rounded-lg shadow-5xl bg-background"
      >
        <div className="flex flex-col w-2/3 border shadow-2xl  rounded-2xl ">
          <div
            className=" p-4 border-b bg-red-100 "
            style={{
              borderTopLeftRadius: "15px",
              borderTopRightRadius: "15px",
              borderBottomLeftRadius: "0",
              borderBottomRightRadius: "0",
            }}
          >
            <h2 className=" text-lg font-semibold flex items-center">
              <Phone className="mr-2 h-5 w-5 text-red-600 animate-pulse" />
              Emergency AI Support
            </h2>
          </div>
          <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"
                  } mb-4`}
              >
                {/* AI Profile Picture */}
                {message.sender === "ai" && (
                  <div className="mr-2 flex-shrink-0">
                    <img
                      src="/img/chatbot.png" // Replace with your AI profile picture URL
                      alt="AI Profile"
                      className="w-8 h-8 rounded-full"
                    />
                  </div>
                )}

                {/* Message Content */}
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                    }`}
                >
                  {
                    message?.text &&
                    formatChatMessage(message.text)
                  }

                  {/* Audio Message */}
                  {message.audio && (
                    <audio controls className=" w-[200px]">
                      <source
                        src={URL.createObjectURL(message.audio)}
                        type="audio/mpeg"
                      />
                      Your browser does not support the audio element.
                    </audio>
                  )}

                  {/* Timestamp */}
                  <div className="flex justify-between items-center mt-2">
                    <p
                      className={`text-xs ${message.sender === "user"
                        ? "text-primary-foreground/70"
                        : "text-secondary-foreground/70"
                        }`}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-secondary text-secondary-foreground rounded-lg p-3">
                  <p className="text-sm">AI is typing...</p>
                </div>
              </div>
            )}
          </ScrollArea>
          <div className="p-4 border-t">
            <div className=" bottom-0 w-full right-0 flex justify-center items-center">
              <div
                className="flex justify-center items-center p-4 ml-2 border-slate-300 rounded-full bg-slate-200 hover:bg-slate-300 hover:text-black  hover:transition-all hover:duration-1000"
                onClick={handleMicVoice}
              >
                <div ref={micRef}>
                  <FaMicrophone className="mic_itself" />
                </div>
              </div>
              <PlaceholdersAndVanishInput
                placeholders={placeholder1}
                onChange={(e) => setNewMessage(e.target.value)}
                onSubmit={sendMessage}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-10 w-1/3 p-4  ">
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Emergency Response Map
            </h3>
            <div className="bg-gray-300 dark:bg-gray-700 h-64 mb-4 mt-5 rounded-lg flex items-center justify-center">
              
            <div className="h-full w-full rounded-xl shadow-lg ">
                <MapDynamic client={location} />
            </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Nearby Police Units</h4>
            {policeUnits.map((unit) => (
              <div
                key={unit.id}
                className="mb-2 p-2 mt-5 bg-white dark:bg-gray-900 rounded-lg shadow"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Police className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Unit {unit.id}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">{unit.eta} min</span>
                  </div>
                </div>
                <Progress
                  value={100 - (unit.eta / 10) * 100}
                  className="mt-2"
                />
              </div>
            ))}
            <div className="mt-4 p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                <span className="text-sm font-medium">
                  High Alert: Multiple Units Dispatched
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

// export default page
export default dynamic(() => Promise.resolve(Page), { ssr: false });