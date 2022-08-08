import { paths } from "../systems/userinput/paths";

const CLOCK = new THREE.Clock();

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
  /** @private @type { boolean } */
  _isMe: false,

  schema: {
    front: { default: 0 },
    right: { default: 0 }
  },

  init() {
    this.animations = new Map();
    this._mixer = new THREE.AnimationMixer(this.el.object3D.parent);
    this._userinput = AFRAME.scenes[0].systems.userinput;
    this._isMe = this.el.parentElement.parentElement.parentElement.id === "avatar-rig";

    this.el.object3D.parent.animations.forEach(animation => {
      this.animations.set(animation.name, this._mixer.clipAction(animation));
      this.animations.get(animation.name).play();
      this.animations.get(animation.name).setEffectiveWeight(0);
    });

    this.animations.get(ANIMATIONS.IDLE)?.setEffectiveWeight(1);
  },

  tick() {
    this._mixer.update(CLOCK.getDelta());

    this._resetAll();
    this._walking();

    if (this._isMe) {
      const [right, front] = this._userinput.get(paths.actions.characterAcceleration);
      this.el.setAttribute("avatar-animation", { front, right });
    }

    if (this._isStopped()) {
      this._idle();
      return;
    }

    this._resetAll();
    this._walking();
  },

  /**
   * @private
   * @param { string[] } names
   */
  _reset(...names) {
    names.forEach(name => this.animations.get(name)?.setEffectiveWeight(0));
  },

  /**
   * @private
   * @param { string[] } ignore - list of ignore to reset animation
   */
  _resetAll(...ignore) {
    this.animations.forEach(animation => {
      if (ignore.includes(animation.name)) {
        return;
      }

      animation.setEffectiveWeight(0);
    });
  },

  _idle() {
    this._resetAll(ANIMATIONS.IDLE);
    this.animations.get(ANIMATIONS.IDLE)?.setEffectiveWeight(1);
  },

  _isStopped() {
    return this.data.front === 0 && this.data.right === 0;
  },

  _walking() {
    this.animations.get(ANIMATIONS.WALKING)?.setEffectiveWeight(this.data.front);
    this.animations.get(ANIMATIONS.WALKING_BACKWARD)?.setEffectiveWeight(-this.data.front);
    this.animations.get(ANIMATIONS.WALKING_LEFT)?.setEffectiveWeight(-this.data.right);
    this.animations.get(ANIMATIONS.WALKING_RIGHT)?.setEffectiveWeight(this.data.right);
  }
});
