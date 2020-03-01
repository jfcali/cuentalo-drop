import React, { useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "react-three-fiber";

console.log("three");

const scratchObject3D = new THREE.Object3D();

function updateInstancedMeshMatrices({ mesh, data }) {
  if (!mesh) return;
  // set the transform matrix for each instance
  for (let i = 0; i < data.length; ++i) {
    const x = +data[i].x;
    const y = +data[i].y;

    scratchObject3D.position.set(x * 30, y * 30, 0 + Math.random() - 0.5);
    //scratchObject3D.rotation.set(0.5 * Math.PI, 0, 0); // cylinders face z direction
    scratchObject3D.updateMatrix();
    mesh.setMatrixAt(i, scratchObject3D.matrix);
  }

  mesh.instanceMatrix.needsUpdate = true;
}
const SELECTED_COLOR = "#6f6";
const DEFAULT_COLOR = "#888";

// re-use for instance computations
const scratchColor = new THREE.Color();

const usePointColors = ({ data, selectedPoint }) => {
  const numPoints = data.length;
  const colorAttrib = React.useRef();
  const colorArray = React.useMemo(() => new Float32Array(numPoints * 3), [
    numPoints
  ]);

  React.useEffect(() => {
    for (let i = 0; i < data.length; ++i) {
      scratchColor.set(
        data[i] === selectedPoint ? SELECTED_COLOR : DEFAULT_COLOR
      );
      scratchColor.toArray(colorArray, i * 3);
    }
    //colorAttrib.current.needsUpdate = true;
  }, [data, selectedPoint, colorArray]);
  return { colorAttrib, colorArray };
};

function Drop({ data }) {
  const mesh = useRef();

  // update instance matrices only when needed
  React.useEffect(() => {
    updateInstancedMeshMatrices({ mesh: mesh.current, data });
  }, [data]);

  // useFrame(() => {
  //   updateInstancedMeshMatrices({ mesh: mesh.current, data });
  // });

  // useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.1));
  const { colorAttrib, colorArray } = usePointColors({
    data,
    selectedPoint: null
  });

  return data.length ? (
    <instancedMesh args={[null, null, data.length]} ref={mesh}>
      {" "}
      <boxBufferGeometry attach="geometry" args={[0.5, 0.5, 0.5]}>
        <instancedBufferAttribute
          ref={colorAttrib}
          args={[colorArray, 3]}
          attachObject={["attributes", "color"]}
        />
      </boxBufferGeometry>
      <meshStandardMaterial
        attach="material"
        // vertexColors={THREE.VertexColors}
      />
    </instancedMesh>
  ) : null;
}

export default Drop;
