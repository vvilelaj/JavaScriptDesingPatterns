// chaining functions
// fluent api

function Cliente(){
    this.nommbre = '';
    this.apellido = '';
    this.edad = 0;
}

Cliente.prototype.setNombre = function(nombre){
    var that = this;
    this.nommbre = nombre;
    return that;
}

Cliente.prototype.setApellido = function(apellido){
    var that = this;
    this.apellido = apellido;
    return that;
}

Cliente.prototype.setEdad = function(edad){
    var that = this;
    this.edad = edad;
    return that;
}

Cliente.prototype.toString = function(){
    var that = this;
    console.log(this.nommbre + ' ' + this.apellido + ' ' + this.edad.toString());
    return that;
}

var myCliente = new Cliente()
    .setApellido('Vilela')
    .setNombre('Victor')
    .setEdad(30)
    .toString();