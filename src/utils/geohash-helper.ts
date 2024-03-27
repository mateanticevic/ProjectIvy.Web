export const getChildrenGeohashes = (geohash: string) => {
    const geohashLetters = "0123456789bcdefghjkmnpqrstuvwxyz".split('');
    return geohashLetters.map(l => `${geohash}${l}`);
}