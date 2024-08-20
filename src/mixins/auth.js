import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, setPersistence, browserLocalPersistence  } from "firebase/auth";
import validator from 'validator';
import KJUR, { b64utoutf8 } from 'jsrsasign';

export default {
  data() {
      return {
        app: null,
        secretKey: null,
        st_response_json: {
          status: 'error',
          err_description: ''
        }
      }
  },

  async created() {
    this.app = initializeApp(
      this.$store.getters.firebaseConfig
    );

    this.secretKey = this.$store.getters.secretKey;

    const auth = getAuth();
    await setPersistence(auth, browserLocalPersistence);
  }, 

  methods: {
    isEmail(email) {
      return validator.isEmail(email);
    },

    validateProcess(email, fields) {
      const validFields = fields.map(field => {
        const [ key ] = Object.keys(field);
        const characters = key == 'password' ? 8 : 0;
        const ext = field[key].replaceAll(' ', '').length >= characters;
        return ext;
      });

      return this.isEmail(email) && !validFields.includes(false);
    },

    ifUserAuth() {
      const token = localStorage.getItem('token');
      if (token !== null) {
        const data = this.decodeToken(token);
        if (data !== null) {
          return data;
        }
      }

      return null;
    },

    logoutProcess() {
      localStorage.clear();
      this.$store.commit('updateUserState', null);
      return;
    },

    encodeUserData(data) {
      const header = {
        alg: 'HS256', 
        typ: 'JWT'
      };

      const token = KJUR.jws.JWS.sign('HS256', JSON.stringify(header), JSON.stringify(data), this.secretKey);
      return token
    },

    decodeToken(token) {
      const decodedHeader = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(token.split('.')[0]));
      const decodedPayload = KJUR.jws.JWS.readSafeJSONString(b64utoutf8(token.split('.')[1]));

      const isValid = KJUR.jws.JWS.verify(token, this.secretKey, [decodedHeader.alg]);

      if (!isValid) {
          console.error('Invalid token!');
          return null;
      }
      
      return decodedPayload;
    },

    async createUserProcess(email, password) {
      let response_json = { ...this.st_response_json };

      try {
        const auth = getAuth();
        const request = await createUserWithEmailAndPassword(auth, email, password);
        const user = request.user;

        response_json.status = 'success';
        response_json.user = user;

        const token = this.encodeUserData(user);
        localStorage.setItem('token', token);

      } catch (e) {
        const e_message = e.message;
        console.error(e_message);
        response_json.err_description = this.requestExceptions(e_message);
      }

      return response_json;
    },

    async signInUserProcess(email, password) {
      let response_json = { ...this.st_response_json };

      try {
        const auth = getAuth();
        const request = await signInWithEmailAndPassword(auth, email, password);
        const user = request.user;

        response_json.status = 'success';
        response_json.user = user;

        const token = this.encodeUserData(user);
        localStorage.setItem('token', token);

      } catch (e) {
        const e_message = e.message;
        console.error(e_message);
        response_json.err_description = this.requestExceptions(e_message);
      }

      return response_json;
    },

    async updateUserProcess(user) {
      let response_json = { ...this.st_response_json };

      try {
        const auth = getAuth();
        const request = await updateProfile(auth.currentUser, {
          displayName: user.displayName
        });

        response_json.status = 'success';
        response_json.user = user;

        const token = this.encodeUserData(user);
        localStorage.setItem('token', token);

      } catch (e) {
        const e_message = e.message;
        console.error(e_message);
        response_json.err_description = this.requestExceptions(e_message);
      }

      return response_json;
    },

    requestExceptions(message) {
      switch (true) {
        case message.includes('Firebase: Error (auth/email-already-in-use).'):
          message = 'User already exists!';
          break

        case message.includes('Firebase: Error (auth/user-not-found).'):
          message = 'User not found!';
          break

        case message.includes('Firebase: Error (auth/wrong-password).'):
          message = 'Invalid password!';
          break;

        default:
          message = message;
          break
      }

      return message;
    }
  }
}