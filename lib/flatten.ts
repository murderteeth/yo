export default function flatten(obj: Record<string, any>, prefix: string = ''): Record<string, any> {
  return Object.keys(obj).reduce((acc: Record<string, any>, key: string) => {
    const newKey = prefix ? `${prefix}_${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key]) && !(obj[key] instanceof BigInt)) {
      Object.assign(acc, flatten(obj[key], newKey));
    } else {
      acc[newKey] = obj[key];
    }
    return acc;
  }, {});
}
