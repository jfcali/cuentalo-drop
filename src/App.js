import React, { useState, useEffect } from "react";

import { csv } from "d3-fetch";

import url from "./Data/sm.csv";

import "./App.css";

import { Canvas } from "react-three-fiber";

import Controls from "./Components/Controls";
import Drop from "./Components/Drop/Drop";

function App() {
  const controlsRef = React.useRef();
  const [data, setData] = useState([]);

  useEffect(() => {
    csv(url).then(res => {
      setData(res);
    });
  }, []);

  return (
    <Canvas camera={{ fov: 75, near: 0.1, far: 15000, position: [0, 0, 15] }}>
      <Controls ref={controlsRef} />
      <ambientLight color="#ffffff" intensity={0.1} />
      <hemisphereLight
        color="#ffffff"
        skyColor="#ffffbb"
        groundColor="#080820"
        intensity={1.0}
      />
      <Drop data={data} />
    </Canvas>
  );
}

export default App;
