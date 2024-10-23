import { GameLevel } from "../_types/gamelevel";

let gameLevel: GameLevel = {
  sourceList: {
    models: ["pla_phobocaster", "pla_voodoobreath", "ata_tor"],

    images: [
      "pla_phobocaster0",
      "pla_phobocaster1",
      "pla_phobocaster2",
      "pla_phobocaster3",
      "pla_phobocaster4",
      "pla_voodoobreath_0",
      "pla_voodoobreath_1",
      "pla_voodoobreath_2",
      "pla_voodoobreath_3",
      "pla_voodoobreath_4",
      "ata_tor_0",
      "ata_tor_1",
      "ata_tor_2",
    ],
    sounds: [],
  },

  modelsAdditionalInfo: {
    pla_phobocaster: {
      renderGroups: {
        opaqueElements: [],
        opaqueGlowElements: [15],
        transparentElements: [],
        transparentGlowElements: [],
      },
    },

    pla_voodoobreath: {
      renderGroups: {
        opaqueElements: [],
        opaqueGlowElements: [14],
        transparentElements: [],
        transparentGlowElements: [],
      },
    },

    ata_tor: {
      renderGroups: {
        opaqueElements: [],
        opaqueGlowElements: [],
        transparentElements: [],
        transparentGlowElements: [],
      },
    },
  },

  gameObjects: {
    /*
    player: {
      model: "pla_phobocaster",
      position: { x: 5, y: 5, z: 5 },
      rotation: { x: 15, y: 30, z: 45 },
    },
    */
    npc_1: {
      model: "pla_voodoobreath",
      position: { x: 10, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    npc_2: {
      model: "pla_phobocaster",
      position: { x: 5, y: 5, z: 5 },
      rotation: { x: 15, y: 30, z: 45 },
    },
    enviromentObject: {
      model: "pla_voodoobreath",
      position: { x: -10, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
  },
};

export default gameLevel;
