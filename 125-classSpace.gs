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
    track.spaces.push(this);
  }

  /**
   * Passes on work to any resolver function declared for the space,
   * along with any parameters. Spaces needs to have a the property 'resolver'
   * set and the spaceResolvers object needs to have a corresponding method.
   */
  resolve() {
    if (!this.resolver)
      return false;
    if (!spaceResolvers[module] || !spaceResolvers[module][this.resolver]) {
      log('Space resolver ' + this.resolver + ' does not exist in module ' + module + '.', 'error');
      return false;
    }

    spaceResolvers[module][this.resolver](...arguments);
  }
}
