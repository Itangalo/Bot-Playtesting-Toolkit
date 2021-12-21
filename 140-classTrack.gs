/**
 * Class for managing tracks where pawns are moved.
 * 
 * @param {Array} spacesArrayData: An array of objects describing each
 * space on the track. Some special properties:
 *    - resolver: Name of a method in the spaceResolver object. Called
 *      through track.resolve(pawnId).
 * 
 * @param {Object} trackData: An object with properties to set to the
 * track. Some special properties:
 *    - assumePresent: If true, missing pawns start on the first space.
 *    - loop: If true, the last space is followed by the first.
 */
class Track {
  constructor(id, spacesArrayData = false, trackData = false) {
    this.id = id;
    if (trackData) {
      for (let i in trackData) {
        this[i] = trackData[i];
      }
    }

    if (spacesArrayData)
      this.spaces = spacesArrayData;
    else
      this.spaces = [];
    
    // Object used to track where on the track pawns are.
    this.pawnIndices = {};
  }

  /**
   * Returns the index for the space where the pawn is, or -1 if
   * pawn is missing (and should not be assumed to start at 0).
   */
  getPawnIndex(pawnId) {
    if (!isNaN(this.pawnIndices[pawnId])) {
      return this.pawnIndices[pawnId];
    }
    if (this.assumePresent) {
      this.pawnIndices[pawnId] = 0;
      return 0;
    }
    return -1;
  }

  /**
   * Returns the space object where the pawn is.
   */
  getPawnSpace(pawnId) {
    let i = this.getPawnIndex(pawnId);
    if (i < 0) {
      log('Pawn ' + pawnId + ' is not present on track ' + this.id + '. Cannot return space.', 'error');
      return false;
    }
    return this.spaces[i];
  }

  /**
   * Moves a pawn a number of steps on the track. Returns the resulting space.
   */
  movePawn(pawnId, steps = 1) {
    let i = this.getPawnIndex(pawnId);
    if (i < 0)
      throw('Cannot move pawn ' + pawnId + ' on track ' + this.id + '. Pawn is not present.');

    // Move up or down the track, but not beyond its edges.
    if (this.loop)
      i = (i + steps) % this.spaces.length;
    else 
      i = Math.max(0, Math.min(i + steps, this.spaces.length - 1));
    this.pawnIndices[pawnId] = i;
    return this.spaces[i];
  }

  /**
   * Moves the pawn to the first space. Creates pawn if necessary.
   */
  movePawnToStart(pawnId) {
    this.pawnIndices[pawnId] = 0;
  }

  /**
   * Moves the pawn to the last space. Creates pawn if necessary.
   */
  movePawnToStart(pawnId) {
    this.pawnIndices[pawnId] = this.spaces.length - 1;
  }

  /**
   * Tells whether the pawn is at the first space.
   */
  isAtStart(pawnId) {
    return (this.pawnIndices[pawnId] == 0);
  }

  /**
   * Tells whether the pawn is at the last space.
   */
  isAtEnd(pawnId) {
    return (this.pawnIndices[pawnId] == this.spaces.length - 1);
  }

  /**
   * Returns the first space matching the given property:value, or
   * false if none is found.
   */
  getSpace(property, value) {
    for (let s of this.spaces) {
      if (s[property] == value)
        return s;
    }
    return false;
  }

  /**
   * Returns the track index for the first space matching the
   * given property:value, or false if none is found.
   */
  getSpaceIndex(property, value) {
    for (let i in this.spaces) {
      if (this.spaces[i][property] == value)
        return i;
    }
    return false;
  }

  /**
   * Returns an array of all pawn IDs at a given track index.
   */
  getPawnsAtIndex(index) {
    let pawnIds = [];
    for (let p in this.pawnIndices) {
      if (this.pawnIndices[p] == index)
        pawnIds.push(p);
    }
    return pawnIds;
  }

  /**
   * Moves a pawn to the first space matching property:value. Creates
   * the pawn if necessary.
   */
  moveToSpace(pawnId, property, value) {
    let i = this.getSpaceIndex(property, value);
    if (i < 0)
      throw('Cannot move ' + pawnId + ' to a space matching ' + property + ':' + value + '. No such space.');
    this.pawnIndices[pawnId] = i;
  }

  /**
   * Calls any resolver set for the pawn's space.
   * Resolver will be called with pawn ID as first parameter, followed
   * by any other parameters provided.
   */
  resolve(pawnId) {
    let space = this.getPawnSpace(pawnId);
    if (!space.resolver)
      return false;
    if (!spaceResolvers[module][space.resolver]) {
      log('Space resolver ' + space.resolver + ' does not exist.', 'error');
      return false;
    }

    spaceResolvers[module][space.resolver](pawnId, ...arguments);
  }
}
