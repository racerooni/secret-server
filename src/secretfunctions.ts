import { Request, Response } from 'express';
import { buildXML } from './xmlbuilder';
import { findSecret, saveSecret, decrementViews } from './secret-model';


export const getSecretByHash = async (req: Request, res: Response) => { 
    const { hash } = req.params; // hash kinyerese a request parametereibol

    try {
        const secret = await findSecret(hash); //secret valtozoba eltaroljuk az adatbazisbol lekert adatokat

        if (!secret) {
            return res.status(404).json({ message: 'This secret doesnt exit or might have already expired, or has been viewed too many times' });
        }

        const headerAccept = req.headers.accept;
        if (headerAccept === 'application/xml') { // Ha az accept header XML akkor felepitjuk xml formatumba es azt adjuk vissza
            const xml = buildXML(secret);
            res.type('application/xml').send(xml);
        } else {
            res.json(secret);
        }

        await decrementViews(hash); //meghivjuk minden hash megtekintesnel a decrementViews funkciok mely csokkenti a hátralévő megtekintések számát
        
        return secret; 
    } catch (err) {
        console.error('error fetching the data:', err);
    }
};

export const addSecret = async (req: Request, res: Response,  uuid: string) =>{
    const {secret, expireAfter, expireAfterViews} = req.body;
    const id = uuid;
    console.log(uuid, secret, expireAfter, expireAfterViews)
    try{
        await saveSecret(id, secret, expireAfter, expireAfterViews);
    } catch (err) {
        console.error(err);
    }
    
}