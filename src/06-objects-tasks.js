/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea: () => width * height,
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const result = JSON.parse(json);
  Object.setPrototypeOf(result, proto);
  return result;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {

  elementStore: '',

  idStore: '',

  classStore: '',

  attrStore: '',

  pseudoClassStore: '',

  pseudoElementStore: '',

  element(value) {
    if (this.elementStore) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    if (this.idStore
      || this.classStore || this.attrStore || this.pseudoClassStore || this.pseudoElementStore) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    const newBuilder = {
      ...this,
    };
    newBuilder.elementStore = value;
    return newBuilder;
  },

  id(value) {
    if (this.idStore) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    if (this.classStore || this.attrStore || this.pseudoClassStore || this.pseudoElementStore) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    const newBuilder = {
      ...this,
    };
    newBuilder.idStore = `#${value}`;
    return newBuilder;
  },

  class(value) {
    if (this.attrStore || this.pseudoClassStore || this.pseudoElementStore) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    const newBuilder = {
      ...this,
    };
    newBuilder.classStore += `.${value}`;
    return newBuilder;
  },

  attr(value) {
    if (this.pseudoClassStore || this.pseudoElementStore) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    const newBuilder = {
      ...this,
    };
    newBuilder.attrStore += `[${value}]`;
    return newBuilder;
  },

  pseudoClass(value) {
    if (this.pseudoElementStore) {
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    const newBuilder = {
      ...this,
    };
    newBuilder.pseudoClassStore += `:${value}`;
    return newBuilder;
  },

  pseudoElement(value) {
    if (this.pseudoElementStore) {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    const newBuilder = {
      ...this,
    };
    newBuilder.pseudoElementStore = `::${value}`;
    return newBuilder;
  },

  stringify() {
    const newBuilder = {
      ...this,
    };
    const result = newBuilder.combinedStorage || `${newBuilder.elementStore}${newBuilder.idStore}${newBuilder.classStore}${newBuilder.attrStore}${newBuilder.pseudoClassStore}${newBuilder.pseudoElementStore}`;
    return result;
  },

  combine(selector1, combinator, selector2) {
    const newBuilder = {
      ...this,
    };
    newBuilder.combinedStorage = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    return newBuilder;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
