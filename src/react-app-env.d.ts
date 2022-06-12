/// <reference types="react-scripts" />

namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_TWITCH_CLIENT_ID: string;
    REACT_APP_TWITCH_REDIRECT_URI: string;
    REACT_APP_BASEPATH: string;
    REACT_APP_LOG_LEVEL: string;
    REACT_APP_UMAMI_WEBSITE_ID: string;
    REACT_APP_UMAMI_SRC: string;
    REACT_APP_CLIP_PROVIDERS: string;
  }
}

declare module 'redux-persist-indexeddb-storage' {
  import { WebStorage } from 'redux-persist/es/types';

  const createStorage: (dbName: string) => WebStorage;
  export default createStorage;
}
