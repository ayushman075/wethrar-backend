import express from 'express'
import bodyParser from 'body-parser'
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser";
import connection from './db/connect.db.js';
import userRouter from './routes/user.route.js';
import './util/PeriodicWeatherFetch.util.js'
import weatherRouter from './routes/weather.route.js';
import thresholdRouter from './routes/threshold.route.js';


const app = express();

dotenv.config({
    path:'.env'
})

app.use(cors({
    origin:['http://localhost:5173'],
    credentials:true,   
    methods:["GET","POST","OPTIONS","UPDATE","DELETE"],
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}))


app.use(express.static("public"));
app.use(cookieParser());

app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

connection.then((resp)=>{
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
      })
}).catch(()=>{
    console.log("Error connecting to database !!");
})


  

app.use("/api/v1/user",userRouter);
app.use("/api/v1/weather",weatherRouter);
app.use("/api/v1/threshold",thresholdRouter);

app.get('/', (req, res) => {
    res.send('Welcome to Wethrar, on this line you are talking to Wethrar server !!');
});

