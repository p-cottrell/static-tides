import React from "react";
import "./bgvideo.css";
import videoFile from "../../img/background1.mp4";   // <- Import it

export default function BackgroundVideo() {
  return (
    <video
      className="bg-video"
      autoPlay
      loop
      muted
      playsInline
    >
      <source src={videoFile} type="video/mp4" />
    </video>
  );
}