# The Track, Space and Pawn classes

The `Track` class in the Bot Playtesting Toolkit is used for moving pawns on simple tracks or complex networks of nodes – both called tracks in the toolkit. The track is built of objects of the class `Space`, which may have properties of their own.

The most prominent functionality of tracks is moving pawns either in a simple way (on one-dimensional tracks) or on the shortest path to a given space – the latter including finding the shortest path.

Spaces, like cards, can have _resolvers_. These are functions called to execute some special effects of spaces. The name of the function to call is set at `space.resolver` and is called either through `mySpace.resolve(...arguments)` or `myTrack.resolve(pawnId)`.

## Creating tracks and spaces

Tracks and spaces are normally created in the module's `buildInitialData` function by populating the `gameStateSeed.tracks` array. The array should be populated by objects on the following form:

    {
      track: trackData,
      spaces: spaceDataArray,
    }

The track data is often so small that it can be built by hand in the code, while the spaces data usually is built from data in the spreadsheet. This is particularly the case if the track is a game board with many spaces. See example below.

![Screen shot with data in a spreadsheet describing spaces.](https://user-images.githubusercontent.com/262940/149407875-18fa1343-9683-4d26-9387-44066c2ccc7d.png)

    let spaceDataArray = buildObjectArrayFromRows('mySheet', 'L2:O63');
    let trackData = {
      id: 'board',
      gridMovement: true
      symmetricConnections: true
    };

    gameStateSeed.tracks = [];
    gameStateSeed.tracks.push({
      track: trackData,
      spaces: spaceDataArray,
    });

Data stored in `gameStateSeed.tracks` will automatically be used to create Track and Space objects before each game iteration. The tracks will be stored under `gameState.tracks[trackId]`. Spaces are stored as an array at `gameState.tracks[trackId].spaces`.

Tracks and spaces can also be created from other places in the code by the statement `myTrack = new Track(trackData, spaceData)` and `mySpace = myTrack.constructSpace(spaceData)`. If new spaces are added to an existing track which uses grid movement, the grid for possible moves must be recalculated by calling `myTrack.buildGraph()`.

## Special properties

As with other objects, properties can be added as needed. Some properties have special meaning.

### Track properties

Tracks must have the property `id` set. If the id matches the id of an agent, the track is assumed to belong to that agent is added to agent.track. (It is also available at gameState.tracks[trackId].)

If the property `assumePresent` is set to `true`, pawns will be assumed to start on the first space (with index 0). If not, pawns will have to be added using one of the functions for placing pawns on spaces. Defaults to `true`.

The property `startSpaceId` can be set to tell the track where pawns should start. If not set, the starting space is assumed to be the first space (with index 0).

If the property `loop` is set to `true`, pawns will loop from the last space to the first (and vice versa) when moving past the track edges. (If not, the pawn will stop at the last/first space.) This is only relevant for movement on tracks without grid movement. Defaults to `false`.

If the property `gridMovement` is set to `true`, the track will not be treated as a one-dimensional track. Instead information on the spaces will be used to determine how pawns may move between spaces. Defaults to `false`.

If the property `symmetricConnections` is set to `true`, any connections between spaces are assumed to go both ways. This will reduce how much data needed for building the track/space information. The setting is only relevant for tracks using grid movement. Defaults to `true`.

`myTrack.spaces` contains an array of all spaces on the track.

`myTrack.spaceMapping` contains a mapping from space ID to the index number for the space.

`myTrack.pawnIndices` contains information about which space each pawn is placed on. The data is on the form `{pawnId: spaceIndex, ...}`.

`myTrack.pawnPaths` contains information about the which path each pawn is moving according to. The data is on the form `{pawnId: [spaceObject1, spaceObject2, ...], ...}`. The included spaces represent the planned future steps for the pawn – neither the current space nor already passed spaces are included. The property is only present on tracks using grid movement.

`myTrack.grid` and `myTrack.heuristic` contains computed information about connections between spaces. Unless you know what you're doing you want to leave these untouched. They are only present on tracks using grid movement.

### Space properties

Spaces must have the property `id` set.

The property `connectsTo` is used in tracks with grid movement. The value/values should be IDs of spaces to which the space connect. (If `myTrack.symmetricConnections` is `true`, connections only have to be set on one of the connecting spaces.) Multiple values are added as arrays, denoted by [brackets].

The property `resolver` can be set to any name of a function stored at `modules[module].resolvers.spaces`. Calling `mySpace.resolve(...arguments)` will send off the request to the resolver function of the space and return the result. If the space has no resolver, `false` is returned.

## Functions available for tracks and spaces

### myTrack.constructSpace()

`myTrack.constructSpace(spaceData)`

This function creates a new space on the track and returns the result.

### myTrack.getPawnIndex()

`myTrack.getPawnIndex(pawnId)`

This function returns the index for the space where the named pawn currently is. If the pawn is not on the track, it is placed on the starting space if `myTrack.assumePresent == true`. Otherwise -1 is returned.

### myTrack.getPawnSpace()

`myTrack.getPawnSpace(pawnId)``

Returns the space object for the given pawn. If the pawn is not on a space, and should not be automatically placed on the start space, `false` is returned and an error message is logged.

### myTrack.setPawnSpace()

`myTrack.setPawnSpace(pawnId, spaceId)`

Places a the given pawn on the given space and returns the space. The pawn is added to the track if it was not already present.

### myTrack.movePawnToStart()

`myTrack.movePawnToStart(pawnId)`

Places the given pawn on the start space, defaulting to the first space added to the track.

### myTrack.movePawnToEnd()

`myTrack.movePawnToEnd(pawnId)`

Places the given pawn on the last space for the track.

### myTrack.movePawn()

`movePawn(pawnId, steps = 1)`

Moves the pawn a number of steps on the track and returns the resulting space. If there are more steps than spaces left, the pawn stops on the last space. Defaults to one step.

**For non-grid movements** steps can be both positive and negative. `myTrack.loop == true` causes the pawn to move from last to first space (and vice versa if moving backwards).

**For grid movement** only positive steps can be used. The pawn will follow the latest created path.

### myTrack.isAtStart()

`isAtStart(pawnId)`

Returns `true` if the given pawn is on the start space (defaulting to the first added space), otherwise `false`.

### myTrack.isAtEnd()

`isAtEnd(pawnId)`

Returns `true` if the given pawn is on the last space of the track, otherwise `false`.

### myTrack.getSpace()

`myTrack.getSpace(property, value)`

Returns the first space matching the given property:value, or `false` if none is found. Multiple property:value pairs can be required by providing arrays with values.

### myTrack.getSpaceIndex()

`myTrack.getSpaceIndex(property, value)`

Returns the track index for the first space matching the given property:value, or `false` if none is found. (Multiple property:value pairs are not supported.)

### myTrack.getPawnsAtIndex()

`myTrack.getPawnsAtIndex(index)`

Returns an array of all pawn IDs at a given track index.

### myTrack.moveToSpace()

`myTrack.moveToSpace(pawnId, property, value)`

Moves a pawn to the first space matching property:value. Adds the pawn to the track if not already present. (Multiple property:value pairs are not supported.)

### myTrack.moveTowards()

`myTrack.moveTowards(pawnId, goalSpaceId, steps = 1)`

**Only used in grid movement.** Moves the pawn a number of steps towards the given space. The closest path is created and stored at `myTrack.pawnPaths[pawnId]`, if not already present. Returns the new space for the pawn.

### myTrack.buildPath()

`myTrack.buildPath(pawnId, goalSpaceId)`

**Only used in grid movement.** Builds the shortest path from the pawn to the given space and stores it at `myTrack.pawnPaths[pawnId]`. Returns `true` if the path could be built, otherwise `false`. The path path is only updated if the path could be built – otherwise it is left untouched.

### myTrack.buildGraph()

**Only used in grid movement.** This function builds `myTrack.graph` and `myTrack.heuristic`, used for finding paths between spaces on a track using grid movement. It is called automatically when the track is created (if is uses grid movement) and should be used only if connections between spaces are changed.

### myTrack.resolve()

`myTrack.resolve(pawnId, ...arguments)`

Calls any resolver set for the pawn's space. Any arguments after the pawn ID will be sent to the resolver. The space needs to have a the property `resolver` set and a corresponding method must be placed in `modules[module].resolvers.spaces`. Note that resolver also can be called from `mySpace.resolve()`.

### mySpace.resolve()

`mySpace.resolve(...arguments)`

Calls any resolver set for the space. Any arguments will be sent to the resolver. The space needs to have a the property `resolver` set and a corresponding method must be placed in `modules[module].resolvers.spaces`.
