import {takeEvery, takeLatest, take, call, fork, put} from 'redux-saga/effects';
import * as actions from '../actions/users';
import * as api from '../api/users'

function* getUsers() {
    try{
      const result = yield call(api.getUsers)
    //   console.log(result)
    yield put(actions.getUsersSuccess({
        items: result.data.data
    }))
      
    } catch(e) {

    }
}

function* deleteUser({userId}) {
    try {
       yield call(api.deleteUser, userId)
       yield call(getUsers)
    } catch (e) {

    }
}
function* watchDeleteUserRequest() {
    while(true) {
       const action = yield take(actions.Types.DELETE_USER_REQUEST)
        yield call(deleteUser, {
            userId: action.payload.userId
        })
    }
}
function* watchGetusersRequest() {
    yield takeEvery(actions.Types.GET_USERS_REQUEST, getUsers);
}

function* createUser(action) {
    console.log(action)
 try {
     console.log(`In workder saga createUser Trying to create ${action.payload.firstName} ${action.payload.lastName}`)
      yield call(api.createUser, {
          firstName: action.payload.firstName,
          lastName: action.payload.lastName
      });
      yield call(getUsers)
 } catch (e) {
    console.log('There was an error '+ e)
 }
}

function* watchCreateUserRequest() {
    yield takeLatest(actions.Types.CREATE_USER_REQUEST, createUser)
}
const usersSagas = [
   fork(watchGetusersRequest),
   fork(watchCreateUserRequest),
   fork(watchDeleteUserRequest)
]

export default usersSagas;