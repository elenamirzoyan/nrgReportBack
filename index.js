const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

var app = express();
var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '51.178.73.39',
        user: 'root',
        port: '3307',
        password: 'zizikibiziki',
        database: 'redmine',
        charset: 'utf8_general_ci',
        pool: {
            min: 0,
            max: 50
        }
    }
});


const cors = require("cors")
const whitelist = ["http://localhost:3000"];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true,
}
app.use(cors(corsOptions));


app.post('/getTasksByProjectsData', function (req, res) {

    var sql = "SELECT p.id,p.parent_id, p.`name`, sum(if(iis.id=1,1,0)) as 'New',  sum(if(iis.id=2,1,0)) as 'In_progress', sum(if(iis.id=3,1,0)) as 'Resolved', sum(if(iis.id=4,1,0)) as 'Feedback',sum(if(iis.id=5,1,0)) as 'Closed',sum(if(iis.id=6,1,0)) as 'Rejected', count(i.id)  as 'All'   " +
        "FROM issues as i " +
        " left join issue_statuses as iis on i.status_id=iis.id " +
        " left join projects as p ON i.project_id=p.id" +
        " WHERE i.project_id NOT IN (61, 62, 63, 64, 65, 66, 71,78,80,83,84,85,86,87,88,89,90,91) AND " +
        "i.created_on BETWEEN '2021-08-15 00:00:00' AND '2022-01-01 00:00:00'" +
        " GROUP BY i.project_id";
    console.log(sql);
    knex.raw(sql)
        .then(function (rows) {

            res.send({
                error: false,
                message: 'success',
                data: rows[0]
            });
        });

});


app.listen(3004);
