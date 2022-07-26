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
      this._flying();
      return;
    }

    if (this._isStopped()) {
      this._idle();
      return;
    }

    if (this.boost) {
      this._removeWalkingAnimation();
      this._running();
      return;
    }

    this._removeRunningAnimation();
    this._walking();
  },

  _removeWalkingAnimation() {
    this.animations.get("Walking")?.setEffectiveWeight(0);
    this.animations.get("WalkingBackwards")?.setEffectiveWeight(0);
    this.animations.get("LeftStrafeWalk")?.setEffectiveWeight(0);
    this.animations.get("RightStrafeWalk")?.setEffectiveWeight(0);
  },

  _removeRunningAnimation() {
    this.animations.get("Running")?.setEffectiveWeight(0);
    this.animations.get("RunningBackward")?.setEffectiveWeight(0);
    this.animations.get("LeftStrafe")?.setEffectiveWeight(0);
    this.animations.get("RightStrafe")?.setEffectiveWeight(0);
  },

  _flying() {
    this.animations.forEach(animation => animation.setEffectiveWeight(0));
    this.animations.get("Flying")?.setEffectiveWeight(1);
  },

  _idle() {
    this.animations.forEach(animation => animation.setEffectiveWeight(0));
    this.animations.get("Idle")?.setEffectiveWeight(1);
  },

  _running() {
    this.animations.get("Running")?.setEffectiveWeight(this.accelerationFront);
    this.animations.get("RunningBackward")?.setEffectiveWeight(-this.accelerationFront);
    this.animations.get("LeftStrafe")?.setEffectiveWeight(-this.accelerationRight);
    this.animations.get("RightStrafe")?.setEffectiveWeight(this.accelerationRight);
  },

  _walking() {
    this.animations.get("Walking")?.setEffectiveWeight(this.accelerationFront);
    this.animations.get("WalkingBackwards")?.setEffectiveWeight(-this.accelerationFront);
    this.animations.get("LeftStrafeWalk")?.setEffectiveWeight(-this.accelerationRight);
    this.animations.get("RightStrafeWalk")?.setEffectiveWeight(this.accelerationRight);
  },

  _isStopped() {
    return this.accelerationFront === 0 && this.accelerationRight === 0;
  }
});
