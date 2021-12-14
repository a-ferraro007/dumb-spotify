function Loading({ width, height }) {
  return (
    <svg
      width={width ?? 100}
      height={height ?? 100}
      display="block"
      preserveAspectRatio="xMidYMid"
      viewBox="0 0 100 100"
      style={{ zIndex: 10 }}
    >
      <g transform="translate(80 50)">
        <circle r="6" fill="#1db954">
          <animateTransform
            attributeName="transform"
            begin="-0.875s"
            dur="1s"
            keyTimes="0;1"
            repeatCount="indefinite"
            type="scale"
            values="1.5 1.5;1 1"
          ></animateTransform>
          <animate
            attributeName="fill-opacity"
            begin="-0.875s"
            dur="1s"
            keyTimes="0;1"
            repeatCount="indefinite"
            values="1;0"
          ></animate>
        </circle>
      </g>
      <g transform="rotate(45 -50.355 121.568)">
        <circle r="6" fill="#1db954">
          <animateTransform
            attributeName="transform"
            begin="-0.75s"
            dur="1s"
            keyTimes="0;1"
            repeatCount="indefinite"
            type="scale"
            values="1.5 1.5;1 1"
          ></animateTransform>
          <animate
            attributeName="fill-opacity"
            begin="-0.75s"
            dur="1s"
            keyTimes="0;1"
            repeatCount="indefinite"
            values="1;0"
          ></animate>
        </circle>
      </g>
      <g transform="rotate(90 -15 65)">
        <circle r="6" fill="#1db954">
          <animateTransform
            attributeName="transform"
            begin="-0.625s"
            dur="1s"
            keyTimes="0;1"
            repeatCount="indefinite"
            type="scale"
            values="1.5 1.5;1 1"
          ></animateTransform>
          <animate
            attributeName="fill-opacity"
            begin="-0.625s"
            dur="1s"
            keyTimes="0;1"
            repeatCount="indefinite"
            values="1;0"
          ></animate>
        </circle>
      </g>
      <g transform="rotate(135 -.355 41.568)">
        <circle r="6" fill="#1db954">
          <animateTransform
            attributeName="transform"
            begin="-0.5s"
            dur="1s"
            keyTimes="0;1"
            repeatCount="indefinite"
            type="scale"
            values="1.5 1.5;1 1"
          ></animateTransform>
          <animate
            attributeName="fill-opacity"
            begin="-0.5s"
            dur="1s"
            keyTimes="0;1"
            repeatCount="indefinite"
            values="1;0"
          ></animate>
        </circle>
      </g>
      <g transform="rotate(180 10 25)">
        <circle r="6" fill="#1db954">
          <animateTransform
            attributeName="transform"
            begin="-0.375s"
            dur="1s"
            keyTimes="0;1"
            repeatCount="indefinite"
            type="scale"
            values="1.5 1.5;1 1"
          ></animateTransform>
          <animate
            attributeName="fill-opacity"
            begin="-0.375s"
            dur="1s"
            keyTimes="0;1"
            repeatCount="indefinite"
            values="1;0"
          ></animate>
        </circle>
      </g>
      <g transform="rotate(-135 20.355 8.432)">
        <circle r="6" fill="#1db954">
          <animateTransform
            attributeName="transform"
            begin="-0.25s"
            dur="1s"
            keyTimes="0;1"
            repeatCount="indefinite"
            type="scale"
            values="1.5 1.5;1 1"
          ></animateTransform>
          <animate
            attributeName="fill-opacity"
            begin="-0.25s"
            dur="1s"
            keyTimes="0;1"
            repeatCount="indefinite"
            values="1;0"
          ></animate>
        </circle>
      </g>
      <g transform="rotate(-90 35 -15)">
        <circle r="6" fill="#1db954">
          <animateTransform
            attributeName="transform"
            begin="-0.125s"
            dur="1s"
            keyTimes="0;1"
            repeatCount="indefinite"
            type="scale"
            values="1.5 1.5;1 1"
          ></animateTransform>
          <animate
            attributeName="fill-opacity"
            begin="-0.125s"
            dur="1s"
            keyTimes="0;1"
            repeatCount="indefinite"
            values="1;0"
          ></animate>
        </circle>
      </g>
      <g transform="rotate(-45 70.355 -71.568)">
        <circle r="6" fill="#1db954">
          <animateTransform
            attributeName="transform"
            begin="0s"
            dur="1s"
            keyTimes="0;1"
            repeatCount="indefinite"
            type="scale"
            values="1.5 1.5;1 1"
          ></animateTransform>
          <animate
            attributeName="fill-opacity"
            begin="0s"
            dur="1s"
            keyTimes="0;1"
            repeatCount="indefinite"
            values="1;0"
          ></animate>
        </circle>
      </g>
    </svg>
  )
}

export default Loading
