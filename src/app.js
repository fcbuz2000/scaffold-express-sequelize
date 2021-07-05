import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import telegramLogger from 'express-notify-telegram';
import indexRouter from './routes';

require('dotenv').config();

const app = express();
const server = createServer(app);
const uploadMaxSize = parseInt(process.env.UPLOAD_MAX_SIZE, 10) || 20;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('trust proxy', true);

app.use(helmet());
app.use(logger('dev'));
app.use(express.json({ limit: `${uploadMaxSize}mb` }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
  exposedHeaders: ['totalLength'],
  origin: process.env.CORS_ORIGIN || '*',
}));
app.use('/storage', express.static(path.join('storage')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.get('/robots.txt', (req, res) => res.sendFile(path.join(__dirname, 'robots.txt')));

// Notify telegram
if (process.env.TELEGRAM_LOG === 'true') {
  app.use(telegramLogger({
    botToken: process.env.BOT_TOKEN,
    chatId: process.env.CHANNEL_ID,
  }));
}

indexRouter(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export { app as default, server };
