const Chalk = require('chalk');
const fs = require('fs');
/// <reference path="./generate_multi_intent.ts" />
/**
 *
 * @param path chamin du dossier contenant les json
 *  Ex
 *  ```
 *  load_data("./data"])
 * ```
 * Used then in @see{@link {[ici]{ generate_multi_intent.generate_multi_intent } } }
 */
export function load_data(path) {
    let list_utt_int = [];
    // Get name of each file of the directory (must contain only json files !)
    fs.readdirSync(path).forEach(file => {
        // Read the file and get the json it contains
        let jsondata = JSON.parse(fs.readFileSync(path + "/" + file, { encoding: 'utf-8' }));
        // For each key of the json
        Object.entries(jsondata).forEach(function ([key, value]) {
            // Remove out of scope datas
            if (!key.includes("oos")) {
                // For each array in dataset
                value.forEach(function (element) {
                    // Remove out of scope data
                    if (element[1] != "in" && element[1] != "oos") {
                        // Put utterance, intent in 
                        list_utt_int.push([element[0], [element[1]]]);
                    }
                });
            }
            ;
        });
    });
    let intents = new Set(list_utt_int.map(sub_array => sub_array[1][0]));
    let intent2number = {};
    let number2intent = {};
    for (let i = 0; i < intents.size; i++) {
        intent2number[intents[i]] = i;
        number2intent[i] = intents[i];
    }
    console.log(Chalk.red(list_utt_int.length), "Couple utterance / intent");
    console.log("ex : ", list_utt_int[Math.floor(Math.random() * list_utt_int.length)]);
    console.log(Chalk.cyan(intents.size), "different intents");
    return [list_utt_int, intents, intent2number, number2intent];
}
//# sourceMappingURL=load_data.js.map