// Utility to fetch all furniture models from the models folder
// Returns a promise that resolves to an array of { name, image, glb }

const modelsContext = import.meta.glob('../models/*/*.{jpg,png,glb}', { eager: true });

export default async function fetchModels() {
  // Group files by model folder
  const models = {};
  Object.keys(modelsContext).forEach((key) => {
    // key example: '../models/Sofa/Sofa.jpg'
    const match = key.match(/\.\.\/models\/([^/]+)\/([^/]+\.(jpg|png|glb))/i);
    if (!match) return;
    const [ , modelName, fileName ] = match;
    if (!models[modelName]) models[modelName] = { name: modelName };
    if (fileName.endsWith('.jpg') || fileName.endsWith('.png')) {
      models[modelName].image = modelsContext[key].default;
    } else if (fileName.endsWith('.glb')) {
      models[modelName].glb = modelsContext[key].default;
    }
  });
  // Only return models that have both image and glb
  return Object.values(models).filter(m => m.image && m.glb);
}
