// export interface videoStreams {
//     uid: string;
//     userName: string;
//     profileImage: string 
// }

export class videoStreams {
    public uid: string;
    public userName: string;
    public profileImage: string;

    constructor(uid: string, name: string, imagePath: string) {
        this.uid = uid;
        this.userName = name;
        this.profileImage = imagePath;
    }
}