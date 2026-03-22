type Props = {
  src?: string;
  poster?: string;
  className?: string;
};

/**
 * Simple hero video wrapper. The spec’s overlay layers (darkening + gradients)
 * should be implemented by the section that uses this component.
 */
export default function VideoBackground({
  src = "/videos/hero.mp4",
  poster = "/images/hero-poster.jpg",
  className = "",
}: Props) {
  return (
    <video
      className={`absolute inset-0 w-full h-full object-cover ${className}`}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
    />
  );
}

