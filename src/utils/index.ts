
import bcrypt from 'bcrypt';

export const genUserName = ():string =>{

    const userPrefix = 'user-';
    const randomChars = Math.random().toString(36).slice(2);


    const userName = userPrefix + randomChars;

    return userName;
}

const SALT_ROUNDS = 12;

export const hashPassword = async(password:string) :Promise<string> =>{

    return await bcrypt.hash(password,SALT_ROUNDS);
}


export const comparePassword = async(password: string, hashedPassword: string) : Promise<boolean> =>{

    return await bcrypt.compare(password,hashedPassword);
}


export const genSlug = (title: string) : string =>{
    const slug = title
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-");


    const randomChars = Math.random().toString(36).slice(2);

    const uniqueSlug = `${slug}-${randomChars}`;

    return uniqueSlug
}