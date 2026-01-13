import React from "react";
import "./bgvideo.css";
import videoFile from "../../img/background2.mp4";

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