export function getSelectedScenes(value: any[], selectedIndexes: number[]) {
  const scenes: any[][] = [];

  selectedIndexes.forEach(idx => {
    const scene: any[] = [];
    for (let i = idx; i < value.length; i++) {
      const block = value[i];
      if (i !== idx && block.type === "slugline") break;
      scene.push(block);
    }
    scenes.push(scene);
  });

  return scenes;
}