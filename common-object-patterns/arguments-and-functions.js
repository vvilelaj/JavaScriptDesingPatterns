// Las funciones puden ser llamadas con la cantidad de paramtros que se definieron 
// incluso con mas o con meno.

function whatever(p1, p2, p3){
    
    if(arguments.length >3){
        for(var i = 3;i < arguments.length;i++){
            console.log('Parameter ' + i.toString() + ' : ' + arguments[i]);
        }
    }

    return p1 + p2 + p3;
}

// Recibe y usa todos los paramatros
console.log(whatever(0,1,2));

// Recibe dos parametros y el tercero es asignado con undefined
console.log(whatever(0,1));

// Recibe dos parametros y el tercero es asignado con undefined
console.log(whatever(0,1,2,99));