/**
 * @file: Classes for tracks and spaces.
 */

/**
 * Class for managing tracks where pawns are moved.
 * 
 * @param {Object} trackData: An object with properties to set to the
 * track. Some special properties:
 *    - id: The unique id for the track. Required.
 *    - startSpaceId: Sets which space to use for starting space. Defaults to the first added space.
 *    - assumePresent: If true, missing pawns are created when calling getPawn(pawnId). Defaults to true.
 *    - loop: If true, the last space is followed by the first. Defaults to false.
 *    - gridMovement: If true, possible movement is defined through connections on spaces. Defaults to false.
 *    - symmetricConnections: If true, any connections between spaces are assumed to go both ways.
 *      Only relevant if gridMovement is true. Defaults to true.
 *
 * @param {Array} spacesDataArray: An array of objects describing each space on the track.
 * See Space class for details.
 * @param {Array} pawnsDataArray: An array of objects describing each pawn present on the track
 * from start. See Pawn class for details.
 */
class Track {
  constructor(trackData, spacesDataArray = false, pawnsDataArray = false) {
    // Add default settings, overwrite with provided data.
    Object.assign(this, applyDefaults(global.defaults.track, trackData));
    // Verify that an ID is present.
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

    // Additional processing just for tracks.
    this.spaces = [];
    if (spacesDataArray) {
      for (let s of spacesDataArray) {
        this.constructSpace(s);
      }
    }
    this.rebuild();

    if (pawnsDataArray) {
      for (let p of pawnsDataArray)
        this.constructPawn(p);
    }
  }

  /**
   * Rebuilds track data. Needed when new spaces are added.
   */
  rebuild() {
    // Build a graph of how the spaces connect, if advanced movement is used.
    // Data used by the a-star algorithm, to find paths in the grid.
    if (this.gridMovement) {
      this.graph = [];
      for (let i = 0; i < this.spaces.length; i++)
        this.graph.push([]);
      for (let s of this.spaces) {
        for (let c of s.connectsTo) {
          let target = pickFromObjectArray(this.spaces, 'id', c, false);
          this.graph[s.index][target.index] = 1;
          if (this.symmetricConnections)
            this.graph[target.index][s.index] = 1;
        }
      }
      let row = Array(this.graph.length).fill(1);
      this.heuristic = Array(this.graph.length).fill(row);
      this.pawnPaths = {};
    }

    // Map space IDs to indices, for quicker reference. And update space indices.
    this.spaceMapping = {};
    for (let i in this.spaces) {
      this.spaceMapping[this.spaces[i].id] = i;
      this.spaces[i].index = i;
    }
  }

  /**
   * Creates a space object and adds last on the track.
   * @param {Object} spaceData: An object with property:value pairs. id is required.
   */
  constructSpace(spaceData) {
    let s = new Space(spaceData, this);
    return s;
  }

  /**
   * Creates a pawn object and puts it on the track.
   * @param {Object} pawnData: An object with property:value pairs. id is required.
   */
  constructPawn(pawnData) {
    let p = new Pawn(pawnData, this);
    return p;
  }

  // Returns the start space for the track, defaulting to the first space.
  getStartSpace() {
    if (!this.startSpaceId)
      return this.spaces[this.spaceMapping[this.startSpaceId]];
    return this.spaces[0];
  }

  /**
   * Returns the first space matching the given property:value, or
   * false if none is found.
   */
  getSpace(property, value) {
    if (property == 'id') {
      if (this.spaceMapping[value] === undefined) {
        throw('Tried to get space with id ' + value + ' but no such space exist on track + ' + this.id + '.');
      }
      return this.spaces[this.spaceMapping[value]];
    }
    return pickFromObjectArray(this.spaces, property, value, false);
  }

  /**
   * Gets the pawn with the specified ID. Creates the pawn if myTrack.assumePresent is true.
   */
  getPawn(pawnId) {
    if (this.pawns[pawnId] === undefined) {
      if (this.assumePresent) {
        return new Pawn({id: pawnId}, this);
      }
      throw('Tried to get pawn ' + pawnId + ' but no such pawn exist on track + ' + this.id + '.');
    }
    return this.pawns[pawnId];
  }

  /**
   * Returns an array with the shortest path from start to goal space, excluding start space.
   * Returns false if the path could be built.
   */
  buildPath(startSpaceId, goalSpaceId) {
    if (!this.gridMovement)
      throw('Cannot use "buildPath" on track ' + this.id + '. It does not have grid movement enabled.');
    let path = [];

    let startSpaceIndex = this.spaceMapping[startSpaceId];
    let goalSpaceIndex = this.spaceMapping[goalSpaceId];
    path = aStar(this.graph, this.heuristic, startSpaceIndex, goalSpaceIndex);
    if (!path)
      return false;
    path.shift(); // The first space is the starting space.
    for (let i in path)
      path[i] = this.spaces[path[i]];
    return path;
  }
}

/**
 * Class for managing spaces on tracks.
 */
class Space {
  /**
   * @param {Object} spaceData: Any propery:value pairs that should be added to the space.
   * @param {Track} track: A track object, to which the space should be added.
   * Some special properties for spaceData:
   *    - connectsTo: A space ID or an array of IDs, to which the space connects. Only relevant if
   *      the track.gridMovement is true.
   *    - resolver: Name of a method in the spaceResolver object. Called
   *      through track.resolve(pawnId).
   */
  constructor(spaceData, track) {
    if (!track instanceof Track)
      throw('Spaces must be added to a proper track.');

    Object.assign(this, spaceData);
    if (this.id === undefined)
      throw('Spaces must have an id property set.');
    this.track = track;

    if (this.track.gridMovement) {
      if (!this.connectsTo)
        this.connectsTo = [];
      if (typeof(this.connectsTo) !== 'object')
        this.connectsTo = [this.connectsTo];
    }

    this.index = track.spaces.length;
    track.spaces.push(this);
  }

  /**
   * Returns an array of all pawns (objects) at the space.
   */
  getAllPawns() {
    let pawns = [];
    for (let i in this.track.pawns) {
      if (this.track.pawns[i].space && this.track.pawns[i].space.id == this.id)
        pawns.push(this.track.pawns[i]);
    }
    return pawns;
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

/**
 * Class for managing pawns on tracks.
 */
class Pawn {
  /**
   * @param {Object} pawnData: Any propery:value pairs that should be added to the pawn.
   * @param {Track} track: A track object, to which the pawn should be added.
   * Some special properties for pawnData:
   *    - startSpaceId: The ID for the space where the pawn should start. Defaults to the
   *      track's starting space.
   */
  constructor(pawnData, track) {
    if (!track instanceof Track)
      throw('Pawns must be added to a proper track.');

    Object.assign(this, spaceData);
    if (this.id === undefined)
      throw('Pawns must have an id property set.');
    // Add the track name + pawn to any agent matching the pawn id.
    for (let a of gameState.agents) {
      if (this.id == a.id)
        a[track.id].pawn = this;
    }

    this.track = track;
    this.track.pawns[this.id] = this;

    if (!this.startSpaceId && this.startSpaceId !== 0) {
      this.startSpaceId = this.track.getStartSpace().id;
    }
    this.startSpace = this.track.getSpace('id', this.startSpaceId);
    this.space = this.startSpace;
    this.path = [];
  }

  /**
   * Sets the pawn on the given space and returns the space.
   */
  setSpace(spaceId) {
    let space = this.track.getSpace('id', spaceId);
    this.space = space;
    return space;
  }

  /**
   * Moves the pawn to its start space.
   */
  moveToStart() {
    this.space = this.startSpace;
  }

  /**
   * Moves the pawn to the last space.
   */
  moveToEnd(pawnId) {
    this.space = this.track.spaces[this.track.spaces.length - 1];
  }

  /**
   * Tells whether the pawn is at the first space.
   */
  isAtStart() {
    return (this.space.id === this.startSpace.id);
  }

  /**
   * Tells whether the pawn is at the last space.
   */
  isAtEnd() {
    return (this.space.index === this.track.spaces.length - 1);
  }

  /**
   * Moves the pawn a number of steps on the track. Returns the resulting space.
   * If grid movement is enabled, the pawn moves towards the set goal space, .
   */
  move(steps = 1) {
    // The one-dimensional plain movement.
    if (!this.gridMovement) {
      let i = this.space.index;
      // Move up or down the track, but not beyond its edges.
      if (this.loop) {
        // A bit awkward computation here, to bypass negative remainders.
        steps = steps % this.spaces.length + this.spaces.length;
        i = (i + steps) % this.spaces.length;
      }
      else 
        i = Math.max(0, Math.min(i + steps, this.spaces.length - 1));
      this.space = this.track.spaces[i];
      return this.space;
    }
    // Movement in grid.
    else {
      if (!this.path || !this.path.length) {        
        log('Tried to move pawn ' + pawnId + ' in a grid, but no path was set.', 'error');
        return false;
      }
      let i = 0;
      while (this.path.length && i < steps) {
        i++;
        this.space = this.path.shift();
      }
      return this.space;
    }
  }

  /**
   * Moves a pawn a number of steps towards a space. Populates path for the pawn if necessary.
   * Returns the new space for the pawn. Can only be used when grid movement is active.
   */
  moveTowards(goalSpaceId, steps = 1) {
    if (!this.track.gridMovement)
      throw('Cannot use "moveTowards" on track ' + this.track.id + '. It does not have grid movement enabled.');

    // Check if the current path already is set to the given goal.
    let pathFound = false;
    if (this.path.length && this.path[this.path.length - 1].id == goalSpaceId) {
      pathFound = true;
    }
    // Check if the goal is somewhere inside the given path.
    for (let i in this.path) {
      if (this.path[i].id == goalSpaceId) {
        this.path.splice(i + 1);
        pathFound = true;
      }
    }

    // Build a new path, if necessary. (Note that this is an expensive call.)
    if (!pathFound) {
      let path = this.track.buildPath(this.space.id, goalSpaceId);
      if (path)
        this.path = path;
      else
        return false;
    }
    return this.move(steps);
  }

  /**
   * Calls any resolver set for the pawn's space. Any arguments will be sent to the resolver.
   * The space needs to have a the property 'resolver' set and a corresponding method must
   * be placed in modules[module].resolvers.spaces. Note that resolver also can be called from
   * space.resolve().
   */
  resolve() {
    if (!this.space)
      return false;
    return this.space.resove(...arguments);
  }
}
