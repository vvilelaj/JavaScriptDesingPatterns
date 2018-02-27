function getArrayWithData(){
    var arr = new Array(5000000);
    
    for (let index = 0; index < arr.length; index++) {
        arr[index] = Math.random() * 100;
    }

    return arr;
}

// function processArray(){
//     var str = '';
    
//     var arr = getArrayWithData();
//     for (let index = 0; index < arr.length; index++) {
//         str += arr[index].toString() + ';';        
//     }

//     console.log(str);
// }

function processArray(){
    var str = '';
    var arr = getArrayWithData();
    var index = 0;

    setTimeout(() => {
        for (let init = new Date();new Date() - init< 10; index++) {
            str += arr[index].toString() + ';'; 
        }
        console.log(str);
        if(index < arr.length){
            setTimeout(() => {
                arguments.callee;
            }, 50);
        }
    }, 50);
}

processArray();