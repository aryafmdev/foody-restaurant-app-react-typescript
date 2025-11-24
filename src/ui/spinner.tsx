export function Spinner({ size = 24 }: { size?: number }) {
  const s = `${size}px`
  const style = {
    width: s,
    height: s,
    borderWidth: '3px',
  } as const
  return (
    <span
      className="inline-block rounded-full border-neutral-300 border-t-primary animate-spin"
      style={style}
    />
  )
}
