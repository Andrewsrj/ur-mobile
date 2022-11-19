import boy1 from '../assets/avatar/boy_1.png'
import girl1 from '../assets/avatar/girl_1.png'
import hacker from '../assets/avatar/hacker.png'
import man1 from '../assets/avatar/man_1.png'
import man2 from '../assets/avatar/man_2.png'
import user from '../assets/avatar/user.png'
import woman1 from '../assets/avatar/woman_1.png'
import woman2 from '../assets/avatar/woman_2.png'

class Avatar {
    getAvatar(name) {
        switch(name) {
            case 'boy_1':
                return boy1;
            case 'girl_1':
                return girl1;
            case 'hacker':
                return hacker;
            case 'man_1':
                return man1;
            case 'man_2':
                return man2;
            case 'user':
                return user;
            case 'woman_1':
                return woman1;
            case 'woman_2':
                return woman2;
            default:
                return user;
        }
    }
}

const avatar = new Avatar();
export default avatar;