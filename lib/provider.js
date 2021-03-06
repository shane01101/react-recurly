import React from 'react';
import PropTypes from 'prop-types';

export const RecurlyContext = React.createContext({ recurly: null });

const { Provider } = RecurlyContext;

/**
 * This is the top-level component for `react-recurly`, and must wrap any other
 * `react-recurly` component you will use. It is responsible for creating a `Recurly.js`
 * instance for any descendant components to interact with.
 *
 * This component accepts your `publicKey` as a prop.
 */
export default class RecurlyProvider extends React.Component {
  static propTypes = {
    /**
     * Your Recurly public key. See
     * [API Access](https://app.recurly.com/go/developer/api_access).
     */
    publicKey: PropTypes.string
  };

  static defaultProps = {
    publicKey: ''
  };

  constructor (props) {
    super(props);

    if (!this.props.publicKey) {
      throw new Error(`
        Please pass your 'publicKey' value to this RecurlyProvider.
        Example: <RecurlyProvider publicKey="MY_PUBLIC_KEY">
      `);
    }

    // TODO: ensure proper shape?
    if (!window.recurly || !window.recurly.Recurly) {
      throw new Error(`
        Please load Recurly.js (https://js.recurly.com/v4/recurly.js) on this page prior to
        loading your React application.
      `);
    }

    const { children, ...options } = this.props;
    this._recurly = fetchRecurlyInstance(options);
  }

  render() {
    return (
      <Provider value={{ recurly: this._recurly }}>{this.props.children}</Provider>
    )
  }
};

/**
 * Retrieves a recurly instance from a cache on the Recurly class, or creates one
 * if none found on the cache key. This is used when the Provider is being
 * regularly re-instantiated
 *
 * @param  {object} options instance instantiation options
 * @return {Recurly}
 */
function fetchRecurlyInstance (options) {
  let cache = window.recurly.Recurly.__instanceCache = window.recurly.Recurly.__instanceCache || {};
  const key = JSON.stringify(options);

  const recurly = cache[key] || new window.recurly.Recurly(options);
  cache[key] = recurly;

  return recurly;
}
