"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import siren from "../../public/siren.png"

import 'bootstrap/dist/css/bootstrap.min.css';

import { NavBar } from "@/components/NavBar";
import { Banner } from "@/components/Banner";
import  NewsSlider  from "@/components/NewsSlider";

export default function Home() {

  const router = useRouter();
  return (
<div>
    {/*<div className={` flex justify-center items-center flex-col bg-secondary w-full h-[100vh] text-foreground p-10 gap-1`}>*/}
      <NavBar />
      <Banner />
      {/*
      <Image
        width={350}
        height={350}
        src={siren}
        alt="Urgent"
        className="object-cover absolute top-0"

      />
      */}
      <h1 className=" font-medium text-9xl pt-20">urgent AI</h1>
      <p className="text-3xl">Emergency helping service</p>


      <div className="flex gap-x-28">
        <button
          className="px-10 py-3 bg-foreground text-background rounded-sm mt-20 hover:scale-[0.95]"
          onClick={() => {
            router.push("/client")
          }}>
          Victim
        </button>

        <button
          className="px-10 py-3 bg-foreground text-background rounded-sm mt-20 hover:scale-[0.95]"
          onClick={() => {
            router.push(`/dashboard`)
          }}>
          Police
        </button>
      </div>
    </div>
  );
}
