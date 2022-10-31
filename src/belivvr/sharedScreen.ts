export function setMediaVideoGeometry(entity: any, timer = 1000, noShareScreenLimit = 10) {
  let noShareScreenCount = 0;
  
  const interval = setInterval(() => {
    const sharedScreen = document.querySelector("[shared-screen]")
    if (sharedScreen === null) {
      noShareScreenCount += 1;

      if (noShareScreenCount > noShareScreenLimit) {
        clearInterval(interval);
      }
    }

    if (entity.mesh?.geometry?.scale) {
      const { x: scaleX, y: scaleY, z: scaleZ } = sharedScreen!.getAttribute('scale') as any
      const { x: rotationX, y: rotationY, z: rotationZ } = sharedScreen!.getAttribute('rotation') as any
      const { x: positionX, y: positionY, z: positionZ } = sharedScreen!.getAttribute('position') as any

      const geometry = entity.mesh.geometry;

      geometry.scale(scaleX, scaleY, scaleZ);

      geometry.rotateX(rotationX);
      geometry.rotateY(rotationY);
      geometry.rotateZ(rotationZ);

      geometry.translate(positionX, positionY + 2, positionZ);

      clearInterval(interval);
    }
  }, timer);
}