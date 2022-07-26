AFRAME.registerComponent("avatar-animation", {
  clock: new THREE.Clock(),
  /**
   * @type {Map<string, THREE.AnimationClip>}
   */
  animations: new Map(),
  accelerationFront: 0,
  accelerationRight: 0,
  boost: false,
  fly: false,

  set(key, value) {
    this[key] = value;
  },

  get(key) {
    return this[key];
  },

  update() {
    this.animations.clear();

    this.mixer = new THREE.AnimationMixer(this.el.components["ik-controller"].avatar);

    this.el.object3D.parent.animations.forEach(animation => {
      this.animations.set(animation.name, this.mixer.clipAction(animation));
      this.animations.get(animation.name).play();
      this.animations.get(animation.name).setEffectiveWeight(0);
    });

    this.animations.get("Idle")?.setEffectiveWeight(1);
  },

  tick() {
    this.mixer.update(this.clock.getDelta());

    if (this.fly) {
      this.animations.forEach(animation => animation.setEffectiveWeight(0));
      this.animations.get("Flying")?.setEffectiveWeight(1);
      return;
    }

    if (this._isStopped()) {
      this.animations.forEach(animation => animation.setEffectiveWeight(0));
      this.animations.get("Idle")?.setEffectiveWeight(1);
      return;
    }

    this.animations.get(this.boost ? "Running" : "Walking")?.setEffectiveWeight(this.accelerationFront);
    this.animations
      .get(this.boost ? "RunningBackward" : "WalkingBackwards")
      ?.setEffectiveWeight(-this.accelerationFront);
    this.animations.get(this.boost ? "LeftStrafe" : "LeftStrafeWalk")?.setEffectiveWeight(-this.accelerationRight);
    this.animations.get(this.boost ? "RightStrafe" : "RightStrafeWalk")?.setEffectiveWeight(this.accelerationRight);
  },

  _isStopped() {
    return this.accelerationFront === 0 && this.accelerationRight === 0;
  }
});
