import Controller from '@ember/controller';
import { computed } from '@ember/object';

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

export default Controller.extend({
  init() {
    this._super(...arguments);
    this.set('selectedCategory', this.get('categories.0'));
  },
  selectedCategory: null,
  selectedSubCategory: null,
  categories: computed('model', function () {
    const model = this.get('model');
    return this.get('convertToArray')(model);
  }),
  convertToArray(data) {
    return (data instanceof Array) ?
      data.map(name => ({ name, value: name })) :
      Object.keys(data || {}).map(name => ({ name, value: data[name] }));
  },
  divideByServers(data) {
    this.set('isLoading', true);
    devideByPattern(data.value, new RegExp('://(.*?)/')).then((servers) => {
      this.set('servers', servers);
      this.set('isLoading', false);
    });

  },
  setProperty(propName){
    return (value) => {
      this.set(propName, value);
    }
  }
});
