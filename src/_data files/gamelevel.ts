import { GameLevel } from "../_types/gamelevel";

let gameLevel: GameLevel = {
  sourceList: {
    //models: ["pla_phobocaster", "pla_voodoobreath", "ata_tor", "gun_plasma1_sht1", "gun_plasma1_sht1_copy"],
    models: ["pla_phobocaster", "pla_voodoobreath", "ata_tor", "gun_plasma1_sht1"],

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
      "gun_plasma1_sht1b",
      //"gun_plasma1_sht1b_copy",
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

    gun_plasma1_sht1: {
      renderGroups: {
        opaqueElements: [],
        opaqueGlowElements: [],
        transparentElements: [0],
        transparentGlowElements: [],
      },
    },

    gun_plasma1_sht1_copy: {
      renderGroups: {
        opaqueElements: [],
        opaqueGlowElements: [],
        transparentElements: [0],
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
      position: { x: 15, y: 0, z: -15 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    npc_2: {
      model: "pla_phobocaster",
      position: { x: 0, y: 0, z: 15 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    enviromentObject_0: {
      model: "pla_voodoobreath",
      position: { x: -15, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },

    enviromentObject_1: {
      model: "gun_plasma1_sht1",
      position: { x: -10, y: 0, z: 20 },
      rotation: { x: 0, y: 0, z: 0 },
    },

    enviromentObject_2: {
      model: "gun_plasma1_sht1",
      position: { x: -5, y: 0, z: 20 },
      rotation: { x: 0, y: 0, z: 0 },
    },

    enviromentObject_3: {
      model: "gun_plasma1_sht1",
      position: { x: 0, y: 0, z: 20 },
      rotation: { x: 0, y: 0, z: 0 },
    },

    enviromentObject_4: {
      model: "gun_plasma1_sht1",
      position: { x: 5, y: 0, z: 20 },
      rotation: { x: 0, y: 0, z: 0 },
    },

    enviromentObject_5: {
      model: "gun_plasma1_sht1",
      position: { x: 10, y: 0, z: 20 },
      rotation: { x: 0, y: 0, z: 0 },
    },
  },
};

export default gameLevel;
