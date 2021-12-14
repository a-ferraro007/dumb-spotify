import React from "react"

const Library = ({ name }) => {
  return (
    <svg
      width="24"
      height="24"
      //stroke="#fff"
      className={name}
      viewBox="0 0 24 24"
    >
      <path d="M13.66 4.097l-.913.406 7.797 17.513.914-.406L13.66 4.097zM3 22h1V4H3v18zm6 0h1V4H9v18z"></path>
    </svg>
  )
}

export default Library
