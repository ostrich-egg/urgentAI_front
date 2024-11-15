"use client"

import React, { useState, useRef, useEffect } from 'react'
import { FaMicrophone } from "react-icons/fa6";
import { users, data } from '@/lib/database/dummy_db'
import dynamic from 'next/dynamic';


declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}
function page() {

    type Message = {
        msg: string,
        time: string
    }
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

        // if (typeof window == undefined) {
        //     console.log("Speech recogination can only run on client. Error occured")
        //     return;
        // }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech Recognition is not supported in this browser. Try different, like Google Chrome.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = "ne-NP";
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onstart = function (event: any) {
            console.log("started recognizing");
            setRecognizing(true);
        }

        recognition.onresult = function (event: any) {
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    let data = event.results[i][0].transcript;
                    console.log("data is ", data);
                }
            }
        }

        recognition.onspeechend = function () {
            console.log("recognition end");
            recognition.stop();
            target_elm.querySelector(".mic_itself")?.classList.remove("animate-bounce");
            micRef.current?.classList.remove("animate-bounce");
            setRecognizing(false);
        }

        recognition.onerror = (event: any) => {
            console.log(`Error occurred in recognition: ${event.error}`);
        }
        recognition.start();
    };

    function handleMicVoice(event: any) {
        event.preventDefault();
        event.target.querySelector(".mic_itself")?.classList.add("animate-bounce");
        micRef.current?.classList.add("animate-bounce");
        handleSpeechRecognition(event.target);
    };

    function handleButtonClicked(event: any) {
        event.preventDefault();
        let time = new Intl.DateTimeFormat("en-GB", {
            dateStyle: "short",
            timeStyle: "short",
        }).format(new Date());

        setMessageArray((prev) => [...prev, { msg: messages, time }]);
        setMessages("");
    };

    useEffect(() => {
        setIsClient(true);
    }, [])

    return isClient && (
        <div className='flex justify-center items-center h-full w-full'>
            <div className="mr-5  p-5 w-[50vw] text-foreground border-2 border-slate-50 h-screen rounded-md bg-red-50 flex flex-col gap-7 shadow-md relative">

                <div className='w-full border-b-2 border-slate-200 pb-2'>
                    <h1 className='font-black text-pretty text-foreground '>UrgentAI.</h1>
                    <p className='text-xs text-slate-400'>We are ready to help you</p>
                </div>

                {
                    MessageArray.map((each, index) =>
                    (
                        <div key={index} className="flex flex-col p-4 border-2 border-slate-200 text-blue-500 rounded-lg  w-[350px] self-end">
                            <p>{each?.msg}</p>
                            <span className='text-xs text-slate-400 self-end'>{each.time}</span>
                        </div>
                    ))
                }

                <div className='absolute bottom-0 w-full right-0 flex justify-center items-center'>
                    <div
                        className='flex justify-center items-center p-2 ml-2 border-2 border-slate-300 rounded-full bg-slate-200 hover:bg-slate-300 hover:text-black  hover:transition-all hover:duration-1000'
                        onClick={handleMicVoice}
                    >
                        <div ref={micRef}
                        >
                            <FaMicrophone className='mic_itself' />
                        </div>
                    </div>
                    <form id="form" name="id" action="" onSubmit={handleButtonClicked} className='flex justify-between items-center w-full relative px-5'>
                        <input
                            className="w-full bg-slate-300 border rounded-md p-2  mb-2   bottom-0 left-0"
                            type="text"
                            placeholder='Message here'
                            value={messages}
                            onChange={(event) => setMessages(event.target.value)
                            }
                        />
                        {/* <button className='bg-slate-400 h-full border-2 rounded-md px-3 py-2 text-foreground'>Send</button> */}
                    </form>
                </div>

            </div >
        </div >
    )
}

// export default page
export default dynamic(() => Promise.resolve(page), { ssr: false });
