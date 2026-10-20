export interface Member {
    id: string;
    name: string;
    profilePic?: string;
}

export interface Chat {
    id: string;
    chatType: string;
    memberDetails: Member[];
}

export interface Message {
    id: string;
    chatId: string;
    sender: {
        id: string;
        name: string;
        profilePic?: string;
    };
    senderModel: "User" | "Doctor";
    text: string;
    isDeleted: boolean;
    createdAt: string;
}