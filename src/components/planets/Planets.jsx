import React, { useState, useRef, useCallback } from 'react'
import { Link } from "react-router-dom";
import { useSpring, animated } from '@react-spring/web'
import './planets.css'

// Image assets
import circle1 from '../../img/circle-1.svg'
import circle2 from '../../img/circle-2.svg'
import circle3 from '../../img/circle-3.svg'
import circle4 from '../../img/circle-4.svg'
import circle5 from '../../img/circle-5.svg'
import circle6 from '../../img/circle-6.svg'
import circle7 from '../../img/circle-7.svg'
import circle8 from '../../img/circle-8.svg'
import circle9 from '../../img/circle-9.svg'
import circle10 from '../../img/circle-10.svg'


const calc = (x, y) => [x - window.innerWidth / 2, y - window.innerHeight / 2]

// Parallax transforms
const trans0 = (x, y) => `translate3d(${x / 90}px, ${y / 90}px, 0)`
const trans1 = (x, y) => `translate3d(${x / 40}px, ${y / 40}px, 0)`
const trans2 = (x, y) => `translate3d(${x / 20}px, ${y / 20}px, 0)`
const trans3 = (x, y) => `translate3d(${x / 15}px, ${y / 15}px, 0)`
const trans4 = (x, y) => `translate3d(${x / 10}px, ${y / 10}px, 0)`

const Planets = () => {
  // Pop/pulse state
  const [isPulsing1] = useState(true)
  const [isPulsing2] = useState(true)
  const [isPulsing3] = useState(true)
  const [isPulsing4] = useState(true)

  const [isPopUp1, setIsPopUp1] = useState(false)
  const [isPopUp2, setIsPopUp2] = useState(false)
  const [isPopUp3, setIsPopUp3] = useState(false)
  const [isPopUp4, setIsPopUp4] = useState(false)

  // Refs if I need them for future interactions
  const planet1Ref = useRef(null)
  const planet2Ref = useRef(null)
  const planet3Ref = useRef(null)
  const planet4Ref = useRef(null)

  const popUpRef = useRef(null)
  const popUpSubRef = useRef(null)
  const popUp2Ref = useRef(null)
  const popUpSubRef2 = useRef(null)

  const [{ xy }, api] = useSpring(() => ({
    xy: [0, 0],
    config: { mass: 20, tension: 550, friction: 140 },
  }))

  // Stable handler (avoids new function every render)
  const handleMouseMove = useCallback(
    ({ clientX: x, clientY: y }) => {
      api.start({ xy: calc(x, y) })
    },
    [api]
  )

  return (
    <div className='planets'>
    <div className="hero" onMouseMove={handleMouseMove}>
      <div className="landing-child">
        <animated.div className="circles" style={{ transform: xy.to(trans0) }}>

          {/* Circles */}
          <div className="center-circle" />
          <animated.div className="circle" style={{ transform: xy.to(trans1) }}>
            <img className="rotating-30" src={circle1} alt="circle" />
          </animated.div>
          <animated.div className="circle" style={{ transform: xy.to(trans0) }}>
            <img className="rotating-50" src={circle2} alt="circle" />
          </animated.div>
          <animated.div className="circle2" style={{ transform: xy.to(trans2) }}>
            <img className="rotating-70" src={circle3} alt="circle" />
          </animated.div>
          <animated.div className="circle2" style={{ transform: xy.to(trans2) }}>
            <img className="rotating-40" src={circle4} alt="circle" />
          </animated.div>
          <animated.div className="circle3" style={{ transform: xy.to(trans3) }}>
            <img className="rotating-70" src={circle5} alt="circle" />
          </animated.div>
          <animated.div className="circle3" style={{ transform: xy.to(trans3) }}>
            <img className="rotating-30" src={circle6} alt="circle" />
          </animated.div>
          <animated.div className="circle4" style={{ transform: xy.to(trans3) }}>
            <img className="rotating-50" src={circle7} alt="circle" />
          </animated.div>
          <animated.div className="circle4" style={{ transform: xy.to(trans3) }}>
            <img className="rotating-40" src={circle8} alt="circle" />
          </animated.div>
          <animated.div className="circle5" style={{ transform: xy.to(trans4) }}>
            <img className="rotating-100" src={circle9} alt="circle" />
          </animated.div>
          <animated.div className="circle5" style={{ transform: xy.to(trans4) }}>
            <img className="rotating-70" src={circle10} alt="circle" />
          </animated.div>

          {/* Planets */}
          <ul className="planet-ul">
            {/* Planet 1 */}
            <animated.li
              ref={planet1Ref}
              className="planet planet1"
              onMouseEnter={() => setIsPopUp1(true)}
              onMouseLeave={() => setIsPopUp1(false)}
              style={{ transform: xy.to(trans4) }}
              aria-haspopup="dialog"
              aria-expanded={isPopUp1}
            >
              <Link to="/music">
                <div className="planet-core" />
              </Link>
            </animated.li>

            {/* Planet 2 */}
            <animated.li
              ref={planet2Ref}
              className="planet planet2"
              onMouseEnter={() => setIsPopUp2(true)}
              onMouseLeave={() => setIsPopUp2(false)}
              style={{ transform: xy.to(trans1) }}
              aria-haspopup="dialog"
              aria-expanded={isPopUp2}
            >
              <Link to="/about">
                <div className="planet-core" />
              </Link>
            </animated.li>

            {/* Planet 3 */}
            <animated.li
              ref={planet3Ref}
              className="planet planet3"
              onMouseEnter={() => setIsPopUp3(true)}
              onMouseLeave={() => setIsPopUp3(false)}
              style={{ transform: xy.to(trans2) }}
              aria-haspopup="dialog"
              aria-expanded={isPopUp3}
            >
              <Link to="/links">
                <div className="planet-core" />
              </Link>
            </animated.li>

            {/* Planet 4 */}
            <animated.li
              ref={planet4Ref}
              className="planet planet4"
              onMouseEnter={() => setIsPopUp4(true)}
              onMouseLeave={() => setIsPopUp4(false)}
              style={{ transform: xy.to(trans3) }}
              aria-haspopup="dialog"
              aria-expanded={isPopUp4}
            >
              <Link to="/contact">
                <div className="planet-core" />
              </Link>
            </animated.li>
          </ul>

          {/* Popups */}
          <animated.div
            ref={popUpRef}
            className="pop-up"
            style={{ opacity: isPopUp3 ? 1 : 0, transform: xy.to(trans2) }}
          >
            <div className="pop-up-opacity">
              <div className="pop-up_header-container">
                <h3 className="pop-up_h3">links</h3>
              </div>
            </div>
          </animated.div>

          <animated.div
            ref={popUpSubRef}
            className="pop-up_sub"
            style={{ opacity: isPopUp4 ? 1 : 0, transform: xy.to(trans3) }}
          >
            <div className="pop-up-opacity">
              <div className="pop-up_header-container">
                <h3 className="pop-up_h3_sub">contact</h3>
              </div>
            </div>
          </animated.div>

          <animated.div
            ref={popUp2Ref}
            className="pop-up2"
            style={{ opacity: isPopUp1 ? 1 : 0, transform: xy.to(trans4) }}
          >
            <div className="pop-up-opacity">
              <div className="pop-up_header-container">
                <h3 className="pop-up_h3">music</h3>
              </div>
            </div>
          </animated.div>

          <animated.div
            ref={popUpSubRef2}
            className="pop-up_sub2"
            style={{ opacity: isPopUp2 ? 1 : 0, transform: xy.to(trans1) }}
          >
            <div className="pop-up-opacity">
              <div className="pop-up_header-container">
                <h3 className="pop-up_h3_sub">about</h3>
              </div>
            </div>
          </animated.div>
        </animated.div>
      </div>
    </div>
    </div>
  )
}

export default Planets
