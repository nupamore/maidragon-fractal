
import './style.less'
import fractal from './fractal'


const canvas = document.getElementById('canvas')

const bg = new Image(1280, 720)
bg.src = 'img/bg.jpg'


fractal(canvas)
