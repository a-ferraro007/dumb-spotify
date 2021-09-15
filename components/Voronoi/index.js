import React, { useEffect } from 'react'
//import { random } from '../helpers/index'
import { random, createVoronoiTessellation } from '../../helpers/helpers'
import { SVG } from '@svgdotjs/svg.js'

function Voronoi(props) {
  const width = 196
  const height = 196
  useEffect(() => {
    const svg = SVG().viewbox(0, 0, width, height)
    const draw = svg.addTo('body')
    const points = [...Array(1024)].map(() => {
      //console.log(width)
      return {
        x: random(0, width),
        y: random(0, height)
      }
    })

    const tessellation = createVoronoiTessellation({
      width,
      height,
      points,
      relaxIterations: 6
    })
    const debug = false
    tessellation.cells.forEach((cell) => {
      if (debug) {
        draw.polygon(cell.points).fill('none').stroke('#000')
      }

      draw
        .circle(cell.innerCircleRadius * 2)
        .cx(cell.centroid.x)
        .cy(cell.centroid.y)
        .fill(random(['#7257FA', '#FFD53D', '#1D1934', '#F25C54'])) //color pallettes for  music genres
        .scale(0.75)
    })
  }, [])

  return <div> </div>
}

export default Voronoi
