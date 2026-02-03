let tasks = 6;
if(tasks > 5){
    console.log('Ужасно много задач');
} else if(tasks > 0){
    console.log('Есть немного задач');
} else{
    console.log('Задач нет');
}

function sum(a, b){
    return a + b;
}
console.log(sum(10, 5))
console.log(sum(20, 5))

function isTaskDone(status){
    return status === 'выполнена';
}
console.log(isTaskDone('выполнена'))
console.log(isTaskDone('не выполнена'))

function taskSummary(total, done){
    let active = total - done;
    return 'Всего ' + total + ' Выполнено ' + done + ' Активно ' + active;
}

console.log(taskSummary(100, 70))