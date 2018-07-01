var request = require('request');
var cheerio = require('cheerio');
var mysql = require('mysql');

var array = [];
var final_arr = [];

function storeResult(arr){
    var con = mysql.createConnection({
        host: "localhost",
        user: "yourusername",
        password: "yourpassword"
    });

    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
    });
}

function parseArray(arr){
    let counter = 0;
    var row_obj = new Object();

    for (var value in arr){
        if (counter != 8){
            if (arr[value] != ""){
                switch(counter){
                    case 0:
                        row_obj.name = arr[value];
                        break;
                    case 1:
                        row_obj.price = arr[value];
                        break;
                    case 2:
                        row_obj.Change = arr[value];
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
}
request('http://masternodes.online/', function(err, resp, html) {
    if (!err){
        $ = cheerio.load(html);
        $("#masternodes_table").find("td").each(function(i,e){
            let result = $(e).text().trim();
            array.push(result);
        })
    }
    parseArray(array);
});