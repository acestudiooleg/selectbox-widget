import Controller from '@ember/controller';
import { computed } from '@ember/object';

/**
 * @param  {String[]} arr
 * @param  {RegExp} - pattern
 * @return {Promise} - Object wich keys divided by pattern
 * @example
 * devideByPattern(['car', 'bar', 'arrow', 'some', 'other'], /(ar)/) // {ar: ['car', 'bar', 'arrow']}
 */
const devideByPattern = (arr = [], pattern) => new Promise((resolve) => {
  const delayed = () => {
    const servers = {};
    arr.forEach(el => {
      const [_, serverName] = el.match(pattern) || [];
      if (serverName) {
        if(!(serverName in servers)) {
          servers[serverName] = [el];
        } else {
          servers[serverName].push(el);
        }
      }
    });
    resolve(servers);
  };
  setTimeout(delayed, 0);
});

/**
 * @prop {Object} selectedCategory
 * @prop {String} selectedCategory.name - category name
 * @prop {Object} selectedCategory.value - subcategories
 * @prop {Object} selectedSubCategory
 * @prop {String} selectedSubCategory.name - subcategory name
 * @prop {String[]} selectedSubCategory.value - URLs
 * @prop {Object} selectedServer
 * @prop {Object} selectedServer.name - server name
 * @prop {String[]} selectedServer.value - URLs
 * @prop {Object} selectedUrl
 * @prop {Object} selectedUrl.name - url
 * @prop {Object} selectedUrl.value - url
 * @prop {Object[]} categories - [{ name, value }]
 */
export default Controller.extend({
  init() {
    this._super(...arguments);
    this.set('selectedCategory', this.get('categories.0'));
  },
  selectedCategory: null,
  selectedSubCategory: null,
  selectedServer: null,
  selectedUrl: null,
  categories: computed('model', function () {
    const model = this.get('model');
    return this.get('convertToArray')(model);
  }),


  /**
   * convert object or array to next structure [{name, value}] - where name is key for object and name is value for array
   * @param  {Array|Object}
   * @return {Array}
   */
  convertToArray(data) {
    return (data instanceof Array) ?
      data.map(name => ({ name, value: name })) :
      Object.keys(data || {}).map(name => ({ name, value: data[name] }));
  },


  /**
   * divide urls by server name - example.com: ['http://example.com/1', 'http://example.com/2', ...]
   * @param  {String[]} - URLs
   * @return {[type]}
   */
  divideByServers(data) {
    this.set('isLoading', true);
    devideByPattern(data.value, new RegExp('://(.*?)/')).then((servers) => {
      this.set('servers', servers);
      this.set('isLoading', false);
    });
  },


  /**
   * @param {String} propName - property name of this controller
   * @param {*} value - any value will be set by propName
   */
  setProperty(propName){
    return (value) => {
      this.set(propName, value);
    }
  }
});
