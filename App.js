import React, { useState, useEffect } from "react";
import Menu from "./components/Menu";
import Syncronization from "./components/Syncronization";
export default function App() {

  return (

    <Syncronization>
      <Menu />
    </Syncronization>

  );
}