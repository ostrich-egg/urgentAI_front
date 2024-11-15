"use client"
import { useEffect, useState } from "react"
import get_image from "@/lib/location_api";
import Image from "next/image";
import { forwardGeoCoding } from "@/lib/geoCoding";
import { data, users } from "@/lib/database/dummy_db"

import MapDynamic from "@/ui/index";

type Position = {
    lat: number,
    lng: number
};

export default function Page() {
    const [clickedId, setClickedId] = useState<number>(1);
    const [open, setOpen] = useState<boolean>(false);
    const [imagelink, setImagelink] = useState<string>();
    const [location, setLocation] = useState<string>("Nepali");
    const [position, setPosition] = useState<Position>({ lat: 0, lng: 0 });

    useEffect(() => {
        async function get() {
            let r = await get_image(location)
            setImagelink(r);
            let { lat, lng } = await forwardGeoCoding(location);
            setPosition({ lat, lng })
        }
        get()

    }, [location])


    return (
        <div className="w-full h-screen flex items-center justify-between ">

            {/* Left list of emergency */}
            <div className="ml-5 p-5 w-[25vw] text-foreground border-2 border-slate-50 h-[90vh] rounded-md bg-red-50 shadow-md overflow-auto">
                <div className="flex justify-between px-2 py-5 border-b-2 shadow-sm mb-5">
                    <span>Total <br /> {data.length}</span>
                    <span>Critical <br /> {data.filter(each => each.severity == "critical").length}</span>
                    <span>Resolved <br /> {0}</span>
                </div>

                <div className="flex flex-col gap-7 h-full w-full">
                    {data.map(each_data => (
                        <div
                            className="actual_div border-2 px-5 py-2 rounded-md shadow-sm flex justify-between items-center"
                            key={`${each_data.id}`}
                            id={`${each_data.id}`}
                            onClick={(_) => {
                                setClickedId(each_data.id)
                                console.log("location is ", users.filter(user => user.id == each_data.id)[0].location)
                                setLocation(users.filter(user => user.id == each_data.id)[0].location)
                            }}
                        >
                            <div>
                                <p>{each_data.title}</p>
                                <span className="text-sm">{each_data.time}</span>
                            </div>
                            <span className={`text-white rounded-md px-3 ${each_data.severity == "critical" ? "bg-red-700" : each_data.severity == "moderate" ? "bg-red-400" : "bg-orange-300"}`}>{each_data.severity}</span>
                        </div>
                    ))
                    }
                </div>
            </div>


            {/* mapComponent Section */}
            <div className="w-[48%] h-[90vh] drop-shadow-md overflow-scroll">
                <MapDynamic client={position} />
            </div>


            <div className="flex gap-0 relative">
                {/* Right left */}
                {open &&
                    (<div className="p-5 mr-1 w-[25vw] text-foreground border-2 border-slate-50 h-[90vh] rounded-md bg-red-50 flex flex-col gap-7 shadow-md  overflow-scroll absolute top-0  right-[405px] z-[1001]">
                        {open &&
                            imagelink &&
                            <div className="flex flex-col gap-5 text-foreground">
                                <div className="w-full px-2 rounded-md shadow-sm flex flex-col gap-4 justify-center items-center">

                                    <div className=" self-start">
                                        {data.filter(each => each.id == clickedId).map(item => (
                                            <div
                                                className="px-2"
                                                key={item.id}
                                            >
                                                <h1 >{item.title}</h1>
                                                <span className={`text-white rounded-md px-3 ${item.severity == "critical" ? "bg-red-700" : item.severity == "moderate" ? "bg-red-400" : "bg-orange-300"}`}>{item.severity}</span>
                                            </div>
                                        ))}
                                    </div>

                                    < Image
                                        src={imagelink}
                                        alt={""}
                                        height={500}
                                        width={500}
                                        className="object-cover  border-slate-50 border-8"
                                        blurDataURL="Image on load"
                                        placeholder="blur"
                                    />
                                </div>

                                {users.filter(each => each.id == clickedId).map(item => (
                                    <div
                                        key={item.id}
                                        className="flex flex-col justify-around gap-3">

                                        <div className="flex justify-around text-sm">
                                            <span >
                                                lat : <pre>{position.lat}</pre>
                                            </span >
                                            <span>
                                                lng : <pre>{position.lng}</pre>
                                            </span>
                                        </div>

                                        <div className="flex justify-around">
                                            <div className="flex flex-col">
                                                <span className="text-sm">Location : </span>
                                                <span className="text-base">{location}</span>
                                            </div>

                                            <div className="flex flex-col">
                                                <span className="text-sm">Time :</span>
                                                <span className="text-base">{data.filter(e => e.id == item.data_id).map(each => each.time)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="text-base px-2 text-pretty  border-t-2 py-4 flex flex-col gap-2">
                                    <span className="text-sm">Detail: </span>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid unde at nam consectetur velit, veniam ipsum quos quo eaque itaque, incidunt ratione reprehenderit iste! Illum, ad. Quod hic facere debitis.
                                </div>
                            </div>

                        }
                    </div>
                    )
                }


                {/* Right right */}
                <div className="mr-5  p-5 w-[25vw] text-foreground border-2 border-slate-50 h-[90vh] rounded-md bg-red-50 flex flex-col gap-7 shadow-md relative">
                    <div className="flex justify-between px-2 pb-5 h-full mb-5 overflow-scroll">
                        {users.filter(each => each.id == clickedId).map(e => (
                            <div
                                className="h-full w-full "
                                key={e.id}
                            >
                                <div className="flex justify-between items-baseline border-b-2  mb-4 px-4 py-3" >
                                    <button className="border-2 px-3 rounded-full bg-gray-400 border-gray-50 hover:scale-[0.9] text-blue-500 text-[25px] font-black"
                                        onClick={() => {
                                            setLocation(e.location)
                                            setOpen(!open)
                                        }}
                                    >{open == true ? "-" : "+"}
                                    </button>
                                    <span className="text-[17px]">
                                        Location : {e?.location || "NA"}
                                    </span>
                                </div>
                                <div className="flex flex-col gap-5">
                                    {e.messages.map((each, index) =>
                                    (
                                        <div
                                            key={index}
                                            className={`${each.sender == "Chatbot" ? "bg-blue-300 self-end" : "bg-white self-start"}   text-foreground px-5 py-2 rounded-lg w-[250px] flex flex-col`}>
                                            <p>{each.message}</p>
                                            <span className="text-[10px] self-end opacity-60">{each.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <input className="w-full h-[49px] bg-slate-300 border rounded-md p-2  absolute bottom-0 left-0" type="text" />
                </div>
            </div>
        </div >
    )
}