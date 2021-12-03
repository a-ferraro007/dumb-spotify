const Arrow = ({ left }) => {
  return (
    <>
      <svg
        width="10"
        height="15"
        viewBox="0 0 10 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        transform={left ? "rotate(180)" : ""}
      >
        <line
          x1="0.125"
          y1="-0.125"
          x2="11.875"
          y2="-0.125"
          transform="matrix(0.819152 -0.573576 0.535965 0.844241 0.149994 7.88293)"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <line
          x1="0.125"
          y1="-0.125"
          x2="11.875"
          y2="-0.125"
          transform="matrix(0.819152 0.573576 -0.535965 0.84424 0 7.78296)"
          stroke="white"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>
    </>
  )
}

export default Arrow
