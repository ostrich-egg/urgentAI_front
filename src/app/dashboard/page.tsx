"use client"
import { useEffect, useState } from "react"
import get_image from "@/lib/location_api";
import Image from "next/image";
import { forwardGeoCoding, reverseGeoCoding } from "@/lib/geoCoding";
// import { data, get_data_with_id, users } from "@/lib/database/dummy_db"
import { get_all_data, get_data_with_id, get_all_initial_info } from "@/lib/database/dummy_db";
import MapDynamic from "@/ui/index";
import { IoIosSettings } from "react-icons/io";
import { BiTransfer } from "react-icons/bi";
import { TfiHeadphoneAlt } from "react-icons/tfi";


export default function Page() {

    type Position = {
        latitude: number,
        longitude: number
    };

    type Location = {
        add1: string,
        add2: string
    }

    const [clickedId, setClickedId] = useState<number>(1);
    const [open, setOpen] = useState<boolean>(false);
    const [imagelink, setImagelink] = useState<string>();
    const [location, setLocation] = useState<Location>({ add1: "Kathmandu", add2: "DurbarMarg" });
    const [position, setPosition] = useState<Position>({ latitude: 27, longitude: 54 });
    const [usersData, setUsersData] = useState<any[]>([]);
    const [clickedData, setClickedData] = useState<any>();
    const [isClient, setIsClient] = useState<boolean>(false);
    const [transferClicked, setTransferClicked] = useState<boolean>(false);
    const [popupMessage, setPopupMessage] = useState<string>("");
    const [popupClass, setpopupClass] = useState<string>("bg-black");

    const handleDispatch = (responder: string, style: string) => {
        setPopupMessage(`${responder} is dispatched to ${location.add2}`);
        setpopupClass(style);
        setTimeout(() => {
            setPopupMessage("");
        }, 3000); // Hide popup after 3 seconds
    };

    // Set isClient to true once the component mounts
    useEffect(() => {
        setIsClient(true)
    }, [])

    async function handleLocation(located_at: Position) {
        let response = await reverseGeoCoding(located_at.latitude, located_at.longitude);
        console.log("rs is ", response)
        setLocation(response);
    }

    useEffect(() => {
        (async () => {
            const users = await get_all_initial_info();
            setUsersData(users);
            setPosition(users.filter(each => each.id == clickedId)[0]?.located_at);
            handleLocation((users.filter(each => each.id == clickedId)[0]?.located_at))
        })()
    }, [])

    useEffect(() => {
        (async () => {
            const r = await get_image(location.add2)
            setImagelink(r);
            const { latitude, longitude } = await forwardGeoCoding(location.add2);
            setPosition({ latitude, longitude })
        })()
    }, [location])

    useEffect(() => {
        (async () => {
            const response = await get_data_with_id(clickedId);
            console.log("clicked response", response)
            setClickedData(response);
        })();
    }, [clickedId]);

    function getSeverity(avg: number): string {
        if (avg >= 7) return "critical";
        if (avg < 7 && avg >= 4) return "moderate";
        return "normal";
    }

    function handelTransferButtonClick(e: any) {
        e.preventDefault();
        setTransferClicked(true);
    }

    function handleTime(unix_time: number): string {
        // const unixTimestamp = 1504095567183; // Unix timestamp in milliseconds
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
        <div className="w-full h-screen flex items-center justify-between ">

            {/* Left list of emergency */}
            <div className="ml-5 p-5 w-[25vw] text-foreground border-2 border-slate-50 h-[90vh] rounded-md bg-red-50 shadow-md overflow-auto scrollbar-hide">
                <div className="flex justify-between px-2 py-5 border-b-2 shadow-sm mb-5">
                    <span>Total <br /> {usersData.length}</span>
                    <span>Critical <br /> {usersData.filter(each => each.average_serverity >= 7).length}</span>
                    <span>Resolved <br /> {0}</span>
                </div>

                <div className="flex flex-col gap-7 h-full w-full">
                    {usersData.map(each_data => (
                        <div
                            className="actual_div border-2 px-5 py-2 rounded-md shadow-sm flex justify-between items-center"
                            key={`${each_data.id}`}
                            id={`${each_data.id}`}
                            onClick={(_) => {
                                setClickedId(each_data.id)
                                handleLocation(usersData.filter(user => user.id == each_data.id)[0].located_at)
                            }}
                        >
                            <div>
                                <p>{each_data.short_description}</p>
                                <span className="text-sm">{handleTime(each_data.time)}</span>
                            </div>
                            <span className={`text-white rounded-md px-3 ${getSeverity(each_data.average_serverity) == "critical" ? "bg-red-700" : getSeverity(each_data.average_serverity) == "moderate" ? "bg-red-400" : "bg-orange-300"}`}>{getSeverity(each_data.average_serverity)}</span>
                        </div>
                    ))
                    }
                </div>
            </div>


            {/* mapComponent Section */}
            <div className="w-[48%] h-[90vh] drop-shadow-md overflow-scroll scrollbar-hide">
                <MapDynamic client={position} />
            </div>

            <div className="flex gap-0 relative">
                {/* Right left */}
                {open &&
                    (<div className="p-5 mr-1 w-[25vw] text-foreground border-2 border-slate-50 h-[90vh] rounded-md bg-red-50 flex flex-col gap-7 shadow-md  overflow-scroll scrollbar-hide absolute top-0  right-[405px] z-[1001]">
                        {
                            open &&
                            clickedData &&
                            < div className="flex flex-col gap-5 text-foreground">
                                <div className="w-full px-2 rounded-md shadow-sm flex flex-col gap-4 justify-center items-center">

                                    <div className=" self-start">
                                        {/* {data.filter(each => each.id == clickedId).map(item => ( */}
                                        <div
                                            className="px-2"
                                            key={clickedData.id}
                                        >
                                            <h1 >{clickedData.short_description}</h1>
                                            <span className={`text-white rounded-md px-3 ${getSeverity(clickedData.average_serverity) == "critical" ? "bg-red-700" : getSeverity(clickedData.average_serverity) == "moderate" ? "bg-red-400" : "bg-orange-300"}`}>{getSeverity(clickedData.average_serverity)}</span>
                                        </div>
                                        {/* ))} */}
                                    </div>

                                    < Image
                                        src={imagelink || "/siren.png"}
                                        alt={""}
                                        height={300}
                                        width={300}
                                        className="object-cover  border-slate-50 border-8"
                                        blurDataURL="Image on load"
                                        placeholder="blur"
                                    />
                                </div>

                                {/* {clickedData.filter(each => each.id == clickedId).map(item => ( */}
                                <div
                                    key={clickedData.id}
                                    className="flex flex-col justify-around gap-3">
                                    <div className="flex justify-between text-sm">
                                        <span >
                                            <span>lat: </span>
                                            <span>{position.latitude}</span>
                                        </span >
                                        <span>
                                            <span>lng: </span>
                                            <span>{position.longitude}</span>
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-3 ">
                                        <div className="flex flex-col">
                                            <span className="text-sm">Location : </span>
                                            <span className="text-base">{location.add1}</span>
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="text-sm">Time :</span>
                                            <span className="text-base">
                                                {clickedData.messages[0].sent_at}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {/* ))} */}
                                <div className="text-base px-2 text-pretty  border-t-2 py-4 flex flex-col gap-2">
                                    <span className="text-sm">Detail: </span>
                                    {clickedData.description}
                                </div>

                                {/* Responder ui */}
                                <div className="flex w-full flex-col space-y-2">
                                    <p className="text-lg font-semibold">Dispatch first responders:</p>

                                    <div className="mb-2 flex justify-between gap-1">
                                        {/* Police Button */}
                                        <button
                                            className="inline-flex whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground h-10 py-2 max-w-fit flex-1 items-center justify-center rounded-md bg-blue-500 px-2 hover:bg-blue-600"
                                            onClick={() => handleDispatch("Police", "bg-blue-500")}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="lucide lucide-siren mr-2"
                                            >
                                                <path d="M7 18v-6a5 5 0 1 1 10 0v6"></path>
                                                <path d="M5 21a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z"></path>
                                                <path d="M21 12h1"></path>
                                                <path d="M18.5 4.5 18 5"></path>
                                                <path d="M2 12h1"></path>
                                                <path d="M12 2v1"></path>
                                                <path d="m4.929 4.929.707.707"></path>
                                                <path d="M12 12v6"></path>
                                            </svg>
                                            <p className="overflow-clip text-ellipsis">Police</p>
                                        </button>

                                        {/* Firefighters Button */}
                                        <button
                                            className="inline-flex whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground h-10 py-2 flex-1 items-center justify-center rounded-md bg-red-500 px-2 hover:bg-red-600"
                                            onClick={() => handleDispatch("Firefighters", "bg-red-500")}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="lucide lucide-fire-extinguisher mr-2 min-w-fit"
                                            >
                                                <path d="M15 6.5V3a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v3.5"></path>
                                                <path d="M9 18h8"></path>
                                                <path d="M18 3h-3"></path>
                                                <path d="M11 3a6 6 0 0 0-6 6v11"></path>
                                                <path d="M5 13h4"></path>
                                                <path d="M17 10a4 4 0 0 0-8 0v10a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2Z"></path>
                                            </svg>
                                            <p className="overflow-clip text-ellipsis">Firefighters</p>
                                        </button>

                                        {/* Paramedics Button */}
                                        <button
                                            className="inline-flex whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground h-10 py-2 flex-1 items-center justify-center rounded-md bg-green-500 px-2 hover:bg-green-600"
                                            onClick={() => handleDispatch("Paramedics", "bg-green-500")}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="lucide lucide-ambulance mr-2"
                                            >
                                                <path d="M10 10H6"></path>
                                                <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path>
                                                <path d="M19 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.578-.502l-1.539-3.076A1 1 0 0 0 16.382 8H14"></path>
                                                <path d="M8 8v4"></path>
                                                <path d="M9 18h6"></path>
                                                <circle cx="17" cy="18" r="2"></circle>
                                                <circle cx="7" cy="18" r="2"></circle>
                                            </svg>
                                            <p className="overflow-clip text-ellipsis">Paramedics</p>
                                        </button>
                                    </div>

                                    {popupMessage && (
                                        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 ${popupClass} text-white px-4 py-2 rounded-md shadow-md`}>
                                            {popupMessage}
                                        </div>
                                    )}
                                </div>
                                {/* Responder ui end*/}




                            </div>

                        }
                    </div>
                    )
                }


                {/* Right right */}
                <div className="mr-5  p-5 w-[25vw] text-foreground border-2 border-slate-50 h-[90vh] rounded-md bg-red-50 flex flex-col gap-7 shadow-md relative">
                    <div className="flex justify-between px-2 pb-5 h-full mb-5 overflow-scroll scrollbar-hide ">
                        <div
                            className="h-full w-full"
                            key={clickedData?.id}
                        >
                            <div className="flex justify-between items-center   mb-4  py-3 border-b- shadow-sm 2 " >
                                <button className=" p-2 rounded-full  hover:scale-[0.9] text-[30px] font-black"
                                    onClick={(e) => {
                                        setOpen(!open)
                                    }}
                                >
                                    <IoIosSettings className={`transition-transform duration-300 ${open ? "rotate-180" : "-rotate-180"
                                        }`} />
                                </button>
                                <span className="text-[17px]">
                                    {location.add2 || "NA"}
                                </span>
                            </div>
                            <div className="flex flex-col gap-5">
                                {clickedData?.messages?.map((each: any, index: number) =>
                                (
                                    <div
                                        key={each.id}
                                        className={`${each.author == "bot" ? "bg-blue-300 self-end" : "bg-white self-start"}   text-foreground px-5 py-2 rounded-lg w-[250px] flex flex-col`}>
                                        <p>{each.message}</p>
                                        <span className="text-[10px] self-end opacity-60">{each.sent_at}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>



                    <button
                        onClick={handelTransferButtonClick}
                        className={` w-full h-[49px] ${!transferClicked ? "bg-green-600 text-white" : "bg-white text-black border-green-500"} text-white border border-slate-200 rounded-md p-2 absolute bottom-0 left-0`} >
                        {transferClicked ?
                            <div className="flex justify-center items-center gap-2 ">
                                <TfiHeadphoneAlt />
                                <p>Transfered to Human</p>
                            </div>
                            :
                            <div className="flex justify-center items-center gap-2">
                                < p>Transfer to Responder</p>
                                <BiTransfer className="font-black" />

                            </div>
                        }
                    </button>

                </div>
            </div >
        </div >
    )
}