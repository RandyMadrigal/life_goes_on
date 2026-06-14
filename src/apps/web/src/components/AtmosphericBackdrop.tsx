import { SakuraPetals } from "./SakuraPetals";
import { FogLayer } from "./FogLayer";

export function AtmosphericBackdrop({ petals = 18 }: { petals?: number }) {
  return (
    <>
      <FogLayer />
      <SakuraPetals count={petals} />
    </>
  );
}
