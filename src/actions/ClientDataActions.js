import firebase from 'firebase/app';
import 'firebase/firestore';
import {
  ON_REGISTER_VALUE_CHANGE,
  ON_REGISTER,
  ON_REGISTER_SUCCESS,
  ON_REGISTER_FAIL,
  ON_USER_READING,
  ON_USER_READ,
  ON_USER_UPDATING,
  ON_USER_UPDATED,
  ON_USER_UPDATE_FAIL,
  ON_USER_READ_FAIL
} from './types';

export const onRegisterValueChange = ({ prop, value }) => {
  return { type: ON_REGISTER_VALUE_CHANGE, payload: { prop, value } };
};

export const onRegister = ({ email, password, firstName, lastName, phone }) => {
  return dispatch => {
    dispatch({ type: ON_REGISTER });

    const db = firebase.firestore();

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        db.collection('Profiles')
          .doc(user.user.uid)
          .set({
            firstName,
            lastName,
            email,
            phone,
            commerceId: null,
            softDelete: null
          })
          .then(() => dispatch({ type: ON_REGISTER_SUCCESS, payload: user }))
          .catch(error =>
            dispatch({ type: ON_REGISTER_FAIL, payload: error.message })
          );
      })
      .catch(error =>
        dispatch({ type: ON_REGISTER_FAIL, payload: error.message })
      );
  };
};

export const onUserRead = loadingType => {
  const { currentUser } = firebase.auth();
  var db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_USER_READING, payload: loadingType });

    db.doc(`Profiles/${currentUser.uid}`)
      .get()
      .then(doc => dispatch({ type: ON_USER_READ, payload: doc.data() }))
      .catch(error => {
        dispatch({ type: ON_USER_READ_FAIL });
        console.log(error);
      });
  };
};

export const onUserUpdateNoPicture = ({
  firstName,
  lastName,
  phone,
  profilePicture
}) => {
  // en esta funcion, profilePicture es una URL

  const { currentUser } = firebase.auth();
  var db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_USER_UPDATING });

    db.doc(`Profiles/${currentUser.uid}`)
      .update({ firstName, lastName, phone, profilePicture })
      .then(dispatch({ type: ON_USER_UPDATED, payload: profilePicture }))
      .catch(error => {
        dispatch({ type: ON_USER_UPDATE_FAIL });
        console.log(error);
      });
  };
};

export const onUserUpdateWithPicture = ({
  firstName,
  lastName,
  phone,
  profilePicture
}) => {
  // en esta funcion, profilePicture es un BLOB

  const { currentUser } = firebase.auth();
  var ref = firebase
    .storage()
    .ref(`Users/${currentUser.uid}`)
    .child(`${currentUser.uid}-ProfilePicture`);
  var db = firebase.firestore();

  return dispatch => {
    dispatch({ type: ON_USER_UPDATING });

    ref
      .put(profilePicture)
      .then(snapshot => {
        profilePicture.close();
        snapshot.ref
          .getDownloadURL()
          .then(url => {
            db.doc(`Profiles/${currentUser.uid}`)
              .update({ firstName, lastName, phone, profilePicture: url })
              .then(dispatch({ type: ON_USER_UPDATED, payload: url }))
              .catch(error => {
                dispatch({ type: ON_USER_UPDATE_FAIL });
                console.log(error);
              });
          })
          .catch(error => {
            dispatch({ type: ON_USER_UPDATE_FAIL });
            console.log(error);
          });
      })
      .catch(error => {
        profilePicture.close();
        dispatch({ type: ON_USER_UPDATE_FAIL });
        console.log(error);
      });
  };
};
