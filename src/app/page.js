"use client";

import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SpeedReader from "./SpeedReader";

const page = () => {
  return (
    <div className="bg-neutral-950 font-sans">
      <SpeedReader />
    </div>
  );
};

export default page;
