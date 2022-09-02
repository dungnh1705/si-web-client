const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID
const apiKey = process.env.REACT_APP_FIREBASE_API_KEY

const firebaseConfig = {
  apiKey,
  authDomain: `${projectId}.firebaseapp.com`,
  projectId,
  storageBucket: `${projectId}.appspot.com`,
  messagingSenderId: '1066108403713',
  appId: '1:1066108403713:web:d76a30e3ec02992d17c000',
  measurementId: 'G-3J8JXB6VVF'
}

export default firebaseConfig
