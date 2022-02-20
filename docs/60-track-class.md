# The Track, Space and Pawn classes

The `Track` class in the Bot Playtesting Toolkit is used for moving pawns on simple tracks or complex networks of nodes – both called tracks in the toolkit. The track is built of objects of the class `Space`, which may have properties of their own. The pawns are a class of its own too (`Pawn`), with methods and properties.

The most prominent functionality of tracks is moving pawns either in a simple way (on one-dimensional tracks) or on the shortest path to a given space – the latter including finding the shortest path.

Spaces, like cards, can have _resolvers_. These are functions called to execute some special effects of spaces. The name of the function to call is set at `mySpace.resolver` and is called either through `mySpace.resolve(...arguments)`. It can also be called from `myPawn.resolve()`, which passes on the work to whatever space the pawn currently is at.

## Creating tracks, spaces and pawns

Tracks, spaces and pawns are normally created in the module's `buildInitialData` function by populating the `gameStateSeed.tracks` array. The array should be populated by objects on the following form:

    {
      track: trackData,
      spaces: spaceDataArray,
      pawns: pawnDataArray,
    }

The track and pawn data is often so small that it can be built by hand in the code, while the spaces data usually is built from data in the spreadsheet. This is particularly the case if the track is a game board with many spaces. See example below.

![Screen shot with data in a spreadsheet describing spaces.](https://user-images.githubusercontent.com/262940/149407875-18fa1343-9683-4d26-9387-44066c2ccc7d.png)

    let trackData = {
      id: 'board',
      gridMovement: true
      symmetricConnections: true
    };
    let pawnDataArray = [
      {id: 'red'},
      {id: 'blue'},
      {id: 'green'},
      {id: 'magenta'},
    ];  
    let spaceDataArray = buildObjectArrayFromRows('mySheet', 'L2:O63');

    gameStateSeed.tracks = [];
    gameStateSeed.tracks.push({
      track: trackData,
      spaces: spaceDataArray,
      pawns: pawnDataArray,
    });

Data stored in `gameStateSeed.tracks` will automatically be used to create Track, Space and Pawn objects before each game iteration. The tracks will be stored under `gameState.tracks[trackId]`. Spaces are stored as an array at `gameState.tracks[trackId].spaces` while pawns are stored keyed by their ID at `gameState.tracks[trackId].pawns[pawnId]`.

Tracks, spaces and pawns can also be created from other places in the code by the statement `myTrack = new Track(trackData, spaceDataArray, pawnDataArray)` and also `mySpace = myTrack.constructSpace(spaceData)` and `myPawn = myTrack.constructPawn(pawnData)`. If new spaces are added to an existing track, or spaces are reordered, `myTrack.rebuild()` should be called to make updates of internal data for the Track object.

If `myTrack.assumePresent == true`, there is another and quicker way to create pawns. If so, `myTrack.getPawn(pawnId)` will create a pawn with the given ID and place it on the track's starting space. This means that for the simplest cases of pawns, they don't have to be explicitly created – you can just start moving them for example by calling `myTrack.getPawn(pawnId).move(3)`.

## Special properties

As with other objects, properties can be added as needed. Some properties have special meaning.

### Track properties

Tracks must have the property `id` set. If the id matches the id of an agent, the track is assumed to belong to that agent is added to agent.track. (It is also available at gameState.tracks[trackId].)

If the property `assumePresent` is set to `true`, pawns will be assumed to start on the track's starting space. Defaults to `true`.

The property `startSpaceId` can be set to tell the track where pawns should start. If not set, the starting space is assumed to be the first space (with index 0).

If the property `loop` is set to `true`, pawns will loop from the last space to the first (and vice versa) when moving past the track edges. (If not, the pawn will stop at the last/first space.) This is only relevant for movement on tracks without grid movement. Defaults to `false`.

If the property `gridMovement` is set to `true`, the track will not be treated as a linear track. Instead information on the spaces will be used to determine how pawns may move between spaces. Defaults to `false`.

If the property `symmetricConnections` is set to `true`, any connections between spaces are assumed to go both ways. This will reduce how much data needed for building the track/space information. The setting is only relevant for tracks using grid movement. Defaults to `true`.

The property `coordinates` can be set to an array of strings, such as `['x', 'y']` to tell Bot Playtesting Toolkit what space properties hold coordinates for the space. (Such coordinates are assumed to describe the _center_ of the space.) Coordinates can be used for checking distances and also line of sight.

The properties `rInner` and `rOuter` are used when checking line of sight between spaces. They can be set to describe radii of circles _fitting within_ (rInner) or _enclosing_ (rOuter) spaces. These properties are inherited by spaces and may be overridden on individual spaces.

The property `lineOfSightStepFraction` is used when checking line of sight between spaces. It can be set to a value greater than 0 and no bigger than 1, to tell `lineOfSight()` how large steps to take when tracking a line between points. The fraction defaults to `.1` and will be multiplied by `rOuter` when applied.

`myTrack.spaces` contains an array of all spaces on the track.

`myTrack.pawns` contains an object with all pawns on the track, keyed by their id.

`myTrack.spaceMapping` contains a mapping from space ID to the index number for the space.

`myTrack.grid` and `myTrack.heuristic` contains computed information about connections between spaces. Unless you know what you're doing you want to leave these untouched. They are only present on tracks using grid movement.

### Space properties

Spaces must have the property `id` set.

The property `connectsTo` is used in tracks with grid movement. The value/values should be IDs of spaces to which the space connect. (If `myTrack.symmetricConnections` is `true`, connections only have to be set on one of the connecting spaces.) Multiple values are added as arrays, denoted by [brackets].

The property `resolver` can be set to any name of a function stored at `modules[module].resolvers.spaces`. Calling `mySpace.resolve(...arguments)` will send off the request to the resolver function of the space and return the result. If the space has no resolver, `false` is returned.

`mySpace.track` points to the track the space belongs to.

`mySpace.index` contains the index number of the space, as stored in `myTrack.spaces`.

### Pawn properties

Pawns must have the property `id` set. If this matches the ID of an agent, the pawn is assumed to belong to the agent and is added to `agent[trackId].pawn` as well as the track object.

The property `startSpaceId` can be used to override the starting space of the track, allowing different starting spaces for each pawn.

`myPawn.space` points to the space where the pawn currently is.

`myPawn.path` contains an array of space objects, representing the planned future movement for the pawn. Neither the current space nor already passed spaces are included. The property is only present on tracks using grid movement.

`myPawn.startSpace` points to the starting space of the pawn.

## Functions available for tracks and spaces

### myTrack.constructSpace()

`myTrack.constructSpace(spaceData)`

This function creates a new space on the track and returns the result.

### myTrack.constructPawn()

`myTrack.constructPawn(pawnData)`

This function creates a new pawn, places it on the starting space of the track, and returns the result.

### myTrack.getStartSpace()

`myTrack.getStartSpace()`

This function returns the starting space object for the track, which is the first space unless `myTrack.startSpaceId` says otherwise.

### myTrack.getSpace()

`myTrack.getSpace(property, value)`

Returns the first space matching `property:value`, or `false` if none is found. If only one argument is provided, it is assumed to be a space ID.

### myTrack.getPawn()

`myTrack.getPawn(pawnId)`

Gets the pawn with the specified ID. Creates the pawn if `myTrack.assumePresent == true` and the pawn does not already exist.

### myTrack.convertSpaceData()

`myTrack.convertSpaceData(spaceData, inputFormat = 'index', outputFormat = 'object')`

Takes an array with space data and returns the spaces converted to another format.

`spaceData`: The array with space data.
`inputFormat`: The type of data in spaceData. Either 'index' (default), 'id' or 'object'.
`outputFormat`: The type of data to output. Either 'object' to return the full Space objects, or the name of a property (also 'id' and 'index') to return the values of that property. Defaults to 'object'.

### myTrack.buildPath()

`myTrack.buildPath(startSpaceId, goalSpaceId)`

**Only used in grid movement.** Builds the shortest path from startSpaceId to goalSpaceId and returns it as an array of spaces starting from the space _after_ the given space and ending on the goal space. Returns `false` if a path could not be found.

### myTrack.getSpacesWithinRange()

`myTrack.getSpacesWithinRange(originSpaceIndices, steps = 1, flatten = false, returnType = 'object', requirement = false)`

**Only used in grid movement.** Returns all spaces within distance `steps` from some given origin spaces. The `flat` return is an array with all spaces. The unflat return is an array with spaces keyed by their distance to the space, eg. `[['A'], ['B'], ['C', 'D']]` where 'A' is origin space, 'B' adjacent to 'A' and 'C' & 'D' two steps from 'A'. Note that the unflattened return can be used to get all spaces on a certain distance, eg. myTrack.getSpacesWithinRange(2)[2] contains all spaces 2 steps from the origin spaces.

`originSpaces`: The spaces to start the search from. An array of _indexes_ for these spaces, as used in myTrack.spaces.
`steps`: The range to search within. Origin spaces are on distance 0. Defaults to 1.
`flatten`: Whether to flatten the return array or not. Defaults to false.
`returnType`: How the returned spaces should be represented – 'object', 'id' or 'index', or a name of a property on the spaces. Defaults to 'object'.
`requirement`: Any requirement set here on the format {property:myProperty, value:requiredValue} will restrict the searched spaces. Defaults to false (no restriction).

### myTrack.getClosestSpace()

`myTrack.getClosestSpace(point, searchDistance = 1)`

Returns the space closest to a given point. The `point` argument is an object with (at least) coordinate values for the point to search from. The `searchDistance` tells how far from the point the search should go, in any direction. Smaller values increases the speed of the search. The function returns the Space object with coordinates closest to the given point. If more than one space is closest, one of these is selected randomly.

### myTrack.lineOfSight()

`myTrack.lineOfSight(spaceA, spaceB, points = false)`

Does an estimation of whether there is a line of sight between two spaces, returning `true` if there is a line and otherwise `false`. By default, center coordinates for the spaces are used. These can be overridden by the `points` argument, which should be on the form `[pointsA, pointsB]`, where each entry in itself is an array of points on the form `{x: 1, y: 3}` (or some other coordinates the track is using). PointsA should describe points within the origin space while pointsB describes points within the target space. If multiple points are provided, `lineOfSight` will check if _any combination_ of A and B points has a valid line of sight. Providing a lot of points can thus slow down execution.

This function requires that spaces have coordinates set with names matching `myTrack.coordinates`, and also the property `rOuter`.

See also `myTrack.pointHalfCircleDistribution()`.

### myTrack.pointHalfCircleDistribution()

`myTrack.pointHalfCircleDistribution(spaceA, spaceB, numberOfPoints = 5)`

Used for line of sight. Returns a number of points inside space A and B, distributed on a half circle.

The spaces must have the property `rInner`, describing the radius of circle that fits inside the space. The returned points are distributed on such a half-circle inside each space, and also rotated so the half circle is facing the other space. Only works in two dimensions.

`spaceA`: The first space (object) to create points within. Represents the origin for the line of sight.
`spaceB`: The second space (object) to create points within. Represents the target for the line of sight.
`numberOfPoints`: The number of points to plot on the half circle. At least 2, defaults to 5.

The return value is an array on the form `[pointsA, pointsB]`, where each entry in itself is an array of points on the form {x: 1, y: 3}, depending on names of track coordinates. The points can be fed to `myTrack.lineOfSight()`.

### mySpace.getAllPawns()

Returns an _array_ of all pawns (objects) at the space.

### mySpace.getSpacesWithinRange()

`mySpace.getSpacesWithinRange(steps = 1, flatten = false, returnType = 'object', requirement = false)`

**Only used in grid tracks.** Returns all spaces within distance `steps` from a space. The 'flat' return is an array with all spaces. The unflat return is an array with spaces keyed by their distance to the space, eg. `[['A'], ['B'], ['C', 'D']]` where 'A' is origin space, 'B' adjacent to 'A' and 'C' & 'D' two steps from 'A'. Note that the unflattened return can be used to get all spaces on a certain distance, eg. `getSpacesWithinRange(2)[2]` are all spaces 2 steps from the starting space. The `requirement` argument can be set to {property:myProperty, value:requiredValue} to restrict the searched spaces.

See also `mySpace.getMatchingSpacesWithinRange()` and `myTrack.getSpacesWithinRange()`.

The search distance is given by `steps`, defaulting to 1.
The `flatten` argument tells whether to flatten the return array or not. Defaults to false.
The `returnType` argument tells how the returned spaces should be represented: 'object' gives them as Space objects (default), 'id' gives them as IDs, and 'index'  gives the index numbers as used in `myTrack.spaces`. Can also be set to any property on the spaces to return the property values.

### mySpace.getMatchingSpacesWithinRange()

`mySpace.getMatchingSpacesWithinRange(property, value, steps = Number.POSITIVE_INFINITY, flatten = true, returnType = 'object')`

An alias for `mySpace.getSpacesWithinRange()` to make it easier to return all connected spaces with a certain property value. Note that the initial space is returned regardless of match.

See `mySpace.getSpacesWithinRange()` for a closer description.

`property`: The property on the space objects to put requirement on.
`value`: The value to match in the selected property.
`steps`: Any restriction on the distance. Defaults to infinity.
`flatten`: Whether to return a flat array or an array keyed by distance. Defaults to true (flat array).
`returnType`: How the returned spaces should be represented – 'object', 'id' or 'index', or a name of a property on the spaces. Defaults to 'object'.

### mySpace.resolve()

`mySpace.resolve(...arguments)`

Calls any resolver set for the space. Any arguments will be sent to the resolver. The space needs to have a the property `resolver` set and a corresponding method must be placed in `modules[module].resolvers`.

### myPawn.setSpace()

`myPawn.setSpace(spaceId)`

Sets the pawn on the given space and returns the space.

### myPawn.moveToStart()

Moves the pawn to its start space.

### myPawn.moveToEnd()

Moves the pawn to the last space of the track.

### myPawn.isAtStart()

Returns `true` if the pawn is on its start space, otherwise `false`.

### myPawn.isAtEnd()

`isAtEnd(pawnId)`

Returns `true` if the pawn is on the last space of the track, otherwise `false`.

### myPawn.move()

`myPawn.move(steps = 1)`

Moves the pawn a number of steps on the track and returns the resulting space. If there are more steps than spaces left, the pawn stops on the last space. Defaults to one step.

**For non-grid movements** steps can be both positive and negative. `myTrack.loop == true` causes the pawn to move from last to first space (and vice versa if moving backwards).

**For grid movement** only positive steps can be used. The pawn will follow the latest created path.

### myPawn.moveTowards()

`myPawn.moveTowards(goalSpaceId, steps = 1)`

**Only used in grid movement.** Moves the pawn a number of steps towards the given space. The closest path is created and stored at `myPawn.path`, if not already present. Returns the new space for the pawn.

### myPawn.resolve()

`myPawn.resolve(...arguments)`

Calls the resolver for the space where the pawn currently is, and returns the result. Any provided arguments are passed along.
