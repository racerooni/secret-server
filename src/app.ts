import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import {getSecretByHash, addSecret} from './secretfunctions';
import path from 'path'; 
import { v4 as uuidv4 } from 'uuid';

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/secret/:hash', async (req: Request, res: Response) => {
    const { hash } = req.params;
    try {
        await getSecretByHash(req, res);

    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/secret', async (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/secret', async (req: Request, res: Response) => {
    try {
        const uuid = uuidv4(); //random UUID generálása a titkositashoz
        const { secret, expireAfter, expireAfterViews } = req.body;
        await addSecret(req, res, uuid);
        res.status(200).send({msg: "Your secret has been added successfully", uuid: uuid});
    } catch (error) {
        res.status(500).send('There was an error while adding your secret!');
    }
});
  
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
