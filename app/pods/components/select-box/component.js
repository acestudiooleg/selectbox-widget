import Component from '@ember/component';
import { observer } from '@ember/object';
import { debounce } from '@ember/runloop';

const filterData = (arr = [], optionKey, criteria = '') => new Promise((s) => {
  const delayed = () =>
    s(arr.filter(el => new RegExp(criteria, 'gi').test(optionKey ? el[optionKey] : el)));
  setTimeout(delayed, 0);
});
const addTag = (arr = []) => arr.map((el, i) => Object.assign({}, el, {__id: i}));

const cutIfNeeded = (arr = [], len) => arr.length > len ? arr.slice(0, len) : arr;

export default Component.extend({
  classNames: ['select-box'],
  classNameBindings: ['isOpen:open'],
  isOpen: false,
  isLoading: false,
  debounceTime: 350,
  maxItemsToShow: 10,
  optionsLength: null,
  criteria: '',
  placeholder: 'Please select ...',
  didReceiveAttrs() {
    this._super(...arguments);
    const { options = [], maxItemsToShow } = this.getProperties('options', 'maxItemsToShow');
    this.set('optionsLength', options.length > maxItemsToShow ? options.length : null);
    const taggedOptions = addTag(cutIfNeeded(options, maxItemsToShow));
    this.set('taggedOptions', taggedOptions);
  },
  click() {
    return false;
  },
  filterOptions() {
    const { options, optionKey, criteria } = this.getProperties('options', 'optionKey', 'criteria');
    this.set('isLoading', true);
    filterData(options, optionKey, criteria).then((data) => {
      this.set('taggedOptions', addTag(cutIfNeeded(data)));
      this.set('isLoading', false);
    })
  },
  postKey: observer('criteria', function() {
    debounce(this, this.filterOptions, this.get('debounceTime'));
  }),
  actions: {
    open() {
      this.set('isOpen', true);
    },
    close() {
      this.set('isOpen', false);
    },
    select(option = {}) {
      const { onChange, actions } = this.getProperties('onChange', 'actions');
      onChange(option);
      actions.close.call(this);
    },
    loadAll(){
      this.set('isLoading', true);
      const options = this.get('options');
      (new Promise(resolve => setTimeout(() => resolve(addTag(options))), 0))
        .then((taggedOptions) => {
          this.set('taggedOptions', taggedOptions);
          this.set('isLoading', false);
        });

    }
  }
});
