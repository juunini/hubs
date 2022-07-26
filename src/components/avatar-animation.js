/**
 * @typedef {"Idle"} IDLE
 * @typedef {"Walking"} WALKING
 * @typedef {"WalkingBackwards"} WALKING_BACKWARD
 * @typedef {"LeftStrafeWalk"} WALKING_LEFT
 * @typedef {"RightStrafeWalk"} WALKING_RIGHT
 * @typedef {"Running"} RUNNING
 * @typedef {"RunningBackward"} RUNNING_BACKWARD
 * @typedef {"LeftStrafe"} RUNNING_LEFT
 * @typedef {"RightStrafe"} RUNNING_RIGHT
 * @typedef {"Flying"} FLYING
 *
 * @type {{
 *   IDLE: IDLE;
 *   WALKING: WALKING;
 *   WALKING_BACKWARD: WALKING_BACKWARD;
 *   WALKING_LEFT: WALKING_LEFT;
 *   WALKING_RIGHT: WALKING_RIGHT;
 *   RUNNING: RUNNING;
 *   RUNNING_BACKWARD: RUNNING_BACKWARD;
 *   RUNNING_LEFT: RUNNING_LEFT;
 *   RUNNING_RIGHT: RUNNING_RIGHT;
 *   FLYING: FLYING;
 * }}
 */
const ANIMATIONS = {
  IDLE: "Idle",
  WALKING: "Walking",
  WALKING_BACKWARD: "WalkingBackwards",
  WALKING_LEFT: "LeftStrafeWalk",
  WALKING_RIGHT: "RightStrafeWalk",
  RUNNING: "Running",
  RUNNING_BACKWARD: "RunningBackward",
  RUNNING_LEFT: "LeftStrafe",
  RUNNING_RIGHT: "RightStrafe",
  FLYING: "Flying"
};
const WALKING_ANIMATIONS = [
  ANIMATIONS.WALKING,
  ANIMATIONS.WALKING_BACKWARD,
  ANIMATIONS.WALKING_LEFT,
  ANIMATIONS.WALKING_RIGHT
];
const RUNNING_ANIMATIONS = [
  ANIMATIONS.RUNNING,
  ANIMATIONS.RUNNING_BACKWARD,
  ANIMATIONS.RUNNING_LEFT,
  ANIMATIONS.RUNNING_RIGHT
];

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

    this.animations.get(ANIMATIONS.IDLE)?.setEffectiveWeight(1);
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
      this._resetWalking();
      this._running();
      return;
    }

    this._resetRunning();
    this._walking();
  },

  _resetWalking() {
    WALKING_ANIMATIONS.forEach(name => this.animations.get(name)?.setEffectiveWeight(0));
  },

  _resetRunning() {
    RUNNING_ANIMATIONS.forEach(name => this.animations.get(name)?.setEffectiveWeight(0));
  },

  _flying() {
    this._reset(ANIMATIONS.FLYING);
    this.animations.get(ANIMATIONS.FLYING)?.setEffectiveWeight(1);
  },

  _idle() {
    this._reset(ANIMATIONS.IDLE);
    this.animations.get(ANIMATIONS.IDLE)?.setEffectiveWeight(1);
  },

  /**
   * @param {string[]} ignore - list of ignore to reset animation
   */
  _reset(...ignore) {
    this.animations.forEach(animation => {
      if (ignore.includes(animation.name)) {
        return;
      }

      animation.setEffectiveWeight(0);
    });
  },

  _running() {
    this.animations.get(ANIMATIONS.RUNNING)?.setEffectiveWeight(this.accelerationFront);
    this.animations.get(ANIMATIONS.RUNNING_BACKWARD)?.setEffectiveWeight(-this.accelerationFront);
    this.animations.get(ANIMATIONS.RUNNING_LEFT)?.setEffectiveWeight(-this.accelerationRight);
    this.animations.get(ANIMATIONS.RUNNING_RIGHT)?.setEffectiveWeight(this.accelerationRight);
  },

  _walking() {
    this.animations.get(ANIMATIONS.WALKING)?.setEffectiveWeight(this.accelerationFront);
    this.animations.get(ANIMATIONS.WALKING_BACKWARD)?.setEffectiveWeight(-this.accelerationFront);
    this.animations.get(ANIMATIONS.WALKING_LEFT)?.setEffectiveWeight(-this.accelerationRight);
    this.animations.get(ANIMATIONS.WALKING_RIGHT)?.setEffectiveWeight(this.accelerationRight);
  },

  _isStopped() {
    return this.accelerationFront === 0 && this.accelerationRight === 0;
  }
});
