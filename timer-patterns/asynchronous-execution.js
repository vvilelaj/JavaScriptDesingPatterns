function getArrayWithData(){
    var arr = new Array(5000000);
    
    for (let index = 0; index < arr.length; index++) {
        arr[index] = Math.random() * 100;
    }

    return arr;
}

function processArray(){
    var str = '';
    
    var arr = getArrayWithData();
    for (let index = 0; index < arr.length; index++) {
        str += arr[index].toString() + ';';        
    }

    console.log(str);
}

processArray();