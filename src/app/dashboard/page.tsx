
"use client"
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { IoIosSettings } from "react-icons/io";
import { BiTransfer } from "react-icons/bi";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import get_image from "@/lib/location_api";
import { forwardGeoCoding, reverseGeoCoding } from "@/lib/geoCoding";
import { get_data_with_id } from "@/lib/database/dummy_db";
import MapDynamic from "@/ui/index";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bell,
    AlertTriangle,
    CheckCircle,
    Clock,
    MapPin,
    MessageSquare,
    Shield,
    Flame,
    Heart
} from "lucide-react";
import { resolve } from "path";

export default function Page() {

    type Position = {
        latitude: number,
        longitude: number
    };

    type Location = {
        add1: string,
        add2: string
    }

    const [clickedId, setClickedId] = useState<string>("2cfb651e59e44fbbb10aa62f0d9ff0be");
    const [open, setOpen] = useState<boolean>(false);
    const [imagelink, setImagelink] = useState<string>();
    const [location, setLocation] = useState<Location>({ add1: "Kathmandu", add2: "DurbarMarg" });
    const [position, setPosition] = useState<Position>({ latitude: 29.6824, longitude: 80.5689 });
    const [usersData, setUsersData] = useState<any[]>([]);
    const [clickedData, setClickedData] = useState<any>();
    const [isClient, setIsClient] = useState<boolean>(false);
    const [transferClicked, setTransferClicked] = useState<boolean>(false);
    const [popupMessage, setPopupMessage] = useState<string>("");
    const [popupClass, setpopupClass] = useState<string>("bg-black");
    const [resolved, setResolved] = useState<number>(0);


    const severityColors = {
        critical: "bg-red-600",
        moderate: "bg-amber-500",
        normal: "bg-emerald-500"
    };

    const getSeverityClass = (avg: number) => {
        if (avg >= 6) return severityColors.critical;
        if (avg < 6 && avg >= 4) return severityColors.moderate;
        return severityColors.normal;
    };

    const handleDispatch = (responder: string, style: string) => {
        setPopupMessage(`${responder} is dispatched to ${location.add2}`);
        setpopupClass(style);
        setTimeout(() => {
            setPopupMessage("");
        }, 3000);

        (async () => {
            let response = await fetch(`https://brave-titmouse-primary.ngrok-free.app/recorded-data?session_id=${clickedId}`, {
                method: "DELETE",
            })
            console.log("response is ", response)
            if (response.ok) {
                setUsersData(usersData.filter(each => each.session_id !== clickedId))
                setResolved(prev => prev + 1);
            }
        })()

    };

    useEffect(() => {
        setIsClient(true)
    }, [])

    async function handleLocation(located_at: Position) {
        let response = await reverseGeoCoding(located_at.latitude, located_at.longitude);
        setLocation(response);
    }


    // useEffect(() => {
    //     (async () => {
    //         try {
    //             // const response = await get_all_initial_info();
    //             const response = await fetch("https://brave-titmouse-primary.ngrok-free.app/recorded-data", { "method": "GET", });
    //             const data: DataItem[] = await response.json();
    //             console.log("Received data:", data);
    //             if (!response.ok) { throw new Error(`HTTP error! Status: ${response.status}`); }

    //             const selectedUser = data.filter(each => each.session_id == clickedId);
    //             console.log("selected user", selectedUser);

    //             // const data = await response.json();
    //             // Parse the JSON response
    //             // const selectedUser = data.filter(each => each.session_id === clickedId)[0];
    //             // setPosition(selectedUser?.located_at);
    //             // handleLocation(selectedUser?.located_at);


    //             // const users = await get_all_initial_info();
    //             // console.log("Users:", users);
    //             // setUsersData(users);
    //             // const selectedUser = users.filter(each => each.session_id === clickedId)[0];
    //             // setPosition(selectedUser?.located_at);
    //             // handleLocation(selectedUser?.located_at);
    //         } catch (error) {
    //             console.error("Error during fetch:", error);
    //         }
    //     })()
    // }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://brave-titmouse-primary.ngrok-free.app/recorded-data", {
                    method: "GET",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data: DataItem[] = await response.json();
                const RequiredData = data.filter(each => !each.unrated);
                setUsersData(RequiredData)
            } catch (error) {
                console.error("Error during fetch:", error);
            }
        };

        fetchData();

    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const clickedData = usersData.filter(each => each.session_id == clickedId)[0];
                console.log("Clicked data is ", clickedData);
                setClickedData(clickedData)
            } catch (error) {
                console.error("Error during fetch:", error);
            }
        };

        fetchData();
    }, [clickedId])

    useEffect(() => {
        (async () => {
            const r = await get_image(location.add2)
            setImagelink(r);
            const { latitude, longitude } = await forwardGeoCoding(location.add2);
            setPosition({ latitude, longitude })
        })()
    }, [location])

    function getSeverity(avg: number): string {
        if (avg >= 6) return "critical";
        if (avg < 6 && avg >= 4) return "moderate";
        return "normal";
    }

    function handelTransferButtonClick(e: any) {
        e.preventDefault();
        setTransferClicked(true);
    }

    function handleTime(unix_time: number): string {
        const date = new Date(unix_time);

        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${month}/${day}/${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
    }

    return isClient && (
        <div className="w-full h-screen bg-slate-50 p-4 flex items-center justify-between gap-4">
            {/* Left Panel - Emergency List */}
            <div className="w-[25vw] h-[90vh] bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
                <div className="p-6 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
                    <h2 className="text-xl font-semibold mb-4">Emergency Dashboard</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-slate-800/50 p-3 rounded-lg text-center">
                            <Bell className="w-5 h-5 mb-1 mx-auto" />
                            <p className="text-sm opacity-75">Total</p>
                            <p className="text-xl font-bold">{usersData.length}</p>
                        </div>
                        <div className="bg-red-500/20 p-3 rounded-lg text-center">
                            <AlertTriangle className="w-5 h-5 mb-1 mx-auto" />
                            <p className="text-sm opacity-75">Critical</p>
                            <p className="text-xl font-bold">{usersData.filter(each => each.average_severity >= 6).length}</p>
                        </div>
                        <div className="bg-green-500/20 p-3 rounded-lg text-center">
                            <CheckCircle className="w-5 h-5 mb-1 mx-auto" />
                            <p className="text-sm opacity-75">Resolved</p>
                            <p className="text-xl font-bold">{resolved}</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-4 space-y-3">
                    {
                        usersData.length > 0 ?
                            usersData.map((each_data, index) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={index}
                                    onClick={() => {
                                        setClickedId(each_data.session_id);
                                        handleLocation(usersData.filter(user => user.session_id == each_data.session_id)[0].located_at);
                                    }}
                                    className={`p-4 bg-white rounded-lg shadow-sm border-2 cursor-pointer transform transition-all duration-200 hover:scale-[1.02] ${clickedId === each_data.session_id ? "border-blue-500" : "border-transparent"
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <p className="font-medium text-slate-800">{each_data.short_description}</p>
                                            <div className="flex items-center mt-2 text-sm text-slate-500">
                                                <Clock className="w-4 h-4 mr-1" />
                                                <span>{handleTime(each_data.messages[0].sent_at)}</span>
                                            </div>
                                        </div>
                                        <span className={`ml-3 px-3 py-1 rounded-full text-white text-sm ${getSeverityClass(each_data.average_severity)}`}>
                                            {getSeverity(each_data.average_severity)}
                                        </span>
                                    </div>
                                </motion.div>
                            ))
                            :
                            <pre className="italic">No Data Yet!</pre>
                    }
                </div>
            </div>

            {/* Center Panel - Map */}
            <div className="flex-1 h-[90vh] rounded-xl shadow-lg overflow-hidden">
                <MapDynamic client={position} />
            </div>

            {/* Right Panel - Details & Chat */}
            <div className="w-[25vw] h-[90vh] flex flex-col relative">
                <div className="absolute -left-[400] z-[1000] w-[25vw] h-[90vh] overflow-scroll scrollbar-hide">
                    <AnimatePresence >
                        {open && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-white rounded-xl shadow-lg p-6 "
                            >
                                {clickedData && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-semibold">{clickedData.short_description}</h3>
                                            <span className={`px-3 py-1 rounded-full text-white text-sm ${getSeverityClass(clickedData.average_severity)}`}>
                                                {getSeverity(clickedData.average_severity)}
                                            </span>
                                        </div>

                                        <Image
                                            src={imagelink || "/siren.png"}
                                            alt=""
                                            height={300}
                                            width={300}
                                            className="w-full h-48 object-cover rounded-lg"
                                        />

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center">
                                                <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                                                <span>{location.add1}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="w-4 h-4 mr-2 text-slate-400" />
                                                <span>{handleTime(clickedData.messages[0].sent_at)}</span>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-slate-50 rounded-lg">
                                            <h4 className="text-sm font-medium mb-2">Details:</h4>
                                            <p className="text-sm text-slate-600">{clickedData.description}</p>
                                        </div>

                                        <div className="space-y-3">
                                            <h4 className="font-medium">Dispatch First Responders:</h4>
                                            <div className="grid grid-cols-3 gap-3">
                                                <button
                                                    onClick={() => handleDispatch("Police", "bg-blue-500")}
                                                    className="flex flex-col items-center p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                                >
                                                    <Shield className="w-6 h-6 mb-1" />
                                                    <span className="text-sm">Police</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDispatch("Firefighters", "bg-red-500")}
                                                    className="flex flex-col items-center p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                                >
                                                    <Flame className="w-6 h-6 mb-1" />
                                                    <span className="text-sm">Fire</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDispatch("Paramedics", "bg-green-500")}
                                                    className="flex flex-col items-center p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                                >
                                                    <Heart className="w-6 h-6 mb-1" />
                                                    <span className="text-sm">Medical</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>


                <div className="flex-1 bg-white rounded-xl shadow-lg flex flex-col">
                    <div className="p-4 border-b flex items-center justify-between">
                        <button
                            onClick={() => setOpen(!open)}
                            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                        >
                            <IoIosSettings className={`w-6 h-6 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
                        </button>
                        <span className="font-medium">{location.add2 || "Location N/A"}</span>
                    </div>

                    <div className="flex-1 overflow-auto p-4 space-y-4">
                        {
                            clickedData ?
                                clickedData.messages?.map((each: any, index: number) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={index}
                                        className={`flex ${each.author === "bot" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-lg p-3 ${each.author === "bot"
                                                ? "bg-blue-500 text-white"
                                                : "bg-slate-100 text-slate-800"
                                                }`}
                                        >
                                            <p className="text-sm">{each.message}</p>
                                            <span className="text-xs opacity-75 mt-1 block text-right">
                                                {handleTime(each.sent_at)}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))
                                :
                                <pre className="italic">No Data Yet!</pre>
                        }
                    </div>

                    <button
                        onClick={handelTransferButtonClick}
                        className={`m-4 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${transferClicked
                            ? "bg-green-50 text-green-600 border-2 border-green-500"
                            : "bg-green-500 text-white hover:bg-green-600"
                            }`}
                    >
                        {transferClicked ? (
                            <>
                                <TfiHeadphoneAlt className="w-5 h-5" />
                                <span>Transferred to Human</span>
                            </>
                        ) : (
                            <>
                                <span>Transfer to Responder</span>
                                <BiTransfer className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>
            </div>

            {popupMessage && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    className={`fixed top-4 left-1/2 transform -translate-x-1/2 ${popupClass} text-white px-6 py-3 rounded-lg shadow-lg z-[2000]`}
                >
                    {popupMessage}
                </motion.div>
            )}
        </div>

    );
}