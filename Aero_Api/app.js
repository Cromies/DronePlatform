const PORT              = 3000;
const fs                = require('fs');
const https             = require('https');
const express           = require('express');
const mysql             = require('mysql');
const morgan            = require('morgan');
const bodyParser        = require('body-parser');
const cors              = require('cors');
const PythonShell       = require('python-shell');
const spawn             = require("child_process").spawn;
const sse               = require('./sse');
const success           = fs.readFileSync('./util/html/index.html', 'utf8');


const certificate       = fs.readFileSync('cert.pem','utf8');
const privateKey        = fs.readFileSync('key.pem', 'utf8');
const cred              = {key: privateKey, cert: certificate, passphrase:'yourpass', rejectUnauthorized: false};
const app               = express();

cred.agent = new https.Agent(cred);

//Enabling Cors
const corsOption = {
    origin: true,
    methods: 'GET, HEAD, PUT, POST, DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token']
};


app.use(cors(corsOption));
// Establishing body-parser for Post retrieval from API
app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());
app.use(sse);

/* -- DATABASE CONFIGURATION -- */
// Create connection

const pool = mysql.createPool({
    connectionLimit: 100,
    host: '167.99.233.46',
    user: 'root',
    password: 'AER0DEV1',
    database: 'TESTDB'
})

const pool2 = mysql.createPool({
    connectionLimit: 100,
    host: '167.99.233.46',
    user: 'root',
    password: 'AER0DEV1',
    database: 'TESTDB'
})




// connection

/* -- DATABASE CONFIGURATION -- */


//log to console
app.use(morgan('dev'));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-type, Accept");
    next();
})

app.use(express.static('public'));

/* -- ROUTES -- */
app.get('/', function (req, res) {
  res.send(success);
  // pool.getConnection((err, conn) => {
  //     if(err){
  //         console.log('an error occurred..: %d', err);
  //     } else {
  //         let sql = 'SELECT * FROM LOG_USER';
  //         let query = conn.query(sql, (err, results) => {
  //             if(!err){
  //                 res.send(results);
  //             }
  //             conn.release();
  //         });
  //     }
  // })
});
/* -- LOGIN --*/
app.post('/login', (req, res) => {
    pool2.getConnection((err, conn) => {
        if(err) res.send(err);
        console.log(req.body);
        let password  = SHA512(req.body.password);
        let sql = `SELECT * FROM USER WHERE EMAIL = '${req.body.email}'`;
        let query = conn.query(sql, (err, result) => {
            if(!err){
                res.send({
                    'status': 200,
                    'data': result
                });
            } else {
                res.send({
                    'status': 400,
                    'error': {
                        'err': err,
                        'message': 'User does not exist'
                    }
                });
            }
            conn.release();

        })
    })
})
// app.post('/login/update', (req, res) => {
//     pool.getConnection((err, conn) => {
//
//     })
// })

/* -- LOGIN --*/

/* -- LOG -- */
app.post('/log/login-attempt', (req, res) => {
    pool2.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = `INSERT INTO LOG_LOGIN_ATTEMPT (EMAIL, IP, STATUS) VALUES ('${req.body.email}', '${req.body.ip}','${req.body.status}')`;
            let query = conn.query(sql, (err, results) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(results);
                }
                conn.release();
            })
        }
    })
})
app.post('/log/login', (req, res) => {
    pool2.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = `INSERT INTO LOG_LOGIN (USERID, IP) VALUES ('${req.body._id}', '${req.body.ip}')`;
            let query = conn.query(sql, (err, results) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(results);
                }
                conn.release();
            })
        }
    })
})
app.post('/log/last/login', (req, res) => {
    pool2.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = `UPDATE USER SET LASTLOGIN = '${req.body.time}' WHERE USERID = '${req.body._id}'`;
            let query = conn.query(sql, (err, results) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(results);
                }
                conn.release();
            })
        }
    })
})
app.post('/log/user/add', (req, res) => {
    pool2.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
          let e_alerts = req.body.e_alerts ? 1 : 0;
          let t_alerts = req.body.t_alerts ? 1 : 0;
          let l_alerts = req.body.l_alerts ? 1 : 0;
          let s_alerts = req.body.s_alerts ? 1 : 0;
            let sql = `INSERT INTO LOG_USER (USERID, EMAIL, PHONE, EMAILSTATE, PHONESTATE, LOCATIONSTATE, SYSTEMSTATE, LEVEL, MODIFIED_BY, FIRST_NAME, LAST_NAME, ACTION)
             VALUES (
                 '${req.body._id}',
                 '${req.body.email}',
                 '${req.body.phone}',
                 ${e_alerts},
                 ${t_alerts},
                 ${l_alerts},
                 ${s_alerts},
                 ${req.body.role},
                 '${req.body.created_by}',
                  '${req.body.first}',
                  '${req.body.last}',
                  'Add')`;

            let query = conn.query(sql, (err, results) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(results);
                }
                conn.release();
            })
        }
    })
})
app.post('/log/user/edit', (req, res) => {
    pool2.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
          let e_alerts = req.body.e_alerts ? 1 : 0;
          let t_alerts = req.body.t_alerts ? 1 : 0;
          let l_alerts = req.body.l_alerts ? 1 : 0;
          let s_alerts = req.body.s_alerts ? 1 : 0;
            let sql = `INSERT INTO LOG_USER (USERID, EMAIL, PHONE, EMAILSTATE, PHONESTATE, LOCATIONSTATE, SYSTEMSTATE, LEVEL, MODIFIED_BY, FIRST_NAME, LAST_NAME, ACTION)
             VALUES (
                 '${req.body._id}',
                 '${req.body.email}',
                 '${req.body.phone}',
                 ${e_alerts},
                 ${t_alerts},
                 ${l_alerts},
                 ${s_alerts},
                 ${req.body.role},
                  '${req.body.modified_by}',
                  '${req.body.first}',
                  '${req.body.last}',
                'Edited by Admin')`;
                  console.log(sql);

            let query = conn.query(sql, (err, results) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(results);
                }
                conn.release();
            })
        }
    })
})

app.post('/log/user/user', (req, res) => {
    pool2.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let e_alerts = req.body.e_alerts ? 1 : 0;
            let t_alerts = req.body.t_alerts ? 1 : 0;
            let l_alerts = req.body.l_alerts ? 1 : 0;
            let s_alerts = req.body.s_alerts ? 1 : 0;
            let sql = `INSERT INTO LOG_USER (USERID, EMAILSTATE, PHONESTATE, LOCATIONSTATE, SYSTEMSTATE, MODIFIED_BY, FIRST_NAME, LAST_NAME, ACTION)
             VALUES (
                 '${req.body.modified_by}',
                 ${e_alerts},
                 ${t_alerts},
                 ${l_alerts},
                 ${s_alerts},
                  '${req.body.modified_by}',
                  '${req.body.first}',
                  '${req.body.last}',
                  'Edited by User')`;
            let query = conn.query(sql, (err, results) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(results);
                }
                conn.release();
            })
        }
    })
})

app.get('/log/password/:id', (req, res) => {
    pool2.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = `INSERT INTO LOG_CHANGE_PASSWORD (USERID) VALUES ('${req.params.id}')`;
            let query = conn.query(sql, (err, results) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(results);
                }
                conn.release();
            })
        }

    })
})
app.post('/log/sensor', (req, res) => {
    pool2.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = `INSERT INTO LOG_SENSOR (USERID, NODE_NAME, LOCATION, ACTION) VALUES ('${req.body._id}', '${req.body.sensor_id}', '${req.body.location}', '${req.body.action}')`;
            let query = conn.query(sql, (err, results) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(results);
                }
                conn.release();
            })
        }

    })
})
app.post('/log/sensor/action', (req, res) => {
    pool2.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = `INSERT INTO LOG_SENSOR (USERID, NODE_NAME, ACTION) VALUES ('${req.body._id}', '${req.body.sensor_id}',  '${req.body.action}')`;
            let query = conn.query(sql, (err, results) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(results);
                }
                conn.release();
            })
        }

    })
})

app.post('/log/sensor/edit', (req, res) => {
    pool2.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = `INSERT INTO LOG_SENSOR
(NODE_NAME,
LOCATION,
NAME,
 GAIN,
 TIME_FHSS,
 TIME_VIDEO,
 TRACK_THRES_FHSS,
 NOISE_THRES_FHSS,
 900_THRES_FHSS,
 400_THRES_FHSS,
  REPORT_THRES_24,
  REPORT_THRES_58,
  REPORT_THRES_900,
  BW_THRES_24,
  BW_THRES_58,
  BW_THRES_900,
  SWEEP_START_24,
  SWEEP_STOP_24,
  SWEEP_START_58,
  SWEEP_STOP_58,
  SWEEP_STOP_900,
  SWEEP_START_900,
  SWEEP_STEP,
  USERID,
  ACTION) VALUES ( '${req.body.id}',
  '${req.body.location}',
  '${req.body.name}',
  '${req.body.gain}',
  '${req.body.time_fhss}',
  '${req.body.time_video}',
  '${req.body.track_thres_fhss}',
  '${req.body.noise_thres_fhss}',
  '${req.body.thres_fhss_900}',
  '${req.body.thres_fhss_400}',
  '${req.body.report_thres_24}',
  '${req.body.report_thres_58}',
  '${req.body.report_thres_900}',
                              '${req.body.bw_thres_24}',
                              '${req.body.bw_thres_58}',
                              '${req.body.bw_thres_900}',
                              '${req.body.sweep_start_24}',
                              '${req.body.sweep_stop_24}',
                              '${req.body.sweep_start_58}',
                              '${req.body.sweep_stop_58}',
                              '${req.body.sweep_stop_900}',
                              '${req.body.sweep_start_900}',
                              '${req.body.sweep_step}',
                              '${req.body._id}','Edit')`;
            console.log(sql);
            let query = conn.query(sql, (err, results) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(results);
                }
                conn.release();
            })
        }

    })
})



app.post('/log/whitelist/add', (req, res) => {
    pool2.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = `INSERT INTO LOG_WHITELIST (MAC, NAME, EXPIRATION, ACTION, USERID) VALUES ('${req.body.mac_id}', '${req.body.Description}', '${req.body.expiration}', 'Add', '${req.body._id}')`;
            let query = conn.query(sql, (err, results) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(results);
                }
                conn.release();
            })
        }

    })
})

app.post('/log/whitelist/edit', (req, res) => {
    pool2.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = `INSERT INTO LOG_WHITELIST (MAC, NAME, EXPIRATION, ACTION, USERID) VALUES ('${req.body.mac_id}', '${req.body.Description}', '${req.body.expiration}', 'Edit', '${req.body._id}')`;
            let query = conn.query(sql, (err, results) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(results);
                }
                conn.release();
            })
        }

    })
})

app.post('/log/whitelist/delete', (req, res) => {
    pool2.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = `INSERT INTO LOG_WHITELIST (MAC, ACTION, USERID) VALUES ('${req.body.mac}', 'Delete', '${req.body._id}')`;
            let query = conn.query(sql, (err, results) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(results);
                }
                conn.release();
            })
        }

    })
})

app.post('/log/whitelist/enable', (req, res) => {
    pool2.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = `INSERT INTO LOG_WHITELIST (MAC, ACTION, USERID) VALUES ('${req.body.mac}', 'Enabled', '${req.body._id}')`;
            let query = conn.query(sql, (err, results) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(results);
                }
                conn.release();
            })
        }

    })
})

app.post('/log/whitelist/disable', (req, res) => {
    pool2.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = `INSERT INTO LOG_WHITELIST (MAC, ACTION, USERID) VALUES ('${req.body.mac}', 'Disabled', '${req.body._id}')`;
            let query = conn.query(sql, (err, results) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(results);
                }
                conn.release();
            })
        }

    })
})

app.post('/log/download', (req, res) => {
    pool2.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = `INSERT INTO LOG_DOWNLOAD (FILENAME, USERID) VALUES ('${req.body.name}', '${req.body._id}')`;
            let query = conn.query(sql, (err, results) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(results);
                }
                conn.release();
            })
        }

    })
})
/* -- LOG -- */

/* -- USER ROUTES -- */
app.get('/users/role/:level', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = `SELECT NAME FROM ROLE WHERE LEVEL = ${req.params.level}`;
            let query = conn.query(sql, (err, results) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(results);
                }
                conn.release();
            })
        }
    })
})

app.get('/users', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            console.log('an error occurred..: %d', err);
        } else {
            let sql = `SELECT
USER.USERID, USER.EMAIL, USER.PHONE, USER.EMAILSTATE, USER.PHONESTATE, USER.LOCATIONSTATE, USER.SYSTEMSTATE, USER.ALERTS, USER.LEVEL, USER.STATUS, USER.LASTLOGIN, USER.FIRST_NAME, USER.LAST_NAME, ROLE.ROLE_NAME
FROM USER LEFT JOIN ROLE ON USER.LEVEL = ROLE.LEVEL ORDER BY USER.LAST_NAME`;
            let query = conn.query(sql, (err, results) => {
                if(!err){
                    res.send(results);

                }
                conn.release();
            });

        }
    })
});

app.post('/user/add', (req, res) => {
    console.log(req.body);
    pool.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            console.log('no error');
            let e_alerts = req.body.e_alerts ? 1 : 0;
            let t_alerts = req.body.t_alerts ? 1 : 0;
            let l_alerts = req.body.l_alerts ? 1 : 0;
            let s_alerts = req.body.s_alerts ? 1 : 0;

            let sql =` Insert INTO USER  (USERID, FIRST_NAME, LAST_NAME, EMAIL, PHONE, PASSWORD, EMAILSTATE, PHONESTATE, LOCATIONSTATE, SYSTEMSTATE, LEVEL, CREATED_BY, CREATED_DATE)
                        VALUES(
                            '${req.body._id}',
                            '${req.body.first}',
                            '${req.body.last}',
                            '${req.body.email}',
                            '${req.body.phone}',
                            '${req.body.pass}',
                            ${e_alerts},
                            ${t_alerts},
                            ${l_alerts},
                            ${s_alerts},
                            ${req.body.role},
                            '${req.body.created_by}',
                            '${req.body.created_date}'
                        )
                        `;
                        console.log(sql);
            let query = conn.query(sql, (err, result) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(result);
                }
                conn.release();
            })
        }
    })

})

app.post('/user/edit/:id', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let e_alerts = req.body.e_alerts ? 1 : 0;
            let t_alerts = req.body.t_alerts ? 1 : 0;
            let l_alerts = req.body.l_alerts ? 1 : 0;
            let s_alerts = req.body.s_alerts ? 1 : 0;

            console.log('no error');
            let sql = `UPDATE USER SET
             FIRST_NAME = '${req.body.first}',
             LAST_NAME = '${req.body.last}',
             EMAIL = '${req.body.email}',
             PHONE = '${req.body.phone}',
             EMAILSTATE = '${e_alerts}',
             PHONESTATE = '${t_alerts}',
             LOCATIONSTATE = '${l_alerts}',
             SYSTEMSTATE = '${s_alerts}',
             LEVEL = '${req.body.role}',
             MODIFIED_BY = '${req.body.modified_by}',
             MODIFIED_DATE = '${req.body.mod_date}'
             WHERE USERID = '${req.params.id}'`;
            let query = conn.query(sql, (err, result) => {
                if(!err){
                    res.send(result);
                } else {
                    res.send(err);
                }
                conn.release();
            })
        }
    })
})

app.get('/user/:id', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            console.log('an error occurred...: %d', err);
        } else {
            console.log('no error');
            let sql = `SELECT * from USER WHERE USERID = '${req.params.id}'`;
            let query = conn.query(sql, (err, result) => {
                if(!err){
                    res.send(result);
                } else {
                    res.send(err);
                }
                conn.release();
            })
        }
    })
})
app.post('/user/password', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            console.log(req._body);
            let sql = `UPDATE USER SET PASSWORD = '${req.body.password}', MODIFIED_BY = '${req.body.id}', MODIFIED_DATE = '${req.body.date}' WHERE USERID = '${req.body.id}' `;
            let query = conn.query(sql, (err, result) => {
                if(err){
                    res.send(err);
                } else {
                    res.send();
                }
            })
        }
    })
})
/* -- USER ROUTES -- */

/* -- REPORTS ROUTES -- */

app.get('/reports/update/summary', (req, res) =>{
      pool.getConnection((err, conn) => {
          if(err){
              res.send(err);
          } else {
              let sql = 'SELECT DEPLOYMENT_NAME, INCIDENT_NUM, DEVICE_ID, FIRST_HEARD, LAST_HEARD, START_LAT, START_LON, START_QUAD, END_LAT, END_LON, END_QUAD, DURATION FROM INCIDENT_SUMMARY WHERE COMPLETE = 1 ORDER BY INCIDENT_NUM DESC';
              let query = conn.query(sql, (err, results) => {
                  if(!err){
                      res.send(results);

                  }
                  conn.release();
              });

          }
      })
});

app.get('/reports/update/refresh/:first/:last', (req, res) =>{
      pool.getConnection((err, conn) => {
          if(err){
              res.send(err);
          } else {
              let sql = `SELECT DEPLOYMENT_NAME, INCIDENT_NUM, DEVICE_ID, FIRST_HEARD, LAST_HEARD, START_LAT, START_LON, START_QUAD, END_LAT, END_LON, END_QUAD, DURATION FROM INCIDENT_SUMMARY WHERE FIRST_HEARD >='${req.params.first}' AND LAST_HEARD <='${req.params.last}' AND COMPLETE = 1 ORDER BY INCIDENT_NUM DESC`;
              let query = conn.query(sql, (err, results) => {
                  if(!err){
                      res.send(results);

                  } else {
                      res.send(err);
                  }
                  conn.release();
              });

          }
      })
});


app.get('/reports/log/:id/:first/:last', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            console.log(req.params);
            let sql = `SELECT DEPLOYMENT_NAME, DEVICE_ID, TIME, LAT, LON, QUADRANT FROM INCIDENT_LOG WHERE DEVICE_ID ='${req.params.id}'AND TIME BETWEEN '${req.params.first}' AND '${req.params.last}' `;
            console.log(sql)
            let query = conn.query(sql, (err, results) => {
                if(!err){
                    res.send(results);
                } else {
                    res.send(err);
                }
                conn.release();
            })
        }
    })
})

app.get('/reports/update/deviceStats', (req, res) =>{
      pool.getConnection((err, conn) => {
          if(err){
              res.send(err);
          } else {
              let sql = 'SELECT DEPLOYMENT_NAME, DEVICE_ID, FIRST_HEARD, LAST_HEARD, TOTAL_INCIDENTS, TOTAL_DURATION, LONGEST_DURATION FROM DEVICE_STATS';
              let query = conn.query(sql, (err, results) => {
                  if(!err){
                      res.send(results);
                  }
                  conn.release();
              });

          }
      })
});
app.get('/reports/log', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            console.log('an error occurred...: %d', err);
        } else {
            console.log('no error');
            let sql = `SELECT * from INCIDENT_LOG`;
            let query = conn.query(sql, (err, result) => {
                if(!err){
                    console.log('no error');

                    res.send(result);
                } else {
                    res.send(err);
                }
                conn.release();
            })
        }
    })
})
app.get('/deployment', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = `SELECT * FROM DEPLOYMENT`;
            let query = conn.query(sql, (err, results) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(results);
                }
                conn.release();
            })
        }
    })
})
/* -- REPORTS ROUTES -- */


/* -- DETECTION ROUTES -- */
app.get('/reference', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = `SELECT REFERENCE_NAME, LOCATION FROM REFERENCE_POINT`;
            let query = conn.query(sql, (err, results) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(results);
                }
                conn.release();
            })
        }
    })
})
app.get('/confirmed', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            console.log('an error occurred..: %d', err);
        } else {
            let sql = 'SELECT * FROM CONFIRMED';
            let query = conn.query(sql, (err, results) => {
                if(!err){
                    res.send(results);

                }
                conn.release();
            });

        }
    })
});
app.get('/detect', (req, res) => {
    pool2.getConnection((err, conn) => {
        if (err){
            res.send(err);
        } else {
            let sql = 'SELECT DISTINCT(DEVICE_ID) FROM INCIDENT_MAP';
            let query = conn.query(sql, (err, results) => {
                if(err){
                    res.send(err);
                } else {
                    // res.sseSetup();
                    // res.sseSend(results);
                    res.send(results);
                }
                conn.release();
            })
        }
    })
})
app.get('/start-point/:id', (req, res) => {
  pool2.getConnection((err, conn) => {
    if(err){
        res.send(err);
    } else {
      let sql = `SELECT LAT,LON FROM MAP_START WHERE DEVICE_ID = '${req.params.id}'`;
      let query = conn.query(sql, (err, results) => {
        if(err){
          res.send(err);
        } else {
          res.send(results);
        }
        conn.release();
      })
    }
  })
})
app.post('/start-point/add', (req, res) => {
  pool2.getConnection((err, conn) => {
    if(err){
        res.send(err);
    } else {
      let sql = `INSERT INTO MAP_START (DEVICE_ID, LAT, LON) VALUES ('${req.body.id}', ${req.body.lat}, ${req.body.lon})`;
      let query = conn.query(sql, (err, results) => {
        if(err){
          res.send(err);
        } else {
          res.send(results);
        }
        conn.release();
      })
    }
  })
})
app.get('/start-point/delete/:id', (req, res) => {
  pool2.getConnection((err, conn) => {
    if(err){
        res.send(err);
    } else {
      let sql = `DELETE FROM MAP_START WHERE DEVICE_ID = '${req.params.id}'`;
      let query = conn.query(sql, (err, results) => {
        if(err){
          res.send(err);
        } else {
          res.send(results);
        }
        conn.release();
      })
    }
  })
})



app.get('/initial/:id', (req, res) => {
    pool2.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = `SELECT LAT,LON FROM INCIDENT_MAP WHERE DEVICE_ID = '${req.params.id}' ORDER BY TIME LIMIT 1`;
            let query = conn.query(sql, (err, result) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(result);
                }
                conn.release();
            })
        }
    })

})

app.get('/track/:id', (req, res) => {
    pool2.getConnection((err, conn) => {
        if(err) {
            res.send(err);
        } else {
            let sql = `SELECT * FROM INCIDENT_MAP WHERE DEVICE_ID = '${req.params.id}' ORDER BY TIME DESC LIMIT 20`;
            let query = conn.query(sql, (err, results) => {
                if(err){
                    res.send(err);

                } else {
                    res.send(results);

                }
                conn.release();
            })
        }
    })
})
app.get('/potential', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            console.log('an error occurred..: %d', err);
        } else {
            let sql = 'SELECT * FROM THREAT';
            let query = conn.query(sql, (err, results) => {
                if(!err){
                    res.send(results);

                }
                conn.release();
            });

        }
    })
});

app.get('/sensors', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            console.log('an error occurred..: %d', err);
        } else {
            let sql = 'SELECT * FROM SDR INNER JOIN SENSOR_INFO ON SDR.NODE_NAME = SENSOR_INFO.NODE_NAME';
            let query = conn.query(sql, (err, results) => {
                if(!err){
                    res.send(results);

                }
                conn.release();
            });

        }
    })
});
app.get('/sensor', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = 'SELECT * FROM SDR';
            let query = conn.query(sql, (err, results) => {
                if(!err){
                    res.send(results);
                }
                conn.release();
            })
        }

    })
})
app.get('/section', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = 'SELECT * FROM SECTION';
            let query = conn.query(sql, (err, results) => {
                if(!err){
                    res.send(results);
                }
                conn.release();
            })
        }

    })
})

app.get('/points', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = `
       SELECT * FROM POINT INNER JOIN ( SECTION ) WHERE SECTION.SECTION_ID = POINT.SECTION_ID ORDER BY POINT_SEQUENCE ASC`;
            let query = conn.query(sql, (err, results) => {
                if(!err){
                    res.send(results);
                } else {
                    res.send(err);
                }
                conn.release();
            })
        }
    })
})

app.get('/detection/time', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = `SELECT CLEANCURRENT FROM SERVICE `;
            let query = conn.query(sql, (err, result) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(result);
                }
                conn.release();
            })
        }
    })
})

app.get('/detection/center', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = `SELECT LOCATION FROM DEPLOYMENT`;
            let query = conn.query(sql, (err, result) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(result);
                }
                conn.release();
            })
        }
    })
})

/* -- DETECTION ROUTES -- */

/* -- ADMIN -- */
app.get('/roles/:id', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = `SELECT LEVEL, ROLE_NAME FROM ROLE WHERE LEVEL >= ${req.params.id}`;
            let query = conn.query(sql, (err, results) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(results);
                }
                conn.release();
            })
        }
    })
})
app.get('/whitelist', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = 'SELECT * FROM WHITELIST';
            let query = conn.query(sql, (err, results) => {
                if(!err){
                    res.send(results);
                }
                conn.release();
            })
        }

    })
})
app.get('/whitelist/check/:id', (req, res) => {
    pool2.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = `SELECT * FROM BLACKLIST WHERE MAC = '${req.params.id}'`;
            let query = conn.query(sql, (err, results) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(results);
                }
            })
        }
    })
})
app.get('/whitelist/off/:id', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = `INSERT INTO BLACKLIST (MAC) VALUES ('${req.params.id}')`;
            let query = conn.query(sql, (err, results) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(results);
                }
                conn.release();
            })
        }
    })
})
app.get('/whitelist/on/:id', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = `DELETE FROM BLACKLIST WHERE MAC = '${req.params.id}'`;
            let query = conn.query(sql, (err, result) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(result);
                }
                conn.release();
            })
        }
    })
})
app.post('/whitelist/add', (req, res) => {
    pool2.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            console.log(req.body);
            let sql = `INSERT INTO WHITELIST (MAC, NAME, EXPIRATION) VALUES ('${req.body.mac_id}','${req.body.Description}', '${req.body.expiration}')`;
            let query = conn.query(sql, (err, result) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(result);
                }
                conn.release();
            })
        }
    })
})
app.post('/whitelist/edit', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = `UPDATE WHITELIST SET
             NAME = '${req.body.Description}',
             EXPIRATION = '${req.body.expiration}'
             WHERE MAC = '${req.body.mac_id}'`;
             console.log(sql);
             let query = conn.query(sql, (err, result) => {
                 if(err){
                     res.send(err);
                 } else {
                     res.send(result)
                 }
                 conn.release();
             })
        }
    })
})
app.get('/whitelist/delete/:id', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = `DELETE FROM WHITELIST WHERE MAC = '${req.params.id}'`;
            let query = conn.query(sql, (err, result) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(result);
                }
                conn.release();
            })
        }
    })
})
app.get('/blacklist/delete/:id', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = `DELETE FROM BLACKLIST WHERE MAC = '${req.params.id}'`;
            let query = conn.query(sql, (err, result) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(result);
                }
                conn.release();
            })
        }
    })
})

app.get('/global', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = 'SELECT * FROM SERVICE';
            let query = conn.query(sql, (err, results) => {
                if(!err){
                    res.send(results);
                }
                conn.release();
            })
        }

    })
})
app.get('/global/reset', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
        res.send(err);
    } else {
        let sql =`UPDATE SERVICE SET
         CLEANCONFIRMED = 20,
          CLEANTHREAT = 20,
           UPDATESTATUS = 60,
            CLEANCURRENT = 20,
             CLEANNODES = 50,
              CHECKHB = 360,
               TIMEFH = 600,
                TIMEWF = 600,
                 TIMESLEEP = 1,
                  LENGTHFILTERFHSS = 300,
                   LENGTHFILTERVIDEO = 60,
                    NUMBERDETECTFHSS = 1,
                     NUMBERDETECTVIDEO = 2,
                      TAGALERT = 5,
                       TAGTRACK = 2,
                        TIMEALERT = 15,
                         TIMETRACK = 120,
                          UPDATEDIST  = 100 WHERE RULE_NUM IN (0,1,2);`;
            let query = conn.query(sql, (err, result) => {
                if(!err){
                    res.send({
                        code: 200,
                        message: 'successful reset'
                    })
                } else {
                    res.send(err);
                }
            })

    }
    })
})
app.post('/global/set', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = `UPDATE SERVICE SET
            CLEANCONFIRMED = '${req.body.confirmed}',
            CLEANTHREAT = '${req.body.threat}',
            UPDATESTATUS = '${req.body.status}',
            CLEANCURRENT = '${req.body.current}',
            CLEANNODES = '${req.body.nodes}',
            CHECKHB = '${req.body.checkHb}',
            TIMEFH = '${req.body.timeFh}',
            TIMEWF = '${req.body.timeWf}',
            TIMESLEEP = '${req.body.time_sleep}',
            LENGTHFILTERFHSS = '${req.body.lengthFilter_fhss}',
            LENGTHFILTERVIDEO = '${req.body.lengthFilter_video}',
            NUMBERDETECTFHSS = '${req.body.numberDetect_FHSS}',
            NUMBERDETECTVIDEO = '${req.body.numberDetect_video}',
            TAGALERT = '${req.body.tag_alert}',
            TAGTRACK = '${req.body.tag_track}',
            TIMEALERT = '${req.body.time_alert}',
            TIMETRACK = '${req.body.time_track}',
            UPDATEDIST  = '${req.body.update_dist}'
            WHERE RULE_NUM IN (0,1,2);`;
            let query = conn.query(sql, (err, result) => {
                if(!err){
                    res.send(result);
                }
                conn.release();
            })
        }
    })
})


app.get('/location/nodes', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = 'SELECT * FROM NODES';
            let query = conn.query(sql, (err, results) => {
                if(!err){
                    res.send(results);
                }
                conn.release();
            })
        }

    })
})
app.get('/location/headers', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = "SELECT `COLUMN_NAME` FROM `INFORMATION_SCHEMA`.`COLUMNS` WHERE `TABLE_SCHEMA`='TESTDB' AND `TABLE_NAME`='NODES'";
            let query = conn.query(sql, (err, results) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(results);
                }
                conn.release();
            })

        }
    })
})

app.post('/sensor/start', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = `UPDATE SDR SET CONTROL = 1 WHERE NODE_NAME = '${req.body.id}'`;
            let query = conn.query(sql, (err, result) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(result);
                }
                conn.release();
            })
        }
    })
})
app.post('/sensor/stop', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = `UPDATE SDR SET CONTROL = 0 WHERE NODE_NAME = '${req.body.id}'`;
            let query = conn.query(sql, (err, result) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(result);
                }
                conn.release();
            })
        }
    })
})
app.get('/sensor/check/:id', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = `SELECT * FROM SDR WHERE NODE_NAME = '${req.params.id}' `;
            let query = conn.query(sql, (err, result) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(result);
                }
                conn.release();
            })
        }
    })
})
app.get('/sensor/:id', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = `SELECT * FROM SDR WHERE NODE_NAME = '${req.params.id}'`;
            let query = conn.query(sql, (err, result) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(result);
                }
                conn.release();
            })
        }
    })
})
app.post('/sensor/add', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            console.log(req.body);
            let sql = `INSERT INTO SDR (NODE_NAME, LOCATION, NAME) VALUES ('${req.body.id}', '${req.body.location}', '${req.body.name}')`;
            let query = conn.query(sql, (err, result) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(result);
                }
                conn.release();
            })
        }
    })
})
app.post('/sensor/update-info', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = `INSERT INTO SENSOR_INFO (NODE_NAME) VALUES ('${req.body.id}')`;
            let query = conn.query(sql, (err, result) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(result);
                }
                conn.release();
            })
        }
    })
})
app.get('/sensor/info/delete/:id', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = `DELETE FROM SENSOR_INFO WHERE NODE_NAME = '${req.params.id}' `;
            let query = conn.query(sql, (err, result) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(result);
                }
                conn.release();
            })
        }
    })
})

app.get('/sensor/update-node-power/:id', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = `ALTER TABLE NODES ADD COLUMN ${req.params.id}_POWER FLOAT(5,3)`;
            let query = conn.query(sql, (err, result) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(result);
                }
                conn.release();
            })
        }
    })
})
app.get('/sensor/update-node-time/:id', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = `ALTER TABLE NODES ADD COLUMN ${req.params.id}_TIME VARCHAR(255)`;
            let query = conn.query(sql, (err, result) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(result);
                }
                conn.release();
            })
        }
    })
})
app.get('/sensor/delete-node-power/:id', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = `ALTER TABLE NODES DROP COLUMN ${req.params.id}_POWER `;
            let query = conn.query(sql, (err, result) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(result);
                }
                conn.release();
            })
        }
    })
})
app.get('/sensor/delete-node-time/:id', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = `ALTER TABLE NODES DROP COLUMN ${req.params.id}_TIME `;
            let query = conn.query(sql, (err, result) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(result);
                }
                conn.release();
            })
        }
    })
})

app.post('/sensor/edit', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            console.log(req.body);
            let sql = `UPDATE SDR SET
                            NAME = '${req.body.name}',
                            GAIN = '${req.body.gain}',
                            TIME_FHSS = '${req.body.time_fhss}',
                            TIME_VIDEO = '${req.body.time_video}',
                            TRACK_THRES_FHSS = '${req.body.track_thres_fhss}',
                            NOISE_THRES_FHSS = '${req.body.noise_thres_fhss}',
                            900_THRES_FHSS = '${req.body.thres_fhss_900}',
                            400_THRES_FHSS = '${req.body.thres_fhss_400}',
                            REPORT_THRES_24 = '${req.body.report_thres_24}',
                            REPORT_THRES_58 = '${req.body.report_thres_58}',
                            REPORT_THRES_900 = '${req.body.report_thres_900}',
                            BW_THRES_24 = '${req.body.bw_thres_24}',
                            BW_THRES_58 = '${req.body.bw_thres_58}',
                            BW_THRES_900 = '${req.body.bw_thres_900}',
                            SWEEP_START_24 = '${req.body.sweep_start_24}',
                            SWEEP_STOP_24 = '${req.body.sweep_stop_24}',
                            SWEEP_START_58 = '${req.body.sweep_start_58}',
                            SWEEP_STOP_58 = '${req.body.sweep_stop_58}',
                            SWEEP_STOP_900 = '${req.body.sweep_stop_900}',
                            SWEEP_START_900 = '${req.body.sweep_start_900}',
                            SWEEP_STEP = '${req.body.sweep_step}',
                            LOCATION = '${req.body.location}'
                            WHERE NODE_NAME = '${req.body.id}'

                `;
            let query = conn.query(sql, (err, result) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(result);
                }
                conn.release();
            })
        }
    })
})
// app.get('/sensor/check/:id', (req, res) => {
//   pool.getConnection((err, conn) => {
//     if(err){
//       res.send(err);
//     } else {
//       let sql = `SELECT * FROM SDR WHERE NODE_NAME = '${req.params.id}'`;
//       let query = conn.query(sql, (err, results) => {
//         if(err){
//           res.send(err);
//         } else {
//           res.send(results);
//         }
//         conn.release();
//       })
//     }
//   })
// })
app.get('/sensor/reset/:id', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = `UPDATE SDR SET
                            GAIN = 76,
                            TIME_FHSS = 2,
                            TIME_VIDEO = 0.5,
                            TRACK_THRES_FHSS = 1,
                            NOISE_THRES_FHSS = 11,
                            900_THRES_FHSS = 4,
                            400_THRES_FHSS = 0,
                            REPORT_THRES_24 = 60,
                            REPORT_THRES_58 = 60,
                            REPORT_THRES_900 = 60,
                            BW_THRES_24 = 150,
                            BW_THRES_58 = 150,
                            BW_THRES_900 = 150,
                            SWEEP_START_24 = 2402,
                            SWEEP_STOP_24 = 2487,
                            SWEEP_START_58 = 5735,
                            SWEEP_STOP_58 = 5835,
                            SWEEP_STOP_900 = 900,
                            SWEEP_START_900 = 930,
                            SWEEP_STEP = 5
                            WHERE NODE_NAME = '${req.params.id}'`;
            let query = conn.query(sql, (err, result) => {
                                if(err){
                                    res.send(err);
                                } else {
                                    res.send(result);
                                }
                                conn.release();
                            })
                        }
    })
})

app.post('/sensor/delete', (req, res) => {
    pool.getConnection((err, conn) => {
        if(err){
            res.send(err);
        } else {
            let sql = `DELETE FROM SDR WHERE NODE_NAME = '${req.body.id}'`;
            let query = conn.query(sql, (err, result) => {
                if(err){
                    res.send(err);
                } else {
                    res.send(result);
                }
                conn.release();
            })
        }
    })
})
app.get('/control/single', (req, res) => {
  pool2.getConnection((err, conn) => {
    if(err){
      res.send(err);
    } else {
      let sql = `UPDATE SERVICE SET RULE = 'single', RULE_NUM = '0'`;
      let query = conn.query(sql, (err, result) => {
          if(err){
              res.send(err);
          } else {
              res.send(result);
          }
          conn.release();
      })
    }
  })
})
app.get('/control/multiple', (req, res) => {
  pool2.getConnection((err, conn) => {
    if(err){
      res.send(err);
    } else {
      let sql = `UPDATE SERVICE SET RULE = 'multiple', RULE_NUM = '1'`;
      let query = conn.query(sql, (err, result) => {
          if(err){
              res.send(err);
          } else {
              res.send(result);
          }
          conn.release();
      })
    }
  })
})
app.get('/control/stop', (req, res) => {
  pool2.getConnection((err, conn) => {
    if(err){
      res.send(err);
    } else {
      let sql = `UPDATE SERVICE SET CONTROL = '0'`;
      let query = conn.query(sql, (err, result) => {
          if(err){
              res.send(err);
          } else {
              res.send(result);
          }
          conn.release();
      })
    }
  })
})
app.get('/control/start', (req, res) => {
  pool2.getConnection((err, conn) => {
    if(err){
      res.send(err);
    } else {
      let sql = `UPDATE SERVICE SET CONTROL = '1'`;
      let query = conn.query(sql, (err, result) => {
          if(err){
              res.send(err);
          } else {
              res.send(result);
          }
          conn.release();
      })
    }
  })
})
app.get('/control/check', (req, res) => {
  pool2.getConnection((err, conn) => {
    if(err){
      res.send(err);
    } else {
      let sql = `SELECT * FROM SERVICE`;
      let query = conn.query(sql, (err, result) => {
          if(err){
              res.send(err);
          } else {
              res.send(result);
          }
          conn.release();
      })
    }
  })
})


/* -- ADMIN -- */
/* -- ROUTES -- */
const httpsServer = https.createServer(cred, app).listen(PORT, (data) => {
    console.log("running on port %d...", PORT);

});

/*
*  Secure Hash Algorithm (SHA512)
*  http://www.happycode.info/
*/

function SHA512(str) {
  function int64(msint_32, lsint_32) {
    this.highOrder = msint_32;
    this.lowOrder = lsint_32;
  }

  var H = [new int64(0x6a09e667, 0xf3bcc908), new int64(0xbb67ae85, 0x84caa73b),
      new int64(0x3c6ef372, 0xfe94f82b), new int64(0xa54ff53a, 0x5f1d36f1),
      new int64(0x510e527f, 0xade682d1), new int64(0x9b05688c, 0x2b3e6c1f),
      new int64(0x1f83d9ab, 0xfb41bd6b), new int64(0x5be0cd19, 0x137e2179)];

  var K = [new int64(0x428a2f98, 0xd728ae22), new int64(0x71374491, 0x23ef65cd),
      new int64(0xb5c0fbcf, 0xec4d3b2f), new int64(0xe9b5dba5, 0x8189dbbc),
      new int64(0x3956c25b, 0xf348b538), new int64(0x59f111f1, 0xb605d019),
      new int64(0x923f82a4, 0xaf194f9b), new int64(0xab1c5ed5, 0xda6d8118),
      new int64(0xd807aa98, 0xa3030242), new int64(0x12835b01, 0x45706fbe),
      new int64(0x243185be, 0x4ee4b28c), new int64(0x550c7dc3, 0xd5ffb4e2),
      new int64(0x72be5d74, 0xf27b896f), new int64(0x80deb1fe, 0x3b1696b1),
      new int64(0x9bdc06a7, 0x25c71235), new int64(0xc19bf174, 0xcf692694),
      new int64(0xe49b69c1, 0x9ef14ad2), new int64(0xefbe4786, 0x384f25e3),
      new int64(0x0fc19dc6, 0x8b8cd5b5), new int64(0x240ca1cc, 0x77ac9c65),
      new int64(0x2de92c6f, 0x592b0275), new int64(0x4a7484aa, 0x6ea6e483),
      new int64(0x5cb0a9dc, 0xbd41fbd4), new int64(0x76f988da, 0x831153b5),
      new int64(0x983e5152, 0xee66dfab), new int64(0xa831c66d, 0x2db43210),
      new int64(0xb00327c8, 0x98fb213f), new int64(0xbf597fc7, 0xbeef0ee4),
      new int64(0xc6e00bf3, 0x3da88fc2), new int64(0xd5a79147, 0x930aa725),
      new int64(0x06ca6351, 0xe003826f), new int64(0x14292967, 0x0a0e6e70),
      new int64(0x27b70a85, 0x46d22ffc), new int64(0x2e1b2138, 0x5c26c926),
      new int64(0x4d2c6dfc, 0x5ac42aed), new int64(0x53380d13, 0x9d95b3df),
      new int64(0x650a7354, 0x8baf63de), new int64(0x766a0abb, 0x3c77b2a8),
      new int64(0x81c2c92e, 0x47edaee6), new int64(0x92722c85, 0x1482353b),
      new int64(0xa2bfe8a1, 0x4cf10364), new int64(0xa81a664b, 0xbc423001),
      new int64(0xc24b8b70, 0xd0f89791), new int64(0xc76c51a3, 0x0654be30),
      new int64(0xd192e819, 0xd6ef5218), new int64(0xd6990624, 0x5565a910),
      new int64(0xf40e3585, 0x5771202a), new int64(0x106aa070, 0x32bbd1b8),
      new int64(0x19a4c116, 0xb8d2d0c8), new int64(0x1e376c08, 0x5141ab53),
      new int64(0x2748774c, 0xdf8eeb99), new int64(0x34b0bcb5, 0xe19b48a8),
      new int64(0x391c0cb3, 0xc5c95a63), new int64(0x4ed8aa4a, 0xe3418acb),
      new int64(0x5b9cca4f, 0x7763e373), new int64(0x682e6ff3, 0xd6b2b8a3),
      new int64(0x748f82ee, 0x5defb2fc), new int64(0x78a5636f, 0x43172f60),
      new int64(0x84c87814, 0xa1f0ab72), new int64(0x8cc70208, 0x1a6439ec),
      new int64(0x90befffa, 0x23631e28), new int64(0xa4506ceb, 0xde82bde9),
      new int64(0xbef9a3f7, 0xb2c67915), new int64(0xc67178f2, 0xe372532b),
      new int64(0xca273ece, 0xea26619c), new int64(0xd186b8c7, 0x21c0c207),
      new int64(0xeada7dd6, 0xcde0eb1e), new int64(0xf57d4f7f, 0xee6ed178),
      new int64(0x06f067aa, 0x72176fba), new int64(0x0a637dc5, 0xa2c898a6),
      new int64(0x113f9804, 0xbef90dae), new int64(0x1b710b35, 0x131c471b),
      new int64(0x28db77f5, 0x23047d84), new int64(0x32caab7b, 0x40c72493),
      new int64(0x3c9ebe0a, 0x15c9bebc), new int64(0x431d67c4, 0x9c100d4c),
      new int64(0x4cc5d4be, 0xcb3e42b6), new int64(0x597f299c, 0xfc657e2a),
      new int64(0x5fcb6fab, 0x3ad6faec), new int64(0x6c44198c, 0x4a475817)];

  var W = new Array(64);
  var a, b, c, d, e, f, g, h, i, j;
  var T1, T2;
  var charsize = 8;

  function utf8_encode(str) {
    return unescape(encodeURIComponent(str));
  }

  function str2binb(str) {
    var bin = [];
    var mask = (1 << charsize) - 1;
    var len = str.length * charsize;

    for (var i = 0; i < len; i += charsize) {
      bin[i >> 5] |= (str.charCodeAt(i / charsize) & mask) << (32 - charsize - (i % 32));
    }

    return bin;
  }

  function binb2hex(binarray) {
    var hex_tab = "0123456789abcdef";
    var str = "";
    var length = binarray.length * 4;
    var srcByte;

    for (var i = 0; i < length; i += 1) {
      srcByte = binarray[i >> 2] >> ((3 - (i % 4)) * 8);
      str += hex_tab.charAt((srcByte >> 4) & 0xF) + hex_tab.charAt(srcByte & 0xF);
    }

    return str;
  }

  function safe_add_2(x, y) {
    var lsw, msw, lowOrder, highOrder;

    lsw = (x.lowOrder & 0xFFFF) + (y.lowOrder & 0xFFFF);
    msw = (x.lowOrder >>> 16) + (y.lowOrder >>> 16) + (lsw >>> 16);
    lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

    lsw = (x.highOrder & 0xFFFF) + (y.highOrder & 0xFFFF) + (msw >>> 16);
    msw = (x.highOrder >>> 16) + (y.highOrder >>> 16) + (lsw >>> 16);
    highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

    return new int64(highOrder, lowOrder);
  }

  function safe_add_4(a, b, c, d) {
    var lsw, msw, lowOrder, highOrder;

    lsw = (a.lowOrder & 0xFFFF) + (b.lowOrder & 0xFFFF) + (c.lowOrder & 0xFFFF) + (d.lowOrder & 0xFFFF);
    msw = (a.lowOrder >>> 16) + (b.lowOrder >>> 16) + (c.lowOrder >>> 16) + (d.lowOrder >>> 16) + (lsw >>> 16);
    lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

    lsw = (a.highOrder & 0xFFFF) + (b.highOrder & 0xFFFF) + (c.highOrder & 0xFFFF) + (d.highOrder & 0xFFFF) + (msw >>> 16);
    msw = (a.highOrder >>> 16) + (b.highOrder >>> 16) + (c.highOrder >>> 16) + (d.highOrder >>> 16) + (lsw >>> 16);
    highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

    return new int64(highOrder, lowOrder);
  }

  function safe_add_5(a, b, c, d, e) {
    var lsw, msw, lowOrder, highOrder;

    lsw = (a.lowOrder & 0xFFFF) + (b.lowOrder & 0xFFFF) + (c.lowOrder & 0xFFFF) + (d.lowOrder & 0xFFFF) + (e.lowOrder & 0xFFFF);
    msw = (a.lowOrder >>> 16) + (b.lowOrder >>> 16) + (c.lowOrder >>> 16) + (d.lowOrder >>> 16) + (e.lowOrder >>> 16) + (lsw >>> 16);
    lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

    lsw = (a.highOrder & 0xFFFF) + (b.highOrder & 0xFFFF) + (c.highOrder & 0xFFFF) + (d.highOrder & 0xFFFF) + (e.highOrder & 0xFFFF) + (msw >>> 16);
    msw = (a.highOrder >>> 16) + (b.highOrder >>> 16) + (c.highOrder >>> 16) + (d.highOrder >>> 16) + (e.highOrder >>> 16) + (lsw >>> 16);
    highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

    return new int64(highOrder, lowOrder);
  }

  function maj(x, y, z) {
    return new int64(
      (x.highOrder & y.highOrder) ^ (x.highOrder & z.highOrder) ^ (y.highOrder & z.highOrder),
      (x.lowOrder & y.lowOrder) ^ (x.lowOrder & z.lowOrder) ^ (y.lowOrder & z.lowOrder)
    );
  }

  function ch(x, y, z) {
    return new int64(
      (x.highOrder & y.highOrder) ^ (~x.highOrder & z.highOrder),
      (x.lowOrder & y.lowOrder) ^ (~x.lowOrder & z.lowOrder)
    );
  }

  function rotr(x, n) {
    if (n <= 32) {
      return new int64(
       (x.highOrder >>> n) | (x.lowOrder << (32 - n)),
       (x.lowOrder >>> n) | (x.highOrder << (32 - n))
      );
    } else {
      return new int64(
       (x.lowOrder >>> n) | (x.highOrder << (32 - n)),
       (x.highOrder >>> n) | (x.lowOrder << (32 - n))
      );
    }
  }

  function sigma0(x) {
    var rotr28 = rotr(x, 28);
    var rotr34 = rotr(x, 34);
    var rotr39 = rotr(x, 39);

    return new int64(
      rotr28.highOrder ^ rotr34.highOrder ^ rotr39.highOrder,
      rotr28.lowOrder ^ rotr34.lowOrder ^ rotr39.lowOrder
    );
  }

  function sigma1(x) {
    var rotr14 = rotr(x, 14);
    var rotr18 = rotr(x, 18);
    var rotr41 = rotr(x, 41);

    return new int64(
      rotr14.highOrder ^ rotr18.highOrder ^ rotr41.highOrder,
      rotr14.lowOrder ^ rotr18.lowOrder ^ rotr41.lowOrder
    );
  }

  function gamma0(x) {
    var rotr1 = rotr(x, 1), rotr8 = rotr(x, 8), shr7 = shr(x, 7);

    return new int64(
      rotr1.highOrder ^ rotr8.highOrder ^ shr7.highOrder,
      rotr1.lowOrder ^ rotr8.lowOrder ^ shr7.lowOrder
    );
  }

  function gamma1(x) {
    var rotr19 = rotr(x, 19);
    var rotr61 = rotr(x, 61);
    var shr6 = shr(x, 6);

    return new int64(
      rotr19.highOrder ^ rotr61.highOrder ^ shr6.highOrder,
      rotr19.lowOrder ^ rotr61.lowOrder ^ shr6.lowOrder
    );
  }

  function shr(x, n) {
    if (n <= 32) {
      return new int64(
       x.highOrder >>> n,
       x.lowOrder >>> n | (x.highOrder << (32 - n))
      );
    } else {
      return new int64(
       0,
       x.highOrder << (32 - n)
      );
    }
  }

  str = utf8_encode(str);
  strlen = str.length*charsize;
  str = str2binb(str);

  str[strlen >> 5] |= 0x80 << (24 - strlen % 32);
  str[(((strlen + 128) >> 10) << 5) + 31] = strlen;

  for (var i = 0; i < str.length; i += 32) {
    a = H[0];
    b = H[1];
    c = H[2];
    d = H[3];
    e = H[4];
    f = H[5];
    g = H[6];
    h = H[7];

    for (var j = 0; j < 80; j++) {
      if (j < 16) {
       W[j] = new int64(str[j*2 + i], str[j*2 + i + 1]);
      } else {
       W[j] = safe_add_4(gamma1(W[j - 2]), W[j - 7], gamma0(W[j - 15]), W[j - 16]);
      }

      T1 = safe_add_5(h, sigma1(e), ch(e, f, g), K[j], W[j]);
      T2 = safe_add_2(sigma0(a), maj(a, b, c));
      h = g;
      g = f;
      f = e;
      e = safe_add_2(d, T1);
      d = c;
      c = b;
      b = a;
      a = safe_add_2(T1, T2);
    }

    H[0] = safe_add_2(a, H[0]);
    H[1] = safe_add_2(b, H[1]);
    H[2] = safe_add_2(c, H[2]);
    H[3] = safe_add_2(d, H[3]);
    H[4] = safe_add_2(e, H[4]);
    H[5] = safe_add_2(f, H[5]);
    H[6] = safe_add_2(g, H[6]);
    H[7] = safe_add_2(h, H[7]);
  }

  var binarray = [];
  for (var i = 0; i < H.length; i++) {
    binarray.push(H[i].highOrder);
    binarray.push(H[i].lowOrder);
  }
  return binb2hex(binarray);
}
