var request = require('request');
var cheerio = require('cheerio');
var mysql = require('mysql');
require('dotenv').config()
var array = [];
var final_arr = [];

function storeResult(arr){
    var con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT,
        database: process.env.DB_DB
    });

    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        setTimeout(function(){process.exit()},10000)
        process.on('uncaughtException', function (error) {
            console.log(error.stack);
        });
        for (var i in arr){
            var currency = arr[i];
            if (currency.Marketcap == "?"){
                let sqlResult = [currency.Name, parseFloat(currency.Price.slice(1)), parseFloat(currency.ChangePercent.slice(0,-2)), parseInt(currency.Volume.slice(1)), parseFloat(currency.ROI.slice(0,-1)), parseInt(currency.Nodes), parseInt(currency.Required), parseInt(currency.MN_Worth.slice(1))];
                con.query("INSERT INTO MasterNodes (CurrName, Price, ChangePercent, Volume, ROI, Nodes, Required, MN) VALUES (?,?,?,?,?,?,?,?)", sqlResult, function (err, result) {
                    if (err) {
                        console.log(sqlResult)
                    }
                    console.log("1 record inserted");
                });
            } else {
                let sqlResult = [currency.Name, parseFloat(currency.Price.slice(1)), parseFloat(currency.ChangePercent.slice(0,-2)), parseInt(currency.Volume.slice(1)), parseFloat(currency.Marketcap.slice(1)), parseFloat(currency.ROI.slice(0,-1)), parseInt(currency.Nodes), parseInt(currency.Required), parseInt(currency.MN_Worth.slice(1))];
                con.query("INSERT INTO MasterNodes (CurrName, Price, ChangePercent, Volume, Marketcap, ROI, Nodes, Required, MN) VALUES (?,?,?,?,?,?,?,?,?)", sqlResult, function (err, result) {
                    if (err) {
                        console.log(sqlResult)
                    }
                    console.log("1 record inserted");
                });
            }
        }
    });
    return;

}

function parseArray(arr){
    let counter = 0;
    var row_obj = new Object();

    for (var value in arr){
        if (counter != 9){
            if (arr[value] != ""){
                switch(counter){
                    case 0:
                        row_obj.Name = arr[value];
                        break;
                    case 1:
                        row_obj.Price = arr[value];
                        break;
                    case 2:
                        row_obj.ChangePercent = arr[value];
                        break;
                    case 3:
                        row_obj.Volume = arr[value];
                        break;
                    case 4:
                        row_obj.Marketcap = arr[value];
                        break;
                    case 5:
                        row_obj.ROI = arr[value];
                        break;
                    case 6:
                        row_obj.Nodes = arr[value];
                        break;
                    case 7:
                        row_obj.Required = arr[value];
                        break;
                    case 8:
                        row_obj.MN_Worth = arr[value];
                        break;
                    default:
                        break;
                }
                counter++;
            }
        } else {
            counter = 0;
            final_arr.push(row_obj);
            row_obj = new Object();
        }
    }    
    return storeResult(final_arr);
}
request('http://masternodes.online/', function(err, resp, html) {
    if (!err){
        $ = cheerio.load(html);
        $("#masternodes_table").find("td").each(function(i,e){
            let result = $(e).text().trim();
            array.push(result);
        })
    }
    return parseArray(array);
});