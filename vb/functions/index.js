const functions = require('firebase-functions')
var admin = require('firebase-admin')
var serviceAccount = require('./key.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: functions.config().admin.db_url // 'https://x-sujin.firebaseio.com'
})

const db = admin.database()

// 계정이 들어올때  / exports.createUser 라는 function 생성
exports.createUser = functions.auth.user().onCreate(async (user) => {
  const { uid, email, displayName, photoURL } = user
  const u = {
    email,
    displayName,
    photoURL,
    createdAt: new Date().getMilliseconds(),
    level: email === functions.functions.config().admin.email ? 0 : 5 // admin.email 이면 0, 아니면 5
  }
  db.ref('users').child(uid).set(u) // uid 키값 , u 데이터
})

// 계정이 지워질때
exports.deleteUser = functions.auth.user().onDelete(async (user) => {
  const {
    uid
  } = user
  db.ref('users').child(uid).remove() // uid 키값 , u 데이터

  // ...
})