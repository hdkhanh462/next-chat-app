export function makeKeyPair(requesterId: string, addresseeId: string) {
  const [id1, id2] = [requesterId, addresseeId].sort();
  return `${id1}_${id2}`;
}
