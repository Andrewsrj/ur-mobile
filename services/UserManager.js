import { auth } from './FirebaseService';
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';

class UserManager {


    async recovery(email) {
        // Send a Request with Email to Firebase
        return sendPasswordResetEmail(auth, email)
        .then(() => {
            // Success
            const msgSuccessful = {
                title: "Sucesso",
                msg: "Um link com redefinição de senha foi enviado para seu E-mail (Verifique a caixa de SPAM)"
            }
            return Promise.resolve(msgSuccessful);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
    }

    async sign(data) {
        // Send a Request with Email and Password to Firebase
        return signInWithEmailAndPassword(auth, data.email, data.password)
        .then((userCredential) => {
            // Success
            return Promise.resolve(userCredential);
        })
        .catch(error => {
            return Promise.reject(error);
        })

    }

    async signup(data) {
        // Send a Request with Email and Password to Create a new user
        return createUserWithEmailAndPassword(auth, data.email, data.password)
        .then(() => {
            // User auth
            // Update User name and photo in Firebase
            updateProfile(auth.currentUser, {
                displayName: data.name,
                photoURL: 'user'
            }).then()
            .catch((error) => {
                console.log(error)
            });
            
            return Promise.resolve(data.name)
        })
        .catch((error) => {
            // Error handling...
            console.log(error)
            return Promise.reject(error);
        });
    }

    async signout() {
        return signOut(auth).then(() => {
            // Sign-out successful.
            return Promise.resolve();
        
        }).catch((error) => {
            // An error happened.
            return Promise.reject(error);
        });
    }

    getUser() {
        // Get Auth User Data
        const user = auth.currentUser;
        return user;
    }
}

const userService = new UserManager();
export default userService;