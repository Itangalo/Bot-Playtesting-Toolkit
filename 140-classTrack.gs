/**
 * Class for managing tracks where pawns are moved.
 * 
 * @param {Array} spacesArrayData: An array of objects describing each
 * space on the track. Some special properties:
 *    * resolver: Name of a method in the spaceResolver object. Called
 *      through track.resolve(pawnId).
 * 
 * @param {Object} trackData: An object with properties to set to the
 * track. Some special properties:
 *    * assumePresent: If true, missing pawns start on the first space.
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
    i = Math.max(0, Math.min(i + steps, this.spaces.length - 1));
    this.pawnIndices[pawnId] = i;
    return this.spaces[i];
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
    if (!spaceResolvers[space.resolver]) {
      log('Space resolver ' + space.resolver + ' does not exist.', 'error');
      return false;
    }

    spaceResolvers[space.resolver](pawnId, ...arguments);
  }
}
