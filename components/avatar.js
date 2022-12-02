
class Avatar {
    constructor(avatars) {
        this.avatars = avatars ? avatars : {
            boy1: require('../assets/avatar/boy_1.png'),
            girl1: require('../assets/avatar/girl_1.png'),
            hacker: require('../assets/avatar/hacker.png'),
            man1: require('../assets/avatar/man_1.png'),
            man2: require('../assets/avatar/man_2.png'),
            user: require('../assets/avatar/user.png'),
            woman1: require('../assets/avatar/woman_1.png'),
            woman2: require('../assets/avatar/woman_2.png'),
        }
    }
    getAvatar(name) {
        if (this.avatars[name]) {
            return this.avatars[name]
        }
        else {
            return this.avatars["user"]
        }
    }

    getAvatarsLength() {
        return Object.keys(this.avatars).length
    }

    getAvatarByKey(key) {
        key = Number(key)
        var keys = Object.keys(this.avatars);
        return this.avatars[keys[key]] ? this.avatars[keys[key]] : this.avatars["user"]
    }
    getAvatarNameByKey(key) {
        key = Number(key)
        var keys = Object.keys(this.avatars);
        for (i in keys) {
            if (key == Number(i)) {
                return String(keys[i])
            }
        }
    }
    getKeyAvatarByName(name) {
        var key = 0;
        var keys = Object.keys(this.avatars);
        for (key; key < keys.length; key++) {
            if (this.avatars[name] == this.avatars[keys[key]]) {
                return key
            }
        }
        return 5;
    }
}

const avatar = new Avatar();
export default avatar;