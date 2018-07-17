import { createStore, applyMiddleware, combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import { AsyncStorage } from "react-native";
import ReduxThunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

// list reducers
import SystemDuck from "../ducks/SystemDuck";
import ListMarkerDuck from "../ducks/ListMarkerDuck";

const persistConfig = {
  key: "root",
  storage: AsyncStorage
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    system: SystemDuck,
    listMarker: ListMarkerDuck
  })
);

// list middlewares
const middlewares = [ReduxThunk];

// store redux
let store = null;
if (__DEV__) {
  store = createStore(
    persistedReducer,
    composeWithDevTools(applyMiddleware(...middlewares))
  );
} else {
  store = createStore(persistedReducer, applyMiddleware(...middlewares));
}

// persistor
const persistor = persistStore(store);

export default { store, persistor };
