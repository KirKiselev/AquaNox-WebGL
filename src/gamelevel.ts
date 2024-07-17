import { GameLevel } from "./lib/types";

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
      glowingElementsGroups: [15], 
      transparentElementsgroups: [],
      opaqueElementsgroups: [],
    },

    pla_voodoobreath: {
      glowingElementsGroups: [14],
      transparentElementsgroups: [],
      opaqueElementsgroups: [],
    },

    ata_tor: {
      glowingElementsGroups: [],
      transparentElementsgroups: [],
      opaqueElementsgroups: [],
    },
  },

  gameObjects: {
    player: {
      model: "pla_phobocaster",
      position: { x: 5, y: 5, z: 5 },
      rotation: { x: 15, y: 30, z: 45 },
    },
    npc_1: {
      model: "pla_voodoobreath",
      position: { x: 10, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    enviromentObject: {
      model: "pla_voodoobreath",
      position: { x: -10, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
  },
};

export default gameLevel;
