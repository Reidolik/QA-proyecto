function add(numbers) {
    var result = 0;
    var parts = numbers.split(',');
    for (var i = 0; i < parts.length; i++) {
        var integer = parseInt(parts[i]);
        if (!isNaN(integer)) {
            if (integer >= 0) {
                if (integer <= 1000) {
                    result += integer;
                }
            }
        }
    }
    
    return result;
}


let a = "start";
let b;

for(let i = 0; i < 5; i++) {
  b += a[i].toUpperCase();
}