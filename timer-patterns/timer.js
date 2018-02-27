// setTimeout functions executes when most outer function ends;

function anotherFunction(){
    var init = new Date();
    var anyFunction = function(){
        var init = new Date();

        setTimeout(() => {
            console.log('2000');
        }, 2000);

        setTimeout(() => {
            console.log('4000');
        }, 4000);

        setTimeout(() => {
            console.log('6000');
        }, 6000);

        var now = new Date();

        while(now-init<5000){
            now = new Date();
        }
    };

    anyFunction();

    var now = new Date();
    while(now-init<5000){
        now = new Date();
    }
}

anotherFunction();