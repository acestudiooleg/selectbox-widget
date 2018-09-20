import Component from '@ember/component';
import { observer } from '@ember/object';
import { debounce } from '@ember/runloop';

/**
 * Filter array by regular expression
 * @param  {Array} arr - options
 * @param  {String} optionKey - key of object which located in array
 * @param  {String} criteria - filter word (search)
 * @return {Promise}
 */
const filterData = (arr = [], optionKey, criteria = '') => new Promise((s) => {
  const delayed = () =>
    s(arr.filter(el => new RegExp(criteria, 'gi').test(optionKey ? el[optionKey] : el)));
  setTimeout(delayed, 0);
});


/**
 * Wrap each element by numeric __id property
 * @param  {Array} arr - options
 * @return {Array}
 */
const addTag = (arr = []) => arr.map((el, i) => Object.assign({}, el, {__id: i}));


/**
 * @module Components/SelectBox
 * Cut array by length
 * @param  {Array} arr - options
 * @param  {Number} len - length of items which needs to left
 * @return {Array}
 */
const cutIfNeeded = (arr = [], len) => arr.length > len ? arr.slice(0, len) : arr;

/**
 * @module Components/SelectBox
 * @param {Boolean} isOpen - show dropdown list
 * @param {Boolean} isLoading - Show spinner in dropdown list
 * @param {Number} debounceTime - time between typing filter filed and reaction
 * @param {Number} maxItemsToShow - length of items which need to show and other items remove from array
 * @param {Number} optionsLength - length of list
 * @param {String} criteria - filter word (search)
 * @param {String} placeholder - Label for selectbox
 */
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
    this.tagAndCutOptions();
  },


  /**
   * Cut drop down list by "maxItemsToShow" and added numeric __id for each object
   */
  tagAndCutOptions(){
    const { options = [], maxItemsToShow } = this.getProperties('options', 'maxItemsToShow');
    this.set('optionsLength', options.length > maxItemsToShow ? options.length : null);
    const taggedOptions = addTag(cutIfNeeded(options, maxItemsToShow));
    this.set('taggedOptions', taggedOptions);
  },


  /**
   * Prevent propagation
   * @return {Boolean}
   */
  click() {
    return false;
  },


  /**
   * filter options by search word
   */
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


    /**
     * Show dropdown list
     */
    open() {
      this.set('isOpen', true);
    },


    /**
     * Hide dropdown list
     */
    close() {
      this.set('isOpen', false);
    },


    /**
     * Call parent function and pass selected option and closing dropdown list
     * @param  {Object} option - selected item
     */
    select(option = {}) {
      const { onChange, actions } = this.getProperties('onChange', 'actions');
      onChange(option);
      actions.close.call(this);
    },


    /**
     * Render all huge list to drop down list
     */
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
