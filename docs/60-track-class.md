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

### myTrack.buildPath()

`myTrack.buildPath(startSpaceId, goalSpaceId)`

**Only used in grid movement.** Builds the shortest path from startSpaceId to goalSpaceId and returns it as an array of spaces starting from the space _after_ the given space and ending on the goal space. Returns `false` if a path could not be found.

### mySpace.getAllPawns()

Returns an _array_ of all pawns (objects) at the space.

### mySpace.resolve()

`mySpace.resolve(...arguments)`

Calls any resolver set for the space. Any arguments will be sent to the resolver. The space needs to have a the property `resolver` set and a corresponding method must be placed in `modules[module].resolvers.spaces`.

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
