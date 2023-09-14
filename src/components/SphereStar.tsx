import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/splide/dist/css/splide.min.css'
import Image from 'next/image'
import img1 from '../../public/1.png'
import img2 from '../../public/2.png'
import img3 from '../../public/3.png'
import img4 from '../../public/4.png'
import '../styles/slider.module.scss'

const ThreeJSBallWithStars = () => {
  const sliderRef = useRef<InstanceType<typeof Splide>>(null)
  const animateRef = useRef(0)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const geometryRef = useRef<THREE.SphereGeometry | null>(null)
  const materialRef = useRef<THREE.MeshBasicMaterial | null>(null)
  const sphereRef = useRef<THREE.Mesh | null>(null)
  const starsGeometryRef = useRef<THREE.BufferGeometry | null>(null)
  const starsMaterialRef = useRef<THREE.PointsMaterial | null>(null)
  const starsRef = useRef<THREE.Points | null>(null)
  const slidesElRef = useRef<Array<HTMLDivElement>>([])
  const lastAzimuthalAngleRef = useRef(0)
  const rotationDirectionRef = useRef(1) // 1 for clockwise, -1 for counter-clockwise

  useEffect(() => {
    // 初始化轮播图位置
    sliderRef.current?.splide?.Components.Move.translate(0)

    initWebGl()
    initDraw()
    animation()

    return () => {
      // 清除副作用
      cancelAnimationFrame(animateRef.current)
    }
  }, [])

  const initWebGl = () => {
    // 创建场景
    const scene = new THREE.Scene()

    // 创建相机
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )

    // 创建渲染器并设置背景色为黑色
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    document.getElementById('three-container')?.appendChild(renderer.domElement)
    const section = document.getElementById('section')

    // 初始化OrbitControls
    const controls = new OrbitControls(camera, section!)
    controls.enablePan = false
    controls.enableZoom = false
    controls.minPolarAngle = Math.PI / 2
    controls.maxPolarAngle = Math.PI / 2
    controls.enableDamping = true
    controls.dampingFactor = 0.01

    controls.addEventListener('change', function () {
      // 浏览器控制台查看相机位置变化
      // console.log('camera.position', camera.position);
    })

    controls.addEventListener('start', function () {
      lastAzimuthalAngleRef.current = controls.getAzimuthalAngle()
    })

    controls.addEventListener('change', function () {
      const currentAzimuthalAngle = controls.getAzimuthalAngle()
      const deltaAzimuthalAngle =
        currentAzimuthalAngle - lastAzimuthalAngleRef.current

      const width = (document.querySelector('div ul') as HTMLUListElement)
        ?.offsetWidth

      // 使用比例因子计算 translate 值 --宽度/图的数量*3.38976
      const translateValue = -currentAzimuthalAngle * ((width / 4) * 3.38976)

      sliderRef.current?.splide?.Components.Move.translate(translateValue)
      if (deltaAzimuthalAngle > 0) {
        rotationDirectionRef.current = -1
      } else if (deltaAzimuthalAngle < 0) {
        rotationDirectionRef.current = 1
      }

      lastAzimuthalAngleRef.current = currentAzimuthalAngle
    })

    // 创建透明球体
    const geometry = new THREE.SphereGeometry(5, 32, 32)
    const material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0,
    })
    const sphere = new THREE.Mesh(geometry, material)
    scene.add(sphere)

    // 创建星星
    const starsGeometry = new THREE.BufferGeometry()
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.02,
      vertexColors: true,
    })

    sceneRef.current = scene
    cameraRef.current = camera
    rendererRef.current = renderer
    controlsRef.current = controls
    geometryRef.current = geometry
    materialRef.current = material
    sphereRef.current = sphere
    starsGeometryRef.current = starsGeometry
    starsMaterialRef.current = starsMaterial
    setTimeout(() => {
      controlsRef.current?.dispose()
    })
  }

  const initDraw = () => {
    const vertices = []
    const colors = []
    for (let i = 0; i < 500; i++) {
      const theta = Math.random() * 2 * Math.PI
      const phi = Math.random() * Math.PI
      const radius = 5

      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)

      vertices.push(x, y, z)
      colors.push(1, 1, 1)
    }

    starsGeometryRef.current?.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(vertices, 3)
    )
    starsGeometryRef.current?.setAttribute(
      'color',
      new THREE.Float32BufferAttribute(colors, 3)
    )
    starsRef.current = new THREE.Points(
      starsGeometryRef.current!,
      starsMaterialRef.current!
    )
    sceneRef.current?.add(starsRef.current)

    // 设置相机位置和方向
    cameraRef.current!.position.z = 10
    cameraRef.current!.position.y = 0
    cameraRef.current!.lookAt(0, 0, 0)
  }

  // 渲染循环
  const animate = () => {
    // 使星星闪烁
    const colors = starsGeometryRef.current?.attributes.color.array ?? []
    for (let i = 0; i < colors.length; i += 3) {
      const opacity = 0.5 + 0.5 * Math.sin(0.1 * i + Date.now() * 0.001)
      colors[i] = opacity
      colors[i + 1] = opacity
      colors[i + 2] = opacity
    }
    starsGeometryRef.current!.attributes.color.needsUpdate = true

    sphereRef.current!.rotation.y += 0.0005 * rotationDirectionRef.current
    starsRef.current!.rotation.y += 0.0005 * rotationDirectionRef.current
    controlsRef.current!.update()
    rendererRef.current!.render(sceneRef.current!, cameraRef.current!)
  }

  const animation = () => {
    animateRef.current = requestAnimationFrame(animation)
    animate()
  }

  /**
   * 手动实现控制器 控制webgl和slider联动
   */
  useEffect(() => {
    const root = document.querySelector('#section') as HTMLDivElement
    let startPos = 0
    let timer = 0
    let diff = 0


    const limitLeft = window.innerWidth * 0.2
    const ballSport = () => {
      sphereRef.current!.rotation.y += 0.0005 * diff
      starsRef.current!.rotation.y += 0.0005 * diff
      controlsRef.current!.update()
      rendererRef.current!.render(sceneRef.current!, cameraRef.current!)

      // slider
      const sliderPos =
        sliderRef.current?.splide?.Components.Move.getPosition() ?? 0
      sliderRef.current?.splide?.Components.Move.translate(
        sliderPos + diff * 0.05
      )

      // process slider items
      slidesElRef.current.forEach((el) => {
        const leftPos = el.getBoundingClientRect().x
        // const rightPos = window.innerWidth - el.offsetLeft - el.offsetWidth
        if(leftPos < limitLeft && leftPos > 0) {
          el.style.transform = 'scale(0.0001)'
        } else {
          el.style.transform = 'scale(1)'
        }
      })
    }

    root?.addEventListener('mousedown', (e) => {
      startPos = e.clientX
      diff = 0
      const handleMove = (e: MouseEvent) => {
        diff = e.clientX - startPos
        ballSport()
        diff < 0
          ? (rotationDirectionRef.current = -1)
          : (rotationDirectionRef.current = 1)
      }
      const handleUp = () => {
        root.removeEventListener('mousemove', handleMove)
        root.removeEventListener('mouseup', handleUp)
        const startDiff = diff
        if (startDiff === 0) return
        const loop = () => {
          timer = requestAnimationFrame(() => {
            loop()
            ballSport()
            diff -= diff / 33
            console.log('🚀 ', diff)

            if (startDiff > 0 && diff < 0.8) {
              cancelAnimationFrame(timer)
            } else if (startDiff < 0 && diff > -0.8) {
              cancelAnimationFrame(timer)
            }
          })
        }
        loop()
      }
      root.addEventListener('mousemove', handleMove)
      root.addEventListener('mouseup', handleUp)
    })
  }, [])

  useEffect(() => {
    sliderRef.current?.splide?.Components.Slides.forEach((e) => {
      const el = e.slide as HTMLDivElement
      el.style.transition = 'all linear .5s'
      slidesElRef.current.push(el)
    }),
      [sliderRef]
  })

  return (
    <section
      id='section'
      style={{
        width: '100%',
        height: '100vh',
        position: 'relative',
        background: 'black',
      }}
      className='flex justify-center'
    >
      <div
        id='slider'
        style={{
          width: '80%',
          position: 'absolute',
          top: '50%',
          zIndex: 1,
          userSelect: 'none',
        }}
        onClick={() => {
          console.log('我被点击了')
        }}
      >
        <Splide
          ref={sliderRef}
          options={{
            type: 'loop',
            perPage: 3,
            arrows: false,
            pagination: false,
            drag: false,
            waitForTransition: true,
          }}
        >
          <SplideSlide key={1}>
            <div>
              <Image
                style={{ cursor: 'pointer' }}
                width={200}
                src={img1}
                alt='Image 1'
              />
            </div>
          </SplideSlide>
          <SplideSlide key={2}>
            <div>
              <Image
                style={{ cursor: 'pointer' }}
                width={200}
                src={img2}
                alt='Image 2'
              />
            </div>
          </SplideSlide>
          <SplideSlide key={3}>
            <div>
              <Image
                style={{ cursor: 'pointer' }}
                width={200}
                src={img3}
                alt='Image 3'
              />
            </div>
          </SplideSlide>
          <SplideSlide key={4}>
            <div>
              <Image
                style={{ cursor: 'pointer' }}
                width={200}
                src={img4}
                alt='Image 4'
              />
            </div>
          </SplideSlide>
        </Splide>
      </div>
      <div
        className='absolute'
        id='three-container'
        style={{
          width: '100%',
          height: '100vh',
          position: 'absolute',
          pointerEvents: 'none',
        }}
      ></div>
    </section>
  )
}

export default ThreeJSBallWithStars
