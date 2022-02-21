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
 *    - cacheGraph: If true, the created map of connections between spaces is stored between game iterations.
 *      Only use if the connections do not change within or between games. Defaults to false.
 *
 * @param {Array} spacesDataArray: An array of objects describing each space on the track.
 * See Space class for details.
 * @param {Array} pawnsDataArray: An array of objects describing each pawn present on the track
 * from start. See Pawn class for details.
 */
class Track {
  constructor(trackData, spacesDataArray = false, pawnsDataArray = false) {
    // Add default settings, overwrite with provided data.
    Object.assign(this, applyDefaults(BPTstatic.defaults.track, trackData));
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

    this.pawns = {};
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
      if (this.cacheGraph) {
        this.graph = getCache('track.' + this.id + '.grid');
        this.heuristic = getCache('track.' + this.id + '.heuristic');
      }
      else
        this.graph = false;
      if (!this.graph) {
        this.graph = [];
        for (let i = 0; i < this.spaces.length; i++)
          this.graph.push([]);
        for (let s of this.spaces) {
          for (let c of s.connectsTo) {
            let target = new ObjectFilter({id: c}).findFirstInArray(this.spaces);
            this.graph[s.index][target.index] = 1;
            if (this.symmetricConnections)
              this.graph[target.index][s.index] = 1;
          }
        }
        let row = Array(this.graph.length).fill(1);
        this.heuristic = Array(this.graph.length).fill(row);
        setCache('track.' + this.id + '.grid', this.graph);
        setCache('track.' + this.id + '.heuristic', this.heuristic);
      }
      this.pawnPaths = {};
    }

    // Map space IDs to indices, for quicker reference. And update space indices.
    this.spaceMapping = {};
    for (let i in this.spaces) {
      this.spaceMapping[this.spaces[i].id] = i;
      this.spaces[i].index = parseInt(i);
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
    if (this.startSpaceId)
      return this.spaces[this.spaceMapping[this.startSpaceId]];
    return this.spaces[0];
  }

  /**
   * Returns the first space matching the given property:value, or
   * false if none is found. If only one argument is provided, it is assumed to be ID.
   * For more complex conditions, see ObjectFilter.
   */
  getSpace(property, value) {
    if (value === undefined) {
      value = property;
      property = 'id';
    }
    if (property == 'id') {
      if (this.spaceMapping[value] === undefined) {
        throw('Tried to get space with id ' + value + ' but no such space exist on track + ' + this.id + '.');
      }
      return this.spaces[this.spaceMapping[value]];
    }
    let condition = {};
    condition[property] = value;
    return new ObjectFilter(condition).findFirstInArray(this.spaces);
  }

  /**
   * Gets the pawn with the specified ID. Creates the pawn if myTrack.assumePresent is true.
   */
  getPawn(pawnId) {
    if (this.pawns[pawnId] === undefined) {
      if (this.assumePresent) {
        return new Pawn({id: pawnId}, this);
      }
      if (BPTstatic.debugRunning)
        return false;
      throw('Tried to get pawn ' + pawnId + ' but no such pawn exist on track + ' + this.id + '.');
    }
    return this.pawns[pawnId];
  }

  /**
   * Takes an array with space data and returns the spaces converted to another format.
   * 
   * @param {array} spaceData: The array with space data.
   * @param {string} inputFormat: The type of data in spaceData. Either 'index' (default)
   *    'id' or 'object'.
   * @param {string} outputFormat: The type of data to output. Either 'object' to return
   *    the full Space objects, or the name of a property (also 'id' and 'index') to return
   *    that property value. Defaults to 'object'.
   */
  convertSpaceData(spaceData, inputFormat = 'index', outputFormat = 'object') {
    // Validate input format.
    if (!['index', 'id', 'object'].includes(inputFormat))
      throw('Cannot convert space data. ' + inputFormat + ' is not a valid input format.');

    // Two special cases that are handled quicker than the general case.
    if (inputFormat == outputFormat)
      return spaceData;
    if (inputFormat == 'id' && outputFormat == 'index') {
      return spaceData.map(x => this.spaceMapping[x]);
    }
    // Convert the input data to the space objects.
    let output = spaceData;
    if (inputFormat == 'index')
      output = spaceData.map(x => this.spaces[x]);
    if (inputFormat == 'id')
      output = spaceData.map(x => this.spaces[this.spaceMapping[x]]);
    // Return the selected property, or the full object.
    if (outputFormat == 'object')
      return output;
    return output.map(x => x[outputFormat]);
  }

  /**
   * Returns an array with the shortest path from start to goal space, excluding start space.
   * Returns false if the path could be built.
   * 
   * @param {string} returnType: How the returned spaces should be represented – 'object',
   *    'id' or 'index', or a name of a property on the spaces. Defaults to 'object'.
   */
  buildPath(startSpaceId, goalSpaceId, returnType = 'object') {
    if (!this.gridMovement)
      throw('Cannot use "buildPath" on track ' + this.id + '. It does not have grid movement enabled.');
    let path = [];

    let startSpaceIndex = parseInt(this.spaceMapping[startSpaceId]);
    let goalSpaceIndex = parseInt(this.spaceMapping[goalSpaceId]);
    path = aStar(this.graph, this.heuristic, startSpaceIndex, goalSpaceIndex);
    if (!path)
      return false;
    path.shift(); // The first space is the starting space.
    for (let i in path)
      path[i] = this.spaces[path[i]];
    return this.convertSpaceData(path, 'object', returnType);
  }

  /**
   * Returns all spaces within distance 'steps' from some given origin spaces. Only used in grid
   * tracks. The 'flat' return is an array with all spaces. The unflat return is an array with
   * spaces keyed by their distance to the space, eg. [['A'], ['B'], ['C', 'D']] where 'A'
   * is origin space, 'B' adjacent to 'A' and 'C' & 'D' two steps from 'A'. Note that
   * the unflattened return can be used to get all spaces on a certain distance, eg.
   * getSpacesWithinRange(2)[2] contains all spaces 2 steps from the origin spaces.
   * 
   * @param {array} originSpaces: The spaces to start the search from. An array of _indexes_
   *    for these spaces, as used in myTrack.spaces.
   * @param {Number} steps: The range to search within. Origin spaces are on distance 0.
   *    Defaults to 1.
   * @param {boolean} flatten: Whether to flatten the return array or not. Defaults to false.
   * @param {string} returnType: How the returned spaces should be represented – 'object',
   *    'id' or 'index', or a name of a property on the spaces. Defaults to 'object'.
   * @param {object} filter: If set to an ObjectFilter, only matching spaces will be traversed.
   */
  getSpacesWithinRange(originSpaceIndices, steps = 1, flatten = false, returnType = 'object', filter = true) {
    if (!this.gridMovement)
      throw('Cannot use search for spaces within range on track ' + this.id + '. It does not have grid movement enabled.');
    // Build a list of the spaces at the rim of the search, and a list of all found spaces.
    let spaces = [copy(originSpaceIndices)];
    let allSpaces = copy(originSpaceIndices);
    let spacesToAdd = copy(originSpaceIndices);
    if (filter !== true && !(filter instanceof ObjectFilter))
      throw('Only ObjectFilter objects can be used as filters.');

    let i = 0;
    while (i < steps && spacesToAdd.length) {
      // Check spaces at the rim of the search.
      let spacesToCheck = spaces[spaces.length - 1];
      spacesToAdd = [];
      for (let s of spacesToCheck)
        for (let newSpace in this.graph[s])
          // Only include connected spaces, and only those that have not already been checked.
          if (this.graph[s][newSpace] && !allSpaces.includes(parseInt(newSpace)) && !spacesToAdd.includes(parseInt(newSpace)))
            if (filter === true || filter.applyOnObject(this.spaces[newSpace]))
              spacesToAdd.push(parseInt(newSpace));

      // Add a new rim to the search. Take another step.
      spaces.push(spacesToAdd);
      allSpaces.push(...spacesToAdd);
      i++;
    }

    // Return flat or non-flat results, in the proper format.
    if (flatten) {
      return this.convertSpaceData(allSpaces, 'index', returnType);
    }
    return spaces.map(x => this.convertSpaceData(x, 'index', returnType));
  }

  /**
   * Returns all the spaces within the radius of the given point.
   * 
   * @param {object} point: An object with (at least) coordinate values for the point to search from.
   * @param {number} radius: A maximum distance from the point to search.
   * @param {string} shape: Set to 'square' to search a square instead of a circle.
   * 
   * @return: An array of spaces, sorted by distance to the point.
   */
  getSpacesWithinRadius(point, radius = 1, shape = 'circle') {
    // Get all spaces within the distance from the point, in a square.
    let filter = new ObjectFilter();
    for (let c of this.coordinates) {
      let value = {};
      value[c] = point[c] - radius;
      filter.addGreaterOrEqualCondition(value);
      value[c] = point[c] + radius;
      filter.addLessOrEqualCondition(value);
    }
    // Get the distance from the point for all these candidates.
    let spaces = [];
    for (let s of filter.applyOnArray(this.spaces)) {
      let distance = getDistance(point, s, this.coordinates);
      if (shape == 'square' || distance <= radius)
        spaces.push({
          space: s,
          distance: distance,
        });
    }
    // Sort by distance from the point.
    sortByProperty(spaces, 'distance', true, true)[0]['space'];
    return buildArrayWithProperty(spaces, 'space');
  }

  /**
   * Returns the space closest to a given point.
   *
   * @param {object} point: An object with (at least) coordinate values for the point to search from.
   * @param {number} radius: A maximum distance from the point to search. Smaller number increases search speed.
   * @param {string} shape: Set to 'square' to search a square instead of a circle.
   *
   * @return {Space} The space object with coordinates closest to the given point. If several
   * equally near, one of these is selected randomly.
   */
  getClosestSpace(point, radius = 1, shape = 'circle') {
    let spaceList = this.getSpacesWithinRadius(point, radius, shape);
    if (spaceList.length == 0)
      throw('No space is within search distance from the given point.');
    return spaceList[0];
  }

  /**
   * Does an estimation of whether there is a line of sight between two spaces. If point coordinates
   * are provided, these will be used instead of spaces' coordinates.
   * 
   * The function requires that spaces have the property rOuter set, describing the radius of
   * a circle just encompassing the space. Spaces must also have coordinates matching the properties
   * specified in myTrack.coordinates.
   * 
   * @param {Space} spaceA: The origin space for the line of sight.
   * @param {Space} spaceB: The target space for the line of sight.
   * @param {array} points: If provided, listed points will be used instead of center points in spaces.
   *    Should be on the form [pointsA, pointsB] where each entry is an array on the form [{x: 1, y: 3}, ...]
   *    (with the coordinate names used by the track). PointsA should describe points within the origin
   *    space while pointsB describes points within the target space. @see pointHalfCircleDistribution().
   */
  lineOfSight(spaceA, spaceB, points = false) {
    let pointsA = [];
    let pointsB = [];
    // Create default points, if necessary.
    if (!points) {
      let pointA = {};
      for (let c of this.coordinates)
        pointA[c] = spaceA[c];
      pointsA.push(pointA);
      let pointB = {};
      for (let c of this.coordinates)
        pointB[c] = spaceB[c];
      pointsB.push(pointB);
    }
    else {
      pointsA = points[0];
      pointsB = points[1];
    }

    // Build a 'fat' path between spaceA and spaceB. These are spaces the line of sight may cross.
    let spaces = this.buildPath(spaceA.id, spaceB.id, 'index');
    spaces.pop();
    spaces = this.getSpacesWithinRange(spaces, 1, true);

    // Try line of sights between all combinations of the listed points for A and B.
    for (let pointA of pointsA) {
      for (let pointB of pointsB) {

        // Get the step size and direction to use when going from A to B.
        let totalLength = getDistance(pointA, pointB, this.coordinates);
        if (totalLength < spaceA.rOuter)
          return true;
        let delta = {};
        for (let c of this.coordinates)
          delta[c] = (pointB[c] - pointA[c]);
        for (let c of this.coordinates)
          delta[c] = delta[c] / totalLength * spaceA.rOuter * this.lineOfSightStepFraction;
        
        // Go in a straight line from A to B and check that points on the line fall within
        // the outer radius of at least one listed space.
        let pointToCheck = copy(pointA);
        let keepStepping = true;
        while (keepStepping) {
          keepStepping = true;
          let ok = false;
          for (let s of spaces) {
            if (getDistance(pointToCheck, s, this.coordinates) <= s.rOuter) {
              if (s.id == spaceB.id)
                return true;
              ok = true;
              break;
            }
          }
          if (!ok)
            keepStepping = false;
          for (let c of this.coordinates)
            pointToCheck[c] += delta[c];
        }
      }
    }
  }

  /**
   * Returns a number of points inside spaces, distributed on a half circle. Used for line of sight.
   * 
   * The spaces must have the property rInner, describing the radius of circle that fits inside the space.
   * The returned points are distributed on such a half-circle inside each space, and rotated so the
   * half circle is facing the other space. Only works in two dimensions.
   * 
   * @param {Space} spaceA: The first space to create points within.
   * @param {Space} spaceB: The second space to create points within.
   * @param {Number} numberOfPoints: The number of points to plot. At least 2, defaults to 5.
   * 
   * @return An array on the form [pointsA, pointsB], where each entry in itself is an array of
   *    points on the form {x: 1, y: 3}, depending on names of track coordinates.
   */
  pointHalfCircleDistribution(spaceA, spaceB, numberOfPoints = 5) {
    if (this.coordinates.length != 2)
      throw('pointHalfCircleDistribution can only be used on two-dimensional tracks.');

    numberOfPoints = Math.max(2, numberOfPoints);
    let x = this.coordinates[0];
    let y = this.coordinates[1];
    let ray = {};
    ray[x] = spaceB[x] - spaceA[x];
    ray[y] = spaceB[y] - spaceA[y];
    let angle = Math.atan2(ray[y], ray[x]);

    let pointsA = [];
    let pointsB = [];
    for (let n = -.5; n <= .5; n += 1/(numberOfPoints-1)) {
      let point1 = {};
      point1[x] = spaceA[x] + spaceA.rInner * Math.cos(angle + Math.PI*n);
      point1[y] = spaceA[y] + spaceA.rInner * Math.sin(angle + Math.PI*n);
      pointsA.push(point1);
      let point2 = {};
      point2[x] = spaceB[x] - spaceB.rInner * Math.cos(angle + Math.PI*n);
      point2[y] = spaceB[y] - spaceB.rInner * Math.sin(angle + Math.PI*n);
      pointsB.push(point2);
    }
    return [pointsA, pointsB];
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
   *    - resolver: Name of a resolver method. Called through track.resolve(pawnId).
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
      if (!this.rOuter)
        this.rOuter = this.track.rOuter;
      if (!this.rInner)
        this.rInner = this.track.rInner;
    }

    this.index = track.spaces.length || 0;
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
   * Returns all spaces within distance 'steps' from the space. Only used in grid tracks.
   * The 'flat' return is an array with all spaces. The unflat return is an array with
   * spaces keyed by their distance to the space, eg. [['A'], ['B'], ['C', 'D']] where 'A'
   * is origin space, 'B' adjacent to 'A' and 'C' & 'D' two steps from 'A'. Note that
   * the unflattened return can be used to get all spaces on a certain distance, eg.
   * getSpacesWithinRange(2)[2] contains all spaces 2 steps from the starting space.
   * 
   * @param {Number} steps: The range to search within. Origin space is on distance 0.
   *    Defaults to 1.
   * @param {boolean} flatten: Whether to flatten the return array or not. Defaults to false.
   * @param {string} returnType: How the returned spaces should be represented – 'object',
   *    'id' or 'index', or a name of a property on the spaces. Defaults to 'object'.
   * @param {object} filter: If set to an ObjectFilter, only matching spaces will be traversed.
   *    @see also getMatchingSpacesWithinRange().
   */
  getSpacesWithinRange(steps = 1, flatten = false, returnType = 'object', filter = true) {
    return this.track.getSpacesWithinRange([this.index], steps, flatten, returnType, filter);
  }

  /**
   * Returns an array with all spaces matching the set filter, connecting directly or
   * indirectly to the space. Note that the initial space is returned regardless of match.
   * @see also getSpacesWithinRange()
   *
   * @param {ObjectFilter} filter: An ObjectFilter describing the conditions for the area.
   * @param {Number} steps: Any restriction on the distance. Defaults to infinity.
   * @param {boolean} flatten: Whether to return a flat array or an array keyed by distance.
   *    Defaults to true (flat array).
   * @param {string} returnType: How the returned spaces should be represented – 'object',
   *    'id' or 'index', or a name of a property on the spaces. Defaults to 'object'.
   */
  getMatchingSpacesWithinRange(filter, steps = Number.POSITIVE_INFINITY, flatten = true, returnType = 'object') {
    return this.track.getSpacesWithinRange([this.index], steps, flatten, returnType, filter);
  }

  /**
   * Passes on work to any resolver function declared for the space, along
   * with any parameters. Spaces needs to have a the property 'resolver' set
   * and a corresponding method must be placed in modules[module].resolvers.
   */
  resolve() {
    return callResolver(this.resolver, ...arguments);
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

    Object.assign(this, pawnData);
    if (this.id === undefined)
      throw('Pawns must have an id property set.');
    // Add the track name + pawn to any agent matching the pawn id.
    for (let a of gameState.agents) {
      if (this.id == a.id) {
        if (a[track.id] === undefined)
          a[track.id] = {};
        a[track.id].pawn = this;
      }
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
    if (!this.track.gridMovement) {
      let i = this.space.index + steps;
      while (i < 0) {
        if (this.track.loop)
          i += this.track.spaces.length;
        else
          i = 0;
      }
      while (i >= this.track.spaces.length) {
        if (this.track.loop)
          i -= this.track.spaces.length;
        else
          i = this.track.spaces.length - 1;
      }
      this.space = this.track.spaces[i];
      return this.space;
    }
    // Movement in grid.
    else {
      if (!this.path || !this.path.length) {        
        log('Tried to move pawn ' + this.id + ' in a grid, but no path was set.', 'error');
        return false;
      }
      if (steps < 0) {
        log('Tried to move pawn ' + pawnId + ' ' + steps + ' steps, but backwards movement in grid is not possible.', 'error');
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
   * be placed in modules[module].resolvers. Note that resolver also can be called from
   * space.resolve().
   */
  resolve() {
    if (!this.space)
      return false;
    return this.space.resolve(...arguments);
  }
}
