const fs = require('fs/promises');

(async () => {
    const filehandlerRead = await fs.open('data.txt', 'r')
    const filehandlerWrite = await fs.open('dest.txt', 'w')

    const streamRead = filehandlerRead.createReadStream()
    const streamWrite = filehandlerWrite.createWriteStream()

    let split = ''
    streamRead.on('data', (chunk) => {

        const numbers = chunk.toString('utf8').split('  ')
        if (Number(numbers[0]) !== Number(numbers[1]) - 1) {
            if (split) {
                numbers[0] = split.trim() + numbers[0].trim()
            }
        }

        if (Number(numbers[numbers.length - 2] + 1) !== Number(numbers[numbers.length - 1])) {
            split = numbers.pop()
        }

        numbers.forEach((number) => {
            let n = Number(number)
            if (n % 2 === 0) {

                if (!streamWrite.write(' ' + n + ' ')) {
                    streamRead.pause()
                }
            }
        })


    })

    streamWrite.on('drain', () => {
        streamRead.resume()
    })

})()
