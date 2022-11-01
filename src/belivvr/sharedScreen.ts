export function useSharedScreen() {
  const sharedScreen = document.querySelector("[shared-screen]");
  const offset = sharedScreen ? { x: 0, y: 0, z: 0.001 } : { x: 0, y: 0, z: -1.5 };
  const target = sharedScreen || "#avatar-pov-node";

  return { sharedScreen, offset, target };
}

export function setScaleFromSharedScreen(entity: HTMLElement, sharedScreen: HTMLElement | null) {
  if (sharedScreen === null) {
    return;
  }

  entity.setAttribute("scale", sharedScreen.getAttribute("scale")!);
}
