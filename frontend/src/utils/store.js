import { createStore } from 'redux';

const updateItems = (items) => ({
  type: 'UPDATE_ITEMS',
  payload: items,
});

const itemsReducer = (state = [], action) => {
  switch (action.type) {
    case 'UPDATE_ITEMS':
      return action.payload;
    default:
      return state;
  }
};


const store = createStore(itemsReducer);

export { store, updateItems };
