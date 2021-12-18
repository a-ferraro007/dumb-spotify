import React from "react"

const Music = ({ width, height }) => {
  return (
    <svg
      height={height}
      role="img"
      width={width}
      viewBox="-20 -25 100 100"
      style={{ borderRadius: "15px", backgroundColor: "#333" }}
    >
      <path
        d="M16 7.494v28.362A8.986 8.986 0 0 0 9 32.5c-4.962 0-9 4.038-9 9s4.038 9 9 9 9-4.038 9-9V9.113l30-6.378v27.031a8.983 8.983 0 0 0-7-3.356c-4.962 0-9 4.038-9 9 0 4.963 4.038 9 9 9s9-4.037 9-9V.266L16 7.494zM9 48.5c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7c0 3.859-3.141 7-7 7zm32-6.09c-3.86 0-7-3.14-7-7 0-3.859 3.14-7 7-7s7 3.141 7 7c0 3.861-3.141 7-7 7z"
        fill="#b3b3b3"
        fill-rule="evenodd"
      ></path>
    </svg>
  )
}

export default Music