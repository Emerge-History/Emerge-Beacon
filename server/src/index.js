import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import logger from 'morgan';
import cors from 'cors'
import routes from './routes';
import config from './config';

const app = express();

// use middlewares
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/admin', express.static(path.join(__dirname, 'public/admin')));
app.use(cors());

// routes 
app.use('/api', routes);

// error handlers
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    msg: err.message,
    err: err
  });
})

app.listen(config.port, () => {
    console.log('server running on port:' + config.port);
});