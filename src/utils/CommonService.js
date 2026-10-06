import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import base64 from 'react-native-base64';
import store from '../store/store';
import StaticConst from './StaticConst';
import { isProductOutOfStock } from './productAvailability';

export default CommonService = {
  citystore: null,

  serializeJSON: (data) => {
    return Object.keys(data).map(function (keyName) {
      return encodeURIComponent(keyName) + '=' + encodeURIComponent(data[keyName]);
    }).join('&');
  },

  _callApi: (args) => {
    let apiEndpoint = (args.hasOwnProperty('overwriteEndpoint') && args.overwriteEndpoint)
      ? args.api
      : (StaticConst.api.endpoint + args.api);

    const urlParams = [];
    let headers = new Headers({ 'Accept': 'application/json' });
    let axiosheaders = { 'Accept': 'application/json' };

    let sessionuser = store.getState().GlobalReducer.authuser;
    if (sessionuser) {
      headers = new Headers({
        'Accept': 'application/json',
        'loginkey': sessionuser.token
      });
      axiosheaders['loginkey'] = sessionuser.token;
    }

    urlParams.push('is_app=1');

    if (args.hasOwnProperty('urlParams') && Object.keys(args.urlParams).length > 0) {
      for (const ikey in args.urlParams)
        urlParams.push(ikey + '=' + args.urlParams[ikey]);
    }

    if (args.hasOwnProperty('readyUrlParams') && args.readyUrlParams) {
      apiEndpoint = apiEndpoint + '?' + args.readyUrlParams;
    } else {
      apiEndpoint = apiEndpoint + '?' + urlParams.join('&');
    }

    switch (args.method.toUpperCase()) {
      case 'POST':
        headers.append('Content-Type', 'application/json');
        return fetch(apiEndpoint, {
          method: args.method.toUpperCase(),
          headers: headers,
          body: args.body
        });
      case 'CONVERT':
        return fetch(apiEndpoint, {
          method: 'POST',
          headers: headers,
          body: args.body
        });
      case 'ABORTABLE':
        return fetch(apiEndpoint, {
          method: 'GET',
          headers: headers,
          signal: args.signal
        });
      case 'GET':
      default:
        if (args.hasOwnProperty('extendheader') && args.extendheader) {
          for (var xkey in args.extendheader)
            axiosheaders[xkey] = args.extendheader[xkey];
        }
        return axios.get(apiEndpoint, { headers: axiosheaders });
    }
  },

  axios_get: (args) => {
    let apiEndpoint = (args.hasOwnProperty('overwriteEndpoint') && args.overwriteEndpoint)
      ? args.api
      : (StaticConst.api.endpoint + args.api);
    const urlParams = [];
    let headers = new Headers({ 'Accept': 'application/json' });
    let sessionuser = store.getState().GlobalReducer.authuser;
    if (sessionuser) {
      headers = {
        'Accept': 'application/json',
        'loginkey': sessionuser.token
      };
    }
    urlParams.push('is_app=1');
    if (args.hasOwnProperty('urlParams') && Object.keys(args.urlParams).length > 0) {
      for (const ikey in args.urlParams)
        urlParams.push(ikey + '=' + args.urlParams[ikey]);
    }
    if (args.hasOwnProperty('readyUrlParams') && args.readyUrlParams) {
      apiEndpoint = apiEndpoint + '?' + args.readyUrlParams;
    } else {
      apiEndpoint = apiEndpoint + '?' + urlParams.join('&');
    }
    return axios.get(apiEndpoint, { headers: headers });
  },

  getGoogleLocationwithoutBound: (args) => {
    let apiEndpoint = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
    const urlParams = [];
    const headers = { 'Accept': 'application/json' };
    if (args.hasOwnProperty('urlParams') && Object.keys(args.urlParams).length > 0) {
      for (const ikey in args.urlParams)
        urlParams.push(ikey + '=' + args.urlParams[ikey]);
    }
    apiEndpoint = apiEndpoint + '?' + urlParams.join('&');
    return axios.get(apiEndpoint, { headers: headers, cancelToken: args.cancelToken });
  },

  getLatLngFromPlaceID: (args) => {
    const headers = { 'Accept': 'application/json' };
    return axios.get(
      'https://maps.googleapis.com/maps/api/place/details/json?placeid=' + args.placeid + '&key=' + args.key,
      { headers: headers }
    );
  },

  getAddressFromLatLng: (args) => {
    const headers = { 'Accept': 'application/json' };
    return axios.get(
      'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + args.lat + ',' + args.lng + '&key=' + args.key,
      { headers: headers, cancelToken: args.cancelToken }
    );
  },

  addToCart: (data) => {
    // Home/list APIs use qty as the available inventory count; zero means unavailable.
    if (isProductOutOfStock(data)) {
      store.dispatch({
        type: 'TOAST',
        payload: {
          show: true,
          title: 'Out of Stock',
          icon: 'warning-outline',
          iconcolor: '#ff0000',
          description: 'This item is currently not available.',
        },
      });
      return false;
    }

    let cart = store.getState().GlobalReducer.cart;
    if (cart && Array.isArray(cart.items)) {
      cart = Object.assign({}, JSON.parse(JSON.stringify(cart)));
      const cartkey = cart.items.map(o => Math.abs(o.product_id)).indexOf(Math.abs(data.product_id));
      if (cartkey > -1) {
        let cur_qty = cart.items[cartkey].cartqty;
        if (data.qty > cur_qty) {
          cart.items[cartkey].cartqty = (cart.items[cartkey].cartqty + 1);
        }
      } else {
        cart.items.push({
          product_id: data.product_id,
          product_name: data.product_name,
          price: data.product_sell_price,
          sell_price: data.product_sell_price,
          mrp: data.product_mrp,
          qty: data.qty,
          cartqty: 1,
          discount: data.discount,
          unit: data.unit,
          image: data.image,
          is_out_of_stock: data.is_out_of_stock,
          out_of_stock: data.out_of_stock,
          isOutOfStock: data.isOutOfStock,
          in_stock: data.in_stock,
          is_in_stock: data.is_in_stock,
          stock: data.stock,
          stock_quantity: data.stock_quantity,
          available_quantity: data.available_quantity,
          is_available: data.is_available,
          is_stock_available: data.is_stock_available,
          stock_status: data.stock_status,
          availability: data.availability,
          availability_status: data.availability_status,
          ...(data.is_package ? { is_package: data.is_package } : {}),
        });
      }
    } else {
      cart = { items: [] };
      cart.items.push({
        product_id: data.product_id,
        product_name: data.product_name,
        price: data.product_sell_price,
        sell_price: data.product_sell_price,
        mrp: data.product_mrp,
        qty: data.qty,
        cartqty: 1,
        discount: data.discount,
        unit: data.unit,
        image: data.image,
        is_out_of_stock: data.is_out_of_stock,
        out_of_stock: data.out_of_stock,
        isOutOfStock: data.isOutOfStock,
        in_stock: data.in_stock,
        is_in_stock: data.is_in_stock,
        stock: data.stock,
        stock_quantity: data.stock_quantity,
        available_quantity: data.available_quantity,
        is_available: data.is_available,
        is_stock_available: data.is_stock_available,
        stock_status: data.stock_status,
        availability: data.availability,
        availability_status: data.availability_status,
        ...(data.is_package ? { is_package: data.is_package } : {}),
      });
    }
    AsyncStorage.setItem(StaticConst.sessionkey.cart, base64.encode(JSON.stringify(cart)));
    store.dispatch({ type: 'SETCART', payload: cart });
    return true;
  },

  decreaseCart: (id) => {
    let cart = store.getState().GlobalReducer.cart;
    if (cart && Array.isArray(cart.items)) {
      cart = Object.assign({}, JSON.parse(JSON.stringify(cart)));
      const cartkey = cart.items.map(o => Math.abs(o.product_id)).indexOf(Math.abs(id));
      if (cartkey > -1) {
        if (cart.items[cartkey].cartqty > 1) {
          cart.items[cartkey].cartqty = cart.items[cartkey].cartqty - 1;
        } else {
          cart.items.splice(cartkey, 1);
        }
      }
      AsyncStorage.setItem(StaticConst.sessionkey.cart, base64.encode(JSON.stringify(cart)));
      store.dispatch({ type: 'SETCART', payload: cart });
    }
  },

  removeCart: (id) => {
    let cart = store.getState().GlobalReducer.cart;
    if (cart && Array.isArray(cart.items)) {
      cart = Object.assign({}, JSON.parse(JSON.stringify(cart)));
      const cartkey = cart.items.map(o => Math.abs(o.product_id)).indexOf(Math.abs(id));
      if (cartkey > -1) {
        cart.items.splice(cartkey, 1);
      }
    }
    AsyncStorage.setItem(StaticConst.sessionkey.cart, base64.encode(JSON.stringify(cart)));
    store.dispatch({ type: 'SETCART', payload: cart });
  },

  decreaseCart: (id) => {
    let cart = store.getState().GlobalReducer.cart;
    if (cart && Array.isArray(cart.items)) {
      cart = Object.assign({}, JSON.parse(JSON.stringify(cart)));
      const cartkey = cart.items.map(o => Math.abs(o.product_id)).indexOf(Math.abs(id));
      if (cartkey > -1) {
        if (cart.items[cartkey].cartqty > 1) {
          // Reduce by 1
          cart.items[cartkey].cartqty = cart.items[cartkey].cartqty - 1;
        } else {
          // qty will become 0 — remove from cart → ADD button comes back automatically
          cart.items.splice(cartkey, 1);
        }
      }
      AsyncStorage.setItem(StaticConst.sessionkey.cart, base64.encode(JSON.stringify(cart)));
      store.dispatch({ type: 'SETCART', payload: cart });
    }
  },

  removeCart: (id) => {
    let cart = store.getState().GlobalReducer.cart;
    if (cart && Array.isArray(cart.items)) {
      cart = Object.assign({}, JSON.parse(JSON.stringify(cart)));
      const cartkey = cart.items.map(o => Math.abs(o.product_id)).indexOf(Math.abs(id));
      if (cartkey > -1) {
        cart.items.splice(cartkey, 1);
      }
      AsyncStorage.setItem(StaticConst.sessionkey.cart, base64.encode(JSON.stringify(cart)));
      store.dispatch({ type: 'SETCART', payload: cart });
    }
  },

  clearCart: () => {
    let cart = { items: [] };
    AsyncStorage.setItem(StaticConst.sessionkey.cart, base64.encode(JSON.stringify(cart)));
    store.dispatch({ type: 'SETCART', payload: cart });
  },

  setCart: (cart) => {
    const nextCart = (cart && Array.isArray(cart.items)) ? cart : { items: [] };
    AsyncStorage.setItem(StaticConst.sessionkey.cart, base64.encode(JSON.stringify(nextCart)));
    store.dispatch({ type: 'SETCART', payload: nextCart });
  },

  IsAddedInCart: (id) => {
    let cart = store.getState().GlobalReducer.cart;
    if (cart && Array.isArray(cart.items)) {
      const cartkey = cart.items.map(o => Math.abs(o.product_id)).indexOf(Math.abs(id));
      return (cartkey > -1);
    }
    return false;
  },

  setCoupon: (value) => {
    let cart = store.getState().GlobalReducer.cart;
    cart['coupon'] = value;
    AsyncStorage.setItem(StaticConst.sessionkey.cart, base64.encode(JSON.stringify(cart)));
    store.dispatch({ type: 'SETCART', payload: cart });
  },

  setCartSlot: (value) => {
    let cart = store.getState().GlobalReducer.cart;
    cart['slot'] = value;
    AsyncStorage.setItem(StaticConst.sessionkey.cart, base64.encode(JSON.stringify(cart)));
    store.dispatch({ type: 'SETCART', payload: cart });
  },

  setPlaceOrderNotification: (id) => {
    const inputdata = new FormData();
    inputdata.append('order_id', id);
    CommonService._callApi({
      api: '/order/sendnotification',
      method: 'CONVERT',
      body: inputdata
    }).then(resp => {
      return resp.json();
    }).catch(error => {
      if (__DEV__) console.log('Notification send error:', error.message);
    });
  },

  saveLocalOrder: async (order) => {
    try {
      const existing = await AsyncStorage.getItem('@user_local_orders');
      let orders = existing ? JSON.parse(existing) : [];
      orders.unshift(order);
      await AsyncStorage.setItem('@user_local_orders', JSON.stringify(orders));
      console.log('LOCAL ORDER SAVED. Total:', orders.length);
    } catch (e) {
      console.log('Error saving local order:', e);
    }
  },

  getLocalOrders: async () => {
    try {
      const existing = await AsyncStorage.getItem('@user_local_orders');
      const orders = existing ? JSON.parse(existing) : [];
      console.log('GET LOCAL ORDERS - found:', orders.length);
      return orders;
    } catch (e) {
      console.log('getLocalOrders error:', e);
      return [];
    }
  },
};
