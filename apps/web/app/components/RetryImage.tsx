"use client";

import { useEffect, useState } from "react";
import Image, { type ImageProps } from "next/image";

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 4000;

export default function RetryImage({
  src,
  alt,
  className,
  style,
  ...props
}: ImageProps) {
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setAttempt(0);
    setFailed(false);
    setLoaded(false);
  }, [src]);

  const handleError = () => {
    if (attempt < MAX_RETRIES) {
      setTimeout(() => setAttempt((a) => a + 1), RETRY_DELAY_MS);
    } else {
      setFailed(true);
    }
  };

  const retriedSrc =
    attempt === 0
      ? src
      : `${src}${String(src).includes("?") ? "&" : "?"}retry=${attempt}`;

  const wrapperStyle = props.fill
    ? undefined
    : { width: props.width, height: props.height, ...style };

  return (
    <span
      className={`relative inline-block ${props.fill ? "w-full h-full" : ""} ${className ?? ""}`}
      style={wrapperStyle}
    >
      {!loaded && !failed && (
        <span className="absolute inset-0 animate-pulse bg-gray-200" />
      )}
      {failed ? (
        <span className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 text-xs">
          Image unavailable
        </span>
      ) : (
        <Image
          key={attempt}
          src={retriedSrc}
          alt={alt}
          className={`${props.fill ? "" : "w-full h-full"} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
          onError={handleError}
          {...props}
        />
      )}
    </span>
  );
}
