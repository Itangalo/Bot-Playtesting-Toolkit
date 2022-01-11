/**
 * @file: Classes for tracks and spaces.
 */

/**
 * Class for managing tracks where pawns are moved.
 * 
 * @param {Object} trackData: An object with properties to set to the
 * track. Some special properties:
 *    - id: The unique id for the track. Required.
 *    - assumePresent: If true, missing pawns start on the first space.
 *    - loop: If true, the last space is followed by the first.
 * 
 * @param {Array} spacesDataArray: An array of objects describing each
 * space on the track. Some special properties:
 *    - resolver: Name of a method in the spaceResolver object. Called
 *      through track.resolve(pawnId).
 */
class Track {
  constructor(trackData, spacesDataArray = false) {
    // Build basic data and verify required properties.
    Object.assign(this, trackData);
    if (this.id === undefined)
      throw('Tracks must have an id property set.');
    
    // Add the track to gameState and, if relevant, to an agent with the same ID.
    if (gameState.tracks === undefined)
      gameState.tracks = {};
    gameState.tracks[this.id] = this;
    let agent = getAgentById(this.id);
    if (agent) {
      agent.track = this;
    }

    // Additional processing just for decks.
    this.spaces = [];
    if (spacesDataArray) {
      for (let s of spacesDataArray) {
        this.constructSpace(s);
      }
    }

    // Build a graph of how the spaces connect, if advanced movement is used.
    if (this.gridMovement)
      this.buildGraph();

    // Used for quickly finding the right space based on its ID.
    this.spaceMapping = {};
    for (let i in this.spaces)
      this.spaceMapping[this.spaces[i].id] = i;

    // Object used to track where on the track pawns are or are going.
    this.pawnIndices = {};
  }

  /**
   * Builds (or rebuilds) a graph of nodes in the track.
   *
   * Data used by the a-star algorithm, to find paths in the grid.
   */
  buildGraph() {
    this.graph = [];
    for (let i = 0; i < this.spaces.length; i++)
      this.graph.push([]);
    for (let s of this.spaces) {
      for (let c of s.connectsTo) {
        let target = pickFromArray(this.spaces, 'id', c);
        this.graph[s.index][target.index] = 1;
        if (this.symmetricConnections)
          this.graph[target.index][s.index] = 1;
      }
    }
    let row = Array(this.graph.length).fill(1);
    this.heuristic = Array(this.graph.length).fill(row);
    this.pawnPaths = {};
  }

  /**
   * Creates a space object and adds last on the track.
   * @param {Object} spaceData: An object with any sets of property:value pairs.
   */
  constructSpace(spaceData) {
    let s = new Space(spaceData, this);
    return s;
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
   * Sets the pawn on the given space and returns the space.
   */
  setPawnSpace(pawnId, spaceId) {
    let index = this.getSpaceIndex('id', spaceId);
    this.pawnIndices[pawnId] = index;
    return this.spaces[index];
  }

  /**
   * Moves a pawn a number of steps on the track. Returns the resulting space.
   * Uses movement in grid, towards a set goal space, if grid movement is enabled.
   */
  movePawn(pawnId, steps = 1) {
    // The one-dimensional plain movement.
    if (!this.gridMovement) {
      let i = this.getPawnIndex(pawnId);
      if (i < 0)
        throw('Cannot move pawn ' + pawnId + ' on track ' + this.id + '. Pawn is not present.');

      // Move up or down the track, but not beyond its edges.
      if (this.loop) {
        // A bit awkward computation here, to bypass negative remainders.
        steps = steps % this.spaces.length + this.spaces.length;
        i = (i + steps) % this.spaces.length;
      }
      else 
        i = Math.max(0, Math.min(i + steps, this.spaces.length - 1));
      this.pawnIndices[pawnId] = i;
      return this.spaces[i];
    }
    // Movement in grid.
    else {
      if (!this.pawnPaths[pawnId] || !this.pawnPaths[pawnId].length) {        
        log('Tried to move pawn ' + pawnId + ' in a grid, but no path was set.', 'error');
        return false;
      }
      let j = 0;
      let s = false;
      while (this.pawnPaths[pawnId].length && j < steps) {
        j++;
        s = this.pawnPaths[pawnId].shift();
      }
      if (s)
        this.pawnIndices[pawnId] = s.index;
      return s;
    }
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
  movePawnToEnd(pawnId) {
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
    if (property == 'id')
      return this.spaces[this.spaceMapping[value]];
    return pickFromArray(this.spaces, property, value);
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
   * Moves a pawn a number of steps towards a space. Populates path for the pawn if necessary.
   * Returns the new space for the pawn.
   */
  moveTowards(pawnId, goalSpaceId, steps = 1) {
    if (!this.gridMovement)
      throw('Cannot use "moveTowards" on track ' + this.id + '. It does not have grid movement enabled.');
    if (this.buildPath(pawnId, goalSpaceId))
      return this.movePawn(pawnId, steps);
    return false;
  }

  /**
   * Builds a paths for the given pawn to the given space.
   * Returns true if the path could be built, otherwise false. The pawn path is only
   * updated if the path could be built -- otherwise it is left untouched.
   */
  buildPath(pawnId, goalSpaceId) {
    if (!this.gridMovement)
      throw('Cannot use "buildPath" on track ' + this.id + '. It does not have grid movement enabled.');
    let path = this.pawnPaths[pawnId] || [];
    // Check if the current path already is set to the given goal.
    if (path.length && path[path.length - 1].id == goalSpaceId)
      return true;
    // Check if the goal is somewhere inside the given path.
    for (let i in path) {
      if (path[i].id == goalSpaceId) {
        path.splice(i + 1);
        this.pawnPaths[pawnId] = path;
        return true;
      }
    }

    let startSpaceIndex = this.getPawnSpace(pawnId).index;
    let goalSpaceIndex = this.getSpace('id', goalSpaceId).index;
    path = aStar(this.graph, this.heuristic, startSpaceIndex, goalSpaceIndex);
    if (!path)
      return false;
    path.shift(); // The first space is where the pawn currently is.
    for (let i in path)
      path[i] = this.spaces[path[i]];
    this.pawnPaths[pawnId] = path;
    return true;
  }

  /**
   * Calls any resolver set for the pawn's space.
   * Any arguments after the pawn ID will be sent to the resolver.
   * The space needs to have a the property 'resolver' set and a corresponding
   * method must be placed in modules[module].resolvers.spaces.
   * Note that resolver also can be called from space.resolve().
   */
  resolve(pawnId) {
    let space = this.getPawnSpace(pawnId);
    if (!space)
      return false;

    let args = parseArguments(arguments, 1);
    return callResolver('spaces', space.resolver, ...args);
  }
}

/**
 * Class for managing spaces on tracks.
 */
class Space {
  /**
   * @param {Object} spaceData: Any propery:value pairs that should be added to the card.
   * @param {Track} track: A track object, to which the space should be added.
   */
  constructor(spaceData, track) {
    if (!track instanceof Track)
      throw('Spaces must be added to a proper track.');

    Object.assign(this, spaceData);
    this.track = track;

    if (this.track.gridMovement) {
      if (!this.connectsTo)
        this.connectsTo = [];
      if (typeof(this.connectsTo) != 'object')
        this.connectsTo = [this.connectsTo];
    }

    this.index = track.spaces.length;
    track.spaces.push(this);
  }

  /**
   * Passes on work to any resolver function declared for the space, along
   * with any parameters. Spaces needs to have a the property 'resolver' set
   * and a corresponding method must be placed in modules[module].resolvers.spaces.
   */
  resolve() {
    return callResolver('spaces', this.resolver, ...arguments);
  }
}
