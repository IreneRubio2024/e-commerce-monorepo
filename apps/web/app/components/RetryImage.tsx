"use client";

import { useEffect, useState } from "react";
import Image, { type ImageProps } from "next/image";

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 4000;

export default function RetryImage({
  src,
  alt,
  className,
  fill,
  width,
  height,
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

  const skeleton = !loaded && !failed && (
    <span className="absolute inset-0 animate-pulse bg-gray-200" />
  );

  const image = failed ? (
    <span className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 text-xs">
      Image unavailable
    </span>
  ) : (
    <Image
      key={attempt}
      src={retriedSrc}
      alt={alt}
      fill
      className={`${className ?? ""} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
      onLoad={() => setLoaded(true)}
      onError={handleError}
      {...props}
    />
  );

  // Callers using `fill` already wrap us in a sized, position:relative
  // ancestor, so we don't need our own sizing wrapper.
  if (fill) {
    return (
      <>
        {skeleton}
        {image}
      </>
    );
  }

  // Callers using explicit width/height (e.g. grid cards) don't provide a
  // wrapper, so reproduce the same box via aspect-ratio and render the
  // image with `fill` inside it.
  return (
    <span
      className="relative block w-full"
      style={{
        aspectRatio: width && height ? `${width} / ${height}` : undefined,
      }}
    >
      {skeleton}
      {image}
    </span>
  );
}
