import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  init() {
    this._super(...arguments);
    this.set('selectedCategory', this.get('categories.0'));
  },
  selectedCategory: null,
  selectedSubCategory: null,
  categories: computed('model', function () {
    const model = this.get('model');
    return Object.keys(model || {}).map(key => ({ name: key, value: model[key] }));
  }),
  setProperty(propName) {
    return (value) => this.set(propName, value);
  }
});
