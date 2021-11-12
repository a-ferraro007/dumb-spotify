import React, { useEffect } from 'react'
//import { random } from '../helpers/index'
import { random, createVoronoiTessellation, map } from '../../helpers'
import { SVG } from '@svgdotjs/svg.js'
import SimplexNoise from 'simplex-noise'

function Voronoi(props) {
  console.log('props', props)
  const width = 196 //props.analysis.beats.length
  const height = 196 //props.analysis.beats.length
  const rows = 32 // props.analysis.beats.length
  const cols = 32 //props.analysis.beats.length
  const colSize = width / cols
  const rowSize = height / rows
  const simplex = new SimplexNoise()

  useEffect(() => {
    const svg = SVG()
      .viewbox(0, 0, width, height)
      .attr('preserveAspectRatio', 'xMidYMid slice')
    const draw = svg.addTo('body')
    //Array(props.tempo) OR props.duration
    //const secs = Math.round(props.data.duration_ms / 100)
    //console.log('secs', secs)
    const points = [...Array(1024)].map(() => {
      return {
        x: random(0, width),
        y: random(0, height)
      }
    })

    console.log(points)
    const tessellation = createVoronoiTessellation({
      width,
      height,
      points,
      relaxIterations: 6
    })
    const debug = false //draw.rect(width, height).fill('#352970')
    //points.forEach((cell) => {
    //  const hue = map(random(0, 1), -1, 1, 180, 360)
    //draw
    //  .rect(width / 32, height / 32)
    //  .x(cell.x)
    //  .y(cell.y)
    //  .stroke('none')
    //  .fill(`hsl(${hue}, 75%, 75%)`)
    //  .attr('shape-rendering', 'cirspedges')
    //})

    let timeZ = 0
    ;(function draws() {
      draw.clear()
      let timeY = 0
      let count = 0
      for (let y = 0; y < height; y += rowSize) {
        let timeX = 0
        count = 0
        for (let x = 0; x < width; x += colSize) {
          const noise = simplex.noise3D(
            timeX,
            //props.analysis.beats[count]?.duration,
            timeY,
            timeZ
          )
          //console.log(noise)
          const hue = map(noise, -1, 1, 180, 360)
          //console.log('hue', hue)
          draw
            .rect(colSize, rowSize)
            .x(x)
            .y(y)
            .stroke('none')
            .fill(`hsl(${hue}, 75%, 75%)`)
          //.attr('shape-rendering', 'crispedges')
          //console.log(props.analysis.beats[count]?.duration)
          //console.log(timeX)
          timeX += 0.01 //props.data.energy //map(props.data.danceability, -1, 1, 0.001, 0.01) //map(props.analysis.beats[count]?.duration, -1, 1, 0.001, 0.01) //props.analysis.beats[count]?.duration / 10 //0.01
          count += 1
        }
        timeY += 0.01 //props.data.energy // map(props.data.energy, -1, 1, 0.001, 0.01) //map(props.analysis.beats[count]?.duration, -1, 1, 0.001, 0.01)
      }
      timeZ += props.data.liveness / 10
      requestAnimationFrame(draws)
    })()

    tessellation.cells.forEach((cell) => {
      if (debug) {
        draw.polygon(cell.points).fill('none').stroke('#000')
      }

      const rand = random(0, 1)
      if (rand > 0.5) {
        const rot = map(Math.random(), -1, 1, 0, 360)
        //draw
        //  .line(
        //    cell.centroid.x - cell.innerCircleRadius / 2,
        //    cell.centroid.y - cell.innerCircleRadius / 2,
        //    cell.centroid.x + cell.innerCircleRadius / 2,
        //    cell.centroid.y + cell.innerCircleRadius / 2
        //  )
        //  //.circle(cell.innerCircleRadius * 2)
        //  //.cx(cell.centroid.x)
        //  //.cy(cell.centroid.y)
        //  .stroke(random(['#7257FA', '#FFD53D', '#1D1934', '#F25C54'])) //color pallettes for  music genres
        //  .scale(0.25)
        //  .rotate(rot)
      } else {
        //draw
        //  //.line(
        //  //  cell.centroid.x - cell.innerCircleRadius / 2,
        //  //  cell.centroid.y - cell.innerCircleRadius / 2,
        //  //  cell.centroid.x + cell.innerCircleRadius / 2,
        //  //  cell.centroid.y + cell.innerCircleRadius / 2
        //  //)
        //  .circle(cell.innerCircleRadius * 2)
        //  .cx(cell.centroid.x)
        //  .cy(cell.centroid.y)
        //  .fill(random(['#7257FA', '#FFD53D', '#1D1934', '#F25C54'])) //color pallettes for  music genres
        //  .scale(0.25)
        //.rotate(rot)
      }
    })
  }, [])

  return <div> </div>
}

export default Voronoi
