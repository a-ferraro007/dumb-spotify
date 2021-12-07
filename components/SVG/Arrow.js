const Arrow = ({ style, active }) => {
  return (
    <>
      <svg
        role="img"
        height="16"
        width="16"
        fill="#fff"
        transform={active ? "rotate(180)" : ""}
        viewBox="0 0 16 16"
        className={style}
      >
        <path d="M3 6l5 5.794L13 6z"></path>
      </svg>
    </>
  )
}

export default Arrow
