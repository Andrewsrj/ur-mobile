import { auth } from './FirebaseService';
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { getDatabase, ref, set, child, get } from "firebase/database";

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

    async getDataUser() {
        const dbRef = ref(getDatabase());
        const userId = this.getUser().uid;
        return get(child(dbRef, `users/${userId}`)).then((snapshot) => {
            if (snapshot.exists()) {
                return Promise.resolve(snapshot.val());
            } else {
                const data = {
                    bio: "Minha biografia",
                    university: "Minha universidade"
                }
                return Promise.resolve(data);
            }
        }).catch((error) => {
            return Promise.reject(error);
        });
    }

    async setDataUser(data) {
        const user = this.getUser()
        const defaultData = await this.getDataUser()
        const db = getDatabase();
        const statusPrm = true
        const errorPrm = null
        set(ref(db, `users/${user.uid}`), {
            bio: data.bio ? data.bio : defaultData.bio,
            university: data.university ? data.university : defaultData.university,
        });
        updateProfile(auth.currentUser, {
            displayName: data.displayName ? data.displayName : user.displayName,
            photoURL: data.photoURL ? data.photoURL : user.photoURL
        }).then()
            .catch((error) => {
                statusPrm = false;
                errorPrm = error;
                console.log(error)
            });
        if (statusPrm) {
            return Promise.resolve("success")
        }
        else {
            return Promise.reject(errorPrm)
        }
    }

}
const userService = new UserManager();
export default userService;