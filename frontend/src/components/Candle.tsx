
export function Candle(props: { height: number }) {

  const style = { "--size": props.height > 100 ? 100 : props.height + "px" };
  return (
    <div class="holder">
      <div class="candle" style={style}>
        <div class="blinking-glow"></div>
        <div class="thread"></div>
        <div class="glow"></div>
        <div class="flame"></div>
      </div>
    </div>
  )
}
