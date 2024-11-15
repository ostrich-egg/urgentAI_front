/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaMicrophone } from "react-icons/fa6";
import { users, data } from "@/lib/database/dummy_db";
import dynamic from "next/dynamic";

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

function Page() {
  type Message = {
    msg: string;
    time: string;
  };
  const placeholder1 = ["Search ........................"];
  const [messages, setMessages] = useState<string>("");
  const [MessageArray, setMessageArray] = useState<Message[]>([]);
  const [recognizing, setRecognizing] = useState<boolean>(false);
  const micRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState<boolean>(false);

  // const socket = new WebSocket("https://localhost:7878/chat");
  // socket.onopen = (event) => {
  //     console.log("Websocket connection has been established!", event)
  // }
  // socket.onmessage = (event) => {
  //     console.log(`Got message : ${event.data}`)
  // }

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

          // Convert the combined Blob into Base64
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Audio = reader.result?.toString().split(",")[1]; // Extract base64 string
            console.log("Base64 audio:", base64Audio);

            // Send base64 data to the server
            /*
                        fetch('/api/speech/audio', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ audio: base64Audio }),
                        })
                        .then((response) => response.json())
                        .then((data) => {
                            console.log('Base64 Audio Sent Successfully:', data);
                        })
                        .catch((error) => {
                            console.error('Error Sending Base64 Audio:', error);
                        });
                        */
          };
          reader.readAsDataURL(audioBlob); // Convert Blob to Base64

          // Clear audioChunks
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
        }
      }
    };

    recognition.start();
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
    setMessages("");
  }

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    isClient && (
      <div className="flex justify-center items-center h-full w-full">
        <div className="mr-5  p-5 w-[50vw] text-foreground border-2 border-slate-50 h-screen rounded-md bg-red-50 flex flex-col gap-7 shadow-md relative">
          <div className="w-full border-b-2 border-slate-200 pb-2">
            <h1 className="font-black text-pretty text-foreground ">
              UrgentAI.
            </h1>
            <p className="text-xs text-slate-400">We are ready to help you</p>
          </div>

          {MessageArray.map((each, index) => (
            <div
              key={index}
              className="flex flex-col p-4 border-2 border-slate-200 text-blue-500 rounded-lg  w-[350px] self-end"
            >
              <p>{each?.msg}</p>
              <span className="text-xs text-slate-400 self-end">
                {each.time}
              </span>
            </div>
          ))}

          <div className="absolute bottom-0 w-full p-5 right-0 flex justify-center items-center">
            <div
              className="flex justify-center items-center p-4 ml-2 mr-2  border-slate-300 rounded-full bg-slate-200 hover:bg-slate-300 hover:text-black  hover:transition-all hover:duration-1000"
              onClick={handleMicVoice}
            >
              <div ref={micRef}>
                <FaMicrophone className="mic_itself" />
              </div>
            </div>
            <PlaceholdersAndVanishInput
              placeholders={placeholder1}
              onChange={(e) => setMessages(e.target.value)}
              onSubmit={handleButtonClicked}
            />
            {/* <button className='bg-slate-400 h-full border-2 rounded-md px-3 py-2 text-foreground'>Send</button> */}
          </div>
        </div>
      </div>
    )
  );
}

// export default page
export default dynamic(() => Promise.resolve(Page), { ssr: false });
