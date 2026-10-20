
interface documents {
    identity_verification: string;
    national_id_front: string;
    national_id_back: string;
}

export interface Doctor {
    id: string;
    name: string;
    phone: string;
    email: string;
    profilePic: string;
    documents: documents;
    city: string;
    specialization: string;
    status: string;
    createdAt: Date;
}