import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import bodyParser from "body-parser";
import router from "./routes";
import db from "./db";


const app = express();

//express configuration for security, logging, cors, bodyparser, public folder
app.use(helmet());
app.use(morgan('tiny'));
app.use(
    cors({
        //
    })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "./public"));

//set global variable for base project path
declare global {
    var __basedir: string
};
global.__basedir = __dirname;

//db connection
try {
	(async function () {
		await db.authenticate();
	})();
	console.log('Connection has been established successfully.');
} catch (error) {
	console.error('Unable to connect to the database:', error);
}

//routes
app.use("/", router);
app.get("/", (req, res, next) => {
    try {
		res.json({
			status: 'success',
			message: 'Welcome 🙏',
		});
	} catch (err) {
		return next(err);
	}
});

app.listen(3000, () => {
    console.log("Server started successfully");
});

