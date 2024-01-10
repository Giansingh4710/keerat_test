export function getNameOfTrack(link) {
  const title = link.split("/").slice(-1)[0];
  return decodeURIComponent(decodeURIComponent(title));
}
