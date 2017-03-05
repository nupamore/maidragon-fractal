
import { range, random } from 'lodash'
import { deg2rad, rad2deg } from './util'

const VIEW_DEPTH = 9
const levels = range(VIEW_DEPTH).map(() => [])

const head = new Image(320, 320)
head.src = 'img/head.png'

const body = new Image(166, 292)
body.src = 'img/body.png'

const sbody = new Image(193, 60)
sbody.src = 'img/small-body.png'

const view = {
  zoom: 0,
  x: 0,
}

let ctx = {}


class Dragon {
  constructor(parent, direction) {
    /**
     * member
     */
    this.parent = parent
    this.level = 0
    this.direction = direction
    this.degree = 180

    this.head = {
      // center
      cx: parent.head.cx,
      cy: parent.head.cy,
      // left-top
      x: 0,
      y: 0,
      // width and height
      w: parent.head.w,
      h: parent.head.h,
      // half of width and height
      hw: parent.head.w / 2,
      hh: parent.head.h / 2,
    }

    this.body = {
      cx: 0,
      cy: 0,
    }

    /**
     * init
     */
    if (direction !== 'center') {
      this.extend(parent)
    }
    this.head.x = this.head.cx - (this.head.w / 2)
    this.head.y = this.head.cy - (this.head.h / 2)
  }


  extend(parent) {
    const type = this.direction.split('-')[0]
    this.level = parent.level + 1

    // after second level degree
    const d = (this.level > 1)
      ? random(50, 70)
      : 0
    const bd = d + 110 + -(this.level > 2 ? random(10, 20) : 0)
    // set degree
    this.degree = parent.degree + {
      'head-left': random(-80 + d, -90 + d),
      'head-right': random(80 - d, 90 - d),
      'body-left': random(-80 + bd, -90 + bd),
      'body-right': random(80 - bd, 90 - bd),
    }[this.direction]

    // set position
    const distance = (parent.head.w * random(0.8, 1.1)) + 10
    const dx = Math.sin(deg2rad(this.degree)) * distance
    const dy = Math.cos(deg2rad(this.degree)) * distance

    this.head.cx = parent[type].cx + dx
    this.head.cy = parent[type].cy + dy

    this.body.cx = parent[type].cx + (dx * 0.6)
    this.body.cy = parent[type].cy + (dy * 0.6)

    this.head.w = parent.head.w * 0.5
    this.head.h = parent.head.h * 0.5

    this.head.hw = this.head.w / 2
    this.head.hh = this.head.h / 2
  }


  createChildren() {
    if (this.level > 0) {
      levels[this.level + 1].push(
        new Dragon(this, 'body-left'),
        new Dragon(this, 'body-right'),
      )
    }
    levels[this.level + 1].push(
      new Dragon(this, 'head-left'),
      new Dragon(this, 'head-right'),
    )
  }

}


function init() {
  // first dragon
  levels[0].push(new Dragon({
    head: {
      cx: 625,
      cy: 340,

      w: 300,
      h: 300,
    },
  }, 'center'))

  range(VIEW_DEPTH - 1).forEach((index) => {
    levels[index].forEach(dragon => dragon.createChildren())
  })
  levels.reverse()
}


export default function setCanvas(canvas) {
  ctx = canvas.getContext('2d')
  init()
  ctx.font = '50px Arial'
  ctx.fillText('loading..', 0, 100)
  setInterval(draw, 1000)

  canvas.addEventListener('click', (e) => {
    view.zoom += 1
    draw()
  })

  canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    view.zoom -= 1
    view.zoom = view.zoom < 0 ? 0 : view.zoom
    draw()
  })
}

function draw() {
  const z = 1.5 ** view.zoom
  const t = ((z - 1) * (1280 / 3))

  ctx.clearRect(0, 0, 1280, 720)

  levels.forEach((level) => {
    level.forEach((d) => {

      // body
      ctx.beginPath()
      ctx.moveTo(d.head.cx*z-(t*2), d.head.cy*z)
      if (d.direction.match('body')) {
        ctx.lineTo(d.parent.body.cx*z-(t*2), d.parent.body.cy*z)
      } else {
        ctx.lineTo(d.parent.head.cx*z-(t*2), d.parent.head.cy*z)
      }
      // ctx.stroke()

      // head
      ctx.save()
      ctx.translate(d.head.x*z-t + d.head.hw*z-t, d.head.y*z + d.head.hh*z)
      ctx.rotate(deg2rad(180 - d.degree))

      const type = d.direction.split('-')[0] === 'center'
        ? 'head'
        : d.direction.split('-')[0]
      const dx = d.parent[type].cx - d.head.cx
      const dy = d.parent[type].cy - d.head.cy
      const distance = Math.sqrt((dx * dx) + (dy * dy))

      ctx.drawImage(sbody, -d.head.w/3*z, 0, d.head.w*0.65*z, (distance*z) + d.head.w*0.2)
      ctx.drawImage(head, -d.head.hw*z, -d.head.hh*z, d.head.w*z, d.head.h*z)

      ctx.restore()
    })
  })

  ctx.drawImage(body, 520*z-(t*2), (720-292)*z, 166*z, 292*z)
}
