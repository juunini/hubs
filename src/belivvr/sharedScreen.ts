export function getSharedScreen(src: MediaStream | string) {
  const isMediaStream = src instanceof MediaStream;
  const defaultOffset = { x: 0, y: 0, z: -1.5 };
  const defaultTarget = "#avatar-pov-node";

  if (!isMediaStream) {
    return {
      sharedScreen: null,
      offset: defaultOffset,
      target: defaultTarget
    }
  }

  const sharedScreen = document.querySelector("[shared-screen]");
  const z = sharedScreen !== null ? 0.001 : defaultOffset.z;

  return {
    sharedScreen,
    offset: { ...defaultOffset, z },
    target: sharedScreen || defaultTarget
  };
}

export function setScaleFromSharedScreen(entity: HTMLElement, sharedScreen: HTMLElement) {
  entity.setAttribute("scale", sharedScreen.getAttribute("scale")!);
}

export function setPinned(entity: HTMLElement) {
  // @ts-ignore
  entity.setAttribute("pinnable", { pinned: true });
}
