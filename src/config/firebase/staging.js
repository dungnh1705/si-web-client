const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID
const apiKey = process.env.REACT_APP_FIREBASE_API_KEY

const firebaseConfig = {
  apiKey,
  authDomain: `${projectId}.firebaseapp.com`,
  projectId,
  storageBucket: `${projectId}.appspot.com`,
  messagingSenderId: '763173562319',
  appId: '1:763173562319:web:87e8aa2d4090ca60da54ba',
  measurementId: 'G-QJY7ERK69D'
}

export default firebaseConfig
