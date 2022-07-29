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
 */
export const ANIMATIONS = {
  /** @type { IDLE } */ IDLE: "Idle",
  /** @type { WALKING } */ WALKING: "Walking",
  /** @type { WALKING_BACKWARD } */ WALKING_BACKWARD: "WalkingBackwards",
  /** @type { WALKING_LEFT } */ WALKING_LEFT: "LeftStrafeWalk",
  /** @type { WALKING_RIGHT } */ WALKING_RIGHT: "RightStrafeWalk",
  /** @type { RUNNING } */ RUNNING: "Running",
  /** @type { RUNNING_BACKWARD } */ RUNNING_BACKWARD: "RunningBackward",
  /** @type { RUNNING_LEFT } */ RUNNING_LEFT: "LeftStrafe",
  /** @type { RUNNING_RIGHT } */ RUNNING_RIGHT: "RightStrafe",
  /** @type { FLYING } */ FLYING: "Flying"
};

AFRAME.registerComponent("avatar-animation", {
  /** @type { Map<string, THREE.AnimationClip> } */
  animations: new Map(),

  /** @private @type { THREE.AnimationMixer } */
  _mixer: null,
  /** @private @type { THREE.Clock } */
  _clock: new THREE.Clock(),

  init() {
    this.animations = new Map();
    this._mixer = new THREE.AnimationMixer(this.el.object3D.parent);

    this.el.object3D.parent.animations.forEach(animation => {
      this.animations.set(animation.name, this._mixer.clipAction(animation));
      this.animations.get(animation.name).play();
      this.animations.get(animation.name).setEffectiveWeight(0);
    });

    this.animations.get(ANIMATIONS.IDLE)?.setEffectiveWeight(1);
  },

  tick() {
    this._mixer.update(this._clock.getDelta());
  }
});
