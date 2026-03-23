import { useState } from 'react'

export default function VcBox({ front, back, light = false, style = {} }) {
  const [flipped, setFlipped] = useState(false)

  const handleClick = (e) => {
    if (window.innerWidth <= 1024 || 'ontouchstart' in window || navigator.maxTouchPoints > 0) {
      e.stopPropagation()
      setFlipped(!flipped)
    }
  }

  return (
    <div
      className={`vc-box-wrapper${flipped ? ' active-flip' : ''}`}
      style={style}
      onClick={handleClick}
    >
      <div className="vc-box-inner">
        <div className={`vc-box vc-box-front${light ? ' light' : ''}`}>{front}</div>
        <div className="vc-box-back">{back}</div>
      </div>
    </div>
  )
}

export function VcBoxCustom({ front, back, frontStyle = {}, backStyle = {}, wrapperStyle = {} }) {
  const [flipped, setFlipped] = useState(false)

  const handleClick = (e) => {
    if (window.innerWidth <= 1024 || 'ontouchstart' in window || navigator.maxTouchPoints > 0) {
      e.stopPropagation()
      setFlipped(!flipped)
    }
  }

  return (
    <div
      className={`vc-box-wrapper${flipped ? ' active-flip' : ''}`}
      style={wrapperStyle}
      onClick={handleClick}
    >
      <div className="vc-box-inner">
        <div className="vc-box vc-box-front" style={frontStyle}>{front}</div>
        <div className="vc-box-back" style={backStyle}>{back}</div>
      </div>
    </div>
  )
}
